// Firestore-first data layer with static fallback.
//
//   getProjects() / getProject(slug)  → Firestore collection "projects"
//   getPosts()    / getPost(slug)     → Firestore collection "blog_posts"
//                                        (falls back to "posts", the collection
//                                         the admin page writes to)
//
// If Firestore is unreachable, times out, denies access or returns no
// documents, the bundled files data/projects.js and data/posts.js are used.
//
// Works in server components (build / ISR) and in client components.
// Firebase is imported lazily inside try/catch, so a missing or invalid
// Firebase config also results in the static fallback instead of a crash.

import { projects as staticProjects } from '../data/projects';
import { posts as staticPosts } from '../data/posts';

const PROJECTS_COLLECTION = 'projects';
// First non-empty collection wins, in this order.
const POSTS_COLLECTIONS = ['blog_posts', 'posts'];

const REQUEST_TIMEOUT_MS = 6000;
const CACHE_TTL_MS = 60 * 1000;

// ───────── helpers ─────────

function withTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Firestore request timed out')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

async function fetchCollection(name) {
  const [{ collection, getDocs }, { db }] = await Promise.all([
    import('firebase/firestore'),
    import('./firebase'),
  ]);
  const snap = await getDocs(collection(db, name));
  return snap.docs.map((d) => d.data());
}

function toDateString(value) {
  if (!value) return '';
  if (typeof value === 'string') return value.slice(0, 10);
  if (typeof value.toDate === 'function') return value.toDate().toISOString().slice(0, 10);
  return '';
}

// Plain, serialisable objects only (no Firestore Timestamps).
function normalizeProject(raw) {
  if (!raw || !raw.slug || !raw.title) return null;
  const year = Number(raw.year);
  return {
    slug: String(raw.slug),
    title: String(raw.title),
    category: raw.category ? String(raw.category) : 'Other',
    year: Number.isFinite(year) ? year : null,
    featured: Boolean(raw.featured),
  };
}

function normalizePost(raw) {
  if (!raw || !raw.slug || !raw.title) return null;
  return {
    slug: String(raw.slug),
    title: String(raw.title),
    date: toDateString(raw.date),
    category: raw.category ? String(raw.category) : 'Other',
    excerpt: raw.excerpt ? String(raw.excerpt) : '',
  };
}

function sortProjects(items) {
  return [...items].sort(
    (a, b) => (b.year || 0) - (a.year || 0) || a.title.localeCompare(b.title)
  );
}

function sortPosts(items) {
  return [...items].sort(
    (a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title)
  );
}

// Small in-memory cache so a page render (or a client session) doesn't
// re-read the same collection repeatedly. Loaders never reject.
const cache = new Map();

function cached(key, loader) {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.promise;
  const promise = loader();
  cache.set(key, { at: Date.now(), promise });
  return promise;
}

// ───────── loaders ─────────

async function loadProjects() {
  try {
    const rows = await withTimeout(fetchCollection(PROJECTS_COLLECTION), REQUEST_TIMEOUT_MS);
    const items = rows.map(normalizeProject).filter(Boolean);
    if (items.length > 0) return sortProjects(items);
  } catch (err) {
    console.warn(`[data] Firestore "${PROJECTS_COLLECTION}" unavailable, using static data:`, err?.message || err);
  }
  return staticProjects;
}

async function loadPosts() {
  const results = await Promise.allSettled(
    POSTS_COLLECTIONS.map((name) => withTimeout(fetchCollection(name), REQUEST_TIMEOUT_MS))
  );

  for (let i = 0; i < results.length; i += 1) {
    const result = results[i];
    if (result.status === 'fulfilled') {
      const items = result.value.map(normalizePost).filter(Boolean);
      if (items.length > 0) return sortPosts(items);
    } else {
      console.warn(
        `[data] Firestore "${POSTS_COLLECTIONS[i]}" unavailable:`,
        result.reason?.message || result.reason
      );
    }
  }
  return staticPosts;
}

// ───────── public API ─────────

export function getProjects() {
  return cached('projects', loadProjects);
}

export function getPosts() {
  return cached('posts', loadPosts);
}

export async function getProject(slug) {
  const items = await getProjects();
  return items.find((p) => p.slug === slug) || null;
}

export async function getPost(slug) {
  const items = await getPosts();
  return items.find((p) => p.slug === slug) || null;
}

// Synchronous access to the bundled data. Client pages use these as their
// initial state so content renders immediately, then swap in Firestore data.
export function getStaticProjects() {
  return staticProjects;
}

export function getStaticPosts() {
  return staticPosts;
}
