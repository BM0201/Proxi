'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Badge, Button, PageHeader, SimpleTable, StatusPill, VerificationStatusBadge } from '@proxi/ui';
import { adminApi } from '../../lib/api';

type VerStatus = 'NOT_STARTED' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'NEEDS_CORRECTION';

interface Verification {
  id: string;
  status: VerStatus;
  createdAt: string;
  identityDocumentBackMediaId?: string | null;
  selfieMediaId?: string | null;
  provider: {
    user: { id: string; email: string; displayName: string | null };
  };
}

export default function AdminVerificationsPage() {
  const [items, setItems] = useState<Verification[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi<Verification[]>('/admin/verifications')
      .then(setItems)
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar'));
  }, []);

  const rows = items.map((v) => {
    const docs = 1 + (v.identityDocumentBackMediaId ? 1 : 0) + (v.selfieMediaId ? 1 : 0);
    return [
      v.provider.user.displayName ?? '—',
      v.provider.user.email,
      <VerificationStatusBadge key={`${v.id}-st`} status={v.status} />,
      new Date(v.createdAt).toLocaleDateString('es-NI'),
      `${docs} documento(s)`,
      <Link key={`${v.id}-link`} href={`/verifications/${v.id}`}>
        <Button size="sm" variant="secondary">Ver detalle</Button>
      </Link>,
    ];
  });

  return (
    <main style={{ maxWidth: 1120, margin: '0 auto' }}>
      <PageHeader
        title="Verificaciones"
        description="Revisión manual de proveedores independientes. Los documentos no se exponen a clientes."
        actions={<StatusPill status="warning" label={`${items.filter((v) => v.status === 'PENDING_REVIEW').length} pendientes`} />}
      />
      {error ? <p style={{ color: '#b91c1c' }}>{error}</p> : null}
      <SimpleTable headers={['Proveedor', 'Correo', 'Estado', 'Fecha', 'Documentos', 'Acción']} rows={rows} />
      <div style={{ marginTop: 14 }}>
        <Badge variant="neutral">La verificación inicial es manual y queda trazada para auditoría.</Badge>
      </div>
    </main>
  );
}
