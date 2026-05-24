import { NextRequest } from 'next/server';
import { loadMagazine } from '@/lib/magazine/store';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// All pages with photo or text injection (rest served as static PNG)
const INJECTED_PAGES = new Set([1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 17, 18, 19]);

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// White blocker at z-index:2, then optional user photo at z-index:3
// Always covers the original template photo regardless of whether a user photo exists
function photoSlot(top: number, left: number, w: number, h: number, url: string): string {
  const blocker = `<div style="position:absolute;top:${top}px;left:${left}px;` +
    `width:${w}px;height:${h}px;background:white;z-index:2"></div>`;
  const photo = url
    ? `<div style="position:absolute;top:${top}px;left:${left}px;` +
      `width:${w}px;height:${h}px;overflow:hidden;z-index:3">` +
      `<img src="${esc(url)}" style="width:100%;height:100%;object-fit:cover;display:block" loading="eager"/></div>`
    : '';
  return blocker + photo;
}

// Plain white rect for text-only cover areas (z-index:2 so user text at z-index:4 sits on top)
function whiteRect(top: number, left: number, w: number, h: number): string {
  return `<div style="position:absolute;top:${top}px;left:${left}px;` +
    `width:${w}px;height:${h}px;background:#fff;z-index:2"></div>`;
}

// ── Per-page overlay builders ─────────────────────────────────────────────
// All coordinates are in 794×1123px render space.
// Derived from user-supplied 595×842 coords × 1.334 (= 794/595).

function page1(dest: string, family: string, year: string, p1: string): string {
  const subtitle = family
    ? `${esc(family)} &middot; ${esc(dest)}`
    : `YOUR JOURNEY THROUGH ${esc(dest)}`;
  const subtitleSize = subtitle.replace(/&[a-z]+;/g, ' ').length > 40 ? 24 : 30;

  return `
    ${whiteRect(13, 200, 394, 73)}
    <div style="position:absolute;top:13px;left:200px;width:394px;height:73px;z-index:4;
      display:flex;flex-direction:column;align-items:center;justify-content:center">
      <div style="font-family:'Bebas Neue',Impact,sans-serif;font-size:12px;color:#EF321F;
        letter-spacing:3px">${esc(year)} EDITION</div>
      <div style="font-family:'Bebas Neue',Impact,sans-serif;font-size:9px;color:#EF321F;
        letter-spacing:2px;margin-top:1px">ISSUE NO. 01</div>
    </div>

    ${whiteRect(73, 0, 794, 147)}
    <div style="position:absolute;top:73px;left:0;width:794px;height:147px;z-index:4;
      display:flex;align-items:center;justify-content:center;padding:0 18px">
      <div style="font-family:'Bebas Neue',Impact,'Arial Narrow',sans-serif;
        font-size:78px;color:#EF321F;text-align:center;line-height:0.88;
        letter-spacing:0.02em;word-break:break-word;hyphens:auto;max-width:100%">${esc(dest)}</div>
    </div>

    ${photoSlot(207, 32, 730, 574, p1)}

    ${whiteRect(828, 0, 794, 295)}
    <div style="position:absolute;top:828px;left:0;width:794px;height:295px;z-index:4;
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      padding:0 36px;text-align:center">
      <div style="font-family:'Bebas Neue',Impact,sans-serif;font-size:9px;color:#EF321F;
        letter-spacing:4px;margin-bottom:10px">FEATURED ARTICLES:</div>
      <div style="font-family:'Bebas Neue',Impact,'Arial Narrow',sans-serif;
        font-size:${subtitleSize}px;color:#1A1A1A;line-height:1.1;
        letter-spacing:0.03em;text-transform:uppercase">${subtitle}</div>
    </div>`;
}

function page2(p1: string): string {
  return photoSlot(560, 0, 794, 374, p1);
}

function page4(dest: string, family: string, p1: string): string {
  const titleSize = dest.length > 12 ? 28 : 34;
  return `
    ${whiteRect(216, 8, 192, 220)}
    <div style="position:absolute;top:216px;left:8px;width:192px;height:220px;z-index:4;
      display:flex;align-items:flex-start;padding:2px 4px">
      <div style="font-family:'Bebas Neue',Impact,'Arial Narrow',sans-serif;
        font-size:${titleSize}px;color:#EF321F;line-height:1.05;letter-spacing:0.02em">
        WELCOME TO<br/>${esc(dest)}
      </div>
    </div>
    ${whiteRect(774, 32, 267, 80)}
    <div style="position:absolute;top:774px;left:32px;width:267px;height:80px;z-index:4;
      display:flex;align-items:center;padding:4px 8px">
      <div style="font-family:'Georgia',serif;font-size:22px;color:#1A1A1A;font-style:italic">
        ${esc(family || dest)}
      </div>
    </div>
    ${photoSlot(747, 347, 447, 320, p1)}`;
}

function page5(dest: string, p1: string): string {
  return `
    ${whiteRect(0, 0, 470, 302)}
    ${whiteRect(0, 468, 326, 210)}
    <div style="position:absolute;top:0;left:0;width:470px;height:302px;z-index:4;
      display:flex;align-items:flex-start;padding:14px 14px">
      <div style="font-family:'Bebas Neue',Impact,'Arial Narrow',sans-serif;
        font-size:66px;color:#EF321F;line-height:0.92;letter-spacing:0.01em">
        YOUR JOURNEY<br/>THROUGH<br/>${esc(dest)}
      </div>
    </div>
    ${photoSlot(207, 400, 360, 360, p1)}`;
}

function page6(p1: string, p2: string): string {
  return `
    ${photoSlot(32, 32, 334, 240, p1)}
    ${photoSlot(322, 427, 334, 240, p2)}`;
}

function page7(p1: string): string {
  return photoSlot(73, 387, 374, 400, p1);
}

function page8(p1: string): string {
  return photoSlot(0, 0, 794, 794, p1);
}

function page9(dest: string, family: string, p1: string): string {
  const bio = family
    ? `MEET ${esc(family)}, ADVENTURERS WHO EXPLORED ${esc(dest)}`
    : `EXPLORING THE BEAUTY OF ${esc(dest)}`;
  const bioSize = bio.replace(/&[a-z]+;/g, ' ').length > 45 ? 22 : 27;
  return `
    ${photoSlot(187, 32, 730, 400, p1)}
    ${whiteRect(644, 10, 292, 479)}
    <div style="position:absolute;top:644px;left:10px;width:292px;height:479px;z-index:4;
      padding:2px 4px">
      <div style="font-family:'Bebas Neue',Impact,'Arial Narrow',sans-serif;
        font-size:${bioSize}px;color:#EF321F;line-height:1.1;letter-spacing:0.02em">
        ${bio}
      </div>
    </div>`;
}

function page10(p1: string): string {
  // Bottom-left camping/scene photo: 1414px coords left=24,top=870,w=680,h=580 × 0.5616
  return photoSlot(489, 14, 382, 326, p1);
}

function page11(dest: string, p1: string): string {
  return `
    ${photoSlot(0, 0, 794, 640, p1)}
    ${whiteRect(640, 0, 794, 483)}
    <div style="position:absolute;top:648px;left:0;width:794px;height:475px;z-index:4;
      display:flex;align-items:flex-start;padding:4px 6px">
      <div style="font-family:'Bebas Neue',Impact,'Arial Narrow',sans-serif;
        font-size:58px;color:#EF321F;line-height:0.9;letter-spacing:0.02em">
        TOP 4<br/>HIGHLIGHTS<br/>OF<br/>${esc(dest)}
      </div>
    </div>`;
}

function page12(p1: string, p2: string, p3: string, p4: string): string {
  // Grid coords from 1414px: g1(24,24,640,480) g2(730,90,640,480) g3(24,530,640,480) g4(730,596,640,480) × 0.5616
  return [
    photoSlot(13, 13, 360, 270, p1),
    photoSlot(51, 410, 360, 270, p2),
    photoSlot(298, 13, 360, 270, p3),
    photoSlot(335, 410, 360, 270, p4),
  ].join('\n');
}

function page13(p1: string): string {
  return photoSlot(0, 0, 794, 560, p1);
}

function page14(p1: string): string {
  return photoSlot(187, 32, 730, 347, p1);
}

function page17(p1: string): string {
  const inner = p1
    ? `<img src="${esc(p1)}" style="width:100%;height:100%;object-fit:cover;display:block" loading="eager"/>`
    : `<div style="width:100%;height:100%;background:linear-gradient(135deg,#f0f0f0,#e0e0e0)"></div>`;
  return `<div style="position:absolute;top:187px;left:253px;width:494px;height:347px;` +
    `background:#f5f5f5;overflow:hidden;z-index:3">${inner}</div>`;
}

function page18(p1: string, p2: string, p3: string, p4: string): string {
  return [
    photoSlot(0, 0, 387, 254, p1),
    photoSlot(43, 407, 354, 220, p2),
    photoSlot(280, 0, 354, 220, p3),
    photoSlot(323, 407, 354, 220, p4),
  ].join('\n');
}

function page19(p1: string): string {
  return photoSlot(147, 32, 730, 387, p1);
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
    case 2:  return page2(p1);
    case 4:  return page4(dest, family, p1);
    case 5:  return page5(dest, p1);
    case 6:  return page6(p1, p2);
    case 7:  return page7(p1);
    case 8:  return page8(p1);
    case 9:  return page9(dest, family, p1);
    case 10: return page10(p1);
    case 11: return page11(dest, p1);
    case 12: return page12(p1, p2, p3, p4);
    case 13: return page13(p1);
    case 14: return page14(p1);
    case 17: return page17(p1);
    case 18: return page18(p1, p2, p3, p4);
    case 19: return page19(p1);
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

  // Non-injected pages: serve the static PNG directly
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
