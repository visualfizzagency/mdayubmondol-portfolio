'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getPosts, getStaticPosts } from '../../lib/data';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export default function BlogPage() {
  // Start with the bundled data so the page renders immediately, then swap in
  // Firestore data (falls back to the bundled data if Firestore is unavailable).
  const [posts, setPosts] = useState(getStaticPosts);
  const [query, setQuery] = useState('');
  const [selected, setActive] = useState('All');

  useEffect(() => {
    let alive = true;
    getPosts().then((rows) => {
      if (alive) setPosts(rows);
    });
    return () => {
      alive = false;
    };
  }, []);

  // Newest first
  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [posts]
  );
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(sortedPosts.map((p) => p.category)))],
    [sortedPosts]
  );
  const active = categories.includes(selected) ? selected : 'All';

  const countFor = (cat) =>
    cat === 'All' ? sortedPosts.length : sortedPosts.filter((p) => p.category === cat).length;

  const q = query.trim().toLowerCase();
  const visible = sortedPosts.filter(
    (p) =>
      (active === 'All' || p.category === active) &&
      (q === '' || p.title.toLowerCase().includes(q))
  );

  return (
    <>
      {/* ───────── HEADER ───────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-sky/20 blur-3xl"
        />
        <div className="container-x relative pb-10 pt-14 md:pb-14 md:pt-20 lg:pt-28">
          <p className="eyebrow">Journal</p>
          <h1 className="mt-6 max-w-5xl">
            The <span className="text-sky-500">blog.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-navy-900/75 md:text-lg">
            {sortedPosts.length} posts on AI prompts, design trends, branding, typography, free
            resources and more.
          </p>
        </div>
      </section>

      {/* ───────── SEARCH + FILTERS + LIST ───────── */}
      <section className="pb-20 md:pb-32">
        <div className="container-x">
          <div className="relative max-w-xl">
            <label htmlFor="blog-search" className="sr-only">
              Search posts by title
            </label>
            <input
              id="blog-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search post titles…"
              className="w-full rounded-full border border-navy/20 bg-white px-6 py-3.5 text-base text-navy-900 placeholder:text-navy-900/40 focus:border-sky focus:outline-none focus:ring-4 focus:ring-sky/20"
            />
          </div>

          <div
            className="mt-6 flex flex-wrap gap-2 md:gap-3"
            role="group"
            aria-label="Filter posts by category"
          >
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
            Showing {visible.length} {visible.length === 1 ? 'post' : 'posts'}
            {active !== 'All' ? ` in ${active}` : ''}
            {q ? ` matching “${query.trim()}”` : ''}
          </p>

          {visible.length > 0 ? (
            <div className="mt-6 border-b border-navy/10">
              {visible.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group grid gap-3 border-t border-navy/10 py-6 transition-colors hover:bg-navy-50 md:grid-cols-[9rem_1fr_auto] md:items-center md:gap-8 md:px-4 md:py-7"
                >
                  <div className="flex items-center justify-between gap-3 md:block">
                    <time dateTime={post.date} className="text-sm font-medium text-sky-600">
                      {formatDate(post.date)}
                    </time>
                    <span className="rounded-full border border-navy/15 px-3 py-1 text-xs font-semibold text-navy md:hidden">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-balance">{post.title}</h3>
                  <span className="hidden items-center gap-4 md:flex">
                    <span className="rounded-full border border-navy/15 px-3 py-1 text-xs font-semibold text-navy">
                      {post.category}
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-2xl text-navy transition-transform duration-300 group-hover:translate-x-2"
                    >
                      →
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-3xl border border-navy/10 bg-navy-50 p-10 text-center">
              <p className="display text-2xl font-bold text-navy">No posts found.</p>
              <p className="mt-3 text-navy-900/70">Try a different search or category.</p>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setActive('All');
                }}
                className="btn-outline mt-6"
              >
                Clear filters
              </button>
            </div>
          )}
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
            <Link href="/work" className="btn-outline-light">
              View Work
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
