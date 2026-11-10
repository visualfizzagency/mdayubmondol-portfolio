'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getProjects, getStaticProjects } from '../../lib/data';

const cardGradients = [
  'from-navy to-navy-500',
  'from-navy-700 to-sky-600',
  'from-sky-500 to-navy-600',
  'from-navy-800 to-navy-400',
  'from-navy-600 to-sky-500',
  'from-navy-900 to-navy-500',
];

export default function WorkPage() {
  // Start with the bundled data so the page renders immediately, then swap in
  // Firestore data (falls back to the bundled data if Firestore is unavailable).
  const [projects, setProjects] = useState(getStaticProjects);
  const [selected, setActive] = useState('All');

  useEffect(() => {
    let alive = true;
    getProjects().then((rows) => {
      if (alive) setProjects(rows);
    });
    return () => {
      alive = false;
    };
  }, []);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects]
  );
  const active = categories.includes(selected) ? selected : 'All';

  const countFor = (cat) =>
    cat === 'All' ? projects.length : projects.filter((p) => p.category === cat).length;

  // keep the original index so each card keeps the same number + colour when filtering
  const visible = projects
    .map((p, i) => ({ ...p, index: i }))
    .filter((p) => active === 'All' || p.category === active);

  return (
    <>
      {/* ───────── HEADER ───────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-sky/20 blur-3xl"
        />
        <div className="container-x relative pb-10 pt-14 md:pb-14 md:pt-20 lg:pt-28">
          <p className="eyebrow">Portfolio</p>
          <h1 className="mt-6 max-w-5xl">
            Selected <span className="text-sky-500">work.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-navy-900/75 md:text-lg">
            {projects.length} projects across branding, posters, social media, motion and UI.
          </p>
        </div>
      </section>

      {/* ───────── FILTERS + GRID ───────── */}
      <section className="pb-20 md:pb-32">
        <div className="container-x">
          <div className="flex flex-wrap gap-2 md:gap-3" role="group" aria-label="Filter projects by category">
            {categories.map((cat) => {
              const isActive = cat === active;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActive(cat)}
                  aria-pressed={isActive}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                    isActive
                      ? 'border-navy bg-navy text-white'
                      : 'border-navy/20 bg-white text-navy hover:border-sky hover:text-sky-600'
                  }`}
                >
                  {cat}
                  <span className={`ml-2 text-xs ${isActive ? 'text-sky' : 'text-navy-900/50'}`}>
                    {countFor(cat)}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mt-6 text-sm text-navy-900/60" aria-live="polite">
            Showing {visible.length} {visible.length === 1 ? 'project' : 'projects'}
            {active !== 'All' ? ` in ${active}` : ''}
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => (
              <Link
                key={p.slug}
                href={`/work/${p.slug}`}
                className="card-hover group block overflow-hidden rounded-3xl border border-navy/10 bg-white"
              >
                <div
                  className={`relative aspect-[4/3] bg-gradient-to-br ${cardGradients[p.index % cardGradients.length]}`}
                >
                  <span className="display absolute left-6 top-4 text-6xl text-white/20 md:text-7xl">
                    {String(p.index + 1).padStart(2, '0')}
                  </span>
                  <span className="absolute bottom-5 left-6 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wider text-white backdrop-blur">
                    {p.year}
                  </span>
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
