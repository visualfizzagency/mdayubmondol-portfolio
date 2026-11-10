import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPosts, getPost } from '../../../lib/data';

// Re-check Firestore at most once a minute so admin edits show up.
export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  if (!post) {
    return { title: 'Post not found — Md Ayub Mondol' };
  }
  return {
    title: `${post.title} — Md Ayub Mondol`,
    description: `${post.category} — ${post.title}. Published ${post.date} by Md Ayub Mondol.`,
  };
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export default async function BlogPostPage({ params }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const posts = await getPosts();
  const related = posts
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  return (
    <>
      {/* ───────── HEADER ───────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-sky/20 blur-3xl"
        />
        <div className="container-x relative pb-10 pt-12 md:pb-14 md:pt-16 lg:pt-24">
          <Link
            href="/blog"
            className="text-sm font-semibold text-navy transition-colors hover:text-sky-600"
          >
            ← All posts
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-navy px-3 py-1 text-xs font-semibold text-white">
              {post.category}
            </span>
            <time dateTime={post.date} className="text-sm font-medium text-sky-600">
              {formatDate(post.date)}
            </time>
          </div>

          <h1 className="mt-6 max-w-5xl text-balance break-words text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">
            {post.title}
          </h1>
        </div>
      </section>

      {/* ───────── BODY PLACEHOLDER ───────── */}
      <section className="pb-16 md:pb-24">
        <div className="container-x">
          <article className="max-w-3xl">
            <p className="text-lg leading-relaxed text-navy-900/80 md:text-xl">{post.excerpt}</p>

            <div className="mt-10 rounded-3xl border border-navy/10 bg-navy-50 p-7 md:p-8">
              <p className="eyebrow">Note</p>
              <p className="mt-3 text-navy-900/75">
                This is placeholder text. The full article text loads from the Firestore seed
                once it is connected.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* ───────── RELATED POSTS ───────── */}
      {related.length > 0 && (
        <section className="bg-navy-50 py-16 md:py-24">
          <div className="container-x">
            <p className="eyebrow">Related posts</p>
            <h2 className="mt-4 text-4xl md:text-5xl">More in {post.category}.</h2>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="card-hover group block rounded-3xl border border-navy/10 bg-white p-7"
                >
                  <time dateTime={r.date} className="text-sm font-medium text-sky-600">
                    {formatDate(r.date)}
                  </time>
                  <h3 className="mt-4 text-balance">{r.title}</h3>
                </Link>
              ))}
            </div>

            <div className="mt-10">
              <Link href="/blog" className="btn-outline">
                Back to all posts
              </Link>
            </div>
          </div>
        </section>
      )}

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
