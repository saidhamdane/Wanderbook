export type SlotKind = 'image' | 'text';

export type SlotEntry = {
  id: string;
  type: SlotKind;
  selector: string; // CSS class from red-edit.html
  page: number;     // 1–8
};

// Extracted from /tmp/red-edit.html — 20 unique imported-slot-* elements across 8 pages.
export const SLOT_MAP: readonly SlotEntry[] = [
  // Page 1 — Cover
  { id: 'coverPhoto',    type: 'image', selector: '.imported-slot-cover-photo',    page: 1 },
  { id: 'coverKicker',   type: 'text',  selector: '.imported-slot-cover-kicker',   page: 1 },
  { id: 'coverTitle',    type: 'text',  selector: '.imported-slot-cover-title',    page: 1 },
  { id: 'coverSubtitle', type: 'text',  selector: '.imported-slot-cover-subtitle', page: 1 },

  // Page 2 — Contents
  { id: 'sidePhoto', type: 'image', selector: '.imported-slot-side-photo',  page: 2 },
  { id: 'pageTitle', type: 'text',  selector: '.imported-slot-page-title',  page: 2 },
  { id: 'contents',  type: 'text',  selector: '.imported-slot-contents',    page: 2 },

  // Page 3 — Story
  { id: 'widePhoto', type: 'image', selector: '.imported-slot-wide-photo', page: 3 },
  { id: 'pageTitle', type: 'text',  selector: '.imported-slot-page-title', page: 3 },
  { id: 'body',      type: 'text',  selector: '.imported-slot-body',       page: 3 },
  { id: 'caption',   type: 'text',  selector: '.imported-slot-caption',    page: 3 },

  // Page 4 — Feature (two photos)
  { id: 'featurePhoto', type: 'image', selector: '.imported-slot-feature-photo', page: 4 },
  { id: 'detailPhoto',  type: 'image', selector: '.imported-slot-detail-photo',  page: 4 },
  { id: 'featureTitle', type: 'text',  selector: '.imported-slot-feature-title', page: 4 },
  { id: 'body',         type: 'text',  selector: '.imported-slot-body',          page: 4 },

  // Page 5 — Photo Essay
  { id: 'widePhoto',   type: 'image', selector: '.imported-slot-wide-photo',   page: 5 },
  { id: 'squarePhoto', type: 'image', selector: '.imported-slot-square-photo', page: 5 },
  { id: 'pageTitle',   type: 'text',  selector: '.imported-slot-page-title',   page: 5 },
  { id: 'body',        type: 'text',  selector: '.imported-slot-body',         page: 5 },

  // Page 6 — Gallery Grid
  { id: 'gridA',        type: 'image', selector: '.imported-slot-grid-a',        page: 6 },
  { id: 'gridB',        type: 'image', selector: '.imported-slot-grid-b',        page: 6 },
  { id: 'gridC',        type: 'image', selector: '.imported-slot-grid-c',        page: 6 },
  { id: 'gridD',        type: 'image', selector: '.imported-slot-grid-d',        page: 6 },
  { id: 'collageTitle', type: 'text',  selector: '.imported-slot-collage-title', page: 6 },
  { id: 'caption',      type: 'text',  selector: '.imported-slot-caption',       page: 6 },

  // Page 7 — Quote Spread
  { id: 'featurePhoto', type: 'image', selector: '.imported-slot-feature-photo', page: 7 },
  { id: 'quote',        type: 'text',  selector: '.imported-slot-quote',         page: 7 },
  { id: 'caption',      type: 'text',  selector: '.imported-slot-caption',       page: 7 },

  // Page 8 — Back Cover
  { id: 'coverPhoto', type: 'image', selector: '.imported-slot-cover-photo', page: 8 },
  { id: 'pageTitle',  type: 'text',  selector: '.imported-slot-page-title',  page: 8 },
  { id: 'body',       type: 'text',  selector: '.imported-slot-body',        page: 8 },
  { id: 'caption',    type: 'text',  selector: '.imported-slot-caption',     page: 8 },
] as const;
