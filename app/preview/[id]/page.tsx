import { notFound } from 'next/navigation';
import { loadMagazine } from '@/lib/magazine/store';
import { MagazineRenderer } from '@/components/MagazineRenderer';
import FlipBook from './FlipBook';

type Params = { params: { id: string }; searchParams: { print?: string } };

export const dynamic = 'force-dynamic';

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

  return <FlipBook magazineId={doc.id} pageCount={doc.pages.length} />;
}
