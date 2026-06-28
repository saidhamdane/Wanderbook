import { NextRequest, NextResponse } from 'next/server';
import { incrementDemoStat, type SalesDemoStatField } from '@/lib/db/sales-demos';
import { isSalesDemoToken } from '@/lib/sales-demo-token';

export const runtime = 'nodejs';

const EVENT_TO_FIELD: Record<string, SalesDemoStatField> = {
  sales_demo_opened: 'view_count',
  sales_demo_whatsapp_clicked: 'whatsapp_clicks',
  sales_demo_signup_clicked: 'signup_clicks',
};

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const token = typeof body.token === 'string' ? body.token : '';
  const event = typeof body.event === 'string' ? body.event : '';
  const field = EVENT_TO_FIELD[event];

  if (!isSalesDemoToken(token) || !field) {
    return NextResponse.json({ error: 'Invalid sales demo event' }, { status: 400 });
  }

  try {
    await incrementDemoStat(token, field);
  } catch {
    /* Tracking must not break public demo viewing. */
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
