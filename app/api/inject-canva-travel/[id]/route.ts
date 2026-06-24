import { NextRequest, NextResponse } from 'next/server';
import { loadMagazine } from '@/lib/magazine/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Canvas: 1920×1080 landscape
const CW = 1920, CH = 1080;
const TEAL   = '#009999';
const DARK   = '#1a1a2e';
const RED    = '#e94560';
const WHITE  = '#ffffff';
const CREAM  = '#f5f5f0';
const TEAL2  = '#007878';

function esc(s: string): string {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// PNG background fills exactly 1920×1080
function pngBg(n: number): string {
  return `<img src="/templates/canva-pages/page-${n}.png" style="position:absolute;top:0;left:0;width:${CW}px;height:${CH}px;z-index:1;display:block"/>`;
}

// Solid colour blocker
function blk(t:number,l:number,w:number,h:number,bg:string,z=2): string {
  return `<div style="position:absolute;top:${t}px;left:${l}px;width:${w}px;height:${h}px;background:${bg};z-index:${z}"></div>`;
}

// User photo slot — white blocker underneath, then photo on top
function photo(t:number,l:number,w:number,h:number,url:string,z=3): string {
  const base = blk(t,l,w,h,'#888888',z);
  if (!url) return base;
  return base + `<div style="position:absolute;top:${t}px;left:${l}px;width:${w}px;height:${h}px;overflow:hidden;z-index:${z}"><img src="${esc(url)}" style="width:100%;height:100%;object-fit:cover;display:block" loading="eager"/></div>`;
}

// Injected text container
function txt(t:number,l:number,w:number,html:string,z=4): string {
  return `<div style="position:absolute;top:${t}px;left:${l}px;width:${w}px;z-index:${z}">${html}</div>`;
}

function mono(size:number,weight:number,color:string,spacing:string,content:string): string {
  return `<div style="font-family:'Montserrat',system-ui,sans-serif;font-size:${size}px;font-weight:${weight};color:${color};letter-spacing:${spacing};line-height:1.1">${content}</div>`;
}

// ── Page 1 ── Cover
// Layout: photo left 960px, teal content right 960px
function page1(dest:string, family:string, year:string, p1:string): string {
  const name = family ? esc(family) : 'Your Journey';
  return `
    ${pngBg(1)}
    ${blk(0,960,960,CH,TEAL)}
    ${photo(0,0,960,CH,p1)}
    ${blk(0,960,960,120,DARK,4)}
    ${txt(18,975,900,mono(11,900,RED,'5px','WANDERBOOK · PERSONAL TRAVEL MAGAZINE'),5)}
    ${blk(140,960,960,4,RED,4)}
    ${blk(150,960,960,CH-150,TEAL2+'dd',4)}
    ${txt(180,975,900,`
      ${mono(11,700,RED,'5px','✈ PERSONAL EDITION '+esc(year))}
      <div style="height:20px"></div>
      ${mono(130,900,'#ffffff','-2px',esc(dest.toUpperCase()))}
      <div style="width:60px;height:5px;background:${RED};margin:24px 0"></div>
      ${mono(28,400,'rgba(255,255,255,0.8)','1px',name)}
    `,5)}
    ${blk(CH-80,960,960,80,DARK,4)}
    ${txt(CH-68,975,900,mono(10,500,'rgba(255,255,255,0.5)','3px','wanderbook.travel'),5)}
  `;
}

// ── Page 2 ── Contents
// Layout: photo left 960px, white right 960px
function page2(dest:string, p1:string): string {
  const items = [
    ['01','Cover','Your Journey Begins'],
    ['02','Welcome',`${esc(dest)} Unveiled`],
    ['03','Destination','Discover & Explore'],
    ['04','Gallery','Through the Lens'],
    ['05','Memories','Stories & Moments'],
    ['06','Quote','Words to Travel By'],
    ['07','Back Cover','Until Next Time'],
  ];
  return `
    ${pngBg(2)}
    ${blk(0,960,960,CH,WHITE)}
    ${photo(0,0,960,CH,p1)}
    ${blk(0,960,960,180,DARK,4)}
    ${txt(18,980,900,mono(11,700,RED,'5px','IN THIS ISSUE'),5)}
    ${txt(65,980,900,mono(60,900,WHITE,'0','CONTENTS'),5)}
    ${blk(184,960,960,3,RED,4)}
    ${txt(204,980,880,
      items.map(([n,ti,su])=>`
        <div style="display:flex;align-items:flex-start;gap:22px;padding:18px 0;border-bottom:1px solid #e0e0e0">
          <span style="font-family:'Montserrat',sans-serif;font-size:34px;font-weight:900;color:${RED};min-width:50px;line-height:1">${n}</span>
          <div>
            <div style="font-family:'Montserrat',sans-serif;font-size:15px;font-weight:800;color:${DARK};letter-spacing:1px">${ti}</div>
            <div style="font-family:'Montserrat',sans-serif;font-size:12px;color:#888;margin-top:4px">${su}</div>
          </div>
        </div>
      `).join('')
    ,5)}
  `;
}

// ── Page 3 ── Welcome
// Layout: white content left 960px, photo right 960px
function page3(dest:string, travelers:string, copy:string, p1:string): string {
  return `
    ${pngBg(3)}
    ${blk(0,0,960,CH,WHITE)}
    ${photo(0,960,960,CH,p1)}
    ${blk(0,0,6,CH,RED,4)}
    ${txt(80,40,860,`
      ${mono(11,700,RED,'5px','DEAR TRAVELER')}
      <div style="height:24px"></div>
      ${mono(70,900,DARK,'0','WELCOME<br>TO<br>'+esc(dest.toUpperCase()))}
      <div style="width:50px;height:5px;background:${RED};margin:28px 0"></div>
      ${mono(14,400,'#444','0.3px',esc(copy || 'Every journey begins with a single step. This magazine captures the heart of your adventure.'))}
      ${travelers ? `<div style="margin-top:28px">${mono(11,700,DARK,'2px','WITH LOVE FROM — '+esc(travelers.toUpperCase()))}</div>` : ''}
    `,5)}
    ${blk(CH-200,0,960,200,DARK,4)}
    ${txt(CH-175,40,880,
      mono(14,400,'rgba(255,255,255,0.8)','0','"Travel is the only thing you buy that makes you richer."'),5)}
  `;
}

// ── Page 4 ── Destination
// Layout: 2 photos top (each 960×490), content panel bottom
// Blocker covers gold/stats zone (y 490-760) and bottom text
function page4(dest:string, copy:string, p1:string, p2:string): string {
  const photoH = 490;
  const contentY = photoH;
  const contentH = CH - contentY;
  return `
    ${pngBg(4)}
    ${blk(photoH, 0, CW, contentH, WHITE)}
    ${blk(photoH, 0, CW, contentH, DARK, 3)}
    ${photo(0, 0, 960, photoH, p1)}
    ${photo(0, 960, 960, photoH, p2)}
    ${blk(photoH, 0, CW, 6, RED, 4)}
    ${txt(contentY+30, 60, CW-120, `
      ${mono(11,700,RED,'5px','DESTINATION SPOTLIGHT')}
      <div style="height:16px"></div>
      ${mono(100,900,WHITE,'-1px',esc(dest.toUpperCase()))}
      <div style="width:60px;height:5px;background:${RED};margin:20px 0"></div>
      ${mono(18,400,'rgba(255,255,255,0.85)','0.3px',esc(copy || 'A destination that captured our hearts.'))}
    `,5)}
  `;
}

// ── Page 5 ── Gallery
// Layout: title bar top, 4-photo grid below, footer bar
function page5(p1:string, p2:string, p3:string, p4:string): string {
  const gapY = 90, barH = 80, gridH = CH - gapY - barH;
  const halfW = CW/2 - 4, halfH = gridH/2 - 4;
  return `
    ${pngBg(5)}
    ${blk(0, 0, CW, CH, DARK)}
    ${blk(0, 0, CW, gapY, RED, 4)}
    ${txt(0, 0, CW,
      `<div style="height:${gapY}px;display:flex;align-items:center;justify-content:center">
        <span style="font-family:'Montserrat',sans-serif;font-size:13px;font-weight:900;color:#fff;letter-spacing:8px">PHOTO GALLERY</span>
      </div>`,5)}
    ${photo(gapY+4, 4, halfW, halfH, p1)}
    ${photo(gapY+4, CW/2+4, halfW, halfH, p2)}
    ${photo(gapY+halfH+8, 4, halfW, halfH, p3)}
    ${photo(gapY+halfH+8, CW/2+4, halfW, halfH, p4)}
    ${blk(CH-barH, 0, CW, barH, RED, 4)}
    ${txt(CH-barH, 0, CW,
      `<div style="height:${barH}px;display:flex;align-items:center;justify-content:center">
        <span style="font-family:'Montserrat',sans-serif;font-size:11px;color:#fff;letter-spacing:5px;opacity:0.8">WANDERBOOK · PERSONAL TRAVEL MAGAZINE</span>
      </div>`,5)}
  `;
}

// ── Page 6 ── Memories
// Layout: photo left 960px, white right with story text
function page6(dest:string, copy:string, p1:string): string {
  return `
    ${pngBg(6)}
    ${blk(0, 960, 960, CH, WHITE)}
    ${photo(0, 0, 960, CH, p1)}
    <div style="position:absolute;top:0;left:0;width:960px;height:${CH}px;z-index:4;background:linear-gradient(to right,transparent 70%,rgba(0,0,0,0.5) 100%)"></div>
    ${blk(0, 960, 6, CH, RED, 4)}
    ${txt(80, 975, 880, `
      ${mono(11,700,RED,'5px','MEMORIES')}
      <div style="height:16px"></div>
      ${mono(80,900,DARK,'0',esc(dest.toUpperCase()))}
      <div style="width:50px;height:5px;background:${RED};margin:24px 0"></div>
      ${mono(11,700,RED,'5px','STORIES & MOMENTS')}
      <div style="height:16px"></div>
      ${mono(16,400,'#333','0.3px',esc(copy || 'Every corner of this journey held a new story. These are the moments we will carry forever.'))}
    `,5)}
  `;
}

// ── Page 7 ── Quote
// Full dark page, centred quote
function page7(dest:string, quote:string): string {
  const q = quote || `${dest} — a place that changes you forever.`;
  return `
    ${pngBg(7)}
    ${blk(0, 0, CW, CH, DARK+'ee', 2)}
    <div style="position:absolute;top:0;left:0;width:${CW}px;height:${CH}px;z-index:4;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:120px">
      <div style="font-family:'Montserrat',sans-serif;font-size:200px;color:${RED};line-height:0.4;margin-bottom:40px;opacity:0.4">"</div>
      ${mono(34,800,WHITE,'0.5px',esc(q))}
      <div style="width:80px;height:5px;background:${RED};margin:40px auto"></div>
      ${mono(12,700,RED,'5px','— '+esc(dest.toUpperCase()))}
    </div>
    ${blk(0,0,8,CH,RED,5)}
    ${blk(0,CW-8,8,CH,RED,5)}
  `;
}

// ── Page 8 ── Back Cover
// Teal PNG bg, central user photo, "UNTIL NEXT TIME" overlay
function page8(dest:string, year:string, p1:string): string {
  return `
    ${pngBg(8)}
    ${blk(0, 0, CW, CH, DARK+'99', 2)}
    ${photo(160, 360, 1200, 760, p1)}
    <div style="position:absolute;top:0;left:0;width:${CW}px;height:${CH}px;z-index:5;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:50px 80px">
      ${mono(12,900,RED,'5px','WANDERBOOK')}
      <div style="text-align:center">
        ${mono(14,700,RED,'5px','UNTIL NEXT TIME')}
        <div style="height:20px"></div>
        ${mono(110,900,WHITE,'-2px',esc(dest.toUpperCase()))}
        <div style="width:60px;height:5px;background:${RED};margin:24px auto"></div>
        ${mono(14,400,'rgba(255,255,255,0.6)','3px',esc(year)+' EDITION')}
      </div>
      ${mono(10,400,'rgba(255,255,255,0.35)','3px','PERSONAL TRAVEL MAGAZINE · POWERED BY WANDERBOOK')}
    </div>
  `;
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const url = new URL(req.url);
    const pageNum = parseInt(url.searchParams.get('page') || '1');

    if (pageNum < 1 || pageNum > 8) {
      return new NextResponse('Page not found', { status: 404 });
    }

    const magazine = await loadMagazine(id);
    if (!magazine) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const mag = magazine as any;
    const dest   = mag.destination || 'Destination';
    const travelers = mag.travelers || mag.familyName || '';
    const family = mag.familyName || (travelers ? String(travelers).split(',')[0]?.trim() : '') || '';
    const year   = String(new Date(mag.createdAt ?? mag.generatedAt ?? Date.now()).getFullYear());

    // Collect unique user photos from all page slots in order
    const allPhotos: string[] = [];
    for (const page of (mag.pages || [])) {
      const slots = page?.slots || {};
      for (const key of ['coverHeroImage', 'photoMain', 'photoSecondary', 'photoAccent'] as const) {
        const u = slots[key];
        if (u && !allPhotos.includes(u)) allPhotos.push(u);
      }
    }
    const getPhoto = (idx: number) => allPhotos[idx] || allPhotos[0] || '';

    const pageSlots = mag.pages?.[pageNum - 1]?.slots || {};
    const copy  = pageSlots.bodyText || pageSlots.intro || '';
    const quote = mag.pages?.[6]?.slots?.quoteText || `${dest} — a place that changes you forever.`;

    let body = '';
    switch (pageNum) {
      case 1: body = page1(dest, family, year, getPhoto(0)); break;
      case 2: body = page2(dest, getPhoto(1)); break;
      case 3: body = page3(dest, travelers, copy, getPhoto(2)); break;
      case 4: body = page4(dest, copy, getPhoto(3), getPhoto(4)); break;
      case 5: body = page5(getPhoto(5), getPhoto(6), getPhoto(7), getPhoto(0)); break;
      case 6: body = page6(dest, copy, getPhoto(1)); break;
      case 7: body = page7(dest, quote); break;
      case 8: body = page8(dest, year, getPhoto(2)); break;
    }

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>*{box-sizing:border-box}html,body{margin:0;padding:0;width:${CW}px;height:${CH}px;overflow:hidden;background:#000}</style>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400&display=swap" rel="stylesheet">
</head><body>
<div style="position:relative;width:${CW}px;height:${CH}px;overflow:hidden">${body}</div>
</body></html>`;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
