'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const NAVY = '#0A2463';
const SKY = '#38BDF8';

// Fixed list of prizes. Cash amounts are just for fun — nothing is paid out.
const prizes = [
  { id: 'tk50', label: '৳50', amount: 50, headline: 'You won ৳50!', message: 'Every taka counts — a great start!' },
  { id: 'hug', label: '🤗 Hug', amount: 0, headline: 'A big Eid hug!', message: 'Collect it from the nearest relative. No returns accepted.' },
  { id: 'tk100', label: '৳100', amount: 100, headline: 'You won ৳100!', message: 'Nice one — not bad at all!' },
  { id: 'shemai', label: '🍮 Shemai', amount: 0, headline: 'A bowl of shemai!', message: 'Sweet, creamy and exactly what Eid mornings are for.' },
  { id: 'tk200', label: '৳200', amount: 200, headline: 'You won ৳200!', message: 'Now we’re talking!' },
  { id: 'selfie', label: '📸 Selfie', amount: 0, headline: 'A free Eid selfie!', message: 'Grab someone you love and smile. The photo is on the house.' },
  { id: 'tk500', label: '৳500', amount: 500, headline: 'You won ৳500!', message: 'Somebody is feeling generous today!' },
  { id: 'tk1000', label: '৳1000', amount: 1000, headline: 'JACKPOT — ৳1000!', message: 'The whole family is jealous. Eid Mubarak!' },
];

const SEG = 360 / prizes.length;
const SPIN_MS = 4500;
const REDUCED_MS = 700;

function polar(cx, cy, r, deg) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function slicePath(cx, cy, r, a0, a1) {
  const [x0, y0] = polar(cx, cy, r, a0);
  const [x1, y1] = polar(cx, cy, r, a1);
  return `M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1} Z`;
}

function randomInt(n) {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return a[0] % n;
}

export default function EidSalamiWheelPage() {
  const [rotation, setRotation] = useState(0);
  const [duration, setDuration] = useState(SPIN_MS);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function spin() {
    if (spinning) return;

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ms = reduced ? REDUCED_MS : SPIN_MS;

    const idx = randomInt(prizes.length);
    const jitter = (Math.random() - 0.5) * SEG * 0.7; // land anywhere inside the slice
    const withinTurn = 360 - (idx * SEG + SEG / 2 + jitter);
    const base = rotation - (((rotation % 360) + 360) % 360);
    const turns = 5 + Math.floor(Math.random() * 3);
    const next = base + 360 * turns + withinTurn;

    setResult(null);
    setDuration(ms);
    setSpinning(true);
    setRotation(next);

    timerRef.current = setTimeout(() => {
      const prize = prizes[idx];
      setResult(prize);
      setHistory((h) => [prize, ...h].slice(0, 6));
      setSpinning(false);
    }, ms + 150);
  }

  function resetGame() {
    if (spinning) return;
    setResult(null);
    setHistory([]);
  }

  const jar = history.reduce((sum, p) => sum + p.amount, 0);

  return (
    <>
      {/* ───────── HEADER ───────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-sky/20 blur-3xl"
        />
        <div className="container-x relative pb-8 pt-14 md:pb-10 md:pt-20 lg:pt-28">
          <p className="eyebrow">Just for fun · ঈদ মোবারক</p>
          <h1 className="mt-6 max-w-5xl">
            Eid salami <span className="text-sky-500">wheel 2026.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-navy-900/75 md:text-lg">
            Give the wheel a spin and see what your virtual salami turns out to be.
          </p>
          <p className="mt-6 max-w-2xl rounded-2xl border border-sky/40 bg-sky/10 px-5 py-4 text-sm font-medium text-navy">
            This is a just-for-fun game. No real money is paid out.
          </p>
        </div>
      </section>

      {/* ───────── WHEEL ───────── */}
      <section className="pb-20 md:pb-32">
        <div className="container-x">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="relative mx-auto w-full max-w-md pt-4 sm:max-w-lg">
                {/* Pointer */}
                <div
                  aria-hidden="true"
                  className="absolute left-1/2 top-0 z-10 h-0 w-0 -translate-x-1/2 border-l-[14px] border-r-[14px] border-t-[28px] border-l-transparent border-r-transparent border-t-navy drop-shadow"
                />

                <div
                  className="aspect-square w-full"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transition: `transform ${duration}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`,
                  }}
                >
                  <svg
                    viewBox="0 0 400 400"
                    className="h-full w-full drop-shadow-2xl"
                    role="img"
                    aria-label="Eid salami prize wheel"
                  >
                    {prizes.map((p, i) => {
                      const a0 = i * SEG;
                      const a1 = (i + 1) * SEG;
                      const mid = a0 + SEG / 2;
                      const dark = i % 2 === 0;
                      return (
                        <g key={p.id}>
                          <path
                            d={slicePath(200, 200, 190, a0, a1)}
                            fill={dark ? NAVY : SKY}
                            stroke="#ffffff"
                            strokeWidth="3"
                          />
                          <g transform={`rotate(${mid} 200 200)`}>
                            <text
                              x="200"
                              y="82"
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fontSize={p.amount ? 26 : 20}
                              fontWeight="700"
                              fill={dark ? '#ffffff' : NAVY}
                            >
                              {p.label}
                            </text>
                          </g>
                        </g>
                      );
                    })}
                    <circle cx="200" cy="200" r="34" fill="#ffffff" stroke={NAVY} strokeWidth="5" />
                    <text x="200" y="201" textAnchor="middle" dominantBaseline="middle" fontSize="28">
                      🌙
                    </text>
                  </svg>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={spin}
                  disabled={spinning}
                  className="btn-primary px-10 py-4 text-base disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {spinning ? 'Spinning…' : result ? 'Spin again' : 'Spin the wheel'}
                </button>
                {history.length > 0 && (
                  <button type="button" onClick={resetGame} disabled={spinning} className="btn-outline">
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Result + jar */}
            <div className="lg:col-span-5">
              <div
                className="min-h-[14rem] rounded-3xl bg-navy p-7 text-white md:p-10"
                aria-live="polite"
              >
                {result ? (
                  <div>
                    <p className="eyebrow !text-sky">Your result</p>
                    <p className="display mt-4 text-4xl font-extrabold md:text-5xl">
                      {result.headline} 🎉
                    </p>
                    <p className="mt-4 text-lg text-white/80">{result.message}</p>
                  </div>
                ) : (
                  <div>
                    <p className="eyebrow !text-sky">{spinning ? 'Spinning…' : 'Ready?'}</p>
                    <p className="display mt-4 text-3xl font-extrabold md:text-4xl">
                      {spinning ? 'Fingers crossed…' : 'Press spin and see what you get.'}
                    </p>
                  </div>
                )}
              </div>

              {history.length > 0 && (
                <div className="mt-5 rounded-3xl border border-navy/10 p-7">
                  <p className="eyebrow">Your salami jar</p>
                  <p className="display mt-3 text-4xl font-extrabold text-navy">৳{jar}</p>
                  <p className="mt-1 text-sm text-navy-900/60">Pretend money — just for fun.</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {history.map((p, i) => (
                      <li
                        key={`${p.id}-${i}`}
                        className="rounded-full border border-navy/15 px-3 py-1 text-sm font-semibold text-navy"
                      >
                        {p.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ───────── CTA ───────── */}
      <section className="bg-navy py-24 text-white md:py-32">
        <div className="container-x">
          <p className="eyebrow !text-sky">Eid Mubarak</p>
          <h2 className="mt-4 max-w-4xl !text-white">Need festive designs for your brand?</h2>
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
