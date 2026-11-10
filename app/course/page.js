import Link from 'next/link';

export const metadata = {
  title: 'Graphic Design For Daily Life — Free Course | Md Ayub Mondol',
  description:
    'Graphic Design For Daily Life: a free course from basic to advanced by Md Ayub Mondol. Design basics, colour, typography, logo and brand basics, social media design and practical projects.',
};

const modules = [
  {
    title: 'Design Basics',
    summary: 'The core ideas behind every good design.',
    lessons: [
      'What graphic design is and where it shows up in daily life',
      'Principles of graphic design: balance, contrast, hierarchy and alignment',
      'Layout and composition fundamentals',
    ],
  },
  {
    title: 'Colour',
    summary: 'Choosing and combining colour with purpose.',
    lessons: [
      'How colour works and how it affects mood and meaning',
      'Building a colour palette',
      'Using colour consistently across a design',
    ],
  },
  {
    title: 'Typography',
    summary: 'Making text clear, readable and expressive.',
    lessons: [
      'Types of fonts and how to choose the right one',
      'Pairing fonts and setting hierarchy',
      'Spacing, size and readability',
    ],
  },
  {
    title: 'Logo & Brand Basics',
    summary: 'The building blocks of a simple brand.',
    lessons: [
      'What makes a logo work',
      'Brand colours, fonts and consistency',
      'Putting a basic brand identity together',
    ],
  },
  {
    title: 'Social Media Design',
    summary: 'Designing posts and banners for everyday use.',
    lessons: [
      'Sizes and formats for common platforms',
      'Designing posts, banners and series that look cohesive',
      'Keeping messages short, clear and eye-catching',
    ],
  },
  {
    title: 'Practical Daily-Life Projects',
    summary: 'Put everything into practice.',
    lessons: [
      'Hands-on design exercises based on everyday needs',
      'Reviewing and improving your own work',
      'Next steps from basic to advanced',
    ],
  },
];

export default function CoursePage() {
  return (
    <>
      {/* ───────── HERO ───────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-sky/20 blur-3xl"
        />
        <div className="container-x relative pb-16 pt-14 md:pb-24 md:pt-20 lg:pt-28">
          <div className="flex flex-wrap items-center gap-3">
            <p className="eyebrow">Course</p>
            <span className="rounded-full bg-sky px-3 py-1 text-xs font-bold uppercase tracking-wider text-navy-900">
              Free
            </span>
          </div>
          <h1 className="mt-6 max-w-5xl">
            Graphic Design For <span className="text-sky-500">Daily Life.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-navy-900/75 md:text-lg">
            A free course by Md Ayub Mondol that takes you from the basics to more advanced
            design, with a focus on skills you can use in everyday life.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/contact" className="btn-primary">
              Enquire / Enrol
            </Link>
            <a href="#modules" className="btn-outline">
              See what it covers
            </a>
          </div>
        </div>
      </section>

      {/* ───────── MODULES ───────── */}
      <section id="modules" className="scroll-mt-20 bg-navy-50 py-20 md:py-32">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow">Curriculum</p>
              <h2 className="mt-4">What it covers.</h2>
              <p className="mt-6 text-navy-900/75">
                Six modules, from design basics to practical projects.
              </p>
            </div>

            <ol className="space-y-5 lg:col-span-8">
              {modules.map((m, i) => (
                <li
                  key={m.title}
                  className="card-hover rounded-3xl border border-navy/10 bg-white p-7 md:p-8"
                >
                  <div className="flex items-start gap-5">
                    <span className="display text-4xl text-sky/70 md:text-5xl">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="eyebrow">Module {i + 1}</p>
                      <h3 className="mt-2">{m.title}</h3>
                      <p className="mt-2 text-navy-900/70">{m.summary}</p>
                    </div>
                  </div>
                  <ul className="mt-6 space-y-3 border-t border-navy/10 pt-6 text-navy-900/80">
                    {m.lessons.map((l) => (
                      <li key={l} className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky"
                        />
                        <span>{l}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ───────── BLOG LINK ───────── */}
      <section className="py-16 md:py-24">
        <div className="container-x">
          <div className="flex flex-col gap-6 rounded-3xl border border-navy/10 p-8 md:flex-row md:items-center md:justify-between md:p-12">
            <div>
              <p className="eyebrow">Announcement</p>
              <h3 className="mt-3 max-w-2xl text-balance">
                Read the original course announcement on the blog.
              </h3>
            </div>
            <Link
              href="/blog/graphic-design-for-daily-life-basic-to-advanced-course-free-course-by-md-ayub-mondol"
              className="btn-outline self-start md:self-auto"
            >
              Read the post →
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── CONTACT CTA ───────── */}
      <section className="bg-navy py-24 text-white md:py-36">
        <div className="container-x">
          <p className="eyebrow !text-sky">Enrol</p>
          <h2 className="mt-4 max-w-4xl !text-white">Ready to start learning design?</h2>
          <p className="mt-6 max-w-xl text-white/70">
            The course is free. Get in touch to enquire or enrol.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/contact" className="btn-light">
              Enquire / Enrol
            </Link>
            <Link href="/resources" className="btn-outline-light">
              Free Resources
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
