import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { loadMagazine } from '@/lib/magazine/store';
import { cleanupSession } from '@/lib/upload-handler';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const CLEANUP_DELAY_MS = 5 * 60 * 1000;

export async function POST(req: NextRequest) {
  let magazineId = '';
  try {
    const body = await req.json();
    magazineId = String(body?.magazineId || '');
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!magazineId) {
    return NextResponse.json({ error: 'magazineId is required' }, { status: 400 });
  }

  const doc = await loadMagazine(magazineId);
  if (!doc) {
    return NextResponse.json({ error: 'Magazine not found' }, { status: 404 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const previewUrl = appUrl + '/preview/' + magazineId + '?print=true';

  let browser;
  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
    await page.goto(previewUrl, { waitUntil: 'networkidle0', timeout: 30000 });

    const pdf = await page.pdf({
      width: '794px',
      height: '1123px',
      printBackground: true,
      preferCSSPageSize: false
    });

    await browser.close();

    const filename =
      'wanderbook-' +
      doc.destination.toLowerCase().replace(/[^a-z0-9]+/g, '-') +
      '.pdf';

    if (doc.sessionId) {
      const sid = doc.sessionId;
      setTimeout(() => {
        cleanupSession(sid).catch(() => undefined);
      }, CLEANUP_DELAY_MS).unref?.();
    }

    return new Response(Buffer.from(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="' + filename + '"'
      }
    });
  } catch (err: unknown) {
    if (browser) {
      try {
        await browser.close();
      } catch {}
    }
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'PDF generation failed', detail: message }, { status: 500 });
  }
}
