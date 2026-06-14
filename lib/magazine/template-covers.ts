import type { MagazineTemplate } from './types';

export const DEFAULT_TEMPLATE_COVER_IMAGE = '/template-covers/default-cover.jpg';

export const TEMPLATE_COVER_IMAGES: Record<string, string> = {
  'tour-guide-experience': '/template-covers/tour-guide.jpg',
  'boat-trip-experience': '/template-covers/boat-trip.jpg',
  'buggy-adventure-experience': '/template-covers/buggy-adventure.jpg',
  'holiday-rental-memory': '/template-covers/holiday-rental.jpg',
  'aurora-editorial': '/template-covers/aurora-editorial.jpg',
  'atlas-nocturne-editorial': '/template-covers/atlas-nocturne.jpg',
};

type CoverTemplate = Pick<MagazineTemplate, 'id'> &
  Partial<Pick<MagazineTemplate, 'coverImage' | 'fallbackCoverImage' | 'previewImage'>>;

export function getTemplateCoverImage(template: CoverTemplate): string {
  return template.coverImage || TEMPLATE_COVER_IMAGES[template.id] || template.previewImage || DEFAULT_TEMPLATE_COVER_IMAGE;
}

export function getTemplateFallbackCoverImage(template: CoverTemplate): string {
  return template.fallbackCoverImage || DEFAULT_TEMPLATE_COVER_IMAGE;
}
