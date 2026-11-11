// Behance auto-sync — server-only.
// How it works (verified live 2026-11-11):
// - Behance's official API is dead (dev portal 404, v2 endpoints 403, no key
//   obtainable). The working route is Behance's own public RSS user feed:
//     https://www.behance.net/feeds/user?username=mdayubmondol0
//   (NOT /feeds/projects — that returns the global featured feed and ignores
//   the username parameter.)
// - A browser-like User-Agent header is REQUIRED (bare requests get HTTP 400).
// - The feed carries title, link (gallery ID), a cover image + short
//   description, and pubDate. No categories, tags, stats, or case-study body.
// - Bangla text arrives corrupted as literal "?" — local titles always win.
// - Covers are 404px by default; the /projects/808/ variant is verified.
// - Sync is poll-based (no webhook): new Behance projects appear on the site
//   within ~1 hour via ISR revalidation, with no redeploy and no API key.
// - Local data is the source of truth: on any fetch failure the site renders
//   exactly as before — the build can never break because of Behance.

const FEED_URL = 'https://www.behance.net/feeds/user?username=mdayubmondol0';
const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function isCorrupted(text) {
  // Behance mangles non-ASCII into literal "?" runs.
  return /\?{4,}/.test(text || '');
}

function parseFeed(xml) {
  const items = [];
  for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const block = m[1];
    const get = (tag) => {
      const r = block.match(new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`));
      return r ? r[1] : '';
    };
    const link = get('link');
    const id = (link.match(/\/gallery\/(\d+)/) || [])[1];
    if (!id) continue;
    const descHtml = get('description');
    const img = (descHtml.match(/<img src='([^']+)'/) || [])[1] || '';
    items.push({
      behanceId: id,
      behanceUrl: link,
      title: get('title').trim(),
      description: stripHtml(descHtml),
      // 404px cover -> verified 808px variant
      cover: img.replace('/projects/404/', '/projects/808/'),
      publishedAt: get('pubDate'),
    });
  }
  return items;
}

export async function fetchBehanceProjects() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    let res;
    try {
      res = await fetch(FEED_URL, {
        headers: { 'User-Agent': UA },
        next: { revalidate: 3600 }, // at most one feed fetch per hour
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }
    if (!res.ok) return [];
    const xml = await res.text();
    if (!xml.includes('<rss')) return [];
    return parseFeed(xml);
  } catch {
    return []; // any failure -> caller falls back to local data
  }
}

function slugFromBehanceUrl(url) {
  const slug = (url.match(/\/gallery\/\d+\/(.+)$/) || [])[1] || '';
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function normalizeTitle(title) {
  return (title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\u0980-\u09ff]+/g, ' ')
    .trim();
}

/**
 * Merge the Behance feed over the local project list.
 * - Local projects are the base and are never removed.
 * - Matched by behanceId (or normalised title as fallback): take the live
 *   cover + Behance link from the feed; keep the LOCAL title, category,
 *   year and featured flag (protects Bangla titles and curated categories).
 * - New feed items (not local yet): appended as Behance-only projects.
 * - Feed descriptions are used only when the local one is empty and the
 *   feed text is not Bangla-corrupted.
 */
export function mergeBehanceProjects(localProjects, feedItems) {
  const merged = localProjects.map((p) => ({ ...p }));
  const byId = new Map(merged.filter((p) => p.behanceId).map((p) => [String(p.behanceId), p]));
  const byTitle = new Map(merged.map((p) => [normalizeTitle(p.title), p]));

  for (const f of feedItems || []) {
    const match = byId.get(String(f.behanceId)) || byTitle.get(normalizeTitle(f.title));
    if (match) {
      if (f.cover) match.cover = f.cover;
      match.behanceUrl = f.behanceUrl;
      match.behanceId = f.behanceId;
      if (!match.description && f.description && !isCorrupted(f.description)) {
        match.description = f.description;
      }
      continue;
    }
    // Brand-new Behance project — append (never auto-featured on the homepage).
    merged.push({
      slug: slugFromBehanceUrl(f.behanceUrl) || `behance-${f.behanceId}`,
      title: isCorrupted(f.title) ? 'Untitled Behance Project' : f.title,
      category: 'Behance',
      year: f.publishedAt ? new Date(f.publishedAt).getFullYear() : new Date().getFullYear(),
      featured: false,
      behanceId: f.behanceId,
      behanceUrl: f.behanceUrl,
      cover: f.cover || undefined,
      description: !isCorrupted(f.description) ? f.description : undefined,
      behanceOnly: true,
    });
  }
  return merged;
}
