import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';
import { PARTNER_SESSION_COOKIE, getPartnerIdForSession, getPartnerAccountById, toPublicPartner, updatePartnerAccount } from '@/lib/partner-store';
import { upsertPartner } from '@/lib/db/partners';
import { uploadPartnerLogo } from '@/lib/supabase/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
};

export async function POST(req: Request) {
  const partnerId = getPartnerIdForSession(cookies().get(PARTNER_SESSION_COOKIE)?.value);
  if (!partnerId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const partner = getPartnerAccountById(partnerId);
  if (!partner) return NextResponse.json({ error: 'Partner not found' }, { status: 404 });

  const form = await req.formData();
  const entry = form.get('logo');
  if (!(entry instanceof File)) {
    return NextResponse.json({ error: 'Logo image is required.' }, { status: 400 });
  }

  const ext = ALLOWED_TYPES[entry.type];
  if (!ext) {
    return NextResponse.json({ error: 'Only PNG, JPG, JPEG and WEBP files are allowed.' }, { status: 400 });
  }
  if (entry.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'Logo image must be 5MB or smaller.' }, { status: 400 });
  }

  const safePartnerId = partnerId.replace(/[^a-zA-Z0-9_-]/g, '');
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'partners', safePartnerId);
  await fs.mkdir(uploadDir, { recursive: true });

  const filename = `logo-${Date.now()}.${ext}`;
  const filePath = path.join(uploadDir, filename);
  const resolvedBase = path.resolve(uploadDir);
  const resolvedFile = path.resolve(filePath);
  if (!resolvedFile.startsWith(resolvedBase + path.sep)) {
    return NextResponse.json({ error: 'Invalid upload path.' }, { status: 400 });
  }

  const buffer = Buffer.from(await entry.arrayBuffer());
  await fs.writeFile(resolvedFile, buffer);

  let logoUrl = `/uploads/partners/${safePartnerId}/${filename}`;

  // Try Supabase Storage first; fall back to local public path
  const supabaseLogoUrl = await uploadPartnerLogo(partner.slug, buffer, filename, entry.type);
  if (supabaseLogoUrl) logoUrl = supabaseLogoUrl;

  const updated = updatePartnerAccount(partnerId, {
    businessName: partner.businessName,
    businessType: partner.businessType,
    mainIsland: partner.mainIsland,
    whatsapp: partner.whatsapp,
    website: partner.website,
    logoUrl,
    brandingNote: partner.brandingNote,
  });

  if (updated) {
    upsertPartner(updated).catch((err) =>
      console.warn('[upload-logo] Supabase sync failed (non-fatal):', err)
    );
  }

  return NextResponse.json({
    ok: true,
    logoUrl,
    partner: updated ? { ...toPublicPartner(updated), plan: updated.plan } : undefined,
  });
}
