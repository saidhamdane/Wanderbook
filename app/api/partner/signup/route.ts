import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth/password';
import { PARTNER_SESSION_COOKIE, createPartnerAccount, createPartnerSession } from '@/lib/partner-store';
import { insertPartnerAuth, isEmailTakenInSupabase, isSlugTakenInSupabase } from '@/lib/db/partners';
import { isSupabaseConfigured } from '@/lib/supabase/server';
import { slugifyPartnerName } from '@/lib/partners';
import { createPartnerSessionCookie } from '@/lib/auth/partner-session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function uniqueSlugInSupabase(base: string): Promise<string> {
  let slug = base;
  let n = 2;
  for (;;) {
    if (!(await isSlugTakenInSupabase(slug))) return slug;
    slug = `${base}-${n}`;
    n++;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const businessName = String(body.businessName || '').trim();
    const wantsUnlimited = body.plan === 'unlimited';

    if (isSupabaseConfigured()) {
      // Check email uniqueness in Supabase before creating anything
      if (email && await isEmailTakenInSupabase(email)) {
        return NextResponse.json({ error: 'A partner account already exists for this email.' }, { status: 409 });
      }
    }

    // Create in local JSON store (also validates email uniqueness there)
    const partner = createPartnerAccount({
      businessName,
      businessType: String(body.businessType || ''),
      mainIsland: String(body.mainIsland || ''),
      whatsapp: String(body.whatsapp || ''),
      website: body.website ? String(body.website) : undefined,
      logoUrl: body.logoUrl ? String(body.logoUrl) : undefined,
      brandingNote: body.brandingNote ? String(body.brandingNote) : undefined,
      preferredTemplateId: body.preferredTemplateId ? String(body.preferredTemplateId) : undefined,
      email,
      password,
    });

    // Sync to Supabase with bcrypt hash (required for /partner/login via Supabase auth)
    if (isSupabaseConfigured()) {
      try {
        const passwordHash = await hashPassword(password);
        const baseSlug = slugifyPartnerName(businessName) || 'partner';
        const slug = await uniqueSlugInSupabase(baseSlug);
        await insertPartnerAuth({
          id: crypto.randomUUID(),
          slug,
          businessName,
          email,
          passwordHash,
          phone: body.whatsapp ? String(body.whatsapp) : null,
          website: body.website ? String(body.website) : null,
          businessType: body.businessType ? String(body.businessType) : null,
          logoUrl: body.logoUrl ? String(body.logoUrl) : null,
          templateId: body.preferredTemplateId ? String(body.preferredTemplateId) : null,
        });
      } catch (syncErr) {
        console.warn('[partner/signup] Supabase sync failed:', syncErr);
      }
    }

    // Create session using new signed-cookie approach
    if (isSupabaseConfigured()) {
      createPartnerSessionCookie({
        partnerId: partner.id,
        partnerSlug: partner.slug,
        email,
        plan: partner.plan,
        subscriptionStatus: partner.subscriptionStatus,
      });
      return NextResponse.json({ ok: true, redirectTo: wantsUnlimited ? '/partner/upgrade' : '/partner/dashboard', slug: partner.slug });
    }

    // Legacy session for dev without Supabase
    const token = createPartnerSession(partner.id);
    const res = NextResponse.json({ ok: true, redirectTo: wantsUnlimited ? '/partner/upgrade' : '/partner/dashboard', slug: partner.slug });
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
