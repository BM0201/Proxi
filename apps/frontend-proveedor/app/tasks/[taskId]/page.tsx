'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Badge, Button, Card, CardContent, EmptyState, LocationPreview, PageHeader, UploadPreview } from '@proxi/ui';
import { proveedorApi } from '../../../lib/api';

interface ApiTask {
  id: string;
  title: string;
  description: string;
  categoryName: string;
  budgetMin: number | null;
  budgetMax: number | null;
  location: { city: string; zone: string; exactAddressProtected: boolean } | null;
}

export default function ProveedorTaskDetailPage() {
  const params = useParams<{ taskId: string }>();
  const [task, setTask] = useState<ApiTask | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    proveedorApi<ApiTask>(`/tasks/${params.taskId}`)
      .then(setTask)
      .catch((err) => setError(err instanceof Error ? err.message : 'No se pudo cargar tarea'));
  }, [params.taskId]);

  if (error) return <EmptyState title="No pudimos cargar la tarea" description={error} />;
  if (!task) return <EmptyState title="Cargando tarea" description="Consultando backend real." />;

  return (
    <main style={{ maxWidth: 1040, margin: '0 auto', display: 'grid', gap: 18 }}>
      <PageHeader
        title={task.title}
        description="Detalle real de tarea disponible. Solo se muestra zona aproximada."
        actions={
          <Link href={`/offers/new?taskId=${task.id}`} style={{ textDecoration: 'none' }}>
            <Button>Enviar oferta</Button>
          </Link>
        }
      />

      <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'minmax(0, 1fr) minmax(280px, 0.7fr)' }}>
        <Card title="Detalle de la tarea">
          <CardContent>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              <Badge variant="info">{task.categoryName}</Badge>
            </div>
            <p style={{ margin: 0, color: '#334155', lineHeight: 1.6 }}>{task.description}</p>
            <p style={{ margin: '1rem 0 0', fontWeight: 800 }}>
              Presupuesto: C$ {task.budgetMin ?? '-'} - C$ {task.budgetMax ?? '-'}
            </p>
          </CardContent>
        </Card>

        <LocationPreview
          city={task.location?.city ?? 'Ciudad pendiente'}
          zone={task.location?.zone ?? 'Zona aproximada pendiente'}
          reference="La dirección exacta solo se comparte cuando el cliente acepta una oferta y confirma el pago protegido."
        />
      </div>

      <Card title="Fotos">
        <CardContent>
          <UploadPreview fileName="Fotos de tarea registradas por metadata" status="uploaded" description="Vista local; S3 queda pendiente." />
        </CardContent>
      </Card>
    </main>
  );
}
