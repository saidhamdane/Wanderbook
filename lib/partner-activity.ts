export const ACTIVITY_TYPES = [
  'Boat Tour',
  'Photographer',
  'Holiday Rental',
  'Tour Guide',
  'Honeymoon',
  'Buggy Adventure',
  'General Experience',
] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number];

const ACTIVITY_CTA: Record<string, string> = {
  'Boat Tour': 'Book your next boat experience',
  'Photographer': 'Book your next photo session',
  'Holiday Rental': 'Book your next stay',
  'Tour Guide': 'Book your next guided experience',
  'Honeymoon': 'Plan your next romantic escape',
  'Buggy Adventure': 'Book your next adventure',
  'General Experience': 'Book your next experience',
};

const ACTIVITY_TEMPLATE: Record<string, string> = {
  'Boat Tour': 'boat-trip-experience',
  'Photographer': 'photographer-experience',
  'Holiday Rental': 'holiday-rental-memory',
  'Tour Guide': 'tour-guide-experience',
  'Honeymoon': 'aurora-editorial',
  'Buggy Adventure': 'buggy-adventure-experience',
  'General Experience': 'wanderbook-editorial',
};

const ACTIVITY_TONE: Record<string, string> = {
  'Boat Tour': 'adventurous and ocean-inspired',
  'Photographer': 'artistic and creative',
  'Holiday Rental': 'warm and home-away-from-home',
  'Tour Guide': 'curious and discovery-focused',
  'Honeymoon': 'romantic and intimate',
  'Buggy Adventure': 'thrilling and action-packed',
  'General Experience': 'warm and personal',
};

const ACTIVITY_HEADLINE: Record<string, string> = {
  'Boat Tour': 'Set sail on an unforgettable ocean adventure',
  'Photographer': 'Capture memories that last a lifetime',
  'Holiday Rental': 'Your home away from home in paradise',
  'Tour Guide': 'Discover the island like never before',
  'Honeymoon': 'Begin your forever in paradise',
  'Buggy Adventure': 'Adventure awaits around every corner',
  'General Experience': 'Create memories that last forever',
};

export function getActivityCta(activityType?: string | null): string {
  return ACTIVITY_CTA[activityType ?? ''] ?? 'Book your next experience';
}

export function getActivityTemplateRecommendation(activityType?: string | null): string {
  return ACTIVITY_TEMPLATE[activityType ?? ''] ?? 'wanderbook-editorial';
}

export function getActivityMagazineTone(activityType?: string | null): string {
  return ACTIVITY_TONE[activityType ?? ''] ?? 'warm and personal';
}

export function getActivityPartnerHeadline(activityType?: string | null): string {
  return ACTIVITY_HEADLINE[activityType ?? ''] ?? 'Create memories that last forever';
}
