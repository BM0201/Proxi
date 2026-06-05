export interface LocationPreviewProps {
  city: string;
  zone: string;
  reference?: string;
  latitude?: number;
  longitude?: number;
}

export function LocationPreview({ city, zone, reference, latitude, longitude }: LocationPreviewProps) {
  return (
    <div
      style={{
        border: '1px solid #dbeafe',
        borderRadius: 12,
        background: '#f8fafc',
        padding: '1rem',
        display: 'grid',
        gap: 10,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <strong>{city}</strong>
        <span style={{ color: '#0f766e', fontWeight: 800, fontSize: 13 }}>Zona aproximada</span>
      </div>
      <p style={{ margin: 0, color: '#475569' }}>{zone}</p>
      {reference ? <p style={{ margin: 0, color: '#64748b', fontSize: 13 }}>{reference}</p> : null}
      {latitude !== undefined && longitude !== undefined ? (
        <span style={{ color: '#64748b', fontSize: 12 }}>
          Pin mock: {latitude}, {longitude}
        </span>
      ) : null}
    </div>
  );
}
