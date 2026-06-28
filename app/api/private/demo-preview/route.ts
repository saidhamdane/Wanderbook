import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { loadMagazine, saveMagazine } from '@/lib/magazine/store';
import { buildAdminDemoMagazine } from '@/lib/magazine/build-demo-magazine';
import {
  demoIdForLead,
  normalizeAdminDemoLead,
} from '@/lib/magazine/admin-demo-preview';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  if (!getAdminSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const lead = normalizeAdminDemoLead(body);
  if (!lead) {
    return NextResponse.json({ error: 'business and type are required' }, { status: 400 });
  }

  const existing = await loadMagazine(demoIdForLead(lead));
  if (existing?.isAdminDemo) {
    return NextResponse.json({ id: existing.id });
  }

  const doc = await buildAdminDemoMagazine(lead);
  await saveMagazine(doc);
  return NextResponse.json({ id: doc.id });
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
