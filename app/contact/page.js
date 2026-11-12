'use client';

import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const EMAIL = 'hellomdayub@gmail.com';
const PHONE = '01886588884';
const BEHANCE_URL = 'https://www.behance.net/mdayubmondol0';
const BEHANCE_LABEL = 'behance.net/mdayubmondol0';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputBase =
  'w-full rounded-2xl border bg-white px-5 py-4 text-base text-navy-900 placeholder:text-navy-900/40 focus:outline-none focus:ring-4 focus:ring-sky/20 disabled:opacity-60';

function validate(values) {
  const errors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();

  if (!name) errors.name = 'Please enter your name.';
  else if (name.length > 100) errors.name = 'Name must be 100 characters or fewer.';

  if (!email) errors.email = 'Please enter your email address.';
  else if (!EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.';

  if (!message) errors.message = 'Please write a message.';
  else if (message.length < 10) errors.message = 'Message must be at least 10 characters.';
  else if (message.length > 2000) errors.message = 'Message must be 2000 characters or fewer.';

  return errors;
}

export default function ContactPage() {
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

  return (
    <>
      {/* ───────── HEADER ───────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-sky/20 blur-3xl"
        />
        <div className="container-x relative pb-10 pt-14 md:pb-14 md:pt-20 lg:pt-28">
          <p className="eyebrow">Get in touch</p>
          <h1 className="mt-6 max-w-5xl">
            Let’s talk about <span className="text-sky-500">your next project.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-navy-900/75 md:text-lg">
            Have an idea or a project in mind? I’m open to new work and creative
            collaborations. Tell me what you’re building and let’s make it real.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              '7+ years of experience',
              '100+ brands worldwide',
              'Creative and AI-powered solutions',
              'Professional design support',
            ].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-navy/15 px-4 py-2 text-sm font-medium text-navy/80"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── DETAILS + FORM ───────── */}
      <section className="pb-20 md:pb-32">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Contact details */}
            <div className="lg:col-span-5">
              <dl className="space-y-8">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-navy-900/50">
                    Email
                  </dt>
                  <dd className="mt-2">
                    <a
                      href={`mailto:${EMAIL}`}
                      className="break-all text-xl font-semibold text-navy transition-colors hover:text-sky-600 md:text-2xl"
                    >
                      {EMAIL}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-navy-900/50">
                    Phone
                  </dt>
                  <dd className="mt-2">
                    <a
                      href={`tel:${PHONE}`}
                      className="text-xl font-semibold text-navy transition-colors hover:text-sky-600 md:text-2xl"
                    >
                      {PHONE}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-navy-900/50">
                    Behance
                  </dt>
                  <dd className="mt-2">
                    <a
                      href={BEHANCE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl font-semibold text-navy transition-colors hover:text-sky-600 md:text-2xl"
                    >
                      {BEHANCE_LABEL}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-navy-900/50">
                    Office
                  </dt>
                  <dd className="mt-2 text-xl font-semibold text-navy md:text-2xl">
                    Kaderabad Housing, Mohammadpur, Dhaka, Bangladesh
                  </dd>
                </div>
              </dl>
            </div>

            {/* Form */}
            <div className="lg:col-span-7">
              <form
                onSubmit={handleSubmit}
                noValidate
                className="rounded-3xl border border-navy/10 bg-navy-50 p-6 md:p-10"
              >
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-semibold text-navy">
                      Name
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
                      placeholder="Your name"
                      className={`${inputBase} ${showError('name') ? 'border-red-500' : 'border-navy/20 focus:border-sky'}`}
                    />
                    {showError('name') && (
                      <p id="name-error" className="mt-2 text-sm font-medium text-red-600">
                        {showError('name')}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-semibold text-navy">
                      Email
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
                      placeholder="you@example.com"
                      className={`${inputBase} ${showError('email') ? 'border-red-500' : 'border-navy/20 focus:border-sky'}`}
                    />
                    {showError('email') && (
                      <p id="email-error" className="mt-2 text-sm font-medium text-red-600">
                        {showError('email')}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className="mb-2 block text-sm font-semibold text-navy">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={values.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={sending}
                      maxLength={2000}
                      aria-invalid={Boolean(showError('message'))}
                      aria-describedby={showError('message') ? 'message-error' : undefined}
                      placeholder="Tell me about your project…"
                      className={`${inputBase} resize-y ${showError('message') ? 'border-red-500' : 'border-navy/20 focus:border-sky'}`}
                    />
                    {showError('message') && (
                      <p id="message-error" className="mt-2 text-sm font-medium text-red-600">
                        {showError('message')}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="btn-primary mt-8 w-full disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
                >
                  {sending ? 'Sending…' : 'Send message'}
                </button>

                {status === 'success' && (
                  <p
                    role="status"
                    className="mt-6 rounded-2xl border border-sky/40 bg-sky/10 px-5 py-4 text-sm font-medium text-navy"
                  >
                    Thank you! Your message has been sent. I’ll reply as soon as I can.
                  </p>
                )}
                {status === 'error' && (
                  <p
                    role="alert"
                    className="mt-6 rounded-2xl border border-red-300 bg-red-50 px-5 py-4 text-sm font-medium text-red-700"
                  >
                    Sorry, your message couldn’t be sent. Please try again, or email me directly
                    at {EMAIL}.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
