import { NextRequest, NextResponse } from 'next/server';
import { saveUploadedFiles } from '@/lib/upload-handler';
import { generateMagazine, insertCompanyPageIfNeeded } from '@/lib/magazine/generate-magazine';
import { saveMagazine } from '@/lib/magazine/store';
import { normalizeLanguage } from '@/lib/magazine/generate-copy';
import { getPartnerBySlug } from '@/lib/db/partners';
import { resolveActivityProfile } from '@/lib/magazine/resolveActivityProfile';
import { canPartnerCreateMagazine, FREE_MONTHLY_MAGAZINE_LIMIT } from '@/lib/subscription';
import { trackPartnerEvent } from '@/lib/db/partner-events';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EXPERIENCE_TEMPLATE_IDS = new Set([
  'photographer-experience',
  'tour-guide-experience',
  'boat-trip-experience',
  'buggy-adventure-experience',
  'holiday-rental-memory',
]);

function realContactValue(value: unknown): string {
  const text = String(value || '').trim();
  if (!text) return '';
  const normalized = text.toLowerCase();
  if (
    normalized.includes('placeholder') ||
    normalized.includes('demo') ||
    normalized.includes('example.com') ||
    normalized.includes('123456789') ||
    normalized.includes('000000000')
  ) {
    return '';
  }
  return text;
}

export async function POST(req: NextRequest) {
  try {
    const ct = req.headers.get('content-type') ?? '';
    let templateId = '';
    let destination = '';
    let travelers = '';
    let style = 'Warm & Personal';
    let language = 'en';
    let notes: string | undefined;
    let tagline: string | undefined;
    let familyName: string | undefined;
    let useStockFallback = true;
    let photoFiles: File[] = [];
    let partnerSlug: string | undefined;

    if (ct.includes('application/json')) {
      const body = await req.json();
      templateId = String(body.templateId || '');
      destination = String(body.destination || '');
      travelers = String(body.travelers || body.familyName || '');
      style = String(body.style || 'Warm & Personal');
      language = String(body.language || 'en');
      notes = body.notes ? String(body.notes) : undefined;
      tagline = body.tagline ? String(body.tagline) : undefined;
      familyName = body.familyName ? String(body.familyName) : undefined;
      useStockFallback = body.useStockFallback !== false;
      partnerSlug = body.partnerSlug ? String(body.partnerSlug) : undefined;
    } else {
      const form = await req.formData();
      templateId = String(form.get('templateId') || '');
      destination = String(form.get('destination') || '');
      travelers = String(form.get('travelers') || '');
      style = String(form.get('style') || 'Warm & Personal');
      language = String(form.get('language') || 'en');
      notes = form.get('notes') ? String(form.get('notes')) : undefined;
      tagline = form.get('tagline') ? String(form.get('tagline')) : undefined;
      familyName = form.get('familyName') ? String(form.get('familyName')) : undefined;
      useStockFallback = String(form.get('useStockFallback') || 'true') === 'true';
      partnerSlug = form.get('partnerSlug') ? String(form.get('partnerSlug')) : undefined;
      const fileEntries = form.getAll('photos');
      for (const entry of fileEntries) {
        if (entry instanceof File && entry.size > 0) photoFiles.push(entry);
      }
    }

    language = normalizeLanguage(language);

    if (!templateId || !destination) {
      return NextResponse.json(
        { error: 'templateId and destination are required' },
        { status: 400 }
      );
    }

    let partnerRecord = partnerSlug ? await getPartnerBySlug(partnerSlug) : null;
    const activityProfile = partnerRecord
      ? resolveActivityProfile(partnerRecord, language)
      : undefined;

    if (
      activityProfile &&
      activityProfile.activityType !== 'other' &&
      activityProfile.templateId !== 'aurora-editorial' &&
      templateId !== activityProfile.templateId
    ) {
      templateId = activityProfile.templateId;
    } else if (activityProfile && !EXPERIENCE_TEMPLATE_IDS.has(templateId) && activityProfile.templateId !== 'aurora-editorial') {
      templateId = activityProfile.templateId;
    }

    // Enforce Free plan magazine limit before any expensive work
    if (partnerSlug) {
      const partnerFull = partnerRecord;
      if (partnerFull) {
        const check = await canPartnerCreateMagazine(partnerFull);
        if (!check.allowed) {
          return NextResponse.json(
            {
              ok: false,
              code: 'FREE_LIMIT_REACHED',
              error: 'Free plan limit reached. Upgrade to Unlimited to create more magazines.',
              usage: { current: check.usage.current, limit: FREE_MONTHLY_MAGAZINE_LIMIT },
              upgradeUrl: '/partner/upgrade',
            },
            { status: 402 }
          );
        }
      }
    }

    const { sessionId, photos } = await saveUploadedFiles(photoFiles);

    const doc = await generateMagazine({
      templateId,
      destination,
      travelers,
      style,
      language,
      notes,
      tagline,
      familyName,
      userPhotos: photos,
      useStockFallback,
      sessionId,
      activityProfile,
      partnerId: partnerRecord?.id,
    });

    doc.language = language;

    if (partnerSlug) {
      doc.partner = {
        enabled: true,
        slug: partnerSlug,
        partnerId: partnerRecord?.id ?? undefined,
        businessName: partnerRecord?.businessName ?? partnerSlug,
        businessType: partnerRecord?.businessType ?? '',
        activityType: partnerRecord?.activityType ?? '',
        resolvedActivityType: activityProfile?.activityType,
        activityLabel: activityProfile?.activityLabel,
        mainIsland: partnerRecord?.mainIsland ?? '',
        whatsapp: realContactValue(partnerRecord?.whatsapp),
        website: realContactValue(partnerRecord?.website),
        logoUrl: partnerRecord?.logoUrl ?? '',
        brandingNote: partnerRecord?.brandingNote ?? '',
        googleReviewUrl: realContactValue(partnerRecord?.googleReviewUrl),
        instagramUrl: realContactValue(partnerRecord?.instagramUrl),
        bookingUrl: realContactValue(partnerRecord?.bookingUrl),
        magazineId: doc.id,
        googlePlaceName: partnerRecord?.googlePlaceName ?? undefined,
        googlePrimaryType: partnerRecord?.googlePrimaryType ?? undefined,
        googleTypes: partnerRecord?.googleTypes ?? undefined,
        googleRating: partnerRecord?.googleRating ?? undefined,
        googleReviewCount: partnerRecord?.googleReviewCount ?? undefined,
        googlePhotos: partnerRecord?.googlePhotos ?? undefined,
        aiDetectedActivityType: partnerRecord?.aiDetectedActivityType ?? undefined,
        aiIslandContextLine: partnerRecord?.aiIslandContextLine ?? undefined,
        aiActivityDescription: partnerRecord?.aiActivityDescription ?? undefined,
        aiCompanySummary: partnerRecord?.aiCompanySummary ?? undefined,
        aiPositiveReviewThemes: partnerRecord?.aiPositiveReviewThemes ?? undefined,
        aiCompanyPageTitle: partnerRecord?.aiCompanyPageTitle ?? undefined,
        aiCompanyPageSubtitle: partnerRecord?.aiCompanyPageSubtitle ?? undefined,
        aiCompanyPageBody: partnerRecord?.aiCompanyPageBody ?? undefined,
        aiCompanyTrustLine: partnerRecord?.aiCompanyTrustLine ?? undefined,
        aiCompanyFinalCtaLine: partnerRecord?.aiCompanyFinalCtaLine ?? undefined,
        aiCompanyPhotoCaptions: partnerRecord?.aiCompanyPhotoCaptions ?? undefined,
      };
      if (doc.generationAudit) {
        doc.generationAudit.resolvedActivityType = activityProfile?.activityType || doc.generationAudit.resolvedActivityType;
        doc.generationAudit.selectedTemplate = doc.templateId;
        doc.generationAudit.partnerId = doc.partner.partnerId;
      }
      insertCompanyPageIfNeeded(doc, doc.partner);
      doc.source = 'partner_client';
    }

    await saveMagazine(doc);

    // Track magazine creation event (fire-and-forget)
    if (partnerSlug && doc.partner) {
      trackPartnerEvent({
        partnerId: (doc.partner.partnerId as string | undefined) ?? undefined,
        partnerSlug,
        magazineId: doc.id,
        eventType: 'magazine_created',
        metadata: { templateId: doc.templateId, destination, language },
      }).catch(() => {});
    }

    return NextResponse.json(doc);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Generation failed', detail: message }, { status: 500 });
  }
}
