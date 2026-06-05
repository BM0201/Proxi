import { offersMock, paymentsMock, providersMock, tasksMock } from '@proxi/contracts';
import { Badge, Card, CardContent, PageHeader, SimpleTable, StatusPill } from '@proxi/ui';

export default function AdminPaymentsPage() {
  const rows = paymentsMock.map((payment) => {
    const task = tasksMock.find((item) => item.id === payment.taskId) ?? tasksMock[0];
    const offer = offersMock.find((item) => item.id === payment.offerId) ?? offersMock[0];
    const provider = providersMock.find((item) => item.id === offer.providerId) ?? providersMock[0];

    return [
      task.title,
      task.clientName,
      provider.name,
      `C$ ${payment.amount}`,
      `${payment.proxiFeePercent}% · C$ ${payment.proxiFeeAmount}`,
      <StatusPill key={payment.id} status="success" label="Protegido" />,
      payment.createdAt,
    ];
  });

  return (
    <main style={{ maxWidth: 1120, margin: '0 auto' }}>
      <PageHeader
        title="Pagos protegidos"
        description="Tabla mock para confirmar visibilidad de pago protegido. No procesa pagos reales."
        actions={<Badge variant="success">Mock financiero</Badge>}
      />
      <Card>
        <CardContent style={{ paddingTop: '1.25rem' }}>
          <SimpleTable headers={['Tarea', 'Cliente', 'Proveedor', 'Monto', 'Comisión', 'Estado', 'Fecha']} rows={rows} />
        </CardContent>
      </Card>
    </main>
  );
}
