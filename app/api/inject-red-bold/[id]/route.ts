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
  if (slotClass.includes('cover-title')) {
    const len = text.length;
    const fontSize = len > 10 ? Math.max(28, 520 / len) + 'px' : '4rem';
    return article.slice(0, gtPos) + ` style="font-size:${fontSize} !important">` + escapeHtml(text) + article.slice(closeStart);
  }
  const isTitle = slotClass.includes('title') ||
                  slotClass.includes('essay') ||
                  slotClass.includes('feature') ||
                  slotClass.includes('story');
  if (isTitle && text.length > 8) {
    const fontSize = Math.max(24, 380 / text.length) + 'px';
    return article.slice(0, gtPos) + ` style="font-size:${fontSize} !important">` + escapeHtml(text) + article.slice(closeStart);
  }
  return article.slice(0, gtPos + 1) + escapeHtml(text) + article.slice(closeStart);
}

function injectContentsList(article: string, items: string[]): string {
  // trailing space distinguishes the list from imported-slot-contents-photo
  const slotClass = 'imported-slot-contents ';
  const idx = article.indexOf(slotClass);
  if (idx === -1) return article;
  const tagEnd = article.indexOf('>', idx) + 1;
  if (tagEnd === 0) return article;

  const pageNums = ['04', '06', '08', '10', '12', '14'];
  const innerHtml = items
    .map((item, i) =>
      item
        ? `<div><span>${pageNums[i]}</span><strong>${escapeHtml(item)}</strong></div>`
        : ''
    )
    .filter(Boolean)
    .join('');

  const pageNumIdx = article.indexOf('imported-slot-page-number', tagEnd);
  if (pageNumIdx === -1) return article;
  const pageNumDivStart = article.lastIndexOf('<div', pageNumIdx);
  return article.slice(0, tagEnd) + innerHtml + '</div>' + article.slice(pageNumDivStart);
}

// Extract just the <article>…</article> from a split part (strips showcase UI after it)
function extractArticle(part: string): string {
  const end = part.indexOf('</article>');
  if (end === -1) return part;
  return part.slice(0, end + '</article>'.length);
}

// Magazine layout CSS for the imported-* class system.
// These classes were part of a previous build and are no longer in any source file.
// Canvas coordinates are in 595×842px space (A4 at 72dpi); we scale to 794×1123 to fill the iframe.
const GOOGLE_FONTS_LINK = `<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin=""/>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet"/>`;

const MAGAZINE_CSS = `
/* ── Page frame & canvas ──────────────────────────────────────────────── */
.imported-page-frame {
  width: 794px;
  height: 1123px;
  overflow: hidden;
  display: block;
}
.imported-page-canvas {
  position: relative;
  width: 595px;
  height: 842px;
  transform: scale(1.334);
  transform-origin: top left;
  overflow: hidden;
  background: #fffaf6;
}
.imported-page-generated-base {
  position: absolute;
  inset: 0;
  background: #fffaf6;
}

/* ── Overlays ─────────────────────────────────────────────────────────── */
.imported-overlay {
  position: absolute;
  overflow: hidden;
}
img.imported-overlay,
.imported-overlay img {
  object-fit: cover;
  display: block;
}

/* ── Text base ─────────────────────────────────────────────────────────── */
.imported-text {
  overflow: hidden;
  font-family: 'Source Sans 3', 'Helvetica Neue', Arial, sans-serif;
  font-size: 10px;
  line-height: 1.35;
  color: #2a1f1a;
}
.imported-fitted-text {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: var(--imported-line-clamp, 1);
}
.imported-text-dark { color: #2a1f1a; }

/* ── Kicker / label ──────────────────────────────────────────────────── */
.imported-slot-cover-kicker,
.imported-slot-red-label,
.imported-slot-red-label.imported-label-light {
  font-family: 'Source Sans 3', 'Helvetica Neue', Arial, sans-serif;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #ef321f;
}
.imported-slot-red-label.imported-label-light {
  color: #fff;
}

/* ── Cover title ──────────────────────────────────────────────────────── */
.imported-slot-cover-title,
[class*="imported-slot-cover-title"] {
  font-size: clamp(1.8rem, 5.5vw, 4rem) !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  max-width: 100% !important;
  display: block !important;
}
.imported-slot-cover-title-red { color: #ef321f; }

/* ── Cover subtitle & deck ────────────────────────────────────────────── */
.imported-slot-cover-subtitle,
.imported-slot-cover-subtitle-red,
.imported-slot-deck {
  font-family: 'Source Sans 3', 'Helvetica Neue', Arial, sans-serif;
  font-size: 9.5px;
  line-height: 1.45;
  color: #4a3a30;
}

/* ── Serif title (articles) ──────────────────────────────────────────── */
.imported-slot-serif-title {
  font-family: 'Playfair Display', 'Times New Roman', Georgia, serif;
  font-size: clamp(1.5rem, 6vw, 3.5rem);
  font-weight: 700;
  line-height: 1.0;
  color: #2a1f1a;
  overflow: visible;
  white-space: normal;
}
.imported-title-overlap { color: #2a1f1a; }
.imported-title-on-red  { color: #fff; }

/* ── Body copy ────────────────────────────────────────────────────────── */
.imported-slot-body {
  font-family: 'Source Sans 3', 'Helvetica Neue', Arial, sans-serif;
  font-size: 8.5px;
  line-height: 1.5;
  color: #2a1f1a;
}
.imported-slot-body-columns {
  column-count: 2;
  column-gap: 14px;
}
.imported-body-on-red { color: #fff; }

/* ── Captions ─────────────────────────────────────────────────────────── */
.imported-caption-red {
  font-family: 'Source Sans 3', 'Helvetica Neue', Arial, sans-serif;
  font-size: 7.5px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #ef321f;
  line-height: 1.3;
}
.imported-caption-red.imported-label-light { color: #fff; }

/* ── Page number ──────────────────────────────────────────────────────── */
.imported-slot-page-number {
  font-family: 'Source Sans 3', 'Helvetica Neue', Arial, sans-serif;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 2px;
  color: #ef321f;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Contents page ────────────────────────────────────────────────────── */
.imported-slot-red-display,
.imported-slot-vertical-word {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
  font-family: 'Playfair Display', 'Times New Roman', Georgia, serif;
  font-size: 38px;
  font-weight: 900;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.imported-contents-list {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.imported-contents-list div {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 5px 0;
  border-bottom: 1px solid rgba(239,50,31,0.25);
}
.imported-contents-list span {
  font-family: 'Playfair Display', serif;
  font-size: 11px;
  font-weight: 700;
  color: #ef321f;
  flex-shrink: 0;
  width: 18px;
}
.imported-contents-list strong {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 8.5px;
  font-weight: 600;
  color: #2a1f1a;
  line-height: 1.2;
}
.imported-red-contents div { border-color: rgba(239,50,31,0.3); }

/* ── Back-cover specific ──────────────────────────────────────────────── */
.imported-slot-back-title {
  font-family: 'Playfair Display', 'Times New Roman', Georgia, serif;
  font-size: 40px;
  font-weight: 900;
  line-height: 1.0;
  color: #2a1f1a;
}

/* ── Quote spread ─────────────────────────────────────────────────────── */
.imported-slot-quote,
.imported-quote-on-red {
  font-family: 'Playfair Display', 'Times New Roman', Georgia, serif;
  font-style: italic;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.35;
  color: #fff;
}
`;

function readInlineCss(): string {
  return MAGAZINE_CSS;
}

const articlePageIds = [
  'cover',
  'contents',
  'story',
  'feature',
  'essay',
  'gallery',
  'quote',
  'back-cover'
];

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const doc = await loadMagazine(params.id);
  if (!doc) {
    return new NextResponse('Magazine not found', { status: 404 });
  }

  const htmlPath = path.join(process.cwd(), 'public', 'templates', 'red-bold-showcase.html');
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

  // Split into preamble (parts[0]) + 8 article parts (parts[1..8])
  const parts = html.split(/(?=<article\b)/);

  for (let i = 1; i <= 8; i++) {
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
      case 'contents':
        a = injectImage(a, 'imported-slot-contents-photo', s.sidePhoto ?? '');
        a = injectText(a, 'imported-slot-red-display', s.pageTitle ?? '');
        a = injectContentsList(a, [
          s.item1 ?? '', s.item2 ?? '', s.item3 ?? '',
          s.item4 ?? '', s.item5 ?? '', s.item6 ?? ''
        ]);
        break;
      case 'story':
        a = injectImage(a, 'imported-slot-hero-photo', s.widePhoto ?? '');
        a = injectText(a, 'imported-slot-serif-title', s.pageTitle ?? '');
        a = injectText(a, 'imported-slot-body', s.body ?? '');
        a = injectText(a, 'imported-slot-body-columns', s.body ?? '');
        a = injectText(a, 'imported-slot-caption', s.caption ?? '');
        break;
      case 'feature':
        a = injectImage(a, 'imported-slot-split-hero', s.featurePhoto ?? '');
        a = injectImage(a, 'imported-slot-split-detail', s.detailPhoto ?? '');
        a = injectText(a, 'imported-slot-serif-title', s.featureTitle ?? '');
        a = injectText(a, 'imported-slot-body', s.body ?? '');
        a = injectText(a, 'imported-slot-caption', s.caption ?? '');
        break;
      case 'essay':
        a = injectImage(a, 'imported-slot-essay-hero', s.widePhoto ?? '');
        a = injectImage(a, 'imported-slot-essay-detail', s.squarePhoto ?? '');
        a = injectText(a, 'imported-slot-serif-title', s.pageTitle ?? '');
        a = injectText(a, 'imported-slot-body', s.body ?? '');
        a = injectText(a, 'imported-slot-caption', s.caption ?? '');
        break;
      case 'gallery':
        a = injectImage(a, 'imported-slot-gallery-a', s.gridA ?? '');
        a = injectImage(a, 'imported-slot-gallery-b', s.gridB ?? '');
        a = injectImage(a, 'imported-slot-gallery-c', s.gridC ?? '');
        a = injectImage(a, 'imported-slot-gallery-d', s.gridD ?? '');
        a = injectText(a, 'imported-slot-serif-title', s.collageTitle ?? '');
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
        a = injectText(a, 'imported-slot-caption', s.caption ?? 'WWW.WANDERBOOK.COM');
        break;
    }

    parts[i] = a;
  }

  // ?page=N → return a single self-contained page document
  const pageParam = req.nextUrl.searchParams.get('page');
  if (pageParam !== null) {
    const pageNum = parseInt(pageParam, 10);
    if (pageNum < 1 || pageNum > 8 || !parts[pageNum]) {
      return new NextResponse('Page not found', { status: 404 });
    }
    const inlineCss = readInlineCss();
    const articleHtml = extractArticle(parts[pageNum]);
    const singlePage = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=794"/>
${GOOGLE_FONTS_LINK}
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 794px; height: 1123px; overflow: hidden; }
${inlineCss}
</style>
</head>
<body>
${articleHtml}
</body>
</html>`;
    return new NextResponse(singlePage, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }

  // No ?page param → return full HTML (used for PDF export)
  const injected = parts.join('');
  return new NextResponse(injected, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
