'use client';

import { FormEvent, useState } from 'react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/private/auth/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        window.location.reload();
        return;
      }

      setError(response.status === 500 ? 'Configuration error' : 'Invalid password');
    } catch {
      setError('Invalid password');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Private Sales</p>
        <h1 className="mt-2 text-3xl text-slate-950" style={{ fontFamily: "'Playfair Display', serif" }}>
          Wanderbook Admin
        </h1>

        <label className="mt-6 block">
          <span className="mb-2 block text-sm font-bold text-slate-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            className="w-full rounded-xl border border-slate-200 px-3 py-3 text-base text-slate-900 outline-none focus:ring-2 focus:ring-amber-400"
            required
          />
        </label>

        {error ? <p className="mt-3 text-sm font-semibold text-amber-700">{error}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}
