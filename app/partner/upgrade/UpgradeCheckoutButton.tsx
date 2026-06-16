'use client';

import { useState } from 'react';

export default function UpgradeCheckoutButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function startCheckout() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();

      if (res.status === 401) {
        const dest = data?.redirect || '/partner/login?next=/partner/upgrade';
        window.location.href = dest;
        return;
      }

      if (!res.ok || !data.url) {
        setError(data?.error || 'Could not start Stripe Checkout.');
        return;
      }

      window.location.href = data.url;
    } catch {
      setError('Could not start Stripe Checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={startCheckout}
        disabled={loading}
        className="mt-7 rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-slate-700 disabled:opacity-60"
      >
        {loading ? 'Opening Checkout...' : 'Empezar con Unlimited'}
      </button>
      {error && (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </>
  );
}
