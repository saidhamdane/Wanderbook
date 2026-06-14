import type { Metadata } from 'next';
import { PUBLIC_SITE_URL, PublicPageShell, getContactEmail, policySection } from '../public-page-shell';

export const metadata: Metadata = {
  title: 'Privacy Policy | Wanderbook Canarias',
  description: 'Privacy policy for Wanderbook Canarias, including partner accounts, client uploads, Stripe payments, cookies, and deletion requests.',
  alternates: {
    canonical: `${PUBLIC_SITE_URL}/privacy`,
  },
};

export default function PrivacyPage() {
  const contactEmail = getContactEmail();

  return (
    <PublicPageShell
      eyebrow="Privacy"
      title="Privacy Policy"
      description="A simple MVP privacy policy for Wanderbook Canarias. This policy can be reviewed legally later."
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        {policySection('Who we are', <p>Wanderbook Canarias provides digital travel magazine tools for tourism businesses in the Canary Islands.</p>)}
        {policySection('What data we collect', <p>We may collect account details, business profile information, uploaded images, messages sent through forms, basic usage data, and session data needed to run the service.</p>)}
        {policySection('Partner account data', <p>Partner account data can include name, email, business name, business type, island, website, WhatsApp number, logo, subscription status, and dashboard usage information.</p>)}
        {policySection('Client uploaded photos', <p>Uploaded photos are used to generate the magazine requested by the client or partner. Photos may appear in the generated digital flipbook magazine and PDF export.</p>)}
        {policySection('Payment data handled by Stripe', <p>Payment details are processed by Stripe. Wanderbook Canarias does not store card numbers or full payment details on its own servers.</p>)}
        {policySection('Cookies/session data', <p>We use cookies or similar session data to keep partners logged in, protect dashboard access, and operate the service.</p>)}
        {policySection('How data is used', <p>Data is used to provide partner dashboards, generate magazines, apply business branding, process subscriptions, support users, and improve reliability.</p>)}
        {policySection('Contact', <p>For privacy questions, email {contactEmail}.</p>)}
        {policySection('Request deletion', <p>Partners or clients can request deletion of account data or uploaded content by contacting {contactEmail}. Some billing records may need to be retained where required by law or payment processors.</p>)}
      </div>
    </PublicPageShell>
  );
}
