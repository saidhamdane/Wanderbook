import { headers } from 'next/headers';
import { getAdminSession } from '@/lib/admin-auth';
import { publicOriginFromEnvOrHost } from '@/lib/partner-utils';
import { listLeads } from '@/lib/db/leads';
import AdminLogin from './AdminLogin';
import LeadsClient from './LeadsClient';
import LogoutButton from './LogoutButton';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function PrivateLeadsPage() {
  if (!getAdminSession()) {
    return <AdminLogin />;
  }

  const publicOrigin = publicOriginFromEnvOrHost(headers().get('x-forwarded-host') || headers().get('host') || undefined);
  const demoLink = `${publicOrigin}/partner/turfuerte`;

  const { data: leads, source } = await listLeads();

  return (
    <LeadsClient leads={leads} demoLink={demoLink} dbSource={source}>
      <LogoutButton />
    </LeadsClient>
  );
}
