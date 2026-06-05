import { Badge, Button, PageHeader, SimpleTable, StatusPill, VerificationStatusBadge } from '@proxi/ui';

const rows = [
  ['Carlos M.', 'carlos@proxi.local', <VerificationStatusBadge key="v" status="PENDING_REVIEW" />, '2026-06-04', '3 documentos', <Button key="a" size="sm" variant="secondary">Ver detalle</Button>],
  ['Ana R.', 'ana@proxi.local', <VerificationStatusBadge key="v" status="NEEDS_CORRECTION" />, '2026-06-03', '2 documentos', <Button key="a" size="sm" variant="secondary">Ver detalle</Button>],
];

export default function AdminVerificationsPage() {
  return (
    <main style={{ maxWidth: 1120, margin: '0 auto' }}>
      <PageHeader
        title="Verificaciones"
        description="Revisión manual de proveedores independientes. Los documentos no se exponen a clientes."
        actions={<StatusPill status="warning" label="Pendientes" />}
      />
      <SimpleTable headers={['Proveedor', 'Correo', 'Estado', 'Fecha', 'Documentos', 'Acción']} rows={rows} />
      <div style={{ marginTop: 14 }}>
        <Badge variant="neutral">La verificación inicial es manual y queda trazada para auditoría.</Badge>
      </div>
    </main>
  );
}
