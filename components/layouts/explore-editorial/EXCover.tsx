import { LayoutProps } from '@/lib/magazine/types';
import { PageRoot, Img } from '../layout-utils';

export default function EXCover({ slots, palette, fonts }: LayoutProps) {
  return (
    <PageRoot background={palette.primary} text="#FFFFFF" body={fonts.body}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <Img src={slots.coverImage} light={palette.light} required />
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.05) 25%, rgba(0,0,0,0.0) 55%, rgba(0,0,0,0.7) 100%)'
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '48px',
          left: '60px',
          right: '60px',
          display: 'flex',
          justifyContent: 'space-between',
          color: '#FFFFFF',
          fontSize: '11px',
          letterSpacing: '3px',
          fontFamily: fonts.body
        }}
      >
        <span>{slots.coverVolume || 'VOLUME 01 · 2026'}</span>
        <span>{slots.coverSubtitle || 'Magazine'}</span>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '110px',
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#FFFFFF',
          fontFamily: fonts.heading,
          fontWeight: 400,
          fontSize: '140px',
          letterSpacing: '-2px',
          lineHeight: 1
        }}
      >
        {slots.coverMagazineName || 'explore'}
      </div>

      <div
        style={{
          position: 'absolute',
          left: '60px',
          bottom: '180px',
          color: '#FFFFFF',
          fontSize: '11px',
          letterSpacing: '3px',
          fontFamily: fonts.body
        }}
      >
        <div style={{ marginBottom: '8px', color: palette.accent }}>01 · {slots.coverHighlight1}</div>
        <div style={{ marginBottom: '8px', color: palette.accent }}>02 · {slots.coverHighlight2}</div>
        <div style={{ color: palette.accent }}>03 · {slots.coverHighlight3}</div>
      </div>

      <div
        style={{
          position: 'absolute',
          right: '60px',
          bottom: '180px',
          color: '#FFFFFF',
          textAlign: 'right'
        }}
      >
        <div
          style={{
            fontFamily: fonts.heading,
            fontWeight: 700,
            fontSize: '60px',
            lineHeight: 0.9,
            color: palette.accent
          }}
        >
          {slots.coverStatNumber}
        </div>
        <div
          style={{
            marginTop: '4px',
            fontSize: '11px',
            letterSpacing: '3px',
            fontFamily: fonts.body
          }}
        >
          {slots.coverStatLabel}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: '60px',
          right: '60px',
          bottom: '60px',
          textAlign: 'center',
          color: '#FFFFFF',
          fontFamily: fonts.subheading,
          fontStyle: 'italic',
          fontSize: '26px',
          lineHeight: 1.3
        }}
      >
        {slots.coverMainTitle}
      </div>
    </PageRoot>
  );
}
