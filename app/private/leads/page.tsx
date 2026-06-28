import { headers } from 'next/headers';
import { getAdminSession } from '@/lib/admin-auth';
import { publicOriginFromEnvOrHost } from '@/lib/partner-utils';
import { listLeads } from '@/lib/db/leads';
import { listSalesDemosByLeadIds } from '@/lib/db/sales-demos';
import AdminLogin from './AdminLogin';
import LeadsClient, { type SalesDemoState } from './LeadsClient';
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
  const salesDemoRows = await listSalesDemosByLeadIds(leads.map((lead) => lead.id).filter(Boolean) as string[]);
  const initialSalesDemos: Record<string, SalesDemoState> = {};

  for (const row of salesDemoRows) {
    const lead = leads.find((item) => item.id === row.lead_id);
    if (!lead) continue;
    const key = `${lead.business}::${lead.phone}`;
    if (initialSalesDemos[key]) continue;
    initialSalesDemos[key] = {
      token: row.token,
      expiresAt: row.expires_at,
      viewCount: row.view_count,
      whatsappClicks: row.whatsapp_clicks,
      signupClicks: row.signup_clicks,
    };
  }

  return (
    <LeadsClient leads={leads} demoLink={demoLink} publicOrigin={publicOrigin} initialSalesDemos={initialSalesDemos} dbSource={source}>
      <LogoutButton />
    </LeadsClient>
  );
}
