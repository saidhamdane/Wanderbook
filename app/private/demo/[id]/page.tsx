import { notFound, redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';
import { loadMagazine } from '@/lib/magazine/store';
import { AdminDemoToolbar } from '@/components/magazine/AdminDemoToolbar';
import { InteractiveFlipbookViewer } from '@/components/magazine/InteractiveFlipbookViewer';
import { PdfLockedBadge } from '@/components/magazine/PdfLockedBadge';

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
    <main style={{ minHeight: '100vh', background: '#0f172a', color: '#fff', overflowX: 'hidden' }}>
      <AdminDemoToolbar businessName={businessName} activityType={activityType} year={year} />
      <PdfLockedBadge language={doc.language} />
      <InteractiveFlipbookViewer magazine={doc} />
    </main>
  );
}
