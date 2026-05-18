import { MagazineDocument } from './types';
import { getSupabaseAdmin } from '../supabase';

const memoryStore: Map<string, MagazineDocument> = new Map();

export async function saveMagazine(doc: MagazineDocument): Promise<void> {
  memoryStore.set(doc.id, doc);
  const supabase = getSupabaseAdmin();
  if (!supabase) return;
  try {
    await supabase.from('magazines').upsert({
      id: doc.id,
      template_id: doc.templateId,
      destination: doc.destination,
      data: doc,
      created_at: doc.generatedAt
    });
  } catch {
    // Supabase unavailable — memory store still holds the document
  }
}

export async function loadMagazine(id: string): Promise<MagazineDocument | null> {
  if (memoryStore.has(id)) return memoryStore.get(id) ?? null;
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('magazines')
      .select('data')
      .eq('id', id)
      .single();
    if (error || !data) return null;
    return data.data as MagazineDocument;
  } catch {
    return null;
  }
}
