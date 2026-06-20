import OpenAI from 'openai';

export type CompanyIntelligenceInput = {
  partner: {
    businessName: string;
    mainIsland: string;
    activityType?: string;
    businessType?: string;
  };
  googlePlace?: {
    name?: string;
    types?: string[];
  } | null;
  positiveReviews?: Array<{ text: string; rating: number }>;
  rating?: number;
  reviewCount?: number;
  googleTypes?: string[];
  island: string;
  language: 'en' | 'es';
};

export type CompanyIntelligence = {
  detectedActivityType: string;
  islandContextLine: string;
  activityDescription: string;
  companyPageTitle: string;
  companyPageSubtitle: string;
  companySummary: string;
  positiveReviewThemes: string[];
  companyPageBody: string;
  trustLine: string;
  finalPageCtaLine: string;
  photoCaptions: string[];
};

const ACTIVITY_TYPES = [
  'surf camp',
  'villa / apartment rental',
  'tour guide',
  'boat tour',
  'photographer',
  'buggy adventure',
  'restaurant',
  'hotel',
  'other',
] as const;

function detectFallbackActivity(input: CompanyIntelligenceInput): string {
  const source = [
    input.partner.activityType,
    input.partner.businessType,
    input.googleTypes?.join(' '),
    input.googlePlace?.types?.join(' '),
  ].filter(Boolean).join(' ').toLowerCase();
  if (source.includes('surf')) return 'surf camp';
  if (source.includes('villa') || source.includes('rental') || source.includes('lodging') || source.includes('apartment')) return 'villa / apartment rental';
  if (source.includes('boat') || source.includes('sail')) return 'boat tour';
  if (source.includes('photo')) return 'photographer';
  if (source.includes('buggy') || source.includes('adventure')) return 'buggy adventure';
  if (source.includes('restaurant') || source.includes('food')) return 'restaurant';
  if (source.includes('hotel')) return 'hotel';
  if (source.includes('tour') || source.includes('guide') || source.includes('travel_agency')) return 'tour guide';
  return 'other';
}

function looksEnglish(value: string): boolean {
  const lower = value.toLowerCase();
  return (
    lower.includes(' the ') ||
    lower.startsWith('the ') ||
    lower.includes('unleash') ||
    lower.includes('explore ') ||
    lower.includes('discover ') ||
    lower.includes('your adventure') ||
    /\byour\b/.test(lower)
  );
}

function fallbackFor(input: CompanyIntelligenceInput): CompanyIntelligence {
  const businessName = input.partner.businessName;
  const island = input.island || input.partner.mainIsland;
  const activity = detectFallbackActivity(input);
  const themes = (input.positiveReviews || []).length > 0 ? ['friendly service', 'memorable experience'].slice(0, 2) : [];
  const spanish = input.language === 'es';
  const base = {
    detectedActivityType: activity,
    islandContextLine: spanish
      ? `${businessName} conecta a sus huéspedes con el ritmo de ${island}.`
      : `${businessName} connects guests with the local rhythm of ${island}.`,
    activityDescription: spanish
      ? `Una experiencia de ${activity} pensada para viajeros que quieren disfrutar ${island} con calma y confianza.`
      : `A ${activity} experience for travelers who want to enjoy ${island} with confidence and local texture.`,
    companyPageTitle: spanish ? `La experiencia con ${businessName}` : `The ${businessName} Experience`,
    companyPageSubtitle: spanish ? `${activity} en ${island}` : `${activity} on ${island}`,
    companySummary: spanish
      ? `${businessName} ofrece ${activity} en ${island}, con una forma de viajar cercana, práctica y bien situada.`
      : `${businessName} offers ${activity} on ${island}, shaped around easy travel, local context, and a strong sense of place.`,
    positiveReviewThemes: themes,
    companyPageBody: spanish
      ? `${businessName} forma parte de la manera en que los viajeros viven ${island}: con tiempo para mirar alrededor, elegir buenos momentos y llevarse una historia propia.\n\nLa experiencia combina ${activity} con el carácter de la isla, desde sus paisajes hasta sus pequeños rituales locales.`
      : `${businessName} is part of how travelers experience ${island}: with time to look around, choose the right moments, and take home a story that feels personal.\n\nThe experience brings ${activity} together with the character of the island, from its landscapes to the small local rituals that make the day linger.`,
    trustLine: themes.length > 0
      ? (spanish ? 'Los huéspedes destacan el trato cercano y la experiencia cuidada.' : 'Guests often highlight the warm service and well-shaped experience.')
      : '',
    finalPageCtaLine: spanish ? `Vuelve a vivir ${island} con ${businessName}` : `Experience ${island} again with ${businessName}`,
    photoCaptions: spanish
      ? [`Momentos con ${businessName}`, `${island} en primera persona`, 'Un recuerdo para guardar']
      : [`Moments with ${businessName}`, `${island} in your own frame`, 'A memory worth keeping'],
  };

  if (activity === 'buggy adventure' && spanish) {
    return {
      ...base,
      companyPageTitle: `${businessName}: despierta tu espíritu aventurero`,
      companyPageSubtitle: `Aventura en buggy en ${island}`,
      companySummary: `${businessName} organiza rutas en buggy por el interior volcánico de ${island}: pistas de tierra, dunas y paisajes abiertos alejados de la costa.`,
      companyPageBody: `${businessName} acompaña a sus viajeros por los caminos menos visibles de ${island}: terreno volcánico, pistas de arena y vistas sin multitudes.\n\nCada ruta está pensada para sentir la isla desde el suelo, sin prisas y con la energía propia de una aventura en buggy.`,
      trustLine: 'Los viajeros destacan la energía del recorrido y el conocimiento del terreno.',
      finalPageCtaLine: `Vuelve a explorar ${island} en buggy con ${businessName}`,
      islandContextLine: `${island} tiene más de 150 km de pistas volcánicas. ${businessName} conoce las mejores.`,
      activityDescription: `Una aventura en buggy diseñada para descubrir el interior de ${island}: dunas, volcanes y caminos que no aparecen en los mapas turísticos.`,
      photoCaptions: [`Ruta con ${businessName}`, `Paisaje volcánico de ${island}`, 'Aventura en buggy'],
    };
  }

  return base;
}

function buildSystemPrompt(language: 'en' | 'es'): string {
  const languageLine = language === 'es'
    ? 'Write in natural Spanish for a premium travel magazine.'
    : 'Write in premium travel magazine English.';
  return [
    'You write business-specific branded travel magazine pages for Wanderbook.',
    languageLine,
    'Detect exactly one activity type from: ' + ACTIVITY_TYPES.join(', ') + '.',
    'Use the company name, island name, and detected activity in the copy.',
    'Use real positive review themes only when review text is provided. Do not invent reviews, awards, rankings, guarantees, or exact guest quotes.',
    'If there are no reviews, keep positiveReviewThemes empty and omit review claims.',
    'Avoid generic filler. Make the copy specific to the activity and island.',
    'Island hints: Fuerteventura has waves, wind, Corralejo, Betancuria, volcanic landscapes, white villages, beaches, and surf rhythm. Lanzarote has volcanic art, Timanfaya, César Manrique, lava fields, and coast. Gran Canaria has dunes, Maspalomas, Puerto de Mogán, mountains, and city energy. Tenerife has Teide, forest, coast, villages, and dramatic altitude.',
    'Pilot tones: surf camp in Fuerteventura means surf week, local island experience, waves, Corralejo, surf smart. Villa rental in Fuerteventura means welcome home, comfort, direct booking, local guide. Tour guide in Fuerteventura means authentic island, guided routes, Betancuria, viewpoints, villages.',
    'Return only JSON with keys: detectedActivityType, islandContextLine, activityDescription, companyPageTitle, companyPageSubtitle, companySummary, positiveReviewThemes, companyPageBody, trustLine, finalPageCtaLine, photoCaptions.',
  ].join('\n');
}

export async function generateCompanyIntelligence(input: CompanyIntelligenceInput): Promise<CompanyIntelligence> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return fallbackFor(input);
  try {
    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.65,
      max_tokens: 1200,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: buildSystemPrompt(input.language) },
        {
          role: 'user',
          content: JSON.stringify({
            companyName: input.partner.businessName,
            island: input.island,
            activityType: input.partner.activityType,
            businessType: input.partner.businessType,
            googlePlaceName: input.googlePlace?.name,
            googleTypes: input.googleTypes || input.googlePlace?.types || [],
            rating: input.rating,
            reviewCount: input.reviewCount,
            positiveReviews: input.positiveReviews || [],
          }),
        },
      ],
    });
    const parsed = JSON.parse(completion.choices[0]?.message?.content || '{}');
    const fallback = fallbackFor(input);
    const result = {
      detectedActivityType: String(parsed.detectedActivityType || fallback.detectedActivityType),
      islandContextLine: String(parsed.islandContextLine || fallback.islandContextLine),
      activityDescription: String(parsed.activityDescription || fallback.activityDescription),
      companyPageTitle: String(parsed.companyPageTitle || fallback.companyPageTitle),
      companyPageSubtitle: String(parsed.companyPageSubtitle || fallback.companyPageSubtitle),
      companySummary: String(parsed.companySummary || fallback.companySummary),
      positiveReviewThemes: Array.isArray(parsed.positiveReviewThemes) ? parsed.positiveReviewThemes.map(String).slice(0, 6) : fallback.positiveReviewThemes,
      companyPageBody: String(parsed.companyPageBody || fallback.companyPageBody),
      trustLine: String(parsed.trustLine || fallback.trustLine),
      finalPageCtaLine: String(parsed.finalPageCtaLine || fallback.finalPageCtaLine),
      photoCaptions: Array.isArray(parsed.photoCaptions) ? parsed.photoCaptions.map(String).slice(0, 5) : fallback.photoCaptions,
    };
    if (input.language === 'es') {
      if (looksEnglish(result.companyPageTitle)) result.companyPageTitle = fallback.companyPageTitle;
      if (looksEnglish(result.companyPageSubtitle)) result.companyPageSubtitle = fallback.companyPageSubtitle;
      if (looksEnglish(result.trustLine)) result.trustLine = fallback.trustLine;
      if (looksEnglish(result.finalPageCtaLine)) result.finalPageCtaLine = fallback.finalPageCtaLine;
    }
    return result;
  } catch (err) {
    console.warn('[ai/company-intelligence] generation failed:', err);
    return fallbackFor(input);
  }
}
