import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';
import { hashPassword } from '@/lib/auth/password';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const token = String(body.token || '').trim();
  const password = String(body.password || '');
  const confirmPassword = String(body.confirmPassword || '');

  if (!token) return NextResponse.json({ error: 'Reset token is required.' }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
  if (password !== confirmPassword) return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 });

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const supabase = getSupabaseServer();
  if (!supabase) return NextResponse.json({ error: 'Database not configured.' }, { status: 503 });

  const { data: resetRow } = await supabase
    .from('partner_password_resets')
    .select('id, partner_id, expires_at, used_at')
    .eq('token_hash', tokenHash)
    .maybeSingle();

  if (!resetRow) {
    return NextResponse.json({ error: 'This reset link is invalid or has already been used.' }, { status: 400 });
  }

  if (resetRow.used_at) {
    return NextResponse.json({ error: 'This reset link has already been used.' }, { status: 400 });
  }

  if (new Date(resetRow.expires_at) < new Date()) {
    return NextResponse.json({ error: 'This reset link has expired. Please request a new one.' }, { status: 400 });
  }

  const passwordHash = await hashPassword(password);

  const { error: updateError } = await supabase
    .from('partners')
    .update({ password_hash: passwordHash })
    .eq('id', resetRow.partner_id);

  if (updateError) {
    console.error('[reset-password] Failed to update password:', updateError.message);
    return NextResponse.json({ error: 'Could not update password. Please try again.' }, { status: 500 });
  }

  await supabase
    .from('partner_password_resets')
    .update({ used_at: new Date().toISOString() })
    .eq('id', resetRow.id);

  return NextResponse.json({ ok: true, redirect: '/partner/login?reset=success' });
}
