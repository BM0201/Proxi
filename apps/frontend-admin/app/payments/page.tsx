'use client';

import { useEffect, useState } from 'react';
import { Badge, Card, CardContent, PageHeader, SimpleTable, StatusPill } from '@proxi/ui';
import { adminApi } from '../../lib/api';

interface ProtectedPayment {
  id: string;
  status: string;
  protectedPaymentStatus: string;
  totalAmount: string | number;
  platformFee: string | number;
  agreedPrice: string | number;
  updatedAt: string;
}

function tone(status: string): 'success' | 'warning' | 'danger' | 'info' {
  if (status === 'APPROVED_FOR_PAYOUT') return 'success';
  if (status === 'PROTECTED') return 'info';
  if (status === 'DISPUTED') return 'danger';
  return 'warning';
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<ProtectedPayment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi<ProtectedPayment[]>('/admin/protected-payments')
      .then(setPayments)
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar'));
  }, []);

  const rows = payments.map((p) => [
    p.id.slice(-8),
    `C$ ${Number(p.agreedPrice).toFixed(2)}`,
    `C$ ${Number(p.platformFee).toFixed(2)}`,
    `C$ ${Number(p.totalAmount).toFixed(2)}`,
    <StatusPill key={`${p.id}-pay`} status={tone(p.protectedPaymentStatus)} label={p.protectedPaymentStatus} />,
    new Date(p.updatedAt).toLocaleDateString('es-NI'),
  ]);

  return (
    <main style={{ maxWidth: 1120, margin: '0 auto' }}>
      <PageHeader
        title="Pagos protegidos"
        description="Saldo retenido y aprobado para liquidación. Sandbox: no procesa pagos reales."
        actions={<Badge variant="success">Sandbox financiero</Badge>}
      />
      {error ? <p style={{ color: '#b91c1c' }}>{error}</p> : null}
      <Card>
        <CardContent style={{ paddingTop: '1.25rem' }}>
          <SimpleTable
            headers={['Reserva', 'Precio acordado', 'Comisión Proxi', 'Total', 'Estado pago', 'Actualizado']}
            rows={rows}
          />
        </CardContent>
      </Card>
    </main>
  );
}
