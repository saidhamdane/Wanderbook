import { NextRequest, NextResponse } from 'next/server';
import { loadMagazine } from '@/lib/magazine/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TEAL = '#00A99D';
const ORANGE = '#F5A623';
const DARK_TEAL = '#007B6E';
const WHITE = '#FFFFFF';

function esc(s: string) {
  return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function truncate(text: string, wordCount: number): string {
  const words = (text||'').split(/\s+/).filter(Boolean);
  if (words.length <= wordCount) return words.join(' ');
  return words.slice(0, wordCount).join(' ');
}

function photoDiv(top:number,left:number,w:number,h:number,url:string,clip?:string) {
  const style = `position:absolute;top:${top}px;left:${left}px;width:${w}px;height:${h}px;overflow:hidden;z-index:2;${clip?'clip-path:'+clip:''}`;
  if (!url) return `<div style="${style};background:#ddd;"></div>`;
  return `<div style="${style}"><img src="${esc(url)}" style="width:100%;height:100%;object-fit:cover;display:block;"/></div>`;
}

function textBox(top:number,left:number,w:number,h:number,bg:string,z=4) {
  return `<div style="position:absolute;top:${top}px;left:${left}px;width:${w}px;height:${h}px;background:${bg};z-index:${z};"></div>`;
}

function text(top:number,left:number,w:number,content:string,style:string,z=5) {
  return `<div style="position:absolute;top:${top}px;left:${left}px;width:${w}px;z-index:${z};${style}">${content}</div>`;
}

function buildPage(pageNum:number, mag:any, photos:string[]): string {
  const dest = esc(mag.destination || 'Destination');
  const destUP = dest.toUpperCase();
  const traveler = esc(mag.familyName || mag.travelers?.split(',')[0]?.trim() || 'Traveler');
  const p = (i:number) => photos[i] || photos[0] || '';
  const slots = mag.pages?.[pageNum-1]?.slots || {};
  const body = esc(truncate(slots.bodyText || `${dest} is a remarkable destination that captures the heart and soul of every traveler who visits this extraordinary place.`, 30));
  const intro = esc(truncate(slots.intro || `A remarkable journey through ${dest} awaits you at every corner of this beautiful destination.`, 15));
  const memories = esc(truncate(slots.memories || `Unforgettable memories made in ${dest} will stay with you forever.`, 10));
  const quote = esc(slots.quoteText || `${dest} — a place that changes you forever.`);
  
  const base = `<div style="position:relative;width:1920px;height:1080px;overflow:hidden;font-family:'Segoe UI','Arial',sans-serif;">
  <img src="/templates/canva-pages/page-${pageNum}.png" style="position:absolute;inset:0;width:100%;height:100%;z-index:1;"/>`;

  if (pageNum === 1) {
    return base +
      photoDiv(0,0,960,1080,p(0)) +
      textBox(265,950,915,460,TEAL) +
      text(285,968,890,destUP,'font-size:120px;font-weight:900;color:white;line-height:0.9;text-transform:uppercase;letter-spacing:-2px;') +
      text(555,975,800,traveler,'font-size:85px;color:'+ORANGE+';font-style:italic;font-weight:700;') +
      `<div style="position:absolute;top:848px;left:1535px;width:240px;height:68px;background:${ORANGE};border-radius:34px;z-index:5;display:flex;align-items:center;justify-content:center;">` +
      `<span style="color:white;font-size:24px;font-weight:700;">Explore Now</span></div>` +
      '</div>';
  }

  if (pageNum === 2) {
    return base +
      photoDiv(0,0,960,1080,p(1)) +
      textBox(130,35,870,600,TEAL) +
      text(150,55,830,`<span style="color:${ORANGE};font-style:italic;font-size:60px;font-weight:700;">Welcome to</span>`,'',5) +
      text(230,55,830,destUP,'font-size:90px;font-weight:900;color:white;line-height:0.9;') +
      text(370,55,830,intro,'font-size:24px;color:rgba(255,255,255,0.9);line-height:1.7;') +
      `<div style="position:absolute;top:650px;left:55px;background:${ORANGE};border-radius:35px;padding:18px 40px;z-index:5;"><span style="color:white;font-size:24px;font-weight:700;">Discover More</span></div>` +
      '</div>';
  }

  if (pageNum === 3) {
    return base +
      photoDiv(0,0,960,1080,p(2)) +
      textBox(130,960,920,600,WHITE) +
      text(140,975,880,`<span style="color:${ORANGE};font-style:italic;font-size:58px;font-weight:700;">About</span>`,'',5) +
      text(215,975,880,destUP,'font-size:85px;font-weight:900;color:'+DARK_TEAL+';line-height:0.9;') +
      text(360,975,880,body,'font-size:22px;color:#333;line-height:1.7;') +
      `<div style="position:absolute;top:690px;left:975px;background:${ORANGE};border-radius:35px;padding:16px 38px;z-index:5;"><span style="color:white;font-size:22px;font-weight:700;">Read More</span></div>` +
      '</div>';
  }

  if (pageNum === 4) {
    const title2 = esc(truncate(slots.destinationIntro || `${dest} special experience awaits`, 4));
    return base +
      textBox(120,30,740,550,TEAL) +
      text(130,50,700,`<span style="color:${ORANGE};font-style:italic;font-size:60px;font-weight:700;">Discover More</span>`,'',5) +
      text(215,50,700,`${destUP}<br/>EXPERIENCE`,'font-size:72px;font-weight:900;color:white;line-height:0.9;',5) +
      text(380,50,700,body,'font-size:21px;color:rgba(255,255,255,0.9);line-height:1.7;',5) +
      `<div style="position:absolute;top:690px;left:50px;color:${ORANGE};font-size:22px;font-weight:700;z-index:5;">Read More...</div>` +
      textBox(793,345,410,165,ORANGE) +
      text(805,365,370,`<span style="font-size:22px;font-weight:800;text-transform:uppercase;letter-spacing:2px;">✈ HOW TO GET THERE</span><br/><span style="font-size:19px;">${esc(truncate(intro,8))}</span>`,'color:white;line-height:1.6;',5) +
      photoDiv(0,960,960,1080,p(3)) +
      '</div>';
  }

  if (pageNum === 5) {
    const stat1 = dest.length + '%';
    const stat2 = (dest.length * 1234).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return base +
      textBox(0,0,660,1080,TEAL) +
      text(170,50,580,`<span style="color:${ORANGE};font-style:italic;font-size:58px;font-weight:700;">About Our</span>`,'',5) +
      text(248,50,580,`POPULAR<br/>${destUP}`,'font-size:80px;font-weight:900;color:white;line-height:0.9;',5) +
      text(465,50,260,`<span style="color:${ORANGE};font-size:48px;font-weight:900;">${stat1}</span><br/><span style="color:white;font-size:22px;">Satisfaction</span>`,'',5) +
      text(465,320,260,`<span style="color:${ORANGE};font-size:48px;font-weight:900;">${stat2}</span><br/><span style="color:white;font-size:22px;">Visitors</span>`,'',5) +
      text(600,50,580,truncate(body,25),'font-size:21px;color:rgba(255,255,255,0.9);line-height:1.7;z-index:5;position:absolute;top:600px;left:50px;width:580px;') +
      `<div style="position:absolute;top:830px;left:50px;background:${ORANGE};border-radius:35px;padding:16px 38px;z-index:5;"><span style="color:white;font-size:22px;font-weight:700;">Read More</span></div>` +
      photoDiv(0,960,960,1080,p(4)) +
      '</div>';
  }

  if (pageNum === 6) {
    return base +
      photoDiv(0,0,600,1080,p(5)) +
      textBox(815,0,1920,265,TEAL) +
      text(820,50,800,`<span style="color:${ORANGE};font-style:italic;font-size:58px;font-weight:700;">Let's Explore</span><br/><span style="font-size:75px;font-weight:900;color:${DARK_TEAL};text-transform:uppercase;">${dest}</span>`,'',5) +
      textBox(65,570,620,680,ORANGE) +
      text(85,585,580,`<span style="font-size:22px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:white;">TRAVEL PLANNER</span>`,'',5) +
      text(135,585,580,esc(truncate(slots.intro || body, 25)),'font-size:20px;color:white;line-height:1.65;',5) +
      text(65,1240,640,esc(truncate(body, 20)),'font-size:22px;color:#333;line-height:1.7;position:absolute;top:65px;left:1240px;width:640px;',5) +
      '</div>';
  }

  if (pageNum === 7) {
    return base +
      photoDiv(0,0,350,1080,p(6)) +
      textBox(65,650,1240,400,WHITE) +
      text(75,665,1200,`<span style="color:${ORANGE};font-style:italic;font-size:58px;font-weight:700;">A Journey To</span>`,'',5) +
      text(155,665,1200,`REMEMBER`,'font-size:88px;font-weight:900;color:'+DARK_TEAL+';text-transform:uppercase;line-height:0.9;',5) +
      text(310,665,1200,body,'font-size:22px;color:#333;line-height:1.7;',5) +
      textBox(600,650,1240,230,ORANGE) +
      text(615,665,1200,`<span style="font-size:20px;color:white;line-height:1.7;">${esc(truncate(intro,18))}</span>`,'',5) +
      '</div>';
  }

  if (pageNum === 8) {
    const activities = ['Best Moments','Around '+dest,'Top Experiences','Hidden Gems'];
    return base +
      textBox(35,235,1450,75,TEAL) +
      text(40,245,1440,`<span style="color:${ORANGE};font-style:italic;font-size:50px;font-weight:700;">Travel Moments</span>`,'',5) +
      text(105,235,1440,`BEST MEMORIES WITH ${destUP}`,'font-size:68px;font-weight:900;color:white;text-transform:uppercase;',5) +
      photoDiv(218,77,300,530,p(0),'circle(50% at 50% 50%)') +
      photoDiv(218,452,300,530,p(1),'circle(50% at 50% 50%)') +
      photoDiv(218,807,300,530,p(2),'circle(50% at 50% 50%)') +
      photoDiv(218,1162,300,530,p(3),'circle(50% at 50% 50%)') +
      activities.map((act,i) => text(795,77+i*375,300,`<span style="color:${ORANGE};font-size:20px;font-weight:800;text-transform:uppercase;">${act}</span><br/><span style="color:white;font-size:18px;">Personal Highlight</span>`,'text-align:center;',5)).join('') +
      '</div>';
  }

  if (pageNum === 9) {
    return base +
      photoDiv(65,30,345,860,p(7)) +
      textBox(65,750,1135,350,WHITE) +
      text(75,765,1105,`<span style="color:${ORANGE};font-style:italic;font-size:58px;font-weight:700;">Plan Your</span>`,'',5) +
      text(155,765,1105,`TRIP TO ${destUP}`,'font-size:80px;font-weight:900;color:'+DARK_TEAL+';text-transform:uppercase;line-height:0.9;',5) +
      text(310,765,1105,body,'font-size:21px;color:#333;line-height:1.7;',5) +
      textBox(580,750,1135,240,ORANGE) +
      text(596,770,1100,
        `<div style="display:flex;align-items:center;gap:15px;margin-bottom:12px;"><span style="font-size:22px;">📍</span><span style="color:white;font-size:21px;">${dest}, Beautiful Destination</span></div>` +
        `<div style="display:flex;align-items:center;gap:15px;"><span style="font-size:22px;">✈️</span><span style="color:white;font-size:21px;">wanderbook.travel • info@wanderbook.com</span></div>`
      ,'',5) +
      '</div>';
  }

  if (pageNum === 10) {
    return base +
      textBox(350,240,1450,100,TEAL) +
      text(355,250,1440,`<span style="color:${ORANGE};font-style:italic;font-size:72px;font-weight:700;">Until Next Time</span>`,'',5) +
      text(465,250,1440,`IN ${destUP}`,'font-size:95px;font-weight:900;color:white;text-transform:uppercase;',5) +
      '</div>';
  }

  return base + '</div>';
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const url = new URL(req.url);
    const pageNum = parseInt(url.searchParams.get('page') || '1');
    
    const magazine = await loadMagazine(id);
    if (!magazine) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    const mag = magazine as any;
    const photos: string[] = [];
    for (let i = 0; i < 10; i++) {
      const slots = mag.pages?.[i]?.slots || {};
      const photo = slots.coverHeroImage || slots.photoMain || slots.photoSecondary || '';
      if (photo && !photos.includes(photo)) photos.push(photo);
    }
    
    const html = buildPage(pageNum, mag, photos);
    return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  } catch(err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
