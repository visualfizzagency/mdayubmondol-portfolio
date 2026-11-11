import Image from 'next/image';
import Link from 'next/link';
import { getProjects, getPosts } from '../lib/data';
import { clients } from '../data/clients';
import { testimonials } from '../data/testimonials';

// Re-check Firestore at most once a minute so admin edits show up.
export const revalidate = 60;

const EMAIL = 'hellomdayub@gmail.com';
const PHONE = '01886588884';
const BEHANCE_URL = 'https://www.behance.net/mdayubmondol0';
const BEHANCE_LABEL = 'behance.net/mdayubmondol0';
const FACEBOOK_URL = 'https://www.facebook.com/hellomdayub';
const FACEBOOK_LABEL = 'facebook.com/hellomdayub';
const OFFICE = 'Kaderabad Housing, Mohammadpur, Dhaka, Bangladesh';

// Real services from mdayubmondol.com — titles + one-liners verbatim.
const services = [
  {
    id: 'brand-identity-design',
    title: 'Brand Identity Design',
    text: 'Building memorable and distinctive brand identities.',
    tags: ['Logo', 'Guidelines', 'Identity Systems'],
  },
  {
    id: 'ai-powered-creative',
    title: 'AI-Powered Creative',
    text: 'Transforming ideas into AI-generated visuals.',
    tags: ['AI Art', 'Prompt Craft', 'Cinematic AI'],
  },
  {
    id: 'graphic-design',
    title: 'Graphic Design',
    text: 'Creative visuals that communicate your brand.',
    tags: ['Posters', 'Social', 'Print'],
  },
  {
    id: 'motion-graphics-design',
    title: 'Motion Graphics Design',
    text: 'Dynamic storytelling through motion graphics.',
    tags: ['Reels', 'Animation', 'Explainer'],
  },
  {
    id: 'video-editing-production',
    title: 'Video Editing & Production',
    text: 'Engaging videos crafted for digital platforms.',
    tags: ['Editing', 'Reels', 'Short-form'],
  },
  {
    id: 'ai-video-production',
    title: 'AI Video Production',
    text: 'Bringing creative concepts to life with AI.',
    tags: ['Veo', 'AI Video', 'Campaigns'],
  },
];

// Real skills from mdayubmondol.com.
const tools = [
  'Photoshop',
  'Illustrator',
  'After Effects',
  'Premiere Pro',
  'CapCut',
  'Prompt Design',
  'Figma',
  'AI Tools',
];

const marqueeItems = [
  'Brand Identity',
  'AI Art',
  'Motion Graphics',
  'Video Editing',
  'UI/UX',
  'Social Campaigns',
  'AI Video',
];

const cardGradients = [
  'from-navy to-navy-500',
  'from-navy-700 to-sky-600',
  'from-sky-500 to-navy-600',
  'from-navy-800 to-navy-400',
  'from-navy-600 to-sky-500',
  'from-navy-900 to-navy-500',
];

// Bento layout for the 6 featured projects (desktop 12-col grid).
const bentoSpans = [
  'lg:col-span-8',
  'lg:col-span-4',
  'lg:col-span-4',
  'lg:col-span-4',
  'lg:col-span-4',
  'lg:col-span-12',
];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function ProjectCard({ p, index, wide }) {
  const href = p.behanceOnly && p.behanceUrl ? p.behanceUrl : `/work/${p.slug}`;
  const external = p.behanceOnly && p.behanceUrl;
  const inner = (
    <>
      {p.cover ? (
        <Image
          src={p.cover}
          alt={p.title}
          fill
          sizes={
            wide
              ? '(min-width: 1024px) 1200px, 100vw'
              : '(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw'
          }
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
        />
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${cardGradients[index % cardGradients.length]}`}
        >
          <span className="display absolute left-6 top-4 text-6xl text-white/20 md:text-7xl">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/95 via-navy-900/60 to-transparent" />
      <span
        aria-hidden="true"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-sky text-xl text-navy-900 opacity-0 transition-all duration-300 group-hover:opacity-100"
      >
        ↗
      </span>
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
        <p className="mono text-[11px] uppercase tracking-[0.22em] text-sky">
          {p.category}
          {p.year ? ` — ${p.year}` : ''}
          {p.behanceUrl ? ' · Behance' : ''}
        </p>
        <h3 className="mt-2 !text-white md:text-3xl">{p.title}</h3>
        {p.description ? (
          <p className="mt-2 hidden max-w-xl text-sm leading-relaxed text-white/75 md:block">
            {p.description.slice(0, 110)}
            {p.description.length > 110 ? '…' : ''}
          </p>
        ) : null}
      </div>
    </>
  );

  const className = `card-hover group relative block aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-white/10 bg-navy-800 md:col-span-1 lg:aspect-auto lg:h-full ${bentoSpans[index] || ''} ${
    wide ? 'aspect-[16/9]' : ''
  }`;

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
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

  // Real stats from mdayubmondol.com.
  const stats = [
    { value: '7+', label: 'Years Of Experience' },
    { value: '6K+', label: 'Project Complete' },
    { value: '95%', label: 'Client Satisfactions' },
  ];

  const [featuredQuote, ...otherQuotes] = [
    testimonials[1], // Diane Najm — longest, most specific
    testimonials[0],
    testimonials[2],
    testimonials[3],
    testimonials[4],
  ];

  return (
    <>
      {/* ───────── (a) HERO — dark, name-led ───────── */}
      <section className="relative overflow-hidden bg-navy-900 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-sky/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-48 -left-32 h-[28rem] w-[28rem] rounded-full bg-navy/60 blur-3xl"
        />
        <div className="container-x relative pb-16 pt-14 md:pb-24 md:pt-20 lg:pt-24">
          <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <p className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white/80">
                <span className="animate-pulse-dot h-2 w-2 rounded-full bg-sky" />
                Available for projects — Sr. Visualizer, Edison Group (Symphony, Helio)
              </p>
              <p className="animate-fade-up eyebrow mt-8 !text-sky" style={{ animationDelay: '80ms' }}>
                Hello, I’m — Dhaka, Bangladesh
              </p>
              <h1
                className="animate-fade-up mt-5 !text-white"
                style={{
                  animationDelay: '160ms',
                  fontSize: 'clamp(3.5rem, 9.5vw, 8.25rem)',
                  lineHeight: 0.95,
                }}
              >
                MD AYUB
                <br />
                <span className="text-stroke">MONDOL</span>
              </h1>
              <p
                className="animate-fade-up display mt-6 text-2xl text-sky md:text-4xl"
                style={{ animationDelay: '240ms' }}
              >
                Creative Designer &amp; AI Artist
              </p>
              <p
                className="animate-fade-up mt-6 max-w-xl text-base leading-relaxed text-white/70 md:text-lg"
                style={{ animationDelay: '320ms' }}
              >
                Creative professional with 7+ years of experience in Graphic Design, Brand
                Identity, Motion Graphics, Video Editing, and AI-Powered Visual Creation. I
                turn ideas into compelling visuals through creativity, technology, and
                purposeful design.
              </p>
              <div
                className="animate-fade-up mt-10 flex flex-col gap-4 sm:flex-row"
                style={{ animationDelay: '400ms' }}
              >
                <a href={`mailto:${EMAIL}`} className="btn-sky">
                  Hire Me
                </a>
                <a href="#work" className="btn-outline-light">
                  View Selected Work ↓
                </a>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none">
              <div
                className="animate-fade-up relative aspect-[4/5] w-full overflow-hidden rounded-b-[2.5rem] rounded-t-[999px] border border-white/10 bg-gradient-to-b from-navy-700 via-navy-800 to-navy-900 shadow-2xl shadow-black/40"
                style={{ animationDelay: '200ms' }}
              >
                <div
                  aria-hidden="true"
                  className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-sky/30 blur-2xl"
                />
                <Image
                  src="/images/portrait-cutout.png"
                  alt="Md Ayub Mondol — portrait, background removed"
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, (min-width: 640px) 384px, 90vw"
                  className="object-contain object-bottom"
                />
              </div>
              <div className="absolute -left-2 top-32 z-10 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md md:-left-4">
                <p className="display text-2xl text-white">7+</p>
                <p className="mono text-[10px] uppercase tracking-[0.18em] text-white/70">
                  Years Experience
                </p>
              </div>
              <div className="absolute -right-2 bottom-10 z-10 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md md:-right-4">
                <p className="display text-2xl text-white">100+</p>
                <p className="mono text-[10px] uppercase tracking-[0.18em] text-white/70">
                  Brands Worldwide
                </p>
              </div>
            </div>
          </div>

          {/* Real stats from his site */}
          <dl className="mt-16 grid grid-cols-3 gap-4 border-t border-white/10 pt-8 md:mt-24 md:pt-10">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="display block text-4xl text-white md:text-7xl">
                    {s.value}
                  </span>
                  <span className="mono mt-2 block text-[11px] uppercase tracking-[0.18em] text-white/50 md:text-xs">
                    {s.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ───────── (b) MARQUEE ───────── */}
      <div className="overflow-hidden bg-navy-900 py-2">
        <section
          aria-hidden="true"
          className="marquee-pause -rotate-1 scale-[1.02] overflow-hidden bg-sky py-3 text-navy-900 md:py-4"
        >
          <div className="animate-marquee flex w-max items-center">
            {[0, 1].map((half) => (
              <div key={half} className="flex items-center">
                {marqueeItems.map((item) => (
                  <span
                    key={`${half}-${item}`}
                    className="display flex items-center whitespace-nowrap text-lg font-extrabold md:text-2xl"
                  >
                    <span className="mx-5">{item.toUpperCase()}</span>
                    <span className="text-navy-900/50">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ───────── (c) CLIENT LOGOS — white, uniform ───────── */}
      <section className="bg-navy-900 py-16 text-white md:py-24">
        <div className="container-x">
          <div className="text-center">
            <p className="eyebrow !text-sky">I’ve Worked With</p>
            <h2 className="mx-auto mt-4 max-w-3xl !text-white">
              100+ Brands &amp; Businesses Worldwide
            </h2>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-7 md:mt-16 md:gap-x-12 md:gap-y-9">
            {clients.map((c) => (
              <Image
                key={c.name}
                src={c.logo}
                alt={c.name}
                width={c.w}
                height={c.h}
                loading="lazy"
                className="h-9 w-auto object-contain opacity-60 transition-opacity duration-300 hover:opacity-100 md:h-11"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ───────── (d) SELECTED WORK — bento, real covers ───────── */}
      <section id="work" className="scroll-mt-20 bg-navy-900 py-20 text-white md:py-28">
        <div className="container-x">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow !text-sky">Selected work</p>
              <h2 className="mt-4 !text-white">Featured projects.</h2>
            </div>
            <Link
              href="/work"
              className="self-start font-semibold text-sky transition-colors hover:text-white md:self-auto"
            >
              View all work →
            </Link>
          </div>

          <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[26rem]">
            {featured.map((p, i) => (
              <ProjectCard key={p.slug} p={p} index={i} wide={i === 5} />
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-white/50">
            New Behance projects appear here automatically — within an hour of publishing.{' '}
            <a
              href={BEHANCE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-sky transition-colors hover:text-white"
            >
              {BEHANCE_LABEL} ↗
            </a>
          </p>
        </div>
      </section>

      {/* ───────── (e) SERVICES — numbered editorial list ───────── */}
      <section id="services" className="bg-navy-900 py-20 text-white md:py-28">
        <div className="container-x">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow !text-sky">Popular Services</p>
              <h2 className="mt-4 max-w-3xl !text-white">
                My Special Services For Your Business Growth.
              </h2>
            </div>
            <Link
              href="/services"
              className="self-start font-semibold text-sky transition-colors hover:text-white md:self-auto"
            >
              Service details →
            </Link>
          </div>

          <div className="mt-12 md:mt-16">
            {services.map((s, i) => (
              <a
                key={s.id}
                href={`/services#${s.id}`}
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 border-t border-white/10 py-7 transition-colors last:border-b hover:bg-white/[0.03] md:gap-8 md:py-8"
              >
                <span className="mono text-sm font-bold text-sky md:text-base">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>
                  <span className="display block text-2xl font-bold text-white transition-transform duration-300 group-hover:translate-x-2 md:text-4xl">
                    {s.title}
                  </span>
                  <span className="mt-2 block max-w-xl text-sm text-white/60 md:text-base">
                    {s.text}
                  </span>
                  <span className="mt-3 hidden flex-wrap gap-2 lg:flex">
                    {s.tags.map((t) => (
                      <span
                        key={t}
                        className="mono rounded-full border border-white/15 px-3 py-1 text-[11px] uppercase tracking-wider text-white/60"
                      >
                        {t}
                      </span>
                    ))}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="text-2xl text-sky transition-transform duration-300 group-hover:rotate-45 md:text-3xl"
                >
                  ↗
                </span>
              </a>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/60">
            <span className="eyebrow mr-2 !text-sky">Tools</span>
            {tools.map((t, i) => (
              <span key={t} className="flex items-center gap-3">
                <span className="mono font-medium text-white/80">{t}</span>
                {i < tools.length - 1 && <span className="text-sky">•</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── (f) TESTIMONIALS — real quotes only ───────── */}
      <section id="testimonials" className="bg-white py-20 md:py-32">
        <div className="container-x">
          <p className="eyebrow">Clients Testimonials</p>
          <h2 className="mt-4 max-w-3xl">Trusted by Brands. Appreciated by Clients.</h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-navy-900/70 md:text-lg">
            Building creative partnerships through quality work, clear communication, and
            reliable delivery. Here’s what clients say about working with me.
          </p>

          {/* Featured quote */}
          <figure className="mt-12 rounded-[2rem] border border-navy/10 bg-navy-50 p-8 md:mt-16 md:p-12">
            <span aria-hidden="true" className="display block text-7xl leading-none text-sky md:text-8xl">
              ”
            </span>
            <blockquote className="display -mt-4 max-w-4xl text-2xl font-bold leading-snug text-navy md:text-4xl md:leading-tight">
              {featuredQuote.quote}
            </blockquote>
            <figcaption className="mt-8">
              <p className="text-lg font-bold text-navy">{featuredQuote.name}</p>
              <p className="mono mt-1 text-xs uppercase tracking-[0.18em] text-navy-900/50">
                {featuredQuote.role}
              </p>
            </figcaption>
          </figure>

          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {otherQuotes.map((t) => (
              <figure
                key={t.name}
                className="card-hover flex flex-col rounded-3xl border border-navy/10 bg-white p-7"
              >
                <span aria-hidden="true" className="display text-5xl leading-none text-sky">
                  ”
                </span>
                <blockquote className="mt-2 flex-1 text-navy-900/80">{t.quote}</blockquote>
                <figcaption className="mt-6 border-t border-navy/10 pt-4">
                  <p className="font-bold text-navy">{t.name}</p>
                  <p className="mono mt-1 text-[11px] uppercase tracking-[0.18em] text-navy-900/50">
                    {t.role}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── (g) LATEST BLOGS ───────── */}
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

      {/* ───────── (h) CONTACT CTA ───────── */}
      <section id="contact" className="bg-navy py-24 text-white md:py-36">
        <div className="container-x">
          <p className="eyebrow !text-sky">Get In Touch</p>
          <h2 className="mt-4 max-w-4xl !text-white">Let’s Talk About Your Next Projects.</h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
            Have a creative idea or a project in mind? I’m always open to discussing new
            opportunities, creative collaborations, and exciting projects. Let’s turn your
            vision into reality.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            {[
              '7+ Years of Experience',
              'Worked With 100+ Brands',
              'Creative & AI-Powered Solutions',
              'Professional Design Support',
            ].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white/85"
              >
                {chip}
              </span>
            ))}
          </div>

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
              <p className="text-sm uppercase tracking-wider text-white/50">Main Office</p>
              <p className="mt-2 text-lg font-medium md:text-xl">{OFFICE}</p>
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
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-light"
            >
              {FACEBOOK_LABEL}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
