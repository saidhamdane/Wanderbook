import {
  GenerateMagazineInput,
  ImageSlot,
  MagazineDocument,
  StockPhoto
} from './types';
import { getTemplateById } from './template-registry';
import { analyzeUploadedPhotos } from './analyze-photos';
import { assignImagesToTemplate } from './assign-images';
import { generateEditorialCopy, normalizeLanguage } from './generate-copy';
import { fetchPexelsPhotos } from './pexels';

function countImageSlots(template: ReturnType<typeof getTemplateById>): number {
  let n = 0;
  for (const page of template.pages) {
    for (const slot of page.slots) {
      if (slot.type === 'image') n += 1;
    }
  }
  return n;
}

export async function generateMagazine(
  input: GenerateMagazineInput
): Promise<MagazineDocument> {
  const template = getTemplateById(input.templateId);

  const analyzed = analyzeUploadedPhotos(input.userPhotos);

  let stockPhotos: StockPhoto[] = [];
  const totalImageSlots = countImageSlots(template);
  if (input.useStockFallback && analyzed.length < totalImageSlots) {
    const needed = Math.max(totalImageSlots - analyzed.length + 2, 6);
    stockPhotos = await fetchPexelsPhotos(input.destination, needed);
  }

  const copy = await generateEditorialCopy({
    destination: input.destination,
    travelers: input.travelers,
    style: input.style,
    templateId: input.templateId,
    notes: input.notes,
    language: normalizeLanguage(input.language)
  });

  const imageAssignments = assignImagesToTemplate(template, analyzed, stockPhotos);

  const pages = template.pages.map((page) => {
    const slots: Record<string, string> = {};
    for (const slot of page.slots) {
      if (slot.type === 'text') {
        slots[slot.id] =
          copy[slot.id] !== undefined && copy[slot.id] !== ''
            ? copy[slot.id]
            : slot.defaultValue ?? '';
      } else {
        const img = slot as ImageSlot;
        slots[img.id] = imageAssignments[img.id] ?? '';
      }
    }
    return { pageId: page.id, layout: page.layout, slots };
  });

  return {
    id: 'mag_' + Date.now(),
    templateId: input.templateId,
    destination: input.destination,
    generatedAt: new Date().toISOString(),
    sessionId: input.sessionId,
    pages,
    template
  };
}
