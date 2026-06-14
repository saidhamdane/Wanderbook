import type { Metadata } from 'next';
import { ContactForm } from './ContactForm';
import { PUBLIC_SITE_URL, PublicPageShell, getContactEmail } from '../public-page-shell';

export const metadata: Metadata = {
  title: 'Contact Wanderbook Canarias',
  description: 'Contact Wanderbook Canarias for tourism business partnerships, support, billing questions, or product help.',
  alternates: {
    canonical: `${PUBLIC_SITE_URL}/contact`,
  },
};

export default function ContactPage() {
  const contactEmail = getContactEmail();

  return (
    <PublicPageShell
      eyebrow="Contact"
      title="Contact Wanderbook Canarias"
      description="For tourism businesses in the Canary Islands, partnerships, support, or billing questions."
    >
      <section className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700 sm:p-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Email</p>
          <a href={`mailto:${contactEmail}`} className="mt-1 inline-block text-base font-bold text-slate-950 hover:text-amber-700">
            {contactEmail}
          </a>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">WhatsApp</p>
          <p className="mt-1 text-base font-semibold text-slate-950">Available soon</p>
        </div>
      </section>
      <ContactForm />
    </PublicPageShell>
  );
}
