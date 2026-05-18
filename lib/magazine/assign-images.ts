import { ImageSlot, MagazineTemplate, PhotoAnalysis, StockPhoto } from './types';

type FlatSlot = ImageSlot & { pageId: string };

function flattenImageSlots(template: MagazineTemplate): FlatSlot[] {
  const flat: FlatSlot[] = [];
  for (const page of template.pages) {
    for (const slot of page.slots) {
      if (slot.type === 'image') {
        flat.push({ ...slot, pageId: page.id });
      }
    }
  }
  return flat;
}

function scorePhoto(slot: FlatSlot, photo: PhotoAnalysis): number {
  let score = 0;
  if (slot.aspect === photo.orientation) score += 30;
  else if (slot.aspect === 'any') score += 20;
  else score += 0;

  const tags = slot.preferredTags ?? [];
  for (const t of tags) {
    if (photo.tags.includes(t)) score += 10;
  }
  if (tags.includes('hero') && photo.isHero) score += 20;
  return score;
}

export function assignImagesToTemplate(
  template: MagazineTemplate,
  userPhotos: PhotoAnalysis[],
  stockPhotos: StockPhoto[]
): Record<string, string> {
  const slots = flattenImageSlots(template);
  slots.sort((a, b) => {
    if (a.required !== b.required) return a.required ? -1 : 1;
    const aTags = (a.preferredTags ?? []).length;
    const bTags = (b.preferredTags ?? []).length;
    return bTags - aTags;
  });

  const usedUser = new Set<string>();
  const usedStock = new Set<string>();
  const assignments: Record<string, string> = {};

  for (const slot of slots) {
    let bestPhoto: PhotoAnalysis | null = null;
    let bestScore = -Infinity;
    for (const photo of userPhotos) {
      if (usedUser.has(photo.id)) continue;
      const score = scorePhoto(slot, photo);
      if (score > bestScore) {
        bestScore = score;
        bestPhoto = photo;
      }
    }
    if (bestPhoto) {
      assignments[slot.id] = bestPhoto.url;
      usedUser.add(bestPhoto.id);
      continue;
    }
    const stockMatch = stockPhotos.find(
      (sp) =>
        !usedStock.has(sp.id) &&
        (slot.aspect === 'any' || sp.orientation === slot.aspect)
    );
    if (stockMatch) {
      assignments[slot.id] = stockMatch.url;
      usedStock.add(stockMatch.id);
      continue;
    }
    const fallback = stockPhotos.find((sp) => !usedStock.has(sp.id));
    if (fallback) {
      assignments[slot.id] = fallback.url;
      usedStock.add(fallback.id);
      continue;
    }
    assignments[slot.id] = '';
  }

  return assignments;
}
