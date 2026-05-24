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
  analyzed: PhotoAnalysis[],
): MagazineDocument {
  const year = String(new Date().getFullYear());
  const photos = analyzed.map((p) => p.url);
  const getPhoto = (idx: number) =>
    photos.length > 0 ? photos[idx % photos.length] : '';

  // Photo slot assignments for all 16 injected pages
  const photoMap: Record<number, Record<string, string>> = {
    1:  { photo1: getPhoto(0) },
    2:  { photo1: getPhoto(1) },
    4:  { photo1: getPhoto(2) },
    5:  { photo1: getPhoto(3) },
    6:  { photo1: getPhoto(4), photo2: getPhoto(5) },
    7:  { photo1: getPhoto(6) },
    8:  { photo1: getPhoto(7) },
    9:  { photo1: getPhoto(8) },
    10: { photo1: getPhoto(9) },
    11: { photo1: getPhoto(10) },
    12: { photo1: getPhoto(11), photo2: getPhoto(12), photo3: getPhoto(13), photo4: getPhoto(14) },
    13: { photo1: getPhoto(15) },
    14: { photo1: getPhoto(16) },
    17: { photo1: getPhoto(17) },
    18: { photo1: getPhoto(18), photo2: getPhoto(19), photo3: getPhoto(20), photo4: getPhoto(21) },
    19: { photo1: getPhoto(22) },
  };

  const pages = template.pages.map((page, i) => {
    const pageNum = i + 1;
    return {
      pageId: page.id,
      layout: page.layout,
      slots: {
        destination: input.destination,
        familyName: input.familyName || input.travelers || '',
        year,
        ...(photoMap[pageNum] ?? {}),
      } as Record<string, string>,
    };
  });

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
    return generateHanoverMagazine(input, template, analyzed);
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
