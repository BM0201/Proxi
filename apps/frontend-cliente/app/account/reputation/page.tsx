'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, EmptyState, PageHeader, ReputationCard } from '@proxi/ui';
import { clienteApi, getCurrentUser } from '../../../lib/api';

interface ReputationSummary {
  userId: string;
  role: string;
  level: string;
  levelLabel: string;
  levelColor: string;
  stars: number | null;
  ratingCount: number;
  trustScore: number;
  trustStatus: string;
  trustLabel: string;
  completedTasks: number;
  cancelledTasks: number;
  inactivityStatus: string;
}

export default function ClienteReputationPage() {
  const [summary, setSummary] = useState<ReputationSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const user = await getCurrentUser();
        const data = await clienteApi<ReputationSummary>(`/reputation/user/${user.id}?role=CLIENT`);
        setSummary(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudo cargar tu reputación');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main style={{ maxWidth: 760, margin: '0 auto', display: 'grid', gap: 18 }}>
      <PageHeader
        title="Mi reputación"
        description="Tu nivel como Cliente y tu estado de confianza dentro de Proxi."
      />

      {loading ? <EmptyState title="Cargando reputación" description="Calculando tu nivel y confianza." /> : null}
      {error ? <EmptyState title="No pudimos cargar tu reputación" description={error} /> : null}

      {summary ? (
        <>
          <ReputationCard
            title="Reputación como Cliente"
            levelLabel={summary.levelLabel}
            levelColor={summary.levelColor}
            stars={summary.stars}
            ratingCount={summary.ratingCount}
            trustScore={summary.trustScore}
            trustStatus={summary.trustStatus}
            trustLabel={summary.trustLabel}
            completedTasks={summary.completedTasks}
            cancelledTasks={summary.cancelledTasks}
          />

          <Card title="¿Cómo funciona la reputación?">
            <CardContent>
              <ul style={{ margin: 0, paddingLeft: 18, color: '#475569', fontSize: 14, display: 'grid', gap: 6 }}>
                <li>Tu <strong>nivel</strong> sube al completar Tareas y mantener buen comportamiento de pago.</li>
                <li>El <strong>puntaje de confianza</strong> (0-100) inicia en 70 y se ajusta con cada evento.</li>
                <li>Las cancelaciones tardías, ausencias o intentos de pago por fuera de Proxi bajan tu confianza.</li>
                <li>Mantener un estado de confianza <strong>Normal</strong> te da acceso a más Proveedores y mejores Tareas.</li>
              </ul>
            </CardContent>
          </Card>
        </>
      ) : null}
    </main>
  );
}
