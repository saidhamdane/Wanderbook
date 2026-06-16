import fs from 'fs/promises';
import path from 'path';
import { getSupabaseServer } from './server';

const BUCKET_MISSING_CODES = new Set(['NoSuchBucket', 'Bucket not found', '404']);

function isBucketMissingError(err: { message?: string; statusCode?: number | string } | null): boolean {
  if (!err) return false;
  const msg = err.message ?? '';
  return (
    msg.includes('Bucket not found') ||
    msg.includes('NoSuchBucket') ||
    String(err.statusCode) === '404'
  );
}

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

  if (!error) return getPublicUrl('partner-logos', filePath);

  if (isBucketMissingError(error as { message?: string })) {
    console.warn('[storage] Supabase bucket missing, using local upload fallback.');
    return null;
  }

  console.warn('[storage] uploadPartnerLogo failed:', error.message);
  return null;
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

  if (!error) return getPublicUrl('magazine-pdfs', filePath);

  if (isBucketMissingError(error as { message?: string })) {
    console.warn('[storage] Supabase bucket missing, using local upload fallback.');
    return null;
  }

  console.warn('[storage] uploadMagazinePdf failed:', error.message);
  return null;
}

export function getPublicUrl(bucket: string, filePath: string): string | null {
  const supabase = getSupabaseServer();
  if (!supabase) return null;
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl ?? null;
}

// Writes to public/uploads/partners/<safeId>/<filename> and returns the local URL.
export async function savePartnerLogoLocally(
  safePartnerId: string,
  filename: string,
  buffer: Buffer
): Promise<string> {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'partners', safePartnerId);
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, filename), buffer);
  return `/uploads/partners/${safePartnerId}/${filename}`;
}
