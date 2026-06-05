import { providersMock } from '@proxi/contracts';
import { Card, CardContent, LevelBadge, PageHeader, RatingStars, SimpleTable, StatusPill } from '@proxi/ui';

const levelMap = {
  LEVEL_0: 0,
  LEVEL_1: 1,
  LEVEL_2: 2,
  LEVEL_3: 3,
  LEVEL_4_PRO: 4,
  LEVEL_5_PREMIUM: 5,
} as const;

export default function AdminProvidersPage() {
  const rows = providersMock.map((provider) => [
    provider.name,
    <LevelBadge key={`${provider.id}-level`} level={levelMap[provider.level]} />,
    <span key={`${provider.id}-stars`} style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
      <RatingStars value={provider.rating} /> {provider.rating}
    </span>,
    <StatusPill key={`${provider.id}-verification`} status="success" label="Verificado" />,
    provider.completedJobs,
    <StatusPill key={`${provider.id}-status`} status="info" label="Activo" />,
  ]);

  return (
    <main style={{ maxWidth: 1120, margin: '0 auto' }}>
      <PageHeader title="Proveedores" description="Nivel, estrellas, verificación, trabajos y estado operativo." />
      <Card>
        <CardContent style={{ paddingTop: '1.25rem' }}>
          <SimpleTable headers={['Nombre', 'Nivel', 'Estrellas', 'Verificación', 'Trabajos', 'Estado']} rows={rows} />
        </CardContent>
      </Card>
    </main>
  );
}
