import Link from 'next/link';
import { getProjects } from '../../lib/data';
import WorkGrid from './WorkGrid';

// Re-check Firestore at most once a minute so admin edits show up.
export const revalidate = 60;

export const metadata = {
  title: 'Work — Md Ayub Mondol',
  description:
    'Selected work by Md Ayub Mondol: brand identity, AI art, posters, social media, motion graphics and UI design.',
};

const BEHANCE_URL = 'https://www.behance.net/mdayubmondol0';

export default async function WorkPage() {
  // Server-side fetch: includes the Behance auto-sync merge (live covers +
  // links, plus any brand-new Behance projects).
  const projects = await getProjects();

  return (
    <>
      {/* ───────── HEADER (dark) ───────── */}
      <section className="relative overflow-hidden bg-navy-900 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-sky/20 blur-3xl"
        />
        <div className="container-x relative pb-10 pt-14 md:pb-14 md:pt-20 lg:pt-28">
          <p className="eyebrow !text-sky">Portfolio</p>
          <h1 className="mt-6 max-w-5xl !text-white">
            Selected <span className="text-sky">work.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
            {projects.length} projects across branding, posters, social media, motion
            graphics and UI. New work from Behance appears here automatically.
          </p>
        </div>
      </section>

      {/* ───────── FILTERS + GRID (dark) ───────── */}
      <section className="bg-navy-900 pb-20 text-white md:pb-32">
        <div className="container-x">
          <WorkGrid projects={projects} />
          <p className="mt-12 text-center text-sm text-white/50">
            New Behance projects appear here automatically, usually within an hour of
            publishing.{' '}
            <a
              href={BEHANCE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-sky transition-colors hover:text-white"
            >
              behance.net/mdayubmondol0 ↗
            </a>
          </p>
        </div>
      </section>

      {/* ───────── CONTACT CTA ───────── */}
      <section className="bg-navy py-24 text-white md:py-32">
        <div className="container-x">
          <p className="eyebrow !text-sky">Contact</p>
          <h2 className="mt-4 max-w-4xl !text-white">Let’s create something bold together.</h2>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/contact" className="btn-light">
              Get in Touch
            </Link>
            <Link href="/services" className="btn-outline-light">
              View Services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
