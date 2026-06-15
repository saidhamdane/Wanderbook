import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPublicPartnerBySlugFromDb } from '@/lib/db/partners';
import { defaultTemplateIdForPartnerClient } from '@/lib/magazine/template-recommendations';
import { getTemplateById } from '@/lib/magazine/template-registry';
import { getTemplateCoverImage } from '@/lib/magazine/template-covers';
import { DEFAULT_PARTNER_OG_IMAGE, PUBLIC_SITE_ORIGIN, getCanonicalPartnerUrl, getPartnerDisplayName } from '@/lib/partner-utils';
import { PartnerLogoBadge } from './PartnerLogoBadge';

export const dynamic = 'force-dynamic';

type PartnerPageParams = {
  params: { slug: string };
};

function absolutePublicUrl(pathOrUrl?: string): string {
  if (!pathOrUrl) return DEFAULT_PARTNER_OG_IMAGE;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${PUBLIC_SITE_ORIGIN}${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`;
}

export async function generateMetadata({ params }: PartnerPageParams): Promise<Metadata> {
  const partner = await getPublicPartnerBySlugFromDb(params.slug);
  if (!partner) return {};

  const businessName = getPartnerDisplayName(partner);
  const canonicalUrl = getCanonicalPartnerUrl(partner.slug);
  const title = `Create your ${partner.mainIsland} travel magazine with ${businessName}`;
  const description = 'Upload your photos and receive a premium digital flipbook magazine of your experience.';
  const selectedTemplateId = defaultTemplateIdForPartnerClient(partner.businessType, partner.preferredTemplateId);
  const selectedTemplate = getTemplateById(selectedTemplateId);
  const ogImage = absolutePublicUrl(getTemplateCoverImage(selectedTemplate));

  return {
    metadataBase: new URL(PUBLIC_SITE_ORIGIN),
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Wanderbook Canarias',
      type: 'website',
      images: [
        {
          url: ogImage || DEFAULT_PARTNER_OG_IMAGE,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage || DEFAULT_PARTNER_OG_IMAGE],
    },
  };
}

export default async function PartnerLandingPage({ params }: { params: { slug: string } }) {
  const partner = await getPublicPartnerBySlugFromDb(params.slug);
  if (!partner) notFound();

  const businessName = getPartnerDisplayName(partner);
  const selectedTemplateId = defaultTemplateIdForPartnerClient(partner.businessType, partner.preferredTemplateId);
  const selectedTemplate = getTemplateById(selectedTemplateId);
  const selectedTemplateCover = getTemplateCoverImage(selectedTemplate);
  const selectedTemplateLine = selectedTemplateId === 'holiday-rental-memory'
    ? `A premium guest memory magazine created with ${businessName}.`
    : `A premium experience magazine created with ${businessName}.`;
  const createHref =
    '/create?' +
    new URLSearchParams({
      partner: partner.slug,
      partnerMode: 'true',
      clientFlow: 'true',
      template: selectedTemplateId,
      lang: 'es',
    }).toString();

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <style>{'html,body{overflow-x:hidden}'}</style>
      <header className="flex items-center justify-between gap-4 border-b border-amber-400/30 px-5 py-4">
        <Link href="/" className="font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
          Wanderbook Canarias
        </Link>
        <Link href="/partner/login" className="shrink-0 text-right text-sm font-semibold text-amber-200 hover:text-amber-100">
          Business owner? Log in
        </Link>
      </header>

      <section className="mx-auto flex min-h-[calc(100vh-70px)] w-full max-w-[720px] flex-col items-center justify-center px-5 py-12 text-center sm:px-6 sm:py-16 lg:max-w-4xl">
        {partner.logoUrl && (
          <PartnerLogoBadge
            src={partner.logoUrl}
            businessName={businessName}
          />
        )}
        <p className="max-w-full text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-300 sm:text-xs sm:tracking-[0.28em]">
          {partner.businessType.toUpperCase()} PARTNER
        </p>
        <h1
          className="mt-4 w-full max-w-[720px] break-words text-center text-[clamp(2.625rem,10vw,4.75rem)] leading-[1.02] sm:text-[clamp(3.5rem,7vw,5.8rem)] lg:max-w-4xl"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          <span className="block">Create your {partner.mainIsland} travel magazine</span>
          <span className="block">with {businessName}</span>
        </h1>
        <p className="mt-5 w-full max-w-2xl px-1 text-base leading-7 text-slate-300">
          Upload your photos and receive a premium Canary Islands magazine of your experience.
        </p>
        <p className="mt-3 text-sm font-semibold text-amber-100">
          Created with {businessName}
        </p>
        <section className="mt-7 w-full max-w-[280px] rounded-2xl border border-amber-300/25 bg-white/[0.06] p-3 shadow-2xl shadow-black/30 backdrop-blur sm:max-w-[320px] sm:p-4">
          <div className="mx-auto w-full max-w-[190px] overflow-hidden rounded-lg border border-white/10 bg-slate-900 shadow-xl sm:max-w-[220px]">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={selectedTemplateCover}
                alt={`${selectedTemplate.name} cover`}
                fill
                priority
                sizes="(max-width: 640px) 190px, 220px"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-3 pb-3 pt-12 text-left">
                <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-amber-200">
                  Your magazine style
                </p>
                <p className="mt-1 text-base font-bold leading-tight text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {selectedTemplate.name}
                </p>
              </div>
            </div>
          </div>
          <div className="px-1 pb-1 pt-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-amber-200">
              Your magazine style
            </p>
            <h2 className="mt-1 text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              {selectedTemplate.name}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {selectedTemplateLine}
            </p>
          </div>
        </section>
        <Link
          href={createHref}
          className="mt-8 inline-flex w-[min(100%,320px)] justify-center rounded-xl bg-amber-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg hover:bg-amber-300"
        >
          Start my magazine
        </Link>
      </section>
    </main>
  );
}
