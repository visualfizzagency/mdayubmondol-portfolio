'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const MAX_FILE_BYTES = 25 * 1024 * 1024; // 25 MB
const MAX_SIDE = 8000; // px, per side

const presets = [
  { id: 'original', label: 'Original size' },
  { id: 'custom', label: 'Custom size' },
  { id: 'ig-post', label: 'Instagram post — 1080 × 1080', w: 1080, h: 1080 },
  { id: 'ig-portrait', label: 'Instagram portrait — 1080 × 1350', w: 1080, h: 1350 },
  { id: 'story', label: 'Story / Reel — 1080 × 1920', w: 1080, h: 1920 },
  { id: 'fb-cover', label: 'Facebook cover — 820 × 312', w: 820, h: 312 },
  { id: 'yt-thumb', label: 'YouTube thumbnail — 1280 × 720', w: 1280, h: 720 },
  { id: 'hd', label: 'Full HD — 1920 × 1080', w: 1920, h: 1080 },
];

const formats = [
  { value: 'original', label: 'Same as original' },
  { value: 'image/jpeg', label: 'JPEG' },
  { value: 'image/png', label: 'PNG' },
  { value: 'image/webp', label: 'WebP' },
];

const extFor = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
const SAVEABLE = Object.keys(extFor);

const inputCls =
  'w-full rounded-2xl border border-navy/20 bg-white px-5 py-3.5 text-base text-navy-900 placeholder:text-navy-900/40 focus:border-sky focus:outline-none focus:ring-4 focus:ring-sky/20';

function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

function resolveType(format, info) {
  if (format !== 'original') return format;
  return info && SAVEABLE.includes(info.type) ? info.type : 'image/png';
}

// Original size, scaled down only if it exceeds the max side
function fitOriginal(w, h) {
  const k = Math.min(1, MAX_SIDE / Math.max(w, h));
  return { w: Math.max(1, Math.round(w * k)), h: Math.max(1, Math.round(h * k)) };
}

export default function QuickImageToolsPage() {
  const [info, setInfo] = useState(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [lock, setLock] = useState(true);
  const [presetId, setPresetId] = useState('original');
  const [mode, setMode] = useState('stretch'); // stretch | cover
  const [format, setFormat] = useState('original');
  const [quality, setQuality] = useState(90);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);

  const imgRef = useRef(null);
  const sourceUrlRef = useRef(null);
  const resultUrlRef = useRef(null);

  useEffect(() => {
    return () => {
      if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    };
  }, []);

  function clearResult() {
    if (resultUrlRef.current) {
      URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = null;
    }
    setResult(null);
  }

  function loadFile(file) {
    setError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError(`That file is ${formatBytes(file.size)}. Please choose an image under 25 MB.`);
      return;
    }

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
      sourceUrlRef.current = url;
      imgRef.current = img;
      clearResult();

      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const start = fitOriginal(w, h);
      setInfo({ url, width: w, height: h, name: file.name, type: file.type, size: file.size });
      setWidth(String(start.w));
      setHeight(String(start.h));
      setPresetId('original');
      setLock(true);
      setMode('stretch');
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setError('This image couldn’t be read. Try a JPEG, PNG or WebP file.');
    };
    img.src = url;
  }

  function handleWidthChange(value) {
    const v = value.replace(/\D/g, '').slice(0, 5);
    setWidth(v);
    setPresetId('custom');
    clearResult();
    if (lock && info && v) {
      setHeight(String(Math.max(1, Math.round((Number(v) * info.height) / info.width))));
    }
  }

  function handleHeightChange(value) {
    const v = value.replace(/\D/g, '').slice(0, 5);
    setHeight(v);
    setPresetId('custom');
    clearResult();
    if (lock && info && v) {
      setWidth(String(Math.max(1, Math.round((Number(v) * info.width) / info.height))));
    }
  }

  function handlePreset(id) {
    setPresetId(id);
    clearResult();
    if (id === 'original' && info) {
      const o = fitOriginal(info.width, info.height);
      setWidth(String(o.w));
      setHeight(String(o.h));
      setLock(true);
      setMode('stretch');
      return;
    }
    const p = presets.find((x) => x.id === id);
    if (p && p.w) {
      setWidth(String(p.w));
      setHeight(String(p.h));
      setLock(false);
      setMode('cover');
    }
  }

  async function handleResize() {
    setError('');
    if (!info || !imgRef.current) return;

    const w = parseInt(width, 10);
    const h = parseInt(height, 10);
    if (!Number.isInteger(w) || !Number.isInteger(h) || w < 1 || h < 1) {
      setError('Enter a width and height of at least 1 pixel.');
      return;
    }
    if (w > MAX_SIDE || h > MAX_SIDE) {
      setError(`Width and height must be ${MAX_SIDE} pixels or less.`);
      return;
    }

    setBusy(true);
    try {
      const outType = resolveType(format, info);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas is not available in this browser.');

      // JPEG has no transparency, so paint a white background first
      if (outType === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const iw = info.width;
      const ih = info.height;
      let sx = 0;
      let sy = 0;
      let sw = iw;
      let sh = ih;
      if (mode === 'cover') {
        const scale = Math.max(w / iw, h / ih);
        sw = w / scale;
        sh = h / scale;
        sx = (iw - sw) / 2;
        sy = (ih - sh) / 2;
      }
      ctx.drawImage(imgRef.current, sx, sy, sw, sh, 0, 0, w, h);

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, outType, outType === 'image/png' ? undefined : quality / 100)
      );
      if (!blob) throw new Error('The image could not be created. Try a smaller size.');

      const actualType = SAVEABLE.includes(blob.type) ? blob.type : outType;
      const base = info.name.replace(/\.[^.]+$/, '').replace(/[^\w.-]+/g, '-') || 'image';
      const name = `${base}-${w}x${h}.${extFor[actualType] || 'png'}`;

      clearResult();
      const url = URL.createObjectURL(blob);
      resultUrlRef.current = url;
      setResult({
        url,
        name,
        width: w,
        height: h,
        size: blob.size,
        type: actualType,
        fellBack: actualType !== outType,
      });
    } catch (err) {
      console.error('Resize error:', err);
      setError(err?.message || 'Something went wrong while resizing. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  const outType = resolveType(format, info);
  const showQuality = outType === 'image/jpeg' || outType === 'image/webp';

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
            QuickImage <span className="text-sky-500">resizer.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-navy-900/75 md:text-lg">
            Upload an image, pick a size or preset, and download the resized file.
          </p>
          <p className="mt-6 max-w-2xl rounded-2xl border border-sky/40 bg-sky/10 px-5 py-4 text-sm font-medium text-navy">
            Everything happens in your browser. Your image is never uploaded to a server.
          </p>
        </div>
      </section>

      {/* ───────── TOOL ───────── */}
      <section className="pb-20 md:pb-32">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Controls */}
            <div className="rounded-3xl border border-navy/10 bg-navy-50 p-6 md:p-10 lg:col-span-6">
              <label
                htmlFor="file"
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  loadFile(e.dataTransfer.files?.[0]);
                }}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
                  dragging ? 'border-sky bg-sky/10' : 'border-navy/25 bg-white hover:border-sky'
                }`}
              >
                <span className="display text-xl font-bold text-navy">
                  {info ? 'Choose a different image' : 'Choose an image'}
                </span>
                <span className="mt-2 text-sm text-navy-900/60">
                  or drag and drop it here — up to 25 MB
                </span>
                <input
                  id="file"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    loadFile(e.target.files?.[0]);
                    e.target.value = '';
                  }}
                />
              </label>

              {info && (
                <p className="mt-4 break-all text-sm text-navy-900/70">
                  <span className="font-semibold text-navy">{info.name}</span> — {info.width} ×{' '}
                  {info.height}px, {formatBytes(info.size)}
                </p>
              )}

              <fieldset disabled={!info} className="mt-8 space-y-6 disabled:opacity-50">
                <div>
                  <label htmlFor="preset" className="mb-2 block text-sm font-semibold text-navy">
                    Preset
                  </label>
                  <select
                    id="preset"
                    value={presetId}
                    onChange={(e) => handlePreset(e.target.value)}
                    className={inputCls}
                  >
                    {presets.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="width" className="mb-2 block text-sm font-semibold text-navy">
                      Width (px)
                    </label>
                    <input
                      id="width"
                      inputMode="numeric"
                      value={width}
                      onChange={(e) => handleWidthChange(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label htmlFor="height" className="mb-2 block text-sm font-semibold text-navy">
                      Height (px)
                    </label>
                    <input
                      id="height"
                      inputMode="numeric"
                      value={height}
                      onChange={(e) => handleHeightChange(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>

                <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-navy">
                  <input
                    type="checkbox"
                    checked={lock}
                    onChange={(e) => setLock(e.target.checked)}
                    className="h-5 w-5 accent-navy"
                  />
                  Keep the original proportions
                </label>

                <div>
                  <label htmlFor="mode" className="mb-2 block text-sm font-semibold text-navy">
                    When the shape differs from the original
                  </label>
                  <select
                    id="mode"
                    value={mode}
                    onChange={(e) => {
                      setMode(e.target.value);
                      clearResult();
                    }}
                    className={inputCls}
                  >
                    <option value="stretch">Stretch to the exact size</option>
                    <option value="cover">Crop to fill (centred)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="format" className="mb-2 block text-sm font-semibold text-navy">
                    Output format
                  </label>
                  <select
                    id="format"
                    value={format}
                    onChange={(e) => {
                      setFormat(e.target.value);
                      clearResult();
                    }}
                    className={inputCls}
                  >
                    {formats.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>

                {showQuality && (
                  <div>
                    <label htmlFor="quality" className="mb-2 block text-sm font-semibold text-navy">
                      Quality: {quality}%
                    </label>
                    <input
                      id="quality"
                      type="range"
                      min={40}
                      max={100}
                      step={5}
                      value={quality}
                      onChange={(e) => {
                        setQuality(Number(e.target.value));
                        clearResult();
                      }}
                      className="w-full accent-navy"
                    />
                  </div>
                )}
              </fieldset>

              {error && (
                <p
                  role="alert"
                  className="mt-6 rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                >
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={handleResize}
                disabled={!info || busy}
                className="btn-primary mt-8 w-full disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
              >
                {busy ? 'Resizing…' : 'Resize image'}
              </button>
            </div>

            {/* Preview / result */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl border border-navy/10 bg-white p-6 md:p-8 lg:sticky lg:top-28">
                {result ? (
                  <>
                    <p className="eyebrow">Resized image</p>
                    <div className="mt-5 flex max-h-[26rem] items-center justify-center overflow-hidden rounded-2xl bg-navy-50 p-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={result.url}
                        alt="Resized preview"
                        className="max-h-[24rem] w-auto max-w-full rounded-lg object-contain"
                      />
                    </div>
                    <p className="mt-5 text-sm text-navy-900/70">
                      {result.width} × {result.height}px · {formatBytes(result.size)}
                      {info ? ` (original ${formatBytes(info.size)})` : ''}
                    </p>
                    {result.fellBack && (
                      <p className="mt-2 text-sm text-navy-900/70">
                        Your browser can’t save that format, so the file was saved as{' '}
                        {extFor[result.type].toUpperCase()} instead.
                      </p>
                    )}
                    <a href={result.url} download={result.name} className="btn-primary mt-6">
                      Download {result.name}
                    </a>
                  </>
                ) : info ? (
                  <>
                    <p className="eyebrow">Original</p>
                    <div className="mt-5 flex max-h-[26rem] items-center justify-center overflow-hidden rounded-2xl bg-navy-50 p-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={info.url}
                        alt="Original preview"
                        className="max-h-[24rem] w-auto max-w-full rounded-lg object-contain"
                      />
                    </div>
                    <p className="mt-5 text-sm text-navy-900/60">
                      Choose a size, then press “Resize image”.
                    </p>
                  </>
                ) : (
                  <div className="flex min-h-[16rem] items-center justify-center text-center text-navy-900/50">
                    Your image preview will appear here.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl border border-navy/10 p-7 md:p-8">
              <p className="eyebrow">Privacy</p>
              <p className="mt-3 text-navy-900/75">
                All processing happens entirely in your browser using the canvas. Your image is
                never uploaded or stored anywhere.
              </p>
            </div>
            <div className="rounded-3xl border border-navy/10 p-7 md:p-8">
              <p className="eyebrow">Supported formats</p>
              <p className="mt-3 text-navy-900/75">
                <span className="font-semibold text-navy">Upload:</span> JPEG, PNG, WebP and GIF
                (first frame only), plus any other format your browser can display. Images up to
                25 MB.
              </p>
              <p className="mt-3 text-navy-900/75">
                <span className="font-semibold text-navy">Download:</span> JPEG, PNG or WebP, up to{' '}
                {MAX_SIDE} px per side. Some older browsers can’t save WebP and will use PNG
                instead.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── CTA ───────── */}
      <section className="bg-navy py-24 text-white md:py-32">
        <div className="container-x">
          <p className="eyebrow !text-sky">Need more?</p>
          <h2 className="mt-4 max-w-4xl !text-white">Need designs made, not just resized?</h2>
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
