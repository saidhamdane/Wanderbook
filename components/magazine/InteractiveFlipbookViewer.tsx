'use client';

import { Component, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { getLayout } from '@/components/layouts/layout-registry';
import type { MagazineDocument, MagazineTemplate } from '@/lib/magazine/types';
import { localizedContentsLabels, magazineLabel } from '@/lib/magazine/localize-magazine';

const PAGE_W = 794;
const PAGE_H = 1123;

type PageSize = {
  width: number;
  height: number;
};

type MagazinePage = MagazineDocument['pages'][number];

function cleanText(value: string) {
  return value
    .replace(/\s+/g, ' ')
    .replace(/[.…]+$/g, '')
    .trim();
}

function sentenceExcerpt(value: string, maxSentences = 2, maxWords = 34) {
  const text = cleanText(value);
  if (!text) return '';

  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map((part) => cleanText(part)) || [text];
  const selected = sentences.slice(0, maxSentences).join(' ');
  const words = selected.split(/\s+/).filter(Boolean);
  const excerpt = words.length > maxWords ? words.slice(0, maxWords).join(' ') : selected;
  return /[.!?]$/.test(excerpt) ? excerpt : `${excerpt}.`;
}

function buildMobilePage(page: MagazinePage, magazine: MagazineDocument): MagazinePage {
  const slots = { ...(page.slots || {}) };
  const layout = page.layout || '';
  const language = magazine.language;

  if (layout === 'are-contents' || layout === 'ane-contents') {
    localizedContentsLabels(language).forEach((label, index) => {
      slots[`toc-item-${index + 1}`] = slots[`toc-item-${index + 1}`] || label;
    });
    return { ...page, slots };
  }

  if (layout === 'are-intro') {
    slots['intro-title'] = sentenceExcerpt(slots['intro-title'] || magazineLabel(language, 'welcome'), 1, 8);
    slots['intro-body'] = sentenceExcerpt(slots['intro-body'] || '', 3, magazine.style === 'Calm & Minimal' ? 22 : 42);
    slots['intro-pullquote'] = sentenceExcerpt(slots['intro-pullquote'] || slots['quote-text'] || slots['intro-body'] || '', 1, 12);
    return { ...page, slots };
  }

  if (layout === 'are-feature') {
    slots['feature-title'] = sentenceExcerpt(slots['feature-title'] || magazineLabel(language, 'discoveringTheIsland'), 1, 8);
    slots['feature-body'] = sentenceExcerpt(slots['feature-body'] || '', 3, magazine.style === 'Calm & Minimal' ? 24 : 44);
    slots['feature-stat-1'] = slots['feature-stat-1'] || magazineLabel(language, 'openCoast');
    slots['feature-stat-2'] = slots['feature-stat-2'] || magazineLabel(language, 'slowDays');
    slots['feature-stat-3'] = slots['feature-stat-3'] || magazineLabel(language, 'familyLight');
    return { ...page, slots };
  }

  if (layout === 'are-story') {
    slots['story-title'] = sentenceExcerpt(slots['story-title'] || magazineLabel(language, 'theStory'), 1, 8);
    slots['story-lead'] = sentenceExcerpt(slots['story-lead'] || slots['intro-pullquote'] || '', 1, 8);
    slots['story-body'] = sentenceExcerpt(slots['story-body'] || '', 3, magazine.style === 'Calm & Minimal' ? 24 : 44);
    return { ...page, slots };
  }

  if (layout === 'are-quote') {
    slots['quote-text'] = sentenceExcerpt(slots['quote-text'] || magazineLabel(language, 'everyJourneyWrites'), 2, magazine.style === 'Calm & Minimal' ? 14 : 30);
    return { ...page, slots };
  }

  if (layout === 'ane-letter') {
    slots['letter-title'] = sentenceExcerpt(slots['letter-title'] || magazineLabel(language, 'introduction'), 1, 8);
    slots['letter-body'] = sentenceExcerpt(slots['letter-body'] || '', 3, magazine.style === 'Calm & Minimal' ? 24 : 44);
    return { ...page, slots };
  }

  if (layout === 'ane-hero') {
    slots['hero-subtitle'] = sentenceExcerpt(slots['hero-subtitle'] || '', 1, 12);
    slots['hero-body'] = sentenceExcerpt(slots['hero-body'] || '', 3, magazine.style === 'Calm & Minimal' ? 24 : 44);
    return { ...page, slots };
  }

  if (layout === 'ane-route') {
    slots['route-title'] = sentenceExcerpt(slots['route-title'] || magazineLabel(language, 'discoveringTheIsland'), 1, 8);
    slots['route-body'] = sentenceExcerpt(slots['route-body'] || '', 3, magazine.style === 'Calm & Minimal' ? 24 : 44);
    return { ...page, slots };
  }

  if (layout === 'ane-quote') {
    slots['quote-text'] = sentenceExcerpt(slots['quote-text'] || magazineLabel(language, 'everyJourneyWrites'), 2, magazine.style === 'Calm & Minimal' ? 14 : 30);
    return { ...page, slots };
  }

  return page;
}

function getPageCount(magazine: MagazineDocument) {
  return magazine.templateId === 'red-white-bold-travel'
    ? magazine.pages.length + 1
    : magazine.pages.length;
}

function hasRenderablePages(magazine: MagazineDocument) {
  const screenshotOnlyTemplates = new Set(['canva-travel', 'hanover', 'red-white-bold-travel']);
  return Boolean(
    !screenshotOnlyTemplates.has(magazine.templateId) &&
      magazine.template?.palette &&
      magazine.template?.fonts &&
      magazine.pages.some((page) => page.layout),
  );
}

function FallbackPage() {
  return (
    <div className="flipbook-render-fallback">
      <h2>Magazine page loading</h2>
      <p>This page could not be rendered. Please try again.</p>
    </div>
  );
}

class PageErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('[Flipbook] page render failed', error);
  }

  render() {
    if (this.state.hasError) return <FallbackPage />;
    return this.props.children;
  }
}

function RenderedMagazinePage({
  page,
  pageIndex,
  palette,
  fonts,
  partner,
  language,
  style,
  copyProvider,
}: {
  page: MagazinePage;
  pageIndex: number;
  palette: MagazineTemplate['palette'];
  fonts: MagazineTemplate['fonts'];
  partner?: MagazineDocument['partner'];
  language?: string;
  style?: string;
  copyProvider?: MagazineDocument['copyProvider'];
}) {
  const Layout = page.layout ? getLayout(page.layout) : null;

  if (!Layout) {
    console.warn('[Flipbook] missing page layout', pageIndex, page?.pageId, page?.layout);
    return <FallbackPage />;
  }

  return (
    <PageErrorBoundary>
      <Layout
        slots={page.slots || {}}
        palette={palette}
        fonts={fonts}
        pageIndex={pageIndex}
        partner={partner}
        language={language}
        style={style}
        copyProvider={copyProvider}
      />
    </PageErrorBoundary>
  );
}

export function InteractiveFlipbookViewer({ magazine }: { magazine: MagazineDocument }) {
  const magazineId = magazine.id;
  const pageCount = getPageCount(magazine);
  const renderPagesDirectly = hasRenderablePages(magazine) && magazine.templateId !== 'red-white-bold-travel';
  const bookElementRef = useRef<HTMLDivElement>(null);
  const pageFlipRef = useRef<any>(null);
  const [pageSize, setPageSize] = useState<PageSize>({ width: 320, height: 453 });
  const [isMobileReadable, setIsMobileReadable] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    function updateSize() {
      const isReadableMobile = window.innerWidth <= 640;
      setIsMobileReadable(isReadableMobile);
      const widthSpace = Math.max(280, isReadableMobile ? window.innerWidth * 0.94 : window.innerWidth - 24);
      const heightSpace = Math.max(360, window.innerHeight - 190);
      const widthScale = widthSpace / PAGE_W;
      const heightScale = heightSpace / PAGE_H;
      const scale = Math.min(isReadableMobile ? widthScale : Math.min(widthScale, heightScale), 1);
      const width = Math.floor(PAGE_W * scale);
      const height = Math.floor(PAGE_H * scale);

      setPageSize({
        width: Math.max(280, Math.min(width, isReadableMobile ? 430 : PAGE_W)),
        height: Math.max(396, Math.floor(Math.min(width, isReadableMobile ? 430 : PAGE_W) * (PAGE_H / PAGE_W))),
      });
    }

    updateSize();
    window.addEventListener('resize', updateSize);
    window.addEventListener('orientationchange', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('orientationchange', updateSize);
    };
  }, []);

  useEffect(() => {
    if (!bookElementRef.current) return;

    let cancelled = false;

    async function initFlipbook() {
      setReady(false);

      if (pageFlipRef.current) {
        try {
          pageFlipRef.current.destroy();
        } catch {
          /* ignore */
        }
        pageFlipRef.current = null;
      }

      await new Promise((resolve) => window.setTimeout(resolve, 80));
      if (cancelled || !bookElementRef.current) return;

      const { PageFlip } = await import('page-flip');
      if (cancelled || !bookElementRef.current) return;

      const flipbook = new PageFlip(bookElementRef.current, {
        width: pageSize.width,
        height: pageSize.height,
        size: 'fixed',
        minWidth: pageSize.width,
        maxWidth: pageSize.width,
        minHeight: pageSize.height,
        maxHeight: pageSize.height,
        showCover: false,
        mobileScrollSupport: true,
        usePortrait: true,
        drawShadow: true,
        flippingTime: 700,
        maxShadowOpacity: 0.45,
        startPage: 0,
        clickEventForward: false,
        useMouseEvents: true,
        swipeDistance: 18,
        showPageCorners: true,
        disableFlipByClick: false,
      } as any);

      flipbook.loadFromHTML(bookElementRef.current.querySelectorAll('.flipbook-test-page'));
      flipbook.on('flip', (event: { data: number }) => setCurrentPage(event.data));
      pageFlipRef.current = flipbook;
      setReady(true);
    }

    initFlipbook();

    return () => {
      cancelled = true;
      if (pageFlipRef.current) {
        try {
          pageFlipRef.current.destroy();
        } catch {
          /* ignore */
        }
        pageFlipRef.current = null;
      }
    };
  }, [isMobileReadable, magazineId, pageCount, pageSize.height, pageSize.width, renderPagesDirectly]);

  const goPrev = useCallback(() => {
    pageFlipRef.current?.flipPrev?.('bottom');
  }, []);

  const goNext = useCallback(() => {
    pageFlipRef.current?.flipNext?.('bottom');
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goPrev();
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goNext();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goNext, goPrev]);

  return (
    <section className="flipbook-test-shell magazine-mobile-readable">
      <style jsx global>{`
        body {
          overflow-x: hidden;
        }
        @media (max-width: 640px) {
          .magazine-mobile-readable .magazine-copy {
            font-size: 33px !important;
            line-height: 1.52 !important;
            letter-spacing: 0 !important;
            color: #111827 !important;
            font-weight: 500 !important;
          }
          .magazine-mobile-readable [data-magazine-theme="dark"] .magazine-copy,
          .magazine-mobile-readable .magazine-copy-on-dark {
            color: rgba(255, 250, 240, 0.94) !important;
            text-shadow: 0 1px 10px rgba(0, 0, 0, 0.45);
          }
          .magazine-mobile-readable .magazine-copy[style*="-webkit-box"] {
            -webkit-line-clamp: 6 !important;
          }
          .magazine-mobile-readable .flipbook-render-scale[data-layout="are-story"] .magazine-copy {
            font-size: 32px !important;
            line-height: 1.46 !important;
          }
          .magazine-mobile-readable .magazine-caption {
            font-size: 26px !important;
            line-height: 1.35 !important;
            letter-spacing: 0.08em !important;
            color: rgba(17, 24, 39, 0.86) !important;
            font-weight: 700 !important;
          }
          .magazine-mobile-readable .magazine-caption-on-image,
          .magazine-mobile-readable [data-magazine-theme="dark"] .magazine-caption {
            color: rgba(255, 255, 255, 0.96) !important;
            text-shadow: 0 2px 14px rgba(0, 0, 0, 0.75);
          }
          .magazine-mobile-readable .magazine-label {
            font-size: 24px !important;
            line-height: 1.35 !important;
            letter-spacing: 0.16em !important;
            font-weight: 800 !important;
          }
          .magazine-mobile-readable .magazine-contents-row {
            padding-top: 22px !important;
            padding-bottom: 22px !important;
          }
          .magazine-mobile-readable .magazine-contents-item {
            font-size: 31px !important;
            line-height: 1.26 !important;
            letter-spacing: 0 !important;
            color: #111827 !important;
          }
          .magazine-mobile-readable .magazine-contents-page,
          .magazine-mobile-readable .magazine-contents-number {
            font-size: 25px !important;
            line-height: 1.2 !important;
            letter-spacing: 0.08em !important;
          }
          .magazine-mobile-readable .magazine-quote-wrap {
            max-width: 82% !important;
          }
          .magazine-mobile-readable .magazine-quote-mark {
            font-size: 76px !important;
            line-height: 0.7 !important;
            margin-bottom: 26px !important;
          }
          .magazine-mobile-readable .magazine-quote-text {
            font-size: 44px !important;
            line-height: 1.45 !important;
            letter-spacing: 0 !important;
          }
          .magazine-mobile-readable .magazine-caption-on-image,
          .magazine-mobile-readable .magazine-copy-on-dark,
          .magazine-mobile-readable .magazine-partner-card {
            text-shadow: 0 2px 16px rgba(0, 0, 0, 0.68);
          }
          .magazine-mobile-readable .magazine-quote-attr {
            font-size: 24px !important;
            line-height: 1.35 !important;
            letter-spacing: 0.14em !important;
          }
          .magazine-mobile-readable .magazine-partner-card {
            background: rgba(8, 12, 28, 0.86) !important;
            box-shadow: 0 20px 64px rgba(0, 0, 0, 0.52) !important;
          }
          .magazine-mobile-readable .magazine-partner-card img {
            max-width: 160px !important;
            max-height: 100px !important;
          }
          .magazine-mobile-readable .magazine-partner-card-kicker {
            font-size: 22px !important;
            line-height: 1.35 !important;
            letter-spacing: 0.18em !important;
          }
          .magazine-mobile-readable .magazine-partner-card-name {
            font-size: 60px !important;
            line-height: 1.05 !important;
          }
          .magazine-mobile-readable .magazine-partner-card-cta {
            font-size: 34px !important;
            line-height: 1.3 !important;
          }
          .magazine-mobile-readable .magazine-partner-card-contact {
            gap: 12px !important;
          }
          .magazine-mobile-readable .magazine-partner-card-contact a,
          .magazine-mobile-readable .magazine-partner-card-contact button {
            font-size: 34px !important;
            line-height: 1.32 !important;
            padding: 20px 28px !important;
            border-radius: 14px !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          .magazine-mobile-readable .magazine-partner-card-footer {
            font-size: 22px !important;
            line-height: 1.35 !important;
            color: rgba(255, 255, 255, 0.72) !important;
          }
        }
      `}</style>
      <style jsx>{`
        .flipbook-test-shell {
          width: 100%;
          overflow-x: hidden;
          padding: 18px 12px max(88px, env(safe-area-inset-bottom));
          box-sizing: border-box;
        }
        .flipbook-test-wrapper {
          width: 100%;
          max-width: calc(100vw - 24px);
          margin: 0 auto;
          overflow-x: hidden;
          display: flex;
          justify-content: center;
        }
        .flipbook-test-stage,
        .magazine-page-mobile {
          width: ${pageSize.width}px;
          height: ${pageSize.height}px;
          max-width: calc(100vw - 24px);
          position: relative;
          left: auto;
          right: auto;
          transform: none;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 18px 42px rgba(0, 0, 0, 0.42);
        }
        @media (max-width: 640px) {
          .flipbook-test-shell {
            padding: 12px 0 max(72px, env(safe-area-inset-bottom));
          }
          .flipbook-test-wrapper {
            max-width: 94vw;
          }
          .flipbook-test-stage,
          .magazine-page-mobile {
            max-width: min(94vw, 430px);
          }
        }
        .flipbook-test-page {
          width: ${pageSize.width}px;
          height: ${pageSize.height}px;
          background: #fff;
          overflow: hidden;
          color: #111827;
        }
        .flipbook-render-scale {
          width: ${PAGE_W}px;
          height: ${PAGE_H}px;
          overflow: hidden;
          background: #fff;
          transform: scale(${pageSize.width / PAGE_W});
          transform-origin: top left;
        }
        .flipbook-test-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
          background: #fff;
          user-select: none;
          -webkit-user-drag: none;
        }
        .flipbook-test-controls {
          margin-top: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
        }
        .flipbook-test-arrow {
          width: 44px;
          height: 38px;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.22);
          background: rgba(255, 255, 255, 0.07);
          color: #fff;
          cursor: pointer;
          font-size: 24px;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .flipbook-test-arrow:disabled {
          opacity: 0.42;
          cursor: not-allowed;
        }
        .flipbook-test-count {
          min-width: 76px;
          color: rgba(255, 255, 255, 0.72);
          font-size: 12px;
          letter-spacing: 0.12em;
          text-align: center;
        }
        .flipbook-test-help {
          margin: 12px 0 0;
          color: rgba(255, 255, 255, 0.54);
          font-size: 12px;
          letter-spacing: 0.08em;
          text-align: center;
        }
        .flipbook-render-fallback {
          width: 100%;
          height: 100%;
          min-height: 100%;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 56px;
          background: #fff7ed;
          color: #111827;
          text-align: center;
          font-family: system-ui, sans-serif;
        }
        .flipbook-render-fallback h2 {
          margin: 0;
          color: #111827;
          font-size: 26px;
          line-height: 1.1;
        }
        .flipbook-render-fallback p {
          margin: 0;
          max-width: 360px;
          color: #475569;
          font-size: 14px;
          line-height: 1.5;
        }
      `}</style>

      <div className="flipbook-test-wrapper">
        <div className="flipbook-test-stage magazine-page-mobile">
          <div ref={bookElementRef}>
            {Array.from({ length: pageCount }, (_, index) => (
              <div
                key={index}
                className="flipbook-test-page"
                data-density={index === 0 || index === pageCount - 1 ? 'hard' : 'soft'}
              >
                {renderPagesDirectly ? (
                  <div className="flipbook-render-scale" data-layout={magazine.pages[index]?.layout || ''}>
                    <RenderedMagazinePage
                      page={isMobileReadable ? buildMobilePage(magazine.pages[index], magazine) : magazine.pages[index]}
                      pageIndex={index}
                      palette={magazine.template.palette}
                      fonts={magazine.template.fonts}
                      partner={magazine.partner && !(magazine.partner as Record<string, unknown>).magazineId
                        ? { ...magazine.partner, magazineId: magazine.id }
                        : magazine.partner}
                      language={magazine.language}
                      style={magazine.style}
                      copyProvider={magazine.copyProvider}
                    />
                  </div>
                ) : (
                  <img
                    className="flipbook-test-image"
                    src={`/api/page-screenshot/${magazineId}/${index + 1}`}
                    alt={`Page ${index + 1}`}
                    draggable={false}
                  />
                )}
              </div>
            ))}
          </div>
          {!ready && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fff',
                color: '#475569',
                fontFamily: 'system-ui, sans-serif',
                fontSize: 13,
              }}
            >
              {magazineLabel(magazine.language, 'yourMagazineStyle')}
            </div>
          )}
        </div>
      </div>

      <div className="flipbook-test-controls" aria-label="Flipbook test controls">
        <button
          className="flipbook-test-arrow"
          type="button"
          onClick={goPrev}
          disabled={currentPage <= 0}
          aria-label="Previous page"
        >
          &#8249;
        </button>
        <span className="flipbook-test-count">
          {Math.min(currentPage + 1, pageCount)} / {pageCount}
        </span>
        <button
          className="flipbook-test-arrow"
          type="button"
          onClick={goNext}
          disabled={currentPage >= pageCount - 1}
          aria-label="Next page"
        >
          &#8250;
        </button>
      </div>
      <p className="flipbook-test-help">{magazineLabel(magazine.language, 'contents')}</p>
    </section>
  );
}
