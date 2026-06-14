import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth/password';
import { createPartnerSessionCookie } from '@/lib/auth/partner-session';
import { isSupabaseConfigured } from '@/lib/supabase/server';
import { slugifyPartnerName } from '@/lib/partners';
import {
  insertPartnerAuth,
  isEmailTakenInSupabase,
  isSlugTakenInSupabase,
} from '@/lib/db/partners';
import { createPartnerAccount, createPartnerSession, PARTNER_SESSION_COOKIE } from '@/lib/partner-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function uniqueSlug(base: string): Promise<string> {
  let slug = base;
  let n = 2;
  for (;;) {
    const taken = await isSlugTakenInSupabase(slug);
    if (!taken) return slug;
    slug = `${base}-${n}`;
    n++;
  }
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const businessName = String(body.businessName || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');
  const phone = String(body.phone || '').trim() || null;
  const website = String(body.website || '').trim() || null;
  const businessType = String(body.businessType || '').trim() || null;

  if (!businessName) return NextResponse.json({ error: 'Business name is required.' }, { status: 400 });
  if (!email || !email.includes('@')) return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });

  if (isSupabaseConfigured()) {
    const emailTaken = await isEmailTakenInSupabase(email);
    if (emailTaken) {
      return NextResponse.json({ error: 'A partner account already exists for this email.' }, { status: 409 });
    }

    const baseSlug = slugifyPartnerName(businessName) || 'partner';
    const slug = await uniqueSlug(baseSlug);
    const passwordHash = await hashPassword(password);
    const id = crypto.randomUUID();

    const created = await insertPartnerAuth({ id, slug, businessName, email, passwordHash, phone, website, businessType });
    if (!created) {
      console.error('[partner/auth/register] insertPartnerAuth returned null — Supabase insert failed for email:', email);
      return NextResponse.json({ error: 'Could not create partner account. Please try again.' }, { status: 500 });
    }

    if (!created.email) {
      console.error('[partner/auth/register] Partner row created but email is null — slug:', created.slug);
      return NextResponse.json({ error: 'Registration failed: email was not saved. Please try again.' }, { status: 500 });
    }

    console.log('[partner/auth/register] Partner registered — slug:', created.slug, 'email:', created.email);
    createPartnerSessionCookie({
      partnerId: created.id,
      partnerSlug: created.slug,
      email: created.email,
      plan: 'free',
      subscriptionStatus: 'none',
    });
    return NextResponse.json({ ok: true, redirect: '/partner/dashboard' });
  }

  // Dev fallback: local JSON only (Supabase not configured)
  try {
    const partner = createPartnerAccount({
      email,
      password,
      businessName,
      businessType: businessType || '',
      mainIsland: '',
      whatsapp: phone || '',
      website: website || undefined,
    });
    const token = createPartnerSession(partner.id);
    const res = NextResponse.json({ ok: true, redirect: '/partner/dashboard' });
    res.cookies.set(PARTNER_SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not create partner account.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
