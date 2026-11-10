import Link from 'next/link';

export const metadata = {
  title: 'About — Md Ayub Mondol',
  description:
    'Md Ayub Mondol is a graphic designer and AI artist from Dhaka, Bangladesh. Sr. Visualizer at Edison Group (Symphony, Helio) with 7+ years of experience.',
};

const experience = [
  {
    period: '2026 — Present',
    role: 'Sr. Visualizer',
    company: 'Edison Group',
    note: 'Symphony, Helio',
  },
  {
    period: '2023 — 2026',
    role: 'Senior Graphic Designer',
    company: 'NexGen Global Group',
    note: '',
  },
];

const earlier = ['AKS Pharmacy', 'DX360', 'Honda Life'];

const services = [
  'Logo & Brand Identity',
  'Social Media Design',
  'AI Video & Motion Design',
  'Graphic Design & Print',
  'Web & UI Design',
  'Free Resources & Courses',
];

const tools = [
  'Photoshop',
  'Illustrator',
  'After Effects',
  'Premiere Pro',
  'CapCut',
  'Figma',
];

export default function AboutPage() {
  return (
    <>
      {/* ───────── HERO ───────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-sky/20 blur-3xl"
        />
        <div className="container-x relative pb-16 pt-14 md:pb-24 md:pt-20 lg:pt-28">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <p className="eyebrow">About — Dhaka, Bangladesh</p>
              <h1 className="mt-6">
                Designer, visualizer &amp; <span className="text-sky-500">AI artist.</span>
              </h1>
              <p className="mt-8 max-w-xl text-base leading-relaxed text-navy-900/75 md:text-lg">
                I’m Md Ayub Mondol, a graphic designer and AI artist based in Dhaka. I’m
                currently a Sr. Visualizer at Edison Group (Symphony, Helio), with 7+ years of
                experience turning ideas into clear, bold visuals.
              </p>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-navy-900/75 md:text-lg">
                Beyond client work, I share free resources, design courses and AI prompt guides
                on the blog.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link href="/work" className="btn-primary">
                  View Work
                </Link>
                <Link href="/contact" className="btn-outline">
                  Get in Touch
                </Link>
              </div>
            </div>

            <div className="mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none">
              <div className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy via-navy-600 to-sky-600 shadow-2xl shadow-navy/30">
                <div
                  aria-hidden="true"
                  className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-sky/30 blur-2xl"
                />
                <span className="display relative text-[7rem] font-extrabold text-white/90 md:text-[9rem]">
                  AM
                </span>
                <p className="absolute inset-x-6 bottom-6 text-center text-xs text-white/70">
                  Portrait placeholder — replace with /public/images/portrait.jpg
                </p>
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
              <h2 className="mt-4">7+ years of craft.</h2>
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

              <div className="mt-8 rounded-3xl border border-navy/10 bg-white p-7 md:p-8">
                <p className="eyebrow">Earlier experience</p>
                <p className="mt-4 text-navy-900/75">
                  Previous work with{' '}
                  {earlier.map((c, i) => (
                    <span key={c}>
                      <span className="font-semibold text-navy">{c}</span>
                      {i < earlier.length - 2 ? ', ' : i === earlier.length - 2 ? ' and ' : ''}
                    </span>
                  ))}
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── SERVICES SUMMARY ───────── */}
      <section className="py-20 md:py-32">
        <div className="container-x">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">What I do</p>
              <h2 className="mt-4">Services.</h2>
            </div>
            <Link href="/services" className="btn-outline self-start md:self-auto">
              Service details →
            </Link>
          </div>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:mt-16">
            {services.map((s, i) => (
              <li
                key={s}
                className="card-hover flex items-center gap-4 rounded-2xl border border-navy/10 bg-white p-5 md:p-6"
              >
                <span className="display text-sm font-bold text-sky-600">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="display text-lg font-bold text-navy md:text-xl">{s}</span>
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
          <p className="eyebrow !text-sky">Contact</p>
          <h2 className="mt-4 max-w-4xl !text-white">Let’s create something bold together.</h2>
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
