import { getSupabaseServer } from '@/lib/supabase/server';
import type { MagazineDocument } from '@/lib/magazine/types';
import { loadMagazine } from '@/lib/magazine/store';

export async function saveMagazineRecord(
  doc: MagazineDocument,
  extras?: { shareUrl?: string; pdfUrl?: string }
): Promise<void> {
  const supabase = getSupabaseServer();
  if (!supabase) return;
  try {
    const { error } = await supabase.from('magazines').upsert({
      magazine_id: doc.id,
      template_id: doc.templateId,
      destination: doc.destination,
      language: doc.language || null,
      style: doc.style || null,
      partner_slug: doc.partner?.slug || null,
      client_name: doc.clientName || null,
      copy_source: doc.copySource || null,
      share_url: extras?.shareUrl || null,
      pdf_url: extras?.pdfUrl || null,
      data: doc,
      created_at: doc.generatedAt,
    }, { onConflict: 'magazine_id' });
    if (error) console.warn('[db/magazines] saveMagazineRecord error:', error.message);
  } catch (err) {
    console.warn('[db/magazines] saveMagazineRecord exception:', err);
  }
}

export async function getMagazineById(magazineId: string): Promise<MagazineDocument | null> {
  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('magazines')
        .select('data')
        .eq('magazine_id', magazineId)
        .maybeSingle();
      if (!error && data?.data) return data.data as MagazineDocument;
    } catch {
      // fall through to local
    }
  }
  return loadMagazine(magazineId);
}

export async function listMagazinesByPartner(partnerSlug: string): Promise<MagazineDocument[]> {
  const supabase = getSupabaseServer();
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('magazines')
      .select('data')
      .eq('partner_slug', partnerSlug)
      .order('created_at', { ascending: false });
    if (error || !data) return [];
    return data.map((row) => row.data as MagazineDocument).filter(Boolean);
  } catch {
    return [];
  }
}

export async function countMagazinesByPartnerSlug(
  partnerSlug: string
): Promise<{ total: number; month: number } | null> {
  return countMagazinesByPartner(partnerSlug, undefined);
}

/**
 * Count magazines for a partner matching by slug OR id (whichever column is set).
 * Old rows only have partner_slug; new rows have both.
 */
export async function countMagazinesByPartner(
  partnerSlug: string,
  partnerId: string | undefined
): Promise<{ total: number; month: number } | null> {
  const supabase = getSupabaseServer();
  if (!supabase) return null;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  // Build OR filter: always match by slug; add id match when available
  const orFilter = partnerId
    ? `partner_slug.eq.${partnerSlug},partner_id.eq.${partnerId}`
    : `partner_slug.eq.${partnerSlug}`;

  try {
    const { data, error } = await supabase
      .from('magazines')
      .select('data,created_at')
      .or(orFilter);

    if (error) { console.warn('[db/magazines] countMagazinesByPartner error:', error.message); return null; }
    const realTravelerRows = (data || []).filter((row) => {
      const doc = row.data as MagazineDocument | null;
      return doc?.generationMode !== 'demo' && doc?.source !== 'partner_demo';
    });
    const monthRows = realTravelerRows.filter((row) => {
      const generatedAt = String(row.created_at || (row.data as MagazineDocument | null)?.generatedAt || '');
      return generatedAt >= startOfMonth.toISOString();
    });
    return { total: realTravelerRows.length, month: monthRows.length };
  } catch (err) {
    console.warn('[db/magazines] countMagazinesByPartner exception:', err);
    return null;
  }
}
