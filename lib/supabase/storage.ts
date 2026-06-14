import { getSupabaseServer } from './server';

export async function uploadPartnerLogo(
  partnerSlug: string,
  fileBuffer: Buffer,
  filename: string,
  mimeType: string
): Promise<string | null> {
  const supabase = getSupabaseServer();
  if (!supabase) return null;
  const filePath = `${partnerSlug}/${filename}`;
  const { error } = await supabase.storage
    .from('partner-logos')
    .upload(filePath, fileBuffer, { contentType: mimeType, upsert: true });
  if (error) {
    console.warn('[storage] uploadPartnerLogo failed:', error.message);
    return null;
  }
  return getPublicUrl('partner-logos', filePath);
}

export async function uploadMagazinePdf(
  magazineId: string,
  pdfBuffer: Buffer
): Promise<string | null> {
  const supabase = getSupabaseServer();
  if (!supabase) return null;
  const filePath = `${magazineId}.pdf`;
  const { error } = await supabase.storage
    .from('magazine-pdfs')
    .upload(filePath, pdfBuffer, { contentType: 'application/pdf', upsert: true });
  if (error) {
    console.warn('[storage] uploadMagazinePdf failed:', error.message);
    return null;
  }
  return getPublicUrl('magazine-pdfs', filePath);
}

export function getPublicUrl(bucket: string, filePath: string): string | null {
  const supabase = getSupabaseServer();
  if (!supabase) return null;
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl ?? null;
}
