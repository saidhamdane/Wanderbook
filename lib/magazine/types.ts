export type MagazineGenerationMode = 'demo' | 'traveler';

export type MagazineImageSource =
  | 'curated-demo'
  | 'demo-upload'
  | 'traveler-upload'
  | 'company-photo';

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

export type ImageAuditEntry = {
  url: string;
  source: MagazineImageSource;
  slot: string;
  activityType: string;
  accepted: boolean;
  rejectionReason?: string;
};

export type ImageAudit = {
  mode: MagazineGenerationMode;
  resolvedActivityType: string;
  selectedImages: ImageAuditEntry[];
  rejectedImages: Array<{ url: string; source: MagazineImageSource; reason: string }>;
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
  generationAudit?: {
    resolvedActivityType: ResolvedActivityType;
    selectedTemplate: string;
    language: string;
    copySource: 'openai' | 'claude' | 'defaults';
    imageSourceSummary: string;
    partnerId?: string;
    generatedAt: string;
  };
  imageAudit?: ImageAudit;
  generationMode?: MagazineGenerationMode;
  isPubliclyShareable?: boolean;
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
  activityType?: string;
  resolvedActivityType?: ResolvedActivityType;
  activityLabel?: string;
  mainIsland?: string;
  whatsapp?: string;
  website?: string;
  logoUrl?: string;
  brandingNote?: string;
  googleReviewUrl?: string;
  instagramUrl?: string;
  bookingUrl?: string;
  magazineId?: string;
  googlePlaceName?: string;
  googlePrimaryType?: string;
  googleTypes?: string[];
  googleRating?: number;
  googleReviewCount?: number;
  googlePhotos?: Array<{ reference: string; proxyUrl: string }>;
  demoCompanyImage?: string;
  aiDetectedActivityType?: string;
  aiIslandContextLine?: string;
  aiActivityDescription?: string;
  aiCompanySummary?: string;
  aiPositiveReviewThemes?: string[];
  aiCompanyPageTitle?: string;
  aiCompanyPageSubtitle?: string;
  aiCompanyPageBody?: string;
  aiCompanyTrustLine?: string;
  aiCompanyFinalCtaLine?: string;
  aiCompanyPhotoCaptions?: string[];
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
import type { ActivityProfile, ResolvedActivityType } from './resolveActivityProfile';

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
  generationMode?: MagazineGenerationMode;
  demoUploads?: UploadedPhoto[];
  useStockFallback: boolean;
  sessionId?: string;
  activityProfile?: ActivityProfile;
  partnerId?: string;
};
