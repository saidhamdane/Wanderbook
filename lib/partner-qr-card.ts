import type { PublicPartner } from './partner-store';

export type PartnerQrCardCopy = {
  headline: string;
  subtitle: string;
};

export function getPartnerQrCardCopy(partner: PublicPartner): PartnerQrCardCopy {
  const island = partner.mainIsland || 'Canary Islands';
  const businessName = partner.businessName;

  if (partner.businessType === 'Excursion Company') {
    return {
      headline: `Create your ${island} adventure magazine`,
      subtitle: `Scan after your tour, upload your photos, and receive a digital magazine of your experience with ${businessName}.`,
    };
  }

  if (partner.businessType === 'Holiday Rental') {
    return {
      headline: `Create your ${island} guest magazine`,
      subtitle: `Scan during your stay, upload your photos, and receive a digital magazine of your holiday with ${businessName}.`,
    };
  }

  if (partner.businessType === 'Photographer') {
    return {
      headline: 'Create your photo session magazine',
      subtitle: `Scan the QR code, upload your photos, and receive a digital flipbook magazine created with ${businessName}.`,
    };
  }

  if (partner.businessType === 'Tour Guide') {
    return {
      headline: 'Create your island tour magazine',
      subtitle: `Scan after your tour, upload your photos, and receive a digital magazine of your experience with ${businessName}.`,
    };
  }

  return {
    headline: 'Create your Canary Islands travel magazine',
    subtitle: `Scan the QR code, upload your photos, and receive a digital flipbook magazine of your experience with ${businessName}.`,
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function renderPartnerQrCardHtml({
  partner,
  clientUrl,
  qrImageSrc,
  width = 1080,
  height = 1600,
  includePageChrome = false,
}: {
  partner: PublicPartner;
  clientUrl: string;
  qrImageSrc: string;
  width?: number;
  height?: number;
  includePageChrome?: boolean;
}): string {
  const copy = getPartnerQrCardCopy(partner);
  const brand = 'Wanderbook Canarias';
  const businessName = escapeHtml(partner.businessName);
  const island = escapeHtml(partner.mainIsland || 'Canary Islands');
  const headline = escapeHtml(copy.headline);
  const subtitle = escapeHtml(copy.subtitle);
  const type = escapeHtml(partner.businessType || 'Partner');
  const escapedClientUrl = escapeHtml(clientUrl);
  const escapedQrImageSrc = escapeHtml(qrImageSrc);
  const controls = includePageChrome
    ? `
      <div class="no-print controls">
        <button type="button" onclick="window.print()">Print card</button>
        <a href="/api/partner/qr?slug=${encodeURIComponent(partner.slug)}">Download QR</a>
        <a href="/api/partner/qr-card?slug=${encodeURIComponent(partner.slug)}">Download PNG card</a>
      </div>
    `
    : '';

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${businessName} QR Card</title>
    <style>
      * { box-sizing: border-box; }
      html, body { margin: 0; min-height: 100%; }
      body {
        background: ${includePageChrome ? '#e5e7eb' : 'transparent'};
        color: #ffffff;
        font-family: Inter, Montserrat, Arial, sans-serif;
      }
      .page {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 18px;
        padding: ${includePageChrome ? '24px 14px' : '0'};
      }
      .controls {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
        width: min(100%, 760px);
      }
      .controls button,
      .controls a {
        border: 0;
        border-radius: 12px;
        background: #0f172a;
        color: #ffffff;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 44px;
        padding: 11px 16px;
        text-decoration: none;
        font: 800 14px/1 Inter, Montserrat, Arial, sans-serif;
      }
      .card {
        position: relative;
        width: ${width}px;
        height: ${height}px;
        overflow: hidden;
        background:
          radial-gradient(circle at 22% 18%, rgba(251, 191, 36, 0.28), transparent 28%),
          radial-gradient(circle at 85% 12%, rgba(20, 184, 166, 0.2), transparent 25%),
          linear-gradient(145deg, #020617 0%, #071329 45%, #0f172a 100%);
        isolation: isolate;
      }
      .card::before {
        content: "";
        position: absolute;
        inset: 58px;
        border: 2px solid rgba(251, 191, 36, 0.35);
        pointer-events: none;
      }
      .card::after {
        content: "";
        position: absolute;
        inset: 84px;
        border: 1px solid rgba(255, 255, 255, 0.14);
        pointer-events: none;
      }
      .content {
        position: relative;
        z-index: 1;
        display: flex;
        height: 100%;
        flex-direction: column;
        align-items: center;
        padding: 96px 104px 112px;
        text-align: center;
      }
      .brand {
        color: #fbbf24;
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 54px;
        font-weight: 700;
        line-height: 1;
      }
      .eyebrow {
        margin-top: 28px;
        color: rgba(255, 255, 255, 0.7);
        font-size: 20px;
        font-weight: 800;
        letter-spacing: 0.22em;
        text-transform: uppercase;
      }
      h1 {
        margin: 38px 0 0;
        max-width: 820px;
        color: #ffffff;
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 78px;
        font-weight: 700;
        letter-spacing: 0;
        line-height: 0.98;
      }
      .subtitle {
        margin: 28px 0 0;
        max-width: 760px;
        color: rgba(226, 232, 240, 0.94);
        font-size: 32px;
        font-weight: 600;
        line-height: 1.3;
      }
      .qr-shell {
        margin-top: 58px;
        width: 560px;
        border-radius: 40px;
        background: #ffffff;
        padding: 36px;
        box-shadow: 0 30px 80px rgba(0, 0, 0, 0.36);
      }
      .qr-shell img {
        display: block;
        width: 488px;
        height: 488px;
      }
      .scan {
        margin-top: 24px;
        color: #fbbf24;
        font-size: 25px;
        font-weight: 900;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }
      .url {
        margin-top: 12px;
        max-width: 760px;
        overflow-wrap: anywhere;
        color: rgba(255, 255, 255, 0.72);
        font-size: 22px;
        font-weight: 700;
      }
      .spacer { flex: 1; }
      .partner {
        margin-top: 34px;
        color: rgba(255, 255, 255, 0.82);
        font-size: 27px;
        font-weight: 800;
      }
      .footer {
        margin-top: 16px;
        color: rgba(255, 255, 255, 0.62);
        font-size: 22px;
        font-weight: 700;
      }
      @media (max-width: 760px) {
        .page { justify-content: flex-start; }
        .controls { flex-direction: column; }
        .controls button,
        .controls a { width: 100%; }
        .card {
          width: min(100vw - 28px, 540px);
          height: auto;
          aspect-ratio: ${width} / ${height};
        }
      }
      @media print {
        @page { size: portrait; margin: 0; }
        html, body { margin: 0; background: #ffffff !important; }
        .no-print { display: none !important; }
        .page { min-height: 0; padding: 0; display: block; }
        .card {
          width: 100vw;
          height: 100vh;
        }
      }
    </style>
  </head>
  <body>
    <main class="page">
      ${controls}
      <section class="card" aria-label="${businessName} printable QR card">
        <div class="content">
          <div class="brand">${brand}</div>
          <div class="eyebrow">${island} ${type}</div>
          <h1>${headline}</h1>
          <p class="subtitle">${subtitle}</p>
          <div class="qr-shell">
            <img src="${escapedQrImageSrc}" alt="QR code for ${businessName}" />
          </div>
          <div class="scan">Scan to create yours</div>
          <div class="url">${escapedClientUrl}</div>
          <div class="spacer"></div>
          <div class="partner">Created with ${businessName}</div>
          <div class="footer">Powered by ${brand}</div>
        </div>
      </section>
    </main>
  </body>
</html>`;
}
