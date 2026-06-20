-- Canonical company enrichment schema migration. Uses SerpApi; no direct Google Places integration.
ALTER TABLE partners ADD COLUMN IF NOT EXISTS serpapi_place_id text;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS serpapi_data_id text;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS google_place_name text;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS google_maps_url text;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS google_rating numeric;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS google_review_count integer;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS google_primary_type text;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS google_types jsonb DEFAULT '[]'::jsonb;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS google_reviews_cache jsonb DEFAULT '[]'::jsonb;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS google_photos_cache jsonb DEFAULT '[]'::jsonb;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS google_match_confidence numeric;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS google_match_status text DEFAULT 'pending';
ALTER TABLE partners ADD COLUMN IF NOT EXISTS ai_detected_activity_type text;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS ai_company_summary text;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS ai_positive_review_themes jsonb DEFAULT '[]'::jsonb;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS ai_island_context_line text;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS ai_activity_description text;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS ai_company_page_title text;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS ai_company_page_subtitle text;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS ai_company_page_body text;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS ai_company_trust_line text;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS ai_company_final_cta_line text;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS ai_company_photo_captions jsonb DEFAULT '[]'::jsonb;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS company_enrichment_synced_at timestamptz;

NOTIFY pgrst, 'reload schema';
