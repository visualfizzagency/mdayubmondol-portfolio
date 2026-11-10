'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const messagesUrl = projectId
  ? `https://console.firebase.google.com/project/${projectId}/firestore/databases/-default-/data/~2Fcontact_messages`
  : 'https://console.firebase.google.com/';

const inputCls =
  'w-full rounded-2xl border border-navy/20 bg-white px-5 py-4 text-base text-navy-900 placeholder:text-navy-900/40 focus:border-sky focus:outline-none focus:ring-4 focus:ring-sky/20 disabled:opacity-60';

function authMessage(code) {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    default:
      return 'Sign-in failed. Please try again.';
  }
}

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
    return unsubscribe;
  }, []);

  async function handleSignIn(e) {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setSigningIn(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setPassword('');
    } catch (err) {
      setError(authMessage(err?.code));
    } finally {
      setSigningIn(false);
    }
  }

  async function handleSignOut() {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  }

  // ───────── Loading ─────────
  if (!authReady) {
    return (
      <section className="container-x py-24">
        <p className="text-navy-900/60">Checking sign-in…</p>
      </section>
    );
  }

  // ───────── Signed out: login form only ─────────
  if (!user) {
    return (
      <section className="container-x py-16 md:py-24">
        <div className="mx-auto max-w-md">
          <p className="eyebrow">Admin</p>
          <h1 className="mt-4 text-4xl md:text-5xl">Sign in.</h1>
          <p className="mt-4 text-navy-900/70">
            Sign in with the admin account created in Firebase Authentication.
          </p>

          <form
            onSubmit={handleSignIn}
            noValidate
            className="mt-8 space-y-5 rounded-3xl border border-navy/10 bg-navy-50 p-6 md:p-8"
          >
            <div>
              <label htmlFor="admin-email" className="mb-2 block text-sm font-semibold text-navy">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={signingIn}
                className={inputCls}
              />
            </div>
            <div>
              <label
                htmlFor="admin-password"
                className="mb-2 block text-sm font-semibold text-navy"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={signingIn}
                className={inputCls}
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={signingIn}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {signingIn ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </section>
    );
  }

  // ───────── Signed in: dashboard ─────────
  const cards = [
    {
      title: 'Projects',
      text: 'Add, edit and delete portfolio projects.',
      href: '/admin/projects',
      external: false,
    },
    {
      title: 'Blog posts',
      text: 'Add, edit and delete blog posts.',
      href: '/admin/posts',
      external: false,
    },
    {
      title: 'Messages',
      text: 'Read the messages sent through the contact form.',
      href: '/admin/messages',
      external: false,
    },
    {
      title: 'Contact messages',
      text: 'Open the contact_messages collection in the Firebase console.',
      href: messagesUrl,
      external: true,
    },
  ];

  return (
    <section className="container-x py-12 md:py-20">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-4 text-4xl md:text-6xl">Dashboard.</h1>
          <p className="mt-4 text-navy-900/70">
            Signed in as <span className="font-semibold text-navy">{user.email}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/" className="btn-outline">
            ← Back to site
          </Link>
          <button type="button" onClick={handleSignOut} className="btn-primary">
            Sign out
          </button>
        </div>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) =>
          c.external ? (
            <a
              key={c.title}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="card-hover group block rounded-3xl border border-navy/10 bg-white p-7 md:p-8"
            >
              <h3>{c.title} ↗</h3>
              <p className="mt-3 text-navy-900/70">{c.text}</p>
            </a>
          ) : (
            <Link
              key={c.title}
              href={c.href}
              className="card-hover group block rounded-3xl border border-navy/10 bg-white p-7 md:p-8"
            >
              <h3>{c.title} →</h3>
              <p className="mt-3 text-navy-900/70">{c.text}</p>
            </Link>
          )
        )}
      </div>
    </section>
  );
}
