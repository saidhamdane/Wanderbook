import {
  GenerateMagazineInput,
  ImageSlot,
  MagazineDocument,
  MagazineTemplate,
  PhotoAnalysis,
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

async function generateRedBoldMagazine(
  input: GenerateMagazineInput,
  template: MagazineTemplate,
  analyzed: PhotoAnalysis[]
): Promise<MagazineDocument> {
  const year = String(new Date().getFullYear());
  const lang = normalizeLanguage(input.language);

  const copy = await generateEditorialCopy({
    destination: input.destination,
    travelers: input.travelers,
    style: input.style,
    templateId: input.templateId,
    notes: input.notes,
    language: lang
  });

  const pageNames = template.pages.map((p) => p.name);
  const userUrls = analyzed.map((p) => p.url);
  if (userUrls.length === 0) userUrls.push('');

  let photoIdx = 0;
  const nextPhoto = () => {
    const url = userUrls[photoIdx % userUrls.length];
    photoIdx++;
    return url;
  };

  const bodyFallback =
    copy.destBody ||
    copy.story1Body ||
    `A journey through ${input.destination} — light, landscape, and the quiet moments that make a trip worth keeping.`;

  const pages = template.pages.map((page) => {
    const slots: Record<string, string> = {};
    for (const slot of page.slots) {
      if (slot.type === 'image') {
        slots[slot.id] = nextPhoto();
      } else {
        switch (slot.id) {
          case 'coverTitle':
            slots[slot.id] = input.destination.toUpperCase();
            break;
          case 'coverKicker':
            slots[slot.id] = copy.coverKicker || year + ' EDITION';
            break;
          case 'coverSubtitle':
            slots[slot.id] =
              input.tagline ||
              (input.familyName ? input.familyName + ' Family' : '') ||
              copy.coverSubtitle ||
              `A journey through ${input.destination} by ${input.travelers}`;
            break;
          case 'pageTitle':
            slots[slot.id] = page.name.toUpperCase();
            break;
          case 'featureTitle':
            slots[slot.id] = copy.coverFeatureTitle || copy.featureTitle || 'HIGHLIGHTS';
            break;
          case 'collageTitle':
            slots[slot.id] = 'MEMORIES';
            break;
          case 'body':
            slots[slot.id] = copy.body || copy.welcomeBody || bodyFallback;
            break;
          case 'quote':
            slots[slot.id] =
              copy.quote ||
              copy.quoteText ||
              copy.quoteBody ||
              `Our journey to ${input.destination} reminded us why we travel.`;
            break;
          case 'caption':
            slots[slot.id] =
              slot.defaultValue ||
              `${input.destination.toUpperCase()} · ${year}`;
            break;
          case 'item1':
          case 'item2':
          case 'item3':
          case 'item4':
          case 'item5':
          case 'item6': {
            const n = parseInt(slot.id.slice(-1), 10) - 1;
            slots[slot.id] = pageNames[n] ?? '';
            break;
          }
          default:
            slots[slot.id] =
              copy[slot.id] !== undefined && copy[slot.id] !== ''
                ? copy[slot.id]
                : slot.defaultValue ?? input.destination;
        }
      }
    }
    return { pageId: page.id, layout: page.layout, slots };
  });

  return {
    id: 'mag_' + Date.now(),
    templateId: input.templateId,
    destination: input.destination,
    familyName: input.familyName || input.travelers || undefined,
    generatedAt: new Date().toISOString(),
    sessionId: input.sessionId,
    pages,
    template
  };
}

function generateHanoverMagazine(
  input: GenerateMagazineInput,
  template: MagazineTemplate,
): MagazineDocument {
  // Static template — pages are pre-designed PNGs served directly from disk.
  // No copy generation, no photo injection (Phase 2 concern).
  const pages = template.pages.map((page) => ({
    pageId: page.id,
    layout: page.layout,
    slots: {} as Record<string, string>,
  }));

  return {
    id: 'mag_' + Date.now(),
    templateId: input.templateId,
    destination: input.destination,
    familyName: input.familyName || input.travelers || undefined,
    generatedAt: new Date().toISOString(),
    sessionId: input.sessionId,
    pages,
    template,
  };
}

export async function generateMagazine(
  input: GenerateMagazineInput
): Promise<MagazineDocument> {
  const template = getTemplateById(input.templateId);
  const analyzed = analyzeUploadedPhotos(input.userPhotos);

  if (input.templateId === 'hanover') {
    return generateHanoverMagazine(input, template);
  }

  if (input.templateId === 'red-bold') {
    return generateRedBoldMagazine(input, template, analyzed);
  }

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
    familyName: input.familyName || input.travelers || undefined,
    generatedAt: new Date().toISOString(),
    sessionId: input.sessionId,
    pages,
    template
  };
}
