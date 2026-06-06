/**
 * Insignia de estado de confianza (TrustStatus) con puntaje opcional.
 */
export type TrustStatusValue =
  | 'NORMAL'
  | 'WATCHLIST'
  | 'RESTRICTED'
  | 'SUSPENDED'
  | 'BANNED';

export interface TrustBadgeProps {
  status: TrustStatusValue | string;
  /** Puntaje de confianza (0-100). Si se entrega, se muestra junto a la etiqueta. */
  trustScore?: number;
  /** Etiqueta legible opcional; si no se entrega se usa el mapeo interno. */
  label?: string;
}

const STATUS_META: Record<string, { label: string; background: string; color: string }> = {
  NORMAL: { label: 'Confianza normal', background: '#dcfce7', color: '#166534' },
  WATCHLIST: { label: 'En observación', background: '#fef3c7', color: '#92400e' },
  RESTRICTED: { label: 'Restringido', background: '#ffedd5', color: '#9a3412' },
  SUSPENDED: { label: 'Suspendido', background: '#fee2e2', color: '#991b1b' },
  BANNED: { label: 'Bloqueado', background: '#1f2937', color: '#f9fafb' },
};

export function TrustBadge({ status, trustScore, label }: TrustBadgeProps) {
  const meta = STATUS_META[status] ?? {
    label: label ?? status,
    background: '#f3f4f6',
    color: '#374151',
  };
  const text = label ?? meta.label;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        borderRadius: 999,
        padding: '0.2rem 0.65rem',
        background: meta.background,
        color: meta.color,
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      <span aria-hidden>🛡️</span>
      {text}
      {typeof trustScore === 'number' ? <span>· {trustScore}</span> : null}
    </span>
  );
}
