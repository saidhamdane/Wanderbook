import puppeteer from 'puppeteer';
import { loadMagazine } from '@/lib/magazine/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const BASE = 'http://localhost:3002';

export async function GET(
  _req: Request,
  { params }: { params: { id: string; page: string } },
) {
  const { id, page } = params;
  if (!id || !page) return new Response('Missing id or page', { status: 400 });

  const doc = await loadMagazine(id);
  if (!doc) return new Response('Magazine not found', { status: 404 });

  const pageNum = parseInt(page, 10);
  let url: string;

  if (doc.templateId === 'red-bold') {
    // Page 1 = dedication; pages 2-N = inject-red-bold pages 1-(N-1)
    if (pageNum === 1) {
      url = `${BASE}/api/dedication/${id}`;
    } else {
      url = `${BASE}/api/inject-red-bold/${id}?page=${pageNum - 1}`;
    }
  } else {
    url = `${BASE}/magazine-page/${id}/${pageNum}`;
  }

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
  });

  try {
    const p = await browser.newPage();
    await p.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });
    await p.goto(url, { waitUntil: 'networkidle0', timeout: 20000 });
    const screenshot = await p.screenshot({ type: 'jpeg', quality: 85 });
    const buf = Buffer.from(screenshot);
    const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
    return new Response(new Blob([ab], { type: 'image/jpeg' }), {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } finally {
    await browser.close();
  }
}
