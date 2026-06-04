import { Card, Badge } from '@proxi/ui';

/**
 * Página de inicio del panel de administración.
 * Shell mínimo funcional con App Router.
 */
export default function HomePage() {
  return (
    <main style={{ maxWidth: 860, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>Proxi · Administración</h1>
      <p style={{ color: '#6b7280', marginBottom: 24 }}>
        Gestiona usuarios, verificación de proveedores, disputas y moderación.
      </p>
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <Card title="Verificaciones">
          <Badge color="#f59e0b">Pendientes</Badge>
        </Card>
        <Card title="Disputas">
          <Badge color="#ef4444">Abiertas</Badge>
        </Card>
        <Card title="Moderación">
          <Badge color="#4f46e5">Reportes</Badge>
        </Card>
      </div>
    </main>
  );
}
