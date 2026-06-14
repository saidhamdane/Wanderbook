import type { CSSProperties } from 'react';
import type { LayoutProps } from '@/lib/magazine/types';
import { magazineLabel } from '@/lib/magazine/localize-magazine';
import { formatPartnerWebsiteDisplay, formatSpanishWhatsapp, getPartnerBookingCta } from '@/lib/partner-utils';

type PartnerBackBusinessCardProps = {
  slots: Record<string, string>;
  fonts: LayoutProps['fonts'];
  partner?: LayoutProps['partner'];
  language?: string;
  accent?: string;
  ivory?: string;
};

function firstValue(...values: Array<string | undefined>): string {
  return values.find((value) => value && value.trim().length > 0)?.trim() || '';
}

function businessNameSize(name: string): number {
  if (name.length <= 18) return 58;
  if (name.length <= 28) return 50;
  return 42;
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

  const rawWhatsapp = firstValue(slots['partner-whatsapp'], partner?.whatsapp);
  const whatsapp = firstValue(slots['partner-whatsapp-display'], rawWhatsapp ? formatSpanishWhatsapp(rawWhatsapp) : '');
  const rawWebsite = firstValue(slots['partner-website'], partner?.website);
  const website = firstValue(slots['partner-website-display'], formatPartnerWebsiteDisplay(rawWebsite));
  const businessType = firstValue(slots['partner-business-type'], partner?.businessType);
  const bookingCta = firstValue(
    slots['partner-booking-cta'],
    getPartnerBookingCta({ businessType, businessName, website: rawWebsite }),
  );
  const hasContact = Boolean(whatsapp || website);
  const nameSize = businessNameSize(businessName);

  const cardStyle: CSSProperties = {
    position: 'absolute',
    left: 82,
    right: 82,
    bottom: 72,
    zIndex: 5,
    boxSizing: 'border-box',
    padding: '38px 42px 36px',
    borderRadius: 18,
    border: '1px solid rgba(255,255,255,0.25)',
    background: 'rgba(5, 10, 26, 0.65)',
    boxShadow: '0 26px 80px rgba(0,0,0,0.42)',
    color: ivory,
    textAlign: 'center',
    backdropFilter: 'blur(2px)',
  };

  return (
    <div className="magazine-partner-card" style={cardStyle}>
      <div
        className="magazine-partner-card-kicker"
        style={{
          fontFamily: fonts.body,
          fontSize: 13,
          lineHeight: 1.35,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          fontWeight: 800,
          color: 'rgba(255,255,255,0.78)',
        }}
      >
        {magazineLabel(language, 'thankYouForTravellingWith')}
      </div>

      <div
        className="magazine-partner-card-name"
        style={{
          marginTop: 14,
          fontFamily: fonts.heading,
          fontSize: nameSize,
          lineHeight: 0.98,
          fontWeight: 900,
          color: '#fff',
          textShadow: '0 4px 24px rgba(0,0,0,0.55)',
          overflowWrap: 'anywhere',
          wordBreak: 'normal',
        }}
      >
        {businessName.toUpperCase()}
      </div>

      <div style={{ width: 74, height: 2, margin: '24px auto 22px', background: accent }} />

      <div
        className="magazine-partner-card-cta"
        style={{
          fontFamily: fonts.body,
          fontSize: 23,
          lineHeight: 1.35,
          fontWeight: 800,
          color: ivory,
        }}
      >
        {bookingCta}
        {hasContact ? ':' : ''}
      </div>

      <div
        className="magazine-partner-card-contact"
        style={{
          marginTop: 12,
          display: 'grid',
          gap: 8,
          fontFamily: fonts.body,
          fontSize: 21,
          lineHeight: 1.35,
          fontWeight: 600,
          color: 'rgba(255,255,255,0.94)',
        }}
      >
        {whatsapp && <div>{magazineLabel(language, 'whatsapp')}: {whatsapp}</div>}
        {website && <div>{magazineLabel(language, 'website')}: {website}</div>}
      </div>

      <div
        className="magazine-partner-card-footer"
        style={{
          marginTop: 26,
          fontFamily: fonts.body,
          fontSize: 15,
          lineHeight: 1.4,
          fontWeight: 700,
          color: 'rgba(255,255,255,0.72)',
        }}
      >
        {magazineLabel(language, 'createdWithWanderbookCanarias')}
      </div>
    </div>
  );
}
