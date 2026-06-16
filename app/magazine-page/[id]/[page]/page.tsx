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

  // Always merge live partner branding so existing magazines show the current logo,
  // googleReviewUrl, instagramUrl, bookingUrl, activityType, and other marketing fields.
  let partner = doc.partner as LayoutPartner | undefined;
  if (partner?.enabled) {
    const partnerSlug = partner.slug || (doc as Record<string, unknown>).partnerSlug as string | undefined;
    if (partnerSlug) {
      try {
        const live = await getPublicPartnerBySlugFromDb(partnerSlug);
        if (live) {
          partner = {
            ...partner,
            ...live,
            enabled: true,
            // Always set magazineId from URL params so WhatsApp share link is correct
            magazineId: (partner.magazineId as string | undefined) ?? params.id,
            partnerId: (partner.partnerId as string | undefined) ?? live.id,
          };
        }
      } catch {
        // Supabase unavailable — use saved partner data but still fix magazineId
        if (partner && !partner.magazineId) {
          partner = { ...partner, magazineId: params.id };
        }
      }
    } else if (partner && !partner.magazineId) {
      // No slug but partner enabled — still set the magazineId for share links
      partner = { ...partner, magazineId: params.id };
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
