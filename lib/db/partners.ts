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
  activity_type: string | null;
  main_island: string | null;
  whatsapp: string | null;
  website: string | null;
  logo_url: string | null;
  branding_note: string | null;
  preferred_template_id: string | null;
  google_review_url: string | null;
  instagram_url: string | null;
  booking_url: string | null;
  plan: string;
  subscription_status: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  email: string | null;
  password_hash: string | null;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  google_place_id?: string | null;
  serpapi_place_id?: string | null;
  serpapi_data_id?: string | null;
  google_place_name?: string | null;
  google_maps_url?: string | null;
  google_rating?: number | null;
  google_review_count?: number | null;
  google_primary_type?: string | null;
  google_types?: unknown[] | null;
  google_reviews_cache?: unknown[] | null;
  google_photos_cache?: Array<{ reference: string; proxyUrl: string }> | null;
  google_match_confidence?: number | null;
  google_match_status?: string | null;
  ai_detected_activity_type?: string | null;
  ai_company_summary?: string | null;
  ai_positive_review_themes?: string[] | null;
  ai_island_context_line?: string | null;
  ai_activity_description?: string | null;
  ai_company_page_title?: string | null;
  ai_company_page_subtitle?: string | null;
  ai_company_page_body?: string | null;
  ai_company_trust_line?: string | null;
  ai_company_final_cta_line?: string | null;
  ai_company_photo_captions?: string[] | null;
  company_enrichment_synced_at?: string | null;
};

function arrayOrUndefined<T>(value: unknown): T[] | undefined {
  return Array.isArray(value) ? value as T[] : undefined;
}

function rowToPartialAccount(row: SupabasePartnerRow): Partial<PartnerAccount> {
  return {
    id: row.id,
    slug: row.slug,
    email: row.email || '',
    businessName: row.business_name,
    businessType: row.business_type || '',
    activityType: row.activity_type || undefined,
    mainIsland: row.main_island || '',
    whatsapp: row.whatsapp || '',
    website: row.website || undefined,
    logoUrl: row.logo_url || undefined,
    brandingNote: row.branding_note || undefined,
    preferredTemplateId: row.preferred_template_id || undefined,
    googleReviewUrl: row.google_review_url || undefined,
    instagramUrl: row.instagram_url || undefined,
    bookingUrl: row.booking_url || undefined,
    plan: (row.plan as PartnerAccount['plan']) || 'free',
    subscriptionStatus: (row.subscription_status as PartnerAccount['subscriptionStatus']) || 'none',
    stripeCustomerId: row.stripe_customer_id || undefined,
    stripeSubscriptionId: row.stripe_subscription_id || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    serpApiPlaceId: row.serpapi_place_id || undefined,
    serpApiDataId: row.serpapi_data_id || undefined,
    googlePlaceName: row.google_place_name || undefined,
    googlePrimaryType: row.google_primary_type || undefined,
    googleTypes: arrayOrUndefined<string>(row.google_types),
    googleRating: row.google_rating ?? undefined,
    googleReviewCount: row.google_review_count ?? undefined,
    googlePhotos: arrayOrUndefined<{ reference: string; proxyUrl: string }>(row.google_photos_cache),
    googleMatchStatus: row.google_match_status || undefined,
    aiDetectedActivityType: row.ai_detected_activity_type || undefined,
    aiIslandContextLine: row.ai_island_context_line || undefined,
    aiActivityDescription: row.ai_activity_description || undefined,
    aiCompanySummary: row.ai_company_summary || undefined,
    aiPositiveReviewThemes: arrayOrUndefined<string>(row.ai_positive_review_themes),
    aiCompanyPageTitle: row.ai_company_page_title || undefined,
    aiCompanyPageSubtitle: row.ai_company_page_subtitle || undefined,
    aiCompanyPageBody: row.ai_company_page_body || undefined,
    aiCompanyTrustLine: row.ai_company_trust_line || undefined,
    aiCompanyFinalCtaLine: row.ai_company_final_cta_line || undefined,
    aiCompanyPhotoCaptions: arrayOrUndefined<string>(row.ai_company_photo_captions),
  };
}

function rowToPublicEnrichment(row: SupabasePartnerRow): Pick<
  PublicPartner,
  | 'googlePlaceName'
  | 'googlePrimaryType'
  | 'googleTypes'
  | 'googleRating'
  | 'googleReviewCount'
  | 'googlePhotos'
  | 'googleMatchStatus'
  | 'aiDetectedActivityType'
  | 'aiIslandContextLine'
  | 'aiActivityDescription'
  | 'aiCompanySummary'
  | 'aiPositiveReviewThemes'
  | 'aiCompanyPageTitle'
  | 'aiCompanyPageSubtitle'
  | 'aiCompanyPageBody'
  | 'aiCompanyTrustLine'
  | 'aiCompanyFinalCtaLine'
  | 'aiCompanyPhotoCaptions'
> {
  return {
    googlePlaceName: row.google_place_name || undefined,
    googlePrimaryType: row.google_primary_type || undefined,
    googleTypes: arrayOrUndefined<string>(row.google_types),
    googleRating: row.google_rating ?? undefined,
    googleReviewCount: row.google_review_count ?? undefined,
    googlePhotos: arrayOrUndefined<{ reference: string; proxyUrl: string }>(row.google_photos_cache),
    googleMatchStatus: row.google_match_status || undefined,
    aiDetectedActivityType: row.ai_detected_activity_type || undefined,
    aiIslandContextLine: row.ai_island_context_line || undefined,
    aiActivityDescription: row.ai_activity_description || undefined,
    aiCompanySummary: row.ai_company_summary || undefined,
    aiPositiveReviewThemes: arrayOrUndefined<string>(row.ai_positive_review_themes),
    aiCompanyPageTitle: row.ai_company_page_title || undefined,
    aiCompanyPageSubtitle: row.ai_company_page_subtitle || undefined,
    aiCompanyPageBody: row.ai_company_page_body || undefined,
    aiCompanyTrustLine: row.ai_company_trust_line || undefined,
    aiCompanyFinalCtaLine: row.ai_company_final_cta_line || undefined,
    aiCompanyPhotoCaptions: arrayOrUndefined<string>(row.ai_company_photo_captions),
  };
}

function accountToRow(partner: PartnerAccount): Record<string, unknown> {
  return {
    id: partner.id,
    slug: partner.slug,
    business_name: partner.businessName,
    business_type: partner.businessType || null,
    activity_type: partner.activityType || null,
    main_island: partner.mainIsland || null,
    whatsapp: partner.whatsapp || null,
    website: partner.website || null,
    logo_url: partner.logoUrl || null,
    branding_note: partner.brandingNote || null,
    preferred_template_id: partner.preferredTemplateId || null,
    google_review_url: partner.googleReviewUrl || null,
    instagram_url: partner.instagramUrl || null,
    booking_url: partner.bookingUrl || null,
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
    activity_type?: string | null;
    main_island?: string | null;
    whatsapp?: string | null;
    website?: string | null;
    logo_url?: string | null;
    branding_note?: string | null;
    preferred_template_id?: string | null;
    google_review_url?: string | null;
    instagram_url?: string | null;
    booking_url?: string | null;
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
  activityType?: string;
  mainIsland?: string;
  whatsapp?: string;
  website?: string;
  logoUrl?: string;
  brandingNote?: string;
  preferredTemplateId?: string;
  googleReviewUrl?: string;
  instagramUrl?: string;
  bookingUrl?: string;
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

  // Core fields: always present in schema
  const coreRow: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (fields.businessName !== undefined) coreRow.business_name = fields.businessName;
  if (fields.businessType !== undefined) coreRow.business_type = fields.businessType || null;
  if (fields.mainIsland !== undefined) coreRow.main_island = fields.mainIsland || null;
  if (fields.whatsapp !== undefined) coreRow.whatsapp = fields.whatsapp || null;
  if (fields.website !== undefined) coreRow.website = fields.website || null;
  if (fields.logoUrl !== undefined) coreRow.logo_url = fields.logoUrl || null;
  if (fields.brandingNote !== undefined) coreRow.branding_note = fields.brandingNote || null;
  if (fields.preferredTemplateId !== undefined) coreRow.preferred_template_id = fields.preferredTemplateId || null;

  // Marketing fields: added by 20260616 migration — applied separately to avoid failures
  const hasMarketing = fields.activityType !== undefined || fields.googleReviewUrl !== undefined ||
    fields.instagramUrl !== undefined || fields.bookingUrl !== undefined;
  const marketingRow: Record<string, unknown> = {};
  if (fields.activityType !== undefined) marketingRow.activity_type = fields.activityType || null;
  if (fields.googleReviewUrl !== undefined) marketingRow.google_review_url = fields.googleReviewUrl || null;
  if (fields.instagramUrl !== undefined) marketingRow.instagram_url = fields.instagramUrl || null;
  if (fields.bookingUrl !== undefined) marketingRow.booking_url = fields.bookingUrl || null;

  async function doUpdate(filter: { col: string; val: string }): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from('partners').update(coreRow).eq(filter.col, filter.val);
    if (error) {
      console.error(`[db/partners] updatePartnerProfileFromSession (${filter.col}) error:`, error.message);
      return false;
    }
    // Marketing fields — fail silently if migration not yet applied
    if (hasMarketing) {
      try {
        await supabase.from('partners').update(marketingRow).eq(filter.col, filter.val);
      } catch {
        // migration pending — core save still succeeded
      }
    }
    updatePartnerAccount(session.partnerId, fields);
    return true;
  }

  if (supabase) {
    // Try by slug first (most reliable unique key)
    if (session.partnerSlug) {
      try {
        const ok = await doUpdate({ col: 'slug', val: session.partnerSlug });
        if (ok) return { ok: true };
      } catch (err) {
        console.error('[db/partners] updatePartnerProfileFromSession (slug) exception:', err);
      }
    }

    // Fallback: try by id
    if (session.partnerId) {
      try {
        const ok = await doUpdate({ col: 'id', val: session.partnerId });
        if (ok) return { ok: true };
      } catch (err) {
        console.error('[db/partners] updatePartnerProfileFromSession (id) exception:', err);
      }
    }

    // Fallback: try by email
    if (session.email) {
      try {
        const { error } = await supabase.from('partners').update(coreRow).ilike('email', session.email);
        if (error) {
          console.error('[db/partners] updatePartnerProfileFromSession (email) error:', error.message);
          return { ok: false, error: error.message };
        }
        if (hasMarketing) {
          try { await supabase.from('partners').update(marketingRow).ilike('email', session.email); } catch { /* migration pending */ }
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
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      if (!error && data) {
        const row = data as SupabasePartnerRow;
        return {
          id: row.id,
          slug: row.slug,
          businessName: row.business_name,
          businessType: row.business_type || '',
          activityType: row.activity_type || undefined,
          whatsapp: row.whatsapp || '',
          website: row.website || '',
          logoUrl: isValidLogoSrc(row.logo_url ?? undefined) ? (row.logo_url ?? '') : '',
          mainIsland: row.main_island || '',
          brandingNote: row.branding_note || `Created for you by ${row.business_name}`,
          preferredTemplateId: row.preferred_template_id || undefined,
          googleReviewUrl: row.google_review_url || undefined,
          instagramUrl: row.instagram_url || undefined,
          bookingUrl: row.booking_url || undefined,
          ...rowToPublicEnrichment(row),
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
    activityType: account.activityType,
    whatsapp: account.whatsapp,
    website: account.website || '',
    logoUrl: isValidLogoSrc(account.logoUrl) ? (account.logoUrl ?? '') : '',
    mainIsland: account.mainIsland,
    brandingNote: account.brandingNote || `Created for you by ${account.businessName}`,
    preferredTemplateId: account.preferredTemplateId,
    googleReviewUrl: account.googleReviewUrl,
    instagramUrl: account.instagramUrl,
    bookingUrl: account.bookingUrl,
    googlePlaceName: account.googlePlaceName,
    googleRating: account.googleRating,
    googleReviewCount: account.googleReviewCount,
    googlePhotos: account.googlePhotos,
    googleMatchStatus: account.googleMatchStatus,
    aiDetectedActivityType: account.aiDetectedActivityType,
    aiIslandContextLine: account.aiIslandContextLine,
    aiActivityDescription: account.aiActivityDescription,
    aiCompanySummary: account.aiCompanySummary,
    aiPositiveReviewThemes: account.aiPositiveReviewThemes,
    aiCompanyPageTitle: account.aiCompanyPageTitle,
    aiCompanyPageSubtitle: account.aiCompanyPageSubtitle,
    aiCompanyPageBody: account.aiCompanyPageBody,
    aiCompanyTrustLine: account.aiCompanyTrustLine,
    aiCompanyFinalCtaLine: account.aiCompanyFinalCtaLine,
    aiCompanyPhotoCaptions: account.aiCompanyPhotoCaptions,
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
