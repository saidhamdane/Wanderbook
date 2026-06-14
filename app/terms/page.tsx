import type { Metadata } from 'next';
import { PUBLIC_SITE_URL, PublicPageShell, getContactEmail, policySection } from '../public-page-shell';

export const metadata: Metadata = {
  title: 'Terms of Service | Wanderbook Canarias',
  description: 'Terms of service for Wanderbook Canarias partner accounts, client uploads, generated magazines, and subscriptions.',
  alternates: {
    canonical: `${PUBLIC_SITE_URL}/terms`,
  },
};

export default function TermsPage() {
  const contactEmail = getContactEmail();

  return (
    <PublicPageShell
      eyebrow="Terms"
      title="Terms of Service"
      description="Simple MVP terms for using Wanderbook Canarias. These terms can be reviewed legally later."
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        {policySection('Use of the service', <p>Wanderbook Canarias lets users and partner businesses create digital travel magazines from uploaded photos and related trip details.</p>)}
        {policySection('Partner accounts', <p>Partners are responsible for keeping account details accurate, protecting login access, and using the service for legitimate tourism, hospitality, photography, or experience-related activity.</p>)}
        {policySection('Client uploads', <p>Clients may upload photos to create a magazine. Partners should only invite clients to upload content they have the right to use.</p>)}
        {policySection('Generated magazines', <p>Generated magazines are created automatically from uploaded content, selected templates, and partner branding. Output may vary depending on photo quality and information provided.</p>)}
        {policySection('Acceptable use', <p>Do not upload illegal, abusive, infringing, harmful, or private content without permission. Wanderbook Canarias may remove content or restrict access if misuse is suspected.</p>)}
        {policySection('Subscription and billing', <p>Paid subscriptions are handled through Stripe. Wanderbook AI Unlimited is 95€/mes and includes unlimited magazines while the subscription is active.</p>)}
        {policySection('Free and Unlimited access', <p>The Free plan includes 3 client magazines. Wanderbook AI Unlimited has no monthly magazine limit while the subscription is active or trialing.</p>)}
        {policySection('Cancellation', <p>Partners may cancel paid subscriptions. Access to paid features may continue until the end of the current billing period, depending on Stripe subscription status.</p>)}
        {policySection('Liability', <p>Wanderbook Canarias is provided as an MVP service. We aim to keep it reliable, but we do not guarantee uninterrupted access, perfect output, or suitability for every business use case.</p>)}
        {policySection('Contact', <p>For terms, billing, or support questions, email {contactEmail}.</p>)}
      </div>
    </PublicPageShell>
  );
}
