import { getSupabaseServer } from '@/lib/supabase/server';

export type LeadStatus =
  | 'Not contacted'
  | 'Contacted'
  | 'Demo sent'
  | 'Interested'
  | 'Closed'
  | 'Not interested';

export type Lead = {
  id?: string;
  tier: string;
  business: string;
  location: string;
  phone: string;
  rating: number;
  reviews: number;
  type: string;
  wanderbookAngle: string;
  status: LeadStatus;
  notes: string;
};

type SupabaseLeadRow = {
  id: string;
  tier: string | null;
  business_name: string;
  location: string | null;
  phone: string | null;
  rating: number | null;
  reviews: number | null;
  business_type: string | null;
  wanderbook_angle: string | null;
  status: string | null;
  notes: string | null;
};

function rowToLead(row: SupabaseLeadRow): Lead {
  return {
    id: row.id,
    tier: row.tier || '',
    business: row.business_name,
    location: row.location || '',
    phone: row.phone || '',
    rating: row.rating ?? 0,
    reviews: row.reviews ?? 0,
    type: row.business_type || '',
    wanderbookAngle: row.wanderbook_angle || '',
    status: (row.status as LeadStatus) || 'Not contacted',
    notes: row.notes || '',
  };
}

export async function listLeads(): Promise<{ data: Lead[]; source: 'supabase' | 'json' }> {
  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('tier', { ascending: true })
        .order('reviews', { ascending: false });
      if (!error && data) {
        return { data: (data as SupabaseLeadRow[]).map(rowToLead), source: 'supabase' };
      }
    } catch (err) {
      console.warn('[db/leads] listLeads Supabase error:', err);
    }
  }
  const leadsJson = (await import('@/data/leads.json')).default;
  return { data: leadsJson as Lead[], source: 'json' };
}

export async function updateLeadStatus(id: string, status: LeadStatus, notes?: string): Promise<void> {
  const supabase = getSupabaseServer();
  if (!supabase) return;
  const updates: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
  if (notes !== undefined) updates.notes = notes;
  try {
    const { error } = await supabase.from('leads').update(updates).eq('id', id);
    if (error) console.warn('[db/leads] updateLeadStatus error:', error.message);
  } catch (err) {
    console.warn('[db/leads] updateLeadStatus exception:', err);
  }
}

export async function upsertLead(lead: Lead): Promise<void> {
  const supabase = getSupabaseServer();
  if (!supabase) return;
  const row: Record<string, unknown> = {
    tier: lead.tier,
    business_name: lead.business,
    location: lead.location || null,
    phone: lead.phone || null,
    rating: lead.rating || null,
    reviews: lead.reviews || null,
    business_type: lead.type || null,
    wanderbook_angle: lead.wanderbookAngle || null,
    status: lead.status || 'Not contacted',
    notes: lead.notes || null,
    updated_at: new Date().toISOString(),
  };
  if (lead.id) row.id = lead.id;
  try {
    const { error } = await supabase
      .from('leads')
      .upsert(row, { onConflict: 'business_name,phone' });
    if (error) console.warn('[db/leads] upsertLead error:', error.message);
  } catch (err) {
    console.warn('[db/leads] upsertLead exception:', err);
  }
}
