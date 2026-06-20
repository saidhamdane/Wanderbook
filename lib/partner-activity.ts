import { resolveActivityProfile } from '@/lib/magazine/resolveActivityProfile';

export const ACTIVITY_TYPES = [
  'Surf Camp',
  'Villa Rental',
  'Boat Tour',
  'Photographer',
  'Holiday Rental',
  'Tour Guide',
  'Buggy Adventure',
  'Restaurant',
  'Hotel',
  'General Experience',
] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export function getActivityCta(activityType?: string | null): string {
  return resolveActivityProfile({ activityType: activityType ?? '' }, 'en').ctaLabels.en;
}

export function getActivityTemplateRecommendation(activityType?: string | null): string {
  return resolveActivityProfile({ activityType: activityType ?? '' }).templateId;
}

export function getActivityMagazineTone(activityType?: string | null): string {
  return resolveActivityProfile({ activityType: activityType ?? '' }).copyTone;
}

export function getActivityPartnerHeadline(activityType?: string | null): string {
  return resolveActivityProfile({ activityType: activityType ?? '' }, 'en').ctaLabels.en;
}
