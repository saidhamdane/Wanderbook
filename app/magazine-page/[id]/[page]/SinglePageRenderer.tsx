'use client';

import { getLayout } from '@/components/layouts/layout-registry';
import type { MagazineTemplate } from '@/lib/magazine/types';

type Props = {
  layout: string;
  slots: Record<string, string>;
  palette: MagazineTemplate['palette'];
  fonts: MagazineTemplate['fonts'];
  pageIndex: number;
};

export function SinglePageRenderer({
  layout,
  slots,
  palette,
  fonts,
  pageIndex,
}: Props) {
  const Layout = getLayout(layout);
  return (
    <div style={{ width: 794, height: 1123, overflow: 'hidden', background: '#fff' }}>
      <Layout slots={slots} palette={palette} fonts={fonts} pageIndex={pageIndex} />
    </div>
  );
}
