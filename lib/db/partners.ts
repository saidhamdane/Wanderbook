import { getSupabaseServer } from '@/lib/supabase/server';
import {
  type PartnerAccount,
  type PublicPartner,
  getPartnerAccountById,
  getPartnerAccountBySlug,
  listPartnerAccounts,
  updatePartnerAccount,
} from '@/lib/partner-store';
import { isValidLogoSrc } from '@/lib/partner-utils';
import type { PartnerSessionPayload } from '@/lib/auth/partner-session';

type SupabasePartnerRow = {
  id: string;
  slug: string;
  business_name: string;
  business_type: string | null;
  main_island: string | null;
  whatsapp: string | null;
  website: string | null;
  logo_url: string | null;
  branding_note: string | null;
  preferred_template_id: string | null;
  plan: string;
  subscription_status: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  email: string | null;
  password_hash: string | null;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
};

function rowToPartialAccount(row: SupabasePartnerRow): Partial<PartnerAccount> {
  return {
    id: row.id,
    slug: row.slug,
    email: row.email || '',
    businessName: row.business_name,
    businessType: row.business_type || '',
    mainIsland: row.main_island || '',
    whatsapp: row.whatsapp || '',
    website: row.website || undefined,
    logoUrl: row.logo_url || undefined,
    brandingNote: row.branding_note || undefined,
    preferredTemplateId: row.preferred_template_id || undefined,
    plan: (row.plan as PartnerAccount['plan']) || 'free',
    subscriptionStatus: (row.subscription_status as PartnerAccount['subscriptionStatus']) || 'none',
    stripeCustomerId: row.stripe_customer_id || undefined,
    stripeSubscriptionId: row.stripe_subscription_id || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function accountToRow(partner: PartnerAccount): Record<string, unknown> {
  return {
    id: partner.id,
    slug: partner.slug,
    business_name: partner.businessName,
    business_type: partner.businessType || null,
    main_island: partner.mainIsland || null,
    whatsapp: partner.whatsapp || null,
    website: partner.website || null,
    logo_url: partner.logoUrl || null,
    branding_note: partner.brandingNote || null,
    preferred_template_id: partner.preferredTemplateId || null,
    plan: partner.plan,
    subscription_status: partner.subscriptionStatus,
    stripe_customer_id: partner.stripeCustomerId || null,
    stripe_subscription_id: partner.stripeSubscriptionId || null,
    email: partner.email ? partner.email.toLowerCase() : null,
    updated_at: new Date().toISOString(),
  };
}

export async function getPartnerById(id: string): Promise<PartnerAccount | null> {
  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (!error && data) {
        const jsonPartner = getPartnerAccountBySlug((data as SupabasePartnerRow).slug);
        if (jsonPartner) {
          return { ...jsonPartner, ...rowToPartialAccount(data as SupabasePartnerRow) } as PartnerAccount;
        }
        return rowToPartialAccount(data as SupabasePartnerRow) as PartnerAccount;
      }
    } catch (err) {
      console.warn('[db/partners] getPartnerById error:', err);
    }
  }
  return getPartnerAccountById(id);
}

export async function getPartnerBySlug(slug: string): Promise<PartnerAccount | null> {
  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      if (!error && data) {
        const jsonPartner = getPartnerAccountBySlug(slug);
        if (jsonPartner) {
          return { ...jsonPartner, ...rowToPartialAccount(data as SupabasePartnerRow) } as PartnerAccount;
        }
        return rowToPartialAccount(data as SupabasePartnerRow) as PartnerAccount;
      }
    } catch (err) {
      console.warn('[db/partners] getPartnerBySlug error:', err);
    }
  }
  return getPartnerAccountBySlug(slug);
}

export async function upsertPartner(partner: PartnerAccount): Promise<void> {
  const supabase = getSupabaseServer();
  if (!supabase) return;
  try {
    const { error } = await supabase
      .from('partners')
      .upsert(accountToRow(partner), { onConflict: 'slug' });
    if (error) console.warn('[db/partners] upsertPartner error:', error.message);
  } catch (err) {
    console.warn('[db/partners] upsertPartner exception:', err);
  }
}

export async function updatePartnerBillingInSupabase(
  slug: string,
  billing: {
    plan?: string;
    subscriptionStatus?: string;
    stripeCustomerId?: string | null;
    stripeSubscriptionId?: string | null;
  }
): Promise<void> {
  const supabase = getSupabaseServer();
  if (!supabase) return;
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (billing.plan !== undefined) updates.plan = billing.plan;
  if (billing.subscriptionStatus !== undefined) updates.subscription_status = billing.subscriptionStatus;
  if (billing.stripeCustomerId !== undefined) updates.stripe_customer_id = billing.stripeCustomerId;
  if (billing.stripeSubscriptionId !== undefined) updates.stripe_subscription_id = billing.stripeSubscriptionId;
  try {
    const { error } = await supabase.from('partners').update(updates).eq('slug', slug);
    if (error) console.warn('[db/partners] updatePartnerBillingInSupabase error:', error.message);
  } catch (err) {
    console.warn('[db/partners] updatePartnerBillingInSupabase exception:', err);
  }
}

export async function updatePartner(slug: string, updates: Record<string, unknown>): Promise<void> {
  const supabase = getSupabaseServer();
  if (!supabase) return;
  try {
    const { error } = await supabase
      .from('partners')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('slug', slug);
    if (error) console.warn('[db/partners] updatePartner error:', error.message);
  } catch (err) {
    console.warn('[db/partners] updatePartner exception:', err);
  }
}

export async function updatePartnerProfile(
  slug: string,
  data: {
    business_name?: string;
    business_type?: string | null;
    main_island?: string | null;
    whatsapp?: string | null;
    website?: string | null;
    logo_url?: string | null;
    branding_note?: string | null;
    preferred_template_id?: string | null;
  }
): Promise<{ error?: string }> {
  const supabase = getSupabaseServer();
  if (!supabase) return {};
  try {
    const { error } = await supabase
      .from('partners')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('slug', slug);
    if (error) {
      console.error('[db/partners] updatePartnerProfile error:', error.message);
      return { error: error.message };
    }
    return {};
  } catch (err) {
    console.error('[db/partners] updatePartnerProfile exception:', err);
    return { error: String(err) };
  }
}

type ProfileFields = {
  businessName: string;
  businessType?: string;
  mainIsland?: string;
  whatsapp?: string;
  website?: string;
  logoUrl?: string;
  brandingNote?: string;
  preferredTemplateId?: string;
};

/**
 * Update profile fields for the currently logged-in partner.
 * Resolves the partner row by slug → id → email (in order of availability).
 * Never touches password_hash, email, plan, subscription_status, or Stripe fields.
 */
export async function updatePartnerProfileFromSession(
  session: Pick<PartnerSessionPayload, 'partnerSlug' | 'partnerId' | 'email'>,
  fields: ProfileFields
): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabaseServer();

  const row: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (fields.businessName !== undefined) row.business_name = fields.businessName;
  if (fields.businessType !== undefined) row.business_type = fields.businessType || null;
  if (fields.mainIsland !== undefined) row.main_island = fields.mainIsland || null;
  if (fields.whatsapp !== undefined) row.whatsapp = fields.whatsapp || null;
  if (fields.website !== undefined) row.website = fields.website || null;
  if (fields.logoUrl !== undefined) row.logo_url = fields.logoUrl || null;
  if (fields.brandingNote !== undefined) row.branding_note = fields.brandingNote || null;
  if (fields.preferredTemplateId !== undefined) row.preferred_template_id = fields.preferredTemplateId || null;

  if (supabase) {
    // Try by slug first (most reliable unique key)
    if (session.partnerSlug) {
      try {
        const { error } = await supabase
          .from('partners')
          .update(row)
          .eq('slug', session.partnerSlug);
        if (error) {
          console.error('[db/partners] updatePartnerProfileFromSession (slug) error:', error.message);
          // Fall through to id-based attempt
        } else {
          // Supabase updated OK; also sync local JSON if partner lives there
          updatePartnerAccount(session.partnerId, fields);
          return { ok: true };
        }
      } catch (err) {
        console.error('[db/partners] updatePartnerProfileFromSession (slug) exception:', err);
      }
    }

    // Fallback: try by id
    if (session.partnerId) {
      try {
        const { error } = await supabase
          .from('partners')
          .update(row)
          .eq('id', session.partnerId);
        if (error) {
          console.error('[db/partners] updatePartnerProfileFromSession (id) error:', error.message);
        } else {
          updatePartnerAccount(session.partnerId, fields);
          return { ok: true };
        }
      } catch (err) {
        console.error('[db/partners] updatePartnerProfileFromSession (id) exception:', err);
      }
    }

    // Fallback: try by email
    if (session.email) {
      try {
        const { error } = await supabase
          .from('partners')
          .update(row)
          .ilike('email', session.email);
        if (error) {
          console.error('[db/partners] updatePartnerProfileFromSession (email) error:', error.message);
          return { ok: false, error: error.message };
        }
        updatePartnerAccount(session.partnerId, fields);
        return { ok: true };
      } catch (err) {
        console.error('[db/partners] updatePartnerProfileFromSession (email) exception:', err);
        return { ok: false, error: String(err) };
      }
    }

    return { ok: false, error: 'Could not identify partner — no slug, id, or email in session' };
  }

  // Supabase not configured — update local JSON only
  const updated = updatePartnerAccount(session.partnerId, fields);
  if (!updated) return { ok: false, error: 'Partner not found in local store and Supabase is not configured' };
  return { ok: true };
}

/** Look up a partner by email (case-insensitive). Returns partial account with password_hash. */
export async function getPartnerByEmail(email: string): Promise<(Partial<PartnerAccount> & { password_hash?: string | null }) | null> {
  const supabase = getSupabaseServer();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .ilike('email', email.trim())
      .maybeSingle();
    if (!error && data) {
      const row = data as SupabasePartnerRow;
      return {
        ...rowToPartialAccount(row),
        password_hash: row.password_hash,
      };
    }
  } catch (err) {
    console.warn('[db/partners] getPartnerByEmail error:', err);
  }
  return null;
}

export async function updatePartnerLastLogin(slug: string): Promise<void> {
  const supabase = getSupabaseServer();
  if (!supabase) return;
  try {
    await supabase
      .from('partners')
      .update({ last_login_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('slug', slug);
  } catch (err) {
    console.warn('[db/partners] updatePartnerLastLogin error:', err);
  }
}

/** Insert a new partner into Supabase with bcrypt password_hash. Returns the created id+slug+email, or null if Supabase unavailable. */
export async function insertPartnerAuth(params: {
  id: string;
  slug: string;
  businessName: string;
  email: string;
  passwordHash: string;
  phone?: string | null;
  website?: string | null;
  businessType?: string | null;
  logoUrl?: string | null;
  templateId?: string | null;
}): Promise<{ id: string; slug: string; email: string } | null> {
  const supabase = getSupabaseServer();
  if (!supabase) return null;

  const normalizedEmail = (params.email || '').toLowerCase().trim();
  if (!normalizedEmail) {
    console.error('[db/partners] insertPartnerAuth: email is required');
    return null;
  }

  const now = new Date().toISOString();
  const row: Record<string, unknown> = {
    id: params.id,
    slug: params.slug,
    business_name: params.businessName,
    email: normalizedEmail,
    password_hash: params.passwordHash,
    whatsapp: params.phone || null,
    website: params.website || null,
    business_type: params.businessType || null,
    logo_url: params.logoUrl || null,
    preferred_template_id: params.templateId || null,
    plan: 'free',
    subscription_status: 'none',
    created_at: now,
    updated_at: now,
  };

  const { data: created, error } = await supabase
    .from('partners')
    .insert(row)
    .select('id, slug, email')
    .single();

  if (error) {
    console.error('[db/partners] insertPartnerAuth error:', error.message, error.code);
    return null;
  }

  const inserted = created as { id: string; slug: string; email: string };
  if (!inserted.email) {
    console.error('[db/partners] insertPartnerAuth: row inserted but email is null — slug:', inserted.slug);
    return null;
  }

  console.log('[db/partners] insertPartnerAuth: OK — slug:', inserted.slug, 'email:', inserted.email);
  return { id: inserted.id, slug: inserted.slug, email: inserted.email };
}

/** Check if a slug is already taken in Supabase. */
export async function isSlugTakenInSupabase(slug: string): Promise<boolean> {
  const supabase = getSupabaseServer();
  if (!supabase) return false;
  const { data } = await supabase.from('partners').select('id').eq('slug', slug).maybeSingle();
  return Boolean(data);
}

/** Check if an email is already registered in Supabase. */
export async function isEmailTakenInSupabase(email: string): Promise<boolean> {
  const supabase = getSupabaseServer();
  if (!supabase) return false;
  const { data } = await supabase.from('partners').select('id').ilike('email', email.trim()).maybeSingle();
  return Boolean(data);
}

/** Fetch a partner's public profile from Supabase by slug. Falls back to local JSON store. */
export async function getPublicPartnerBySlugFromDb(slug: string): Promise<PublicPartner | null> {
  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('id, slug, business_name, business_type, main_island, whatsapp, website, logo_url, branding_note, preferred_template_id')
        .eq('slug', slug)
        .maybeSingle();
      if (!error && data) {
        const row = data as SupabasePartnerRow;
        return {
          id: row.id,
          slug: row.slug,
          businessName: row.business_name,
          businessType: row.business_type || '',
          whatsapp: row.whatsapp || '',
          website: row.website || '',
          logoUrl: isValidLogoSrc(row.logo_url ?? undefined) ? (row.logo_url ?? '') : '',
          mainIsland: row.main_island || '',
          brandingNote: row.branding_note || `Created for you by ${row.business_name}`,
          preferredTemplateId: row.preferred_template_id || undefined,
        };
      }
    } catch (err) {
      console.warn('[db/partners] getPublicPartnerBySlugFromDb error:', err);
    }
  }
  // Fallback: local JSON store
  const account = getPartnerAccountBySlug(slug);
  if (!account) return null;
  return {
    id: account.id,
    slug: account.slug,
    businessName: account.businessName,
    businessType: account.businessType,
    whatsapp: account.whatsapp,
    website: account.website || '',
    logoUrl: isValidLogoSrc(account.logoUrl) ? (account.logoUrl ?? '') : '',
    mainIsland: account.mainIsland,
    brandingNote: account.brandingNote || `Created for you by ${account.businessName}`,
    preferredTemplateId: account.preferredTemplateId,
  };
}

/** Sync a partner's auth data (email + bcrypt hash) to Supabase without overwriting the existing bcrypt hash. */
export async function syncPartnerEmailToSupabase(slug: string, email: string): Promise<void> {
  const supabase = getSupabaseServer();
  if (!supabase) return;
  try {
    await supabase
      .from('partners')
      .update({ email: email.toLowerCase(), updated_at: new Date().toISOString() })
      .eq('slug', slug)
      .is('email', null);
  } catch (err) {
    console.warn('[db/partners] syncPartnerEmailToSupabase error:', err);
  }
}

export async function listPartners(): Promise<PartnerAccount[]> {
  const supabase = getSupabaseServer();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('partners').select('*');
      if (!error && data) {
        const jsonPartners = listPartnerAccounts();
        return (data as SupabasePartnerRow[]).map((row) => {
          const jsonPartner = jsonPartners.find((p) => p.slug === row.slug);
          const partial = rowToPartialAccount(row);
          return jsonPartner ? ({ ...jsonPartner, ...partial } as PartnerAccount) : (partial as PartnerAccount);
        });
      }
    } catch (err) {
      console.warn('[db/partners] listPartners error:', err);
    }
  }
  return listPartnerAccounts();
}
