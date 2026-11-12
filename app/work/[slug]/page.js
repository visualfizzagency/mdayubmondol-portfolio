import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjects, getProject } from '../../../lib/data';
import { getCaseStudy } from '../../../data/case-studies';

// Re-check Firestore at most once a minute so admin edits show up.
export const revalidate = 60;

const BEHANCE_PROFILE_URL = 'https://www.behance.net/mdayubmondol0';

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const project = await getProject(params.slug);
  if (!project) {
    return { title: 'Project not found — Md Ayub Mondol' };
  }
  const study = getCaseStudy(project.slug);
  const fallback = `${project.title}: a ${project.category.toLowerCase()} project${
    project.year ? ` from ${project.year}` : ''
  } by Md Ayub Mondol.`;
  return {
    title: `${project.title} — Md Ayub Mondol`,
    description: study?.overview?.[0] || fallback,
  };
}

// Remove link / attribution lines that can come along with a Behance
// description, so only readable project text is shown.
function cleanDescription(text) {
  if (!text) return '';
  return String(text)
    .split(/\r?\n/)
    .filter((line) => {
      const l = line.trim();
      if (!l) return true;
      if (/https?:\/\//i.test(l)) return false;
      if (/^(source|view on behance|project in behance|behance)\b/i.test(l)) return false;
      return true;
    })
    .join('\n')
    .trim();
}

function Bullet() {
  return <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky" />;
}

function Items({ items }) {
  return (
    <ul className="mt-5 space-y-4">
      {items.map((item) => {
        const label = typeof item === 'string' ? null : item.label;
        const text = typeof item === 'string' ? item : item.text;
        return (
          <li key={label || text} className="flex gap-3">
            <Bullet />
            <span className="text-navy-900/80">
              {label ? <strong className="font-semibold text-navy">{label}</strong> : null}
              {label && text ? ' — ' : ''}
              {text}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export default async function ProjectPage({ params }) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  const projects = await getProjects();
  const study = getCaseStudy(project.slug);

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  const hasProjectUrl = Boolean(project.behanceUrl);
  const behanceHref = project.behanceUrl || BEHANCE_PROFILE_URL;

  const description = cleanDescription(project.description);
  const overview =
    study?.overview ||
    (description
      ? description.split(/\n{2,}/)
      : [
          `${project.title} is a ${project.category.toLowerCase()} project by Md Ayub Mondol${
            project.year ? `, completed in ${project.year}` : ''
          }.`,
        ]);

  const projectType = study?.projectType || project.category;
  const details = [
    { label: 'Category', value: project.category },
    ...(project.year ? [{ label: 'Year', value: String(project.year) }] : []),
    { label: 'Project type', value: projectType },
    ...(study?.details || []),
  ];

  const sections = study?.sections || [];

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
            {project.category}
            {project.year ? ` · ${project.year}` : ''}
          </p>
          <h1 className="mt-5 max-w-5xl text-balance break-words text-4xl leading-[1.08] sm:text-5xl lg:text-7xl">
            {project.title}
          </h1>

          <div className="mt-10">
            <a
              href={behanceHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              View on Behance ↗
            </a>
          </div>
        </div>
      </section>

      {/* ───────── COVER ───────── */}
      <section className="pb-16 md:pb-24">
        <div className="container-x">
          {project.cover ? (
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl bg-navy-50">
              <Image
                src={project.cover}
                alt={project.title}
                fill
                priority
                sizes="(min-width: 1024px) 1200px, 100vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div
              aria-hidden="true"
              className="aspect-[16/9] w-full rounded-3xl bg-gradient-to-br from-navy via-navy-600 to-sky-600"
            />
          )}
        </div>
      </section>

      {/* ───────── OVERVIEW + DETAILS ───────── */}
      <section className="bg-navy-50 py-20 md:py-28">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <p className="eyebrow">Overview</p>
              <h2 className="mt-4 text-4xl md:text-5xl">About the project.</h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-navy-900/75 md:text-lg">
                {overview.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                {!study ? (
                  <p>
                    {hasProjectUrl
                      ? 'The complete project, with all artwork and visuals, is on Behance.'
                      : 'More of my work is on Behance.'}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="lg:col-span-5">
              <p className="eyebrow">Project details</p>
              <dl className="mt-6 divide-y divide-navy/10 rounded-3xl border border-navy/10 bg-white">
                {details.map((d) => (
                  <div key={d.label} className="grid gap-1 px-6 py-5 sm:grid-cols-[8rem_1fr] sm:gap-4">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-navy-900/50">
                      {d.label}
                    </dt>
                    <dd className="font-semibold text-navy">{d.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── CASE-STUDY SECTIONS ───────── */}
      {sections.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="container-x">
            <p className="eyebrow">Case study</p>
            <div className="mt-8 border-b border-navy/10">
              {sections.map((s, i) => (
                <div
                  key={s.title}
                  className="grid gap-5 border-t border-navy/10 py-10 lg:grid-cols-12 lg:gap-12"
                >
                  <div className="lg:col-span-4">
                    <span className="display text-sm font-bold text-sky-600">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-2">{s.title}</h3>
                  </div>
                  <div className="lg:col-span-8">
                    {(s.paragraphs || []).map((p) => (
                      <p key={p} className="mb-4 text-base leading-relaxed text-navy-900/80 md:text-lg">
                        {p}
                      </p>
                    ))}
                    {s.items ? <Items items={s.items} /> : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────── HIGHLIGHTS + TOOLS (only when supplied) ───────── */}
      {(study?.highlights || study?.tools || study?.closing || study?.note) && (
        <section className="bg-navy-50 py-20 md:py-28">
          <div className="container-x">
            {study.highlights && (
              <div>
                <p className="eyebrow">Design Highlights</p>
                <ul className="mt-6 grid gap-4 md:grid-cols-2">
                  {study.highlights.map((h, i) => (
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
            )}

            {study.tools && (
              <div className={study.highlights ? 'mt-12' : ''}>
                <p className="eyebrow">Tools Used</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {study.tools.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {study.closing && (
              <p className="display mt-12 max-w-3xl text-balance text-2xl font-bold text-navy md:text-3xl">
                {study.closing}
              </p>
            )}
            {study.note && <p className="mt-6 text-sm text-navy-900/50">{study.note}</p>}
          </div>
        </section>
      )}

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
            <a
              href={behanceHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-sky"
            >
              View on Behance ↗
            </a>
            <Link href="/work" className="btn-outline-light">
              More Work
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
