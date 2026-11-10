import Link from 'next/link';

export const metadata = {
  title: 'Services — Md Ayub Mondol',
  description:
    'Brand identity design, AI-powered creative and AI art, UI/UX design, motion graphics, social media banners, and SEO & digital marketing by Md Ayub Mondol.',
};

const services = [
  {
    id: 'brand-identity-design',
    title: 'Brand Identity Design',
    tagline: 'Identities that are instantly recognisable',
    description:
      'From the first sketch of a logo to the guidelines that keep every touchpoint consistent, I build identity systems that help a brand look clear, confident and memorable.',
    included: [
      'Logo concepts, refinement and final artwork',
      'Colour palette and typography selection',
      'Brand guidelines that explain how to use the identity',
      'Applications such as stationery, packaging and vehicle branding',
    ],
    deliverables: [
      'Final logo files in vector and raster formats',
      'Brand guidelines document',
      'Colour and font specifications',
      'Application designs showing the brand in use',
    ],
  },
  {
    id: 'ai-powered-creative-ai-art',
    title: 'AI-Powered Creative / AI Art',
    tagline: 'Veo, AI images & prompt craft',
    description:
      'Cinematic AI video and AI-generated imagery, guided by careful prompt writing and finished with a designer’s eye so the result feels directed, not random.',
    included: [
      'Prompt writing and refinement for AI video (Veo) and AI images',
      'AI image generation and enhancement',
      'Concept and style development for AI-led visuals and campaigns',
      'Finishing and compositing of AI outputs with design tools',
    ],
    deliverables: [
      'Final AI images and video clips in the formats you need',
      'The prompts used, so results can be reproduced',
      'Prompt sheets for your own team on request',
    ],
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design',
    tagline: 'Clean, usable interfaces',
    description:
      'Interfaces designed in Figma with clear hierarchy, consistent components and a visual style that matches the brand behind them.',
    included: [
      'Wireframes and layout exploration',
      'Visual UI for web and mobile screens',
      'Consistent components, spacing and type styles',
      'Icon design for web and mobile',
    ],
    deliverables: [
      'Figma design files',
      'Exported assets and icons',
      'Style notes for hand-off to development',
    ],
  },
  {
    id: 'motion-graphics',
    title: 'Motion Graphics',
    tagline: 'Stories in motion',
    description:
      'Animated graphics and edited video that bring campaigns, lessons and announcements to life, paced so the message lands.',
    included: [
      'Animated graphics and typography',
      'Reel and short-form video editing',
      'Explainer-style motion pieces for education and marketing',
      'Aspect ratios and exports for social and web',
    ],
    deliverables: [
      'Final video exports in the formats you need',
      'Short reels and motion clips',
      'Editable project files on request',
    ],
  },
  {
    id: 'social-media-banners',
    title: 'Social Media Banners',
    tagline: 'Posts and banners that stop the scroll',
    description:
      'Eye-catching posts, banners and campaign series built to look consistent across platforms and to communicate the message in a glance.',
    included: [
      'Post and banner design for each platform',
      'Event, awareness and campaign creatives, including posters',
      'Matching series so a feed looks cohesive',
      'Sizing and safe areas for every placement',
    ],
    deliverables: [
      'Export-ready images for each platform',
      'Resized variants for different formats',
      'Editable source files on request',
    ],
  },
  {
    id: 'seo-digital-marketing',
    title: 'SEO & Digital Marketing',
    tagline: 'Be found, then be remembered',
    description:
      'Search-friendly content and digital marketing support that helps the right audience find your brand, backed by consistent visuals across every channel.',
    included: [
      'Keyword-informed titles, descriptions and headings',
      'Blog and content planning around what your audience searches for',
      'Campaign creatives for digital marketing',
      'Consistent visuals and messaging across channels',
    ],
    deliverables: [
      'Optimised titles and descriptions for your pages and posts',
      'Content outlines for blogs and landing pages',
      'Campaign creative sets in channel-ready sizes',
    ],
  },
];

function Bullet() {
  return <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky" />;
}

export default function ServicesPage() {
  return (
    <>
      {/* ───────── HERO ───────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-sky/20 blur-3xl"
        />
        <div className="container-x relative pb-16 pt-14 md:pb-24 md:pt-20 lg:pt-28">
          <p className="eyebrow">Services</p>
          <h1 className="mt-6 max-w-5xl">
            Six ways I can <span className="text-sky-500">bring your idea to life.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-navy-900/75 md:text-lg">
            Brand identity, AI-powered creative, UI/UX, motion graphics, social media banners and
            SEO &amp; digital marketing — all designed with the same care for clarity and detail.
          </p>

          <nav aria-label="Jump to a service" className="mt-10 flex flex-wrap gap-3">
            {services.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="rounded-full border border-navy/20 px-4 py-2 text-sm font-medium text-navy transition-colors hover:border-sky hover:text-sky-600"
              >
                {s.title}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* ───────── SERVICE DETAIL SECTIONS ───────── */}
      {services.map((s, i) => (
        <section
          key={s.id}
          id={s.id}
          className={`scroll-mt-20 py-20 md:py-28 ${i % 2 === 0 ? 'bg-navy-50' : 'bg-white'}`}
        >
          <div className="container-x">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-5">
                <span className="display text-6xl text-sky/60 md:text-7xl">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className="mt-4 text-4xl md:text-5xl">{s.title}</h2>
                <p className="eyebrow mt-4">{s.tagline}</p>
                <p className="mt-6 max-w-md text-base leading-relaxed text-navy-900/75 md:text-lg">
                  {s.description}
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:col-span-7">
                <div className="rounded-3xl border border-navy/10 bg-white p-7 md:p-8">
                  <h3>What’s included</h3>
                  <ul className="mt-5 space-y-3 text-navy-900/80">
                    {s.included.map((item) => (
                      <li key={item} className="flex gap-3">
                        <Bullet />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-3xl border border-navy/10 bg-white p-7 md:p-8">
                  <h3>Deliverables</h3>
                  <ul className="mt-5 space-y-3 text-navy-900/80">
                    {s.deliverables.map((item) => (
                      <li key={item} className="flex gap-3">
                        <Bullet />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ───────── FREE LEARNING ───────── */}
      <section className="py-16 md:py-24">
        <div className="container-x">
          <div className="flex flex-col gap-6 rounded-3xl border border-navy/10 p-8 md:flex-row md:items-center md:justify-between md:p-12">
            <div>
              <p className="eyebrow">Free</p>
              <h3 className="mt-3 max-w-2xl text-balance">
                Looking to learn? Explore the free course and downloads.
              </h3>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/course" className="btn-outline">
                Free course →
              </Link>
              <Link href="/resources" className="btn-outline">
                Free resources →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── CONTACT CTA ───────── */}
      <section className="bg-navy py-24 text-white md:py-36">
        <div className="container-x">
          <p className="eyebrow !text-sky">Contact</p>
          <h2 className="mt-4 max-w-4xl !text-white">Have a project in mind?</h2>
          <p className="mt-6 max-w-xl text-white/70">
            Tell me what you’re building and we’ll take it from there.
          </p>
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
