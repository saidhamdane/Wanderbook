export type ImageSlot = {
  type: 'image';
  id: string;
  aspect: 'portrait' | 'landscape' | 'square' | 'any';
  required: boolean;
  preferredTags?: string[];
};

export type TextSlot = {
  type: 'text';
  id: string;
  kind:
    | 'headline'
    | 'subheadline'
    | 'body'
    | 'kicker'
    | 'quote'
    | 'caption'
    | 'contents-list'
    | 'tagline'
    | 'year'
    | 'destination-name';
  maxLength?: number;
  required: boolean;
  defaultValue?: string;
};

export type PageSlot = ImageSlot | TextSlot;

export type TemplatePage = {
  id: string;
  name: string;
  layout: string;
  slots: PageSlot[];
};

export type MagazineTemplate = {
  id: string;
  name: string;
  mood: string;
  description: string;
  source?: 'css' | 'canva';
  previewImage?: string;
  coverImage?: string;
  fallbackCoverImage?: string;
  bestFor?: string;
  /** If true, selecting this template opens canvaUrl instead of the create flow */
  external?: boolean;
  canvaUrl?: string;
  palette: {
    primary: string;
    accent: string;
    background: string;
    text: string;
    light: string;
  };
  fonts: {
    heading: string;
    subheading: string;
    body: string;
  };
  pages: TemplatePage[];
};

export type PhotoAnalysis = {
  id: string;
  url: string;
  originalName?: string;
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape' | 'square';
  tags: string[];
  qualityScore: number;
  isHero: boolean;
};

export type StockPhoto = {
  id: string;
  url: string;
  photographer: string;
  orientation: 'portrait' | 'landscape' | 'square';
};

export type MagazineDocument = {
  id: string;
  templateId: string;
  destination: string;
  familyName?: string;
  generatedAt: string;
  sessionId?: string;
  language?: string;
  style?: string;
  partner?: LayoutPartner;
  copyProvider?: unknown;
  [key: string]: unknown;
  pages: Array<{
    pageId: string;
    layout: string;
    slots: Record<string, string>;
  }>;
  template: MagazineTemplate;
};

export type LayoutPartner = {
  enabled?: boolean;
  slug?: string;
  partnerId?: string;
  businessName?: string;
  businessType?: string;
  mainIsland?: string;
  whatsapp?: string;
  website?: string;
  logoUrl?: string;
  brandingNote?: string;
  [key: string]: unknown;
};

export type LayoutProps = {
  slots: Record<string, string>;
  palette: MagazineTemplate['palette'];
  fonts: MagazineTemplate['fonts'];
  pageIndex: number;
  partner?: LayoutPartner;
  language?: string;
  style?: string;
  copyProvider?: unknown;
};

import type { UploadedPhoto } from '@/lib/upload-handler';

export type GenerateMagazineInput = {
  templateId: string;
  destination: string;
  travelers: string;
  style: string;
  language: string;
  notes?: string;
  tagline?: string;
  familyName?: string;
  userPhotos: UploadedPhoto[];
  useStockFallback: boolean;
  sessionId?: string;
};
