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
  const tagEnd = article.indexOf('>', idx) + 1;
  if (tagEnd === 0) return article;
  const closeStart = article.indexOf('</', tagEnd);
  if (closeStart === -1) return article;
  return article.slice(0, tagEnd) + escapeHtml(text) + article.slice(closeStart);
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

  // Replace everything from tagEnd up to (but not including) the page-number div
  const pageNumIdx = article.indexOf('imported-slot-page-number', tagEnd);
  if (pageNumIdx === -1) return article;
  const pageNumDivStart = article.lastIndexOf('<div', pageNumIdx);
  return article.slice(0, tagEnd) + innerHtml + '</div>' + article.slice(pageNumDivStart);
}

export async function GET(
  _req: NextRequest,
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

  // Build a quick lookup: pageId → slots
  const pageSlots: Record<string, Record<string, string>> = {};
  for (const page of doc.pages) {
    pageSlots[page.pageId] = page.slots;
  }

  // Split into preamble + 8 article sections
  const parts = html.split(/(?=<article\b)/);
  // parts[0] = preamble, parts[1..8] = articles

  // Map article index (1-based) to pageId
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
          s.item1 ?? '',
          s.item2 ?? '',
          s.item3 ?? '',
          s.item4 ?? '',
          s.item5 ?? '',
          s.item6 ?? ''
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

  const injected = parts.join('');
  return new NextResponse(injected, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
