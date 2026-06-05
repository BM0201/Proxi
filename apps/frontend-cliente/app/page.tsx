import Link from 'next/link';
import { categoriesMock } from '@proxi/contracts';
import { Button, Card, CardContent, CardHeader, CardTitle, CategoryCard, SearchHero, StepFlow } from '@proxi/ui';

const steps = [
  { title: 'Buscar o publicar', description: 'Contá qué necesitás resolver o elegí una categoría rápida.' },
  { title: 'Recibir ofertas', description: 'Compará precio, nivel, estrellas y reputación de proveedores independientes.' },
  { title: 'Elegir proveedor', description: 'Aceptá una oferta sin exponer teléfono, WhatsApp ni correo.' },
  { title: 'Pago protegido', description: 'Confirmá el servicio con pago protegido antes de compartir dirección exacta.' },
];

const categoryDescriptions: Record<string, string> = {
  Electricidad: 'Instalaciones, tomas, luces y revisiones.',
  Fontanería: 'Fugas, llaves, lavamanos y visitas técnicas.',
  Limpieza: 'Casas, apartamentos y limpiezas profundas.',
  Clases: 'Apoyo puntual con profesores independientes.',
  Mandados: 'Compras, vueltas y ayuda cerca de vos.',
  Instalaciones: 'Abanicos, soportes, lámparas y más.',
  Reparaciones: 'Arreglos rápidos del hogar o negocio.',
  Más: 'Publicá una tarea abierta y recibí ofertas.',
};

export default function HomePage() {
  return (
    <main style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gap: 24 }}>
      <SearchHero
        title="¿Conocés a alguien que...?"
        subtitle="Buscalo en Proxi."
        placeholder="¿Qué necesitás resolver?"
        action={
          <Link href="/tasks/new" style={{ textDecoration: 'none' }}>
            <Button size="lg">Publicar tarea</Button>
          </Link>
        }
      />

      <section style={{ display: 'grid', gap: 14 }}>
        <h2 style={{ margin: 0, fontSize: 22 }}>Categorías rápidas</h2>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
          {categoriesMock.map((category) => (
            <CategoryCard key={category} label={category} description={categoryDescriptions[category]} />
          ))}
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>¿No encontrás a quien pueda hacerlo?</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap', alignItems: 'center' }}>
            <p style={{ margin: 0, color: '#475569', fontSize: 17 }}>Publicá tu tarea gratis y recibí ofertas.</p>
            <Link href="/tasks/new" style={{ textDecoration: 'none' }}>
              <Button>Publicar una tarea</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <section style={{ display: 'grid', gap: 14 }}>
        <h2 style={{ margin: 0, fontSize: 22 }}>Cómo funciona</h2>
        <StepFlow steps={steps} />
      </section>
    </main>
  );
}
