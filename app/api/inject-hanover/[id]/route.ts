import { NextRequest } from 'next/server';
import { loadMagazine } from '@/lib/magazine/store';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Pages where user photos/text are injected over the static PNG
const INJECTED_PAGES = new Set([1, 4, 5, 9, 10, 11, 12]);

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Absolutely-positioned user photo box
function photoDiv(top: number, left: number, w: number, h: number, url: string): string {
  if (!url) return '';
  return `<div style="position:absolute;top:${top}px;left:${left}px;width:${w}px;height:${h}px;overflow:hidden;z-index:2">` +
    `<img src="${esc(url)}" style="width:100%;height:100%;object-fit:cover;display:block" loading="eager"/>` +
    `</div>`;
}

// White rectangle to blot out template placeholder content
function whiteRect(top: number, left: number, w: number, h: number): string {
  return `<div style="position:absolute;top:${top}px;left:${left}px;width:${w}px;height:${h}px;background:#fff"></div>`;
}

// ── Per-page overlay builders ──────────────────────────────────────────────

function page1(dest: string, family: string, year: string, p1: string): string {
  // family is already uppercased and may include "THE ... FAMILY" — use as-is
  const subtitle = family
    ? `${esc(family)} &middot; ${esc(dest)}`
    : `YOUR JOURNEY THROUGH ${esc(dest)}`;
  const subtitleSize = subtitle.replace(/&[a-z]+;/g, ' ').length > 40 ? 24 : 30;

  return `
    ${whiteRect(33, 246, 302, 54)}
    <div style="position:absolute;top:33px;left:246px;width:302px;height:54px;z-index:3;
      display:flex;flex-direction:column;align-items:center;justify-content:center">
      <div style="font-family:'Bebas Neue',Impact,sans-serif;font-size:12px;color:#EF321F;
        letter-spacing:3px">${esc(year)} EDITION</div>
      <div style="font-family:'Bebas Neue',Impact,sans-serif;font-size:9px;color:#EF321F;
        letter-spacing:2px;margin-top:1px">ISSUE NO. 01</div>
    </div>

    ${whiteRect(84, 0, 794, 242)}
    <div style="position:absolute;top:84px;left:0;width:794px;height:242px;z-index:3;
      display:flex;align-items:center;justify-content:center;padding:0 18px">
      <div style="font-family:'Bebas Neue',Impact,'Arial Narrow',sans-serif;
        font-size:78px;color:#EF321F;text-align:center;line-height:0.88;
        letter-spacing:0.02em;word-break:break-word;hyphens:auto;max-width:100%">${esc(dest)}</div>
    </div>

    ${photoDiv(326, 17, 760, 512, p1)}

    ${whiteRect(840, 0, 794, 283)}
    <div style="position:absolute;top:840px;left:0;width:794px;height:283px;z-index:3;
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      padding:0 36px;text-align:center">
      <div style="font-family:'Bebas Neue',Impact,sans-serif;font-size:9px;color:#EF321F;
        letter-spacing:4px;margin-bottom:10px">FEATURED ARTICLES:</div>
      <div style="font-family:'Bebas Neue',Impact,'Arial Narrow',sans-serif;
        font-size:${subtitleSize}px;color:#1A1A1A;line-height:1.1;
        letter-spacing:0.03em;text-transform:uppercase">${subtitle}</div>
    </div>`;
}

function page4(dest: string, p1: string): string {
  const titleSize = dest.length > 12 ? 28 : 34;
  return `
    ${whiteRect(216, 8, 192, 220)}
    <div style="position:absolute;top:216px;left:8px;width:192px;height:220px;z-index:3;
      display:flex;align-items:flex-start;padding:2px 4px">
      <div style="font-family:'Bebas Neue',Impact,'Arial Narrow',sans-serif;
        font-size:${titleSize}px;color:#EF321F;line-height:1.05;letter-spacing:0.02em">
        WELCOME TO<br/>${esc(dest)}
      </div>
    </div>
    ${photoDiv(640, 240, 392, 362, p1)}`;
}

function page5(dest: string, p1: string): string {
  return `
    ${whiteRect(0, 0, 470, 302)}
    ${whiteRect(0, 468, 326, 210)}
    <div style="position:absolute;top:0;left:0;width:470px;height:302px;z-index:3;
      display:flex;align-items:flex-start;padding:14px 14px">
      <div style="font-family:'Bebas Neue',Impact,'Arial Narrow',sans-serif;
        font-size:66px;color:#EF321F;line-height:0.92;letter-spacing:0.01em">
        YOUR JOURNEY<br/>THROUGH<br/>${esc(dest)}
      </div>
    </div>
    ${photoDiv(48, 418, 376, 500, p1)}`;
}

function page9(dest: string, family: string, p1: string): string {
  const bio = family
    ? `MEET ${esc(family)}, ADVENTURERS WHO EXPLORED ${esc(dest)}`
    : `EXPLORING THE BEAUTY OF ${esc(dest)}`;
  const bioSize = bio.replace(/&[a-z]+;/g, ' ').length > 45 ? 22 : 27;
  return `
    ${photoDiv(248, 16, 762, 308, p1)}
    ${whiteRect(644, 10, 292, 452)}
    <div style="position:absolute;top:644px;left:10px;width:292px;height:452px;z-index:3;
      padding:2px 4px">
      <div style="font-family:'Bebas Neue',Impact,'Arial Narrow',sans-serif;
        font-size:${bioSize}px;color:#EF321F;line-height:1.1;letter-spacing:0.02em">
        ${bio}
      </div>
    </div>`;
}

function page10(p1: string): string {
  return photoDiv(450, 0, 392, 418, p1);
}

function page11(dest: string, p1: string): string {
  return `
    ${photoDiv(0, 397, 397, 432, p1)}
    ${whiteRect(0, 0, 395, 1123)}
    <div style="position:absolute;top:72px;left:0;width:395px;height:490px;z-index:3;
      display:flex;align-items:flex-start;padding:4px 6px">
      <div style="font-family:'Bebas Neue',Impact,'Arial Narrow',sans-serif;
        font-size:58px;color:#EF321F;line-height:0.9;letter-spacing:0.02em">
        TOP 4<br/>HIGHLIGHTS<br/>OF<br/>${esc(dest)}
      </div>
    </div>`;
}

function page12(p1: string, p2: string, p3: string, p4: string): string {
  return [
    photoDiv(20, 0, 368, 282, p1),
    photoDiv(20, 396, 398, 282, p2),
    photoDiv(547, 0, 368, 228, p3),
    photoDiv(547, 396, 398, 228, p4),
  ].join('\n');
}

function buildOverlays(
  pageNum: number,
  dest: string,
  family: string,
  year: string,
  p1: string,
  p2: string,
  p3: string,
  p4: string,
): string {
  switch (pageNum) {
    case 1:  return page1(dest, family, year, p1);
    case 4:  return page4(dest, p1);
    case 5:  return page5(dest, p1);
    case 9:  return page9(dest, family, p1);
    case 10: return page10(p1);
    case 11: return page11(dest, p1);
    case 12: return page12(p1, p2, p3, p4);
    default: return '';
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const page = req.nextUrl.searchParams.get('page') || '1';
  const pageNum = parseInt(page, 10);

  if (isNaN(pageNum) || pageNum < 1 || pageNum > 19) {
    return new Response('Page out of range', { status: 404 });
  }

  // Non-injected pages: serve the static PNG directly (fast path, no puppeteer needed)
  if (!INJECTED_PAGES.has(pageNum)) {
    const imagePath = path.join(
      process.cwd(),
      'public/templates/hanover-pages',
      `page-${pageNum}.png`,
    );
    if (!fs.existsSync(imagePath)) {
      return new Response('Page not found', { status: 404 });
    }
    const buf = fs.readFileSync(imagePath);
    const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
    return new Response(new Blob([ab], { type: 'image/png' }), {
      headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=3600' },
    });
  }

  // Injected pages: load magazine, return HTML with photo/text overlays
  const doc = await loadMagazine(id);
  if (!doc) return new Response('Magazine not found', { status: 404 });

  const slots = doc.pages[pageNum - 1]?.slots ?? {};
  const dest = (slots.destination || doc.destination || 'YOUR JOURNEY').toUpperCase();
  const family = (slots.familyName || doc.familyName || '').toUpperCase();
  const year = slots.year || String(new Date().getFullYear());
  const p1 = slots.photo1 || '';
  const p2 = slots.photo2 || '';
  const p3 = slots.photo3 || '';
  const p4 = slots.photo4 || '';

  const overlays = buildOverlays(pageNum, dest, family, year, p1, p2, p3, p4);

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:794px;height:1123px;overflow:hidden;background:#fff;margin:0}
  #pg{position:relative;width:794px;height:1123px;overflow:hidden}
  #pg > *{position:absolute}
</style>
</head>
<body>
<div id="pg">
  <img src="/templates/hanover-pages/page-${pageNum}.png" style="top:0;left:0;width:794px;height:1123px;display:block" loading="eager"/>
  ${overlays}
</div>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}
