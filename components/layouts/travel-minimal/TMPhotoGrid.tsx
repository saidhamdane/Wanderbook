import { LayoutProps } from '@/lib/magazine/types';
import { PageRoot, Img } from '../layout-utils';

export default function TMPhotoGrid({ slots, palette, fonts }: LayoutProps) {
  const tiles = [
    { img: slots.gridImage1, cap: slots.gridCaption1 },
    { img: slots.gridImage2, cap: slots.gridCaption2 },
    { img: slots.gridImage3, cap: slots.gridCaption3 },
    { img: slots.gridImage4, cap: slots.gridCaption4 },
    { img: slots.gridImage5, cap: slots.gridCaption5 },
    { img: slots.gridImage6, cap: slots.gridCaption6 }
  ];
  return (
    <PageRoot background={palette.background} text={palette.text} body={fonts.body}>
      <div style={{ padding: '64px 56px 30px' }}>
        <div
          style={{
            fontSize: '11px',
            letterSpacing: '4px',
            color: palette.accent,
            fontWeight: 700
          }}
        >
          PHOTO GRID
        </div>
        <div
          style={{
            marginTop: '12px',
            fontFamily: fonts.heading,
            fontWeight: 700,
            fontSize: '40px',
            color: palette.primary,
            letterSpacing: '-1px'
          }}
        >
          Moments captured
        </div>
      </div>
      <div
        style={{
          padding: '0 56px 56px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridAutoRows: '280px',
          gap: '12px'
        }}
      >
        {tiles.map((t, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              <Img src={t.img} light={palette.light} />
            </div>
            <div
              style={{
                marginTop: '6px',
                fontSize: '10px',
                letterSpacing: '2px',
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
    </PageRoot>
  );
}
