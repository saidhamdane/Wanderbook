import {
  GenerateMagazineInput,
  ImageSlot,
  LayoutPartner,
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
import { resolveActivityProfile } from './resolveActivityProfile';

function countImageSlots(template: ReturnType<typeof getTemplateById>): number {
  let n = 0;
  for (const page of template.pages) {
    for (const slot of page.slots) {
      if (slot.type === 'image') n += 1;
    }
  }
  return n;
}

export function insertCompanyPageIfNeeded(doc: MagazineDocument, partner?: LayoutPartner): MagazineDocument {
  const hasAiCompanyContent = Boolean(
    partner?.aiCompanyPageBody ||
    partner?.aiCompanySummary ||
    partner?.aiCompanyPageTitle
  );
  if (!partner?.enabled || !hasAiCompanyContent) return doc;
  if (doc.pages.some((page) => page.layout === 'company-page' || page.pageId === 'company-page-partner')) return doc;

  const companyPage = {
    pageId: 'company-page-partner',
    layout: 'company-page',
    slots: {
      'company-name': partner.businessName || '',
      'partner-main-island': partner.mainIsland || '',
      'partner-activity-type': partner.activityLabel || partner.resolvedActivityType || partner.aiDetectedActivityType || partner.activityType || '',
      'partner-resolved-activity-type': partner.resolvedActivityType || '',
    },
  };
  const insertAt = Math.max(0, doc.pages.length - 1);
  doc.pages.splice(insertAt, 0, companyPage);
  return doc;
}

function copySource(): 'openai' | 'claude' | 'defaults' {
  if (process.env.OPENAI_API_KEY) return 'openai';
  if (process.env.ANTHROPIC_API_KEY) return 'claude';
  return 'defaults';
}

function generationAuditFor(
  input: GenerateMagazineInput,
  generatedAt: string,
  imageSourceSummary: string
): NonNullable<MagazineDocument['generationAudit']> {
  const profile = input.activityProfile || resolveActivityProfile(null, input.language);
  return {
    resolvedActivityType: profile.activityType,
    selectedTemplate: input.templateId,
    language: normalizeLanguage(input.language),
    copySource: copySource(),
    imageSourceSummary,
    partnerId: input.partnerId,
    generatedAt,
  };
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

  const generatedAt = new Date().toISOString();
  return {
    id: 'mag_' + Date.now(),
    templateId: input.templateId,
    destination: input.destination,
    familyName: input.familyName || input.travelers || undefined,
    generatedAt,
    sessionId: input.sessionId,
    pages,
    template,
    generationAudit: generationAuditFor(input, generatedAt, `${analyzed.length} uploaded photos, 0 stock photos`)
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

  const generatedAt = new Date().toISOString();
  return {
    id: 'mag_' + Date.now(),
    templateId: input.templateId,
    destination: input.destination,
    familyName: input.familyName || input.travelers || undefined,
    generatedAt,
    sessionId: input.sessionId,
    pages,
    template,
    generationAudit: generationAuditFor(input, generatedAt, `${analyzed.length} uploaded photos, 0 stock photos`),
  };
}

async function generateLuxuryMagazine(
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
    language: lang,
  });

  const userUrls = analyzed.map((p) => p.url);
  if (userUrls.length === 0) userUrls.push('');

  let photoIdx = 0;
  const nextPhoto = () => {
    const url = userUrls[photoIdx % userUrls.length];
    photoIdx++;
    return url;
  };

  const dest = input.destination;
  const family = input.familyName || input.travelers || '';
  const bodyFallback =
    copy.destBody ||
    copy.story1Body ||
    `A journey through ${dest} — light, landscape, and the quiet moments that make a trip worth keeping.`;

  const pages = template.pages.map((page) => {
    const slots: Record<string, string> = {};
    for (const slot of page.slots) {
      if (slot.type === 'image') {
        slots[slot.id] = nextPhoto();
        continue;
      }
      switch (slot.id) {
        // Cover
        case 'coverTitle':    slots[slot.id] = dest.toUpperCase(); break;
        case 'coverKicker':   slots[slot.id] = copy.coverKicker || year + ' EDITION'; break;
        case 'coverSubtitle': slots[slot.id] = family ? `${family} · ${year}` : copy.coverSubtitle || dest; break;
        // TOC
        case 'pageTitle':     slots[slot.id] = page.id === 'toc' ? 'Contents' : copy.featureTitle || page.name; break;
        case 'item1':         slots[slot.id] = 'A Journey Begins'; break;
        case 'item2':         slots[slot.id] = copy.destTitle || `Discovering ${dest}`; break;
        case 'item3':         slots[slot.id] = 'Captured Moments'; break;
        case 'item4':         slots[slot.id] = 'Memories That Last'; break;
        case 'item5':         slots[slot.id] = 'The Highlights'; break;
        case 'item6':         slots[slot.id] = copy.quote ? 'A Thought to Keep' : 'Until We Return'; break;
        // Destination
        case 'featureTitle':  slots[slot.id] = copy.featureTitle || `A Place That Changed Us`; break;
        // Grid / Memories
        case 'collageTitle':  slots[slot.id] = 'Our Favourite Frames'; break;
        // Quote
        case 'quote':
          slots[slot.id] = copy.quote || copy.quoteText || `Our journey to ${dest} reminded us why we travel.`;
          break;
        case 'caption':
          slots[slot.id] = slot.defaultValue || (family ? `${family} · ${year}` : `${dest.toUpperCase()} · ${year}`);
          break;
        // Body text
        case 'body':          slots[slot.id] = copy.body || copy.welcomeBody || bodyFallback; break;
        default:
          slots[slot.id] = copy[slot.id] !== undefined && copy[slot.id] !== ''
            ? copy[slot.id]
            : slot.defaultValue ?? dest;
      }
    }
    return { pageId: page.id, layout: page.layout, slots };
  });

  const generatedAt = new Date().toISOString();
  return {
    id: 'mag_' + Date.now(),
    templateId: input.templateId,
    destination: dest,
    familyName: family || undefined,
    generatedAt,
    sessionId: input.sessionId,
    pages,
    template,
    generationAudit: generationAuditFor(input, generatedAt, `${analyzed.length} uploaded photos, 0 stock photos`),
  };
}

export async function generateMagazine(
  input: GenerateMagazineInput
): Promise<MagazineDocument> {
  const template = getTemplateById(input.templateId);
  const analyzed = analyzeUploadedPhotos(input.userPhotos);
  const activityProfile = input.activityProfile;

  if (input.templateId === 'hanover') {
    return generateHanoverMagazine(input, template, analyzed);
  }

  if (input.templateId === 'red-bold') {
    return generateRedBoldMagazine(input, template, analyzed);
  }

  if (input.templateId === 'wanderbook-luxury') {
    return generateLuxuryMagazine(input, template, analyzed);
  }

  let stockPhotos: StockPhoto[] = [];
  const totalImageSlots = countImageSlots(template);
  if (input.useStockFallback && analyzed.length < totalImageSlots) {
    const needed = Math.max(totalImageSlots - analyzed.length + 2, 6);
    const stockQuery = activityProfile?.allowedImageKeywords[0] || input.destination;
    stockPhotos = await fetchPexelsPhotos(stockQuery, needed);
  }

  const lang = normalizeLanguage(input.language);
  const copy = await generateEditorialCopy({
    destination: input.destination,
    travelers: input.travelers,
    style: input.style,
    templateId: input.templateId,
    notes: input.notes,
    language: lang,
    activityType: activityProfile?.activityType,
    activityLabel: activityProfile?.activityLabel,
    activityLabelsByLanguage: activityProfile?.activityLabelsByLanguage,
    pagePlan: activityProfile?.pagePlan,
    ctaLabels: activityProfile?.ctaLabels,
    localTipsTopics: activityProfile?.localTipsTopics,
    copyTone: activityProfile?.copyTone,
    prohibitedImageKeywords: activityProfile?.prohibitedImageKeywords,
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

  const generatedAt = new Date().toISOString();
  const doc: MagazineDocument = {
    id: 'mag_' + Date.now(),
    templateId: input.templateId,
    destination: input.destination,
    familyName: input.familyName || input.travelers || undefined,
    generatedAt,
    sessionId: input.sessionId,
    pages,
    template,
    generationAudit: generationAuditFor(
      input,
      generatedAt,
      `${analyzed.length} uploaded photos, ${stockPhotos.length} stock photos${activityProfile ? `, query: ${activityProfile.allowedImageKeywords[0]}` : ''}`
    ),
  };
  return doc;
}
