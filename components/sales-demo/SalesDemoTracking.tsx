'use client';

import { useCallback, useEffect, useRef } from 'react';

type SalesDemoEvent =
  | 'sales_demo_opened'
  | 'sales_demo_whatsapp_clicked'
  | 'sales_demo_signup_clicked';

function postSalesDemoEvent(token: string, event: SalesDemoEvent) {
  fetch('/api/demo/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, event }),
    keepalive: true,
  }).catch(() => undefined);
}

export function SalesDemoTracking({
  token,
  whatsappHref,
  signupHref,
}: {
  token: string;
  whatsappHref?: string;
  signupHref: string;
}) {
  const openedRef = useRef(false);

  const track = useCallback(
    (event: SalesDemoEvent) => {
      postSalesDemoEvent(token, event);
    },
    [token]
  );

  useEffect(() => {
    if (openedRef.current) return;
    openedRef.current = true;
    track('sales_demo_opened');
  }, [track]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
      {whatsappHref ? (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('sales_demo_whatsapp_clicked')}
          className="inline-flex min-h-12 items-center justify-center rounded-lg bg-green-600 px-5 py-3 text-center text-sm font-bold text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          Hablar con Wanderbook por WhatsApp
        </a>
      ) : (
        <button
          type="button"
          disabled
          className="inline-flex min-h-12 cursor-not-allowed items-center justify-center rounded-lg bg-slate-500 px-5 py-3 text-center text-sm font-bold text-white opacity-70"
        >
          Hablar con Wanderbook por WhatsApp
        </button>
      )}
      <a
        href={signupHref}
        onClick={() => track('sales_demo_signup_clicked')}
        className="inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-5 py-3 text-center text-sm font-bold text-slate-950 shadow-sm hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-950"
      >
        Crear mi cuenta
      </a>
    </div>
  );
}
