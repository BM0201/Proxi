import { Badge, Card, CardContent, PageHeader, SimpleTable, StatusPill } from '@proxi/ui';

const rows = [
  [
    'Cliente mock',
    'Pasame tu WhatsApp y lo vemos por fuera',
    'Intento de contacto externo',
    <StatusPill key="sev-1" status="danger" label="Alta" />,
    <Badge key="act-1" variant="danger">Bloquear mensaje</Badge>,
  ],
  [
    'Proveedor mock',
    'Te cobro menos si pagás directo',
    'Evasión de pago protegido',
    <StatusPill key="sev-2" status="danger" label="Alta" />,
    <Badge key="act-2" variant="warning">Revisar cuenta</Badge>,
  ],
  [
    'Cliente mock 2',
    'Escribime a mi correo',
    'Dato de contacto externo',
    <StatusPill key="sev-3" status="warning" label="Media" />,
    <Badge key="act-3" variant="neutral">Ocultar dato</Badge>,
  ],
];

export default function AdminModerationPage() {
  return (
    <main style={{ maxWidth: 1120, margin: '0 auto' }}>
      <PageHeader
        title="Moderación"
        description="Tabla mock anti-fuga. Proxi mantiene comunicación, ofertas y pago protegido dentro de la plataforma."
      />
      <Card>
        <CardContent style={{ paddingTop: '1.25rem' }}>
          <SimpleTable headers={['Usuario', 'Mensaje marcado', 'Razón', 'Severidad', 'Acción sugerida']} rows={rows} />
        </CardContent>
      </Card>
    </main>
  );
}
