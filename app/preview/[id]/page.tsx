import Link from 'next/link';
import { notFound } from 'next/navigation';
import { loadMagazine } from '@/lib/magazine/store';
import { MagazineRenderer } from '@/components/MagazineRenderer';
import { DownloadPdfButton } from './DownloadPdfButton';

type Params = { params: { id: string }; searchParams: { print?: string } };

export const dynamic = 'force-dynamic';

export default async function PreviewPage({ params, searchParams }: Params) {
  const doc = await loadMagazine(params.id);
  if (!doc) notFound();
  const printMode = searchParams?.print === 'true';

  if (printMode) {
    return (
      <main style={{ backgroundColor: '#FFFFFF', margin: 0, padding: 0 }}>
        <MagazineRenderer doc={doc} printMode />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b-4 border-amber-500">
        <Link href="/" className="font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
          Wanderbook
        </Link>
        <div className="flex items-center gap-3">
          <DownloadPdfButton magazineId={doc.id} />
          <Link
            href="/create"
            className="px-4 py-2 rounded-full border border-amber-300 text-amber-100 text-xs font-semibold tracking-widest"
          >
            CREATE NEW
          </Link>
        </div>
      </header>
      <MagazineRenderer doc={doc} />
    </main>
  );
}
