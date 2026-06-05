'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button, EmptyState, PageHeader, TaskCard } from '@proxi/ui';
import { clienteApi } from '../../lib/api';

interface ApiTask {
  id: string;
  title: string;
  categoryName: string;
  status: string;
  budgetMin: number | null;
  budgetMax: number | null;
  offerCount: number;
  location: { zone: string } | null;
  createdAt: string;
  description: string;
}

const statusLabels: Record<string, { label: string; tone: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' }> = {
  PUBLISHED: { label: 'Publicada', tone: 'info' },
  RECEIVING_OFFERS: { label: 'Recibiendo ofertas', tone: 'warning' },
  OFFER_ACCEPTED: { label: 'Oferta aceptada', tone: 'success' },
  PROTECTED_PAYMENT_CONFIRMED: { label: 'Pago protegido', tone: 'success' },
  IN_PROGRESS: { label: 'En proceso', tone: 'info' },
  COMPLETED: { label: 'Completada', tone: 'neutral' },
};

export default function ClienteTasksPage() {
  const [tasks, setTasks] = useState<ApiTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    clienteApi<ApiTask[]>('/tasks/me')
      .then(setTasks)
      .catch((err) => setError(err instanceof Error ? err.message : 'No se pudieron cargar tareas'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gap: 18 }}>
      <PageHeader
        title="Mis tareas"
        description="Tareas reales creadas desde tu cuenta cliente."
        actions={
          <Link href="/tasks/new" style={{ textDecoration: 'none' }}>
            <Button>Publicar tarea</Button>
          </Link>
        }
      />

      {loading ? <EmptyState title="Cargando tareas" description="Buscando tus tareas reales en Proxi." /> : null}
      {error ? <EmptyState title="No pudimos cargar tareas" description={error} /> : null}
      {!loading && !error && tasks.length === 0 ? (
        <EmptyState title="Todavía no hay tareas reales" description="Publicá una tarea para recibir ofertas de proveedores independientes." />
      ) : null}

      <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))' }}>
        {tasks.map((task) => {
          const status = statusLabels[task.status] ?? { label: task.status, tone: 'neutral' as const };

          return (
            <TaskCard
              key={task.id}
              title={task.title}
              category={task.categoryName}
              statusLabel={status.label}
              statusTone={status.tone}
              budget={`C$ ${task.budgetMin ?? '-'} - C$ ${task.budgetMax ?? '-'}`}
              offers={`${task.offerCount} ofertas recibidas`}
              zone={task.location?.zone ?? 'Zona aproximada pendiente'}
              date={new Date(task.createdAt).toLocaleDateString('es-NI')}
              description={task.description}
              action={
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <Link href={`/tasks/${task.id}`} style={{ textDecoration: 'none' }}>
                    <Button variant="secondary" size="sm">Ver detalle</Button>
                  </Link>
                  <Link href={`/tasks/${task.id}/offers`} style={{ textDecoration: 'none' }}>
                    <Button size="sm">Ver ofertas</Button>
                  </Link>
                </div>
              }
            />
          );
        })}
      </div>
    </main>
  );
}
