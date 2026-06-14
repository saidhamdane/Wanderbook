'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

export type LeadStatus =
  | 'Not contacted'
  | 'Contacted'
  | 'Demo sent'
  | 'Interested'
  | 'Closed'
  | 'Not interested';

export type Lead = {
  id?: string;
  tier: string;
  business: string;
  location: string;
  phone: string;
  rating: number;
  reviews: number;
  type: string;
  wanderbookAngle: string;
  status: LeadStatus;
  notes: string;
};

const STATUSES: LeadStatus[] = ['Not contacted', 'Contacted', 'Demo sent', 'Interested', 'Closed', 'Not interested'];
const LOCAL_STORAGE_KEY = 'wanderbook-sales-leads-v1';

type LeadOverride = {
  status?: LeadStatus;
  notes?: string;
};

type SortDirection = 'desc' | 'asc';

function leadKey(lead: Lead): string {
  return `${lead.business}::${lead.phone}`;
}

function uniqueOptions(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

function whatsappPhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('00')) return digits.slice(2);
  if (digits.length === 9) return `34${digits}`;
  return digits;
}

function signupBusinessType(type: string): string {
  const normalized = type.toLowerCase();
  if (normalized.includes('holiday') || normalized.includes('villa') || normalized.includes('apartment')) return 'Holiday Rental';
  if (normalized.includes('photo')) return 'Photographer';
  if (normalized.includes('guide')) return 'Tour Guide';
  if (normalized.includes('hotel')) return 'Hotel';
  if (normalized.includes('surf') || normalized.includes('kite')) return 'Surf School';
  if (normalized.includes('boat') || normalized.includes('buggy') || normalized.includes('tour') || normalized.includes('excursion')) return 'Excursion Company';
  return 'Other';
}

function whatsappHref(lead: Lead, demoLink: string): string {
  const message = [
    `Hi ${lead.business},`,
    '',
    'I am reaching out from Wanderbook Canarias. We help Canary Islands tourism businesses give guests a branded digital travel magazine from their own photos, using a QR code or WhatsApp link.',
    '',
    `Here is a quick demo: ${demoLink}`,
    '',
    `Would you like me to create a branded demo for ${lead.business}?`,
  ].join('\n');

  return `https://wa.me/${whatsappPhone(lead.phone)}?text=${encodeURIComponent(message)}`;
}

function demoSignupHref(lead: Lead): string {
  const params = new URLSearchParams({
    businessName: lead.business,
    businessType: signupBusinessType(lead.type),
    mainIsland: 'Fuerteventura',
    whatsapp: lead.phone,
  });

  return `/partner/signup?${params.toString()}`;
}

export default function LeadsClient({
  leads: initialLeads,
  demoLink,
  dbSource = 'json',
}: {
  leads: Lead[];
  demoLink: string;
  dbSource?: 'supabase' | 'json';
}) {
  const [tierFilter, setTierFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [overrides, setOverrides] = useState<Record<string, LeadOverride>>({});
  const [loadedOverrides, setLoadedOverrides] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) setOverrides(JSON.parse(stored) as Record<string, LeadOverride>);
    } catch {
      /* localStorage is optional for this private tool */
    } finally {
      setLoadedOverrides(true);
    }
  }, []);

  useEffect(() => {
    if (!loadedOverrides) return;
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(overrides));
    } catch {
      /* ignore private browsing storage errors */
    }
  }, [loadedOverrides, overrides]);

  const leads = useMemo(
    () =>
      initialLeads.map((lead) => ({
        ...lead,
        ...overrides[leadKey(lead)],
      })),
    [initialLeads, overrides]
  );

  const tiers = useMemo(() => uniqueOptions(leads.map((lead) => lead.tier)), [leads]);
  const types = useMemo(() => uniqueOptions(leads.map((lead) => lead.type)), [leads]);

  const visibleLeads = useMemo(() => {
    return leads
      .filter((lead) => tierFilter === 'All' || lead.tier === tierFilter)
      .filter((lead) => typeFilter === 'All' || lead.type === typeFilter)
      .filter((lead) => statusFilter === 'All' || lead.status === statusFilter)
      .sort((a, b) => (sortDirection === 'desc' ? b.reviews - a.reviews : a.reviews - b.reviews));
  }, [leads, sortDirection, statusFilter, tierFilter, typeFilter]);

  function updateLead(lead: Lead, patch: LeadOverride) {
    setOverrides((current) => {
      const next = {
        ...current,
        [leadKey(lead)]: { ...current[leadKey(lead)], ...patch },
      };
      if (dbSource === 'supabase' && lead.id) {
        const merged = { ...lead, ...current[leadKey(lead)], ...patch };
        fetch('/api/private/leads', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: lead.id, status: merged.status, notes: merged.notes }),
        }).catch(() => {/* non-fatal */});
      }
      return next;
    });
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-5 py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <Link href="/" className="text-lg font-bold text-slate-950" style={{ fontFamily: "'Playfair Display', serif" }}>
            Wanderbook Canarias
          </Link>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-600">
              Private Sales
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${
                dbSource === 'supabase'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              Database: {dbSource === 'supabase' ? 'Supabase' : 'Local JSON fallback'}
            </span>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-5 sm:py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Partner leads</p>
            <h1 className="mt-2 text-3xl text-slate-950 sm:text-4xl" style={{ fontFamily: "'Playfair Display', serif" }}>
              Fuerteventura sales CRM
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Track outreach, open WhatsApp with a prepared message, and create demo partner accounts from one hidden page.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm">
            {visibleLeads.length} of {leads.length} leads
          </div>
        </div>

        <section className="mt-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          <FilterSelect label="Tier" value={tierFilter} options={['All', ...tiers]} onChange={setTierFilter} />
          <FilterSelect label="Type" value={typeFilter} options={['All', ...types]} onChange={setTypeFilter} />
          <FilterSelect label="Status" value={statusFilter} options={['All', ...STATUSES]} onChange={setStatusFilter} />
          <FilterSelect
            label="Sort by reviews"
            value={sortDirection}
            options={[
              { label: 'Most reviews first', value: 'desc' },
              { label: 'Fewest reviews first', value: 'asc' },
            ]}
            onChange={(value) => setSortDirection(value as SortDirection)}
          />
        </section>

        <section className="mt-5 grid gap-4 lg:hidden">
          {visibleLeads.map((lead) => (
            <LeadCard key={leadKey(lead)} lead={lead} demoLink={demoLink} onUpdate={updateLead} />
          ))}
        </section>

        <section className="mt-5 hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
          <div className="overflow-x-auto">
            <table className="min-w-[1180px] text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase tracking-[0.14em] text-slate-500">
                <tr>
                  <th className="px-4 py-3">Lead</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Angle</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Notes</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleLeads.map((lead) => (
                  <tr key={leadKey(lead)} className="align-top">
                    <td className="px-4 py-4">
                      <p className="font-bold text-slate-950">{lead.business}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">{lead.location} · Tier {lead.tier}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-700">{lead.phone}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-700">
                      <span className="font-bold">{lead.rating}</span>
                      <span className="ml-1 text-slate-500">({lead.reviews})</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">{lead.type}</span>
                    </td>
                    <td className="max-w-[300px] px-4 py-4 leading-6 text-slate-600">{lead.wanderbookAngle}</td>
                    <td className="px-4 py-4">
                      <StatusSelect value={lead.status} onChange={(status) => updateLead(lead, { status })} />
                    </td>
                    <td className="px-4 py-4">
                      <textarea
                        value={lead.notes}
                        onChange={(event) => updateLead(lead, { notes: event.target.value })}
                        className="h-24 w-56 resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <LeadActions lead={lead} demoLink={demoLink} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<string | { label: string; value: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        {options.map((option) => {
          const optionValue = typeof option === 'string' ? option : option.value;
          const optionLabel = typeof option === 'string' ? option : option.label;
          return (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>
    </label>
  );
}

function StatusSelect({ value, onChange }: { value: LeadStatus; onChange: (status: LeadStatus) => void }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value as LeadStatus)}
      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
    >
      {STATUSES.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
}

function LeadActions({ lead, demoLink }: { lead: Lead; demoLink: string }) {
  return (
    <div className="flex flex-col gap-2">
      <a
        href={whatsappHref(lead, demoLink)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex justify-center rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700"
      >
        WhatsApp
      </a>
      <Link
        href={demoSignupHref(lead)}
        className="inline-flex justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700"
      >
        Create demo partner
      </Link>
    </div>
  );
}

function LeadCard({ lead, demoLink, onUpdate }: { lead: Lead; demoLink: string; onUpdate: (lead: Lead, patch: LeadOverride) => void }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Tier {lead.tier}</p>
          <h2 className="mt-1 text-xl font-bold text-slate-950">{lead.business}</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">{lead.location}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{lead.type}</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Rating</p>
          <p className="mt-1 font-bold text-slate-950">{lead.rating} / 5</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Reviews</p>
          <p className="mt-1 font-bold text-slate-950">{lead.reviews}</p>
        </div>
      </div>

      <p className="mt-4 text-sm font-semibold text-slate-700">{lead.phone}</p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{lead.wanderbookAngle}</p>

      <div className="mt-4 grid gap-3">
        <StatusSelect value={lead.status} onChange={(status) => onUpdate(lead, { status })} />
        <textarea
          value={lead.notes}
          onChange={(event) => onUpdate(lead, { notes: event.target.value })}
          className="min-h-24 w-full resize-y rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>

      <div className="mt-4">
        <LeadActions lead={lead} demoLink={demoLink} />
      </div>
    </article>
  );
}
