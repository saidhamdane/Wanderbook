import QRCode from 'qrcode';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getPartnerBySlug } from '@/lib/db/partners';
import { publicOriginFromEnvOrHost } from '@/lib/partner-utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedSlug = searchParams.get('slug')?.trim() || '';
  const partner = requestedSlug ? await getPartnerBySlug(requestedSlug) : null;

  if (!partner) {
    return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
  }

  const publicOrigin = publicOriginFromEnvOrHost(headers().get('x-forwarded-host') || headers().get('host') || undefined);
  const clientUrl = `${publicOrigin}/partner/${partner.slug}`;
  const pngBuffer = await QRCode.toBuffer(clientUrl, {
    type: 'png',
    width: 1024,
    margin: 2,
    color: {
      dark: '#050A1A',
      light: '#FFFFFF',
    },
  });
  const filename = `wanderbook-${partner.slug}-qr.png`;
  const disposition = searchParams.get('disposition') === 'inline' ? 'inline' : 'attachment';

  return new Response(new Uint8Array(pngBuffer), {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': `${disposition}; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
