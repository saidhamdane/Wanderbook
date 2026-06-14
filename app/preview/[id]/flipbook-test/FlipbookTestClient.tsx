'use client';

import type { MagazineDocument } from '@/lib/magazine/types';
import { InteractiveFlipbookViewer } from '@/components/magazine/InteractiveFlipbookViewer';

export default function FlipbookTestClient({
  magazineId,
  pageCount,
}: {
  magazineId: string;
  pageCount: number;
}) {
  const magazine = {
    id: magazineId,
    templateId: '',
    destination: '',
    generatedAt: new Date(0).toISOString(),
    pages: Array.from({ length: pageCount }, (_, index) => ({
      pageId: `page-${index + 1}`,
      layout: '',
      slots: {},
    })),
    template: {
      id: '',
      name: '',
      mood: '',
      description: '',
      palette: {
        primary: '',
        accent: '',
        background: '',
        text: '',
        light: '',
      },
      fonts: {
        heading: '',
        subheading: '',
        body: '',
      },
      pages: [],
    },
  } satisfies MagazineDocument;

  return <InteractiveFlipbookViewer magazine={magazine} />;
}
