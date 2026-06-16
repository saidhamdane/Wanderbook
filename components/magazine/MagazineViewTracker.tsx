'use client';

import { useEffect, useRef } from 'react';

export function MagazineViewTracker({
  magazineId,
  partnerSlug,
}: {
  magazineId: string;
  partnerSlug: string;
}) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    const payload = JSON.stringify({
      eventType: 'magazine_viewed',
      magazineId,
      partnerSlug,
    });

    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/partner/events', new Blob([payload], { type: 'application/json' }));
      } else {
        fetch('/api/partner/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // ignore tracking errors
    }
  }, [magazineId, partnerSlug]);

  return null;
}
