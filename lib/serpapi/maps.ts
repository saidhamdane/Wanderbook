export type SerpApiCandidate = {
  title: string;
  address: string;
  placeId: string;
  dataId: string;
  dataCid: string;
  gpsCoordinates?: { latitude: number; longitude: number };
  rating?: number;
  reviews?: number;
  type?: string;
  types?: string[];
  thumbnail?: string;
  website?: string;
  phone?: string;
  links?: Record<string, string>;
};

export type SerpApiReview = {
  authorName: string;
  rating: number;
  text: string;
  date: string;
  language?: string;
  likes?: number;
};

export type NormalizedPhoto = {
  reference: string;
  proxyUrl: string;
};

export type CompanyEnrichment =
  | { status: 'missing_key' }
  | { status: 'not_found' }
  | { status: 'error'; message: string }
  | {
      status: 'found';
      candidate: SerpApiCandidate;
      confidence: number;
      positiveReviews: SerpApiReview[];
      googlePhotos: NormalizedPhoto[];
      googleTypes: string[];
      rating?: number;
      reviewCount?: number;
    };

const TYPE_HINTS: Record<string, string[]> = {
  'surf camp': ['surf', 'school', 'travel agency', 'point of interest', 'establishment'],
  'surf school': ['surf', 'school', 'travel agency', 'point of interest', 'establishment'],
  'villa rental': ['lodging', 'villa', 'rental', 'real estate agency', 'travel agency', 'establishment'],
  'holiday rental': ['lodging', 'rental', 'real estate agency', 'travel agency', 'establishment'],
  'apartment rental': ['lodging', 'apartment', 'rental', 'real estate agency', 'travel agency', 'establishment'],
  'tour guide': ['tour', 'guide', 'tourist attraction', 'travel agency', 'point of interest', 'establishment'],
  'boat tour': ['boat', 'tour', 'tourist attraction', 'travel agency', 'point of interest', 'establishment'],
  photographer: ['photo', 'photographer', 'point of interest', 'establishment'],
  'buggy adventure': ['buggy', 'adventure', 'tourist attraction', 'travel agency', 'point of interest', 'establishment'],
  restaurant: ['restaurant', 'food', 'bar', 'establishment'],
  hotel: ['hotel', 'lodging', 'establishment'],
  other: ['point of interest', 'establishment'],
};

function apiKey(): string {
  return process.env.SERPAPI_API_KEY || '';
}

function normalizeText(value: string | undefined | null): string {
  return (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[_-]+/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function numberOrUndefined(value: unknown): number | undefined {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function stringOrUndefined(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function reviewAuthorName(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (value && typeof value === 'object') {
    const user = value as Record<string, unknown>;
    return stringOrUndefined(user.name) || stringOrUndefined(user.link) || '';
  }
  return '';
}

function tokenOverlap(a: string, b: string): number {
  const aTokens = new Set(normalizeText(a).split(' ').filter(Boolean));
  const bTokens = normalizeText(b).split(' ').filter(Boolean);
  if (aTokens.size === 0 || bTokens.length === 0) return 0;
  const hits = bTokens.filter((token) => aTokens.has(token)).length;
  return hits / Math.max(aTokens.size, bTokens.length);
}

function expectedTypes(businessType?: string): string[] {
  return TYPE_HINTS[normalizeText(businessType)] || TYPE_HINTS.other;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item || '').trim()).filter(Boolean);
}

function normalizeCandidate(result: unknown): SerpApiCandidate | null {
  if (!result || typeof result !== 'object') return null;
  const row = result as Record<string, unknown>;
  const title = stringOrUndefined(row.title);
  const dataId = stringOrUndefined(row.data_id);
  if (!title || !dataId) return null;
  const gps = row.gps_coordinates && typeof row.gps_coordinates === 'object'
    ? row.gps_coordinates as Record<string, unknown>
    : null;
  const links = row.links && typeof row.links === 'object'
    ? Object.fromEntries(
        Object.entries(row.links as Record<string, unknown>)
          .map(([key, value]) => [key, String(value || '')])
          .filter(([, value]) => value)
      )
    : undefined;
  return {
    title,
    address: stringOrUndefined(row.address) || '',
    placeId: stringOrUndefined(row.place_id) || '',
    dataId,
    dataCid: stringOrUndefined(row.data_cid) || '',
    gpsCoordinates: gps
      ? {
          latitude: numberOrUndefined(gps.latitude) ?? 0,
          longitude: numberOrUndefined(gps.longitude) ?? 0,
        }
      : undefined,
    rating: numberOrUndefined(row.rating),
    reviews: numberOrUndefined(row.reviews),
    type: stringOrUndefined(row.type),
    types: toStringArray(row.types),
    thumbnail: stringOrUndefined(row.thumbnail),
    website: stringOrUndefined(row.website),
    phone: stringOrUndefined(row.phone),
    links,
  };
}

async function fetchSerpApi(params: Record<string, string>): Promise<Record<string, unknown> | null> {
  const key = apiKey();
  if (!key) return null;
  const url = new URL('https://serpapi.com/search.json');
  for (const [name, value] of Object.entries(params)) {
    if (value) url.searchParams.set(name, value);
  }
  url.searchParams.set('api_key', key);
  const res = await fetch(url.toString());
  if (!res.ok) return null;
  return await res.json() as Record<string, unknown>;
}

export async function searchCompanyByNameAndIsland({
  businessName,
  island,
  businessType,
  language,
}: {
  businessName: string;
  island: string;
  businessType?: string;
  language?: string;
}): Promise<SerpApiCandidate[]> {
  if (!apiKey()) return [];
  const queries = [
    `${businessName} ${island} Canary Islands`,
    `${businessName} ${island} Canarias`,
    businessType ? `${businessName} ${businessType} ${island}` : '',
  ].filter(Boolean);
  const byId = new Map<string, SerpApiCandidate>();
  try {
    for (const query of queries) {
      const data = await fetchSerpApi({
        engine: 'google_maps',
        q: query,
        hl: language || 'es',
      });
      const results = Array.isArray(data?.local_results) ? data.local_results : [];
      for (const result of results) {
        const candidate = normalizeCandidate(result);
        if (candidate && !byId.has(candidate.dataId)) byId.set(candidate.dataId, candidate);
      }
    }
  } catch (err) {
    console.warn('[serpapi/maps] searchCompanyByNameAndIsland failed:', err);
    return [];
  }
  return Array.from(byId.values());
}

export function calculateMatchConfidence({
  candidate,
  businessName,
  island,
  businessType,
}: {
  candidate: SerpApiCandidate;
  businessName: string;
  island: string;
  businessType?: string;
}): number {
  const normalizedName = normalizeText(candidate.title);
  const targetName = normalizeText(businessName);
  const nameScore = Math.max(normalizedName === targetName ? 1 : 0, tokenOverlap(candidate.title, businessName));
  const address = normalizeText(candidate.address);
  const islandScore = island && address.includes(normalizeText(island)) ? 0.14 : 0.04;
  const categoryText = normalizeText([candidate.type, ...(candidate.types || [])].join(' '));
  const typeScore = expectedTypes(businessType).some((type) => categoryText.includes(normalizeText(type))) ? 0.2 : 0;
  const ratingScore = typeof candidate.rating === 'number' ? 0.02 : 0;
  const reviewScore = typeof candidate.reviews === 'number' && candidate.reviews > 0 ? 0.02 : 0;
  const score = nameScore * 0.62 + islandScore + typeScore + ratingScore + reviewScore;
  return Math.max(0, Math.min(1, Number(score.toFixed(3))));
}

export async function getBestCompanyMatch(params: {
  businessName: string;
  island: string;
  businessType?: string;
  language?: string;
}): Promise<{ candidate: SerpApiCandidate; confidence: number } | null> {
  try {
    const candidates = await searchCompanyByNameAndIsland(params);
    let best: { candidate: SerpApiCandidate; confidence: number } | null = null;
    for (const candidate of candidates) {
      const confidence = calculateMatchConfidence({ candidate, ...params });
      if (!best || confidence > best.confidence) best = { candidate, confidence };
    }
    return best && best.confidence >= 0.7 ? best : null;
  } catch (err) {
    console.warn('[serpapi/maps] getBestCompanyMatch failed:', err);
    return null;
  }
}

export async function getCompanyReviews({
  placeId,
  dataId,
  language,
}: {
  placeId?: string;
  dataId?: string;
  language?: string;
}): Promise<SerpApiReview[]> {
  if (!apiKey() || (!placeId && !dataId)) return [];
  try {
    const data = await fetchSerpApi({
      engine: 'google_maps_reviews',
      place_id: placeId || '',
      data_id: dataId || '',
      hl: language || 'es',
    });
    const reviews = Array.isArray(data?.reviews) ? data.reviews : [];
    return reviews
      .map((review) => {
        const row = review as Record<string, unknown>;
        return {
          authorName: reviewAuthorName(row.user) || stringOrUndefined(row.name) || stringOrUndefined(row.author_name) || '',
          rating: numberOrUndefined(row.rating) ?? 0,
          text: stringOrUndefined(row.snippet) || stringOrUndefined(row.text) || '',
          date: stringOrUndefined(row.date) || '',
          language: stringOrUndefined(row.iso_date) ? undefined : stringOrUndefined(row.language),
          likes: numberOrUndefined(row.likes),
        };
      })
      .filter((review) => review.rating >= 4 && review.text.trim().length > 20)
      .slice(0, 8);
  } catch (err) {
    console.warn('[serpapi/maps] getCompanyReviews failed:', err);
    return [];
  }
}

export async function getCompanyPhotos({
  placeId,
  dataId,
  language,
}: {
  placeId?: string;
  dataId?: string;
  language?: string;
}): Promise<NormalizedPhoto[]> {
  if (!apiKey() || (!placeId && !dataId)) return [];
  try {
    const data = await fetchSerpApi({
      engine: 'google_maps_photos',
      place_id: placeId || '',
      data_id: dataId || '',
      hl: language || 'es',
    });
    const photos = Array.isArray(data?.photos) ? data.photos : [];
    return photos
      .map((photo) => {
        const row = photo as Record<string, unknown>;
        const thumbnail = stringOrUndefined(row.thumbnail);
        const image = stringOrUndefined(row.image) || thumbnail;
        if (!image) return null;
        return {
          reference: thumbnail || stringOrUndefined(row.data_id) || image,
          proxyUrl: image,
        };
      })
      .filter((photo): photo is NormalizedPhoto => Boolean(photo))
      .slice(0, 5);
  } catch (err) {
    console.warn('[serpapi/maps] getCompanyPhotos failed:', err);
    return [];
  }
}

export async function buildCompanyEnrichmentFromSerpApi({
  partner,
  language,
}: {
  partner: {
    businessName: string;
    mainIsland: string;
    activityType?: string;
    businessType?: string;
  };
  language?: string;
}): Promise<CompanyEnrichment> {
  if (!apiKey()) return { status: 'missing_key' };
  try {
    const match = await getBestCompanyMatch({
      businessName: partner.businessName,
      island: partner.mainIsland,
      businessType: partner.activityType || partner.businessType,
      language,
    });
    if (!match) return { status: 'not_found' };
    const [positiveReviews, googlePhotos] = await Promise.all([
      getCompanyReviews({ placeId: match.candidate.placeId, dataId: match.candidate.dataId, language }),
      getCompanyPhotos({ placeId: match.candidate.placeId, dataId: match.candidate.dataId, language }),
    ]);
    const googleTypes = match.candidate.types?.length
      ? match.candidate.types
      : match.candidate.type
        ? [match.candidate.type]
        : [];
    return {
      status: 'found',
      candidate: match.candidate,
      confidence: match.confidence,
      positiveReviews,
      googlePhotos,
      googleTypes,
      rating: match.candidate.rating,
      reviewCount: match.candidate.reviews,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown SerpApi error';
    console.warn('[serpapi/maps] buildCompanyEnrichmentFromSerpApi failed:', message);
    return { status: 'error', message };
  }
}
