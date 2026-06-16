import { NextRequest, NextResponse } from 'next/server';
import { trackPartnerEvent } from '@/lib/db/partner-events';
import { getSupabaseServer } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_PUBLIC_EVENTS = new Set([
  'magazine_viewed',
  'magazine_shared_whatsapp',
  'google_review_clicked',
  'booking_clicked',
  'instagram_clicked',
  'partner_page_opened',
]);

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const eventType = String(body.eventType || '').trim();
  const magazineId = body.magazineId ? String(body.magazineId).trim() : undefined;
  const partnerSlug = body.partnerSlug ? String(body.partnerSlug).trim() : undefined;
  const metadata = (body.metadata && typeof body.metadata === 'object' && !Array.isArray(body.metadata))
    ? (body.metadata as Record<string, unknown>)
    : {};

  if (!ALLOWED_PUBLIC_EVENTS.has(eventType)) {
    return NextResponse.json({ error: 'Event type not allowed' }, { status: 400 });
  }

  if (!partnerSlug && !magazineId) {
    return NextResponse.json({ error: 'partnerSlug or magazineId required' }, { status: 400 });
  }

  // Resolve partnerId from slug for richer analytics
  let partnerId: string | undefined;
  if (partnerSlug) {
    const supabase = getSupabaseServer();
    if (supabase) {
      try {
        const { data } = await supabase
          .from('partners')
          .select('id')
          .eq('slug', partnerSlug)
          .maybeSingle();
        if (data) partnerId = (data as { id: string }).id;
      } catch {
        // non-fatal
      }
    }
  }

  await trackPartnerEvent({ partnerId, partnerSlug, magazineId, eventType, metadata });

  return NextResponse.json({ ok: true });
}
