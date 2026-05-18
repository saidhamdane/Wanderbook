import { LayoutProps } from '@/lib/magazine/types';
import { PageRoot, Img } from '../layout-utils';

export default function EXRegion({ slots, palette, fonts }: LayoutProps) {
  return (
    <PageRoot background={palette.background} text={palette.text} body={fonts.body}>
      <div style={{ height: '480px', position: 'relative' }}>
        <Img src={slots.regionHeroImage} light={palette.light} required />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.0) 60%, rgba(0,0,0,0.65) 100%)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '60px',
            right: '60px',
            bottom: '40px',
            color: '#FFFFFF'
          }}
        >
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '4px',
              color: palette.accent,
              fontWeight: 600
            }}
          >
            REGION
          </div>
          <div
            style={{
              marginTop: '8px',
              fontFamily: fonts.heading,
              fontWeight: 500,
              fontSize: '64px',
              lineHeight: 1,
              letterSpacing: '-1px'
            }}
          >
            {slots.regionName}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', padding: '50px 60px', gap: '40px' }}>
        <div
          style={{
            flex: 1,
            fontFamily: fonts.body,
            fontSize: '13px',
            lineHeight: 1.9,
            color: palette.text,
            whiteSpace: 'pre-wrap'
          }}
        >
          {slots.regionBody}
        </div>
        <div style={{ width: '240px', height: '320px', position: 'relative', overflow: 'hidden' }}>
          <Img src={slots.regionSecondaryImage} light={palette.light} />
        </div>
      </div>
    </PageRoot>
  );
}
