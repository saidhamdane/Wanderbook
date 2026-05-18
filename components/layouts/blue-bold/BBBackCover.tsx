import { LayoutProps } from '@/lib/magazine/types';
import { PageRoot, Img } from '../layout-utils';

export default function BBBackCover({ slots, palette, fonts }: LayoutProps) {
  return (
    <PageRoot background={palette.primary} text="#FFFFFF" body={fonts.body}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <Img src={slots.backImage} light={palette.light} required />
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.0) 50%, rgba(0,0,0,0.85) 100%)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          padding: '40px 64px',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end'
        }}
      >
        <div
          style={{
            fontFamily: fonts.heading,
            fontWeight: 900,
            fontSize: '88px',
            lineHeight: 0.9,
            letterSpacing: '-2px'
          }}
        >
          {slots.backBrand || 'TRAVEL'}
        </div>
        <div
          style={{
            maxWidth: '320px',
            textAlign: 'right',
            fontFamily: fonts.body,
            fontSize: '13px',
            lineHeight: 1.5,
            color: palette.accent
          }}
        >
          {slots.backTagline}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: '8px',
          backgroundColor: palette.accent
        }}
      />
    </PageRoot>
  );
}
