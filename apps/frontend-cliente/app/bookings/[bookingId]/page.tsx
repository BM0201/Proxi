'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { bookingsMock, offersMock, providersMock, tasksMock } from '@proxi/contracts';
import { Button, Card, CardContent, LocationPreview, PageHeader, StatusPill } from '@proxi/ui';
import { clienteApi } from '../../../lib/api';

interface ApiBooking {
  id: string;
  task: { title: string; location: { city: string; zone: string; addressLine1?: string; exactAddressProtected: boolean } | null };
  providerName: string;
  agreedPrice: number;
  protectedPaymentStatus: string;
  createdAt: string;
}

export default function BookingConfirmedPage() {
  const params = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<ApiBooking | null>(null);

  useEffect(() => {
    clienteApi<ApiBooking>(`/bookings/${params.bookingId}`).then(setBooking).catch(() => undefined);
  }, [params.bookingId]);

  const mockBooking = bookingsMock[0];
  const task = tasksMock.find((item) => item.id === mockBooking.taskId) ?? tasksMock[0];
  const offer = offersMock.find((item) => item.id === mockBooking.offerId) ?? offersMock[0];
  const provider = providersMock.find((item) => item.id === offer.providerId) ?? providersMock[0];

  return (
    <main style={{ maxWidth: 920, margin: '0 auto', display: 'grid', gap: 18 }}>
      <PageHeader
        title="Reserva confirmada"
        description="Ahora podés coordinar detalles dentro de Proxi."
        actions={<StatusPill status="success" label={booking?.protectedPaymentStatus ?? 'Pago protegido confirmado'} />}
      />

      <Card title={booking?.task.title ?? task.title}>
        <CardContent>
          <p><strong>Proveedor:</strong> {booking?.providerName ?? provider.name}</p>
          <p><strong>Precio acordado:</strong> C$ {booking?.agreedPrice ?? offer.price}</p>
          <LocationPreview
            city={booking?.task.location?.city ?? task.location.city}
            zone={booking?.task.location?.zone ?? mockBooking.zone}
            reference={booking?.task.location?.exactAddressProtected ? 'Dirección exacta protegida.' : booking?.task.location?.addressLine1 ?? 'Dirección exacta disponible por pago protegido sandbox.'}
          />
        </CardContent>
      </Card>

      <Card title="Próximo paso">
        <CardContent>
          <p style={{ marginTop: 0, color: '#475569' }}>Ahora podés coordinar detalles dentro de Proxi.</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Button disabled>Abrir chat</Button>
            <Button variant="secondary" disabled>Marcar como completado</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
