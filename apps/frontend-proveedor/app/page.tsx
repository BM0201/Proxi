import { Badge, Card, CardContent, LevelBadge, PageHeader, RatingStars, StatCard, StatusPill } from '@proxi/ui';

export default function HomePage() {
  return (
    <main style={{ maxWidth: 1040, margin: '0 auto' }}>
      <PageHeader
        title="Quiero ofrecer mis servicios"
        description="Construí reputación resolviendo tareas reales para gente que pregunta: ¿Conocés a alguien que...?"
        actions={<LevelBadge level={2} />}
      />

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <StatCard label="Nivel del proveedor" value="Nivel 2" description="Trabajos completados y buena reputación." />
        <StatCard label="Estrellas" value={<RatingStars value={4} />} description="Satisfacción del cliente." />
        <StatCard label="Servicios" value="4" description="Electricidad, instalaciones y mantenimiento." />
        <StatCard label="Liquidaciones" value="15/30" description="Ciclo visual según nivel." />
      </div>

      <div style={{ marginTop: 18, display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        <Card title="Oferta visible en Proxi">
          <CardContent>
            <p style={{ margin: 0, color: '#6b7280' }}>
              Mostrá precio, tiempo estimado y condiciones dentro de la app. No compartás teléfono ni enlaces externos.
            </p>
            <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Badge variant="info">Chat interno</Badge>
              <Badge variant="success">Pago protegido</Badge>
              <StatusPill status="warning" label="Regateo controlado" />
            </div>
          </CardContent>
        </Card>
        <Card title="Reputación y nivel">
          <CardContent>
            <p style={{ margin: 0, color: '#6b7280' }}>
              Las estrellas miden satisfacción. El nivel mide verificación, trayectoria y confianza. Una cuota no compra confianza falsa.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
