'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { tasksMock } from '@proxi/contracts';
import { Badge, Button, Card, CardContent, EmptyState, LocationPreview, PageHeader, StatusPill, UploadPreview } from '@proxi/ui';
import { clienteApi } from '../../../lib/api';

interface ApiTask {
  id: string;
  title: string;
  description: string;
  categoryName: string;
  status: string;
  budgetMin: number | null;
  budgetMax: number | null;
  offerCount: number;
  location: { city: string; zone: string; latitude?: number; longitude?: number; exactAddressProtected?: boolean } | null;
}

export default function ClienteTaskDetailPage() {
  const params = useParams<{ taskId: string }>();
  const [task, setTask] = useState<ApiTask | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    clienteApi<ApiTask>(`/tasks/${params.taskId}`)
      .then(setTask)
      .catch((err) => setError(err instanceof Error ? err.message : 'Usando detalle mock'));
  }, [params.taskId]);

  const fallback = tasksMock[0];
  const view = task ?? {
    id: fallback.id,
    title: `${fallback.title} (mock)`,
    description: fallback.description,
    categoryName: fallback.category,
    status: fallback.status,
    budgetMin: fallback.budgetMin,
    budgetMax: fallback.budgetMax,
    offerCount: fallback.offerCount,
    location: { city: fallback.location.city, zone: fallback.location.zone, latitude: fallback.location.latitude, longitude: fallback.location.longitude },
  };

  return (
    <main style={{ maxWidth: 1040, margin: '0 auto', display: 'grid', gap: 18 }}>
      <PageHeader
        title={view.title}
        description={error ? `Fallback mock: ${error}` : 'Detalle real de la tarea publicada. La dirección exacta permanece protegida.'}
        actions={<StatusPill status="warning" label={view.status} />}
      />

      {!task && !error ? <EmptyState title="Cargando tarea" description="Consultando backend real." /> : null}

      <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'minmax(0, 1fr) minmax(280px, 0.7fr)' }}>
        <Card title="Resumen de tarea">
          <CardContent>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
              <Badge variant="info">{view.categoryName}</Badge>
              <Badge variant="success">{view.offerCount} ofertas recibidas</Badge>
            </div>
            <p style={{ margin: 0, color: '#334155', lineHeight: 1.6 }}>{view.description}</p>
            <p style={{ margin: '1rem 0 0', fontWeight: 800 }}>
              Presupuesto: C$ {view.budgetMin ?? '-'} - C$ {view.budgetMax ?? '-'}
            </p>
          </CardContent>
        </Card>

        <div style={{ display: 'grid', gap: 14 }}>
          <LocationPreview
            city={view.location?.city ?? 'Ciudad pendiente'}
            zone={view.location?.zone ?? 'Zona aproximada pendiente'}
            reference="Dirección exacta protegida hasta aceptar una oferta y confirmar pago protegido."
            latitude={view.location?.latitude}
            longitude={view.location?.longitude}
          />
          <Link href={`/tasks/${view.id}/offers`} style={{ textDecoration: 'none' }}>
            <Button style={{ width: '100%' }}>Ver ofertas</Button>
          </Link>
        </div>
      </div>

      <Card title="Fotos">
        <CardContent>
          <UploadPreview fileName={task ? 'Fotos registradas por metadata local' : 'Fotos mock'} status="uploaded" description="S3 real queda pendiente." />
        </CardContent>
      </Card>
    </main>
  );
}
