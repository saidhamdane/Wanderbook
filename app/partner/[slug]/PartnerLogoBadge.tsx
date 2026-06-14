'use client';

import { useState } from 'react';

type Props = {
  src: string;
  businessName: string;
};

export function PartnerLogoBadge({ src, businessName }: Props) {
  const [hidden, setHidden] = useState(false);

  if (!src || hidden) return null;

  return (
    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/[0.08] p-2 shadow-2xl shadow-black/30 ring-1 ring-amber-200/10 backdrop-blur sm:h-20 sm:w-20 sm:rounded-3xl">
      <img
        src={src}
        alt={`${businessName} logo`}
        className="h-full w-full object-contain"
        onError={() => setHidden(true)}
      />
    </div>
  );
}
