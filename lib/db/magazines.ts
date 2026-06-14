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
  const supabase = getSupabaseServer();
  if (!supabase) return null;
  try {
    const { count: total, error: e1 } = await supabase
      .from('magazines')
      .select('*', { count: 'exact', head: true })
      .eq('partner_slug', partnerSlug);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: month, error: e2 } = await supabase
      .from('magazines')
      .select('*', { count: 'exact', head: true })
      .eq('partner_slug', partnerSlug)
      .gte('created_at', startOfMonth.toISOString());

    if (e1 || e2) return null;
    return { total: total ?? 0, month: month ?? 0 };
  } catch {
    return null;
  }
}
