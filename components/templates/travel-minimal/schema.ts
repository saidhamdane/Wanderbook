import { MagazineTemplate } from '@/lib/magazine/types';

export const travelMinimalTemplate: MagazineTemplate = {
  id: 'travel-minimal',
  name: 'Travel Minimal',
  mood: 'Clean · Modern · Light',
  description:
    'A modern minimal magazine. Large geometric type, clean grids, generous whitespace.',
  palette: {
    primary: '#0A0A0A',
    accent: '#4A90E2',
    background: '#FFFFFF',
    text: '#2D2D2D',
    light: '#F5F5F5'
  },
  fonts: {
    heading: "'DM Sans', sans-serif",
    subheading: "'DM Sans', sans-serif",
    body: "'DM Sans', sans-serif"
  },
  pages: [
    {
      id: 'cover',
      name: 'Cover',
      layout: 'tm-cover',
      slots: [
        { type: 'image', id: 'coverHeroImage', aspect: 'portrait', required: true, preferredTags: ['hero', 'scenic'] },
        { type: 'text', id: 'coverTitle', kind: 'headline', maxLength: 10, required: true, defaultValue: 'TRAVEL' },
        { type: 'text', id: 'coverLabel', kind: 'subheadline', maxLength: 20, required: false, defaultValue: 'Magazine' },
        { type: 'text', id: 'coverStat1Number', kind: 'kicker', maxLength: 4, required: false },
        { type: 'text', id: 'coverStat1Label', kind: 'kicker', maxLength: 25, required: false },
        { type: 'text', id: 'coverStat1Body', kind: 'caption', maxLength: 60, required: false },
        { type: 'text', id: 'coverStat2Number', kind: 'kicker', maxLength: 4, required: false },
        { type: 'text', id: 'coverStat2Label', kind: 'kicker', maxLength: 25, required: false },
        { type: 'text', id: 'coverStat2Body', kind: 'caption', maxLength: 60, required: false },
        { type: 'text', id: 'coverStat3Number', kind: 'kicker', maxLength: 4, required: false },
        { type: 'text', id: 'coverStat3Label', kind: 'kicker', maxLength: 25, required: false },
        { type: 'text', id: 'coverStat3Body', kind: 'caption', maxLength: 60, required: false },
        { type: 'text', id: 'coverStat4Number', kind: 'kicker', maxLength: 4, required: false },
        { type: 'text', id: 'coverStat4Label', kind: 'kicker', maxLength: 25, required: false },
        { type: 'text', id: 'coverStat4Body', kind: 'caption', maxLength: 60, required: false },
        { type: 'text', id: 'coverYear', kind: 'year', maxLength: 4, required: false }
      ]
    },
    {
      id: 'contents',
      name: 'Contents',
      layout: 'tm-contents',
      slots: [
        { type: 'text', id: 'contentsTitle', kind: 'headline', maxLength: 12, required: false, defaultValue: 'Content' },
        { type: 'text', id: 'item1', kind: 'kicker', maxLength: 60, required: false },
        { type: 'text', id: 'item2', kind: 'kicker', maxLength: 60, required: false },
        { type: 'text', id: 'item3', kind: 'kicker', maxLength: 60, required: false },
        { type: 'text', id: 'item4', kind: 'kicker', maxLength: 60, required: false },
        { type: 'text', id: 'item5', kind: 'kicker', maxLength: 60, required: false },
        { type: 'text', id: 'item6', kind: 'kicker', maxLength: 60, required: false },
        { type: 'image', id: 'contentsImage', aspect: 'landscape', required: true, preferredTags: ['aerial', 'beach'] }
      ]
    },
    {
      id: 'intro',
      name: 'Intro',
      layout: 'tm-intro',
      slots: [
        { type: 'text', id: 'introTitle', kind: 'headline', maxLength: 10, required: false, defaultValue: 'Travel' },
        { type: 'text', id: 'introBody1', kind: 'body', maxLength: 300, required: true },
        { type: 'text', id: 'introBody2', kind: 'body', maxLength: 300, required: false },
        { type: 'image', id: 'introImage', aspect: 'portrait', required: true, preferredTags: ['mountain', 'outdoor'] }
      ]
    },
    {
      id: 'about',
      name: 'About',
      layout: 'tm-about',
      slots: [
        { type: 'text', id: 'aboutTitle', kind: 'headline', maxLength: 24, required: true },
        { type: 'text', id: 'aboutBody', kind: 'body', maxLength: 350, required: true },
        { type: 'image', id: 'aboutImage1', aspect: 'landscape', required: false },
        { type: 'image', id: 'aboutImage2', aspect: 'landscape', required: false },
        { type: 'image', id: 'aboutImage3', aspect: 'portrait', required: false }
      ]
    },
    {
      id: 'photo-grid',
      name: 'Photo Grid',
      layout: 'tm-photo-grid',
      slots: [
        { type: 'image', id: 'gridImage1', aspect: 'any', required: false },
        { type: 'image', id: 'gridImage2', aspect: 'any', required: false },
        { type: 'image', id: 'gridImage3', aspect: 'any', required: false },
        { type: 'image', id: 'gridImage4', aspect: 'any', required: false },
        { type: 'image', id: 'gridImage5', aspect: 'any', required: false },
        { type: 'image', id: 'gridImage6', aspect: 'any', required: false },
        { type: 'text', id: 'gridCaption1', kind: 'caption', maxLength: 20, required: false },
        { type: 'text', id: 'gridCaption2', kind: 'caption', maxLength: 20, required: false },
        { type: 'text', id: 'gridCaption3', kind: 'caption', maxLength: 20, required: false },
        { type: 'text', id: 'gridCaption4', kind: 'caption', maxLength: 20, required: false },
        { type: 'text', id: 'gridCaption5', kind: 'caption', maxLength: 20, required: false },
        { type: 'text', id: 'gridCaption6', kind: 'caption', maxLength: 20, required: false }
      ]
    },
    {
      id: 'manual',
      name: 'Manual',
      layout: 'tm-manual',
      slots: [
        { type: 'text', id: 'manualTitle', kind: 'headline', maxLength: 30, required: true },
        { type: 'text', id: 'check1', kind: 'body', maxLength: 80, required: false },
        { type: 'text', id: 'check2', kind: 'body', maxLength: 80, required: false },
        { type: 'text', id: 'check3', kind: 'body', maxLength: 80, required: false },
        { type: 'text', id: 'check4', kind: 'body', maxLength: 80, required: false },
        { type: 'image', id: 'manualImage', aspect: 'portrait', required: true, preferredTags: ['activity', 'road'] }
      ]
    },
    {
      id: 'services',
      name: 'Services',
      layout: 'tm-services',
      slots: [
        { type: 'text', id: 'servicesTitle', kind: 'headline', maxLength: 30, required: true },
        { type: 'text', id: 'servicesBody', kind: 'body', maxLength: 400, required: true },
        { type: 'image', id: 'servicesImage', aspect: 'portrait', required: true, preferredTags: ['scenic'] }
      ]
    },
    {
      id: 'back-cover',
      name: 'Back Cover',
      layout: 'tm-back-cover',
      slots: [
        { type: 'image', id: 'backImage', aspect: 'landscape', required: true, preferredTags: ['scenic', 'sunset'] },
        { type: 'text', id: 'backTagline', kind: 'tagline', maxLength: 60, required: false }
      ]
    }
  ]
};
