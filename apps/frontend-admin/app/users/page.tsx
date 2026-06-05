'use client';

import { useEffect, useState } from 'react';
import { Badge, PageHeader, SimpleTable, StatusPill } from '@proxi/ui';
import { adminApi } from '../../lib/api';

interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  role: string;
  status: string;
  createdAt: string;
}

const roleVariant: Record<string, 'info' | 'success' | 'neutral'> = {
  CLIENT: 'info',
  PROVIDER: 'success',
  ADMIN: 'neutral',
  SUPER_ADMIN: 'neutral',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi<AdminUser[]>('/admin/users')
      .then(setUsers)
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar'));
  }, []);

  const rows = users.map((u) => [
    u.email,
    <Badge key={`${u.id}-role`} variant={roleVariant[u.role] ?? 'neutral'}>{u.role}</Badge>,
    <StatusPill key={`${u.id}-status`} status={u.status === 'ACTIVE' ? 'success' : 'warning'} label={u.status} />,
    new Date(u.createdAt).toLocaleDateString('es-NI'),
  ]);

  return (
    <main style={{ maxWidth: 1040, margin: '0 auto' }}>
      <PageHeader title="Usuarios" description="Cuentas Proxi reales por correo, rol y estado." />
      {error ? <p style={{ color: '#b91c1c' }}>{error}</p> : null}
      <SimpleTable headers={['Correo', 'Rol', 'Estado', 'Fecha de creación']} rows={rows} />
    </main>
  );
}
