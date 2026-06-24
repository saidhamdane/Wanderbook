import { LayoutProps } from '@/lib/magazine/types';

export default function WEStory({ slots, palette, fonts }: LayoutProps) {
  return (
    <div style={{ width: 794, height: 1123, position: 'relative', overflow: 'hidden', background: palette.background }}>
      {/* Header strip */}
      <div style={{ padding: '32px 44px 20px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', overflow: 'hidden', height: 196 }}>
        <div style={{ overflow: 'hidden', flex: 1 }}>
          <div style={{ fontFamily: fonts.body, fontSize: 9, letterSpacing: 5, color: palette.accent, textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>
            The Story
          </div>
          <div style={{
            fontFamily: fonts.heading,
            fontSize: 32,
            fontWeight: 900,
            color: palette.primary,
            lineHeight: 1.05,
            letterSpacing: -0.3,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            maxHeight: '2.1em',
          }}>
            {slots['story-title'] || 'On the Road'}
          </div>
          {slots['story-lead'] && (
            <div style={{
              marginTop: 6,
              fontFamily: fonts.body,
              fontSize: 12,
              fontStyle: 'italic',
              color: '#666',
              lineHeight: 1.45,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              maxHeight: '2.9em',
            }}>
              {slots['story-lead']}
            </div>
          )}
        </div>
      </div>

      {/* Amber rule */}
      <div style={{ margin: '0 44px 20px', height: 2, background: palette.accent }} />

      {/* Main content: two columns */}
      <div style={{ padding: '0 44px', display: 'flex', gap: 28, height: 540 }}>
        {/* Left: large story photo */}
        <div style={{ flex: '0 0 52%', height: '100%', position: 'relative', overflow: 'hidden' }}>
          {slots['story-photo-1'] ? (
            <img src={slots['story-photo-1']} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: palette.light }} />
          )}
        </div>

        {/* Right: story body + two smaller photos */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}>
          {/* Body text */}
          <div style={{
            fontFamily: fonts.body,
            fontSize: 11.5,
            lineHeight: 1.85,
            color: palette.text,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 8,
            WebkitBoxOrient: 'vertical',
            maxHeight: '14.8em',
            flex: 'none',
          }}>
            {slots['story-body'] || ''}
          </div>

          {/* Two smaller photos stacked */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minHeight: 120 }}>
            {slots['story-photo-2'] && (
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <img src={slots['story-photo-2']} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
            )}
            {slots['story-photo-3'] && (
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <img src={slots['story-photo-3']} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom rule */}
      <div style={{ position: 'absolute', bottom: 24, left: 44, right: 44, height: 1, background: palette.light }} />
      <div style={{ position: 'absolute', bottom: 12, left: 44, fontFamily: fonts.body, fontSize: 8, letterSpacing: 3, color: '#bbb', textTransform: 'uppercase' }}>
        Wanderbook · The Story
      </div>
    </div>
  );
}
