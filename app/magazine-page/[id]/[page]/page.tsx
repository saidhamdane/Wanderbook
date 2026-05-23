import { notFound } from 'next/navigation';
import { loadMagazine } from '@/lib/magazine/store';
import { SinglePageRenderer } from './SinglePageRenderer';

export const dynamic = 'force-dynamic';

export default async function MagazinePageRender({
  params,
}: {
  params: { id: string; page: string };
}) {
  const doc = await loadMagazine(params.id);
  if (!doc) notFound();

  const pageIndex = parseInt(params.page, 10) - 1; // FlipBook sends 1-based
  if (isNaN(pageIndex) || pageIndex < 0 || pageIndex >= doc.pages.length) {
    notFound();
  }

  const { layout, slots } = doc.pages[pageIndex];

  return (
    <SinglePageRenderer
      layout={layout}
      slots={slots}
      palette={doc.template.palette}
      fonts={doc.template.fonts}
      pageIndex={pageIndex}
    />
  );
}
