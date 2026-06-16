import { NextResponse } from 'next/server';
import { getPartnerSession } from '@/lib/auth/partner-session';
import { getPartnerAnalytics } from '@/lib/db/partner-events';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const session = getPartnerSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const analytics = await getPartnerAnalytics({
    partnerId: session.partnerId,
    partnerSlug: session.partnerSlug,
  });

  return NextResponse.json({ ok: true, analytics });
}
