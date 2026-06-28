import { notFound, redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';
import { loadMagazine } from '@/lib/magazine/store';
import { MagazineRenderer } from '@/components/MagazineRenderer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function AdminDemoPreviewPage({ params }: { params: { id: string } }) {
  if (!getAdminSession()) {
    redirect('/private/leads');
  }

  const doc = await loadMagazine(params.id);
  if (!doc || !doc.isAdminDemo) notFound();

  const activityType = doc.generationAudit?.resolvedActivityType || doc.partner?.resolvedActivityType || 'demo';
  const businessName = doc.partner?.businessName || doc.familyName || 'Admin demo';
  const year = new Date(doc.createdAt ?? doc.generatedAt).getFullYear();

  return (
    <main style={{ minHeight: '100vh', background: '#e8e8e8' }}>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
          padding: '12px 18px',
          borderBottom: '1px solid rgba(146,64,14,0.28)',
          background: '#f59e0b',
          color: '#111827',
          fontFamily: 'Arial, sans-serif',
          boxShadow: '0 8px 22px rgba(15,23,42,0.16)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span
            style={{
              borderRadius: 999,
              background: '#111827',
              color: '#fff',
              padding: '7px 11px',
              fontSize: 12,
              fontWeight: 900,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
            }}
          >
            DEMO PREVIEW
          </span>
          <strong style={{ fontSize: 15 }}>{businessName}</strong>
          <span style={{ fontSize: 13, fontWeight: 700 }}>{activityType} - {year}</span>
        </div>
        <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Admin only - Not shareable - No PDF - No live CTA
        </span>
      </header>
      <MagazineRenderer doc={doc} />
    </main>
  );
}
