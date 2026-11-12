'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const EMAIL = 'hellomdayub@gmail.com';
const PHONE = '01886588884';
const PHONE_DISPLAY = '+880 18865 88884';
const PHONE_TEL = '+8801886588884';
const OFFICE = 'Kaderabad Housing, Mohammadpur, Dhaka, Bangladesh';
const BEHANCE_URL = 'https://www.behance.net/mdayubmondol0';
const FACEBOOK_URL = 'https://www.facebook.com/hellomdayub';
const WHATSAPP_URL = `https://wa.me/${PHONE_TEL.replace('+', '')}`;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const menuLinks = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

const elsewhere = [
  { label: 'Behance', href: BEHANCE_URL },
  { label: 'Facebook', href: FACEBOOK_URL },
  { label: 'WhatsApp', href: WHATSAPP_URL },
];

// Underline-only fields (no box, no placeholder). Labels sit above.
const fieldBase =
  'ct-field block w-full border-0 border-b bg-transparent px-0 pb-3 pt-1 text-lg text-white caret-sky outline-none ring-0 transition-colors focus:ring-0 disabled:opacity-60';
const labelCls = 'mono mb-1 block text-[11px] uppercase tracking-[0.2em] text-white/55';

function validate(values) {
  const errors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();

  if (!name) errors.name = 'Please tell me your name.';
  else if (name.length > 100) errors.name = 'Please keep your name under 100 characters.';

  if (!email) errors.email = 'Please enter your email so I can reply.';
  else if (!EMAIL_RE.test(email)) errors.email = 'That email address doesn’t look right. Please check it.';

  if (!message) errors.message = 'Please tell me a little about your project.';
  else if (message.length < 10) errors.message = 'Please add a few more details (at least 10 characters).';
  else if (message.length > 2000) errors.message = 'Please keep your message under 2,000 characters.';

  return errors;
}

// All of the composition's sizes on desktop are multiples of --u, so the
// HELLO + portrait + copy group scales as one piece on any screen.
const css = `
.ct-letter{display:inline-block;overflow:hidden;line-height:.86;padding-bottom:.04em;vertical-align:top}
.ct-rise{display:inline-block;transform:translateY(110%);animation:ct-rise .95s cubic-bezier(.2,.8,.2,1) forwards;animation-delay:calc(var(--i) * 90ms + 200ms)}
@keyframes ct-rise{to{transform:translateY(0)}}
@media (prefers-reduced-motion:reduce){.ct-rise{animation:none;transform:none}}

.ct-hello{margin:0;position:relative;z-index:1;white-space:nowrap;font-size:clamp(4rem,27vw,11rem);line-height:.86;letter-spacing:-.04em}
.ct-portrait{position:relative;z-index:2;aspect-ratio:1;width:min(82vw,26rem);margin:-13vw 0 0 auto;pointer-events:none}
.ct-portrait::before{content:'';position:absolute;inset:10% 12% 18% 12%;border-radius:9999px;background:radial-gradient(closest-side,rgba(56,189,248,.38),rgba(56,189,248,0));filter:blur(8px);z-index:-1}
.ct-fade{position:absolute;left:0;right:0;bottom:0;height:34%;background:linear-gradient(to top,#040E27 6%,rgba(4,14,39,0))}
.ct-copy{position:relative;z-index:3;margin-top:1.5rem;max-width:26rem}
.ct-copy p{font-size:1.0625rem;line-height:1.55;color:rgba(255,255,255,.72)}
.ct-email{display:inline-block;margin-top:1.25rem;font-size:1.3rem;font-weight:700;color:#fff;text-decoration:underline;text-decoration-color:#38BDF8;text-decoration-thickness:2px;text-underline-offset:.4em;word-break:break-all}

.ct-field:-webkit-autofill{-webkit-text-fill-color:#fff;box-shadow:0 0 0 1000px #040E27 inset;transition:background-color 9999s}

.ct-cursor{position:fixed;left:0;top:0;z-index:300;pointer-events:none;opacity:0;mix-blend-mode:difference;will-change:transform}
.ct-disc{width:5.5rem;height:5.5rem;margin:-2.75rem 0 0 -2.75rem;border-radius:9999px;background:#fff;transform:scale(0);transition:transform .35s cubic-bezier(.2,.8,.2,1)}
.ct-cursor[data-active='1'] .ct-disc{transform:scale(1)}

@media (min-width:1024px){
  .ct-stage{position:relative;height:100%}
  .ct-hello{position:absolute;left:0;top:calc(var(--u) * 5.5);font-size:calc(var(--u) * 15)}
  .ct-portrait{position:absolute;left:calc(var(--u) * 6);top:calc(var(--u) * 10);width:calc(var(--u) * 48);height:calc(var(--u) * 48);margin:0}
  .ct-copy{position:absolute;left:0;top:calc(var(--u) * 21.5);width:calc(var(--u) * 23);max-width:none;margin:0}
  .ct-copy p{font-size:max(.9375rem,calc(var(--u) * 1.25))}
  .ct-email{font-size:max(1.1rem,calc(var(--u) * 1.7))}
}
`;

export default function ContactPage() {
  // ───────── form state + submit (unchanged behaviour) ─────────
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const errors = validate(values);
  const showError = (field) => (touched[field] ? errors[field] : undefined);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (status === 'success' || status === 'error') setStatus('idle');
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(errors).length > 0) return;

    setStatus('sending');
    try {
      await addDoc(collection(db, 'contact_messages'), {
        name: values.name.trim(),
        email: values.email.trim(),
        message: values.message.trim(),
        createdAt: serverTimestamp(),
      });
      setValues({ name: '', email: '', message: '' });
      setTouched({});
      setStatus('success');
    } catch (err) {
      console.error('Contact form error:', err);
      setStatus('error');
    }
  }

  const sending = status === 'sending';

  // ───────── page chrome: clock, menu, cursor, scroll lock ─────────
  const rootRef = useRef(null);
  const cursorRef = useRef(null);
  const [time, setTime] = useState('--:--:--');
  const [menuOpen, setMenuOpen] = useState(false);

  // Live Dhaka clock
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Dhaka',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // This page is a full-screen composition: lock page scroll and make the
  // site header/footer behind it unreachable by keyboard / screen reader.
  useEffect(() => {
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = 'hidden';

    const main = rootRef.current ? rootRef.current.closest('main') : null;
    const hidden = main && main.parentElement
      ? Array.from(main.parentElement.children).filter(
          (el) => ['HEADER', 'FOOTER'].includes(el.tagName) && !el.hasAttribute('inert')
        )
      : [];
    hidden.forEach((el) => el.setAttribute('inert', ''));

    return () => {
      html.style.overflow = prevOverflow;
      hidden.forEach((el) => el.removeAttribute('inert'));
    };
  }, []);

  // Esc closes the menu
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // Large disc cursor over links and buttons (mouse / trackpad only)
  useEffect(() => {
    const el = cursorRef.current;
    if (!el || !window.matchMedia('(pointer: fine)').matches) return undefined;

    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    let raf = 0;
    let seen = false;

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!seen) {
        seen = true;
        x = tx;
        y = ty;
        el.style.opacity = '1';
      }
      const hit = e.target instanceof Element && e.target.closest('a, button, [data-cursor]');
      el.dataset.active = hit ? '1' : '0';
    };
    const loop = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col overflow-y-auto overflow-x-hidden bg-navy-900 text-white"
      style={{ '--u': 'min(1vw, 1.5vh)' }}
    >
      <style>{css}</style>

      {/* Background glows */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 top-0 h-[34rem] w-[34rem] rounded-full bg-sky/15 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-[28rem] w-[28rem] rounded-full bg-navy/70 blur-3xl" />
      </div>

      {/* Disc cursor */}
      <div ref={cursorRef} aria-hidden="true" className="ct-cursor">
        <div className="ct-disc" />
      </div>

      {/* ───────── TOP BAR: logo · live clock · menu ───────── */}
      <header className="relative z-50 grid h-16 shrink-0 grid-cols-[1fr_auto_1fr] items-center px-5 md:h-20 lg:px-10">
        <Link
          href="/"
          aria-label="Ayub — home"
          className="display justify-self-start text-2xl font-extrabold tracking-tight text-white"
        >
          AYUB<span className="text-sky">.</span>
        </Link>

        <p className="mono text-center text-[11px] uppercase tracking-[0.18em] text-white/60 md:text-xs">
          <span className="hidden sm:inline">Dhaka · </span>
          <time suppressHydrationWarning>{time}</time>
        </p>

        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="ct-menu"
          className="mono justify-self-end rounded-full border border-white/20 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:border-sky hover:text-sky"
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </header>

      {/* Menu panel */}
      {menuOpen && (
        <nav
          id="ct-menu"
          aria-label="Site menu"
          className="absolute inset-0 z-40 flex flex-col justify-center bg-navy-900/95 px-5 pt-16 backdrop-blur-md lg:px-10"
        >
          <ul className="space-y-2">
            {menuLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="display block text-5xl font-extrabold text-white transition-colors hover:text-sky md:text-7xl"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Side tab (desktop) */}
      <p
        className="mono fixed right-0 top-1/2 z-30 hidden -translate-y-1/2 rotate-180 rounded-r-xl border border-l-0 border-white/20 bg-white/5 px-3 py-5 text-[11px] uppercase tracking-[0.25em] text-white/75 [writing-mode:vertical-rl] lg:block"
      >
        Open for new projects
      </p>

      {/* ───────── COMPOSITION ───────── */}
      <div className="relative z-10 flex-1 px-5 pb-12 lg:min-h-[40rem] lg:px-10 lg:pb-0">
        <p className="mono mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-white/75 lg:hidden">
          <span className="h-2 w-2 rounded-full bg-sky" />
          Open for new projects
        </p>

        <div className="relative grid gap-12 lg:h-full lg:grid-cols-12 lg:gap-0">
          {/* LEFT: HELLO + portrait + copy */}
          <div className="ct-stage lg:col-span-7">
            <h1 className="ct-hello display !text-white">
              <span className="sr-only">Hello — get in touch with Md Ayub Mondol</span>
              {'HELLO'.split('').map((ch, i) => (
                <span key={i} className="ct-letter" aria-hidden="true">
                  <span className="ct-rise" style={{ '--i': i }}>
                    {ch}
                  </span>
                </span>
              ))}
            </h1>

            <div className="ct-portrait">
              <Image
                src="/images/ayub02-site-cutout.png"
                alt="Md Ayub Mondol"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 82vw"
                className="object-contain object-bottom"
              />
              <div className="ct-fade" />
            </div>

            <div className="ct-copy">
              <p>
                Got a project in mind? Brand, campaign or video, big or small — I’d love to
                hear about it.
              </p>
              <span className="mono mt-6 block text-[11px] uppercase tracking-[0.2em] text-white/45">
                Or write to me directly
              </span>
              <a href={`mailto:${EMAIL}`} className="ct-email !mt-2">
                {EMAIL}
              </a>
            </div>
          </div>

          {/* RIGHT: form + details */}
          <div className="flex flex-col justify-center lg:col-span-5 lg:pl-10 lg:pr-10">
            <h2 className="display text-3xl !text-white md:text-4xl">Tell me about your project</h2>
            <p className="mt-3 text-base text-white/65">
              Share a few details and I’ll get back to you.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-8 lg:mt-10">
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={labelCls}>
                    Your name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={sending}
                    aria-invalid={Boolean(showError('name'))}
                    aria-describedby={showError('name') ? 'name-error' : undefined}
                    className={`${fieldBase} ${showError('name') ? 'border-red-400' : 'border-white/30 focus:border-sky'}`}
                  />
                  {showError('name') && (
                    <p id="name-error" className="mt-2 text-sm font-medium text-red-300">
                      {showError('name')}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className={labelCls}>
                    Your email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={sending}
                    aria-invalid={Boolean(showError('email'))}
                    aria-describedby={showError('email') ? 'email-error' : undefined}
                    className={`${fieldBase} ${showError('email') ? 'border-red-400' : 'border-white/30 focus:border-sky'}`}
                  />
                  {showError('email') && (
                    <p id="email-error" className="mt-2 text-sm font-medium text-red-300">
                      {showError('email')}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="message" className={labelCls}>
                  How can I help?
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={values.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={sending}
                  maxLength={2000}
                  aria-invalid={Boolean(showError('message'))}
                  aria-describedby={showError('message') ? 'message-error' : undefined}
                  className={`${fieldBase} resize-none ${showError('message') ? 'border-red-400' : 'border-white/30 focus:border-sky'}`}
                />
                {showError('message') && (
                  <p id="message-error" className="mt-2 text-sm font-medium text-red-300">
                    {showError('message')}
                  </p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={sending}
                  className="group inline-flex items-center gap-5 rounded-full bg-sky py-1.5 pl-8 pr-1.5 text-lg font-bold text-navy-900 transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  <span>{sending ? 'Sending…' : 'Send message'}</span>
                  <span
                    aria-hidden="true"
                    className="grid h-12 w-12 place-items-center rounded-xl bg-navy-900 text-white"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 17 17 7M8 7h9v9" />
                    </svg>
                  </span>
                </button>

                {status === 'success' && (
                  <p
                    role="status"
                    className="mt-6 rounded-2xl border border-sky/40 bg-sky/10 px-5 py-4 text-sm font-medium text-white"
                  >
                    Thank you — your message has been sent. I’ll reply as soon as I can.
                  </p>
                )}
                {status === 'error' && (
                  <p
                    role="alert"
                    className="mt-6 rounded-2xl border border-red-400/50 bg-red-500/10 px-5 py-4 text-sm font-medium text-red-200"
                  >
                    Sorry, something went wrong and your message wasn’t sent. Please try again,
                    or email me directly at {EMAIL}.
                  </p>
                )}
              </div>
            </form>

            <dl className="mt-10 grid gap-6 border-t border-white/10 pt-6 text-sm sm:grid-cols-2">
              <div>
                <dt className="mono text-[11px] uppercase tracking-[0.2em] text-white/45">Phone</dt>
                <dd className="mt-2">
                  <a
                    href={`tel:${PHONE_TEL}`}
                    className="font-semibold text-white transition-colors hover:text-sky"
                    title={PHONE}
                  >
                    {PHONE_DISPLAY}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="mono text-[11px] uppercase tracking-[0.2em] text-white/45">Office</dt>
                <dd className="mt-2 font-semibold text-white">{OFFICE}</dd>
              </div>
            </dl>
          </div>

          {/* ELSEWHERE — bottom-left on desktop, last on mobile */}
          <div className="z-20 flex flex-wrap items-center gap-x-6 gap-y-2 lg:absolute lg:bottom-[calc(var(--u)*1.8)] lg:left-0">
            <span className="mono text-[11px] uppercase tracking-[0.2em] text-white/45">
              Find me elsewhere
            </span>
            {elsewhere.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mono text-xs uppercase tracking-[0.18em] text-white/85 underline decoration-white/30 underline-offset-8 transition-colors hover:text-sky hover:decoration-sky"
              >
                {s.label} ↗
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
