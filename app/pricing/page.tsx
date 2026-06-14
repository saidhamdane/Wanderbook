import type { Metadata } from 'next';
import Link from 'next/link';
import { PUBLIC_SITE_URL, PublicPageShell } from '../public-page-shell';

export const metadata: Metadata = {
  title: 'Wanderbook Canarias Pricing',
  description: 'Wanderbook AI Unlimited pricing: 95€/mes for unlimited magazines while your subscription is active.',
  alternates: {
    canonical: `${PUBLIC_SITE_URL}/pricing`,
  },
};

const plans = [
  {
    name: 'Free',
    price: '0€',
    features: ['3 client magazines', 'Partner QR link', 'Wanderbook branding', 'Basic dashboard'],
    href: '/partner/signup?plan=free',
    cta: 'Start free',
    featured: false,
  },
  {
    name: 'Wanderbook AI Unlimited',
    price: '95€/mes',
    features: [
      'Revistas ilimitadas',
      'Fotos ilimitadas',
      'Exportación PDF incluida',
      'Sin límite mensual mientras la suscripción esté activa',
    ],
    href: '/partner/signup?plan=unlimited',
    cta: 'Empezar con Unlimited',
    featured: true,
  },
];

export default function PricingPage() {
  const isDev = process.env.NODE_ENV === 'development';
  return (
    <PublicPageShell
      eyebrow="Pricing"
      title="Wanderbook AI Unlimited"
      description="Suscripción mensual para crear revistas sin límite mientras esté activa."
    >
      {isDev && (
        <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-mono text-amber-800">
          [DEV] Current plan: Unlimited Monthly — 95€/mes · STRIPE_PRICE_UNLIMITED_MONTHLY={process.env.STRIPE_PRICE_UNLIMITED_MONTHLY || '⚠ NOT SET'}
        </div>
      )}
      <section className="grid gap-5 md:grid-cols-2">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={
              plan.featured
                ? 'rounded-2xl bg-slate-950 p-6 text-white shadow-xl'
                : 'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'
            }
          >
            <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              {plan.name}
            </h2>
            <p className="mt-3 text-4xl font-bold">{plan.price}</p>
            <ul className={`mt-6 space-y-3 text-sm ${plan.featured ? 'text-slate-200' : 'text-slate-600'}`}>
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <span className="font-bold text-amber-500">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              href={plan.href}
              className={
                plan.featured
                  ? 'mt-7 inline-flex w-full justify-center rounded-full bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-amber-300'
                  : 'mt-7 inline-flex w-full justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-700'
              }
            >
              {plan.cta}
            </Link>
          </article>
        ))}
      </section>
    </PublicPageShell>
  );
}
