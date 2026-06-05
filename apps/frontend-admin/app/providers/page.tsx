'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, LevelBadge, PageHeader, RatingStars, SimpleTable, StatusPill } from '@proxi/ui';
import { adminApi } from '../../lib/api';

interface AdminProvider {
  id: string;
  displayName: string | null;
  level: keyof typeof levelMap;
  ratingAverage: number;
  ratingCount: number;
  completedJobs: number;
  verificationStatus: string;
  user: { id: string; email: string; displayName: string; status: string };
}

const levelMap = {
  LEVEL_0: 0,
  LEVEL_1: 1,
  LEVEL_2: 2,
  LEVEL_3: 3,
  LEVEL_4_PRO: 4,
  LEVEL_5_PREMIUM: 5,
} as const;

function verificationStatus(status: string): 'success' | 'warning' | 'danger' | 'info' {
  if (status === 'APPROVED') return 'success';
  if (status === 'REJECTED') return 'danger';
  if (status === 'PENDING_REVIEW' || status === 'NEEDS_CORRECTION') return 'warning';
  return 'info';
}

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<AdminProvider[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi<AdminProvider[]>('/admin/providers')
      .then(setProviders)
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar'));
  }, []);

  const rows = providers.map((p) => [
    p.displayName ?? p.user?.displayName ?? 'Proveedor',
    <LevelBadge key={`${p.id}-level`} level={levelMap[p.level] ?? 0} />,
    <span key={`${p.id}-stars`} style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
      <RatingStars value={p.ratingAverage} /> {p.ratingAverage.toFixed(1)} ({p.ratingCount})
    </span>,
    <StatusPill key={`${p.id}-verif`} status={verificationStatus(p.verificationStatus)} label={p.verificationStatus} />,
    p.completedJobs,
    <StatusPill key={`${p.id}-status`} status={p.user?.status === 'ACTIVE' ? 'success' : 'info'} label={p.user?.status ?? '—'} />,
  ]);

  return (
    <main style={{ maxWidth: 1120, margin: '0 auto' }}>
      <PageHeader title="Proveedores" description="Nivel, estrellas, verificación, trabajos y estado (datos reales)." />
      {error ? <p style={{ color: '#b91c1c' }}>{error}</p> : null}
      <Card>
        <CardContent style={{ paddingTop: '1.25rem' }}>
          <SimpleTable headers={['Nombre', 'Nivel', 'Estrellas', 'Verificación', 'Trabajos', 'Estado']} rows={rows} />
        </CardContent>
      </Card>
    </main>
  );
}
