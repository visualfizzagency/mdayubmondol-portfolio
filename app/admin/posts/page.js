'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { auth, db } from '../../../lib/firebase';

const COLLECTION = 'posts';
const SLUG_RE = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const emptyForm = { title: '', slug: '', date: '', category: '', imageUrl: '', excerpt: '' };

const defaultCategories = [
  'AI & Prompts',
  'Design Trends',
  'Branding',
  'Graphic Design',
  'Fonts & Typography',
  'Free Resources',
  'Tutorials',
  'Career',
];

const inputCls =
  'w-full rounded-xl border bg-white px-4 py-3 text-base text-navy-900 placeholder:text-navy-900/40 focus:outline-none focus:ring-4 focus:ring-sky/20 disabled:opacity-60';

function errorMessage(err) {
  if (err?.code === 'permission-denied') {
    return 'Permission denied. Check your Firestore security rules and that you are signed in as the admin.';
  }
  return err?.message || 'Something went wrong. Please try again.';
}

function sortItems(rows) {
  return [...rows].sort(
    (a, b) =>
      String(b.date || '').localeCompare(String(a.date || '')) ||
      String(a.title || '').localeCompare(String(b.title || ''))
  );
}

function isRealDate(value) {
  if (!DATE_RE.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

// Accepts a full http(s) URL, or a site-relative path such as /images/post.jpg
function isValidImageUrl(value) {
  if (value.startsWith('/') && !value.startsWith('//')) return true;
  try {
    const u = new URL(value);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
}

function validate(form, items, editingId) {
  const errors = {};
  const title = form.title.trim();
  const slug = form.slug.trim();
  const date = form.date.trim();
  const category = form.category.trim();

  if (!title) errors.title = 'Title is required.';

  if (!slug) errors.slug = 'Slug is required.';
  else if (!SLUG_RE.test(slug))
    errors.slug = 'Use lowercase letters, numbers and hyphens only (e.g. my-post).';
  else if (items.some((p) => p.slug === slug && p.id !== editingId))
    errors.slug = 'Another post already uses this slug.';

  if (!date) errors.date = 'Date is required.';
  else if (!isRealDate(date)) errors.date = 'Enter a valid date (YYYY-MM-DD).';

  if (!category) errors.category = 'Category is required.';

  const imageUrl = form.imageUrl.trim();
  if (imageUrl && !isValidImageUrl(imageUrl))
    errors.imageUrl = 'Enter a full URL (https://…) or a path starting with /.';

  return errors;
}

export default function AdminPostsPage() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [notice, setNotice] = useState('');
  const [actionError, setActionError] = useState('');
  const formRef = useRef(null);

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
      const snap = await getDocs(collection(db, COLLECTION));
      setItems(sortItems(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    } catch (err) {
      setLoadError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setNotice('');
    setActionError('');
  }

  function resetForm() {
    setForm(emptyForm);
    setErrors({});
    setEditingId(null);
  }

  function startEdit(item) {
    setEditingId(item.id);
    setForm({
      title: item.title || '',
      slug: item.slug || '',
      date: item.date || '',
      category: item.category || '',
      imageUrl: item.imageUrl || '',
      excerpt: item.excerpt || '',
    });
    setErrors({});
    setNotice('');
    setActionError('');
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setNotice('');
    setActionError('');

    const found = validate(form, items, editingId);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      date: form.date.trim(),
      category: form.category.trim(),
      imageUrl: form.imageUrl.trim(),
      excerpt: form.excerpt.trim(),
    };

    setSaving(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, COLLECTION, editingId), {
          ...payload,
          updatedAt: serverTimestamp(),
        });
        setItems((prev) =>
          sortItems(prev.map((p) => (p.id === editingId ? { ...p, ...payload } : p)))
        );
        setNotice('Post updated.');
      } else {
        const ref = await addDoc(collection(db, COLLECTION), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        setItems((prev) => sortItems([...prev, { id: ref.id, ...payload }]));
        setNotice('Post added.');
      }
      resetForm();
    } catch (err) {
      setActionError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    if (!window.confirm(`Delete “${item.title}”? This cannot be undone.`)) return;
    setNotice('');
    setActionError('');
    setDeletingId(item.id);
    try {
      await deleteDoc(doc(db, COLLECTION, item.id));
      setItems((prev) => prev.filter((p) => p.id !== item.id));
      if (editingId === item.id) resetForm();
      setNotice('Post deleted.');
    } catch (err) {
      setActionError(errorMessage(err));
    } finally {
      setDeletingId(null);
    }
  }

  const categories = Array.from(
    new Set([...defaultCategories, ...items.map((p) => p.category).filter(Boolean)])
  );
  const fieldCls = (name) =>
    `${inputCls} ${errors[name] ? 'border-red-500' : 'border-navy/20 focus:border-sky'}`;

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
          <p className="mt-4 text-navy-900/70">You need to be signed in to manage posts.</p>
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
          <h1 className="mt-4 text-4xl md:text-6xl">Posts.</h1>
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
        </div>
      </div>

      {/* Add / edit form */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        className="mt-10 scroll-mt-24 rounded-3xl border border-navy/10 bg-navy-50 p-6 md:p-8"
      >
        <h2 className="text-2xl md:text-3xl">{editingId ? 'Edit post' : 'Add post'}</h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="title" className="mb-2 block text-sm font-semibold text-navy">
              Title
            </label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              disabled={saving}
              aria-invalid={Boolean(errors.title)}
              className={fieldCls('title')}
            />
            {errors.title && <p className="mt-2 text-sm font-medium text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="slug" className="mb-2 block text-sm font-semibold text-navy">
              Slug
            </label>
            <input
              id="slug"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              disabled={saving}
              placeholder="my-post-title"
              aria-invalid={Boolean(errors.slug)}
              className={fieldCls('slug')}
            />
            {errors.slug && <p className="mt-2 text-sm font-medium text-red-600">{errors.slug}</p>}
          </div>

          <div>
            <label htmlFor="date" className="mb-2 block text-sm font-semibold text-navy">
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              disabled={saving}
              aria-invalid={Boolean(errors.date)}
              className={fieldCls('date')}
            />
            {errors.date && <p className="mt-2 text-sm font-medium text-red-600">{errors.date}</p>}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="category" className="mb-2 block text-sm font-semibold text-navy">
              Category
            </label>
            <input
              id="category"
              name="category"
              list="post-categories"
              value={form.category}
              onChange={handleChange}
              disabled={saving}
              aria-invalid={Boolean(errors.category)}
              className={fieldCls('category')}
            />
            <datalist id="post-categories">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            {errors.category && (
              <p className="mt-2 text-sm font-medium text-red-600">{errors.category}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="imageUrl" className="mb-2 block text-sm font-semibold text-navy">
              Image URL <span className="font-normal text-navy-900/50">(optional)</span>
            </label>
            <input
              id="imageUrl"
              name="imageUrl"
              type="text"
              inputMode="url"
              value={form.imageUrl}
              onChange={handleChange}
              disabled={saving}
              placeholder="https://… or /images/my-post.jpg"
              aria-invalid={Boolean(errors.imageUrl)}
              className={fieldCls('imageUrl')}
            />
            {errors.imageUrl && (
              <p className="mt-2 text-sm font-medium text-red-600">{errors.imageUrl}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="excerpt" className="mb-2 block text-sm font-semibold text-navy">
              Excerpt <span className="font-normal text-navy-900/50">(optional)</span>
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={4}
              value={form.excerpt}
              onChange={handleChange}
              disabled={saving}
              className={`${fieldCls('excerpt')} resize-y`}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {saving ? 'Saving…' : editingId ? 'Save changes' : 'Add post'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} disabled={saving} className="btn-outline">
              Cancel
            </button>
          )}
        </div>

        {actionError && (
          <p
            role="alert"
            className="mt-6 rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {actionError}
          </p>
        )}
        {notice && (
          <p
            role="status"
            className="mt-6 rounded-2xl border border-sky/40 bg-sky/10 px-4 py-3 text-sm font-medium text-navy"
          >
            {notice}
          </p>
        )}
      </form>

      {/* Table */}
      <div className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl">All posts ({items.length})</h2>
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

        <div className="mt-6 overflow-x-auto rounded-3xl border border-navy/10">
          <table className="w-full min-w-[48rem] border-collapse text-left text-sm">
            <thead className="bg-navy text-white">
              <tr>
                <th className="px-5 py-4 font-semibold">Title</th>
                <th className="px-5 py-4 font-semibold">Slug</th>
                <th className="px-5 py-4 font-semibold">Date</th>
                <th className="px-5 py-4 font-semibold">Category</th>
                <th className="px-5 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-t border-navy/10 align-top hover:bg-navy-50">
                  <td className="max-w-xs break-words px-5 py-4 font-semibold text-navy">
                    {p.title}
                  </td>
                  <td className="max-w-xs break-all px-5 py-4 text-navy-900/70">{p.slug}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-navy-900/80">{p.date}</td>
                  <td className="px-5 py-4 text-navy-900/80">{p.category}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(p)}
                        disabled={saving || deletingId === p.id}
                        className="rounded-full border border-navy/20 px-4 py-2 text-sm font-semibold text-navy transition-colors hover:border-sky disabled:opacity-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p)}
                        disabled={saving || deletingId === p.id}
                        className="rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
                      >
                        {deletingId === p.id ? 'Deleting…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && items.length === 0 && !loadError && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-navy-900/60">
                    No posts yet. Add your first one above.
                  </td>
                </tr>
              )}
              {loading && items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-navy-900/60">
                    Loading posts…
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
