'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';

export default function PartnerBillingSuccessPage() {
  const [status, setStatus] = useState<'checking' | 'active' | 'error'>('checking');
  const [error, setError] = useState('');

  useEffect(() => {
    let timeout: number | undefined;

    async function run() {
      // Require a valid partner session before activating
      const authRes = await fetch('/api/partner/auth/me');
      if (!authRes.ok) {
        window.location.href = '/partner/login?next=/partner/billing/success' + window.location.search;
        return;
      }

      const sessionId = new URLSearchParams(window.location.search).get('session_id');
      if (!sessionId) {
        setStatus('error');
        setError('Missing checkout session.');
        return;
      }

      try {
        const res = await fetch(`/api/stripe/activate?session_id=${encodeURIComponent(sessionId)}`);
        const data = await res.json();
        if (!res.ok || !data.active) {
          setStatus('error');
          setError(data.error || 'Subscription is not active yet.');
          return;
        }
        setStatus('active');
        timeout = window.setTimeout(() => {
          window.location.href = '/partner/dashboard';
        }, 2500);
      } catch {
        setStatus('error');
        setError('Could not verify your subscription.');
      }
    }

    run();
    return () => {
      if (timeout) window.clearTimeout(timeout);
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-5 py-4">
        <Logo size="md" />
      </header>
      <section className="mx-auto max-w-xl px-5 py-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <h1 className="text-3xl text-slate-950" style={{ fontFamily: "'Playfair Display', serif" }}>
            {status === 'active'
              ? 'Tu suscripción Unlimited está activa'
              : status === 'error'
                ? 'We could not verify your subscription'
                : 'Verifying your subscription...'}
          </h1>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            {status === 'active'
              ? 'You will be redirected to your dashboard shortly.'
              : status === 'error'
                ? error
                : 'Please wait while we confirm your Stripe checkout session.'}
          </p>
          <Link href="/partner/dashboard" className="mt-6 inline-block rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white">
            Go to dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
