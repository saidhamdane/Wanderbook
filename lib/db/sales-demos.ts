import 'server-only';
import { getSupabaseServer } from '@/lib/supabase/server';

export type SalesDemoRow = {
  id: string;
  token: string;
  lead_id: string | null;
  business_name: string;
  magazine_id: string;
  expires_at: string;
  view_count: number;
  whatsapp_clicks: number;
  signup_clicks: number;
  created_at: string;
};

export type SalesDemoStatField = 'view_count' | 'whatsapp_clicks' | 'signup_clicks';

export async function createSalesDemo(params: {
  token: string;
  leadId?: string;
  businessName: string;
  magazineId: string;
  expiresAt: Date;
}): Promise<SalesDemoRow> {
  const supabase = getSupabaseServer();
  if (!supabase) throw new Error('Sales demos require Supabase.');

  const { data, error } = await supabase
    .from('sales_demos')
    .insert({
      token: params.token,
      lead_id: params.leadId || null,
      business_name: params.businessName,
      magazine_id: params.magazineId,
      expires_at: params.expiresAt.toISOString(),
    })
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Unable to create sales demo.');
  }

  return data as SalesDemoRow;
}

export async function getSalesDemoByToken(token: string): Promise<SalesDemoRow | null> {
  const supabase = getSupabaseServer();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('sales_demos')
    .select('id,token,lead_id,business_name,magazine_id,expires_at,view_count,whatsapp_clicks,signup_clicks,created_at')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();

  if (error || !data) return null;
  return data as SalesDemoRow;
}

export async function getActiveSalesDemoByLeadId(leadId: string): Promise<SalesDemoRow | null> {
  const supabase = getSupabaseServer();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('sales_demos')
    .select('id,token,lead_id,business_name,magazine_id,expires_at,view_count,whatsapp_clicks,signup_clicks,created_at')
    .eq('lead_id', leadId)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return data as SalesDemoRow;
}

export async function incrementDemoStat(token: string, field: SalesDemoStatField): Promise<void> {
  const supabase = getSupabaseServer();
  if (!supabase) return;

  await supabase.rpc('increment_sales_demo_stat', {
    p_token: token,
    p_field: field,
  });
}

export async function listSalesDemosByLeadId(leadId: string): Promise<SalesDemoRow[]> {
  const rows = await listSalesDemosByLeadIds([leadId]);
  return rows.filter((row) => row.lead_id === leadId);
}

export async function listSalesDemosByLeadIds(leadIds: string[]): Promise<SalesDemoRow[]> {
  const supabase = getSupabaseServer();
  const ids = leadIds.filter(Boolean);
  if (!supabase || ids.length === 0) return [];

  const { data, error } = await supabase
    .from('sales_demos')
    .select('id,token,lead_id,business_name,magazine_id,expires_at,view_count,whatsapp_clicks,signup_clicks,created_at')
    .in('lead_id', ids)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data as SalesDemoRow[];
}
