import { getSupabaseServer } from '@/lib/supabase/server';

export type PartnerEventType =
  | 'magazine_created'
  | 'magazine_viewed'
  | 'magazine_shared_whatsapp'
  | 'google_review_clicked'
  | 'booking_clicked'
  | 'instagram_clicked'
  | 'partner_page_opened';

export type TrackEventParams = {
  partnerId?: string;
  partnerSlug?: string;
  magazineId?: string;
  eventType: PartnerEventType | string;
  metadata?: Record<string, unknown>;
};

export type PartnerAnalytics = {
  magazinesTotal: number;
  magazinesThisMonth: number;
  viewsTotal: number;
  whatsappShares: number;
  reviewClicks: number;
  bookingClicks: number;
  instagramClicks: number;
};

export async function trackPartnerEvent(params: TrackEventParams): Promise<void> {
  const supabase = getSupabaseServer();
  if (!supabase) return;

  const fullRow = {
    partner_id: params.partnerId ?? null,
    partner_slug: params.partnerSlug ?? null,
    magazine_id: params.magazineId ?? null,
    event_type: params.eventType,
    metadata: params.metadata ?? {},
    created_at: new Date().toISOString(),
  };

  try {
    const { error } = await supabase.from('partner_events').insert(fullRow);
    if (!error) return;

    // 42703 = PostgreSQL undefined_column; PGRST204 = PostgREST schema cache miss.
    // Both mean the migration hasn't been applied yet — fall back to minimal schema.
    const isSchemaMiss = error.code === '42703' || error.code === 'PGRST204'
      || (error.message || '').includes('schema cache')
      || (error.message || '').includes('column');

    if (isSchemaMiss) {
      console.warn('[partner-events] trackPartnerEvent schema miss, using minimal fallback:', error.message);
      const { error: fallbackErr } = await supabase.from('partner_events').insert({
        partner_slug: params.partnerSlug ?? null,
        event_type: params.eventType,
        metadata: params.metadata ?? {},
        created_at: new Date().toISOString(),
      });
      if (fallbackErr) console.warn('[partner-events] trackPartnerEvent fallback error:', fallbackErr.message);
    } else {
      console.warn('[partner-events] trackPartnerEvent error:', error.message);
    }
  } catch (err) {
    console.warn('[partner-events] trackPartnerEvent exception:', err);
  }
}

export async function getPartnerAnalytics(params: {
  partnerId?: string;
  partnerSlug?: string;
}): Promise<PartnerAnalytics> {
  const empty: PartnerAnalytics = {
    magazinesTotal: 0,
    magazinesThisMonth: 0,
    viewsTotal: 0,
    whatsappShares: 0,
    reviewClicks: 0,
    bookingClicks: 0,
    instagramClicks: 0,
  };

  const supabase = getSupabaseServer();
  if (!supabase || (!params.partnerId && !params.partnerSlug)) return empty;

  try {
    // Query by slug only (partner_id column may not exist if migration is pending)
    const { data, error } = await supabase
      .from('partner_events')
      .select('event_type, created_at')
      .eq('partner_slug', params.partnerSlug ?? '');
    if (error) {
      console.warn('[partner-events] getPartnerAnalytics error:', error.message);
      return empty;
    }

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const rows = (data ?? []) as Array<{ event_type: string; created_at: string }>;

    let magazinesTotal = 0;
    let magazinesThisMonth = 0;
    let viewsTotal = 0;
    let whatsappShares = 0;
    let reviewClicks = 0;
    let bookingClicks = 0;
    let instagramClicks = 0;

    for (const row of rows) {
      const isThisMonth = row.created_at >= monthStart;
      switch (row.event_type) {
        case 'magazine_created':
          magazinesTotal++;
          if (isThisMonth) magazinesThisMonth++;
          break;
        case 'magazine_viewed':
          viewsTotal++;
          break;
        case 'magazine_shared_whatsapp':
          whatsappShares++;
          break;
        case 'google_review_clicked':
          reviewClicks++;
          break;
        case 'booking_clicked':
          bookingClicks++;
          break;
        case 'instagram_clicked':
          instagramClicks++;
          break;
      }
    }

    return {
      magazinesTotal,
      magazinesThisMonth,
      viewsTotal,
      whatsappShares,
      reviewClicks,
      bookingClicks,
      instagramClicks,
    };
  } catch (err) {
    console.warn('[partner-events] getPartnerAnalytics exception:', err);
    return empty;
  }
}
