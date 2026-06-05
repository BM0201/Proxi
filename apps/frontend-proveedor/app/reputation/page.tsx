import { Card, CardContent, LevelBadge, PageHeader, RatingStars, StatCard } from '@proxi/ui';

export default function ProveedorReputationPage() {
  return (
    <main style={{ maxWidth: 1040, margin: '0 auto' }}>
      <PageHeader
        title="Reputación"
        description="Separación visual entre estrellas, nivel, historial y verificación. Sin reglas reales todavía."
        actions={<LevelBadge level={3} />}
      />
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <StatCard label="Estrellas" value={<RatingStars value={5} />} description="Calidad, trato, puntualidad y cumplimiento." />
        <StatCard label="Trabajos completados" value="128" description="Mock de historial visible." />
        <StatCard label="Puntualidad" value="97%" description="Indicador visual no conectado." />
      </div>
      <div style={{ marginTop: 18 }}>
        <Card title="Nivel 3 — Verificado Proxi">
          <CardContent>
            <p style={{ margin: 0, color: '#6b7280' }}>
              El nivel representa verificación, trayectoria y confianza. Los niveles altos deben requerir mérito, certificación, historial o validación real.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
