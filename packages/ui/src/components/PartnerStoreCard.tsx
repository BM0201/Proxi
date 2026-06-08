/**
 * Tarjeta de tienda/ferretería sugerida donde el Cliente puede comprar los
 * materiales de su Lista Proxi. Las tiendas patrocinadas se destacan.
 */
export type StoreTypeValue =
  | 'HARDWARE_STORE'
  | 'HOME_IMPROVEMENT'
  | 'ELECTRICAL_SUPPLY'
  | 'PLUMBING_SUPPLY'
  | 'PAINT_STORE'
  | 'GENERAL_STORE'
  | 'OTHER'
  | string;

export interface PartnerStoreCardProps {
  name: string;
  type: StoreTypeValue;
  description?: string;
  department?: string;
  city?: string;
  zone?: string;
  addressLine?: string;
  isSponsored?: boolean;
  /** Distancia aproximada en km (si se calculó). */
  distanceKm?: number;
  /** Motivo por el que se sugiere esta tienda. */
  reason?: string;
}

const TYPE_LABELS: Record<string, string> = {
  HARDWARE_STORE: 'Ferretería',
  HOME_IMPROVEMENT: 'Mejoras del hogar',
  ELECTRICAL_SUPPLY: 'Materiales eléctricos',
  PLUMBING_SUPPLY: 'Materiales de fontanería',
  PAINT_STORE: 'Pinturería',
  GENERAL_STORE: 'Tienda general',
  OTHER: 'Otro',
};

export function PartnerStoreCard({
  name,
  type,
  description,
  department,
  city,
  zone,
  addressLine,
  isSponsored = false,
  distanceKm,
  reason,
}: PartnerStoreCardProps) {
  const location = [zone, city, department].filter(Boolean).join(', ');

  return (
    <div
      style={{
        border: isSponsored ? '1px solid #f59e0b' : '1px solid #e2e8f0',
        borderRadius: 14,
        padding: '0.9rem 1rem',
        background: isSponsored ? '#fffbeb' : '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontWeight: 800, color: '#0f172a' }}>{name}</span>
        {isSponsored ? (
          <span
            style={{
              borderRadius: 999,
              padding: '0.05rem 0.5rem',
              background: '#fde68a',
              color: '#92400e',
              fontSize: 11,
              fontWeight: 800,
            }}
          >
            ⭐ Patrocinada
          </span>
        ) : null}
      </div>

      <span style={{ fontSize: 12, fontWeight: 700, color: '#6366f1' }}>
        {TYPE_LABELS[type] ?? type}
      </span>

      {description ? <span style={{ fontSize: 13, color: '#475569' }}>{description}</span> : null}

      {location || addressLine ? (
        <span style={{ fontSize: 12, color: '#64748b' }}>
          📍 {addressLine ? `${addressLine}${location ? ' · ' : ''}` : ''}
          {location}
        </span>
      ) : null}

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {typeof distanceKm === 'number' ? (
          <span style={{ fontSize: 12, color: '#0f172a', fontWeight: 700 }}>~{distanceKm} km</span>
        ) : null}
        {reason ? <span style={{ fontSize: 12, color: '#94a3b8' }}>{reason}</span> : null}
      </div>
    </div>
  );
}
