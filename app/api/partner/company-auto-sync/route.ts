import { NextRequest, NextResponse } from 'next/server';
import { generateCompanyIntelligence } from '@/lib/ai/company-intelligence';
import { getPartnerSession } from '@/lib/auth/partner-session';
import { getPartnerBySlug, updatePartner } from '@/lib/db/partners';
import { buildCompanyEnrichmentFromSerpApi } from '@/lib/serpapi/maps';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function languageForIsland(island: string): 'en' | 'es' {
  const spanishIslands = ['tenerife', 'fuerteventura', 'lanzarote', 'gran canaria', 'la palma', 'la gomera', 'el hierro'];
  return spanishIslands.includes(island.toLowerCase().trim()) ? 'es' : 'en';
}

export async function POST(req: NextRequest) {
  try {
    const session = getPartnerSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const partner = await getPartnerBySlug(session.partnerSlug);
    if (!partner) return NextResponse.json({ error: 'Partner not found' }, { status: 404 });

    const body = await req.json().catch(() => ({}));
    const businessName = String(body.businessName || partner.businessName || '').trim();
    const island = String(body.island || partner.mainIsland || '').trim();
    const businessType = String(body.businessType || partner.activityType || partner.businessType || '').trim();
    const language = String(body.language || languageForIsland(island));

    if (!process.env.SERPAPI_API_KEY) {
      return NextResponse.json({ ok: false, status: 'missing_key' });
    }

    const now = new Date().toISOString();
    const enrichment = await buildCompanyEnrichmentFromSerpApi({
      partner: {
        businessName,
        mainIsland: island,
        activityType: partner.activityType,
        businessType,
      },
      language,
    });

    if (enrichment.status === 'missing_key') {
      return NextResponse.json({ ok: false, status: 'missing_key' });
    }

    if (enrichment.status === 'not_found') {
      await updatePartner(partner.slug, {
        google_match_status: 'not_found',
        google_match_confidence: null,
        company_enrichment_synced_at: now,
      });
      return NextResponse.json({ ok: false, status: 'not_found' });
    }

    if (enrichment.status === 'error') {
      return NextResponse.json({ ok: false, status: 'error', error: enrichment.message });
    }

    const { candidate, confidence, positiveReviews, googlePhotos, googleTypes, rating, reviewCount } = enrichment;

    const intelligence = await generateCompanyIntelligence({
      partner: {
        businessName,
        mainIsland: island,
        activityType: partner.activityType,
        businessType: partner.businessType,
      },
      googlePlace: {
        name: candidate.title,
        types: googleTypes,
      },
      positiveReviews,
      rating,
      reviewCount,
      googleTypes,
      island,
      language: language === 'es' ? 'es' : 'en',
    });

    await updatePartner(partner.slug, {
      serpapi_place_id: candidate.placeId || null,
      serpapi_data_id: candidate.dataId || null,
      google_place_name: candidate.title,
      google_maps_url: candidate.links?.website || candidate.website || null,
      google_rating: rating ?? null,
      google_review_count: reviewCount ?? null,
      google_primary_type: candidate.type || null,
      google_types: googleTypes,
      google_reviews_cache: positiveReviews,
      google_photos_cache: googlePhotos,
      google_match_confidence: confidence,
      google_match_status: 'synced',
      ai_detected_activity_type: intelligence.detectedActivityType,
      ai_company_summary: intelligence.companySummary,
      ai_positive_review_themes: intelligence.positiveReviewThemes,
      ai_island_context_line: intelligence.islandContextLine,
      ai_activity_description: intelligence.activityDescription,
      ai_company_page_title: intelligence.companyPageTitle,
      ai_company_page_subtitle: intelligence.companyPageSubtitle,
      ai_company_page_body: intelligence.companyPageBody,
      ai_company_trust_line: intelligence.trustLine,
      ai_company_final_cta_line: intelligence.finalPageCtaLine,
      ai_company_photo_captions: intelligence.photoCaptions,
      company_enrichment_synced_at: now,
    });

    return NextResponse.json({
      ok: true,
      status: 'synced',
      data: {
        googlePlaceName: candidate.title,
        googleRating: rating,
        googleReviewCount: reviewCount,
        googlePhotos,
        detectedActivityType: intelligence.detectedActivityType,
        companySummary: intelligence.companySummary,
        positiveReviewThemes: intelligence.positiveReviewThemes,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.warn('[company-auto-sync] failed:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
