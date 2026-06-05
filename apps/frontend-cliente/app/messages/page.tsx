import { Card, CardContent, PageHeader, StatusPill } from '@proxi/ui';

export default function ClienteMessagesPage() {
  return (
    <main style={{ maxWidth: 900, margin: '0 auto' }}>
      <PageHeader
        title="Mensajes"
        description="Chat mock pendiente. La coordinación se mantiene dentro de Proxi cuando existe una reserva confirmada."
        actions={<StatusPill status="neutral" label="Mock" />}
      />
      <Card title="Sin conversaciones activas">
        <CardContent>
          <p style={{ margin: 0, color: '#475569' }}>
            No se muestra teléfono, WhatsApp ni correo público. El chat real queda para un sprint posterior.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
