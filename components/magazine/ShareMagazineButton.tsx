'use client';

import { useState } from 'react';
import { publicSiteOrigin } from '@/lib/public-url';

export function ShareMagazineButton({
  magazineId,
  destination,
  businessName,
}: {
  magazineId: string;
  destination: string;
  businessName?: string;
}) {
  const [copied, setCopied] = useState(false);

  function handleShare() {
    const path = `/magazine/${magazineId}`;
    const origin = publicSiteOrigin();
    const url = origin ? `${origin}${path}` : path;
    const text = businessName
      ? `I created my ${destination || 'Canary Islands'} digital travel magazine with ${businessName} ✨\n${url}`
      : `I made a personal Canary Islands travel magazine.\n${url}`;

    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => undefined);
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      style={{
        padding: '8px 16px',
        borderRadius: 9999,
        border: `1px solid ${copied ? 'rgba(34,197,94,0.5)' : 'rgba(255,255,255,0.18)'}`,
        color: copied ? '#86efac' : '#fff',
        background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.08em',
        cursor: 'pointer',
      }}
    >
      {copied ? 'Link copied!' : 'Share my magazine'}
    </button>
  );
}
