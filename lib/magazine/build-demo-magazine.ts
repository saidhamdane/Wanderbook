import { generateMagazine, insertCompanyPageIfNeeded } from '@/lib/magazine/generate-magazine';
import { resolveActivityProfile } from '@/lib/magazine/resolveActivityProfile';
import {
  activityInputForLead,
  adminDemoCompanyBody,
  demoIdForLead,
  type DemoPreviewLead,
} from '@/lib/magazine/admin-demo-preview';
import type { LayoutPartner, MagazineDocument } from '@/lib/magazine/types';

export async function buildAdminDemoMagazine(lead: DemoPreviewLead): Promise<MagazineDocument> {
  const activityProfile = resolveActivityProfile(
    {
      businessName: lead.business,
      businessType: activityInputForLead(lead),
      aiDetectedActivityType: lead.detectedCategory,
      googlePlaceName: lead.business,
    },
    'en'
  );
  const generatedAt = new Date().toISOString();
  const partner: LayoutPartner = {
    enabled: true,
    businessName: lead.business,
    businessType: lead.type,
    activityType: activityProfile.activityType,
    resolvedActivityType: activityProfile.activityType,
    activityLabel: activityProfile.activityLabel,
    mainIsland: lead.location,
    demoCompanyImage: activityProfile.demoAssets.company[0],
    googleRating: lead.rating,
    googleReviewCount: lead.reviews,
    aiDetectedActivityType: lead.detectedCategory || activityProfile.activityLabel,
    aiCompanyPageTitle: `${lead.business}: ${activityProfile.activityLabel} preview`,
    aiCompanyPageSubtitle: `${activityProfile.activityLabel} in ${lead.location}`,
    aiCompanyPageBody: adminDemoCompanyBody(lead, activityProfile.activityLabel),
    aiCompanySummary: `${lead.business} is an admin-only demo prospect for ${lead.location}.`,
    aiCompanyTrustLine: lead.rating
      ? `Rated ${lead.rating.toFixed(1)}${lead.reviews ? ` by ${lead.reviews} reviewers` : ''}.`
      : 'Private admin-only demo preview.',
    aiCompanyFinalCtaLine: `Demo preview for ${lead.business}.`,
  };

  const doc = await generateMagazine({
    templateId: activityProfile.templateId,
    destination: lead.location,
    travelers: lead.business,
    style: activityProfile.copyTone,
    language: 'en',
    createdAt: generatedAt,
    notes: adminDemoCompanyBody(lead, activityProfile.activityLabel),
    tagline: `${lead.business} demo preview`,
    familyName: lead.business,
    userPhotos: [],
    generationMode: 'demo',
    demoUploads: [],
    useStockFallback: false,
    activityProfile,
  });

  doc.id = demoIdForLead(lead);
  doc.createdAt = generatedAt;
  doc.generatedAt = generatedAt;
  doc.language = 'en';
  doc.generationMode = 'demo';
  doc.isAdminDemo = true;
  doc.isPubliclyShareable = false;
  doc.partner = partner;
  doc.source = 'admin_demo';
  doc.adminDemoLead = {
    business: lead.business,
    businessType: lead.type,
    detectedCategory: lead.detectedCategory,
    location: lead.location,
    phone: lead.phone,
    rating: lead.rating,
    reviews: lead.reviews,
    website: lead.website,
  };
  if (doc.generationAudit) {
    doc.generationAudit.resolvedActivityType = activityProfile.activityType;
    doc.generationAudit.selectedTemplate = doc.templateId;
  }
  if (doc.imageAudit) {
    doc.imageAudit.resolvedActivityType = activityProfile.activityType;
  }
  insertCompanyPageIfNeeded(doc, partner);
  return doc;
}
