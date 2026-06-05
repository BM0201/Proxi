'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Badge, Button, EmptyState, PageHeader, TaskCard } from '@proxi/ui';
import { proveedorApi } from '../../lib/api';

interface ApiTask {
  id: string;
  title: string;
  categoryName: string;
  description: string;
  budgetMin: number | null;
  budgetMax: number | null;
  offerCount: number;
  location: { zone: string } | null;
  createdAt: string;
}

export default function ProveedorTasksPage() {
  const [tasks, setTasks] = useState<ApiTask[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    proveedorApi<ApiTask[]>('/tasks/available')
      .then(setTasks)
      .catch((err) => setError(err instanceof Error ? err.message : 'No se pudieron cargar tareas'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gap: 18 }}>
      <PageHeader
        title="Tareas disponibles"
        description="Tareas reales publicadas por clientes. La dirección exacta está protegida hasta booking y pago protegido."
        actions={<Badge variant="success">Zona aproximada protegida</Badge>}
      />

      {loading ? <EmptyState title="Cargando tareas" description="Consultando tareas disponibles reales." /> : null}
      {error ? <EmptyState title="No pudimos cargar tareas" description={error} /> : null}
      {!loading && !error && tasks.length === 0 ? <EmptyState title="No hay tareas disponibles" description="Cuando un cliente publique una tarea, aparecerá acá." /> : null}

      <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))' }}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            title={task.title}
            category={task.categoryName}
            statusLabel="Disponible"
            statusTone="info"
            budget={`C$ ${task.budgetMin ?? '-'} - C$ ${task.budgetMax ?? '-'}`}
            offers={`${task.offerCount} ofertas`}
            zone={task.location?.zone ?? 'Zona aproximada pendiente'}
            date={new Date(task.createdAt).toLocaleDateString('es-NI')}
            description={task.description}
            action={
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link href={`/tasks/${task.id}`} style={{ textDecoration: 'none' }}>
                  <Button variant="secondary" size="sm">Ver detalle</Button>
                </Link>
                <Link href={`/offers/new?taskId=${task.id}`} style={{ textDecoration: 'none' }}>
                  <Button size="sm">Enviar oferta</Button>
                </Link>
              </div>
            }
          />
        ))}
      </div>
    </main>
  );
}
