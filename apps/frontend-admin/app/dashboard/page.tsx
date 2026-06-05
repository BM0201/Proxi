import { paymentsMock, tasksMock } from '@proxi/contracts';
import { Badge, Card, CardContent, PageHeader, SimpleTable, StatCard, StatusPill } from '@proxi/ui';

const alertRows = [
  ['Verificaciones', <StatusPill key="status" status="warning" label="5 pendientes" />, <Badge key="badge" variant="warning">Identidad</Badge>],
  ['Alertas anti-fuga', <StatusPill key="status" status="danger" label="3 alertas" />, <Badge key="badge" variant="danger">Mensajes</Badge>],
  ['Pagos protegidos', <StatusPill key="status" status="success" label="1 protegido" />, <Badge key="badge" variant="success">Mock</Badge>],
];

export default function AdminDashboardPage() {
  return (
    <main style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gap: 18 }}>
      <PageHeader
        title="Dashboard"
        description="Control visual del flujo inicial: tareas, ofertas, pagos protegidos, reclamos y proveedores."
      />
      <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))' }}>
        <StatCard label="Tareas publicadas" value={tasksMock.length} description="Mock del flujo cliente." />
        <StatCard label="Ofertas enviadas" value="3" description="Comparación de proveedores." />
        <StatCard label="Pagos protegidos" value={paymentsMock.length} description="Sin pagos reales." />
        <StatCard label="Reclamos abiertos" value="1" description="Evidencia pendiente." />
        <StatCard label="Proveedores pendientes" value="5" description="Verificación manual." />
        <StatCard label="Alertas anti-fuga" value="3" description="Mensajes marcados." />
      </div>
      <Card>
        <CardContent style={{ paddingTop: '1.25rem' }}>
          <SimpleTable headers={['Área', 'Estado', 'Tipo']} rows={alertRows} />
        </CardContent>
      </Card>
    </main>
  );
}
