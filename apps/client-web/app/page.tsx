import { Button, Card } from '@proxi/ui';

/**
 * Página de inicio de la app de clientes.
 * Shell mínimo funcional con App Router.
 */
export default function HomePage() {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>Proxi · Clientes</h1>
      <p style={{ color: '#6b7280', marginBottom: 24 }}>
        Publica tus tareas y recibe ofertas de proveedores independientes verificados.
      </p>
      <Card title="Empezar">
        <p style={{ marginTop: 0 }}>
          Crea una tarea, recibe ofertas y contrata con pago protegido.
        </p>
        <Button>Publicar una tarea</Button>
      </Card>
    </main>
  );
}
