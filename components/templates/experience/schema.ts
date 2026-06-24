import { MagazineTemplate, PageSlot } from '@/lib/magazine/types';
import { DEFAULT_TEMPLATE_COVER_IMAGE, TEMPLATE_COVER_IMAGES } from '@/lib/magazine/template-covers';
import { auroraEditorialTemplate } from '../aurora-editorial/schema';

type ExperienceConfig = {
  id: string;
  name: string;
  mood: string;
  description: string;
  bestFor: string;
  previewImage: string;
  coverImage: string;
  palette: MagazineTemplate['palette'];
  tags: {
    hero: string[];
    secondary: string[];
    gallery: string[];
  };
};

function retagSlot(slot: PageSlot, tags: ExperienceConfig['tags']): PageSlot {
  if (slot.type !== 'image') return { ...slot };
  const heroSlots = new Set(['cover-photo', 'feature-photo', 'story-photo-1']);
  const secondarySlots = new Set(['toc-photo', 'intro-photo', 'back-photo']);
  const preferredTags = heroSlots.has(slot.id)
    ? tags.hero
    : secondarySlots.has(slot.id)
      ? tags.secondary
      : tags.gallery;
  return { ...slot, preferredTags };
}

function experienceTemplate(config: ExperienceConfig): MagazineTemplate {
  return {
    ...auroraEditorialTemplate,
    id: config.id,
    name: config.name,
    mood: config.mood,
    description: config.description,
    bestFor: config.bestFor,
    previewImage: config.previewImage,
    coverImage: config.coverImage,
    fallbackCoverImage: DEFAULT_TEMPLATE_COVER_IMAGE,
    palette: config.palette,
    pages: auroraEditorialTemplate.pages.map((page) => ({
      ...page,
      id: page.id.replace('are-', config.id.split('-')[0] + '-'),
      slots: page.slots.map((slot) => retagSlot(slot, config.tags)),
    })),
  };
}

export const photographerExperienceTemplate = experienceTemplate({
  id: 'photographer-experience',
  name: 'Photographer Experience',
  mood: 'Portraits · Emotion · Family',
  description: 'Portraits, emotions and family memories.',
  bestFor: 'Photographers, couples, families and beach photoshoots',
  previewImage: TEMPLATE_COVER_IMAGES['aurora-editorial'],
  coverImage: TEMPLATE_COVER_IMAGES['aurora-editorial'],
  palette: {
    primary: '#221a1d',
    accent: '#b45f6c',
    background: '#fff7f1',
    text: '#221a1d',
    light: '#fffdf9',
  },
  tags: {
    hero: ['people', 'portrait', 'family', 'group', 'couple', 'hero'],
    secondary: ['people', 'family', 'beach', 'golden-hour', 'outdoor'],
    gallery: ['people', 'family', 'portrait', 'detail', 'beach'],
  },
});

export const tourGuideExperienceTemplate = experienceTemplate({
  id: 'tour-guide-experience',
  name: 'Tour Guide Experience',
  mood: 'Routes · Viewpoints · Local',
  description: 'Routes, viewpoints and local island stories.',
  bestFor: 'Private guides, island tours and local day trips',
  previewImage: TEMPLATE_COVER_IMAGES['tour-guide-experience'],
  coverImage: TEMPLATE_COVER_IMAGES['tour-guide-experience'],
  palette: {
    primary: '#15231f',
    accent: '#d18f38',
    background: '#f5f1e8',
    text: '#15231f',
    light: '#fffaf1',
  },
  tags: {
    hero: ['people', 'group', 'viewpoint', 'route', 'hero', 'scenic'],
    secondary: ['road', 'village', 'local', 'culture', 'landscape'],
    gallery: ['viewpoint', 'road', 'local', 'culture', 'street'],
  },
});

export const boatTripExperienceTemplate = experienceTemplate({
  id: 'boat-trip-experience',
  name: 'Boat Trip Experience',
  mood: 'Ocean · Coast · Sunset',
  description: 'Ocean days, Atlantic light and shared memories.',
  bestFor: 'Sailing trips, catamarans, private boats and coastal tours',
  previewImage: TEMPLATE_COVER_IMAGES['boat-trip-experience'],
  coverImage: TEMPLATE_COVER_IMAGES['boat-trip-experience'],
  palette: {
    primary: '#082f49',
    accent: '#38bdf8',
    background: '#eef8fb',
    text: '#082f49',
    light: '#f8feff',
  },
  tags: {
    hero: ['people', 'group', 'boat', 'ocean', 'sea', 'hero'],
    secondary: ['coast', 'sunset', 'sailing', 'beach', 'Atlantic'],
    gallery: ['boat', 'ocean', 'family', 'group', 'sunset'],
  },
});

export const buggyAdventureExperienceTemplate = experienceTemplate({
  id: 'buggy-adventure-experience',
  name: 'Buggy Adventure Experience',
  mood: 'Action · Roads · Dunes',
  description: 'Action, dunes, roads and adventure moments.',
  bestFor: 'Buggy tours, quad tours and off-road excursions',
  previewImage: TEMPLATE_COVER_IMAGES['buggy-adventure-experience'],
  coverImage: TEMPLATE_COVER_IMAGES['buggy-adventure-experience'],
  palette: {
    primary: '#24170f',
    accent: '#d97706',
    background: '#f6efe2',
    text: '#24170f',
    light: '#fff9ee',
  },
  tags: {
    hero: ['people', 'group', 'buggy', 'adventure', 'road', 'hero'],
    secondary: ['dunes', 'dust', 'road', 'landscape', 'outdoor'],
    gallery: ['action', 'buggy', 'off-road', 'dust', 'dunes'],
  },
});

export const holidayRentalMemoryTemplate = experienceTemplate({
  id: 'holiday-rental-memory',
  name: 'Holiday Rental Guest Memory',
  mood: 'Stay · Local Tips · Family',
  description: 'Guest memories, local tips and stay highlights.',
  bestFor: 'Airbnb stays, villas, apartments, hotels and guest books',
  previewImage: TEMPLATE_COVER_IMAGES['holiday-rental-memory'],
  coverImage: TEMPLATE_COVER_IMAGES['holiday-rental-memory'],
  palette: {
    primary: '#17302b',
    accent: '#e0a75e',
    background: '#f7f3eb',
    text: '#17302b',
    light: '#fffdfa',
  },
  tags: {
    hero: ['people', 'family', 'stay', 'home', 'hero'],
    secondary: ['beach', 'local', 'apartment', 'villa', 'hotel'],
    gallery: ['family', 'beach', 'food', 'local', 'detail'],
  },
});
