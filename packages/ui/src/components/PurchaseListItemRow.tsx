/**
 * Fila de un ítem de Lista Proxi: muestra cantidad, especificación, prioridad
 * y rango de precio estimado.
 */
export type MaterialItemPriorityValue =
  | 'REQUIRED'
  | 'OPTIONAL'
  | 'RECOMMENDED'
  | 'ALTERNATIVE'
  | string;

export interface PurchaseListItemRowProps {
  name: string;
  quantity: number;
  unit: string;
  specification?: string;
  priority?: MaterialItemPriorityValue;
  estimatedPriceMin?: number;
  estimatedPriceMax?: number;
  notes?: string;
}

const PRIORITY_META: Record<string, { label: string; background: string; color: string }> = {
  REQUIRED: { label: 'Obligatorio', background: '#fee2e2', color: '#991b1b' },
  OPTIONAL: { label: 'Opcional', background: '#f3f4f6', color: '#374151' },
  RECOMMENDED: { label: 'Recomendado', background: '#dcfce7', color: '#166534' },
  ALTERNATIVE: { label: 'Alternativa', background: '#e0f2fe', color: '#075985' },
};

function formatPrice(min?: number, max?: number): string | null {
  if (min == null && max == null) return null;
  if (min != null && max != null) return `C$${min} – C$${max}`;
  const value = (min ?? max) as number;
  return `C$${value}`;
}

export function PurchaseListItemRow({
  name,
  quantity,
  unit,
  specification,
  priority = 'REQUIRED',
  estimatedPriceMin,
  estimatedPriceMax,
  notes,
}: PurchaseListItemRowProps) {
  const meta = PRIORITY_META[priority] ?? PRIORITY_META.REQUIRED;
  const price = formatPrice(estimatedPriceMin, estimatedPriceMax);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 12,
        padding: '0.7rem 0',
        borderBottom: '1px solid #f1f5f9',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 700, color: '#0f172a' }}>{name}</span>
          <span
            style={{
              borderRadius: 999,
              padding: '0.05rem 0.5rem',
              background: meta.background,
              color: meta.color,
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {meta.label}
          </span>
        </div>
        <span style={{ fontSize: 13, color: '#475569' }}>
          {quantity} {unit}
          {specification ? ` · ${specification}` : ''}
        </span>
        {notes ? <span style={{ fontSize: 12, color: '#94a3b8' }}>{notes}</span> : null}
      </div>
      {price ? (
        <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>
          {price}
        </span>
      ) : null}
    </div>
  );
}
