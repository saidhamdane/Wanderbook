type PdfLockedBadgeProps = {
  language?: string;
};

export function PdfLockedBadge({ language }: PdfLockedBadgeProps) {
  const isSpanish = language === 'es' || language?.startsWith('es');
  const label = isSpanish
    ? 'PDF disponible al activar la cuenta del partner'
    : 'PDF available after activating partner account';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '10px 16px 0',
        pointerEvents: 'none',
      }}
    >
      <span
        data-testid="pdf-locked-badge"
        aria-label={label}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '7px 14px',
          borderRadius: 9999,
          border: '1px dashed rgba(245,158,11,0.5)',
          color: 'rgba(253,230,138,0.72)',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.08em',
          opacity: 0.78,
          cursor: 'default',
          userSelect: 'none',
        }}
      >
        PDF LOCKED · {label}
      </span>
    </div>
  );
}
