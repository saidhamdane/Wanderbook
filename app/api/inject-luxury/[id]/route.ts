import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { loadMagazine } from '@/lib/magazine/store';

export const runtime = 'nodejs';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function injectImage(article: string, slotClass: string, url: string): string {
  if (!url) return article;
  const idx = article.indexOf(slotClass);
  if (idx === -1) return article;
  const imgStart = article.lastIndexOf('<img', idx);
  if (imgStart === -1) return article;
  const imgEnd = article.indexOf('>', imgStart) + 1;
  const tag = article.slice(imgStart, imgEnd);
  const newTag = tag.replace(/\bsrc="[^"]*"/, `src="${url}"`);
  return article.slice(0, imgStart) + newTag + article.slice(imgEnd);
}

function injectText(article: string, slotClass: string, text: string): string {
  if (!text) return article;
  const idx = article.indexOf(slotClass);
  if (idx === -1) return article;
  const gtPos = article.indexOf('>', idx);
  if (gtPos === -1) return article;
  const closeStart = article.indexOf('</', gtPos + 1);
  if (closeStart === -1) return article;
  // Scale title font size if text is long
  const isTitleClass =
    slotClass.includes('cover-title') ||
    slotClass.includes('serif-title') ||
    slotClass.includes('dest-title') ||
    slotClass.includes('back-title') ||
    slotClass.includes('collage-title');
  if (isTitleClass && text.length > 8) {
    const base = slotClass.includes('cover-title') ? 78 : slotClass.includes('back-title') ? 34 : 24;
    const fontSize = Math.max(base * 0.45, Math.min(base, base * 10 / text.length)) + 'px';
    return (
      article.slice(0, gtPos) +
      ` style="font-size:${fontSize} !important">` +
      escapeHtml(text) +
      article.slice(closeStart)
    );
  }
  return article.slice(0, gtPos + 1) + escapeHtml(text) + article.slice(closeStart);
}

// Replaces the contents list on the TOC page.
// Looks for imported-slot-contents (with trailing space), replaces inner HTML up to
// the imported-slot-page-number div.
function injectLuxuryContentsList(article: string, items: string[]): string {
  const slotClass = 'imported-slot-contents ';
  const idx = article.indexOf(slotClass);
  if (idx === -1) return article;
  const tagEnd = article.indexOf('>', idx) + 1;
  if (tagEnd === 0) return article;

  const pageNums = ['03', '04', '05', '06', '07', '08'];
  const innerHtml = items
    .map((item, i) =>
      item
        ? `<div style="display:flex;align-items:baseline;gap:10px;padding:9px 0;border-bottom:0.5px solid rgba(11,29,58,0.12)">` +
          `<span style="font-family:'Playfair Display',serif;font-size:12px;font-weight:700;color:#C9A84C;flex-shrink:0;width:22px">${pageNums[i]}</span>` +
          `<strong style="font-size:8px;font-weight:500;color:#0B1D3A;line-height:1.4">${escapeHtml(item)}</strong></div>`
        : ''
    )
    .filter(Boolean)
    .join('');

  const pageNumIdx = article.indexOf('imported-slot-page-number', tagEnd);
  if (pageNumIdx === -1) return article;
  const pageNumDivStart = article.lastIndexOf('<div', pageNumIdx);
  return article.slice(0, tagEnd) + innerHtml + '</div>' + article.slice(pageNumDivStart);
}

function extractArticle(part: string): string {
  const end = part.indexOf('</article>');
  if (end === -1) return part;
  return part.slice(0, end + '</article>'.length);
}

const GOOGLE_FONTS_LINK = `<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin=""/>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=Montserrat:wght@200;300;400;500;600;700&display=swap" rel="stylesheet"/>`;

const LUXURY_CSS = `
.imported-page-frame{display:block;width:794px;height:1123px;overflow:hidden}
.imported-page-canvas{position:relative;width:595px;height:842px;transform:scale(1.334);transform-origin:top left;overflow:hidden}
`;

// Page IDs in order (1-indexed: articlePageIds[0] = page 1)
const articlePageIds = [
  'cover',
  'toc',
  'welcome',
  'destination',
  'photo-grid',
  'memories',
  'highlights',
  'quote',
  'back-cover',
];

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const doc = await loadMagazine(params.id);
  if (!doc) return new NextResponse('Magazine not found', { status: 404 });

  const htmlPath = path.join(process.cwd(), 'public', 'templates', 'luxury-showcase.html');
  let html: string;
  try {
    html = fs.readFileSync(htmlPath, 'utf-8');
  } catch {
    return new NextResponse('Template not found', { status: 500 });
  }

  // Build lookup: pageId → slots
  const pageSlots: Record<string, Record<string, string>> = {};
  for (const page of doc.pages) {
    pageSlots[page.pageId] = page.slots;
  }

  // Split into preamble (parts[0]) + 9 article parts (parts[1..9])
  const parts = html.split(/(?=<article\b)/);

  for (let i = 1; i <= 9; i++) {
    if (!parts[i]) continue;
    const pageId = articlePageIds[i - 1];
    const s = pageSlots[pageId] ?? {};
    let a = parts[i];

    switch (pageId) {
      case 'cover':
        a = injectImage(a, 'imported-slot-cover-photo', s.coverPhoto ?? '');
        a = injectText(a, 'imported-slot-cover-kicker', s.coverKicker ?? '');
        a = injectText(a, 'imported-slot-cover-title', s.coverTitle ?? '');
        a = injectText(a, 'imported-slot-cover-subtitle', s.coverSubtitle ?? '');
        break;

      case 'toc':
        a = injectImage(a, 'imported-slot-toc-photo', s.tocPhoto ?? '');
        a = injectText(a, 'imported-slot-toc-vertical', s.pageTitle ?? '');
        a = injectLuxuryContentsList(a, [
          s.item1 ?? '', s.item2 ?? '', s.item3 ?? '',
          s.item4 ?? '', s.item5 ?? '', s.item6 ?? '',
        ]);
        break;

      case 'welcome':
        a = injectImage(a, 'imported-slot-story-photo', s.widePhoto ?? '');
        a = injectText(a, 'imported-slot-serif-title', s.pageTitle ?? '');
        a = injectText(a, 'imported-slot-body', s.body ?? '');
        break;

      case 'destination':
        a = injectImage(a, 'imported-slot-dest-photo', s.featurePhoto ?? '');
        a = injectText(a, 'imported-slot-dest-title', s.featureTitle ?? '');
        a = injectText(a, 'imported-slot-dest-body', s.body ?? '');
        break;

      case 'photo-grid':
        a = injectImage(a, 'imported-slot-grid-a', s.gridA ?? '');
        a = injectImage(a, 'imported-slot-grid-b', s.gridB ?? '');
        a = injectImage(a, 'imported-slot-grid-c', s.gridC ?? '');
        a = injectImage(a, 'imported-slot-grid-d', s.gridD ?? '');
        a = injectText(a, 'imported-slot-collage-title', s.collageTitle ?? '');
        break;

      case 'memories':
        a = injectImage(a, 'imported-slot-memory-a', s.memoryA ?? '');
        a = injectImage(a, 'imported-slot-memory-b', s.memoryB ?? '');
        a = injectImage(a, 'imported-slot-memory-c', s.memoryC ?? '');
        a = injectText(a, 'imported-slot-serif-title', s.pageTitle ?? '');
        a = injectText(a, 'imported-slot-body', s.body ?? '');
        break;

      case 'highlights':
        a = injectImage(a, 'imported-slot-highlight-photo', s.featurePhoto ?? '');
        a = injectText(a, 'imported-slot-serif-title', s.pageTitle ?? '');
        break;

      case 'quote':
        a = injectImage(a, 'imported-slot-quote-photo', s.featurePhoto ?? '');
        a = injectText(a, 'imported-slot-quote', s.quote ?? '');
        a = injectText(a, 'imported-slot-caption', s.caption ?? '');
        break;

      case 'back-cover':
        a = injectImage(a, 'imported-slot-back-photo', s.coverPhoto ?? '');
        a = injectText(a, 'imported-slot-back-title', s.pageTitle ?? '');
        a = injectText(a, 'imported-slot-back-subtitle', s.body ?? '');
        break;
    }

    parts[i] = a;
  }

  // ?page=N → single self-contained page document
  const pageParam = req.nextUrl.searchParams.get('page');
  if (pageParam !== null) {
    const pageNum = parseInt(pageParam, 10);
    if (pageNum < 1 || pageNum > 9 || !parts[pageNum]) {
      return new NextResponse('Page not found', { status: 404 });
    }
    const articleHtml = extractArticle(parts[pageNum]);
    const singlePage = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=794"/>
${GOOGLE_FONTS_LINK}
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{width:794px;height:1123px;overflow:hidden}
${LUXURY_CSS}
</style>
</head>
<body>
${articleHtml}
</body>
</html>`;
    return new NextResponse(singlePage, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  // No ?page param → full HTML for PDF export
  const injected = parts.join('');
  return new NextResponse(injected, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
