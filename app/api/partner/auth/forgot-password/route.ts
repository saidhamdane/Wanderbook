import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';
import { sendPartnerPasswordResetEmail } from '@/lib/email/send-partner-email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EXPIRY_HOURS = 1;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const email = String(body.email || '').trim().toLowerCase();
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
  }

  // Always return success to avoid exposing account existence
  const genericOk = NextResponse.json({ ok: true });

  const supabase = getSupabaseServer();
  if (!supabase) return genericOk;
  const { data: partner } = await supabase
    .from('partners')
    .select('id, email, business_name')
    .eq('email', email)
    .maybeSingle();

  if (!partner) return genericOk;

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + EXPIRY_HOURS * 60 * 60 * 1000).toISOString();

  const { error: insertError } = await supabase.from('partner_password_resets').insert({
    partner_id: partner.id,
    email: partner.email,
    token_hash: tokenHash,
    expires_at: expiresAt,
  });

  if (insertError) {
    console.error('[forgot-password] Failed to store reset token:', insertError.message);
    return genericOk;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://wanderbookcanarias.com';
  const resetUrl = `${appUrl}/partner/reset-password?token=${rawToken}`;

  await sendPartnerPasswordResetEmail({
    to: partner.email,
    resetUrl,
    businessName: partner.business_name || 'Partner',
  });

  return genericOk;
}
