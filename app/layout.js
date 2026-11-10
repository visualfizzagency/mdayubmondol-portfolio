import { Inter, Inter_Tight } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata = {
  title: 'Md Ayub Mondol — Graphic Designer & AI Artist',
  description:
    'Md Ayub Mondol is a Sr. Visualizer in Dhaka, Bangladesh with 7+ years of experience in brand identity, AI art, UI/UX, motion graphics and digital marketing.',
  openGraph: {
    title: 'Md Ayub Mondol — Graphic Designer & AI Artist',
    description:
      'Sr. Visualizer in Dhaka, Bangladesh. 7+ years of experience in brand identity, AI art, UI/UX and motion graphics.',
    type: 'website',
  },
};

const EMAIL = 'hellomdayub@gmail.com';
const PHONE = '01886588884';
const BEHANCE_URL = 'https://www.behance.net/mdayubmondol0';
const BEHANCE_LABEL = 'behance.net/mdayubmondol0';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${interTight.variable}`}>
        {/* ───────── NAV ───────── */}
        <header className="sticky top-0 z-50 border-b border-navy/10 bg-white/80 backdrop-blur-md">
          <div className="container-x flex h-16 items-center justify-between md:h-20">
            <a
              href="/"
              className="display text-2xl font-extrabold tracking-tight text-navy"
              aria-label="Ayub — home"
            >
              AYUB<span className="text-sky">.</span>
            </a>

            {/* Desktop links */}
            <nav className="hidden items-center gap-9 md:flex" aria-label="Main">
              {navLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="text-sm font-medium text-navy-900/80 transition-colors hover:text-sky-600"
                >
                  {l.label}
                </a>
              ))}
            </nav>

            <a href={`mailto:${EMAIL}`} className="btn-primary hidden md:inline-flex">
              Contact
            </a>

            {/* Mobile menu (no JS needed) */}
            <details className="group md:hidden">
              <summary
                className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full border border-navy/15 text-navy [&::-webkit-details-marker]:hidden"
                aria-label="Toggle menu"
              >
                <svg
                  className="h-5 w-5 group-open:hidden"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
                <svg
                  className="hidden h-5 w-5 group-open:block"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </summary>
              <div className="absolute inset-x-0 top-full border-b border-navy/10 bg-white px-5 pb-6 pt-2 shadow-xl shadow-navy/10">
                <nav className="flex flex-col" aria-label="Mobile">
                  {navLinks.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      className="display border-b border-navy/10 py-4 text-2xl font-bold text-navy"
                    >
                      {l.label}
                    </a>
                  ))}
                </nav>
                <a href={`mailto:${EMAIL}`} className="btn-primary mt-6 w-full">
                  Email me
                </a>
              </div>
            </details>
          </div>
        </header>

        <main>{children}</main>

        {/* ───────── FOOTER ───────── */}
        <footer className="bg-navy text-white">
          <div className="container-x py-16 md:py-24">
            <div className="grid gap-12 md:grid-cols-12">
              <div className="md:col-span-6">
                <p className="eyebrow !text-sky">Available for projects</p>
                <p className="display mt-4 text-4xl font-extrabold md:text-6xl">
                  Md Ayub Mondol
                </p>
                <p className="mt-4 max-w-md text-white/70">
                  Sr. Visualizer · Graphic Designer &amp; AI Artist
                  <br />
                  Dhaka, Bangladesh
                </p>
              </div>

              <div className="md:col-span-3">
                <p className="eyebrow !text-sky">Contact</p>
                <ul className="mt-4 space-y-3 text-white/85">
                  <li>
                    <a href={`mailto:${EMAIL}`} className="transition-colors hover:text-sky">
                      {EMAIL}
                    </a>
                  </li>
                  <li>
                    <a href={`tel:${PHONE}`} className="transition-colors hover:text-sky">
                      {PHONE}
                    </a>
                  </li>
                  <li>
                    <a
                      href={BEHANCE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-sky"
                    >
                      {BEHANCE_LABEL}
                    </a>
                  </li>
                </ul>
              </div>

              <div className="md:col-span-3">
                <p className="eyebrow !text-sky">Explore</p>
                <ul className="mt-4 space-y-3 text-white/85">
                  {navLinks.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className="transition-colors hover:text-sky">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-16 flex flex-col gap-2 border-t border-white/15 pt-6 text-sm text-white/60 md:flex-row md:justify-between">
              <p>© 2026 Md Ayub Mondol. All rights reserved.</p>
              <p>Dhaka, Bangladesh</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
