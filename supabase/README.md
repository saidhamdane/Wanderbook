# Supabase Setup for Wanderbook Canarias

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Choose a region close to your server (e.g. EU West for Canary Islands).
3. Note your **Project URL** and **API keys** (Settings → API).

## 2. Environment variables

Add these to your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

> **WARNING**: `SUPABASE_SERVICE_ROLE_KEY` must NEVER be exposed to the browser.
> It is server-only and bypasses Row Level Security. Keep it in `.env.local` only.

## 3. Run the schema

1. Open your Supabase project → **SQL Editor**.
2. Paste the full contents of `supabase/schema.sql`.
3. Click **Run**.

You should see tables created: `partners`, `magazines`, `leads`, `partner_events`, `subscriptions`.

## 4. Create storage buckets

In the Supabase dashboard → **Storage** → **New bucket**:

| Bucket name      | Public | Purpose                        |
|------------------|--------|--------------------------------|
| `partner-logos`  | ✅ Yes | Partner business logos         |
| `magazine-photos`| ✅ Yes | Client uploaded travel photos  |
| `magazine-pdfs`  | ✅ Yes | Exported PDF magazines         |
| `qr-cards`       | ✅ Yes | Generated QR card images       |

## 5. Verify connectivity

```bash
npm run check:supabase
```

Expected output:
```
✅ NEXT_PUBLIC_SUPABASE_URL set
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY set
✅ SUPABASE_SERVICE_ROLE_KEY set
✅ Connected to Supabase
✅ Table: partners exists
✅ Table: magazines exists
✅ Table: leads exists
```

## 6. Migrate existing data

```bash
npm run migrate:supabase
```

This reads `data/partners.json` and `data/leads.json` and upserts them into Supabase.
It is safe to run multiple times (uses upsert on slug / business_name+phone).

## 7. Restart the app

```bash
pm2 restart wanderbook --update-env
```

## How the fallback works

The app checks `isSupabaseConfigured()` before every Supabase call.
If env vars are missing or contain placeholder values, it falls back to the local JSON files.
This means **the app always works** — Supabase is additive.

| Feature                  | With Supabase      | Without Supabase   |
|--------------------------|--------------------|--------------------|
| Partner profiles         | Supabase           | data/partners.json |
| Magazine metadata        | Supabase + disk    | disk only          |
| Leads CRM                | Supabase           | data/leads.json    |
| Stripe billing mirror    | Supabase + JSON    | JSON only          |
| File uploads             | Supabase Storage   | local /public/uploads |

## Security notes

- `SUPABASE_SERVICE_ROLE_KEY` is used only in server-side API routes and scripts.
- Row Level Security (RLS) is enabled on all tables.
- Anon key can only read `partners` and `magazines` (public data).
- `leads`, `subscriptions`, and `partner_events` are service-role only.
