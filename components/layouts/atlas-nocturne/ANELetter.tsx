import { LayoutProps } from '@/lib/magazine/types';

const champagne = '#c9a25d';
const ivory = '#fffaf0';
const paper = '#f7f1e5';
const muted = '#746e63';
const line = 'rgba(18,18,18,.16)';

export default function ANELetter({ slots, fonts }: LayoutProps) {
  const title = slots['letter-title'] || 'A quiet beginning.';
  const body = slots['letter-body'] || '';
  const sig = slots['letter-signature'] || '';

  return (
    <div style={{ width: 794, height: 1123, position: 'relative', overflow: 'hidden', background: paper }}>
      {/* Photo top-right */}
      <div style={{ position: 'absolute', right: 0, top: 0, width: 355, height: 455, overflow: 'hidden', background: '#ccc' }}>
        {slots['letter-photo'] ? (
          <img src={slots['letter-photo']} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#ddd' }} />
        )}
      </div>

      {/* White panel overlapping photo */}
      <div style={{ position: 'absolute', left: 58, top: 128, width: 430, background: ivory, padding: '42px 42px 76px', boxShadow: '0 18px 50px rgba(0,0,0,.12)' }}>
        <div className="magazine-label" style={{ fontFamily: fonts.body, fontSize: 10, fontWeight: 800, letterSpacing: '0.24em', textTransform: 'uppercase', color: muted }}>
          Editor&apos;s letter
        </div>
        <div style={{
          fontFamily: fonts.heading,
          fontSize: 42,
          fontWeight: 700,
          lineHeight: 1.06,
          letterSpacing: '-0.03em',
          color: '#121212',
          margin: '20px 0 18px',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
        }}>
          {title}
        </div>
        <div className="magazine-copy" style={{
          fontFamily: fonts.body,
          fontSize: 13,
          lineHeight: 1.55,
          color: '#26231e',
          maxHeight: 280,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 12,
          WebkitBoxOrient: 'vertical',
        }}>
          {body}
        </div>
        {/* Signature inside panel at bottom */}
        {sig && (
          <div className="magazine-caption" style={{ position: 'absolute', left: 42, bottom: 28, fontFamily: fonts.heading, fontSize: 22, fontStyle: 'italic', color: champagne, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
            {sig}
          </div>
        )}
      </div>

      {/* Horizontal rule */}
      <div style={{ position: 'absolute', left: 58, right: 58, bottom: 88, height: 1, background: line }} />

      {/* Folios */}
      <div className="magazine-label" style={{ position: 'absolute', bottom: 28, left: 58, fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: muted }}>
        Letter
      </div>
      <div className="magazine-label" style={{ position: 'absolute', bottom: 28, right: 58, fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: muted }}>
        03
      </div>
    </div>
  );
}
