# Md Ayub Mondol — Portfolio

## What this is

The portfolio website of **Md Ayub Mondol**, a graphic designer and AI artist
from Dhaka, Bangladesh. He is a Sr. Visualizer at Edison Group (Symphony, Helio)
with 7+ years of experience in brand identity, AI-powered creative, UI/UX,
motion graphics, social media design and digital marketing.

The site is built around oversized headlines, generous whitespace and a deep
blue / light blue / white palette, and is fully responsive (mobile and desktop).

## Tech stack

- **Next.js 14** (App Router) + **React 18**
- **Tailwind CSS 3**
- **Firebase 10** — Firestore (data), Auth (admin), Storage (images)
- Deployed on **Vercel** (Hobby, free) from GitHub

## Project structure

```
.
├── app/
│   ├── layout.js        # Root layout: fonts, metadata, sticky nav, footer
│   ├── globals.css      # Tailwind directives + design system classes
│   └── page.js          # Homepage (hero, services, projects, blogs, contact)
├── data/
│   ├── projects.js      # Project list (first 6 are featured on the homepage)
│   └── posts.js         # Blog post list
├── lib/
│   └── firebase.js      # Firebase init: app, db, auth, storage
├── next.config.js       # Next.js config (remote image hosts)
├── tailwind.config.js   # Brand colours, fonts, container
├── postcss.config.js    # Tailwind + autoprefixer
├── package.json         # Dependencies and scripts
└── README.md
```

## How to run locally

Requires Node.js 18.17 or newer.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.local.example` to `.env.local` and fill in your Firebase web app
   values:

   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_FIREBASE_APP_ID=
   ```

   Never commit `.env.local`. It is listed in `.gitignore`.

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Open <http://localhost:3000>.

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

## How Vercel + Firebase connect

1. **Push to GitHub.** Create a repository and push this project to it.
2. **Import into Vercel.** In Vercel, choose *Add New → Project*, import the
   GitHub repository, and keep the Hobby (free) plan. Vercel detects Next.js
   automatically.
3. **Add environment variables.** In *Project Settings → Environment
   Variables*, add the same six `NEXT_PUBLIC_FIREBASE_*` variables from your
   `.env.local`.
4. **Set up Firebase.** In the Firebase console, create a project and a web
   app (this gives you the six values above), then enable:
   - **Firestore Database** — for site data
   - **Authentication** — enable Email/Password for the admin login
   - **Storage** — for uploaded images
5. **Authorise your domain.** In Firebase *Authentication → Settings →
   Authorized domains*, add your Vercel domain (for example
   `your-project.vercel.app`).
6. **Redeploy.** After adding the variables, redeploy from the Vercel
   dashboard so the build picks them up. Every later push to GitHub deploys
   automatically.

---

## Chunk 2

Chunk 2 adds the rest of the site: all public pages, the admin area, the full
data files, and the Firebase security rules and project config files.

### Chunk 2 files

**Data**

- `data/posts.js` — 44 blog posts, newest first, with `getPostBySlug()`
- `data/projects.js` — 27 projects, with `getProjectBySlug()`

**Public pages**

- `app/about/page.js` — About page (story, experience, services, tools)
- `app/services/page.js` — the six services, each with included items and deliverables
- `app/work/page.js` — portfolio grid with category filter
- `app/work/[slug]/page.js` — project detail page
- `app/blog/page.js` — blog list with search and category filter
- `app/blog/[slug]/page.js` — blog post detail page
- `app/course/page.js` — "Graphic Design For Daily Life" free course page
- `app/resources/page.js` — free resources (download buttons are placeholders)
- `app/contact/page.js` — contact form that saves to Firestore (`contact_messages`)

**Admin**

- `app/admin/page.js` — admin sign-in and dashboard (Firebase Auth email/password)
- `app/admin/projects/page.js` — projects CRUD (Firestore `projects`)
- `app/admin/posts/page.js` — posts CRUD (Firestore `posts`)

**Config and security**

- `.gitignore` — keeps `node_modules`, build output, `.env.local` and Firebase emulator files out of Git
- `.env.local.example` — documents the Firebase environment variables (placeholders only)
- `firestore.rules` — Firestore security rules
- `storage.rules` — Firebase Storage security rules

### Setting up the admin and the security rules

1. In the Firebase console, enable **Authentication → Email/Password** and
   create the admin user (*Authentication → Users → Add user*). The code
   contains no credentials.
2. Copy that user's **User UID** from the Users list.
3. Open `firestore.rules` and `storage.rules` and replace the placeholder text in
   the `ADMIN_UID()` function with that UID (see *Chunk 3* below).
4. Publish the rules: *Firestore Database → Rules* and *Storage → Rules* in the
   Firebase console (paste the file contents and click Publish).

What the rules allow:

| Resource | Public | Admin |
| --- | --- | --- |
| `projects`, `posts` | read | read and write |
| `contact_messages` | create only (valid form data) | read, update, delete |
| Storage files | read | write |

The admin pages only hide their UI from signed-out visitors. The security rules
are what actually protect your data, so publish them before going live.

### Notes

- **Hero portrait:** the hero portrait file `public/images/portrait.jpg` must be added later (his suited photo).
- **Post bodies:** full post bodies are seeded from the WordPress export on the final build.
- Since Chunk 3, the public pages read Firestore first and fall back to
  `data/projects.js` and `data/posts.js` (see *Chunk 3* below).
- Download buttons on `/resources` are placeholders until the files are added.

## Chunk 3

Chunk 3 adds a Firestore-first data layer, the admin messages viewer, the free
tool pages, a Firestore seed script, and updated security rules.

### Chunk 3 files

**Data layer and pages**

- `lib/data.js` — Firestore-first data layer with static fallback (`getProjects()`, `getPosts()`, `getProject(slug)`, `getPost(slug)`)
- `app/page.js` — homepage (six aligned services, `/images/portrait.jpg` hero, data from `lib/data.js`)
- `app/services/page.js` — the same six services in detail
- `app/work/page.js`, `app/work/[slug]/page.js` — portfolio list and project pages, via `lib/data.js`
- `app/blog/page.js`, `app/blog/[slug]/page.js` — blog list and post pages, via `lib/data.js`
- `app/about/page.js` — about page (services list and portrait updated)

**Admin**

- `app/admin/page.js` — dashboard, now with a Messages card
- `app/admin/projects/page.js` — projects CRUD, now with a "Featured" checkbox
- `app/admin/posts/page.js` — posts CRUD, now with an "Image URL" field
- `app/admin/messages/page.js` — in-site viewer for `contact_messages` (newest first)

**Config, rules and scripts**

- `lib/firebase.js` — now also exports `adminUid` (from `NEXT_PUBLIC_ADMIN_UID`)
- `firestore.rules`, `storage.rules` — rewritten with a single `ADMIN_UID()` constant
- `scripts/seed-firestore.js` — seeds Firestore from local JSON files

**Free tool pages**

- `app/tools/ai-prompt-generator/page.js` — builds an AI image prompt, with copy button
- `app/tools/quickimage-tools/page.js` — in-browser image resizer (canvas)
- `app/tools/sora-invite-code-hub/page.js` — info page: Sora was discontinued in 2026, so there are no invite codes to request (no form)
- `app/tools/eid-salami-wheel-2026/page.js` — just-for-fun spin wheel (no real money)

The tool pages are not linked from the main navigation yet. Their URLs are
`/tools/ai-prompt-generator`, `/tools/quickimage-tools`,
`/tools/sora-invite-code-hub` and `/tools/eid-salami-wheel-2026`.

### Admin UID setup

The admin pages hide their UI from signed-out visitors, but the **security rules**
are what actually protect your data.

1. In the Firebase console, create the admin user (*Authentication → Users → Add
   user*) and copy its **User UID**.
2. Add the UID to `.env.local` (and to Vercel *Environment Variables*):

   ```bash
   NEXT_PUBLIC_ADMIN_UID=your-admin-user-uid
   ```

3. In **both** `firestore.rules` and `storage.rules`, find the `ADMIN_UID()`
   function at the top and replace
   `REPLACE THIS WITH YOUR ADMIN UID FROM FIREBASE AUTH` with the same UID (keep
   the quotes).
4. Publish the rules: *Firestore Database → Rules* and *Storage → Rules* in the
   Firebase console (paste the file contents and click Publish).

Until step 3 is done, nobody can write, and public reads still work. The
`contact_messages` collection is the one exception to "public read": visitors can
create a message through the contact form, but only the admin can read it.

### Seeding Firestore

`scripts/seed-firestore.js` writes the `projects` and `blog_posts` collections
from local JSON files. Each document ID is the item's slug, so re-running updates
the same documents.

1. Add two extra variables to `.env.local` (these are for the script only; never
   add them to Vercel or commit them):

   ```bash
   SEED_ADMIN_EMAIL=the-admin-users-email
   SEED_ADMIN_PASSWORD=the-admin-users-password
   ```

2. Create the JSON files (for example from the bundled data files):

   ```bash
   node --input-type=module -e "import {projects} from './data/projects.js'; console.log(JSON.stringify(projects, null, 2))" > projects.json
   node --input-type=module -e "import {posts} from './data/posts.js'; console.log(JSON.stringify(posts, null, 2))" > posts.json
   ```

3. Check the files without writing anything, then seed:

   ```bash
   node scripts/seed-firestore.js --projects projects.json --posts posts.json --dry-run
   node scripts/seed-firestore.js --projects projects.json --posts posts.json
   ```

Notes:

- `lib/data.js` reads Firestore first. As soon as a collection has any documents,
  it replaces the bundled data for that collection. Seed everything at once
  instead of leaving a partial set.
- `lib/data.js` reads `blog_posts` first and then `posts`, but the admin Posts page
  currently writes to `posts`. If you seed `blog_posts`, either point the admin
  page at `blog_posts` or seed with `--posts-collection posts`.
- Documents created in the admin pages get random IDs. Delete them before seeding
  the same items, or you will have duplicates.

### Portrait photo

The hero (homepage and About page) shows `/images/portrait.jpg`. Add his suited
photo at `public/images/portrait.jpg`. Until the file exists, a navy gradient with
his initials is shown instead.

## Contact

- Email: hellomdayub@gmail.com
- Phone: 01886588884
- Behance: [behance.net/mdayubmondol0](https://www.behance.net/mdayubmondol0)
