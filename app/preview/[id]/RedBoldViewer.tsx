'use client';

import FlipBook from './FlipBook';

export function RedBoldViewer({ magazineId }: { magazineId: string }) {
  return <FlipBook magazineId={magazineId} pageCount={8} />;
}
