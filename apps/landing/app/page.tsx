import { Button } from '@proxi/ui';

/**
 * Landing pública de Proxi.
 * Shell mínimo funcional con App Router.
 */
export default function HomePage() {
  return (
    <main style={{ maxWidth: 880, margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: 44, marginBottom: 12 }}>Proxi</h1>
      <p style={{ fontSize: 20, color: '#6b7280', marginBottom: 32 }}>
        Conecta con proveedores independientes verificados para resolver tus tareas del día a día.
        Con pago protegido y reseñas reales.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <Button>Soy cliente</Button>
        <Button variant="secondary">Soy proveedor</Button>
      </div>
    </main>
  );
}
