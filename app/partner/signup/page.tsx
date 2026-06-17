'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Logo } from '@/components/Logo';

const BUSINESS_TYPES = ['Photographer', 'Tour Guide', 'Holiday Rental', 'Hotel', 'Excursion Company', 'Surf School', 'Other'];
const ISLANDS = ['Tenerife', 'Fuerteventura', 'Lanzarote', 'Gran Canaria', 'La Palma', 'La Gomera', 'El Hierro'];

export default function PartnerSignupPage() {
  return (
    <Suspense fallback={null}>
      <PartnerSignupForm />
    </Suspense>
  );
}

function PartnerSignupForm() {
  const searchParams = useSearchParams();
  const requestedPlan = searchParams.get('plan') === 'unlimited' ? 'unlimited' : 'free';
  const initialBusinessType = searchParams.get('businessType') || BUSINESS_TYPES[0];
  const initialMainIsland = searchParams.get('mainIsland') || searchParams.get('island') || ISLANDS[0];
  const businessTypeOptions = BUSINESS_TYPES.includes(initialBusinessType) ? BUSINESS_TYPES : [initialBusinessType, ...BUSINESS_TYPES];
  const islandOptions = ISLANDS.includes(initialMainIsland) ? ISLANDS : [initialMainIsland, ...ISLANDS];
  const [form, setForm] = useState({
    businessName: searchParams.get('businessName') || searchParams.get('business') || '',
    businessType: initialBusinessType,
    mainIsland: initialMainIsland,
    whatsapp: searchParams.get('whatsapp') || searchParams.get('phone') || '',
    website: '',
    logoUrl: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/partner/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, plan: requestedPlan }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Could not create account.');
      return;
    }
    window.location.href = data.redirectTo || '/partner/dashboard';
  }

  return (
    <PartnerAuthShell title="Create my partner account">
      {requestedPlan === 'unlimited' && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900">
          Create your account first, then start Wanderbook AI Unlimited.
        </div>
      )}
      <p className="text-sm leading-6 text-slate-600">
        Create branded Canary Islands magazines for your guests and clients. Your clients scan your QR, upload their photos, and every magazine is branded with your business.
      </p>
      <form onSubmit={submit} className="mt-6 grid gap-4">
        <Input label="Business name" value={form.businessName} onChange={(v) => setForm({ ...form, businessName: v })} required />
        <Select label="Business type" value={form.businessType} options={businessTypeOptions} onChange={(v) => setForm({ ...form, businessType: v })} />
        <Select label="Main island" value={form.mainIsland} options={islandOptions} onChange={(v) => setForm({ ...form, mainIsland: v })} />
        <Input label="WhatsApp" value={form.whatsapp} onChange={(v) => setForm({ ...form, whatsapp: v })} required />
        <Input label="Website" value={form.website} onChange={(v) => setForm({ ...form, website: v })} />
        <Input label="Logo URL optional" value={form.logoUrl} onChange={(v) => setForm({ ...form, logoUrl: v })} />
        <Input label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
        <Input label="Password" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} required />
        {error && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button className="rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-white hover:bg-amber-600">
          Create my partner account
        </button>
      </form>
      <p className="mt-5 text-sm text-slate-600">
        Already have an account? <Link href="/partner/login" className="font-semibold text-amber-700">Log in</Link>
      </p>
    </PartnerAuthShell>
  );
}

function PartnerAuthShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-5 py-4">
        <Logo size="md" />
      </header>
      <section className="mx-auto max-w-xl px-5 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl text-slate-950" style={{ fontFamily: "'Playfair Display', serif" }}>{title}</h1>
          {children}
        </div>
      </section>
    </main>
  );
}

function Input({ label, value, onChange, type = 'text', required = false }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold tracking-widest text-slate-600">{label.toUpperCase()}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-400" />
    </label>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold tracking-widest text-slate-600">{label.toUpperCase()}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-400">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}
