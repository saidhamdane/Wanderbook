import { NextRequest, NextResponse } from 'next/server';
import { saveUploadedFiles } from '@/lib/upload-handler';
import { generateMagazine, insertCompanyPageIfNeeded } from '@/lib/magazine/generate-magazine';
import { saveMagazine } from '@/lib/magazine/store';
import { normalizeLanguage } from '@/lib/magazine/generate-copy';
import { getPartnerBySlug } from '@/lib/db/partners';
import { resolveActivityProfile } from '@/lib/magazine/resolveActivityProfile';
import { canPartnerCreateMagazine, FREE_MONTHLY_MAGAZINE_LIMIT } from '@/lib/subscription';
import { trackPartnerEvent } from '@/lib/db/partner-events';
import { getAdminSession } from '@/lib/admin-auth';
import type { LayoutPartner, MagazineGenerationMode } from '@/lib/magazine/types';

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

function applySpanishCompanyCopyOverride(
  partner: LayoutPartner,
  activityType: string | undefined
): void {
  function looksEnglish(value: string | undefined): boolean {
    if (!value) return false;
    const lower = value.toLowerCase();
    return (
      /\bthe\b/.test(lower) ||
      /\bour\b/.test(lower) ||
      /\byour\b/.test(lower) ||
      /\bawait\b/.test(lower) ||
      /\brugged\b/.test(lower) ||
      /\bunleash\b/.test(lower) ||
      /\bexplore\b/.test(lower) ||
      /\bdiscover\b/.test(lower) ||
      /\blandscapes\b/.test(lower) ||
      /\bexploration\b/.test(lower) ||
      /\bunforgettable\b/.test(lower) ||
      /\bexperience\b/.test(lower) ||
      /\bwith\b/.test(lower) ||
      /\band\b/.test(lower) ||
      /\bfor\b/.test(lower)
    );
  }

  const name = partner.businessName || 'la empresa';
  const island = partner.mainIsland || 'Fuerteventura';
  const fallbackByActivity: Record<string, {
    title: string;
    subtitle: string;
    summary: string;
    body: string;
    trustLine: string;
    ctaLine: string;
    contextLine: string;
  }> = {
    'buggy-adventure': {
      title: `${name}: aventura todoterreno en ${island}`,
      subtitle: `Aventura en buggy por paisajes volcanicos`,
      summary: `${name} crea rutas de buggy con foco en caminos de tierra, terreno volcanico y aventura segura en ${island}.`,
      body: `La experiencia con ${name} recorre el lado mas aventurero de ${island}: pistas abiertas, paisaje seco y momentos pensados para recordar la ruta sin perder el foco en la actividad.`,
      trustLine: 'Los viajeros destacan la energia del recorrido y el conocimiento del terreno.',
      ctaLine: `Vuelve a explorar ${island} en buggy con ${name}.`,
      contextLine: 'Los paisajes volcanicos de Fuerteventura te esperan para una aventura inolvidable.',
    },
    'boat-tour': {
      title: `${name}: ${island} desde el mar`,
      subtitle: `Tour en barco por la costa atlantica`,
      summary: `${name} ofrece una salida en barco centrada en mar, costa y luz atlantica.`,
      body: `La experiencia muestra ${island} desde el Atlantico, con el barco como protagonista y una mirada tranquila a la costa, el viento y el horizonte.`,
      trustLine: 'Los viajeros destacan la calma del mar, la atencion del equipo y las vistas de la costa.',
      ctaLine: `Reserva tu proxima salida en barco con ${name}.`,
      contextLine: `Descubre ${island} desde el mar con una salida pensada para disfrutar la costa.`,
    },
    'surf-camp': {
      title: `${name}: surf en ${island}`,
      subtitle: 'Olas, clases y progresion en la playa',
      summary: `${name} acompana a los viajeros en una experiencia de surf adaptada al ritmo del mar.`,
      body: `Cada sesion conecta playa, tabla y aprendizaje para que el recuerdo mantenga el foco en las olas y en la progresion del viajero.`,
      trustLine: 'Los viajeros destacan la cercania de los instructores y el ambiente de aprendizaje.',
      ctaLine: `Reserva tu proxima clase de surf con ${name}.`,
      contextLine: `Descubre ${island} desde la playa, las olas y el ritmo del surf.`,
    },
    'tour-guide': {
      title: `${name}: rutas con mirada local`,
      subtitle: `Guia turistico en ${island}`,
      summary: `${name} acerca la isla a traves de rutas, miradores, pueblos y contexto local.`,
      body: `La experiencia guiada convierte cada parada en parte de una historia: paisaje, cultura y detalles de ${island} contados con cercania.`,
      trustLine: 'Los viajeros destacan el conocimiento local y el trato cercano.',
      ctaLine: `Reserva tu proxima ruta guiada con ${name}.`,
      contextLine: `Descubre ${island} con una ruta guiada y una mirada local.`,
    },
    'villa-rental': {
      title: `${name}: estancia con comodidad local`,
      subtitle: `Alquiler vacacional en ${island}`,
      summary: `${name} ofrece una estancia pensada para descansar y vivir la isla a tu ritmo.`,
      body: `La experiencia combina comodidad, ubicacion y detalles practicos para que cada dia en ${island} se sienta facil y propio.`,
      trustLine: 'Los huespedes destacan la comodidad, la limpieza y la atencion recibida.',
      ctaLine: `Reserva tu proxima estancia con ${name}.`,
      contextLine: `Descubre ${island} desde una estancia tranquila y bien situada.`,
    },
    photographer: {
      title: `${name}: recuerdos con luz de isla`,
      subtitle: `Sesion fotografica en ${island}`,
      summary: `${name} crea sesiones fotograficas con retratos, paisaje y luz natural como protagonistas.`,
      body: `La sesion busca momentos autenticos y encuadres cuidados para convertir la experiencia en un recuerdo visual de ${island}.`,
      trustLine: 'Los viajeros destacan la direccion cercana y el resultado natural de las fotos.',
      ctaLine: `Reserva tu proxima sesion de fotos con ${name}.`,
      contextLine: `Descubre ${island} con una sesion donde la luz y el recuerdo son protagonistas.`,
    },
    restaurant: {
      title: `${name}: sabores de ${island}`,
      subtitle: 'Cocina local y momentos de mesa',
      summary: `${name} reune producto, servicio y ambiente para una experiencia gastronomica memorable.`,
      body: `La visita se centra en el sabor, la mesa y la hospitalidad, con una cocina que conecta con el caracter de ${island}.`,
      trustLine: 'Los clientes destacan el sabor, el servicio y el ambiente del restaurante.',
      ctaLine: `Reserva tu proxima mesa en ${name}.`,
      contextLine: `Descubre ${island} a traves de su mesa, sus sabores y su hospitalidad.`,
    },
    hotel: {
      title: `${name}: estancia en ${island}`,
      subtitle: 'Comodidad, servicio y hospitalidad',
      summary: `${name} ofrece una estancia cuidada para disfrutar la isla con comodidad.`,
      body: `Desde la llegada hasta la salida, la experiencia se centra en descanso, atencion y detalles que hacen mas facil el viaje.`,
      trustLine: 'Los huespedes destacan la comodidad, el servicio y la ubicacion.',
      ctaLine: `Reserva tu proxima estancia con ${name}.`,
      contextLine: `Descubre ${island} desde una estancia comoda y cuidada.`,
    },
    other: {
      title: `${name}: experiencia en ${island}`,
      subtitle: 'Una revista recuerdo de la experiencia',
      summary: `${name} forma parte de una experiencia pensada para recordar la isla con contexto y cercania.`,
      body: `La revista mantiene una mirada neutral y local sobre ${island}, con paisajes y detalles que acompanan el recuerdo del viajero.`,
      trustLine: 'Los viajeros destacan el trato cercano y la experiencia vivida.',
      ctaLine: `Reserva tu proxima experiencia con ${name}.`,
      contextLine: `Descubre ${island} a traves de una experiencia pensada para cada viajero.`,
    },
  };
  const fallback = fallbackByActivity[activityType || 'other'] ?? fallbackByActivity.other;

  if (looksEnglish(partner.aiCompanyPageTitle)) partner.aiCompanyPageTitle = fallback.title;
  if (looksEnglish(partner.aiCompanyPageSubtitle)) partner.aiCompanyPageSubtitle = fallback.subtitle;
  if (looksEnglish(partner.aiCompanySummary)) partner.aiCompanySummary = fallback.summary;
  if (looksEnglish(partner.aiCompanyPageBody)) partner.aiCompanyPageBody = fallback.body;
  if (looksEnglish(partner.aiCompanyFinalCtaLine)) partner.aiCompanyFinalCtaLine = fallback.ctaLine;
  if (looksEnglish(partner.aiCompanyTrustLine)) partner.aiCompanyTrustLine = fallback.trustLine;
  if (looksEnglish(partner.aiIslandContextLine)) partner.aiIslandContextLine = fallback.contextLine;
  if (looksEnglish(partner.aiActivityDescription)) partner.aiActivityDescription = fallback.trustLine;
  if (Array.isArray(partner.aiCompanyPhotoCaptions)) {
    partner.aiCompanyPhotoCaptions = partner.aiCompanyPhotoCaptions.map((caption) =>
      looksEnglish(caption) ? fallback.subtitle : caption
    );
  }
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
    let demoPhotoFiles: File[] = [];
    let partnerSlug: string | undefined;
    let generationMode: MagazineGenerationMode = 'traveler';

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
      generationMode = body.generationMode === 'demo' || body.mode === 'demo' ? 'demo' : 'traveler';
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
      generationMode = String(form.get('generationMode') || form.get('mode') || 'traveler') === 'demo' ? 'demo' : 'traveler';
      const fileEntries = form.getAll('photos');
      for (const entry of fileEntries) {
        if (entry instanceof File && entry.size > 0) photoFiles.push(entry);
      }
      const demoEntries = form.getAll('demoPhotos');
      for (const entry of demoEntries) {
        if (entry instanceof File && entry.size > 0) demoPhotoFiles.push(entry);
      }
    }

    language = normalizeLanguage(language);

    if (generationMode === 'demo' && !getAdminSession()) {
      return NextResponse.json(
        { error: 'Demo generation is restricted to Wanderbook admins.' },
        { status: 403 }
      );
    }

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
    if (partnerSlug && generationMode !== 'demo') {
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
    const { photos: demoPhotos } = demoPhotoFiles.length > 0
      ? await saveUploadedFiles(demoPhotoFiles)
      : { photos: [] };

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
      generationMode,
      demoUploads: demoPhotos,
      useStockFallback,
      sessionId,
      activityProfile,
      partnerId: partnerRecord?.id,
    });

    doc.language = language;
    doc.generationMode = generationMode;
    doc.isPubliclyShareable = generationMode !== 'demo';

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
        magazineId: generationMode === 'demo' ? undefined : doc.id,
        googlePlaceName: partnerRecord?.googlePlaceName ?? undefined,
        googlePrimaryType: partnerRecord?.googlePrimaryType ?? undefined,
        googleTypes: partnerRecord?.googleTypes ?? undefined,
        googleRating: partnerRecord?.googleRating ?? undefined,
        googleReviewCount: partnerRecord?.googleReviewCount ?? undefined,
        googlePhotos: partnerRecord?.googlePhotos ?? undefined,
        demoCompanyImage: activityProfile?.demoAssets.company[0],
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
      if (language === 'es' && activityProfile) {
        applySpanishCompanyCopyOverride(doc.partner, activityProfile.activityType);
      }
      const demoCompanyImage = activityProfile?.demoAssets.company[0];
      if (doc.imageAudit && demoCompanyImage) {
        doc.imageAudit.selectedImages.push({
          url: demoCompanyImage,
          source: 'company-photo',
          slot: 'company-photo',
          activityType: activityProfile.activityType,
          accepted: true,
        });
      }
      if (doc.generationAudit) {
        doc.generationAudit.resolvedActivityType = activityProfile?.activityType || doc.generationAudit.resolvedActivityType;
        doc.generationAudit.selectedTemplate = doc.templateId;
        doc.generationAudit.partnerId = doc.partner.partnerId;
      }
      insertCompanyPageIfNeeded(doc, doc.partner);
      doc.source = generationMode === 'demo' ? 'partner_demo' : 'partner_client';
    }

    await saveMagazine(doc);

    // Track magazine creation event (fire-and-forget)
    if (partnerSlug && doc.partner && generationMode !== 'demo') {
      trackPartnerEvent({
        partnerId: (doc.partner.partnerId as string | undefined) ?? undefined,
        partnerSlug,
        magazineId: doc.id,
        eventType: 'magazine_created',
        metadata: { templateId: doc.templateId, destination, language },
      }).catch(() => {});
    }

    const publicDoc = { ...doc };
    delete publicDoc.imageAudit;
    return NextResponse.json(publicDoc);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Generation failed', detail: message }, { status: 500 });
  }
}
