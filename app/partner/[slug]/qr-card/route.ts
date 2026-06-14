import QRCode from 'qrcode';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getPublicPartnerBySlug } from '@/lib/partner-store';
import { renderPartnerQrCardHtml } from '@/lib/partner-qr-card';
import { publicOriginFromEnvOrHost } from '@/lib/partner-utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const partner = getPublicPartnerBySlug(params.slug);
  if (!partner) notFound();

  const publicOrigin = publicOriginFromEnvOrHost(headers().get('x-forwarded-host') || headers().get('host') || undefined);
  const clientUrl = `${publicOrigin}/partner/${partner.slug}`;
  const qrImageSrc = await QRCode.toDataURL(clientUrl, {
    type: 'image/png',
    width: 1024,
    margin: 2,
    color: {
      dark: '#050A1A',
      light: '#FFFFFF',
    },
  });

  return new Response(
    renderPartnerQrCardHtml({
      partner,
      clientUrl,
      qrImageSrc,
      includePageChrome: true,
    }),
    {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    }
  );
}
