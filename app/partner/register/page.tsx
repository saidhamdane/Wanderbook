'use client';

import { useState } from 'react';
import Link from 'next/link';

const BUSINESS_TYPES = ['Photographer', 'Tour Guide', 'Holiday Rental', 'Hotel', 'Excursion Company', 'Surf School', 'Other'];

export default function PartnerRegisterPage() {
  const [form, setForm] = useState({
    businessName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    website: '',
    businessType: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/partner/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not create account.');
        return;
      }
      window.location.href = data.redirect || '/partner/dashboard';
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-5 py-4">
        <Link href="/" className="font-bold text-lg text-slate-950" style={{ fontFamily: "'Playfair Display', serif" }}>
          Wanderbook Canarias
        </Link>
      </header>
      <section className="mx-auto max-w-xl px-5 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl text-slate-950" style={{ fontFamily: "'Playfair Display', serif" }}>
            Create partner account
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Create branded Canary Islands magazines for your guests and clients.
          </p>
          <form onSubmit={submit} className="mt-6 grid gap-4">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold tracking-widest text-slate-600">BUSINESS NAME *</span>
              <input
                type="text"
                value={form.businessName}
                onChange={set('businessName')}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold tracking-widest text-slate-600">EMAIL *</span>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                required
                autoComplete="email"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold tracking-widest text-slate-600">PASSWORD *</span>
              <input
                type="password"
                value={form.password}
                onChange={set('password')}
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <span className="mt-1 block text-xs text-slate-400">Minimum 8 characters</span>
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold tracking-widest text-slate-600">CONFIRM PASSWORD *</span>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={set('confirmPassword')}
                required
                autoComplete="new-password"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold tracking-widest text-slate-600">BUSINESS TYPE</span>
              <select
                value={form.businessType}
                onChange={set('businessType')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="">Select (optional)</option>
                {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold tracking-widest text-slate-600">PHONE (OPTIONAL)</span>
              <input
                type="tel"
                value={form.phone}
                onChange={set('phone')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold tracking-widest text-slate-600">WEBSITE (OPTIONAL)</span>
              <input
                type="url"
                value={form.website}
                onChange={set('website')}
                placeholder="https://"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </label>
            {error && (
              <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-white hover:bg-amber-600 disabled:opacity-60"
            >
              {loading ? 'Creating account…' : 'Create partner account'}
            </button>
          </form>
          <p className="mt-5 text-sm text-slate-600">
            Already have an account?{' '}
            <Link href="/partner/login" className="font-semibold text-amber-700">
              Log in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
