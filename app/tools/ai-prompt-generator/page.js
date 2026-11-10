'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';

const styles = [
  'Photorealistic',
  'Cinematic',
  '3D render',
  'Digital illustration',
  'Watercolor',
  'Oil painting',
  'Anime',
  'Minimalist vector',
  'Pixel art',
  'Surreal',
  'Cyberpunk',
  'Vintage film',
];

const moods = [
  'Dramatic',
  'Calm',
  'Joyful',
  'Mysterious',
  'Energetic',
  'Nostalgic',
  'Elegant',
  'Dark and moody',
];

const ratios = [
  { value: '1:1', label: '1:1 — Square' },
  { value: '4:5', label: '4:5 — Portrait post' },
  { value: '9:16', label: '9:16 — Story / Reel' },
  { value: '16:9', label: '16:9 — Widescreen' },
  { value: '3:2', label: '3:2 — Photo' },
  { value: '21:9', label: '21:9 — Cinematic' },
];

const formats = [
  { value: 'general', label: 'General' },
  { value: 'midjourney', label: 'Midjourney (--ar)' },
];

const inputCls =
  'w-full rounded-2xl border border-navy/20 bg-white px-5 py-4 text-base text-navy-900 placeholder:text-navy-900/40 focus:border-sky focus:outline-none focus:ring-4 focus:ring-sky/20';

const initialForm = {
  subject: '',
  style: 'Cinematic',
  mood: 'Dramatic',
  ratio: '16:9',
  extra: '',
  format: 'general',
};

function buildPrompt({ subject, style, mood, ratio, extra, format }) {
  const s = subject.trim();
  if (!s) return '';

  const parts = [s];
  if (style) parts.push(`${style} style`);
  if (mood) parts.push(`${mood.toLowerCase()} mood`);
  const more = extra.trim().replace(/[.,\s]+$/, '');
  if (more) parts.push(more);
  parts.push('highly detailed', 'professional composition');

  const base = parts.join(', ');
  return format === 'midjourney' ? `${base} --ar ${ratio}` : `${base}, aspect ratio ${ratio}`;
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for browsers/contexts where the Clipboard API is unavailable
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

export default function AiPromptGeneratorPage() {
  const [form, setForm] = useState(initialForm);
  const [copyState, setCopyState] = useState('idle'); // idle | copied | failed
  const timerRef = useRef(null);

  const prompt = useMemo(() => buildPrompt(form), [form]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function update(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
    setCopyState('idle');
  }

  async function handleCopy() {
    if (!prompt) return;
    const ok = await copyText(prompt);
    setCopyState(ok ? 'copied' : 'failed');
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopyState('idle'), 2500);
  }

  function handleReset() {
    setForm(initialForm);
    setCopyState('idle');
  }

  return (
    <>
      {/* ───────── HEADER ───────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-sky/20 blur-3xl"
        />
        <div className="container-x relative pb-10 pt-14 md:pb-14 md:pt-20 lg:pt-28">
          <p className="eyebrow">Free tool</p>
          <h1 className="mt-6 max-w-5xl">
            AI image <span className="text-sky-500">prompt generator.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-navy-900/75 md:text-lg">
            Describe your subject, pick a style, mood and aspect ratio, and get a clean prompt you
            can paste into your favourite AI image tool.
          </p>
        </div>
      </section>

      {/* ───────── TOOL ───────── */}
      <section className="pb-20 md:pb-32">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Inputs */}
            <div className="rounded-3xl border border-navy/10 bg-navy-50 p-6 md:p-10 lg:col-span-7">
              <div className="space-y-6">
                <div>
                  <label htmlFor="subject" className="mb-2 block text-sm font-semibold text-navy">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    maxLength={300}
                    value={form.subject}
                    onChange={(e) => update('subject', e.target.value)}
                    placeholder="e.g. a lone rickshaw on a rainy Dhaka street at night"
                    className={inputCls}
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="style" className="mb-2 block text-sm font-semibold text-navy">
                      Style
                    </label>
                    <select
                      id="style"
                      value={form.style}
                      onChange={(e) => update('style', e.target.value)}
                      className={inputCls}
                    >
                      <option value="">No preset</option>
                      {styles.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="mood" className="mb-2 block text-sm font-semibold text-navy">
                      Mood
                    </label>
                    <select
                      id="mood"
                      value={form.mood}
                      onChange={(e) => update('mood', e.target.value)}
                      className={inputCls}
                    >
                      <option value="">No preset</option>
                      {moods.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="ratio" className="mb-2 block text-sm font-semibold text-navy">
                    Aspect ratio
                  </label>
                  <select
                    id="ratio"
                    value={form.ratio}
                    onChange={(e) => update('ratio', e.target.value)}
                    className={inputCls}
                  >
                    {ratios.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="extra" className="mb-2 block text-sm font-semibold text-navy">
                    Extra details <span className="font-normal text-navy-900/50">(optional)</span>
                  </label>
                  <input
                    id="extra"
                    type="text"
                    maxLength={200}
                    value={form.extra}
                    onChange={(e) => update('extra', e.target.value)}
                    placeholder="e.g. golden hour lighting, shallow depth of field"
                    className={inputCls}
                  />
                </div>

                <div>
                  <p className="mb-2 text-sm font-semibold text-navy">Prompt format</p>
                  <div className="flex flex-wrap gap-2" role="group" aria-label="Prompt format">
                    {formats.map((f) => {
                      const active = form.format === f.value;
                      return (
                        <button
                          key={f.value}
                          type="button"
                          aria-pressed={active}
                          onClick={() => update('format', f.value)}
                          className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                            active
                              ? 'border-navy bg-navy text-white'
                              : 'border-navy/20 bg-white text-navy hover:border-sky hover:text-sky-600'
                          }`}
                        >
                          {f.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <button type="button" onClick={handleReset} className="btn-outline mt-8">
                Reset
              </button>
            </div>

            {/* Output */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-navy p-6 text-white md:p-8 lg:sticky lg:top-28">
                <p className="eyebrow !text-sky">Your prompt</p>

                <div
                  className="mt-5 min-h-[10rem] whitespace-pre-wrap break-words rounded-2xl border border-white/15 bg-white/5 p-5 text-base leading-relaxed"
                  aria-live="polite"
                >
                  {prompt || (
                    <span className="text-white/50">
                      Your prompt will appear here as soon as you enter a subject.
                    </span>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={handleCopy}
                    disabled={!prompt}
                    className="btn-light disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {copyState === 'copied' ? 'Copied ✓' : 'Copy prompt'}
                  </button>
                  {copyState === 'failed' && (
                    <span role="alert" className="text-sm text-white/80">
                      Couldn’t copy automatically. Select the text and copy it manually.
                    </span>
                  )}
                  {prompt && copyState !== 'failed' && (
                    <span className="text-sm text-white/60">
                      {prompt.split(/\s+/).length} words
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── CTA ───────── */}
      <section className="bg-navy py-24 text-white md:py-32">
        <div className="container-x">
          <p className="eyebrow !text-sky">More</p>
          <h2 className="mt-4 max-w-4xl !text-white">Want more AI prompts and ideas?</h2>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/blog" className="btn-light">
              Read the blog
            </Link>
            <Link href="/contact" className="btn-outline-light">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
