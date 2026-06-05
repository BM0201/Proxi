export interface MapPinSelectorMockProps {
  latitude?: string | number;
  longitude?: string | number;
  label?: string;
}

export function MapPinSelectorMock({ latitude = '12.114', longitude = '-86.236', label = 'Pin mock de ubicación' }: MapPinSelectorMockProps) {
  return (
    <div
      style={{
        minHeight: 220,
        border: '1px solid #cbd5e1',
        borderRadius: 8,
        background:
          'linear-gradient(90deg, rgba(203,213,225,0.35) 1px, transparent 1px), linear-gradient(rgba(203,213,225,0.35) 1px, transparent 1px), #f8fafc',
        backgroundSize: '32px 32px',
        display: 'grid',
        placeItems: 'center',
        textAlign: 'center',
        color: '#334155',
        padding: 18,
      }}
    >
      <div>
        <div style={{ fontSize: 34, lineHeight: 1 }}>⌖</div>
        <strong>{label}</strong>
        <p style={{ margin: '0.4rem 0 0', color: '#64748b' }}>
          Lat {latitude} · Lng {longitude}
        </p>
      </div>
    </div>
  );
}
