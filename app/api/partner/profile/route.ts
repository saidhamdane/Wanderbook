import { NextResponse } from 'next/server';
import { getPartnerSession } from '@/lib/auth/partner-session';
import { updatePartnerProfileFromSession } from '@/lib/db/partners';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PUT(req: Request) {
  const session = getPartnerSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const fields = {
    businessName: String(body.businessName || '').trim(),
    businessType: String(body.businessType || '').trim(),
    mainIsland: String(body.mainIsland || '').trim(),
    whatsapp: String(body.whatsapp || '').trim(),
    website: body.website ? String(body.website).trim() : '',
    logoUrl: body.logoUrl ? String(body.logoUrl).trim() : '',
    brandingNote: body.brandingNote ? String(body.brandingNote).trim() : '',
    preferredTemplateId: body.preferredTemplateId ? String(body.preferredTemplateId).trim() : undefined,
  };

  const { ok, error: saveError } = await updatePartnerProfileFromSession(session, fields);

  if (!ok) {
    console.error('[profile] save failed:', saveError, {
      partnerSlug: session.partnerSlug,
      partnerId: session.partnerId,
      email: session.email,
    });
    return NextResponse.json(
      { error: 'Failed to save profile. Please try again.' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    partner: {
      slug: session.partnerSlug,
      plan: session.plan,
      ...fields,
    },
  });
}
