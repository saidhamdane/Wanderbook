'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetForm />
    </Suspense>
  );
}

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <main className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white px-5 py-4">
          <Link href="/" className="font-bold text-lg text-slate-950" style={{ fontFamily: "'Playfair Display', serif" }}>
            Wanderbook Canarias
          </Link>
        </header>
        <section className="mx-auto max-w-md px-5 py-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-center">
            <p className="text-slate-700">This reset link is invalid or has expired.</p>
            <p className="mt-4 text-sm">
              <Link href="/partner/forgot-password" className="font-semibold text-amber-700 hover:underline">
                Request a new link
              </Link>
            </p>
          </div>
        </section>
      </main>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/partner/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not reset password. The link may have expired.');
        return;
      }
      setSuccess(true);
      setTimeout(() => {
        window.location.href = data.redirect || '/partner/login?reset=success';
      }, 1500);
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
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl text-slate-950" style={{ fontFamily: "'Playfair Display', serif" }}>
            Reset password
          </h1>
          {success ? (
            <p className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
              Password updated! Redirecting to login…
            </p>
          ) : (
            <form onSubmit={submit} className="mt-6 grid gap-4">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold tracking-widest text-slate-600">NEW PASSWORD *</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <span className="mt-1 block text-xs text-slate-400">Minimum 8 characters</span>
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold tracking-widest text-slate-600">CONFIRM NEW PASSWORD *</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
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
                {loading ? 'Resetting…' : 'Reset password'}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
