import { notFound } from 'next/navigation';
import { loadMagazine } from '@/lib/magazine/store';
import { getPublicPartnerBySlugFromDb } from '@/lib/db/partners';
import { SinglePageRenderer } from './SinglePageRenderer';
import type { LayoutPartner } from '@/lib/magazine/types';

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

  // Merge live partner branding so existing magazines also show the current logo.
  let partner = doc.partner as LayoutPartner | undefined;
  if (partner?.enabled) {
    const partnerSlug = partner.slug || (doc as Record<string, unknown>).partnerSlug as string | undefined;
    if (partnerSlug && !partner.logoUrl) {
      const live = await getPublicPartnerBySlugFromDb(partnerSlug);
      if (live) {
        partner = { ...partner, ...live, enabled: true };
      }
    }
  }

  return (
    <SinglePageRenderer
      layout={layout}
      slots={slots}
      palette={doc.template.palette}
      fonts={doc.template.fonts}
      pageIndex={pageIndex}
      partner={partner}
      language={doc.language as string | undefined}
    />
  );
}
