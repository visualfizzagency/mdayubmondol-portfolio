'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { auth, db } from '../../../lib/firebase';

const COLLECTION = 'contact_messages';
const MAX_MESSAGES = 200;

function errorMessage(err) {
  if (err?.code === 'permission-denied') {
    return 'Permission denied. Check your Firestore security rules and that you are signed in as the admin.';
  }
  return err?.message || 'Something went wrong. Please try again.';
}

function toDate(ts) {
  return ts && typeof ts.toDate === 'function' ? ts.toDate() : null;
}

function formatDate(ts) {
  const d = toDate(ts);
  if (!d) return 'Date unknown';
  return d.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function AdminMessagesPage() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
    return unsubscribe;
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'), limit(MAX_MESSAGES));
      const snap = await getDocs(q);
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      setLoadError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  // ───────── Guard ─────────
  if (!authReady) {
    return (
      <section className="container-x py-24">
        <p className="text-navy-900/60">Checking sign-in…</p>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="container-x py-16 md:py-24">
        <div className="mx-auto max-w-md text-center">
          <p className="eyebrow">Admin</p>
          <h1 className="mt-4 text-4xl md:text-5xl">Sign in required.</h1>
          <p className="mt-4 text-navy-900/70">You need to be signed in to view messages.</p>
          <Link href="/admin" className="btn-primary mt-8">
            Sign in
          </Link>
        </div>
      </section>
    );
  }

  // ───────── Page ─────────
  return (
    <section className="container-x py-12 md:py-20">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-4 text-4xl md:text-6xl">Messages.</h1>
          <p className="mt-4 text-navy-900/70">
            Signed in as <span className="font-semibold text-navy">{user.email}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin" className="btn-outline">
            ← Dashboard
          </Link>
          <Link href="/admin/projects" className="btn-outline">
            Projects
          </Link>
          <Link href="/admin/posts" className="btn-outline">
            Posts
          </Link>
        </div>
      </div>

      <div className="mt-12 flex items-center justify-between gap-4">
        <h2 className="text-2xl md:text-3xl">Contact messages ({items.length})</h2>
        <button type="button" onClick={load} disabled={loading} className="btn-outline">
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      {loadError && (
        <p
          role="alert"
          className="mt-6 rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {loadError}
        </p>
      )}

      <div className="mt-6 space-y-5">
        {items.map((m) => {
          const d = toDate(m.createdAt);
          return (
            <article
              key={m.id}
              className="rounded-3xl border border-navy/10 bg-white p-6 md:p-8"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between md:gap-6">
                <div className="min-w-0">
                  <h3 className="break-words">{m.name || 'No name'}</h3>
                  {m.email ? (
                    <a
                      href={`mailto:${m.email}`}
                      className="mt-1 block break-all text-sm font-medium text-sky-600 transition-colors hover:text-navy"
                    >
                      {m.email}
                    </a>
                  ) : null}
                </div>
                <time
                  dateTime={d ? d.toISOString() : undefined}
                  className="shrink-0 text-sm font-medium text-navy-900/60"
                >
                  {formatDate(m.createdAt)}
                </time>
              </div>

              <p className="mt-5 whitespace-pre-wrap break-words border-t border-navy/10 pt-5 text-navy-900/80">
                {m.message}
              </p>

              {m.email ? (
                <a
                  href={`mailto:${m.email}?subject=${encodeURIComponent('Re: your message')}`}
                  className="btn-outline mt-6"
                >
                  Reply by email
                </a>
              ) : null}
            </article>
          );
        })}

        {!loading && items.length === 0 && !loadError && (
          <div className="rounded-3xl border border-navy/10 bg-navy-50 p-10 text-center text-navy-900/60">
            No messages yet.
          </div>
        )}
        {loading && items.length === 0 && (
          <div className="rounded-3xl border border-navy/10 bg-navy-50 p-10 text-center text-navy-900/60">
            Loading messages…
          </div>
        )}
      </div>

      {items.length >= MAX_MESSAGES && (
        <p className="mt-6 text-sm text-navy-900/60">
          Showing the latest {MAX_MESSAGES} messages. Older ones are in the Firebase console.
        </p>
      )}
    </section>
  );
}
