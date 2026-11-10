import Link from 'next/link';

export const metadata = {
  title: 'Sora Invite Codes — What Happened | Md Ayub Mondol',
  description:
    'OpenAI discontinued the Sora app and web experience on April 26, 2026, so there are no Sora invite codes left to request. Here is the timeline and where to find official information.',
};

const OFFICIAL_URL =
  'https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation';

const timeline = [
  {
    when: 'September 30, 2025',
    text: 'OpenAI launched the Sora app with the Sora 2 video model. It started as an invite-only iOS app, first in the U.S. and Canada.',
  },
  {
    when: 'October 2025',
    text: 'For a limited time, OpenAI let people in some countries (including the U.S., Canada, Japan and South Korea) join without a code. The app also came to Android in select countries.',
  },
  {
    when: 'March 2026',
    text: 'OpenAI announced that it was shutting down the Sora app.',
  },
  {
    when: 'April 26, 2026',
    text: 'The Sora web and app experiences were discontinued.',
  },
  {
    when: 'September 24, 2026',
    text: 'The Sora API was discontinued.',
  },
];

const aiLinks = [
  {
    title: 'Veo prompt gallery',
    text: 'Cinematic AI video prompts written for Google Veo.',
    href: '/blog/veo-prompt-gallery-cinematic-ai-video-prompts-by-md-ayub-mondol',
  },
  {
    title: 'AI prompt for Veo',
    text: 'A Mountain Dew AI video made with Veo and a prompt generator.',
    href: '/blog/ai-prompt-for-veo',
  },
  {
    title: 'AI image prompt generator',
    text: 'Build a clean image prompt from subject, style, mood and aspect ratio.',
    href: '/tools/ai-prompt-generator',
  },
];

export default function SoraInviteCodeHubPage() {
  return (
    <>
      {/* ───────── HEADER ───────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-sky/20 blur-3xl"
        />
        <div className="container-x relative pb-10 pt-14 md:pb-14 md:pt-20 lg:pt-28">
          <p className="eyebrow">Info</p>
          <h1 className="mt-6 max-w-5xl">
            Sora invite codes: <span className="text-sky-500">what happened.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-navy-900/75 md:text-lg">
            People used to hunt for invite codes to get into OpenAI’s Sora app. Here’s a short,
            honest summary of where things stand.
          </p>
        </div>
      </section>

      {/* ───────── STATUS ───────── */}
      <section className="pb-12 md:pb-16">
        <div className="container-x">
          <div className="rounded-3xl border border-sky/50 bg-sky/10 p-7 md:p-10">
            <p className="eyebrow">Status — November 2026</p>
            <h2 className="mt-4 text-3xl md:text-5xl">Sora has been discontinued.</h2>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-navy-900/80 md:text-lg">
              OpenAI discontinued the Sora web and app experiences on April 26, 2026, and the Sora
              API on September 24, 2026. That means there are no invite codes left to request or
              use, so this page doesn’t collect invite requests.
            </p>
            <a
              href={OFFICIAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-8"
            >
              Read OpenAI’s official notice ↗
            </a>
          </div>
        </div>
      </section>

      {/* ───────── TIMELINE ───────── */}
      <section className="bg-navy-50 py-20 md:py-28">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow">Timeline</p>
              <h2 className="mt-4 text-4xl md:text-5xl">How it unfolded.</h2>
            </div>
            <ol className="space-y-5 lg:col-span-8">
              {timeline.map((t) => (
                <li
                  key={t.when}
                  className="rounded-3xl border border-navy/10 bg-white p-6 md:p-8"
                >
                  <p className="text-sm font-semibold text-sky-600">{t.when}</p>
                  <p className="mt-3 text-navy-900/80">{t.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ───────── WHAT INVITE CODES WERE + SAFETY ───────── */}
      <section className="py-20 md:py-28">
        <div className="container-x">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl border border-navy/10 p-7 md:p-10">
              <p className="eyebrow">What they were</p>
              <h3 className="mt-3">Access keys, not a product.</h3>
              <p className="mt-4 text-navy-900/75">
                During the invite-only period, an invite code was a short code that unlocked access
                to the Sora app. Codes were meant to be shared for free between users, and OpenAI’s
                rules did not allow selling them.
              </p>
            </div>
            <div className="rounded-3xl border border-navy/10 p-7 md:p-10">
              <p className="eyebrow">Stay safe</p>
              <h3 className="mt-3">Be cautious of anyone still offering codes.</h3>
              <p className="mt-4 text-navy-900/75">
                Because Sora has been discontinued, there is nothing real left to sell. Be careful
                with any site, listing or seller offering Sora invite codes or paid Sora access,
                and never share your OpenAI or ChatGPT password with anyone.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-3xl border border-navy/10 p-7 md:p-10">
            <p className="eyebrow">Your Sora content</p>
            <p className="mt-3 max-w-3xl text-navy-900/75">
              OpenAI’s help article explains what happens to content you created in Sora,
              including exports, data deletion, refunds and credits. Deadlines may apply, so check
              it directly.
            </p>
            <a
              href={OFFICIAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline mt-6"
            >
              OpenAI help article ↗
            </a>
          </div>
        </div>
      </section>

      {/* ───────── ALTERNATIVES ───────── */}
      <section className="bg-navy-50 py-20 md:py-28">
        <div className="container-x">
          <p className="eyebrow">Keep creating</p>
          <h2 className="mt-4 max-w-3xl text-4xl md:text-5xl">Looking for AI video ideas?</h2>
          <p className="mt-5 max-w-2xl text-navy-900/75">
            Sora is gone, but AI video and image creation isn’t. These guides and tools from this
            site might help.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {aiLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="card-hover block rounded-3xl border border-navy/10 bg-white p-7"
              >
                <h3>{l.title} →</h3>
                <p className="mt-3 text-navy-900/70">{l.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── DISCLAIMER + CTA ───────── */}
      <section className="bg-navy py-24 text-white md:py-32">
        <div className="container-x">
          <p className="eyebrow !text-sky">Contact</p>
          <h2 className="mt-4 max-w-4xl !text-white">Questions about AI creative work?</h2>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/contact" className="btn-light">
              Get in Touch
            </Link>
            <Link href="/blog" className="btn-outline-light">
              Read the blog
            </Link>
          </div>
          <p className="mt-12 max-w-2xl text-sm text-white/60">
            This page is independent and is not affiliated with, endorsed by or sponsored by
            OpenAI. Sora is a trademark of its owner.
          </p>
        </div>
      </section>
    </>
  );
}
