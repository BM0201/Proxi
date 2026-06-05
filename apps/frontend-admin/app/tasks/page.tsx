'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, PageHeader, SimpleTable, StatusPill } from '@proxi/ui';
import { adminApi } from '../../lib/api';

interface AdminTask {
  id: string;
  title: string;
  categoryName: string | null;
  status: string;
  createdAt: string;
  client: { id: string; displayName: string } | null;
  _count: { offers: number };
}

const statusMap: Record<string, { label: string; tone: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }> = {
  PUBLISHED: { label: 'Publicada', tone: 'info' },
  RECEIVING_OFFERS: { label: 'Recibiendo ofertas', tone: 'warning' },
  OFFER_ACCEPTED: { label: 'Oferta aceptada', tone: 'info' },
  PROTECTED_PAYMENT_CONFIRMED: { label: 'Pago protegido', tone: 'success' },
  IN_PROGRESS: { label: 'En progreso', tone: 'warning' },
  COMPLETED: { label: 'Completada', tone: 'success' },
};

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi<AdminTask[]>('/admin/tasks')
      .then(setTasks)
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar'));
  }, []);

  const rows = tasks.map((task) => {
    const status = statusMap[task.status] ?? { label: task.status, tone: 'neutral' as const };
    return [
      task.client?.displayName ?? 'Cliente',
      task.categoryName ?? '—',
      task.title,
      <StatusPill key={task.id} status={status.tone} label={status.label} />,
      task._count?.offers ?? 0,
      new Date(task.createdAt).toLocaleDateString('es-NI'),
    ];
  });

  return (
    <main style={{ maxWidth: 1120, margin: '0 auto' }}>
      <PageHeader title="Tareas" description="Seguimiento admin de tareas publicadas (datos reales)." />
      {error ? <p style={{ color: '#b91c1c' }}>{error}</p> : null}
      <Card>
        <CardContent style={{ paddingTop: '1.25rem' }}>
          <SimpleTable headers={['Cliente', 'Categoría', 'Título', 'Estado', 'Ofertas', 'Fecha']} rows={rows} />
        </CardContent>
      </Card>
    </main>
  );
}
