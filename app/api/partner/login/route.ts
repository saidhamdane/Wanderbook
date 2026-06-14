import { NextResponse } from 'next/server';
import { PARTNER_SESSION_COOKIE, authenticatePartner, createPartnerSession } from '@/lib/partner-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const body = await req.json();
  const partner = authenticatePartner(String(body.email || ''), String(body.password || ''));
  if (!partner) return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });

  const token = createPartnerSession(partner.id);
  const res = NextResponse.json({ ok: true, redirectTo: '/partner/dashboard', slug: partner.slug });
  res.cookies.set(PARTNER_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
