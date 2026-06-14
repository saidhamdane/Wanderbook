'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/partner/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
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
            Forgot password
          </h1>
          {submitted ? (
            <div className="mt-6">
              <p className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                If that email exists, a reset link has been sent.
              </p>
              <p className="mt-4 text-center text-sm">
                <Link href="/partner/login" className="font-semibold text-amber-700 hover:underline">
                  Back to login
                </Link>
              </p>
            </div>
          ) : (
            <>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Enter your partner email and we will send you a reset link.
              </p>
              <form onSubmit={submit} className="mt-6 grid gap-4">
                <label className="block">
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
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-white hover:bg-amber-600 disabled:opacity-60"
                >
                  {loading ? 'Sending…' : 'Send reset link'}
                </button>
              </form>
              <p className="mt-4 text-center text-sm">
                <Link href="/partner/login" className="font-semibold text-amber-700 hover:underline">
                  Back to login
                </Link>
              </p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
