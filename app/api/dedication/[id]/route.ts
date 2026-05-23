import { loadMagazine } from '@/lib/magazine/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const doc = await loadMagazine(params.id);
  if (!doc) return new Response('Not found', { status: 404 });

  const family = doc.familyName
    ? doc.familyName.toUpperCase().replace(/\bFAMILY\b/i, '').trim()
    : '';
  const familyLine = family
    ? `THE ${family} FAMILY`
    : 'OUR FAMILY';
  const dest   = doc.destination.toUpperCase();
  const year   = new Date(doc.generatedAt).getFullYear();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin=""/>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Montserrat:wght@300;400;600&display=swap" rel="stylesheet"/>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:794px;height:1123px;overflow:hidden;background:#fff}
body{
  display:flex;align-items:center;justify-content:center;
  font-family:'Playfair Display',Georgia,serif;
}
.wrap{text-align:center;padding:80px 100px;width:100%}
.pre{font-family:'Montserrat',sans-serif;font-size:11px;letter-spacing:5px;color:#888;text-transform:uppercase;font-weight:400}
.rule{height:1px;background:#c9a227;width:60px;margin:28px auto}
.rule-wide{height:1px;background:#c9a227;width:100%;max-width:320px;margin:0 auto}
.family{font-size:46px;font-weight:900;color:#1a1a1a;letter-spacing:3px;text-transform:uppercase;line-height:1;margin:22px 0}
.dest{font-family:'Montserrat',sans-serif;font-size:11px;letter-spacing:6px;color:#777;text-transform:uppercase;margin-top:28px}
.tagline{margin-top:56px;font-size:20px;font-style:italic;color:#333;line-height:1.8}
.tagline span{display:block}
.footer{margin-top:64px;font-family:'Montserrat',sans-serif;font-size:9px;letter-spacing:4px;color:#bbb;text-transform:uppercase}
</style>
</head>
<body>
<div class="wrap">
  <div class="pre">This magazine was created exclusively for</div>
  <div class="rule"></div>
  <div class="rule-wide"></div>
  <div class="family">${familyLine}</div>
  <div class="rule-wide"></div>
  <div class="rule"></div>
  <div class="dest">${dest} · ${year}</div>
  <div class="tagline">
    <span>Every photo. Every memory. Every moment.</span>
    <span>Yours forever.</span>
  </div>
  <div class="footer">Made with Wanderbook</div>
</div>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
