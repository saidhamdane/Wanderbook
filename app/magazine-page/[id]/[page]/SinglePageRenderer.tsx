'use client';

import { getLayout } from '@/components/layouts/layout-registry';
import type { MagazineTemplate, LayoutPartner } from '@/lib/magazine/types';

type Props = {
  layout: string;
  slots: Record<string, string>;
  palette: MagazineTemplate['palette'];
  fonts: MagazineTemplate['fonts'];
  pageIndex: number;
  partner?: LayoutPartner;
  language?: string;
};

export function SinglePageRenderer({
  layout,
  slots,
  palette,
  fonts,
  pageIndex,
  partner,
  language,
}: Props) {
  const Layout = getLayout(layout);
  return (
    <div style={{ width: 794, height: 1123, overflow: 'hidden', background: '#fff' }}>
      <Layout slots={slots} palette={palette} fonts={fonts} pageIndex={pageIndex} partner={partner} language={language} />
    </div>
  );
}
