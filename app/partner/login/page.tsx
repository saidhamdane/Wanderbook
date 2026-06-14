'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function PartnerLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/partner/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/partner/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        setError(json.error || 'Invalid email or password.');
        return;
      }
      window.location.assign(json.redirect || nextPath);
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
      <section className="mx-auto max-w-md px-5 py-10">
        <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-1 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-800">
            Partner Login
          </div>
          <h1 className="mt-3 text-3xl text-slate-950" style={{ fontFamily: "'Playfair Display', serif" }}>
            Wanderbook Canarias Partner Login
          </h1>
          <label className="mt-6 block">
            <span className="mb-2 block text-xs font-semibold tracking-widest text-slate-600">EMAIL</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </label>
          <label className="mt-4 block">
            <span className="mb-2 block text-xs font-semibold tracking-widest text-slate-600">PASSWORD</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </label>
          {error && (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-white hover:bg-amber-600 disabled:opacity-60"
          >
            {loading ? 'Logging in…' : 'Log in'}
          </button>
          <p className="mt-5 text-center text-sm text-slate-500">
            <Link href="/partner/register" className="font-semibold text-amber-700">Create partner account</Link>
            {' · '}
            <Link href="/" className="font-semibold text-slate-600 hover:text-slate-950">← Back to homepage</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
