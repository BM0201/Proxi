'use client';

import { useEffect, useState } from 'react';
import { Badge, Card, CardContent, EmptyState, PageHeader, SimpleTable, StatusPill } from '@proxi/ui';
import { proveedorApi } from '../../lib/api';

interface ApiBooking {
  id: string;
  task: { title: string; location: { zone: string } | null };
  clientName: string;
  protectedPaymentStatus: string;
  agreedPrice: number;
  createdAt: string;
}

export default function ProviderBookingsPage() {
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    proveedorApi<ApiBooking[]>('/bookings/me').then(setBookings).catch((err) => setError(err instanceof Error ? err.message : 'No se pudieron cargar reservas'));
  }, []);

  const rows = bookings.map((booking) => [
    booking.task.title,
    booking.clientName,
    <StatusPill key={booking.id} status="success" label={booking.protectedPaymentStatus} />,
    new Date(booking.createdAt).toLocaleDateString('es-NI'),
    booking.task.location?.zone ?? 'Zona protegida',
    `C$ ${booking.agreedPrice}`,
  ]);

  return (
    <main style={{ maxWidth: 1120, margin: '0 auto' }}>
      <PageHeader title="Trabajos aceptados" description="Reservas reales con pago protegido sandbox." actions={<Badge variant="success">Pago protegido sandbox</Badge>} />
      {error ? <EmptyState title="No pudimos cargar reservas" description={error} /> : null}
      {!error && bookings.length === 0 ? <EmptyState title="No hay trabajos aceptados" description="Cuando un cliente acepte una oferta, aparecerá acá." /> : null}
      {bookings.length > 0 ? (
        <Card>
          <CardContent style={{ paddingTop: '1.25rem' }}>
            <SimpleTable headers={['Tarea', 'Cliente', 'Estado del pago', 'Fecha', 'Zona', 'Monto']} rows={rows} />
          </CardContent>
        </Card>
      ) : null}
    </main>
  );
}
