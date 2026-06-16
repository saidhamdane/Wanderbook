import { MagazineDocument } from './types';
import { getSupabaseAdmin } from '../supabase';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'magazines.json');

function loadFromDisk(): Map<string, MagazineDocument> {
  try {
    if (!fs.existsSync(DATA_FILE)) return new Map();
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const entries: [string, MagazineDocument][] = Object.entries(JSON.parse(raw));
    return new Map(entries);
  } catch {
    return new Map();
  }
}

function saveToDisk(store: Map<string, MagazineDocument>): void {
  try {
    const obj = Object.fromEntries(store);
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(obj, null, 2), 'utf-8');
  } catch {
    // disk write failed — in-memory store still holds the document
  }
}

const memoryStore: Map<string, MagazineDocument> = loadFromDisk();

export async function saveMagazine(doc: MagazineDocument): Promise<void> {
  memoryStore.set(doc.id, doc);
  saveToDisk(memoryStore);
  const supabase = getSupabaseAdmin();
  if (!supabase) return;
  const partnerData = doc.partner as Record<string, unknown> | undefined;
  try {
    const { error } = await supabase.from('magazines').upsert({
      magazine_id: doc.id,
      template_id: doc.templateId,
      destination: doc.destination,
      language: doc.language || null,
      style: doc.style || null,
      partner_slug: (partnerData?.slug as string) || null,
      partner_id: (partnerData?.partnerId as string) || null,
      data: doc,
      created_at: doc.generatedAt,
    }, { onConflict: 'magazine_id' });
    if (error) console.warn('[store] saveMagazine Supabase error:', error.message);
  } catch (err) {
    console.warn('[store] saveMagazine Supabase exception:', err);
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
