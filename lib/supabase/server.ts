import { createClient, SupabaseClient } from '@supabase/supabase-js';

function isPlaceholder(value: string): boolean {
  const v = value.trim().toLowerCase();
  return !v || v === 'placeholder' || v.startsWith('your_') || v.includes('your-project') || v.includes('placeholder.supabase');
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(url && key && !isPlaceholder(url) && !isPlaceholder(key));
}

export function getSupabaseServer(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || isPlaceholder(url) || isPlaceholder(key)) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
