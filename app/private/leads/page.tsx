import { headers } from 'next/headers';
import { publicOriginFromEnvOrHost } from '@/lib/partner-utils';
import { listLeads } from '@/lib/db/leads';
import LeadsClient from './LeadsClient';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function PrivateLeadsPage() {
  const publicOrigin = publicOriginFromEnvOrHost(headers().get('x-forwarded-host') || headers().get('host') || undefined);
  const demoLink = `${publicOrigin}/partner/turfuerte`;

  const { data: leads, source } = await listLeads();

  return <LeadsClient leads={leads} demoLink={demoLink} dbSource={source} />;
}
