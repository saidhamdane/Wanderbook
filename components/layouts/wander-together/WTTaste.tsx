import { LayoutProps } from '@/lib/magazine/types';
import { PageRoot, Img } from '../layout-utils';

export default function WTTaste({ slots, palette, fonts }: LayoutProps) {
  const tiles = [
    { img: slots.tasteImage1, cap: slots.tasteCaption1 },
    { img: slots.tasteImage2, cap: slots.tasteCaption2 },
    { img: slots.tasteImage3, cap: slots.tasteCaption3 },
    { img: slots.tasteImage4, cap: slots.tasteCaption4 }
  ];
  return (
    <PageRoot background={palette.background} text={palette.text} body={fonts.body}>
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <div
          style={{
            width: '40%',
            padding: '80px 48px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '4px',
              color: palette.accent,
              fontWeight: 700
            }}
          >
            EAT WELL
          </div>
          <div
            style={{
              marginTop: '20px',
              fontFamily: fonts.heading,
              fontWeight: 700,
              fontSize: '32px',
              color: palette.primary,
              lineHeight: 1.15
            }}
          >
            {slots.tasteHeadline}
          </div>
          <div
            style={{
              marginTop: '18px',
              height: '1px',
              width: '40px',
              backgroundColor: palette.accent
            }}
          />
          <div
            style={{
              marginTop: '18px',
              fontFamily: fonts.body,
              fontSize: '13px',
              lineHeight: 1.8,
              color: '#4a4a4a',
              whiteSpace: 'pre-wrap'
            }}
          >
            {slots.tasteBody}
          </div>
          <div style={{ marginTop: 'auto', fontSize: '10px', letterSpacing: '3px', color: palette.accent }}>
            03 · TASTE
          </div>
        </div>
        <div
          style={{
            width: '60%',
            padding: '60px 56px 60px 0',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            gap: '12px'
          }}
        >
          {tiles.map((t, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                <Img src={t.img} light={palette.light} required={i === 0} />
              </div>
              <div
                style={{
                  marginTop: '8px',
                  fontFamily: fonts.body,
                  fontSize: '10px',
                  letterSpacing: '2.5px',
                  color: palette.primary,
                  fontWeight: 600,
                  textTransform: 'uppercase'
                }}
              >
                {t.cap}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageRoot>
  );
}
