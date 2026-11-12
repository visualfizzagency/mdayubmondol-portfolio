import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'About — Md Ayub Mondol',
  description:
    'Md Ayub Mondol is a graphic designer and AI artist from Dhaka, Bangladesh. Sr. Visualizer at Edison Group (Symphony, Helio) with 7+ years of experience.',
};

const EMAIL = 'hellomdayub@gmail.com';
const PHONE = '01886588884';

// Real experience timeline from mdayubmondol.com.
const experience = [
  { period: '2026 — Present', role: 'Sr. Visualizer', company: 'Edison Group', note: 'Symphony, Helio' },
  { period: '2023 — 2026', role: 'Senior Graphic Designer', company: 'NexGen Global Group', note: '' },
  { period: '2022 — 2023', role: 'Visualizer', company: 'AKS Pharmacy', note: '' },
  { period: '2020 — 2022', role: 'Visualizer', company: 'DX360', note: '' },
  { period: '2019 — 2020', role: 'Graphics Designer', company: 'Honda Life', note: '' },
];

// Real focus areas from mdayubmondol.com.
const focusAreas = [
  'Brand Identity & Design',
  'AI Art & Visual Creation',
  'Creative Direction & AI Video',
  'Motion Graphics & Video Editing',
];

// Same service titles and one-liners as the homepage.
const services = [
  { title: 'Brand Identity Design', text: 'Distinctive brand identities, from logo to guidelines.' },
  { title: 'AI-Powered Creative', text: 'AI-generated visuals, from first idea to finished artwork.' },
  { title: 'Graphic Design', text: 'Posters, social media and print design that communicate your brand clearly.' },
  { title: 'Motion Graphics Design', text: 'Animated stories for social media, web and campaigns.' },
  { title: 'Video Editing & Production', text: 'Polished, engaging video made for digital platforms.' },
  { title: 'AI Video Production', text: 'AI-powered video that brings creative concepts to life.' },
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

export default function AboutPage() {
  return (
    <>
      {/* ───────── HERO (dark) ───────── */}
      <section className="relative overflow-hidden bg-navy-900 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-sky/20 blur-3xl"
        />
        <div className="container-x relative pb-16 pt-14 md:pb-24 md:pt-20 lg:pt-28">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <p className="eyebrow !text-sky">About me — Dhaka, Bangladesh</p>
              <h1 className="mt-6 !text-white">
                Creative ideas. <span className="text-sky">Powerful visual solutions.</span>
              </h1>
              <p className="mt-8 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
                With 7+ years of experience in the creative industry, I help brands bring
                their ideas to life through impactful design and visual storytelling. From
                distinctive brand identities to AI-powered visuals, motion graphics and
                video, I combine creativity and technology to deliver results that matter.
              </p>
              <ul className="mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
                {focusAreas.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-white/85">
                    <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-sky" />
                    <span className="font-medium">{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-col gap-2 text-white/80 sm:flex-row sm:gap-10">
                <p>
                  <span className="mono text-xs uppercase tracking-[0.18em] text-white/50">
                    Email
                  </span>
                  <br />
                  <a href={`mailto:${EMAIL}`} className="font-semibold text-white transition-colors hover:text-sky">
                    {EMAIL}
                  </a>
                </p>
                <p>
                  <span className="mono text-xs uppercase tracking-[0.18em] text-white/50">
                    Call
                  </span>
                  <br />
                  <a href={`tel:${PHONE}`} className="font-semibold text-white transition-colors hover:text-sky">
                    +880 18865 88884
                  </a>
                </p>
              </div>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link href="/work" className="btn-sky">
                  View Work
                </Link>
                <Link href="/contact" className="btn-outline-light">
                  Get in Touch
                </Link>
              </div>
            </div>

            <div className="mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-b-[2.5rem] rounded-t-[999px] border border-white/10 bg-gradient-to-b from-navy-700 via-navy-800 to-navy-900 shadow-2xl shadow-black/40">
                <div
                  aria-hidden="true"
                  className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-sky/30 blur-2xl"
                />
                <Image
                  src="/images/portrait-cutout.png"
                  alt="Md Ayub Mondol — portrait, background removed"
                  fill
                  sizes="(min-width: 1024px) 40vw, (min-width: 640px) 384px, 90vw"
                  className="object-contain object-bottom"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── EXPERIENCE ───────── */}
      <section className="bg-navy-50 py-20 md:py-32">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow">Experience</p>
              <h2 className="mt-4">7+ years of creative work.</h2>
              <p className="mt-6 max-w-sm text-navy-900/70">
                A career that has grown from graphic design to senior visualisation, and now
                includes AI-powered creative work.
              </p>
            </div>

            <div className="lg:col-span-8">
              <ol className="space-y-5">
                {experience.map((e) => (
                  <li
                    key={e.company}
                    className="rounded-3xl border border-navy/10 bg-white p-7 md:p-8"
                  >
                    <p className="text-sm font-semibold text-sky-600">{e.period}</p>
                    <h3 className="mt-3">{e.role}</h3>
                    <p className="mt-2 text-lg text-navy-900/80">
                      {e.company}
                      {e.note ? <span className="text-navy-900/50"> · {e.note}</span> : null}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── SERVICES SUMMARY ───────── */}
      <section className="py-20 md:py-32">
        <div className="container-x">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Services</p>
              <h2 className="mt-4">How I can help.</h2>
            </div>
            <Link href="/services" className="btn-outline self-start md:self-auto">
              Service details →
            </Link>
          </div>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:mt-16">
            {services.map((s, i) => (
              <li
                key={s.title}
                className="card-hover rounded-2xl border border-navy/10 bg-white p-6 md:p-7"
              >
                <span className="display text-sm font-bold text-sky-600">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4">{s.title}</h3>
                <p className="mt-2 text-navy-900/70">{s.text}</p>
              </li>
            ))}
          </ul>

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

      {/* ───────── CONTACT CTA ───────── */}
      <section className="bg-navy py-24 text-white md:py-36">
        <div className="container-x">
          <p className="eyebrow !text-sky">Get in touch</p>
          <h2 className="mt-4 max-w-4xl !text-white">Let’s talk about your next project.</h2>
          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <Link href="/contact" className="btn-light">
              Get in Touch
            </Link>
            <Link href="/work" className="btn-outline-light">
              View Work
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
