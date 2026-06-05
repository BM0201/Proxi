'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, PageHeader, SimpleTable, StatusPill } from '@proxi/ui';
import { adminApi } from '../../lib/api';

interface AdminBooking {
  id: string;
  status: string;
  protectedPaymentStatus: string;
  totalAmount: string | number;
  createdAt: string;
  task: { id: string; title: string } | null;
  client: { id: string; displayName: string } | null;
  provider: { id: string; displayName: string } | null;
}

function tone(status: string): 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
  if (status === 'COMPLETED') return 'success';
  if (status === 'IN_PROGRESS' || status === 'COMPLETED_BY_PROVIDER') return 'warning';
  if (status === 'CANCELLED' || status === 'DISPUTED') return 'danger';
  return 'info';
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi<AdminBooking[]>('/admin/bookings')
      .then(setBookings)
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar'));
  }, []);

  const rows = bookings.map((b) => [
    b.task?.title ?? '—',
    b.client?.displayName ?? '—',
    b.provider?.displayName ?? '—',
    `C$ ${Number(b.totalAmount).toFixed(2)}`,
    <StatusPill key={`${b.id}-st`} status={tone(b.status)} label={b.status} />,
    <StatusPill key={`${b.id}-pay`} status={b.protectedPaymentStatus === 'APPROVED_FOR_PAYOUT' ? 'success' : 'info'} label={b.protectedPaymentStatus} />,
    new Date(b.createdAt).toLocaleDateString('es-NI'),
  ]);

  return (
    <main style={{ maxWidth: 1160, margin: '0 auto' }}>
      <PageHeader title="Reservas" description="Reservas reales con estado y estado de pago protegido (sandbox)." />
      {error ? <p style={{ color: '#b91c1c' }}>{error}</p> : null}
      <Card>
        <CardContent style={{ paddingTop: '1.25rem' }}>
          <SimpleTable
            headers={['Tarea', 'Cliente', 'Proveedor', 'Monto', 'Estado', 'Pago protegido', 'Fecha']}
            rows={rows}
          />
        </CardContent>
      </Card>
    </main>
  );
}
