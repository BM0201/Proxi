import { Badge, Card, CardContent, LocationSummaryCard, PageHeader, SimpleTable, StatusPill } from '@proxi/ui';

const mediaRows = [
  ['avatar-cliente.png', <Badge key="purpose" variant="info">AVATAR</Badge>, <StatusPill key="status" status="success" label="Subido" />],
];

export default function ClienteAccountPage() {
  return (
    <main style={{ maxWidth: 980, margin: '0 auto' }}>
      <PageHeader title="Cuenta Proxi" description="Datos mock de cuenta, ubicaciones guardadas y archivos subidos." />
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <Card title="Datos de cuenta">
          <CardContent>
            <p><strong>Correo:</strong> cliente@proxi.local</p>
            <p><strong>Estado:</strong> ACTIVE</p>
            <p><strong>Rol:</strong> CLIENT</p>
          </CardContent>
        </Card>
        <LocationSummaryCard
          title="Ubicación guardada mock"
          city="Managua"
          zone="Zona aproximada"
          reference="Dirección exacta protegida hasta contratación con pago protegido."
        />
      </div>
      <div style={{ marginTop: 18 }}>
        <SimpleTable headers={['Archivo', 'Uso', 'Estado']} rows={mediaRows} />
      </div>
    </main>
  );
}
