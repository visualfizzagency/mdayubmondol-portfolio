import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjects, getProject } from '../../../lib/data';

// Re-check Firestore at most once a minute so admin edits show up.
export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const project = await getProject(params.slug);
  if (!project) {
    return { title: 'Project not found — Md Ayub Mondol' };
  }
  return {
    title: `${project.title} — Md Ayub Mondol`,
    description: `${project.title}: a ${project.category.toLowerCase()} project from ${project.year} by Md Ayub Mondol.`,
  };
}

// Category-level placeholder content. Replace per project with real case-study
// text once the final write-ups are ready.
const categoryInfo = {
  'Poster Design': {
    type: 'Digital & print poster',
    tools: ['Photoshop', 'Illustrator'],
    highlights: [
      'Bold focal point and clear visual hierarchy',
      'Typography chosen to carry the message at a glance',
      'Colour and contrast built for both print and screen',
    ],
  },
  Advertisement: {
    type: 'Advertising creative',
    tools: ['Photoshop', 'Illustrator'],
    highlights: [
      'Product-led composition with one clear message',
      'Lighting and depth that make the subject stand out',
      'Layouts that adapt across posters, banners and social placements',
    ],
  },
  Sports: {
    type: 'Sports graphics',
    tools: ['Photoshop', 'Illustrator'],
    highlights: [
      'High-energy layout with strong typographic structure',
      'Clear, scannable information design',
      'Colour palette built around the mood of the event',
    ],
  },
  Billboard: {
    type: 'Large-format outdoor advertising',
    tools: ['Photoshop', 'Illustrator'],
    highlights: [
      'Short, legible messaging that reads from a distance',
      'High-contrast composition for large-format viewing',
      'Print-ready setup for oversized output',
    ],
  },
  Campaign: {
    type: 'Multi-asset campaign',
    tools: ['Photoshop', 'Illustrator'],
    highlights: [
      'One visual idea carried across every asset',
      'Consistent typography and colour system',
      'Formats adapted for digital and print placements',
    ],
  },
  'Social Media': {
    type: 'Social media creative',
    tools: ['Photoshop', 'Illustrator'],
    highlights: [
      'A scroll-stopping first impression',
      'Platform-specific sizing and safe areas',
      'A consistent look across a series of posts',
    ],
  },
  'Motion Graphics': {
    type: 'Motion graphics & video',
    tools: ['After Effects', 'Premiere Pro', 'CapCut'],
    highlights: [
      'Pacing and transitions that carry the story',
      'Animated type and graphics aligned with the message',
      'Exports prepared for social and web playback',
    ],
  },
  Branding: {
    type: 'Branding & identity',
    tools: ['Illustrator', 'Photoshop'],
    highlights: [
      'A cohesive identity applied across touchpoints',
      'Logo, colour and type working as one system',
      'Application designs that show the brand in use',
    ],
  },
  Typography: {
    type: 'Typographic design',
    tools: ['Illustrator', 'Photoshop'],
    highlights: [
      'Letterforms and layout shaped around the message',
      'Careful spacing, weight and scale',
      'A hierarchy and rhythm that let the words lead',
    ],
  },
  Education: {
    type: 'Education marketing creative',
    tools: ['Photoshop', 'Illustrator'],
    highlights: [
      'Clear, trustworthy information hierarchy',
      'A friendly, approachable visual tone',
      'Reusable layouts for consistent posting',
    ],
  },
  'UI Design': {
    type: 'User interface design',
    tools: ['Figma'],
    highlights: [
      'Clear visual hierarchy for fast scanning',
      'Consistent components and spacing',
      'Layouts built for readability on screen',
    ],
  },
};

const fallbackInfo = {
  type: 'Graphic design',
  tools: ['Photoshop', 'Illustrator'],
  highlights: [
    'Clear visual hierarchy',
    'Consistent typography and colour',
    'Layouts prepared for their final use',
  ],
};

const galleryBlocks = [
  { span: 'md:col-span-6', ratio: 'aspect-[16/9]', tone: 'from-navy to-navy-500' },
  { span: 'md:col-span-3', ratio: 'aspect-[4/3]', tone: 'from-navy-700 to-sky-600' },
  { span: 'md:col-span-3', ratio: 'aspect-[4/3]', tone: 'from-sky-500 to-navy-600' },
  { span: 'md:col-span-2', ratio: 'aspect-[4/5]', tone: 'from-navy-800 to-navy-400' },
  { span: 'md:col-span-2', ratio: 'aspect-[4/5]', tone: 'from-navy-600 to-sky-500' },
  { span: 'md:col-span-2', ratio: 'aspect-[4/5]', tone: 'from-navy-900 to-navy-500' },
];

export default async function ProjectPage({ params }) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  const projects = await getProjects();

  const info = categoryInfo[project.category] || fallbackInfo;
  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      {/* ───────── HEADER ───────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-sky/20 blur-3xl"
        />
        <div className="container-x relative pb-12 pt-12 md:pb-16 md:pt-16 lg:pt-24">
          <Link
            href="/work"
            className="text-sm font-semibold text-navy transition-colors hover:text-sky-600"
          >
            ← All work
          </Link>

          <p className="eyebrow mt-8">
            {project.category} · {project.year}
          </p>
          <h1 className="mt-5 max-w-5xl text-balance break-words text-4xl leading-[1.08] sm:text-5xl lg:text-7xl">
            {project.title}
          </h1>

          <dl className="mt-10 grid max-w-xl grid-cols-2 gap-6 border-t border-navy/10 pt-8">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-navy-900/50">
                Category
              </dt>
              <dd className="mt-2 text-lg font-semibold text-navy">{project.category}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-navy-900/50">
                Year
              </dt>
              <dd className="mt-2 text-lg font-semibold text-navy">{project.year}</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ───────── GALLERY PLACEHOLDER ───────── */}
      <section className="pb-16 md:pb-24">
        <div className="container-x">
          <div className="grid gap-4 md:grid-cols-6 md:gap-6">
            {galleryBlocks.map((b, i) => (
              <div
                key={i}
                className={`relative flex w-full items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br ${b.tone} ${b.ratio} ${b.span}`}
              >
                <span className="display absolute left-5 top-3 text-5xl text-white/20">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="px-6 text-center text-xs text-white/70">
                  Gallery placeholder — project visual {i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── OVERVIEW + HIGHLIGHTS ───────── */}
      <section className="bg-navy-50 py-20 md:py-28">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <p className="eyebrow">Overview</p>
              <h2 className="mt-4 text-4xl md:text-5xl">About the project.</h2>
              <p className="mt-6 text-base leading-relaxed text-navy-900/75 md:text-lg">
                {project.title} is a {project.category.toLowerCase()} project designed by Md
                Ayub Mondol in {project.year}.
              </p>
              <p className="mt-4 text-base leading-relaxed text-navy-900/75 md:text-lg">
                The full case study — the brief, the process and the final visuals — will be
                added here.
              </p>
            </div>

            <div className="lg:col-span-6">
              <p className="eyebrow">Design Highlights</p>
              <ul className="mt-6 space-y-4">
                {info.highlights.map((h, i) => (
                  <li
                    key={h}
                    className="flex gap-4 rounded-2xl border border-navy/10 bg-white p-5"
                  >
                    <span className="display text-sm font-bold text-sky-600">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-navy-900/80">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl border border-navy/10 bg-white p-7 md:p-8">
              <p className="eyebrow">Tools Used</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {info.tools.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-navy/10 bg-white p-7 md:p-8">
              <p className="eyebrow">Project Type</p>
              <p className="display mt-5 text-2xl font-bold text-navy md:text-3xl">
                {info.type}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── NEXT PROJECT ───────── */}
      <section className="py-16 md:py-24">
        <div className="container-x">
          <p className="eyebrow">Next project</p>
          <Link
            href={`/work/${next.slug}`}
            className="group mt-4 flex items-start justify-between gap-6 border-t border-navy/10 pt-6"
          >
            <span className="display text-balance text-3xl text-navy transition-colors group-hover:text-sky-600 md:text-5xl">
              {next.title}
            </span>
            <span
              aria-hidden="true"
              className="text-3xl text-navy transition-transform duration-300 group-hover:translate-x-2 md:text-5xl"
            >
              →
            </span>
          </Link>
        </div>
      </section>

      {/* ───────── CONTACT CTA ───────── */}
      <section className="bg-navy py-24 text-white md:py-32">
        <div className="container-x">
          <p className="eyebrow !text-sky">Contact</p>
          <h2 className="mt-4 max-w-4xl !text-white">Like what you see? Let’s talk.</h2>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/contact" className="btn-light">
              Get in Touch
            </Link>
            <Link href="/work" className="btn-outline-light">
              More Work
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
