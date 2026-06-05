import { tasksMock } from '@proxi/contracts';
import { Button, Card, CardContent, PageHeader, SimpleTable, StatusPill } from '@proxi/ui';

const statusMap: Record<string, { label: string; tone: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' }> = {
  PUBLISHED: { label: 'Publicada', tone: 'info' },
  RECEIVING_OFFERS: { label: 'Recibiendo ofertas', tone: 'warning' },
  PROTECTED_PAYMENT_CONFIRMED: { label: 'Pago protegido', tone: 'success' },
};

export default function AdminTasksPage() {
  const rows = tasksMock.map((task) => {
    const status = statusMap[task.status] ?? { label: task.status, tone: 'neutral' as const };

    return [
      task.clientName,
      task.category,
      <StatusPill key={task.id} status={status.tone} label={status.label} />,
      task.offerCount,
      task.location.zone,
      task.createdAt,
      <Button key={`${task.id}-action`} size="sm" variant="secondary" disabled>Ver</Button>,
    ];
  });

  return (
    <main style={{ maxWidth: 1120, margin: '0 auto' }}>
      <PageHeader title="Tareas" description="Tabla mock para seguimiento admin de tareas publicadas." />
      <Card>
        <CardContent style={{ paddingTop: '1.25rem' }}>
          <SimpleTable headers={['Cliente', 'Categoría', 'Estado', 'Ofertas', 'Zona', 'Fecha', 'Acción']} rows={rows} />
        </CardContent>
      </Card>
    </main>
  );
}
