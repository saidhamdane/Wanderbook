'use client';

type AdminDemoToolbarProps = {
  businessName: string;
  activityType: string;
  year: number;
};

export function AdminDemoToolbar({ businessName, activityType, year }: AdminDemoToolbarProps) {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        flexWrap: 'wrap',
        padding: '10px 14px',
        borderBottom: '1px solid rgba(146,64,14,0.28)',
        background: '#f59e0b',
        color: '#111827',
        fontFamily: 'Arial, sans-serif',
        boxShadow: '0 8px 22px rgba(15,23,42,0.16)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', flex: 1 }}>
        <span
          style={{
            borderRadius: 999,
            background: '#111827',
            color: '#fff',
            padding: '7px 11px',
            fontSize: 12,
            fontWeight: 900,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          DEMO PREVIEW
        </span>
        <strong style={{ fontSize: 15 }}>{businessName}</strong>
        <span style={{ fontSize: 13, fontWeight: 700 }}>
          {activityType} · {year}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          ADMIN ONLY · NOT SHAREABLE · PDF LOCKED
        </span>
        <a
          href="/private/leads"
          style={{
            borderRadius: 999,
            background: '#111827',
            color: '#fff',
            padding: '8px 12px',
            fontSize: 12,
            fontWeight: 800,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          Back to CRM
        </a>
      </div>
    </header>
  );
}
