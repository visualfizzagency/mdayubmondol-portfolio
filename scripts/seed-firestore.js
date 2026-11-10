#!/usr/bin/env node
/*
 * seed-firestore.js — seed Firestore from local JSON files.
 *
 * Writes the "projects" and "blog_posts" collections. Each document ID is the
 * item's slug, so running the script again updates the same documents instead
 * of creating duplicates. Documents that were created in the admin pages
 * (which get random IDs) are NOT touched, so delete those first if you are
 * re-importing the same items, or you will end up with two copies.
 *
 * ─────────────────────────────── USAGE ───────────────────────────────
 *
 *   node scripts/seed-firestore.js --projects projects.json --posts posts.json
 *
 * Options:
 *   --projects <file.json>      JSON array of projects  → collection "projects"
 *   --posts <file.json>         JSON array of posts     → collection "blog_posts"
 *   --posts-collection <name>   write posts to another collection instead
 *                               (e.g. "posts", which the admin posts page uses)
 *   --dry-run                   validate the files and print a summary only;
 *                               nothing is written and no keys are needed
 *   -h, --help                  show this help
 *
 * At least one of --projects / --posts is required.
 *
 * ───────────────────────── ENVIRONMENT VARIABLES ─────────────────────────
 * Nothing secret is stored in this file. Values come from the environment, or
 * from `.env.local` / `.env` in the folder you run the command from:
 *
 *   NEXT_PUBLIC_FIREBASE_API_KEY
 *   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
 *   NEXT_PUBLIC_FIREBASE_PROJECT_ID
 *   NEXT_PUBLIC_FIREBASE_APP_ID
 *   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET        (optional)
 *   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID   (optional)
 *   SEED_ADMIN_EMAIL      email of the admin user created in Firebase Auth
 *   SEED_ADMIN_PASSWORD   that user's password
 *
 * The script signs in as the admin user, because your Firestore rules only
 * allow the admin UID to write. Keep SEED_ADMIN_* in your local .env.local
 * only — do NOT add them to Vercel or commit them.
 *
 * ───────────────────────────── JSON FORMAT ─────────────────────────────
 * projects.json — an array of:
 *   { "slug": "my-project", "title": "My Project", "category": "Branding",
 *     "year": 2025, "featured": true }
 *
 * posts.json — an array of:
 *   { "slug": "my-post", "title": "My Post", "date": "2025-08-03",
 *     "category": "Branding", "excerpt": "…" }
 *   Extra fields (for example "imageUrl" or "content" for the full article
 *   text) are saved as they are.
 *
 * Tip — create the JSON files from the bundled data files:
 *   node --input-type=module -e "import {projects} from './data/projects.js'; console.log(JSON.stringify(projects, null, 2))" > projects.json
 *   node --input-type=module -e "import {posts} from './data/posts.js'; console.log(JSON.stringify(posts, null, 2))" > posts.json
 */

'use strict';

const fs = require('fs');
const path = require('path');

const PROJECTS_COLLECTION = 'projects';
const DEFAULT_POSTS_COLLECTION = 'blog_posts';
const BATCH_SIZE = 400; // Firestore allows up to 500 writes per batch

const SLUG_RE = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// ───────── small helpers ─────────

function fail(message) {
  console.error(`\nError: ${message}\n`);
  process.exit(1);
}

function printHelp() {
  const text = fs.readFileSync(__filename, 'utf8');
  const start = text.indexOf('/*');
  const end = text.indexOf('*/');
  console.log(text.slice(start + 2, end).replace(/^ \* ?/gm, '').trim());
}

function parseArgs(argv) {
  const args = {
    projects: null,
    posts: null,
    postsCollection: DEFAULT_POSTS_COLLECTION,
    dryRun: false,
    help: false,
  };
  const takeValue = (i, flag) => {
    const v = argv[i + 1];
    if (!v || v.startsWith('--')) fail(`${flag} needs a value.`);
    return v;
  };

  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    switch (a) {
      case '--projects':
        args.projects = takeValue(i, a);
        i += 1;
        break;
      case '--posts':
        args.posts = takeValue(i, a);
        i += 1;
        break;
      case '--posts-collection':
        args.postsCollection = takeValue(i, a);
        i += 1;
        break;
      case '--dry-run':
        args.dryRun = true;
        break;
      case '-h':
      case '--help':
        args.help = true;
        break;
      default:
        fail(`Unknown option "${a}". Run with --help to see the usage.`);
    }
  }
  return args;
}

// Minimal .env loader (KEY=VALUE lines). Existing environment variables win.
function loadEnvFile(file) {
  if (!fs.existsSync(file)) return;
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const m = trimmed.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[m[1]] === undefined) process.env[m[1]] = value;
  }
}

function readJsonArray(file) {
  const full = path.resolve(process.cwd(), file);
  if (!fs.existsSync(full)) fail(`File not found: ${file}`);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(full, 'utf8'));
  } catch (err) {
    fail(`${file} is not valid JSON (${err.message}).`);
  }
  if (!Array.isArray(data)) fail(`${file} must contain a JSON array.`);
  return data;
}

function isRealDate(value) {
  if (typeof value !== 'string' || !DATE_RE.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

// ───────── validation (returns an error string, or '' when valid) ─────────

function checkCommon(item) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) return 'must be an object';
  if (typeof item.slug !== 'string' || !SLUG_RE.test(item.slug))
    return 'needs a "slug" using lowercase letters, numbers and hyphens';
  if (typeof item.title !== 'string' || !item.title.trim()) return 'needs a non-empty "title"';
  if (typeof item.category !== 'string' || !item.category.trim())
    return 'needs a non-empty "category"';
  return '';
}

function checkProject(item) {
  const common = checkCommon(item);
  if (common) return common;
  if (!Number.isInteger(item.year) || item.year < 2000 || item.year > 2100)
    return '"year" must be a whole number between 2000 and 2100';
  if (item.featured !== undefined && typeof item.featured !== 'boolean')
    return '"featured" must be true or false';
  return '';
}

function checkPost(item) {
  const common = checkCommon(item);
  if (common) return common;
  if (!isRealDate(item.date)) return '"date" must be a real date in YYYY-MM-DD format';
  return '';
}

function prepare(items, checker, label, file) {
  const problems = [];
  const seen = new Set();
  const docs = [];

  items.forEach((item, index) => {
    const problem = checker(item);
    if (problem) {
      problems.push(`${label} #${index + 1}${item && item.slug ? ` (${item.slug})` : ''}: ${problem}`);
      return;
    }
    if (seen.has(item.slug)) {
      problems.push(`${label} #${index + 1}: duplicate slug "${item.slug}"`);
      return;
    }
    seen.add(item.slug);
    docs.push({ id: item.slug, data: { ...item } });
  });

  if (problems.length > 0) {
    console.error(`\n${file} has ${problems.length} problem(s):`);
    problems.slice(0, 25).forEach((p) => console.error(`  - ${p}`));
    if (problems.length > 25) console.error(`  …and ${problems.length - 25} more`);
    fail('Fix the problems above and run the script again. Nothing was written.');
  }
  return docs;
}

// ───────── writing ─────────

function requireEnv(names) {
  const missing = names.filter((n) => !process.env[n]);
  if (missing.length > 0) {
    fail(
      `Missing environment variable(s): ${missing.join(', ')}\n` +
        'Set them in your shell or in .env.local (see the usage notes at the top of this file).'
    );
  }
}

async function writeAll(jobs) {
  requireEnv([
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
    'SEED_ADMIN_EMAIL',
    'SEED_ADMIN_PASSWORD',
  ]);

  const { initializeApp } = require('firebase/app');
  const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
  const { getFirestore, doc, writeBatch, serverTimestamp, terminate } = require('firebase/firestore');

  const app = initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  });

  const auth = getAuth(app);
  const db = getFirestore(app);

  console.log('Signing in as the admin user…');
  await signInWithEmailAndPassword(auth, process.env.SEED_ADMIN_EMAIL, process.env.SEED_ADMIN_PASSWORD);

  for (const job of jobs) {
    let written = 0;
    for (let i = 0; i < job.docs.length; i += BATCH_SIZE) {
      const batch = writeBatch(db);
      job.docs.slice(i, i + BATCH_SIZE).forEach(({ id, data }) => {
        batch.set(doc(db, job.collection, id), { ...data, seededAt: serverTimestamp() });
      });
      await batch.commit();
      written += Math.min(BATCH_SIZE, job.docs.length - i);
      console.log(`  ${job.collection}: ${written}/${job.docs.length}`);
    }
  }

  await terminate(db);
}

// ───────── main ─────────

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    printHelp();
    return;
  }
  if (!args.projects && !args.posts) {
    fail('Pass at least one of --projects <file.json> or --posts <file.json>. Use --help for usage.');
  }

  loadEnvFile(path.resolve(process.cwd(), '.env.local'));
  loadEnvFile(path.resolve(process.cwd(), '.env'));

  const jobs = [];
  if (args.projects) {
    jobs.push({
      collection: PROJECTS_COLLECTION,
      docs: prepare(readJsonArray(args.projects), checkProject, 'project', args.projects),
    });
  }
  if (args.posts) {
    jobs.push({
      collection: args.postsCollection,
      docs: prepare(readJsonArray(args.posts), checkPost, 'post', args.posts),
    });
  }

  console.log('\nReady to seed:');
  jobs.forEach((j) => console.log(`  ${j.collection}: ${j.docs.length} document(s)`));

  if (args.dryRun) {
    console.log('\nDry run — files are valid, nothing was written.');
    return;
  }

  await writeAll(jobs);
  console.log('\nDone. Firestore has been seeded.');
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('\nSeeding failed:', err && err.message ? err.message : err);
    if (err && err.code === 'auth/invalid-credential') {
      console.error('Hint: check SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD (the admin user from Firebase Auth).');
    }
    if (err && err.code === 'permission-denied') {
      console.error('Hint: the signed-in user must be the admin UID set in firestore.rules.');
    }
    process.exit(1);
  });
