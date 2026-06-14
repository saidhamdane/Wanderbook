import { NextResponse } from 'next/server';
import { clearPartnerSession } from '@/lib/auth/partner-session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  clearPartnerSession();
  return NextResponse.json({ ok: true });
}
