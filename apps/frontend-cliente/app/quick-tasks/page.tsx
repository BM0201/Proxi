'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button, Card, CardContent, EmptyState, PageHeader, TaskTypeBadge } from '@proxi/ui';
import { clienteApi } from '../../lib/api';

interface QuickTask {
  id: string;
  title: string;
  categoryName: string;
  status: string;
  quickTaskMode: string | null;
  estimatedDurationMinutes: number | null;
  radiusKm: number | null;
  budgetMin: number | null;
  budgetMax: number | null;
  offerCount: number;
  location: { zone: string | null; city: string | null } | null;
  createdAt: string;
  description: string;
}

const modeLabels: Record<string, string> = {
  DIRECT_ACCEPT: 'Aceptación directa',
  QUICK_AUCTION: 'Subasta rápida',
};

export default function ClienteQuickTasksPage() {
  const [tasks, setTasks] = useState<QuickTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reutilizamos /tasks/me y filtramos las Tareas rápidas del Cliente.
    clienteApi<QuickTask[]>('/tasks/me')
      .then((all) => setTasks(all.filter((t) => (t as any).taskType === 'QUICK_TASK')))
      .catch((err) => setError(err instanceof Error ? err.message : 'No se pudieron cargar las tareas rápidas'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gap: 18 }}>
      <PageHeader
        title="Tareas rápidas"
        description="Trabajos de corta duración resueltos por aceptación directa o subasta rápida."
        actions={
          <Link href="/tasks/new" style={{ textDecoration: 'none' }}>
            <Button>Publicar tarea rápida</Button>
          </Link>
        }
      />

      <Card title="¿Qué es una tarea rápida?">
        <CardContent>
          <p style={{ margin: 0, color: '#475569', fontSize: 14 }}>
            Una <strong>tarea rápida</strong> es de corta duración (máximo 1 día). Podés elegir
            <strong> aceptación directa</strong> (el primer Proveedor independiente elegible la toma) o
            <strong> subasta rápida</strong> (recibís varias ofertas en poco tiempo). Notificamos a los
            Proveedores dentro del radio de cobertura que cumplan tus requisitos de valoración y confianza.
          </p>
        </CardContent>
      </Card>

      {loading ? <EmptyState title="Cargando tareas rápidas" description="Buscando tus tareas rápidas." /> : null}
      {error ? <EmptyState title="No pudimos cargar" description={error} /> : null}
      {!loading && !error && tasks.length === 0 ? (
        <EmptyState
          title="Todavía no tenés tareas rápidas"
          description="Publicá una tarea rápida para resolver algo de corta duración hoy mismo."
        />
      ) : null}

      <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))' }}>
        {tasks.map((task) => (
          <Card key={task.id} title={task.title}>
            <CardContent>
              <div style={{ display: 'grid', gap: 10 }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  <TaskTypeBadge taskType="QUICK_TASK" />
                  {task.quickTaskMode ? (
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#075985' }}>
                      {modeLabels[task.quickTaskMode] ?? task.quickTaskMode}
                    </span>
                  ) : null}
                </div>
                <p style={{ margin: 0, fontSize: 13, color: '#475569' }}>{task.description}</p>
                <div style={{ fontSize: 13, color: '#0f172a' }}>
                  <div>Categoría: {task.categoryName}</div>
                  <div>
                    Presupuesto: C$ {task.budgetMin ?? '-'} - C$ {task.budgetMax ?? '-'}
                  </div>
                  {task.estimatedDurationMinutes ? <div>Duración estimada: {task.estimatedDurationMinutes} min</div> : null}
                  {task.radiusKm ? <div>Radio: {task.radiusKm} km</div> : null}
                  <div>Zona: {task.location?.zone ?? 'Zona aproximada'}</div>
                  <div>Ofertas: {task.offerCount}</div>
                </div>
                <Link href={`/tasks/${task.id}`} style={{ textDecoration: 'none' }}>
                  <Button variant="secondary" size="sm">Ver detalle</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
