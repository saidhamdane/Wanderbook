import { MagazineTemplate } from '@/lib/magazine/types';

export const redBoldTemplate: MagazineTemplate = {
  id: 'red-bold',
  name: 'Red Bold Retro',
  mood: 'Bold · Retro · Adventurous',
  description:
    'A striking red and white travel magazine with bold retro typography. Dramatic layouts and high-contrast editorial design.',
  source: 'canva',
  previewImage: '/templates/red-white/1.png',
  palette: {
    primary: '#E8340A',
    accent: '#FF4500',
    background: '#FFFFFF',
    text: '#1A1A1A',
    light: '#FFF5F3'
  },
  fonts: {
    heading: "'Bebas Neue', Impact, sans-serif",
    subheading: "'Bebas Neue', Impact, sans-serif",
    body: "'Inter', Arial, sans-serif"
  },
  pages: [
    {
      id: 'cover',
      name: 'Cover',
      layout: 'rb-html-cover',
      slots: [
        { type: 'image', id: 'coverPhoto',    aspect: 'landscape', required: true,  preferredTags: ['hero', 'outdoor', 'adventure', 'travel'] },
        { type: 'text',  id: 'coverKicker',   kind: 'kicker',      maxLength: 30,   required: false, defaultValue: 'Travel Issue' },
        { type: 'text',  id: 'coverTitle',    kind: 'headline',    maxLength: 40,   required: true },
        { type: 'text',  id: 'coverSubtitle', kind: 'subheadline', maxLength: 90,   required: false }
      ]
    },
    {
      id: 'contents',
      name: 'Table of Contents',
      layout: 'rb-html-contents',
      slots: [
        { type: 'image', id: 'sidePhoto', aspect: 'landscape', required: true,  preferredTags: ['scenic', 'travel', 'outdoor'] },
        { type: 'text',  id: 'pageTitle', kind: 'headline',    maxLength: 20,   required: false, defaultValue: 'CONTENTS' },
        { type: 'text',  id: 'item1',     kind: 'kicker',      maxLength: 40,   required: false },
        { type: 'text',  id: 'item2',     kind: 'kicker',      maxLength: 40,   required: false },
        { type: 'text',  id: 'item3',     kind: 'kicker',      maxLength: 40,   required: false },
        { type: 'text',  id: 'item4',     kind: 'kicker',      maxLength: 40,   required: false },
        { type: 'text',  id: 'item5',     kind: 'kicker',      maxLength: 40,   required: false },
        { type: 'text',  id: 'item6',     kind: 'kicker',      maxLength: 40,   required: false }
      ]
    },
    {
      id: 'story',
      name: 'Story',
      layout: 'rb-html-story',
      slots: [
        { type: 'image', id: 'widePhoto', aspect: 'landscape', required: true,  preferredTags: ['destination', 'scenic', 'outdoor'] },
        { type: 'text',  id: 'pageTitle', kind: 'headline',    maxLength: 50,   required: true },
        { type: 'text',  id: 'body',      kind: 'body',        maxLength: 400,  required: false },
        { type: 'text',  id: 'caption',   kind: 'caption',     maxLength: 80,   required: false }
      ]
    },
    {
      id: 'feature',
      name: 'Feature',
      layout: 'rb-html-feature',
      slots: [
        { type: 'image', id: 'featurePhoto', aspect: 'landscape', required: true,  preferredTags: ['destination', 'dramatic', 'outdoor'] },
        { type: 'image', id: 'detailPhoto',  aspect: 'portrait',  required: false, preferredTags: ['local', 'culture', 'detail'] },
        { type: 'text',  id: 'featureTitle', kind: 'headline',    maxLength: 50,   required: true },
        { type: 'text',  id: 'body',         kind: 'body',        maxLength: 400,  required: false }
      ]
    },
    {
      id: 'essay',
      name: 'Photo Essay',
      layout: 'rb-html-essay',
      slots: [
        { type: 'image', id: 'widePhoto',   aspect: 'landscape', required: true,  preferredTags: ['food', 'outdoor', 'scenic'] },
        { type: 'image', id: 'squarePhoto', aspect: 'square',    required: false, preferredTags: ['detail', 'local', 'food'] },
        { type: 'text',  id: 'pageTitle',   kind: 'headline',    maxLength: 50,   required: true },
        { type: 'text',  id: 'body',        kind: 'body',        maxLength: 350,  required: false }
      ]
    },
    {
      id: 'gallery',
      name: 'Photo Gallery',
      layout: 'rb-html-gallery',
      slots: [
        { type: 'image', id: 'gridA',        aspect: 'any',    required: true,  preferredTags: ['group', 'activity', 'family'] },
        { type: 'image', id: 'gridB',        aspect: 'any',    required: false, preferredTags: ['scenic', 'outdoor'] },
        { type: 'image', id: 'gridC',        aspect: 'any',    required: false, preferredTags: ['food', 'detail'] },
        { type: 'image', id: 'gridD',        aspect: 'any',    required: false, preferredTags: ['street', 'local'] },
        { type: 'text',  id: 'collageTitle', kind: 'headline', maxLength: 30,   required: false, defaultValue: 'MEMORIES' },
        { type: 'text',  id: 'caption',      kind: 'caption',  maxLength: 100,  required: false }
      ]
    },
    {
      id: 'quote',
      name: 'Quote Spread',
      layout: 'rb-html-quote',
      slots: [
        { type: 'image', id: 'featurePhoto', aspect: 'landscape', required: true,  preferredTags: ['scenic', 'sunset', 'calm'] },
        { type: 'text',  id: 'quote',        kind: 'quote',       maxLength: 140,  required: true },
        { type: 'text',  id: 'caption',      kind: 'caption',     maxLength: 80,   required: false }
      ]
    },
    {
      id: 'back-cover',
      name: 'Back Cover',
      layout: 'rb-html-back',
      slots: [
        { type: 'image', id: 'coverPhoto', aspect: 'portrait', required: true,  preferredTags: ['scenic', 'outdoor', 'dramatic'] },
        { type: 'text',  id: 'pageTitle',  kind: 'tagline',    maxLength: 60,   required: false },
        { type: 'text',  id: 'body',       kind: 'body',       maxLength: 120,  required: false },
        { type: 'text',  id: 'caption',    kind: 'caption',    maxLength: 30,   required: false, defaultValue: 'WWW.WANDERBOOK.COM' }
      ]
    }
  ]
};
