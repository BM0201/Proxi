'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button, Card, CardContent, EmptyState, PageHeader, SimpleTable, StatusPill } from '@proxi/ui';
import { proveedorApi } from '../../lib/api';

interface ApiOffer {
  id: string;
  taskId: string;
  task?: { title: string };
  amount: number;
  status: string;
  createdAt: string;
}

const statusLabels: Record<string, { label: string; tone: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' }> = {
  SENT: { label: 'Enviada', tone: 'info' },
  VIEWED: { label: 'Vista por cliente', tone: 'warning' },
  ACCEPTED: { label: 'Aceptada', tone: 'success' },
  REJECTED: { label: 'Rechazada', tone: 'danger' },
};

export default function ProviderOffersPage() {
  const [offers, setOffers] = useState<ApiOffer[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    proveedorApi<ApiOffer[]>('/offers/me').then(setOffers).catch((err) => setError(err instanceof Error ? err.message : 'No se pudieron cargar ofertas'));
  }, []);

  const rows = offers.map((offer) => {
    const status = statusLabels[offer.status] ?? { label: offer.status, tone: 'neutral' as const };
    return [
      offer.task?.title ?? offer.taskId,
      `C$ ${offer.amount}`,
      <StatusPill key={offer.id} status={status.tone} label={status.label} />,
      new Date(offer.createdAt).toLocaleDateString('es-NI'),
      <Link key={`${offer.id}-action`} href={`/tasks/${offer.taskId}`} style={{ textDecoration: 'none' }}>
        <Button size="sm" variant="secondary">Ver</Button>
      </Link>,
    ];
  });

  return (
    <main style={{ maxWidth: 1040, margin: '0 auto' }}>
      <PageHeader title="Ofertas enviadas" description="Ofertas reales enviadas por tu cuenta de proveedor independiente." />
      {error ? <EmptyState title="No pudimos cargar ofertas" description={error} /> : null}
      {!error && offers.length === 0 ? <EmptyState title="No hay ofertas enviadas" description="Elegí una tarea disponible para enviar tu primera oferta." /> : null}
      {offers.length > 0 ? (
        <Card>
          <CardContent style={{ paddingTop: '1.25rem' }}>
            <SimpleTable headers={['Tarea', 'Precio ofertado', 'Estado', 'Fecha', 'Acción']} rows={rows} />
          </CardContent>
        </Card>
      ) : null}
    </main>
  );
}
