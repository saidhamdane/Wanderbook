import { NextResponse } from 'next/server';
import { verifyPassword } from '@/lib/auth/password';
import { createPartnerSessionCookie } from '@/lib/auth/partner-session';
import { getPartnerByEmail, updatePartnerLastLogin } from '@/lib/db/partners';
import { authenticatePartner } from '@/lib/partner-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  let email = '';
  let password = '';
  try {
    const body = await req.json();
    email = String(body.email || '').trim().toLowerCase();
    password = String(body.password || '');
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  // Primary path: Supabase lookup with bcrypt hash
  const supabasePartner = await getPartnerByEmail(email);
  if (supabasePartner?.password_hash) {
    const valid = await verifyPassword(password, supabasePartner.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }
    // Update last login timestamp (fire-and-forget)
    if (supabasePartner.slug) {
      updatePartnerLastLogin(supabasePartner.slug).catch(() => {});
    }
    createPartnerSessionCookie({
      partnerId: supabasePartner.id ?? '',
      partnerSlug: supabasePartner.slug ?? '',
      email,
      plan: supabasePartner.plan ?? 'free',
      subscriptionStatus: supabasePartner.subscriptionStatus ?? 'none',
    });
    return NextResponse.json({ ok: true, redirect: '/partner/dashboard' });
  }

  // Legacy fallback: local JSON store with scrypt hash (for partners not yet migrated to Supabase auth)
  const legacyPartner = authenticatePartner(email, password);
  if (!legacyPartner) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }
  createPartnerSessionCookie({
    partnerId: legacyPartner.id,
    partnerSlug: legacyPartner.slug,
    email,
    plan: legacyPartner.plan,
    subscriptionStatus: legacyPartner.subscriptionStatus,
  });
  return NextResponse.json({ ok: true, redirect: '/partner/dashboard' });
}
