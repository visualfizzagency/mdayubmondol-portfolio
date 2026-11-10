import Link from 'next/link';

export const metadata = {
  title: 'Free Resources — Md Ayub Mondol',
  description:
    'Free design resources by Md Ayub Mondol: Bangla fonts, PSD files, an editable Ramadan calendar, a cricket logo vector and a promotional banner.',
};

const resources = [
  {
    title: '700 Stylish Bangla Fonts',
    type: 'Fonts',
    description: 'A collection of 700 stylish Bangla fonts for posters, banners and social posts.',
    post: 'free-bangla-font',
  },
  {
    title: '500+ Stylish Bangla Fonts',
    type: 'Fonts',
    description: 'A curated list of 500+ stylish Bangla fonts to browse and download.',
    post: 'top-500-stylish-bangla-fonts',
  },
  {
    title: 'Free PSD Files with Stunning Visual Effects',
    type: 'PSD',
    description: 'Editable PSD files with eye-catching visual effects, ready to customise.',
    post: 'free-psd-file-download',
  },
  {
    title: 'Ramadan Calendar — Editable',
    type: 'Template',
    description: 'An editable Ramadan calendar file, available in Bangla and English.',
    post: 'free-ramadan-calendar-editable',
  },
  {
    title: 'ICC Cricket T20 World Cup 2024 Logo Vector',
    type: 'Vector',
    description: 'The ICC Cricket T20 World Cup 2024 logo in vector format.',
    post: 'icc-cricket-t20-world-cup-2024-logo-vector-free-download',
  },
  {
    title: 'Protesters Promotional Banner',
    type: 'Banner',
    description: 'A promotional banner design for protesters, free to download.',
    post: 'protesters-promotional-banner-free-download',
  },
];

export default function ResourcesPage() {
  return (
    <>
      {/* ───────── HERO ───────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-sky/20 blur-3xl"
        />
        <div className="container-x relative pb-12 pt-14 md:pb-16 md:pt-20 lg:pt-28">
          <p className="eyebrow">Free Resources</p>
          <h1 className="mt-6 max-w-5xl">
            Free to download, <span className="text-sky-500">free to create.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-navy-900/75 md:text-lg">
            Fonts, files and templates shared to help designers and creators work faster.
          </p>
        </div>
      </section>

      {/* ───────── RESOURCE CARDS ───────── */}
      <section className="pb-20 md:pb-32">
        <div className="container-x">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((r, i) => (
              <article
                key={r.title}
                className="card-hover flex flex-col rounded-3xl border border-navy/10 bg-white p-7 md:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="display text-sm font-bold text-sky-600">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="rounded-full border border-navy/15 px-3 py-1 text-xs font-semibold text-navy">
                    {r.type}
                  </span>
                </div>

                <h3 className="mt-6 text-balance">{r.title}</h3>
                <p className="mt-3 text-navy-900/70">{r.description}</p>

                <div className="mt-auto pt-8">
                  {/* Placeholder: no real file yet. Replace with a link to the file when ready. */}
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-navy/10 px-7 py-3.5 text-sm font-semibold text-navy/60"
                  >
                    Download
                  </button>
                  <p className="mt-3 text-center text-xs text-navy-900/50">
                    Download file will be added.
                  </p>
                  <Link
                    href={`/blog/${r.post}`}
                    className="mt-4 block text-center text-sm font-semibold text-navy transition-colors hover:text-sky-600"
                  >
                    Read the blog post →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── COURSE + CONTACT CTA ───────── */}
      <section className="bg-navy py-24 text-white md:py-36">
        <div className="container-x">
          <p className="eyebrow !text-sky">Keep learning</p>
          <h2 className="mt-4 max-w-4xl !text-white">Want to learn design for free?</h2>
          <p className="mt-6 max-w-xl text-white/70">
            Check out the free Graphic Design For Daily Life course, or get in touch about a
            project.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/course" className="btn-light">
              View the Course
            </Link>
            <Link href="/contact" className="btn-outline-light">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
