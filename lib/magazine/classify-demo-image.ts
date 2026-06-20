import OpenAI from 'openai';
import { resolveActivityProfile, type ResolvedActivityType } from './resolveActivityProfile';

export type ClassificationResult = {
  url: string;
  concepts: string[];
  accepted: boolean;
  rejectionReason?: string;
};

const CONCEPT_VOCABULARY = [
  'buggy',
  '4x4',
  'off-road',
  'volcanic',
  'dunes',
  'desert',
  'dirt roads',
  'boat',
  'sailing',
  'catamaran',
  'yacht',
  'dolphin',
  'marina',
  'surf',
  'surfer',
  'surfboard',
  'guide',
  'villa',
  'hotel',
  'hotel room',
  'restaurant',
  'food',
  'portrait',
  'beach',
  'coast',
  'sea',
  'waves',
  'village',
  'viewpoint',
  'hiking',
  'table',
  'landscape',
  'pool',
  'bedroom',
  'camera',
  'family',
  'sunset',
];

const EXTRA_PROHIBITED: Partial<Record<ResolvedActivityType, string[]>> = {
  'buggy-adventure': [
    'boat',
    'sailing',
    'catamaran',
    'yacht',
    'dolphin',
    'marina',
    'surf',
    'surfer',
    'surfboard',
    'restaurant',
    'hotel room',
    'villa',
  ],
  'boat-tour': ['buggy', 'quad', '4x4', 'off-road', 'dunes', 'dirt roads'],
  'surf-camp': ['catamaran', 'boat', 'sailing', 'yacht', 'buggy', 'quad', '4x4', 'off-road'],
  'tour-guide': ['boat', 'sailing', 'catamaran', 'yacht', 'buggy', 'quad'],
  other: ['boat', 'sailing', 'catamaran', 'yacht', 'dolphin', 'marina', 'buggy', 'quad'],
};

const REQUIRED_ALLOWED: Partial<Record<ResolvedActivityType, string[]>> = {
  'buggy-adventure': ['buggy', '4x4', 'off-road', 'volcanic', 'dunes', 'desert', 'dirt roads', 'landscape'],
  'boat-tour': ['sea', 'boat', 'coast', 'sailing', 'marina', 'yacht'],
  'surf-camp': ['surf', 'surfer', 'surfboard', 'waves', 'beach'],
  'tour-guide': ['guide', 'village', 'viewpoint', 'hiking', 'landscape'],
  'villa-rental': ['villa', 'pool', 'bedroom', 'hotel room'],
  photographer: ['camera', 'portrait', 'family', 'sunset'],
  restaurant: ['food', 'table', 'restaurant'],
  hotel: ['hotel', 'hotel room', 'pool', 'food'],
  other: ['landscape', 'beach', 'coast'],
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function prohibitedConcepts(activityType: ResolvedActivityType): string[] {
  const profile = resolveActivityProfile({ activityType }, 'en');
  return [...profile.prohibitedImageKeywords, ...(EXTRA_PROHIBITED[activityType] ?? [])];
}

export function conceptsMatchActivity(concepts: string[], activityType: ResolvedActivityType): boolean {
  const normalizedConcepts = concepts.map(normalize).filter(Boolean);
  const prohibited = prohibitedConcepts(activityType).map(normalize).filter(Boolean);
  const hasProhibited = normalizedConcepts.some((concept) =>
    prohibited.some((keyword) => concept === keyword || concept.includes(keyword) || keyword.includes(concept))
  );
  if (hasProhibited) return false;

  const requiredAllowed = (REQUIRED_ALLOWED[activityType] ?? []).map(normalize);
  if (requiredAllowed.length === 0) return true;
  return normalizedConcepts.some((concept) =>
    requiredAllowed.some((keyword) => concept === keyword || concept.includes(keyword) || keyword.includes(concept))
  );
}

function parseConcepts(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw) as { concepts?: unknown };
    if (Array.isArray(parsed.concepts)) {
      return parsed.concepts
        .map((item) => normalize(String(item)))
        .filter((item) => CONCEPT_VOCABULARY.includes(item));
    }
  } catch {
    // Fall through to simple parsing.
  }

  const normalized = normalize(raw);
  return CONCEPT_VOCABULARY.filter((concept) => normalized.includes(concept));
}

function imageUrlForVision(url: string): string | null {
  if (/^https?:\/\//i.test(url)) return url;
  const origin = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');
  if (!origin || !url.startsWith('/')) return null;
  return `${origin}${url}`;
}

export async function classifyDemoImage(
  url: string,
  activityType: ResolvedActivityType
): Promise<ClassificationResult> {
  if (!process.env.OPENAI_API_KEY) {
    return {
      url,
      concepts: [],
      accepted: false,
      rejectionReason: 'classification-unavailable',
    };
  }
  const visionUrl = imageUrlForVision(url);
  if (!visionUrl) {
    return {
      url,
      concepts: [],
      accepted: false,
      rejectionReason: 'classification-unavailable',
    };
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'Classify the image using only this vocabulary: ' +
            CONCEPT_VOCABULARY.join(', ') +
            '. Return JSON only: {"concepts":["..."]}.',
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'List the visible concepts in this demo image. Use only the provided vocabulary.',
            },
            {
              type: 'image_url',
              image_url: { url: visionUrl },
            },
          ],
        },
      ],
      temperature: 0,
      max_tokens: 120,
    });
    const concepts = parseConcepts(response.choices[0]?.message?.content || '');
    if (concepts.length === 0) {
      return {
        url,
        concepts,
        accepted: false,
        rejectionReason: 'classification-unclear',
      };
    }
    if (!conceptsMatchActivity(concepts, activityType)) {
      return {
        url,
        concepts,
        accepted: false,
        rejectionReason: `prohibited concepts for ${activityType}: ${concepts.join(', ')}`,
      };
    }
    return { url, concepts, accepted: true };
  } catch {
    return {
      url,
      concepts: [],
      accepted: false,
      rejectionReason: 'classification-unavailable',
    };
  }
}
