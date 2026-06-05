import { Badge } from './Badge';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

export interface ProtectedPaymentSummaryProps {
  taskTitle: string;
  providerName: string;
  agreedPrice: string;
  proxiFee: string;
  total: string;
}

export function ProtectedPaymentSummary({
  taskTitle,
  providerName,
  agreedPrice,
  proxiFee,
  total,
}: ProtectedPaymentSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <CardTitle>Pago protegido con Proxi</CardTitle>
          <Badge variant="success">Protegido</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p style={{ margin: '0 0 16px', color: '#475569', lineHeight: 1.5 }}>
          Tu dinero está seguro hasta que aprobés el trabajo.
        </p>
        <div style={{ display: 'grid', gap: 10 }}>
          <Row label="Tarea" value={taskTitle} />
          <Row label="Proveedor independiente" value={providerName} />
          <Row label="Precio acordado" value={agreedPrice} />
          <Row label="Comisión Proxi" value={proxiFee} />
          <Row label="Total a pagar" value={total} strong />
        </div>
      </CardContent>
    </Card>
  );
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 16,
        borderBottom: '1px solid #f1f5f9',
        paddingBottom: 8,
        fontWeight: strong ? 800 : 500,
      }}
    >
      <span style={{ color: '#64748b' }}>{label}</span>
      <span>{value}</span>
    </div>
  );
}
