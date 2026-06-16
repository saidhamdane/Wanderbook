import { redirect } from 'next/navigation';
import { getPartnerSession } from '@/lib/auth/partner-session';
import { getPartnerBySlug } from '@/lib/db/partners';
import { countMagazinesByPartner } from '@/lib/db/magazines';
import { countPartnerMagazines, FREE_MONTHLY_MAGAZINE_LIMIT } from '@/lib/partner-store';
import { getPartnerAnalytics } from '@/lib/db/partner-events';
import PartnerDashboardClient from './PartnerDashboardClient';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function PartnerDashboardPage() {
  const session = getPartnerSession();
  if (!session) redirect('/partner/login?next=/partner/dashboard');

  const partner = await getPartnerBySlug(session.partnerSlug);
  if (!partner) redirect('/partner/login?next=/partner/dashboard');

  const sbStats = await countMagazinesByPartner(partner.slug, partner.id || undefined);
  const stats = sbStats ?? countPartnerMagazines(partner.id ?? '');

  const analytics = await getPartnerAnalytics({
    partnerId: partner.id ?? undefined,
    partnerSlug: partner.slug,
  });

  return (
    <PartnerDashboardClient
      partner={{
        id: partner.id ?? '',
        businessName: partner.businessName ?? '',
        slug: partner.slug,
        businessType: partner.businessType ?? '',
        activityType: partner.activityType ?? '',
        mainIsland: partner.mainIsland ?? '',
        whatsapp: partner.whatsapp ?? '',
        website: partner.website || '',
        logoUrl: partner.logoUrl || '',
        brandingNote: partner.brandingNote || '',
        googleReviewUrl: partner.googleReviewUrl || '',
        instagramUrl: partner.instagramUrl || '',
        bookingUrl: partner.bookingUrl || '',
        plan: partner.plan,
        subscriptionStatus: partner.subscriptionStatus,
        monthlyMagazineLimit: partner.monthlyMagazineLimit ?? FREE_MONTHLY_MAGAZINE_LIMIT,
      }}
      stats={stats}
      analytics={analytics}
    />
  );
}
