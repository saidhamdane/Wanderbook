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

  // Hanover: non-injected pages return PNG directly; injected pages use puppeteer on the HTML overlay
  if (doc.templateId === 'hanover') {
    const INJECTED_PAGES = new Set([1, 4, 5, 9, 10, 11, 12]);
    if (!INJECTED_PAGES.has(pageNum)) {
      // Static PNG — skip puppeteer for speed
      const res = await fetch(`${BASE}/api/inject-hanover/${id}?page=${pageNum}`);
      if (!res.ok) return new Response('Page not found', { status: 404 });
      const ab = await res.arrayBuffer();
      return new Response(ab, {
        headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=3600' },
      });
    }
    // Injected page falls through to puppeteer below
  }

  let url: string;

  if (doc.templateId === 'hanover') {
    url = `${BASE}/api/inject-hanover/${id}?page=${pageNum}`;
  } else if (doc.templateId === 'red-bold') {
    // Page 1 = dedication; pages 2-N = inject-red-bold pages 1-(N-1)
    if (pageNum === 1) {
      url = `${BASE}/api/dedication/${id}`;
    } else {
      url = `${BASE}/api/inject-red-bold/${id}?page=${pageNum - 1}`;
    }
  } else if (doc.templateId === 'wanderbook-luxury') {
    url = `${BASE}/api/inject-luxury/${id}?page=${pageNum}`;
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
