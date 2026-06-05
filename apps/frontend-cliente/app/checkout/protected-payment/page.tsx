'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { paymentsMock, providersMock, tasksMock } from '@proxi/contracts';
import { Button, Card, CardContent, PageHeader, ProtectedPaymentSummary, StatusPill } from '@proxi/ui';
import { clienteApi } from '../../../lib/api';

interface ApiBooking {
  id: string;
  task: { title: string };
  providerName: string;
  agreedPrice: number;
  platformFee: number;
  totalAmount: number;
  protectedPaymentStatus: string;
}

export default function ProtectedPaymentPage() {
  return (
    <Suspense fallback={<PageHeader title="Confirmación / Pago protegido" description="Cargando checkout sandbox." />}>
      <ProtectedPaymentContent />
    </Suspense>
  );
}

function ProtectedPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const [booking, setBooking] = useState<ApiBooking | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!bookingId) return;
    clienteApi<ApiBooking>(`/bookings/${bookingId}`)
      .then(setBooking)
      .catch((err) => setError(err instanceof Error ? err.message : 'Usando checkout mock'));
  }, [bookingId]);

  const task = tasksMock[0];
  const provider = providersMock[0];
  const payment = paymentsMock[0];
  const title = booking?.task.title ?? task.title;
  const providerName = booking?.providerName ?? provider.name;
  const agreedPrice = booking?.agreedPrice ?? payment.amount;
  const platformFee = booking?.platformFee ?? payment.proxiFeeAmount;
  const total = booking?.totalAmount ?? payment.totalAmount;

  async function confirmPayment() {
    setLoading(true);
    try {
      if (bookingId) {
        await clienteApi(`/bookings/${bookingId}/confirm-protected-payment`, { method: 'POST' });
        router.push(`/bookings/${bookingId}`);
        return;
      }
      router.push('/bookings/mock-booking-001');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 920, margin: '0 auto', display: 'grid', gap: 18 }}>
      <PageHeader
        title="Confirmación / Pago protegido"
        description={error ? `Pago protegido simulado con fallback mock: ${error}` : 'Sandbox real de booking. No se procesa ningún pago real.'}
        actions={<StatusPill status="success" label="Pago protegido simulado" />}
      />

      <ProtectedPaymentSummary
        taskTitle={title}
        providerName={providerName}
        agreedPrice={`C$ ${agreedPrice}`}
        proxiFee={`8% · C$ ${platformFee}`}
        total={`C$ ${total}`}
      />

      <Card title="Privacidad antes del servicio">
        <CardContent>
          <p style={{ margin: 0, color: '#475569', lineHeight: 1.6 }}>
            La dirección exacta se compartirá después de aceptar y confirmar el pago protegido.
          </p>
        </CardContent>
      </Card>

      <Button size="lg" onClick={confirmPayment} disabled={loading}>
        {loading ? 'Confirmando sandbox...' : 'Confirmar y continuar'}
      </Button>
    </main>
  );
}
