import { NextResponse } from 'next/server';
import { getPublicPartnerBySlug } from '@/lib/partner-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const partner = getPublicPartnerBySlug(params.slug);
  if (!partner) return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
  return NextResponse.json(partner);
}
