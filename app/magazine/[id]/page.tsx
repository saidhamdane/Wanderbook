import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { loadMagazine } from '@/lib/magazine/store';
import { DownloadPdfButton } from '@/app/preview/[id]/DownloadPdfButton';
import { InteractiveFlipbookViewer } from '@/components/magazine/InteractiveFlipbookViewer';
import { ShareMagazineButton } from '@/components/magazine/ShareMagazineButton';
import { localizedCreatedWith } from '@/lib/magazine/localize-magazine';
import { MagazineViewTracker } from '@/components/magazine/MagazineViewTracker';
import { Logo } from '@/components/Logo';

type Params = {
  params: { id: string };
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const doc = await loadMagazine(params.id);
  if (!doc) return {};

  const year = new Date(doc.generatedAt).getFullYear();
  const family = doc.familyName ? `${doc.familyName} · ` : '';
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://wanderbookcanarias.com').replace(/\/$/, '');

  return {
    title: `${family}${doc.destination} ${year} | Digital Magazine`,
    openGraph: {
      title: doc.familyName
        ? `${doc.familyName} Family Travel Magazine`
        : `${doc.destination} Travel Magazine`,
      description: `${doc.destination} · ${year}`,
      images: [{ url: `${appUrl}/api/page-screenshot/${params.id}/1`, width: 794, height: 1123 }],
      type: 'article',
    },
  };
}

export default async function DigitalMagazinePage({ params }: Params) {
  const doc = await loadMagazine(params.id);
  if (!doc) notFound();

  const anyDoc = doc as any;
  const source = anyDoc.source || (anyDoc.partner?.enabled ? 'business_owner' : 'personal');
  const businessName = anyDoc.partner?.businessName || anyDoc.partnerName;

  return (
    <main style={{
      minHeight: '100vh',
      background: '#0f172a',
      color: '#fff',
      overflowX: 'hidden',
    }}>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        backgroundColor: '#0f172a',
        color: '#fff',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        borderBottom: '4px solid #f59e0b',
        flexWrap: 'wrap',
      }}>
        <Logo size="sm" variant="dark" />
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
        }}>
          <DownloadPdfButton magazineId={doc.id} />
          <ShareMagazineButton
            magazineId={doc.id}
            destination={doc.destination}
            businessName={source === 'partner_client' ? businessName : undefined}
          />
        </div>
      </header>

      {source === 'partner_client' && businessName && (
        <p style={{
          margin: '14px 12px 0',
          color: '#fde68a',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textAlign: 'center',
          textTransform: 'uppercase',
        }}>
          {localizedCreatedWith(anyDoc.language, businessName)}
        </p>
      )}

      {anyDoc.source === 'partner_client' && anyDoc.partner?.slug && (
        <MagazineViewTracker
          magazineId={doc.id}
          partnerSlug={String(anyDoc.partner.slug)}
        />
      )}
      <InteractiveFlipbookViewer magazine={doc} />
    </main>
  );
}
