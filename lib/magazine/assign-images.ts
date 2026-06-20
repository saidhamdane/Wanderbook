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

function scorePhoto(photo: PhotoAnalysis, slot: FlatSlot): number {
  let score = 0;

  if (slot.aspect === 'any' || photo.orientation === slot.aspect) {
    score += 30;
  } else {
    score += 5;
  }

  const slotTags = slot.preferredTags ?? [];
  const matchingTags = slotTags.filter((t) => photo.tags.includes(t));
  score += matchingTags.length * 10;

  if (photo.isHero && slotTags.includes('hero')) score += 20;

  score += photo.qualityScore * 10;

  return score;
}

export function assignImagesToTemplate(
  template: MagazineTemplate,
  userPhotos: PhotoAnalysis[],
  stockPhotos: StockPhoto[],
  prohibitedKeywords: string[] = [],
  travelerSlotPredicate?: (slotId: string) => boolean
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
  const lowerProhibited = prohibitedKeywords.map((keyword) => keyword.toLowerCase());
  const safeStock = stockPhotos.filter((photo) => {
    if (lowerProhibited.length === 0) return true;
    const haystack = `${photo.url} ${photo.photographer}`.toLowerCase();
    return !lowerProhibited.some((keyword) => haystack.includes(keyword));
  });

  for (const slot of slots) {
    let bestPhoto: PhotoAnalysis | null = null;
    let bestScore = -Infinity;
    const canUseTravelerPhoto = travelerSlotPredicate ? travelerSlotPredicate(slot.id) : true;
    if (canUseTravelerPhoto) {
      for (const photo of userPhotos) {
        if (usedUser.has(photo.id)) continue;
        const score = scorePhoto(photo, slot);
        if (score > bestScore) {
          bestScore = score;
          bestPhoto = photo;
        }
      }
    }
    if (bestPhoto) {
      assignments[slot.id] = bestPhoto.url;
      usedUser.add(bestPhoto.id);
      continue;
    }
    const stockMatch = safeStock.find(
      (sp) =>
        !usedStock.has(sp.id) &&
        (slot.aspect === 'any' || sp.orientation === slot.aspect)
    );
    if (stockMatch) {
      assignments[slot.id] = stockMatch.url;
      usedStock.add(stockMatch.id);
      continue;
    }
    const fallback = safeStock.find((sp) => !usedStock.has(sp.id));
    if (fallback) {
      assignments[slot.id] = fallback.url;
      usedStock.add(fallback.id);
      continue;
    }
    assignments[slot.id] = '';
  }

  return assignments;
}
