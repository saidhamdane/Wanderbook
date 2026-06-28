import { notFound } from 'next/navigation';
import { InteractiveFlipbookViewer } from '@/components/magazine/InteractiveFlipbookViewer';
import { SalesDemoTracking } from '@/components/sales-demo/SalesDemoTracking';
import { getSalesDemoByToken } from '@/lib/db/sales-demos';
import { loadMagazine } from '@/lib/magazine/store';
import { isSalesDemoToken } from '@/lib/sales-demo-token';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function whatsappPhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('00')) return digits.slice(2);
  return digits;
}

function buildWhatsAppHref(businessName?: string): string | undefined {
  const configuredPhone = process.env.NEXT_PUBLIC_WB_WHATSAPP;
  if (!configuredPhone) return undefined;
  const phone = whatsappPhone(configuredPhone);
  if (!phone) return undefined;

  const message = `Hola, me interesa crear una revista digital para ${
    businessName || 'mi empresa'
  } con Wanderbook Canarias.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function ExpiredDemoPage() {
  const whatsappHref = buildWhatsAppHref();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-white">
      <section className="w-full max-w-xl rounded-lg border border-white/10 bg-white/[0.04] px-6 py-10 text-center shadow-2xl sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200">Wanderbook Canarias</p>
        <h1 className="mt-8 text-3xl font-bold leading-tight sm:text-4xl">Esta demo ha caducado.</h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-200">
          Contacta con Wanderbook Canarias para activarla de nuevo.
        </p>
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-lg bg-green-600 px-5 py-3 text-sm font-bold text-white hover:bg-green-700"
          >
            Hablar por WhatsApp
          </a>
        )}
      </section>
    </main>
  );
}

export default async function SalesDemoPage({ params }: { params: { token: string } }) {
  if (!isSalesDemoToken(params.token)) notFound();

  const salesDemo = await getSalesDemoByToken(params.token);
  if (!salesDemo) return <ExpiredDemoPage />;

  const doc = await loadMagazine(salesDemo.magazine_id);
  if (!doc || doc.isAdminDemo || doc.source !== 'sales_demo') notFound();

  const businessName = salesDemo.business_name || doc.partner?.businessName || doc.familyName || 'tu empresa';
  const signupHref = `/partner/signup?businessName=${encodeURIComponent(businessName)}`;
  const whatsappHref = buildWhatsAppHref(businessName);

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <header className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 pb-2 pt-5 text-center sm:px-6 sm:pt-7">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200">Wanderbook Canarias</p>
        <h1 className="mt-3 text-2xl font-bold leading-tight sm:text-4xl">Demo creado para {businessName}</h1>
      </header>

      <section className="w-full overflow-visible">
        <InteractiveFlipbookViewer magazine={doc} />
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-12 text-center sm:px-6">
        <h2 className="text-2xl font-bold leading-tight sm:text-3xl">¿Quieres una revista así para tus clientes?</h2>
        <div className="mt-6">
          <SalesDemoTracking token={params.token} whatsappHref={whatsappHref} signupHref={signupHref} />
        </div>
      </section>
    </main>
  );
}
