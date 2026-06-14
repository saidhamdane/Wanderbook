import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PARTNER_SESSION_COOKIE, deletePartnerSession } from '@/lib/partner-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  deletePartnerSession(cookies().get(PARTNER_SESSION_COOKIE)?.value);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(PARTNER_SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
}
