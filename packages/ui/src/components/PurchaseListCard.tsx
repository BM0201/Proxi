import { MaterialStatusBadge } from './MaterialStatusBadge';
import { PurchaseListItemRow } from './PurchaseListItemRow';
import type { MaterialItemPriorityValue } from './PurchaseListItemRow';

/**
 * Tarjeta completa de Lista Proxi: muestra el estado, las notas y todos los
 * ítems de materiales que el Cliente debe comprar antes del servicio.
 */
export interface PurchaseListCardItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  specification?: string;
  priority?: MaterialItemPriorityValue;
  estimatedPriceMin?: number;
  estimatedPriceMax?: number;
  notes?: string;
}

export interface PurchaseListCardProps {
  status: string;
  notes?: string;
  items: PurchaseListCardItem[];
  title?: string;
}

function totalRange(items: PurchaseListCardItem[]): { min: number; max: number } {
  return items.reduce(
    (acc, item) => {
      const min = item.estimatedPriceMin ?? item.estimatedPriceMax ?? 0;
      const max = item.estimatedPriceMax ?? item.estimatedPriceMin ?? 0;
      return { min: acc.min + min, max: acc.max + max };
    },
    { min: 0, max: 0 },
  );
}

export function PurchaseListCard({
  status,
  notes,
  items,
  title = 'Lista Proxi de materiales',
}: PurchaseListCardProps) {
  const totals = totalRange(items);
  const hasEstimate = totals.min > 0 || totals.max > 0;

  return (
    <div
      style={{
        border: '1px solid #e2e8f0',
        borderRadius: 16,
        padding: '1.1rem 1.25rem',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>{title}</span>
        <MaterialStatusBadge status={status} />
      </div>

      <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
        Recordá: el Proveedor independiente no compra los materiales. Esta lista es para que vos
        los compres antes del servicio.
      </p>

      {notes ? (
        <div
          style={{
            background: '#f8fafc',
            borderRadius: 10,
            padding: '0.6rem 0.8rem',
            fontSize: 13,
            color: '#475569',
          }}
        >
          {notes}
        </div>
      ) : null}

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {items.length === 0 ? (
          <span style={{ fontSize: 13, color: '#94a3b8', padding: '0.5rem 0' }}>
            Aún no hay materiales en la lista.
          </span>
        ) : (
          items.map((item) => (
            <PurchaseListItemRow
              key={item.id}
              name={item.name}
              quantity={item.quantity}
              unit={item.unit}
              specification={item.specification}
              priority={item.priority}
              estimatedPriceMin={item.estimatedPriceMin}
              estimatedPriceMax={item.estimatedPriceMax}
              notes={item.notes}
            />
          ))
        )}
      </div>

      {hasEstimate ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 8,
          }}
        >
          <span style={{ fontSize: 13, color: '#64748b' }}>Estimado total de materiales</span>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>
            C${totals.min} – C${totals.max}
          </span>
        </div>
      ) : null}
    </div>
  );
}
