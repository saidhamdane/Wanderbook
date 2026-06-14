'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { DEFAULT_TEMPLATE_COVER_IMAGE } from '@/lib/magazine/template-covers';

type Props = {
  src?: string;
  fallbackSrc?: string;
  alt: string;
  sizes: string;
  priority?: boolean;
};

export function TemplateCoverImage({
  src,
  fallbackSrc = DEFAULT_TEMPLATE_COVER_IMAGE,
  alt,
  sizes,
  priority = false,
}: Props) {
  const initialSrc = src || fallbackSrc;
  const [currentSrc, setCurrentSrc] = useState(initialSrc);
  const [failedFallback, setFailedFallback] = useState(false);

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
    setFailedFallback(false);
  }, [src, fallbackSrc]);

  if (failedFallback) {
    return null;
  }

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      style={{ objectFit: 'cover' }}
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
          return;
        }
        setFailedFallback(true);
      }}
    />
  );
}
