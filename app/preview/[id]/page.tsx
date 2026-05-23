import { notFound } from 'next/navigation';
import { loadMagazine } from '@/lib/magazine/store';
import { MagazineRenderer } from '@/components/MagazineRenderer';
import FlipBook from './FlipBook';
import type { Metadata } from 'next';

type Params = { params: { id: string }; searchParams: { print?: string } };

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const doc = await loadMagazine(params.id);
  if (!doc) return {};
  const year = new Date(doc.generatedAt).getFullYear();
  const family = doc.familyName ? `${doc.familyName} · ` : '';
  const title = `${family}${doc.destination} ${year} | Wanderbook`;
  const ogTitle = doc.familyName
    ? `${doc.familyName} Family Travel Magazine`
    : `${doc.destination} Travel Magazine`;
  return {
    title,
    openGraph: {
      title: ogTitle,
      description: `${doc.destination} · ${year} — a personal travel magazine`,
      images: [{ url: `/api/page-screenshot/${params.id}/1`, width: 794, height: 1123 }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: `${doc.destination} · ${year}`,
      images: [`/api/page-screenshot/${params.id}/1`],
    },
  };
}

export default async function PreviewPage({ params, searchParams }: Params) {
  const doc = await loadMagazine(params.id);
  if (!doc) notFound();

  if (searchParams?.print === 'true') {
    return (
      <main style={{ backgroundColor: '#FFFFFF', margin: 0, padding: 0 }}>
        <MagazineRenderer doc={doc} printMode />
      </main>
    );
  }

  // red-bold gets a dedication page prepended (page 1), so total = pages + 1
  const pageCount = doc.templateId === 'red-bold'
    ? doc.pages.length + 1
    : doc.pages.length;

  return <FlipBook magazineId={doc.id} pageCount={pageCount} />;
}
