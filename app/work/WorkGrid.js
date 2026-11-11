'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const cardGradients = [
  'from-navy to-navy-500',
  'from-navy-700 to-sky-600',
  'from-sky-500 to-navy-600',
  'from-navy-800 to-navy-400',
  'from-navy-600 to-sky-500',
  'from-navy-900 to-navy-500',
];

function CardInner({ p, index }) {
  return (
    <>
      {p.cover ? (
        <Image
          src={p.cover}
          alt={p.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
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
      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/95 via-navy-900/40 to-transparent" />
      <span
        aria-hidden="true"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-sky text-xl text-navy-900 opacity-0 transition-all duration-300 group-hover:opacity-100"
      >
        ↗
      </span>
      {p.year ? (
        <span className="absolute left-6 top-5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wider text-white backdrop-blur">
          {p.year}
        </span>
      ) : null}
      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="mono text-[11px] uppercase tracking-[0.22em] text-sky">
          {p.category}
          {p.behanceUrl ? ' · Behance' : ''}
        </p>
        <h3 className="mt-2 !text-white">{p.title}</h3>
      </div>
    </>
  );
}

export default function WorkGrid({ projects }) {
  const [selected, setActive] = useState('All');

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
                  ? 'border-sky bg-sky text-navy-900'
                  : 'border-white/20 bg-transparent text-white/80 hover:border-sky hover:text-sky'
              }`}
            >
              {cat}
              <span className={`ml-2 text-xs ${isActive ? 'text-navy-900/60' : 'text-white/40'}`}>
                {countFor(cat)}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-sm text-white/50" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? 'project' : 'projects'}
        {active !== 'All' ? ` in ${active}` : ''}
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => {
          const external = p.behanceOnly && p.behanceUrl;
          const className =
            'card-hover group relative block aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-navy-800';
          const inner = <CardInner p={p} index={p.index} />;
          return external ? (
            <a
              key={p.slug}
              href={p.behanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
            >
              {inner}
            </a>
          ) : (
            <Link key={p.slug} href={`/work/${p.slug}`} className={className}>
              {inner}
            </Link>
          );
        })}
      </div>
    </>
  );
}
