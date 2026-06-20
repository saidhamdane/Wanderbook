'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatSpanishWhatsapp, getCanonicalPartnerUrl, getPartnerDisplayName, isValidHttpUrl, isValidLogoSrc, normalizeExternalUrl } from '@/lib/partner-utils';
import { Logo } from '@/components/Logo';
import { ACTIVITY_TYPES } from '@/lib/partner-activity';
import type { PartnerAnalytics } from '@/lib/db/partner-events';

const BUSINESS_TYPES = ['Surf Camp', 'Villa Rental', 'Tour Guide', 'Boat Tour', 'Photographer', 'Buggy Adventure', 'Restaurant', 'Hotel', 'Other'];
const ISLANDS = ['Tenerife', 'Fuerteventura', 'Lanzarote', 'Gran Canaria', 'La Palma', 'La Gomera', 'El Hierro'];

type DashboardPartner = {
  id: string;
  businessName: string;
  name?: string;
  slug: string;
  businessType: string;
  activityType: string;
  mainIsland: string;
  whatsapp: string;
  website: string;
  logoUrl: string;
  brandingNote: string;
  googleReviewUrl: string;
  instagramUrl: string;
  bookingUrl: string;
  plan: 'free' | 'unlimited_monthly' | 'pro';
  subscriptionStatus: 'none' | 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete' | 'incomplete_expired';
  monthlyMagazineLimit: number;
  googlePlaceName?: string;
  googleRating?: number;
  googleReviewCount?: number;
  googlePhotos?: Array<{ reference: string; proxyUrl: string }>;
  googleMatchStatus?: string;
  aiDetectedActivityType?: string;
  aiCompanySummary?: string;
  aiPositiveReviewThemes?: string[];
};

type CompanyProfileState = {
  status: 'idle' | 'loading' | 'synced' | 'not_found' | 'no_api_key' | 'error';
  message?: string;
};

function qrCardDownloadFilename(partnerSlug: string): string {
  return `wanderbook-${partnerSlug}-qr-card.png`;
}

export default function PartnerDashboardClient({
  partner,
  stats,
  analytics,
}: {
  partner: DashboardPartner;
  stats: { total: number; month: number };
  analytics: PartnerAnalytics;
}) {
  const router = useRouter();
  const [account, setAccount] = useState(partner);
  const [form, setForm] = useState({
    businessName: account.businessName,
    businessType: account.businessType,
    activityType: account.activityType || '',
    mainIsland: account.mainIsland,
    whatsapp: account.whatsapp,
    website: account.website || '',
    logoUrl: account.logoUrl || '',
    brandingNote: account.brandingNote || '',
    googleReviewUrl: account.googleReviewUrl || '',
    instagramUrl: account.instagramUrl || '',
    bookingUrl: account.bookingUrl || '',
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [copied, setCopied] = useState(false);
  const [qrError, setQrError] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoMessage, setLogoMessage] = useState('');
  const [logoError, setLogoError] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);
  const [demoFiles, setDemoFiles] = useState<File[]>([]);
  const [creatingDemo, setCreatingDemo] = useState(false);
  const [demoError, setDemoError] = useState('');
  const initialProfileStatus: CompanyProfileState['status'] = account.googleMatchStatus === 'synced'
    ? 'synced'
    : account.googleMatchStatus === 'not_found'
      ? 'not_found'
      : 'idle';
  const [companyProfile, setCompanyProfile] = useState<CompanyProfileState>({ status: initialProfileStatus });
  const partnerLink = getCanonicalPartnerUrl(account.slug);
  const qrCodeUrl = `/api/partner/qr?slug=${encodeURIComponent(account.slug)}&disposition=inline`;
  const qrCardDownloadUrl = `/api/partner/qr-card?slug=${encodeURIComponent(account.slug)}`;
  const whatsAppBusinessName = getPartnerDisplayName(account);
  const whatsAppText = `Crea tu revista digital de ${account.mainIsland} con ${whatsAppBusinessName} ✨\n\nSube tus fotos y recibe una revista interactiva de tu experiencia:\n${partnerLink}`;
  const whatsAppUrl = `https://wa.me/?text=${encodeURIComponent(whatsAppText)}`;
  const formattedWhatsapp = formatSpanishWhatsapp(form.whatsapp);
  const logoInvalid = form.logoUrl.trim().length > 0 && !isValidLogoSrc(form.logoUrl);
  const logoPreviewUrl = isValidLogoSrc(form.logoUrl) ? form.logoUrl : '';
  const paidActive = account.subscriptionStatus === 'active' || account.subscriptionStatus === 'trialing';
  const planLabel = paidActive ? 'Wanderbook AI Unlimited' : 'Free';
  const statusLabel = account.subscriptionStatus === 'active'
    ? 'Active'
    : account.subscriptionStatus === 'trialing'
      ? 'Trialing'
      : account.subscriptionStatus.replace('_', ' ');

  async function copyLink() {
    await navigator.clipboard.writeText(partnerLink);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch('/api/partner/auth/logout', { method: 'POST' });
    } catch {
      /* clear-cookie failed on the network level; still leave the dashboard */
    }
    window.location.href = '/partner/login';
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);
    setSaveError('');
    setSaving(true);
    try {
      // Normalize URLs before saving
      const normalized = {
        ...form,
        googleReviewUrl: form.googleReviewUrl ? normalizeExternalUrl(form.googleReviewUrl) : '',
        instagramUrl: form.instagramUrl ? normalizeExternalUrl(form.instagramUrl) : '',
        bookingUrl: form.bookingUrl ? normalizeExternalUrl(form.bookingUrl) : '',
        website: form.website ? normalizeExternalUrl(form.website) : '',
      };
      const res = await fetch('/api/partner/profile', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalized),
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveError(data.error || 'Failed to save profile. Please try again.');
        return;
      }
      if (data.partner) {
        setAccount((current) => ({
          ...current,
          businessName: data.partner.businessName,
          slug: data.partner.slug,
          businessType: data.partner.businessType,
          activityType: data.partner.activityType || '',
          mainIsland: data.partner.mainIsland,
          whatsapp: data.partner.whatsapp,
          website: data.partner.website || '',
          logoUrl: data.partner.logoUrl || '',
          brandingNote: data.partner.brandingNote || '',
          googleReviewUrl: data.partner.googleReviewUrl || '',
          instagramUrl: data.partner.instagramUrl || '',
          bookingUrl: data.partner.bookingUrl || '',
        }));
        setForm((current) => ({ ...current, ...normalized }));
      }
      setSaved(true);
    } catch {
      setSaveError('Network error. Please check your connection and try again.');
    } finally {
      setSaving(false);
    }
  }

  async function uploadLogo(file: File | null) {
    setLogoMessage('');
    setLogoError('');
    if (!file) return;
    const fd = new FormData();
    fd.append('logo', file);
    setUploadingLogo(true);
    try {
      const res = await fetch('/api/partner/upload-logo', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) {
        setLogoError(data.error || 'Logo upload failed.');
        return;
      }
      setForm((current) => ({ ...current, logoUrl: data.logoUrl || '' }));
      if (data.partner) {
        setAccount((current) => ({
          ...current,
          logoUrl: data.partner.logoUrl || '',
        }));
      }
      setLogoMessage('Logo uploaded successfully');
    } finally {
      setUploadingLogo(false);
    }
  }

  async function syncCompanyProfile() {
    setCompanyProfile({ status: 'loading' });
    try {
      const res = await fetch('/api/partner/company-auto-sync', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        setCompanyProfile({ status: 'error', message: data.error || 'Company profile sync failed.' });
        return;
      }
      if (data.status === 'missing_key') {
        setCompanyProfile({ status: 'no_api_key' });
        return;
      }
      if (data.status === 'not_found') {
        setAccount((current) => ({ ...current, googleMatchStatus: 'not_found' }));
        setCompanyProfile({ status: 'not_found' });
        return;
      }
      if (data.status === 'synced' && data.data) {
        setAccount((current) => ({
          ...current,
          googlePlaceName: data.data.googlePlaceName || '',
          googleRating: data.data.googleRating,
          googleReviewCount: data.data.googleReviewCount,
          googlePhotos: data.data.googlePhotos || [],
          googleMatchStatus: 'synced',
          aiDetectedActivityType: data.data.detectedActivityType || '',
          aiCompanySummary: data.data.companySummary || '',
          aiPositiveReviewThemes: data.data.positiveReviewThemes || [],
        }));
        setCompanyProfile({ status: 'synced' });
        return;
      }
      setCompanyProfile({ status: 'error', message: 'Unexpected response from company profile sync.' });
    } catch {
      setCompanyProfile({ status: 'error', message: 'Network error. Please try again.' });
    }
  }

  async function createCompanyDemo() {
    setDemoError('');
    setCreatingDemo(true);
    const fd = new FormData();
    fd.append('generationMode', 'demo');
    fd.append('partnerSlug', account.slug);
    fd.append('templateId', 'aurora-editorial');
    fd.append('destination', account.mainIsland || 'Fuerteventura');
    fd.append('travelers', 'Demo');
    fd.append('style', 'Warm & Personal');
    fd.append('language', 'es');
    fd.append('useStockFallback', 'false');
    for (const file of demoFiles) fd.append('demoPhotos', file, file.name);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        credentials: 'include',
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        setDemoError(data.error || 'No se pudo crear la demo.');
        return;
      }
      router.push(`/magazine/${data.id}?mode=demo`);
    } catch {
      setDemoError('Error de red. Intentalo de nuevo.');
    } finally {
      setCreatingDemo(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-5 py-4">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <Logo size="md" />
          <div className="flex items-center gap-2">
            <Link
              href={`/partner/${account.slug}`}
              className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <span className="hidden sm:inline">Open public page</span>
              <span className="sm:hidden">Public page</span>
            </Link>
            <button
              type="button"
              onClick={logout}
              disabled={loggingOut}
              className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
            >
              {loggingOut ? 'Logging out…' : 'Log out'}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8">
        <h1 className="text-4xl text-slate-950" style={{ fontFamily: "'Playfair Display', serif" }}>
          Welcome, {account.businessName}
        </h1>

        <section className="mt-6 rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
          <h2 className="text-2xl text-slate-950" style={{ fontFamily: "'Playfair Display', serif" }}>How it works</h2>
          <ol className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2 lg:grid-cols-4">
            <li className="rounded-xl bg-amber-50 p-3 font-semibold">1. Share your QR code or client link</li>
            <li className="rounded-xl bg-amber-50 p-3 font-semibold">2. Clients upload their own photos</li>
            <li className="rounded-xl bg-amber-50 p-3 font-semibold">3. Wanderbook creates a magazine with your brand</li>
            <li className="rounded-xl bg-amber-50 p-3 font-semibold">4. Your business appears on the final page</li>
          </ol>
          <p className="mt-3 text-sm font-semibold text-slate-600">You do not need to create magazines manually.</p>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold tracking-[0.18em] text-slate-500">YOUR CLIENT LINK</p>
            <p className="mt-3 break-all rounded-xl bg-slate-50 p-4 text-sm font-bold text-slate-950">
              {partnerLink}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={copyLink} className="rounded-xl border border-amber-500 px-4 py-2 text-sm font-semibold text-amber-700">
                {copied ? 'Copied' : 'Copy client link'}
              </button>
              <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white">
                Send client link by WhatsApp
              </a>
              <a href={`/partner/${account.slug}`} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                Open my public client page
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold tracking-[0.18em] text-slate-500">QR CODE</p>
            {qrError ? (
              <div className="mt-3 flex h-40 w-40 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-2 text-center text-xs font-semibold text-slate-500">
                QR not available
              </div>
            ) : (
              <img
                src={qrCodeUrl}
                alt="Partner QR code"
                className="mt-3 h-40 w-40 rounded-xl border border-slate-200 bg-white p-2"
                onError={() => setQrError(true)}
              />
            )}
            <p className="mt-3 text-sm text-slate-600">
              Imprime esta tarjeta o compártela con tus invitados para que puedan crear su propia revista.
            </p>
            <div className="mt-4">
              <a
                href={qrCardDownloadUrl}
                download={qrCardDownloadFilename(account.slug)}
                className="inline-flex w-full justify-center rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-amber-600"
              >
                Descarga la tarjeta QR imprimible
              </a>
            </div>
          </div>
        </section>

        {/* Magazine stats */}
        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <Stat label="Client magazines" value={String(stats.total)} />
          <Stat label="This month" value={String(stats.month)} />
          <div className={`rounded-2xl border bg-white p-5 shadow-sm ${!paidActive && stats.month >= account.monthlyMagazineLimit ? 'border-red-300' : 'border-slate-200'}`}>
            <p className="text-xs font-semibold tracking-[0.18em] text-slate-500">CURRENT PLAN</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">{planLabel}</p>
            <p className="mt-2 text-sm text-slate-600">
              {paidActive
                ? 'Usage: unlimited client magazines while your subscription is active'
                : `Usage: ${stats.month} / ${account.monthlyMagazineLimit} client magazines this month`}
            </p>
            {!paidActive && stats.month >= account.monthlyMagazineLimit && (
              <p className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
                Free limit reached. Upgrade to continue creating magazines.
              </p>
            )}
            {!paidActive ? (
              <Link
                href="/partner/upgrade"
                className={`mt-3 inline-block rounded-xl px-4 py-2 text-sm font-semibold ${stats.month >= account.monthlyMagazineLimit ? 'bg-amber-500 text-white hover:bg-amber-600' : 'border border-slate-300 text-slate-700 hover:bg-slate-50'}`}
              >
                {stats.month >= account.monthlyMagazineLimit ? 'Upgrade to Unlimited' : 'Empezar con Unlimited'}
              </Link>
            ) : (
              <p className="mt-3 text-sm font-semibold text-green-700">Status: {statusLabel}</p>
            )}
          </div>
        </section>

        {/* Engagement analytics */}
        <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AnalyticStat label="Magazine views" value={String(analytics.viewsTotal)} />
          <AnalyticStat label="WhatsApp shares" value={String(analytics.whatsappShares)} />
          <AnalyticStat label="Review clicks" value={String(analytics.reviewClicks)} />
          <AnalyticStat label="Booking clicks" value={String(analytics.bookingClicks)} />
        </section>

        <section className="mt-6 rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl text-slate-950" style={{ fontFamily: "'Playfair Display', serif" }}>
                Crear demo de la empresa
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Create company demo. Esta vista es interna, no consume el limite mensual de revistas reales y filtra las fotos de prueba por tipo de actividad.
              </p>
              <label className="mt-4 block">
                <span className="mb-2 block text-xs font-semibold tracking-widest text-slate-600">
                  FOTOS DE PRUEBA (OPCIONAL - SE FILTRAN POR TIPO DE ACTIVIDAD)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => setDemoFiles(Array.from(event.target.files || []))}
                  className="block w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700"
                />
              </label>
              {demoFiles.length > 0 && (
                <p className="mt-2 text-xs font-semibold text-slate-500">
                  {demoFiles.length} archivo{demoFiles.length === 1 ? '' : 's'} seleccionado{demoFiles.length === 1 ? '' : 's'}
                </p>
              )}
              {demoError && <p className="mt-3 text-sm font-semibold text-red-700">{demoError}</p>}
            </div>
            <button
              type="button"
              onClick={createCompanyDemo}
              disabled={creatingDemo}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-700 disabled:opacity-60"
            >
              {creatingDemo ? 'Creando demo...' : 'Crear demo de la empresa'}
            </button>
          </div>
        </section>

        <form onSubmit={saveProfile} className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-2xl text-slate-950" style={{ fontFamily: "'Playfair Display', serif" }}>Business profile</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Input label="Business name" value={form.businessName} onChange={(v) => setForm({ ...form, businessName: v })} />
            <Select label="Business type" value={form.businessType} options={BUSINESS_TYPES} onChange={(v) => setForm({ ...form, businessType: v })} />
            <Select
              label="Activity type"
              value={form.activityType}
              options={['', ...ACTIVITY_TYPES]}
              onChange={(v) => setForm({ ...form, activityType: v })}
              helper="Determines the CTA on the magazine final page"
            />
            <Select label="Main island" value={form.mainIsland} options={ISLANDS} onChange={(v) => setForm({ ...form, mainIsland: v })} />
            <Input label="WhatsApp" value={form.whatsapp} helper={`Display: ${formattedWhatsapp || 'Add your WhatsApp number'}`} onChange={(v) => setForm({ ...form, whatsapp: v })} />
            <Input label="Website" value={form.website} helper="Example: https://www.turfuerte.es" onChange={(v) => setForm({ ...form, website: v })} />
            <Input label="Booking link" value={form.bookingUrl} helper="Direct booking URL (shown as button on magazine final page)" onChange={(v) => setForm({ ...form, bookingUrl: v })} />
            <Input label="Instagram" value={form.instagramUrl} helper="Example: https://instagram.com/yourbusiness" onChange={(v) => setForm({ ...form, instagramUrl: v })} />
            <div className="sm:col-span-2">
              <Input
                label="Google Review link"
                value={form.googleReviewUrl}
                helper='Paste your Google Maps review URL — shown as "Leave us a review" on the magazine final page'
                onChange={(v) => setForm({ ...form, googleReviewUrl: v })}
              />
            </div>
            <div className="sm:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-bold text-slate-950">Business logo or image</h3>
              <p className="mt-1 text-sm text-slate-600">
                Upload your business logo or a photo of your business. This will appear on your partner page, magazine final page and PDF.
              </p>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                {logoPreviewUrl ? (
                  <img
                    src={logoPreviewUrl}
                    alt="Business logo preview"
                    className="h-24 w-24 rounded-xl border border-slate-200 bg-white object-contain p-2"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-3 text-center text-xs font-semibold text-slate-500">
                    No logo uploaded yet
                  </div>
                )}
                <div className="flex-1">
                  <label className="inline-flex cursor-pointer rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                    {uploadingLogo ? 'Uploading...' : 'Upload logo/image'}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="sr-only"
                      onChange={(e) => uploadLogo(e.target.files?.[0] || null)}
                    />
                  </label>
                  <p className="mt-2 text-xs text-slate-500">PNG, JPG, JPEG or WEBP. Max 5MB.</p>
                  {logoMessage && <p className="mt-2 text-sm font-semibold text-green-700">{logoMessage}</p>}
                  {logoError && <p className="mt-2 text-sm font-semibold text-red-700">{logoError}</p>}
                </div>
              </div>
              <div className="mt-4">
                <Input
                  label="Optional Logo URL field as fallback"
                  value={form.logoUrl}
                  helper={logoInvalid ? 'Logo URL must start with https://' : 'Optional. Paste a direct image URL starting with https://'}
                  error={logoInvalid}
                  onChange={(v) => setForm({ ...form, logoUrl: v })}
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <Input label="Branding note" value={form.brandingNote} onChange={(v) => setForm({ ...form, brandingNote: v })} />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="mt-5 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-white hover:bg-amber-600 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
          {saved && !saving && <span className="ml-3 text-sm font-semibold text-green-700">Profile saved successfully.</span>}
          {saveError && <p className="mt-3 text-sm font-semibold text-red-700">{saveError}</p>}
        </form>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-2xl text-slate-950" style={{ fontFamily: "'Playfair Display', serif" }}>AI Company Profile</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Wanderbook can automatically write your magazine pages based on your business name and island.
              </p>
            </div>
            <button
              type="button"
              onClick={syncCompanyProfile}
              disabled={companyProfile.status === 'loading'}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700 disabled:opacity-60"
            >
              {companyProfile.status === 'loading' ? 'Generating...' : 'Generate company profile from Google'}
            </button>
          </div>

          {companyProfile.status === 'loading' && (
            <div className="mt-5 flex items-center gap-3 rounded-xl bg-amber-50 p-4 text-sm font-semibold text-amber-800">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-amber-300 border-t-amber-700" />
              Searching Google Maps, reading reviews, and writing your company page...
            </div>
          )}

          {companyProfile.status === 'no_api_key' && (
            <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-700">
              Google enrichment is not configured on this server. Your magazines will still include AI-written content.
            </p>
          )}

          {companyProfile.status === 'not_found' && (
            <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-700">
              We couldn&apos;t find your business on Google automatically. Your AI-written magazine will use your business name and island.
            </p>
          )}

          {companyProfile.status === 'error' && (
            <p className="mt-5 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">
              {companyProfile.message || 'Company profile sync failed.'}
            </p>
          )}

          {companyProfile.status === 'synced' && (
            <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-xl bg-slate-50 p-4">
                {account.googlePlaceName && (
                  <p className="text-xs font-semibold tracking-[0.16em] text-slate-500">MATCHED COMPANY</p>
                )}
                {account.googlePlaceName && <p className="mt-1 text-lg font-bold text-slate-950">{account.googlePlaceName}</p>}
                {typeof account.googleRating === 'number' && (
                  <p className="mt-2 text-sm font-bold text-amber-700">
                    ★ {account.googleRating.toFixed(1)}{account.googleReviewCount ? ` · ${account.googleReviewCount} reviews` : ''}
                  </p>
                )}
                {account.aiDetectedActivityType && (
                  <p className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-700">
                    {account.aiDetectedActivityType}
                  </p>
                )}
                {account.aiCompanySummary && (
                  <p className="mt-4 text-sm leading-6 text-slate-700">{account.aiCompanySummary}</p>
                )}
                {account.aiPositiveReviewThemes && account.aiPositiveReviewThemes.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {account.aiPositiveReviewThemes.map((theme) => (
                      <span key={theme} className="rounded-full border border-amber-200 bg-white px-3 py-1 text-xs font-bold text-amber-800">
                        {theme}
                      </span>
                    ))}
                  </div>
                )}
                <p className="mt-4 text-sm font-semibold text-green-700">Profile will appear in your next generated magazine.</p>
              </div>

              {account.googlePhotos && account.googlePhotos.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {account.googlePhotos.slice(0, 3).map((photo) => (
                    <img
                      key={photo.reference}
                      src={photo.proxyUrl}
                      alt=""
                      className="h-28 w-full rounded-xl object-cover"
                      onError={(event) => { event.currentTarget.style.display = 'none'; }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold tracking-[0.18em] text-slate-500">{label.toUpperCase()}</p>
      <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
    </div>
  );
}

function AnalyticStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 shadow-sm">
      <p className="text-xs font-semibold tracking-[0.16em] text-slate-400">{label.toUpperCase()}</p>
      <p className="mt-1 text-2xl font-bold text-slate-800">{value}</p>
    </div>
  );
}

function Input({ label, value, onChange, helper, error = false }: { label: string; value: string; onChange: (v: string) => void; helper?: string; error?: boolean }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold tracking-widest text-slate-600">{label.toUpperCase()}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className={'w-full rounded-xl border px-4 py-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-400 ' + (error ? 'border-red-300 bg-red-50' : 'border-slate-200')} />
      {helper && <span className={'mt-2 block text-xs ' + (error ? 'text-red-700' : 'text-slate-500')}>{helper}</span>}
    </label>
  );
}

function Select({ label, value, options, onChange, helper }: { label: string; value: string; options: string[]; onChange: (v: string) => void; helper?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold tracking-widest text-slate-600">{label.toUpperCase()}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-400">
        {options.map((option) => <option key={option} value={option}>{option || '— Select activity type —'}</option>)}
      </select>
      {helper && <span className="mt-2 block text-xs text-slate-500">{helper}</span>}
    </label>
  );
}
