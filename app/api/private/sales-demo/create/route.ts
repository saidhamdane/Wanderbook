import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { buildAdminDemoMagazine } from '@/lib/magazine/build-demo-magazine';
import { normalizeAdminDemoLead } from '@/lib/magazine/admin-demo-preview';
import { saveMagazine } from '@/lib/magazine/store';
import { createSalesDemo, getActiveSalesDemoByLeadId } from '@/lib/db/sales-demos';
import { generateSalesDemoToken } from '@/lib/sales-demo-token';
import type { MagazineDocument } from '@/lib/magazine/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function cleanLeadId(value: unknown): string | undefined {
  return typeof value === 'string' && UUID_RE.test(value) ? value : undefined;
}

function scrubSalesDemoString(value: string): string {
  return value
    .replace(/admin-only demo prospect/gi, 'sales demo prospect')
    .replace(/private admin-only demo preview/gi, 'personalized Wanderbook demo')
    .replace(/admin-only lead details:\n?/gi, 'Contact details:\n')
    .replace(/demo preview/gi, 'digital magazine demo');
}

function scrubSalesDemoDocument(value: unknown): unknown {
  if (typeof value === 'string') return scrubSalesDemoString(value);
  if (Array.isArray(value)) return value.map(scrubSalesDemoDocument);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, entry]) => [key, scrubSalesDemoDocument(entry)])
  );
}

function prepareSalesDemoDocument(doc: MagazineDocument, token: string): MagazineDocument {
  const scrubbed = scrubSalesDemoDocument(doc) as MagazineDocument;
  const businessName = scrubbed.partner?.businessName || scrubbed.familyName || 'Wanderbook partner';
  const activityLabel = scrubbed.partner?.activityLabel || scrubbed.partner?.businessType || 'travel experience';

  scrubbed.id = `sdmag_${token.slice(0, 24)}`;
  scrubbed.source = 'sales_demo';
  scrubbed.isAdminDemo = false;
  scrubbed.isPubliclyShareable = false;
  scrubbed.partner = {
    ...(scrubbed.partner || {}),
    aiCompanySummary: `${businessName} is previewed as a Wanderbook Canarias partner for a personalized digital travel magazine.`,
    aiCompanyTrustLine: scrubbed.partner?.googleRating
      ? `Rated ${Number(scrubbed.partner.googleRating).toFixed(1)}${
          scrubbed.partner.googleReviewCount ? ` by ${scrubbed.partner.googleReviewCount} reviewers` : ''
        }.`
      : `Personalized ${activityLabel} demo for Wanderbook Canarias.`,
    aiCompanyFinalCtaLine: `A personalized magazine experience for ${businessName}.`,
  };
  delete scrubbed.adminDemoLead;
  return scrubbed;
}

export async function POST(req: NextRequest) {
  if (!getAdminSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const lead = normalizeAdminDemoLead(body);
  if (!lead) {
    return NextResponse.json({ error: 'business and type are required' }, { status: 400 });
  }

  const leadId = cleanLeadId(body.leadId);
  if (leadId) {
    const existing = await getActiveSalesDemoByLeadId(leadId);
    if (existing) {
      return NextResponse.json({
        token: existing.token,
        expiresAt: existing.expires_at,
        viewCount: existing.view_count,
        whatsappClicks: existing.whatsapp_clicks,
        signupClicks: existing.signup_clicks,
      });
    }
  }

  try {
    const token = generateSalesDemoToken();
    const doc = prepareSalesDemoDocument(await buildAdminDemoMagazine(lead), token);
    await saveMagazine(doc);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const row = await createSalesDemo({
      token,
      leadId,
      businessName: lead.business,
      magazineId: doc.id,
      expiresAt,
    });

    return NextResponse.json({
      token: row.token,
      expiresAt: row.expires_at,
      viewCount: row.view_count,
      whatsappClicks: row.whatsapp_clicks,
      signupClicks: row.signup_clicks,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create sales demo.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
