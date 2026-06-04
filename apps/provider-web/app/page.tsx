import { Button, Card } from '@proxi/ui';

/**
 * Página de inicio de la app de proveedores independientes.
 * Shell mínimo funcional con App Router.
 */
export default function HomePage() {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>Proxi · Proveedores</h1>
      <p style={{ color: '#6b7280', marginBottom: 24 }}>
        Encuentra tareas cercanas, envía ofertas y recibe tu liquidación por saldo aprobado.
      </p>
      <Card title="Empezar">
        <p style={{ marginTop: 0 }}>
          Como proveedor independiente verificado, ofrece tus servicios y haz crecer tu reputación.
        </p>
        <Button>Ver tareas disponibles</Button>
      </Card>
    </main>
  );
}
