import { LayoutProps } from '@/lib/magazine/types';
import { PageRoot, Img } from '../layout-utils';

export default function WTMemories({ slots, palette, fonts }: LayoutProps) {
  return (
    <PageRoot background={palette.background} text={palette.text} body={fonts.body}>
      <div style={{ padding: '60px 48px 24px' }}>
        <div
          style={{
            fontSize: '11px',
            letterSpacing: '4px',
            color: palette.accent,
            fontWeight: 700
          }}
        >
          OUR FAVORITE MOMENTS
        </div>
        <div
          style={{
            marginTop: '12px',
            fontFamily: fonts.heading,
            fontWeight: 700,
            fontSize: '32px',
            color: palette.primary,
            lineHeight: 1.1
          }}
        >
          {slots.memoriesHeadline}
        </div>
      </div>
      <div
        style={{
          padding: '0 48px',
          display: 'grid',
          gridTemplateColumns: '60% 40%',
          gap: '12px',
          height: '340px'
        }}
      >
        <div style={{ position: 'relative' }}>
          <Img src={slots.mem1} light={palette.light} required />
        </div>
        <div style={{ position: 'relative' }}>
          <Img src={slots.mem2} light={palette.light} />
        </div>
      </div>
      <div
        style={{
          padding: '12px 48px 60px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '12px',
          height: '380px',
          marginTop: '12px'
        }}
      >
        <div style={{ position: 'relative' }}>
          <Img src={slots.mem3} light={palette.light} />
        </div>
        <div style={{ position: 'relative' }}>
          <Img src={slots.mem4} light={palette.light} />
        </div>
        <div style={{ position: 'relative' }}>
          <Img src={slots.mem5} light={palette.light} />
        </div>
      </div>
    </PageRoot>
  );
}
