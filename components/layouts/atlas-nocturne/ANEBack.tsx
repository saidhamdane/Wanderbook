import { LayoutProps } from '@/lib/magazine/types';
import { PartnerBackBusinessCard } from '../PartnerBackBusinessCard';

const champagne = '#c9a25d';
const ivory = '#fffaf0';
const black = '#070707';

export default function ANEBack({ slots, fonts, partner, language }: LayoutProps) {
  const title = slots['back-title'] || 'Until the next departure.';
  const line = slots['back-line'] || '';
  const contact = slots['back-contact'] || '';
  const partnerEnabled = slots['partner-enabled'] === 'true' || partner?.enabled === true;
  const businessName = slots['partner-business-name'];
  const cta = slots['partner-cta'];

  // Background priority: page photo > magazine cover photo > safe dark fallback
  // Never use partner.logoUrl as background — it is rendered only inside PartnerBackBusinessCard
  const partnerLogoUrl = partner?.logoUrl as string | undefined;
  const backPhoto = slots['back-photo'] && slots['back-photo'] !== partnerLogoUrl
    ? slots['back-photo']
    : slots['cover-photo'] && slots['cover-photo'] !== partnerLogoUrl
      ? slots['cover-photo']
      : '';

  return (
    <div style={{ width: 794, height: 1123, position: 'relative', overflow: 'hidden', background: black, color: ivory }}>
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
          background: 'linear-gradient(160deg, #0d1117 0%, #1a2236 50%, #0d1117 100%)',
        }} />
      )}

      {/* Overlays */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,.28), rgba(0,0,0,.78))', zIndex: 1 }} />

      {/* Decorative inner frame */}
      <div style={{ position: 'absolute', inset: 54, border: '1px solid rgba(226,201,143,.56)', zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 48 }}>
        {/* Top kicker */}
        <div className="magazine-label magazine-copy-on-dark" style={{ fontFamily: fonts.body, fontSize: 10, fontWeight: 800, letterSpacing: '0.34em', textTransform: 'uppercase', color: champagne }}>
          {partnerEnabled && businessName ? businessName : 'Atlas Nocturne'}
        </div>

        {!partnerEnabled ? (
          <div>
            <div style={{
              fontFamily: fonts.heading,
              fontSize: 52,
              fontWeight: 700,
              lineHeight: 0.92,
              letterSpacing: '-0.045em',
              color: ivory,
              maxWidth: 520,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}>
              {title}
            </div>
            {line && (
              <div className="magazine-copy magazine-copy-on-dark" style={{ maxWidth: 420, fontFamily: fonts.body, fontSize: 15, lineHeight: 1.45, color: 'rgba(255,250,240,.84)', marginTop: 20, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                {line}
              </div>
            )}
            {cta && (
              <div className="magazine-copy magazine-copy-on-dark" style={{ maxWidth: 430, fontFamily: fonts.body, fontSize: 15, lineHeight: 1.45, color: 'rgba(255,250,240,.9)', marginTop: 22, whiteSpace: 'pre-line' }}>
                {cta}
              </div>
            )}
          </div>
        ) : (
          <div />
        )}

        {/* Bottom contact */}
        {!partnerEnabled && contact && (
          <div className="magazine-caption magazine-caption-on-image" style={{ fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', lineHeight: 1.8, color: 'rgba(255,250,240,.78)', whiteSpace: 'pre-line', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: partnerEnabled ? 9 : 3, WebkitBoxOrient: 'vertical' }}>
            {contact}
          </div>
        )}
      </div>

      {partnerEnabled && (
        <PartnerBackBusinessCard
          slots={slots}
          fonts={fonts}
          partner={partner}
          accent={champagne}
          ivory={ivory}
        />
      )}
    </div>
  );
}
