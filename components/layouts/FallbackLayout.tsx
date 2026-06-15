import { LayoutProps } from '@/lib/magazine/types';
import { PAGE_W, PAGE_H, Img } from './layout-utils';

// Renders any unknown layout gracefully: shows the first photo slot it finds
// and the first text slot as a title. Never shows an error to the user.
export default function FallbackLayout({ slots, palette, fonts }: LayoutProps) {
  const photoUrl = Object.entries(slots).find(([, v]) => v?.startsWith('http') || v?.startsWith('/'))?.[1];
  const textEntry = Object.entries(slots).find(([k, v]) => v && !v.startsWith('http') && !v.startsWith('/') && k.includes('title'));
  const title = textEntry?.[1] ?? '';

  return (
    <div style={{
      width: PAGE_W,
      height: PAGE_H,
      position: 'relative',
      overflow: 'hidden',
      background: palette.background,
      color: palette.text,
      fontFamily: fonts.body,
    }}>
      {photoUrl && (
        <div style={{ position: 'absolute', inset: 0 }}>
          <Img src={photoUrl} light={palette.light ?? '#f5f5f5'} />
        </div>
      )}
      {photoUrl && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)',
        }} />
      )}
      {title && (
        <div style={{
          position: 'absolute', bottom: 60, left: 48, right: 48,
          fontFamily: fonts.heading,
          fontSize: 48,
          fontWeight: 800,
          color: photoUrl ? '#fff' : palette.text,
          lineHeight: 1.1,
        }}>
          {title}
        </div>
      )}
    </div>
  );
}
