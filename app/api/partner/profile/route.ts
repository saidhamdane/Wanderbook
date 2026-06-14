import { NextResponse } from 'next/server';
import { PARTNER_SESSION_COOKIE, getPartnerIdForSession, toPublicPartner, updatePartnerAccount } from '@/lib/partner-store';
import { upsertPartner } from '@/lib/db/partners';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PUT(req: Request) {
  const partnerId = getPartnerIdForSession(cookies().get(PARTNER_SESSION_COOKIE)?.value);
  if (!partnerId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const partner = updatePartnerAccount(partnerId, {
    businessName: String(body.businessName || ''),
    businessType: String(body.businessType || ''),
    mainIsland: String(body.mainIsland || ''),
    whatsapp: String(body.whatsapp || ''),
    website: body.website ? String(body.website) : undefined,
    logoUrl: body.logoUrl ? String(body.logoUrl) : undefined,
    brandingNote: body.brandingNote ? String(body.brandingNote) : undefined,
    preferredTemplateId: body.preferredTemplateId ? String(body.preferredTemplateId) : undefined,
  });
  if (!partner) return NextResponse.json({ error: 'Partner not found' }, { status: 404 });

  upsertPartner(partner).catch((err) =>
    console.warn('[profile] Supabase sync failed (non-fatal):', err)
  );

  return NextResponse.json({ ok: true, partner: { ...toPublicPartner(partner), plan: partner.plan } });
}
