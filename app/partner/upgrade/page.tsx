import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { PARTNER_SESSION_COOKIE, getPartnerIdForSession } from '@/lib/partner-store';
import { stripeConfigured } from '@/lib/stripe';
import UpgradeCheckoutButton from './UpgradeCheckoutButton';

const BENEFITS = [
  'Revistas ilimitadas',
  'Fotos ilimitadas',
  'Exportación PDF incluida',
  'Sin límite mensual mientras la suscripción esté activa',
];

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default function PartnerUpgradePage() {
  const partnerId = getPartnerIdForSession(cookies().get(PARTNER_SESSION_COOKIE)?.value);
  if (!partnerId) redirect('/partner/login?next=/partner/upgrade');

  const configured = stripeConfigured();

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-5 py-4">
        <Logo size="md" />
      </header>
      <section className="mx-auto max-w-2xl px-5 py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-800">
            Wanderbook AI Unlimited
          </div>
          <h1 className="mt-4 text-4xl text-slate-950" style={{ fontFamily: "'Playfair Display', serif" }}>
            Wanderbook AI Unlimited
          </h1>
          <p className="mt-3 text-2xl font-bold text-slate-950">95€/mes</p>
          <ul className="mt-5 space-y-2 text-sm leading-6 text-slate-700">
            {BENEFITS.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>

          {configured ? (
            <UpgradeCheckoutButton />
          ) : (
            <div className="mt-7 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">
              Stripe is not configured yet.
            </div>
          )}

          <Link href="/partner/dashboard" className="mt-5 inline-block text-sm font-semibold text-slate-600 hover:text-slate-950">
            Back to dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
