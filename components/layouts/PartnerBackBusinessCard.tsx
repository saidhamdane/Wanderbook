'use client';

import type { CSSProperties } from 'react';
import type { LayoutProps } from '@/lib/magazine/types';
import { magazineLabel } from '@/lib/magazine/localize-magazine';
import { resolveActivityProfile } from '@/lib/magazine/resolveActivityProfile';
import { formatSpanishWhatsapp, isValidLogoSrc, normalizeExternalUrl } from '@/lib/partner-utils';

type PartnerBackBusinessCardProps = {
  slots: Record<string, string>;
  fonts: LayoutProps['fonts'];
  partner?: LayoutProps['partner'];
  language?: string;
  accent?: string;
  ivory?: string;
};

function firstValue(...values: Array<string | undefined>): string {
  return values.find((v) => v && v.trim().length > 0)?.trim() || '';
}

function realContactValue(value: string): string {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return '';
  if (
    normalized.includes('placeholder') ||
    normalized.includes('demo') ||
    normalized.includes('example.com') ||
    normalized.includes('123456789') ||
    normalized.includes('000000000')
  ) {
    return '';
  }
  return value.trim();
}

function trackClick(eventType: string, partnerSlug?: string, magazineId?: string) {
  try {
    const payload = JSON.stringify({ eventType, partnerSlug, magazineId });
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon('/api/partner/events', new Blob([payload], { type: 'application/json' }));
    }
  } catch {
    // ignore — link still opens
  }
}

const PUBLIC_ORIGIN = 'https://wanderbookcanarias.com';

function ctaFor(activityType: string, businessType: string): { en: string; es: string } {
  return resolveActivityProfile({ activityType, businessType }).ctaLabels;
}

function nameSize(len: number): number {
  if (len <= 16) return 38;
  if (len <= 24) return 32;
  return 26;
}

export function PartnerBackBusinessCard({
  slots,
  fonts,
  partner,
  language,
  accent = '#f4c35f',
  ivory = '#fffaf0',
}: PartnerBackBusinessCardProps) {
  const businessName = firstValue(slots['partner-business-name'], partner?.businessName);
  if (!businessName) return null;

  const rawLogoUrl = firstValue(
    slots['partner-logo-url'],
    partner?.logoUrl,
    partner?.logo_url as string | undefined,
  );
  const logoUrl = isValidLogoSrc(rawLogoUrl) ? rawLogoUrl : '';

  const rawWhatsapp = realContactValue(firstValue(slots['partner-whatsapp'], partner?.whatsapp));
  const whatsapp = rawWhatsapp ? formatSpanishWhatsapp(rawWhatsapp) : '';
  const whatsappLink = rawWhatsapp ? `https://wa.me/${rawWhatsapp.replace(/\D/g, '')}` : '';

  const activityType = firstValue(
    slots['partner-activity-type'],
    partner?.activityLabel as string | undefined,
    partner?.resolvedActivityType as string | undefined,
    partner?.aiDetectedActivityType as string | undefined,
    partner?.activityType as string | undefined,
  );
  const businessType  = firstValue(slots['partner-business-type'], partner?.businessType);
  const isSpanish = language === 'es';
  const lang = isSpanish ? 'es' : 'en';

  const ctaEntry = ctaFor(activityType, businessType);
  const defaultCta = ctaEntry[lang];
  const bookingCta = firstValue(slots['partner-booking-cta'], defaultCta);

  const rawBookingUrl = realContactValue(firstValue(
    slots['partner-booking-url'],
    partner?.bookingUrl as string | undefined,
    partner?.website,
  ));
  const bookingUrl = rawBookingUrl ? normalizeExternalUrl(rawBookingUrl) : '';

  const rawInstagramUrl = realContactValue(firstValue(slots['partner-instagram-url'], partner?.instagramUrl as string | undefined));
  const instagramUrl = rawInstagramUrl ? normalizeExternalUrl(rawInstagramUrl) : '';

  const rawGoogleReviewUrl = realContactValue(firstValue(slots['partner-google-review-url'], partner?.googleReviewUrl as string | undefined));
  const googleReviewUrl = rawGoogleReviewUrl ? normalizeExternalUrl(rawGoogleReviewUrl) : '';

  const partnerSlug = firstValue(slots['partner-slug'], partner?.slug);
  const magazineId  = firstValue(slots['partner-magazine-id'], partner?.magazineId as string | undefined);
  const mainIsland  = firstValue(slots['partner-main-island'], partner?.mainIsland);
  const trustLine = firstValue(partner?.aiCompanyTrustLine as string | undefined);
  const googleRating = typeof partner?.googleRating === 'number' ? partner.googleRating : undefined;
  const googleReviewCount = typeof partner?.googleReviewCount === 'number' ? partner.googleReviewCount : undefined;

  const magazineUrl = magazineId ? `${PUBLIC_ORIGIN}/magazine/${magazineId}` : '';
  const shareText = isSpanish
    ? `¡Mira mi revista de viaje${mainIsland ? ` de ${mainIsland}` : ''}!\n${magazineUrl}`
    : `Look at my travel magazine${mainIsland ? ` from ${mainIsland}` : ''}!\n${magazineUrl}`;
  const whatsappShareUrl = magazineUrl ? `https://wa.me/?text=${encodeURIComponent(shareText)}` : '';

  const cardStyle: CSSProperties = {
    position: 'absolute',
    left: 36,
    right: 36,
    bottom: 36,
    zIndex: 5,
    boxSizing: 'border-box',
    padding: '22px 26px 20px',
    borderRadius: 20,
    border: '1px solid rgba(255,255,255,0.16)',
    background: 'rgba(8, 12, 28, 0.84)',
    boxShadow: '0 18px 56px rgba(0,0,0,0.42)',
    color: ivory,
    textAlign: 'center',
    backdropFilter: 'blur(6px)',
  };

  // Shared button base — all buttons same width via parent column layout
  const btnBase: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    fontFamily: fonts.body,
    fontSize: 13,
    fontWeight: 700,
    lineHeight: 1.25,
    padding: '11px 16px',
    borderRadius: 10,
    textDecoration: 'none',
    cursor: 'pointer',
    letterSpacing: '0.01em',
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <div className="magazine-partner-card" style={cardStyle}>

      {/* Kicker */}
      <div
        className="magazine-partner-card-kicker"
        style={{
          fontFamily: fonts.body,
          fontSize: 9,
          lineHeight: 1.3,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          fontWeight: 800,
          color: 'rgba(255,255,255,0.58)',
        }}
      >
        {magazineLabel(language, 'thankYouForTravellingWith')}
      </div>

      {/* Logo — img only, never background; hidden automatically if URL fails to load */}
      {logoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt={businessName}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          style={{
            display: 'block',
            maxWidth: 110,
            maxHeight: 70,
            objectFit: 'contain',
            borderRadius: 12,
            background: '#ffffff',
            padding: 8,
            margin: '11px auto 0',
          }}
        />
      )}

      {/* Business name */}
      <div
        className="magazine-partner-card-name"
        style={{
          marginTop: logoUrl ? 9 : 12,
          fontFamily: fonts.heading,
          fontSize: nameSize(businessName.length),
          lineHeight: 1.05,
          fontWeight: 900,
          color: '#ffffff',
          overflowWrap: 'anywhere',
        }}
      >
        {businessName.toUpperCase()}
      </div>

      {/* Accent rule */}
      <div style={{ width: 44, height: 2, margin: '12px auto 10px', background: accent, borderRadius: 1, opacity: 0.9 }} />

      {mainIsland && (
        <div
          style={{
            fontFamily: fonts.body,
            fontSize: 10,
            lineHeight: 1.35,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontWeight: 800,
            color: 'rgba(255,255,255,0.60)',
            marginBottom: 8,
          }}
        >
          {mainIsland}
        </div>
      )}

      {trustLine && (
        <div
          style={{
            fontFamily: fonts.body,
            fontSize: 12,
            lineHeight: 1.45,
            fontWeight: 650,
            color: 'rgba(255,255,255,0.76)',
            margin: '0 auto 10px',
            maxWidth: 430,
          }}
        >
          {trustLine}
        </div>
      )}

      {/* CTA headline */}
      <div
        className="magazine-partner-card-cta"
        style={{
          fontFamily: fonts.body,
          fontSize: 14,
          lineHeight: 1.3,
          fontWeight: 700,
          color: ivory,
          marginBottom: 12,
          opacity: 0.92,
        }}
      >
        {bookingCta}
      </div>

      {googleRating !== undefined && (
        <div
          style={{
            margin: '-4px 0 12px',
            fontFamily: fonts.body,
            fontSize: 12,
            lineHeight: 1.35,
            fontWeight: 800,
            color: accent,
          }}
        >
          ★ {googleRating.toFixed(1)}{googleReviewCount ? ` · ${googleReviewCount} ${isSpanish ? 'reseñas' : 'reviews'}` : ''}
        </div>
      )}

      {/* Button stack — all full-width, vertically stacked */}
      <div
        className="magazine-partner-card-contact"
        style={{ display: 'flex', flexDirection: 'column', gap: 7 }}
      >
        {/* Primary: WhatsApp contact */}
        {whatsapp && whatsappLink && (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            data-track-click="booking_clicked"
            onClick={() => trackClick('booking_clicked', partnerSlug, magazineId)}
            style={{ ...btnBase, background: '#22c55e', color: '#fff', fontSize: 14, fontWeight: 800 }}
          >
            WhatsApp · {whatsapp}
          </a>
        )}

        {/* Primary: Booking / website */}
        {bookingUrl && (
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-track-click="booking_clicked"
            onClick={() => trackClick('booking_clicked', partnerSlug, magazineId)}
            style={{ ...btnBase, background: accent, color: '#14142b', fontWeight: 800 }}
          >
            {isSpanish ? 'Reservar experiencia' : 'Book experience'}
          </a>
        )}

        {/* Secondary: Instagram */}
        {instagramUrl && (
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-track-click="instagram_clicked"
            onClick={() => trackClick('instagram_clicked', partnerSlug, magazineId)}
            style={{
              ...btnBase,
              background: 'linear-gradient(135deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
              color: '#fff',
            }}
          >
            {isSpanish ? 'Ver en Instagram' : 'View Instagram'}
          </a>
        )}

        {/* Secondary: Google review — prompt text + button */}
        {googleReviewUrl && (
          <div>
            <div
              style={{
                fontFamily: fonts.body,
                fontSize: 11,
                lineHeight: 1.4,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.58)',
                marginBottom: 5,
              }}
            >
              {isSpanish
                ? '¿Te encantó la experiencia? Déjanos una reseña en Google.'
                : 'Loved the experience? Leave us a Google review.'}
            </div>
            <a
              href={googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-track-click="google_review_clicked"
              onClick={() => trackClick('google_review_clicked', partnerSlug, magazineId)}
              style={{
                ...btnBase,
                background: 'rgba(255,255,255,0.10)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.20)',
                fontSize: 12,
              }}
            >
              {isSpanish ? 'Dejar reseña en Google' : 'Leave Google review'}
            </a>
          </div>
        )}

        {/* Share magazine on WhatsApp */}
        {whatsappShareUrl && (
          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-track-click="magazine_shared_whatsapp"
            onClick={() => trackClick('magazine_shared_whatsapp', partnerSlug, magazineId)}
            style={{
              ...btnBase,
              background: 'transparent',
              color: 'rgba(255,255,255,0.60)',
              border: '1px solid rgba(255,255,255,0.18)',
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {isSpanish ? 'Compartir revista por WhatsApp' : 'Share magazine on WhatsApp'}
          </a>
        )}
      </div>

      {/* Footer */}
      <div
        className="magazine-partner-card-footer"
        style={{
          marginTop: 13,
          fontFamily: fonts.body,
          fontSize: 9,
          lineHeight: 1.4,
          fontWeight: 700,
          color: 'rgba(255,255,255,0.36)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        {magazineLabel(language, 'createdWithWanderbookCanarias')}
      </div>
    </div>
  );
}
