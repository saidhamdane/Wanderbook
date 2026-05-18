import { LayoutProps } from '@/lib/magazine/types';
import { PageRoot, Img } from '../layout-utils';

export default function TMBackCover({ slots, palette, fonts }: LayoutProps) {
  return (
    <PageRoot background={palette.background} text="#FFFFFF" body={fonts.body}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <Img src={slots.backImage} light={palette.light} required />
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.0) 40%, rgba(0,0,0,0.8) 100%)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: '70px',
          textAlign: 'center',
          color: '#FFFFFF'
        }}
      >
        <div
          style={{
            fontFamily: fonts.heading,
            fontWeight: 700,
            fontSize: '14px',
            letterSpacing: '6px',
            color: palette.accent
          }}
        >
          WANDERBOOK
        </div>
        <div
          style={{
            marginTop: '14px',
            fontFamily: fonts.body,
            fontSize: '14px',
            lineHeight: 1.5,
            color: '#FFFFFF',
            maxWidth: '480px',
            margin: '14px auto 0'
          }}
        >
          {slots.backTagline}
        </div>
      </div>
    </PageRoot>
  );
}
