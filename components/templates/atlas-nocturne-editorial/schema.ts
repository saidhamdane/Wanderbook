import { MagazineTemplate } from '@/lib/magazine/types';
import { DEFAULT_TEMPLATE_COVER_IMAGE, TEMPLATE_COVER_IMAGES } from '@/lib/magazine/template-covers';

export const atlasNocturneEditorialTemplate: MagazineTemplate = {
  id: 'atlas-nocturne-editorial',
  name: 'Atlas Nocturne',
  mood: 'Dark · Luxury · Editorial',
  description:
    'A premium 8-page A4 luxury travel magazine. Dramatic dark covers, champagne accents, Playfair Display headlines, and a rich paper/ivory palette.',
  source: 'css',
  previewImage: TEMPLATE_COVER_IMAGES['atlas-nocturne-editorial'],
  coverImage: TEMPLATE_COVER_IMAGES['atlas-nocturne-editorial'],
  fallbackCoverImage: DEFAULT_TEMPLATE_COVER_IMAGE,
  palette: {
    primary: '#121212',
    accent: '#c9a25d',
    background: '#f7f1e5',
    text: '#121212',
    light: '#fffaf0',
  },
  fonts: {
    heading: "'Playfair Display', Georgia, serif",
    subheading: "'Archivo', system-ui, sans-serif",
    body: "'Archivo', system-ui, sans-serif",
  },
  pages: [
    {
      id: 'ane-cover',
      name: 'Cover',
      layout: 'ane-cover',
      slots: [
        { type: 'image', id: 'cover-photo',    aspect: 'portrait',  required: true,  preferredTags: ['hero', 'landscape', 'travel', 'dramatic'] },
        { type: 'text',  id: 'cover-kicker',   kind: 'kicker',      maxLength: 50,   required: false },
        { type: 'text',  id: 'cover-title',    kind: 'headline',    maxLength: 40,   required: true },
        { type: 'text',  id: 'cover-subtitle', kind: 'subheadline', maxLength: 120,  required: false },
        { type: 'text',  id: 'cover-date',     kind: 'kicker',      maxLength: 40,   required: false },
        { type: 'text',  id: 'cover-line',     kind: 'tagline',     maxLength: 80,   required: false },
      ],
    },
    {
      id: 'ane-contents',
      name: 'Contents',
      layout: 'ane-contents',
      slots: [
        { type: 'image', id: 'contents-photo', aspect: 'any',       required: true,  preferredTags: ['scenic', 'travel', 'landscape'] },
        { type: 'text',  id: 'toc-item-1',     kind: 'kicker',      maxLength: 50,   required: false },
        { type: 'text',  id: 'toc-item-2',     kind: 'kicker',      maxLength: 50,   required: false },
        { type: 'text',  id: 'toc-item-3',     kind: 'kicker',      maxLength: 50,   required: false },
        { type: 'text',  id: 'toc-item-4',     kind: 'kicker',      maxLength: 50,   required: false },
        { type: 'text',  id: 'toc-item-5',     kind: 'kicker',      maxLength: 50,   required: false },
        { type: 'text',  id: 'toc-item-6',     kind: 'kicker',      maxLength: 50,   required: false },
      ],
    },
    {
      id: 'ane-letter',
      name: 'Editor Letter',
      layout: 'ane-letter',
      slots: [
        { type: 'image', id: 'letter-photo',     aspect: 'portrait',  required: true,  preferredTags: ['travel', 'scenic', 'outdoor'] },
        { type: 'text',  id: 'letter-title',     kind: 'headline',    maxLength: 80,   required: true },
        { type: 'text',  id: 'letter-body',      kind: 'body',        maxLength: 500,  required: false },
        { type: 'text',  id: 'letter-signature', kind: 'kicker',      maxLength: 40,   required: false },
      ],
    },
    {
      id: 'ane-hero',
      name: 'Hero Story',
      layout: 'ane-hero',
      slots: [
        { type: 'image', id: 'hero-photo',    aspect: 'landscape',  required: true,  preferredTags: ['hero', 'landscape', 'dramatic'] },
        { type: 'text',  id: 'hero-title',    kind: 'headline',     maxLength: 60,   required: true },
        { type: 'text',  id: 'hero-subtitle', kind: 'subheadline',  maxLength: 100,  required: false },
        { type: 'text',  id: 'hero-body',     kind: 'body',         maxLength: 400,  required: false },
      ],
    },
    {
      id: 'ane-route',
      name: 'Route Notes',
      layout: 'ane-route',
      slots: [
        { type: 'image', id: 'route-photo-1', aspect: 'portrait',  required: true,  preferredTags: ['landscape', 'scenic', 'outdoor'] },
        { type: 'image', id: 'route-photo-2', aspect: 'any',       required: false, preferredTags: ['activity', 'local'] },
        { type: 'image', id: 'route-photo-3', aspect: 'portrait',  required: false, preferredTags: ['travel', 'detail'] },
        { type: 'text',  id: 'route-title',   kind: 'headline',    maxLength: 60,   required: true },
        { type: 'text',  id: 'route-body',    kind: 'body',        maxLength: 300,  required: false },
      ],
    },
    {
      id: 'ane-gallery',
      name: 'Gallery',
      layout: 'ane-gallery',
      slots: [
        { type: 'image', id: 'gallery-photo-1', aspect: 'any',   required: true,  preferredTags: ['scenic', 'travel', 'landscape'] },
        { type: 'image', id: 'gallery-photo-2', aspect: 'any',   required: false, preferredTags: ['outdoor', 'activity'] },
        { type: 'image', id: 'gallery-photo-3', aspect: 'any',   required: false, preferredTags: ['local', 'food', 'detail'] },
        { type: 'image', id: 'gallery-photo-4', aspect: 'any',   required: false, preferredTags: ['street', 'people'] },
        { type: 'image', id: 'gallery-photo-5', aspect: 'any',   required: false, preferredTags: ['architecture', 'nature'] },
        { type: 'image', id: 'gallery-photo-6', aspect: 'any',   required: false, preferredTags: ['landscape', 'scenic'] },
        { type: 'text',  id: 'gallery-caption-1', kind: 'caption', maxLength: 40, required: false },
        { type: 'text',  id: 'gallery-caption-2', kind: 'caption', maxLength: 40, required: false },
        { type: 'text',  id: 'gallery-caption-3', kind: 'caption', maxLength: 40, required: false },
        { type: 'text',  id: 'gallery-caption-4', kind: 'caption', maxLength: 40, required: false },
        { type: 'text',  id: 'gallery-caption-5', kind: 'caption', maxLength: 40, required: false },
        { type: 'text',  id: 'gallery-caption-6', kind: 'caption', maxLength: 40, required: false },
      ],
    },
    {
      id: 'ane-quote',
      name: 'Quote',
      layout: 'ane-quote',
      slots: [
        { type: 'image', id: 'quote-photo', aspect: 'portrait',  required: true,  preferredTags: ['scenic', 'dramatic', 'outdoor'] },
        { type: 'text',  id: 'quote-text',  kind: 'quote',       maxLength: 200,  required: true },
        { type: 'text',  id: 'quote-attr',  kind: 'caption',     maxLength: 60,   required: false },
      ],
    },
    {
      id: 'ane-back',
      name: 'Back Cover',
      layout: 'ane-back',
      slots: [
        { type: 'image', id: 'back-photo',   aspect: 'portrait',  required: true,  preferredTags: ['dramatic', 'landscape', 'scenic'] },
        { type: 'text',  id: 'back-title',   kind: 'headline',    maxLength: 60,   required: false },
        { type: 'text',  id: 'back-line',    kind: 'tagline',     maxLength: 100,  required: false },
        { type: 'text',  id: 'back-contact', kind: 'caption',     maxLength: 120,  required: false },
      ],
    },
  ],
};
