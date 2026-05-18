import { LayoutProps } from '@/lib/magazine/types';
import { PageRoot, Img } from '../layout-utils';

export default function WTBackCover({ slots, palette, fonts }: LayoutProps) {
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
            'linear-gradient(180deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.0) 55%, rgba(0,0,0,0.85) 100%)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: palette.primary,
          padding: '24px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#FFFFFF'
        }}
      >
        <div
          style={{
            fontFamily: fonts.body,
            fontSize: '12px',
            letterSpacing: '4px',
            fontWeight: 700
          }}
        >
          {slots.backBrand || 'WANDER TOGETHER'}
        </div>
        <div
          style={{
            fontFamily: fonts.subheading,
            fontStyle: 'italic',
            fontSize: '13px',
            color: palette.accent
          }}
        >
          {slots.backTagline}
        </div>
      </div>
    </PageRoot>
  );
}
