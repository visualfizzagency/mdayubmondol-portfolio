import Image from 'next/image';
import Link from 'next/link';
import { getProjects, getPosts } from '../lib/data';

// Re-check Firestore at most once a minute so admin edits show up.
export const revalidate = 60;

const EMAIL = 'hellomdayub@gmail.com';
const PHONE = '01886588884';
const BEHANCE_URL = 'https://www.behance.net/mdayubmondol0';
const BEHANCE_LABEL = 'behance.net/mdayubmondol0';
const FACEBOOK_URL = 'https://www.facebook.com/hellomdayub';
const FACEBOOK_LABEL = 'facebook.com/hellomdayub';

const services = [
  {
    title: 'Brand Identity Design',
    text: 'Logos, colour systems and guidelines that make a brand instantly recognisable.',
  },
  {
    title: 'AI-Powered Creative / AI Art',
    text: 'Concept-to-visual with generative AI — cinematic imagery, video and prompt craft.',
  },
  {
    title: 'UI/UX Design',
    text: 'Clean, intuitive interfaces designed in Figma, from wireframe to polish.',
  },
  {
    title: 'Motion Graphics',
    text: 'Animated visuals and edits that bring campaigns and stories to life.',
  },
  {
    title: 'Social Media Banners',
    text: 'Scroll-stopping banners and posts sized for every platform.',
  },
  {
    title: 'SEO & Digital Marketing',
    text: 'Search-smart content and digital campaigns that reach the right audience.',
  },
];

const tools = [
  'Photoshop',
  'Illustrator',
  'After Effects',
  'Premiere Pro',
  'CapCut',
  'Figma',
];

const cardGradients = [
  'from-navy to-navy-500',
  'from-navy-700 to-sky-600',
  'from-sky-500 to-navy-600',
  'from-navy-800 to-navy-400',
  'from-navy-600 to-sky-500',
  'from-navy-900 to-navy-500',
];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export default async function HomePage() {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);

  // Featured projects: those flagged `featured`. If none are flagged
  // (e.g. projects created in the admin without the flag), show the first six.
  const flagged = projects.filter((p) => p.featured);
  const featured = (flagged.length > 0 ? flagged : projects).slice(0, 6);

  const latestPosts = [...posts]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const stats = [
    { value: '7+', label: 'Years Experience' },
    { value: String(projects.length), label: 'Projects' },
    { value: String(services.length), label: 'Services' },
  ];

  return (
    <>
      {/* ───────── (a) HERO ───────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-sky/20 blur-3xl"
        />
        <div className="container-x relative pb-16 pt-14 md:pb-24 md:pt-20 lg:pt-28">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <p className="eyebrow">Md Ayub Mondol — Dhaka, Bangladesh</p>
              <h1 className="mt-6">
                Visual stories, designed &amp; <span className="text-sky-500">AI-crafted.</span>
              </h1>
              <p className="mt-8 max-w-xl text-base leading-relaxed text-navy-900/75 md:text-lg">
                Sr. Visualizer at Edison Group (Symphony, Helio), 2026–Present. 7+ years of
                experience. Previously Senior Graphic Designer at NexGen Global Group
                (2023–2026).
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a href="#work" className="btn-primary">
                  View Work
                </a>
                <a href={`mailto:${EMAIL}`} className="btn-outline">
                  Get in Touch
                </a>
              </div>
            </div>

            <div className="mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none">
              {/* Hero portrait: add his suited photo at public/images/portrait.jpg.
                  Until that file exists, the navy gradient + initials below show instead. */}
              <div
                role="img"
                aria-label="Portrait of Md Ayub Mondol"
                className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy via-navy-600 to-sky-600 shadow-2xl shadow-navy/30"
              >
                <div
                  aria-hidden="true"
                  className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-sky/30 blur-2xl"
                />
                <span
                  aria-hidden="true"
                  className="display relative text-[7rem] font-extrabold text-white/90 md:text-[9rem]"
                >
                  AM
                </span>
                <Image
                  src="/images/portrait.jpg"
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, (min-width: 640px) 384px, 90vw"
                  className="object-cover object-top"
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <dl className="mt-16 grid grid-cols-3 gap-4 border-t border-navy/10 pt-8 md:mt-24 md:pt-10">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="display block text-4xl text-navy md:text-7xl">{s.value}</span>
                  <span className="mt-2 block text-xs font-medium uppercase tracking-wider text-navy-900/60 md:text-sm">
                    {s.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ───────── (b) SERVICES ───────── */}
      <section id="services" className="bg-navy-50 py-20 md:py-32">
        <div className="container-x">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">What I do</p>
              <h2 className="mt-4 max-w-3xl">Design that moves brands forward.</h2>
            </div>
            <Link href="/services" className="btn-outline self-start md:self-auto">
              Service details →
            </Link>
          </div>

          <div className="mt-12 grid gap-5 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <article
                key={s.title}
                className="card-hover rounded-3xl border border-navy/10 bg-white p-7 md:p-8"
              >
                <span className="display text-sm font-bold text-sky-600">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-6">{s.title}</h3>
                <p className="mt-3 text-navy-900/70">{s.text}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-navy-900/70">
            <span className="eyebrow mr-2">Tools</span>
            {tools.map((t, i) => (
              <span key={t} className="flex items-center gap-3">
                <span className="font-medium text-navy">{t}</span>
                {i < tools.length - 1 && <span className="text-sky">•</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── (c) FEATURED PROJECTS ───────── */}
      <section id="work" className="scroll-mt-20 py-20 md:py-32">
        <div className="container-x">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Selected work</p>
              <h2 className="mt-4">Featured projects.</h2>
            </div>
            <Link href="/work" className="btn-outline self-start md:self-auto">
              View all work →
            </Link>
          </div>

          <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <Link
                key={p.slug}
                href={`/work/${p.slug}`}
                className="card-hover group block overflow-hidden rounded-3xl border border-navy/10 bg-white"
              >
                <div
                  className={`relative aspect-[4/3] bg-gradient-to-br ${cardGradients[i % cardGradients.length]}`}
                >
                  <span className="display absolute left-6 top-4 text-6xl text-white/20 md:text-7xl">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {p.year ? (
                    <span className="absolute bottom-5 left-6 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wider text-white backdrop-blur">
                      {p.year}
                    </span>
                  ) : null}
                </div>
                <div className="p-6">
                  <p className="eyebrow">{p.category}</p>
                  <h3 className="mt-3">{p.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── (d) LATEST BLOGS ───────── */}
      <section id="blog" className="bg-navy-50 py-20 md:py-32">
        <div className="container-x">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Journal</p>
              <h2 className="mt-4">Latest blogs.</h2>
            </div>
            <Link href="/blog" className="btn-outline self-start md:self-auto">
              All posts →
            </Link>
          </div>

          <div className="mt-12 border-b border-navy/10 md:mt-16">
            {latestPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group grid gap-2 border-t border-navy/10 py-6 transition-colors hover:bg-white md:grid-cols-[11rem_1fr_auto] md:items-center md:gap-8 md:px-4 md:py-8"
              >
                <time dateTime={post.date} className="text-sm font-medium text-sky-600">
                  {formatDate(post.date)}
                </time>
                <h3 className="text-balance">{post.title}</h3>
                <span
                  aria-hidden="true"
                  className="hidden text-2xl text-navy transition-transform duration-300 group-hover:translate-x-2 md:block"
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── (e) CONTACT CTA ───────── */}
      <section id="contact" className="bg-navy py-24 text-white md:py-36">
        <div className="container-x">
          <p className="eyebrow !text-sky">Contact</p>
          <h2 className="mt-4 max-w-4xl !text-white">Let’s create something bold together.</h2>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
            <div>
              <p className="text-sm uppercase tracking-wider text-white/50">Email</p>
              <a
                href={`mailto:${EMAIL}`}
                className="mt-2 block break-all text-lg font-medium transition-colors hover:text-sky md:text-xl"
              >
                {EMAIL}
              </a>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wider text-white/50">Phone</p>
              <a
                href={`tel:${PHONE}`}
                className="mt-2 block text-lg font-medium transition-colors hover:text-sky md:text-xl"
              >
                {PHONE}
              </a>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wider text-white/50">Behance</p>
              <a
                href={BEHANCE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block break-all text-lg font-medium transition-colors hover:text-sky md:text-xl"
              >
                {BEHANCE_LABEL}
              </a>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wider text-white/50">Facebook</p>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block break-all text-lg font-medium transition-colors hover:text-sky md:text-xl"
              >
                {FACEBOOK_LABEL}
              </a>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <a href={`mailto:${EMAIL}`} className="btn-light">
              Get in Touch
            </a>
            <a
              href={BEHANCE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-light"
            >
              View Behance
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
