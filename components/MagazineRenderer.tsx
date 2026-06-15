'use client';

import { MagazineDocument } from '@/lib/magazine/types';
import { getLayout } from '@/components/layouts/layout-registry';

type Props = {
  doc: MagazineDocument;
  printMode?: boolean;
};

export function MagazineRenderer({ doc, printMode }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: printMode ? '0' : '32px',
        alignItems: 'center',
        padding: printMode ? '0' : '40px 24px',
        backgroundColor: printMode ? '#FFFFFF' : '#E8E8E8',
        minHeight: '100vh'
      }}
    >
      {doc.pages.map((page, index) => {
        const Layout = getLayout(page.layout);
        return (
          <div
            key={page.pageId}
            style={{
              boxShadow: printMode ? 'none' : '0 8px 40px rgba(0,0,0,0.18)',
              borderRadius: '2px',
              overflow: 'hidden',
              pageBreakAfter: printMode && index < doc.pages.length - 1 ? 'always' : 'auto'
            }}
          >
            <Layout
              slots={page.slots}
              palette={doc.template.palette}
              fonts={doc.template.fonts}
              pageIndex={index}
            />
          </div>
        );
      })}
    </div>
  );
}
