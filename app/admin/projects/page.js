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

const COLLECTION = 'projects';
const SLUG_RE = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/;
const emptyForm = { title: '', slug: '', category: '', year: '', featured: false };

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
      (Number(b.year) || 0) - (Number(a.year) || 0) ||
      String(a.title || '').localeCompare(String(b.title || ''))
  );
}

function validate(form, items, editingId) {
  const errors = {};
  const title = form.title.trim();
  const slug = form.slug.trim();
  const category = form.category.trim();
  const year = form.year.trim();

  if (!title) errors.title = 'Title is required.';

  if (!slug) errors.slug = 'Slug is required.';
  else if (!SLUG_RE.test(slug))
    errors.slug = 'Use lowercase letters, numbers and hyphens only (e.g. my-project).';
  else if (items.some((p) => p.slug === slug && p.id !== editingId))
    errors.slug = 'Another project already uses this slug.';

  if (!category) errors.category = 'Category is required.';

  if (!year) errors.year = 'Year is required.';
  else if (!/^\d{4}$/.test(year) || Number(year) < 2000 || Number(year) > 2100)
    errors.year = 'Enter a 4-digit year (2000–2100).';

  return errors;
}

export default function AdminProjectsPage() {
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
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
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
      category: item.category || '',
      year: item.year != null ? String(item.year) : '',
      featured: Boolean(item.featured),
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
      category: form.category.trim(),
      year: Number(form.year.trim()),
      featured: Boolean(form.featured),
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
        setNotice('Project updated.');
      } else {
        const ref = await addDoc(collection(db, COLLECTION), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        setItems((prev) => sortItems([...prev, { id: ref.id, ...payload }]));
        setNotice('Project added.');
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
      setNotice('Project deleted.');
    } catch (err) {
      setActionError(errorMessage(err));
    } finally {
      setDeletingId(null);
    }
  }

  const categories = Array.from(new Set(items.map((p) => p.category).filter(Boolean)));
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
          <p className="mt-4 text-navy-900/70">You need to be signed in to manage projects.</p>
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
          <h1 className="mt-4 text-4xl md:text-6xl">Projects.</h1>
          <p className="mt-4 text-navy-900/70">
            Signed in as <span className="font-semibold text-navy">{user.email}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin" className="btn-outline">
            ← Dashboard
          </Link>
          <Link href="/admin/posts" className="btn-outline">
            Posts
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
        <h2 className="text-2xl md:text-3xl">{editingId ? 'Edit project' : 'Add project'}</h2>

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
              placeholder="my-project-name"
              aria-invalid={Boolean(errors.slug)}
              className={fieldCls('slug')}
            />
            {errors.slug && <p className="mt-2 text-sm font-medium text-red-600">{errors.slug}</p>}
          </div>

          <div>
            <label htmlFor="category" className="mb-2 block text-sm font-semibold text-navy">
              Category
            </label>
            <input
              id="category"
              name="category"
              list="project-categories"
              value={form.category}
              onChange={handleChange}
              disabled={saving}
              aria-invalid={Boolean(errors.category)}
              className={fieldCls('category')}
            />
            <datalist id="project-categories">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            {errors.category && (
              <p className="mt-2 text-sm font-medium text-red-600">{errors.category}</p>
            )}
          </div>

          <div>
            <label htmlFor="year" className="mb-2 block text-sm font-semibold text-navy">
              Year
            </label>
            <input
              id="year"
              name="year"
              inputMode="numeric"
              maxLength={4}
              value={form.year}
              onChange={handleChange}
              disabled={saving}
              placeholder="2026"
              aria-invalid={Boolean(errors.year)}
              className={fieldCls('year')}
            />
            {errors.year && <p className="mt-2 text-sm font-medium text-red-600">{errors.year}</p>}
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="featured"
              className="flex cursor-pointer items-start gap-3 rounded-xl border border-navy/20 bg-white px-4 py-3"
            >
              <input
                id="featured"
                name="featured"
                type="checkbox"
                checked={Boolean(form.featured)}
                onChange={handleChange}
                disabled={saving}
                className="mt-0.5 h-5 w-5 shrink-0 accent-navy"
              />
              <span>
                <span className="block text-sm font-semibold text-navy">Featured project</span>
                <span className="block text-sm text-navy-900/60">
                  Featured projects are shown on the homepage.
                </span>
              </span>
            </label>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {saving ? 'Saving…' : editingId ? 'Save changes' : 'Add project'}
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
          <h2 className="text-2xl md:text-3xl">All projects ({items.length})</h2>
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
          <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
            <thead className="bg-navy text-white">
              <tr>
                <th className="px-5 py-4 font-semibold">Title</th>
                <th className="px-5 py-4 font-semibold">Slug</th>
                <th className="px-5 py-4 font-semibold">Category</th>
                <th className="px-5 py-4 font-semibold">Year</th>
                <th className="px-5 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-t border-navy/10 align-top hover:bg-navy-50">
                  <td className="max-w-xs break-words px-5 py-4 font-semibold text-navy">
                    {p.title}
                    {p.featured && (
                      <span className="ml-2 inline-block rounded-full bg-sky/20 px-2.5 py-0.5 align-middle text-xs font-semibold text-navy">
                        ★ Featured
                      </span>
                    )}
                  </td>
                  <td className="max-w-xs break-all px-5 py-4 text-navy-900/70">{p.slug}</td>
                  <td className="px-5 py-4 text-navy-900/80">{p.category}</td>
                  <td className="px-5 py-4 text-navy-900/80">{p.year}</td>
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
                    No projects yet. Add your first one above.
                  </td>
                </tr>
              )}
              {loading && items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-navy-900/60">
                    Loading projects…
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
