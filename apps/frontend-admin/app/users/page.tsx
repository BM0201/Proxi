import { Badge, PageHeader, SimpleTable, StatusPill } from '@proxi/ui';

const rows = [
  ['cliente@proxi.local', <Badge key="role" variant="info">CLIENT</Badge>, <StatusPill key="status" status="success" label="ACTIVE" />, '2026-06-04'],
  ['proveedor@proxi.local', <Badge key="role" variant="success">PROVIDER</Badge>, <StatusPill key="status" status="warning" label="PENDING_EMAIL_VERIFICATION" />, '2026-06-04'],
  ['admin@proxi.local', <Badge key="role" variant="neutral">ADMIN</Badge>, <StatusPill key="status" status="success" label="ACTIVE" />, '2026-06-01'],
];

export default function AdminUsersPage() {
  return (
    <main style={{ maxWidth: 1040, margin: '0 auto' }}>
      <PageHeader title="Usuarios" description="Tabla mock de cuentas Proxi por correo, rol y estado." />
      <SimpleTable headers={['Correo', 'Rol', 'Estado', 'Fecha de creación']} rows={rows} />
    </main>
  );
}
