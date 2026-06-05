'use client';

import { useEffect, useState } from 'react';
import { Badge, Card, CardContent, PageHeader, SimpleTable, StatusPill } from '@proxi/ui';
import { adminApi } from '../../lib/api';

interface ModerationFlag {
  id: string;
  entityType: string;
  entityId: string;
  reason: string;
  status: string;
  createdAt: string;
  reporter?: { id: string; displayName: string | null; role: string } | null;
}

function tone(status: string): 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
  if (status === 'OPEN') return 'danger';
  if (status === 'REVIEWED') return 'warning';
  if (status === 'ACTIONED') return 'success';
  if (status === 'DISMISSED') return 'neutral';
  return 'info';
}

const DECISIONS: { value: string; label: string; variant: 'success' | 'warning' | 'neutral' }[] = [
  { value: 'REVIEWED', label: 'Marcar revisado', variant: 'warning' },
  { value: 'ACTIONED', label: 'Aplicar acción', variant: 'success' },
  { value: 'DISMISSED', label: 'Descartar', variant: 'neutral' },
];

export default function AdminModerationPage() {
  const [flags, setFlags] = useState<ModerationFlag[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = () => {
    adminApi<ModerationFlag[]>('/admin/moderation-flags')
      .then(setFlags)
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar'));
  };

  useEffect(() => {
    load();
  }, []);

  const resolve = async (id: string, status: string) => {
    setBusyId(id);
    setError(null);
    try {
      await adminApi(`/admin/moderation-flags/${id}/resolve`, {
        method: 'POST',
        body: JSON.stringify({ status }),
      });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al resolver');
    } finally {
      setBusyId(null);
    }
  };

  const rows = flags.map((f) => [
    <span key={`${f.id}-type`} style={{ fontWeight: 600 }}>{f.entityType}</span>,
    <span key={`${f.id}-reason`} style={{ display: 'block', maxWidth: 380 }}>{f.reason}</span>,
    f.reporter?.displayName ?? f.reporter?.role ?? '—',
    <StatusPill key={`${f.id}-st`} status={tone(f.status)} label={f.status} />,
    new Date(f.createdAt).toLocaleDateString('es-NI'),
    <span key={`${f.id}-act`} style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
      {f.status === 'OPEN' || f.status === 'REVIEWED'
        ? DECISIONS.map((d) => (
            <button
              key={d.value}
              type="button"
              disabled={busyId === f.id}
              onClick={() => resolve(f.id, d.value)}
              style={{
                cursor: busyId === f.id ? 'wait' : 'pointer',
                border: 'none',
                borderRadius: 6,
                padding: '0.3rem 0.6rem',
                fontSize: '0.75rem',
                background: '#0f172a',
                color: '#fff',
              }}
            >
              {d.label}
            </button>
          ))
        : <Badge variant="neutral">Resuelto</Badge>}
    </span>,
  ]);

  return (
    <main style={{ maxWidth: 1120, margin: '0 auto' }}>
      <PageHeader
        title="Moderación"
        description="Detección automática anti-fuga. Proxi mantiene comunicación, ofertas y pago protegido dentro de la plataforma."
        actions={<Badge variant="danger">{flags.filter((f) => f.status === 'OPEN').length} abiertos</Badge>}
      />
      {error ? <p style={{ color: '#b91c1c' }}>{error}</p> : null}
      <Card>
        <CardContent style={{ paddingTop: '1.25rem' }}>
          <SimpleTable
            headers={['Entidad', 'Razón', 'Reportado por', 'Estado', 'Fecha', 'Acciones']}
            rows={rows}
          />
        </CardContent>
      </Card>
    </main>
  );
}
