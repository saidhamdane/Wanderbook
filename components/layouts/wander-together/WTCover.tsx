import { LayoutProps } from '@/lib/magazine/types';
import { PageRoot, Img } from '../layout-utils';

export default function WTCover({ slots, palette, fonts }: LayoutProps) {
  return (
    <PageRoot background={palette.primary} text="#FFFFFF" body={fonts.body}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <Img src={slots.coverHeroImage} light={palette.light} required />
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.0) 30%, rgba(0,0,0,0.0) 55%, rgba(0,0,0,0.85) 100%)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '48px',
          left: '48px',
          right: '48px',
          display: 'flex',
          justifyContent: 'space-between',
          color: '#FFFFFF',
          fontFamily: fonts.body,
          fontSize: '11px',
          letterSpacing: '2px',
          textTransform: 'uppercase'
        }}
      >
        <div style={{ maxWidth: '40%' }}>
          <div style={{ marginBottom: '8px' }}>{slots.coverBullet1}</div>
          <div>{slots.coverBullet2}</div>
        </div>
        <div style={{ maxWidth: '40%', textAlign: 'right' }}>
          <div style={{ marginBottom: '8px' }}>{slots.coverBullet3}</div>
          <div>{slots.coverBullet4}</div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '180px',
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#FFFFFF'
        }}
      >
        <div
          style={{
            fontFamily: fonts.heading,
            fontWeight: 800,
            fontSize: '96px',
            letterSpacing: '8px',
            lineHeight: 1
          }}
        >
          {slots.coverTitle}
        </div>
        <div
          style={{
            fontFamily: fonts.subheading,
            fontStyle: 'italic',
            fontSize: '56px',
            marginTop: '8px',
            color: '#FFFFFF',
            lineHeight: 1
          }}
        >
          {slots.coverSubtitle}
        </div>
        <div
          style={{
            marginTop: '24px',
            fontSize: '11px',
            letterSpacing: '5px',
            color: '#FFFFFF'
          }}
        >
          {slots.coverMagazineLabel}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: '48px',
          right: '48px',
          bottom: '120px',
          color: '#FFFFFF'
        }}
      >
        <div
          style={{
            fontFamily: fonts.heading,
            fontWeight: 800,
            fontSize: '72px',
            lineHeight: 1,
            letterSpacing: '-1px'
          }}
        >
          {slots.coverDestination}
        </div>
        <div
          style={{
            marginTop: '12px',
            fontFamily: fonts.subheading,
            fontStyle: 'italic',
            fontSize: '42px',
            color: '#C9A84C',
            lineHeight: 1
          }}
        >
          {slots.coverSubdestination}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: '48px',
          bottom: '40px',
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          backgroundColor: palette.accent,
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          fontWeight: 700,
          fontFamily: fonts.body,
          letterSpacing: '1px'
        }}
      >
        {slots.coverYear}
      </div>

      <div
        style={{
          position: 'absolute',
          right: '48px',
          bottom: '48px',
          display: 'flex',
          gap: '3px'
        }}
      >
        {[3, 2, 3, 1, 2, 3, 1, 3, 2, 1, 3, 1, 2, 3].map((w, i) => (
          <div
            key={i}
            style={{
              width: w + 'px',
              height: '46px',
              backgroundColor: '#FFFFFF'
            }}
          />
        ))}
      </div>
    </PageRoot>
  );
}
