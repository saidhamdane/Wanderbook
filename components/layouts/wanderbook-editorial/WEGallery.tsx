import { LayoutProps } from '@/lib/magazine/types';

function Photo({ src, light, style }: { src?: string; light: string; style: React.CSSProperties }) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', ...style }}>
      {src ? (
        <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', background: light }} />
      )}
    </div>
  );
}

function Caption({ text, palette, fonts }: { text?: string; palette: LayoutProps['palette']; fonts: LayoutProps['fonts'] }) {
  if (!text) return null;
  return (
    <div style={{
      fontFamily: fonts.body,
      fontSize: 8.5,
      letterSpacing: 1.5,
      color: palette.accent,
      textTransform: 'uppercase',
      marginTop: 5,
      overflow: 'hidden',
      display: '-webkit-box',
      WebkitLineClamp: 1,
      WebkitBoxOrient: 'vertical',
    }}>
      {text}
    </div>
  );
}

export default function WEGallery({ slots, palette, fonts }: LayoutProps) {
  const GAP = 5;
  const PAD = 36;
  const innerW = 794 - PAD * 2;
  const innerH = 1123 - 80 - 50; // top header, bottom footer

  const topH = Math.round(innerH * 0.52);
  const botH = innerH - topH - GAP;
  const leftW = Math.round(innerW * 0.58);
  const rightW = innerW - leftW - GAP;
  const bot1W = Math.round(innerW * 0.33);
  const bot2W = Math.round(innerW * 0.33);
  const bot3W = innerW - bot1W - bot2W - GAP * 2;

  return (
    <div style={{ width: 794, height: 1123, position: 'relative', overflow: 'hidden', background: palette.background }}>
      {/* Header */}
      <div style={{ padding: '28px 36px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontFamily: fonts.heading, fontSize: 28, fontWeight: 900, color: palette.primary, textTransform: 'uppercase', letterSpacing: 1 }}>
          Gallery
        </div>
        <div style={{ fontFamily: fonts.body, fontSize: 9, letterSpacing: 4, color: palette.accent, textTransform: 'uppercase' }}>
          Wanderbook
        </div>
      </div>
      <div style={{ margin: '0 36px 16px', height: 2, background: palette.accent }} />

      {/* Photo mosaic */}
      <div style={{ padding: `0 ${PAD}px` }}>
        {/* Top row */}
        <div style={{ display: 'flex', gap: GAP, marginBottom: GAP }}>
          <div style={{ flex: `0 0 ${leftW}px` }}>
            <Photo src={slots['gallery-photo-1']} light={palette.light} style={{ width: leftW, height: topH }} />
            <Caption text={slots['gallery-caption-1']} palette={palette} fonts={fonts} />
          </div>
          <div style={{ flex: `0 0 ${rightW}px` }}>
            <Photo src={slots['gallery-photo-2']} light={palette.light} style={{ width: rightW, height: topH }} />
            <Caption text={slots['gallery-caption-2']} palette={palette} fonts={fonts} />
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: 'flex', gap: GAP }}>
          <div style={{ flex: `0 0 ${bot1W}px` }}>
            <Photo src={slots['gallery-photo-3']} light={palette.light} style={{ width: bot1W, height: botH }} />
            <Caption text={slots['gallery-caption-3']} palette={palette} fonts={fonts} />
          </div>
          <div style={{ flex: `0 0 ${bot2W}px` }}>
            <Photo src={slots['gallery-photo-4']} light={palette.light} style={{ width: bot2W, height: botH }} />
            <Caption text={slots['gallery-caption-4']} palette={palette} fonts={fonts} />
          </div>
          <div style={{ flex: `0 0 ${bot3W}px` }}>
            <Photo src={slots['gallery-photo-5']} light={palette.light} style={{ width: bot3W, height: botH }} />
            <Caption text={slots['gallery-caption-5']} palette={palette} fonts={fonts} />
          </div>
        </div>
      </div>
    </div>
  );
}
