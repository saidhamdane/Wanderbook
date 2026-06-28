import { loadMagazine } from '@/lib/magazine/store';
import { InteractiveFlipbookViewer } from '@/components/magazine/InteractiveFlipbookViewer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function FlipbookTestPage({
  params,
}: {
  params: { id: string };
}) {
  const doc = await loadMagazine(params.id);

  if (!doc || doc.isAdminDemo) {
    return (
      <main style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f172a',
        color: '#fff',
        fontFamily: 'system-ui, sans-serif',
      }}>
        <p style={{ margin: 0, fontSize: 18 }}>Magazine not found</p>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0f172a', color: '#fff' }}>
      <header
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.14)',
          color: '#fde68a',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}
      >
        Flipbook test
      </header>
      <InteractiveFlipbookViewer magazine={doc} />
    </main>
  );
}
