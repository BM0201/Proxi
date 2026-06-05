import { Badge, Card, CardContent, PageHeader, SimpleTable, StatCard, StatusPill } from '@proxi/ui';

const rows = [
  ['Proveedor pendiente', <StatusPill key="pending" status="warning" label="Verificación" />, <Badge key="badge" variant="warning">Revisar identidad</Badge>],
  ['Pago protegido', <StatusPill key="info" status="info" label="En observación" />, <Badge key="payment" variant="info">Mock operativo</Badge>],
  ['Liquidación', <StatusPill key="success" status="success" label="Programada" />, <Badge key="payout" variant="neutral">Ciclo 15/30</Badge>],
  ['Reclamo', <StatusPill key="danger" status="danger" label="Abierto" />, <Badge key="claim" variant="danger">Requiere soporte</Badge>],
];

export default function HomePage() {
  return (
    <main style={{ maxWidth: 1040, margin: '0 auto' }}>
      <PageHeader
        title="Necesito controlar la operación"
        description="Dashboard mock para verificar perfiles, moderar riesgos, revisar pagos protegidos, liquidaciones y reclamos."
      />

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', marginBottom: 20 }}>
        <StatCard label="Proveedores pendientes" value="8" description="Identidad y evidencia por revisar." />
        <StatCard label="Pagos protegidos" value="12" description="Flujo visual sin pago real." />
        <StatCard label="Liquidaciones" value="5" description="Pendientes de ciclo." />
        <StatCard label="Reclamos" value="3" description="Casos con evidencia." />
      </div>

      <Card title="Riesgos operativos">
        <CardContent>
          <SimpleTable headers={['Módulo', 'Estado', 'Acción mock']} rows={rows} />
        </CardContent>
      </Card>
    </main>
  );
}
