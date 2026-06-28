import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { updateLeadStatus, type LeadStatus } from '@/lib/db/leads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID_STATUSES: LeadStatus[] = [
  'Not contacted',
  'Contacted',
  'Demo sent',
  'Interested',
  'Closed',
  'Not interested',
];

export async function PATCH(req: NextRequest) {
  if (!getAdminSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { id?: string; status?: string; notes?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { id, status, notes } = body;
  if (!id || !status) {
    return NextResponse.json({ error: 'id and status are required' }, { status: 400 });
  }
  if (!VALID_STATUSES.includes(status as LeadStatus)) {
    return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
  }

  await updateLeadStatus(id, status as LeadStatus, notes);
  return NextResponse.json({ ok: true });
}
