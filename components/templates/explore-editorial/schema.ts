import { MagazineTemplate } from '@/lib/magazine/types';

export const exploreEditorialTemplate: MagazineTemplate = {
  id: 'explore-editorial',
  name: 'Explore Editorial',
  mood: 'Cinematic · Refined · Storytelling',
  description:
    'A cinematic editorial magazine with generous white space and elegant serif typography.',
  palette: {
    primary: '#2C2C2C',
    accent: '#D4A853',
    background: '#FFFFFF',
    text: '#333333',
    light: '#F9F7F4'
  },
  fonts: {
    heading: "'Cormorant Garamond', serif",
    subheading: "'Cormorant Garamond', serif",
    body: "'Libre Baskerville', serif"
  },
  pages: [
    {
      id: 'cover',
      name: 'Cover',
      layout: 'ex-cover',
      slots: [
        { type: 'image', id: 'coverImage', aspect: 'portrait', required: true, preferredTags: ['hero', 'dramatic', 'desert', 'mountain'] },
        { type: 'text', id: 'coverMagazineName', kind: 'headline', maxLength: 12, required: true, defaultValue: 'explore' },
        { type: 'text', id: 'coverSubtitle', kind: 'kicker', maxLength: 20, required: false, defaultValue: 'Magazine' },
        { type: 'text', id: 'coverVolume', kind: 'kicker', maxLength: 30, required: false },
        { type: 'text', id: 'coverHighlight1', kind: 'kicker', maxLength: 50, required: false },
        { type: 'text', id: 'coverHighlight2', kind: 'kicker', maxLength: 50, required: false },
        { type: 'text', id: 'coverHighlight3', kind: 'kicker', maxLength: 50, required: false },
        { type: 'text', id: 'coverMainTitle', kind: 'subheadline', maxLength: 50, required: false },
        { type: 'text', id: 'coverStatNumber', kind: 'subheadline', maxLength: 6, required: false },
        { type: 'text', id: 'coverStatLabel', kind: 'kicker', maxLength: 30, required: false }
      ]
    },
    {
      id: 'opener',
      name: 'Opener',
      layout: 'ex-opener',
      slots: [
        { type: 'text', id: 'openerHeadline', kind: 'headline', maxLength: 60, required: false, defaultValue: 'START YOUR TRAVELING TODAY' },
        { type: 'image', id: 'openerImage1', aspect: 'portrait', required: true, preferredTags: ['scenic'] },
        { type: 'image', id: 'openerImage2', aspect: 'portrait', required: false, preferredTags: ['scenic'] },
        { type: 'image', id: 'openerImage3', aspect: 'portrait', required: false, preferredTags: ['scenic'] }
      ]
    },
    {
      id: 'masthead',
      name: 'Masthead',
      layout: 'ex-masthead',
      slots: [
        { type: 'text', id: 'mastheadTitle', kind: 'headline', maxLength: 16, required: false, defaultValue: 'MASTHEAD' },
        { type: 'text', id: 'mastheadBody', kind: 'body', maxLength: 400, required: true },
        { type: 'image', id: 'mastheadPhoto', aspect: 'portrait', required: true, preferredTags: ['group', 'family'] }
      ]
    },
    {
      id: 'contents',
      name: 'Contents',
      layout: 'ex-contents',
      slots: [
        { type: 'text', id: 'contentsTitle', kind: 'headline', maxLength: 12, required: false, defaultValue: 'CONTENTS' },
        { type: 'text', id: 'section1', kind: 'kicker', maxLength: 60, required: false },
        { type: 'text', id: 'section2', kind: 'kicker', maxLength: 60, required: false },
        { type: 'text', id: 'section3', kind: 'kicker', maxLength: 60, required: false },
        { type: 'text', id: 'section4', kind: 'kicker', maxLength: 60, required: false },
        { type: 'text', id: 'section5', kind: 'kicker', maxLength: 60, required: false },
        { type: 'image', id: 'thumbImage1', aspect: 'square', required: false },
        { type: 'image', id: 'thumbImage2', aspect: 'square', required: false },
        { type: 'image', id: 'thumbImage3', aspect: 'square', required: false }
      ]
    },
    {
      id: 'destination',
      name: 'Destination',
      layout: 'ex-destination',
      slots: [
        { type: 'text', id: 'destName', kind: 'headline', maxLength: 30, required: true },
        { type: 'text', id: 'destSection', kind: 'kicker', maxLength: 30, required: false },
        { type: 'text', id: 'destHeadline', kind: 'subheadline', maxLength: 50, required: false },
        { type: 'text', id: 'destBody', kind: 'body', maxLength: 500, required: true },
        { type: 'image', id: 'destImage', aspect: 'portrait', required: true, preferredTags: ['landscape', 'dramatic', 'scenic'] }
      ]
    },
    {
      id: 'region',
      name: 'Region',
      layout: 'ex-region',
      slots: [
        { type: 'image', id: 'regionHeroImage', aspect: 'landscape', required: true, preferredTags: ['scenic', 'aerial'] },
        { type: 'text', id: 'regionName', kind: 'headline', maxLength: 30, required: true },
        { type: 'text', id: 'regionBody', kind: 'body', maxLength: 350, required: true },
        { type: 'image', id: 'regionSecondaryImage', aspect: 'portrait', required: false, preferredTags: ['culture', 'people'] }
      ]
    },
    {
      id: 'culture',
      name: 'Culture',
      layout: 'ex-culture',
      slots: [
        { type: 'text', id: 'cultureVerticalTitle', kind: 'headline', maxLength: 24, required: false },
        { type: 'text', id: 'cultureBody', kind: 'body', maxLength: 450, required: true },
        { type: 'image', id: 'cultureImage', aspect: 'portrait', required: true, preferredTags: ['culture', 'people'] },
        { type: 'text', id: 'cultureCaption', kind: 'caption', maxLength: 60, required: false }
      ]
    },
    {
      id: 'back-cover',
      name: 'Back Cover',
      layout: 'ex-back-cover',
      slots: [
        { type: 'image', id: 'backImage', aspect: 'landscape', required: true, preferredTags: ['scenic', 'sunset'] },
        { type: 'text', id: 'backMagazineName', kind: 'headline', maxLength: 12, required: false, defaultValue: 'explore' },
        { type: 'text', id: 'backTagline', kind: 'tagline', maxLength: 60, required: false }
      ]
    }
  ]
};
