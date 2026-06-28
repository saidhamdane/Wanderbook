import { NextRequest, NextResponse } from 'next/server';
import { createAdminSession, verifyAdminPassword } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  let body: { password?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  if (!process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  if (typeof body.password !== 'string' || !verifyAdminPassword(body.password)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  createAdminSession();
  return NextResponse.json({ ok: true });
}
