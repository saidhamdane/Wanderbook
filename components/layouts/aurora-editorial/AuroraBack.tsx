import { LayoutProps } from '@/lib/magazine/types';
import { magazineLabel } from '@/lib/magazine/localize-magazine';
import { PartnerBackBusinessCard } from '../PartnerBackBusinessCard';

const INK = '#17191d';
const TEAL = '#0e6e66';
const SAND = '#c08a4a';
const PAPER = '#f6f3ec';

export default function AuroraBack({ slots, fonts, partner, language }: LayoutProps) {
  const partnerEnabled = slots['partner-enabled'] === 'true' || partner?.enabled === true;
  const cta = slots['partner-cta'];

  // Background priority: page photo > cover photo > safe dark fallback
  // Never use partner.logoUrl as background — it is rendered only inside PartnerBackBusinessCard
  const partnerLogoUrl = partner?.logoUrl as string | undefined;
  const backPhoto = slots['back-photo'] && slots['back-photo'] !== partnerLogoUrl
    ? slots['back-photo']
    : slots['cover-photo'] && slots['cover-photo'] !== partnerLogoUrl
      ? slots['cover-photo']
      : '';

  return (
    <div style={{ width: 794, height: 1123, position: 'relative', overflow: 'hidden', background: INK }}>
      {/* Full-bleed travel photo — never the partner logo */}
      {backPhoto ? (
        <img
          src={backPhoto}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(160deg, ${INK} 0%, #1e2d3a 50%, ${INK} 100%)`,
        }} />
      )}

      {/* Dark gradient overlay — bottom-heavy */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(180deg, rgba(23,25,29,0.42) 0%, rgba(23,25,29,0.12) 45%, rgba(23,25,29,0.82) 100%)',
      }} />

      {/* Paper warm wash at bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '36%', zIndex: 1,
        background: 'linear-gradient(to bottom, transparent, rgba(246,243,236,0.12))',
      }} />

      {!partnerEnabled && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0, right: 0,
          zIndex: 2,
          transform: 'translateY(-50%)',
          textAlign: 'center',
          padding: '0 64px',
        }}>
          {/* Teal rule above */}
          <div style={{ width: 48, height: 2, background: TEAL, margin: '0 auto 18px' }} />

          {/* Brand */}
          <div className="magazine-label magazine-copy-on-dark" style={{
            fontFamily: fonts.subheading,
            fontSize: 10,
            letterSpacing: '0.48em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.7)',
            fontWeight: 800,
            marginBottom: 20,
          }}>
            {magazineLabel(language, 'brand')}
          </div>

          {/* Back title */}
          <div style={{
            fontFamily: fonts.heading,
            fontSize: 48,
            fontWeight: 900,
            color: '#fff',
            lineHeight: 1.0,
            letterSpacing: '-0.025em',
            marginBottom: 20,
            textShadow: '0 4px 24px rgba(0,0,0,0.5)',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}>
            {slots['back-title'] || magazineLabel(language, 'untilWeTravelAgain')}
          </div>

          {cta && (
            <div className="magazine-copy magazine-copy-on-dark" style={{
              fontFamily: fonts.subheading,
              fontSize: 15,
              lineHeight: 1.45,
              color: 'rgba(255,255,255,0.86)',
              maxWidth: 420,
              margin: '0 auto 20px',
              whiteSpace: 'pre-line',
            }}>
              {cta}
            </div>
          )}

          {/* Sand rule below title */}
          <div style={{ width: 48, height: 2, background: SAND, margin: '0 auto 0' }} />
        </div>
      )}

      {/* Bottom contact line */}
      <div style={{
        position: 'absolute',
        bottom: 48,
        left: 0, right: 0,
        zIndex: 2,
        textAlign: 'center',
      }}>
        {!partnerEnabled && slots['back-contact'] && (
          <div className="magazine-caption magazine-caption-on-image" style={{
            fontFamily: fonts.subheading,
            fontSize: 9,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.52)',
            fontWeight: 600,
            whiteSpace: 'pre-line',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: partnerEnabled ? 8 : 2,
            WebkitBoxOrient: 'vertical',
          }}>
            {slots['back-contact']}
          </div>
        )}
      </div>

      {partnerEnabled && (
        <PartnerBackBusinessCard
          slots={slots}
          fonts={fonts}
          partner={partner}
          language={language}
          accent={SAND}
          ivory={PAPER}
        />
      )}

      {/* Bottom teal accent strip */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 6, zIndex: 2,
        background: `linear-gradient(90deg, ${TEAL}, ${SAND})`,
      }} />
    </div>
  );
}
