import { LayoutProps } from '@/lib/magazine/types';
import { PageRoot, Img } from '../layout-utils';

export default function EXBackCover({ slots, palette, fonts }: LayoutProps) {
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
            'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.0) 35%, rgba(0,0,0,0.75) 100%)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '60px',
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#FFFFFF',
          fontFamily: fonts.heading,
          fontSize: '88px',
          fontWeight: 400,
          lineHeight: 1
        }}
      >
        {slots.backMagazineName || 'explore'}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: '60px',
          textAlign: 'center',
          color: '#FFFFFF',
          fontFamily: fonts.subheading,
          fontStyle: 'italic',
          fontSize: '18px',
          letterSpacing: '1px'
        }}
      >
        {slots.backTagline}
      </div>
    </PageRoot>
  );
}
