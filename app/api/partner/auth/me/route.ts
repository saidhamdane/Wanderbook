import { NextResponse } from 'next/server';
import { getPartnerSession } from '@/lib/auth/partner-session';
import { getPartnerBySlug } from '@/lib/db/partners';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const session = getPartnerSession();
  if (!session) {
    return NextResponse.json({ ok: false, reason: 'no_cookie' }, { status: 401 });
  }

  const partner = await getPartnerBySlug(session.partnerSlug);
  if (!partner) {
    return NextResponse.json({ ok: false, reason: 'partner_not_found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, session, partner });
}
