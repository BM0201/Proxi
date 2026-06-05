'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, PageHeader, StatCard } from '@proxi/ui';
import { adminApi } from '../../lib/api';

interface Overview {
  users: number;
  providers: number;
  tasks: number;
  bookings: number;
  openFlags: number;
  pendingVerifications: number;
  protectedPayments: number;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi<Overview>('/admin/overview')
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar'));
  }, []);

  return (
    <main style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gap: 18 }}>
      <PageHeader
        title="Dashboard"
        description="Métricas reales del backend: usuarios, proveedores, tareas, reservas, pagos protegidos y moderación."
      />
      {error ? <p style={{ color: '#b91c1c' }}>{error}</p> : null}
      {!data && !error ? <p style={{ color: '#6d6877' }}>Cargando métricas…</p> : null}
      {data ? (
        <>
          <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))' }}>
            <StatCard label="Usuarios" value={data.users} description="Cuentas registradas." />
            <StatCard label="Proveedores" value={data.providers} description="Perfiles de proveedor." />
            <StatCard label="Tareas" value={data.tasks} description="Tareas publicadas." />
            <StatCard label="Reservas" value={data.bookings} description="Reservas creadas." />
            <StatCard label="Pagos protegidos" value={data.protectedPayments} description="Saldo retenido (sandbox)." />
            <StatCard label="Verificaciones pendientes" value={data.pendingVerifications} description="Por revisar." />
            <StatCard label="Alertas anti-fuga" value={data.openFlags} description="Flags de moderación abiertos." />
          </div>
          <Card>
            <CardContent style={{ paddingTop: '1.25rem' }}>
              <p style={{ margin: 0, color: '#6d6877' }}>
                Datos en vivo desde <code>/api/admin/overview</code>. Los pagos son sandbox (sin dinero real).
              </p>
            </CardContent>
          </Card>
        </>
      ) : null}
    </main>
  );
}
