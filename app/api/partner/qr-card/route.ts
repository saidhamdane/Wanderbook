import QRCode from 'qrcode';
import puppeteer from 'puppeteer';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getPartnerBySlug } from '@/lib/db/partners';
import { toPublicPartner } from '@/lib/partner-store';
import { renderPartnerQrCardHtml } from '@/lib/partner-qr-card';
import { publicOriginFromEnvOrHost } from '@/lib/partner-utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedSlug = searchParams.get('slug')?.trim() || '';
  const partnerAccount = requestedSlug ? await getPartnerBySlug(requestedSlug) : null;
  const partner = partnerAccount ? toPublicPartner(partnerAccount) : null;

  if (!partner) {
    return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
  }

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
  const html = renderPartnerQrCardHtml({
    partner,
    clientUrl,
    qrImageSrc,
    width: 1080,
    height: 1600,
  });

  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1600, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const png = await page.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width: 1080, height: 1600 },
    });
    const filename = `wanderbook-${partner.slug}-qr-card.png`;
    const disposition = searchParams.get('disposition') === 'inline' ? 'inline' : 'attachment';

    return new Response(Buffer.from(png), {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `${disposition}; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('QR card PNG generation failed, falling back to HTML', error);
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  } finally {
    await browser?.close();
  }
}
