/**
 * Insignia del estado de materiales (MaterialStatus) de una Tarea / Lista Proxi.
 */
export type MaterialStatusValue =
  | 'NO_MATERIALS_REQUIRED'
  | 'CLIENT_ALREADY_HAS_MATERIALS'
  | 'PURCHASE_LIST_PENDING_PROVIDER'
  | 'PURCHASE_LIST_SENT'
  | 'CLIENT_BUYING_MATERIALS'
  | 'MATERIALS_READY'
  | 'MATERIALS_INCORRECT'
  | 'MISSING_MATERIALS'
  | 'NEEDS_UPDATE'
  | string;

export interface MaterialStatusBadgeProps {
  status: MaterialStatusValue;
}

const STATUS_META: Record<string, { label: string; icon: string; background: string; color: string }> = {
  NO_MATERIALS_REQUIRED: { label: 'Sin materiales', icon: '➖', background: '#f3f4f6', color: '#374151' },
  CLIENT_ALREADY_HAS_MATERIALS: { label: 'Cliente ya tiene materiales', icon: '📦', background: '#dcfce7', color: '#166534' },
  PURCHASE_LIST_PENDING_PROVIDER: { label: 'Lista Proxi pendiente', icon: '⏳', background: '#fef3c7', color: '#92400e' },
  PURCHASE_LIST_SENT: { label: 'Lista Proxi enviada', icon: '📨', background: '#e0f2fe', color: '#075985' },
  CLIENT_BUYING_MATERIALS: { label: 'Cliente comprando', icon: '🛒', background: '#e0e7ff', color: '#3730a3' },
  MATERIALS_READY: { label: 'Materiales listos', icon: '✅', background: '#dcfce7', color: '#166534' },
  MATERIALS_INCORRECT: { label: 'Materiales incorrectos', icon: '⚠️', background: '#fee2e2', color: '#991b1b' },
  MISSING_MATERIALS: { label: 'Faltan materiales', icon: '❗', background: '#ffedd5', color: '#9a3412' },
  NEEDS_UPDATE: { label: 'Requiere actualización', icon: '🔄', background: '#fef3c7', color: '#92400e' },
};

export function MaterialStatusBadge({ status }: MaterialStatusBadgeProps) {
  const meta = STATUS_META[status] ?? {
    label: status,
    icon: '🏷️',
    background: '#f3f4f6',
    color: '#374151',
  };

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
      <span aria-hidden>{meta.icon}</span>
      {meta.label}
    </span>
  );
}
