import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@proxi/ui';

const popularCategories = [
  'Electricidad básica',
  'Fontanería',
  'Reparaciones del hogar',
  'Limpieza',
  'Clases particulares',
  'Mandados',
  'Instalaciones',
  'Transporte ligero',
];

const examples = [
  'Reparar un piso',
  'Instalar un abanico',
  'Cambiar una llanta',
  'Dar clases de inglés',
  'Limpiar una casa',
  'Ayudar con una mudanza pequeña',
];

export default function HomePage() {
  return (
    <main className="landing">
      <section className="hero">
        <div className="heroCopy">
          <Badge variant="info">Gente confiable cerca de vos.</Badge>
          <h1>¿Conocés a alguien que...? Buscalo en Proxi.</h1>
          <p>
            Proxi convierte la recomendación informal en una forma confiable de encontrar
            proveedores independientes verificados para tareas, reparaciones, clases, mandados,
            mantenimiento e instalaciones cerca de vos.
          </p>
          <div className="searchMock" aria-label="Pregunta principal de Proxi">
            <span>¿Qué necesitás resolver?</span>
            <strong>Ej: instalar un abanico, revisar una fuga, limpiar una casa</strong>
          </div>
          <div className="actions">
            <Button size="lg">Publicar lo que necesito</Button>
            <Button size="lg" variant="secondary">Ofrecer mis servicios</Button>
          </div>
        </div>
      </section>

      <section className="section">
        <Badge variant="neutral">Cómo funciona</Badge>
        <h2>Publicá, compará ofertas y pagá protegido.</h2>
        <div className="steps">
          <Card>
            <CardHeader>
              <CardTitle>1. Contá qué necesitás</CardTitle>
              <CardDescription>Publicá una tarea o elegí una categoría inicial.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>2. Recibí ofertas</CardTitle>
              <CardDescription>Compará nivel, estrellas, precio y experiencia.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>3. Cerrá dentro de Proxi</CardTitle>
              <CardDescription>Chat interno, pago protegido y calificación al terminar.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section className="section">
        <Badge variant="default">Categorías populares</Badge>
        <div className="categoryGrid">
          {popularCategories.map((category) => (
            <div key={category} className="category">
              {category}
            </div>
          ))}
        </div>
      </section>

      <section className="split">
        <Card title="Para clientes">
          <CardContent>
            <p>
              Encontrá quien te resuelva sin depender solo del grupo de WhatsApp, el vecino o el
              familiar que conoce a alguien. Publicá lo que necesitás y recibí ofertas dentro de Proxi.
            </p>
          </CardContent>
        </Card>
        <Card title="Para proveedores independientes">
          <CardContent>
            <p>
              Mostrá tus servicios, construí reputación, ganá nivel y recibí liquidaciones según el
              ciclo que corresponda. Proxi facilita la conexión; vos seguís siendo independiente.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="section">
        <Badge variant="success">Ejemplos reales</Badge>
        <div className="exampleList">
          {examples.map((example) => (
            <span key={example}>¿Conocés a alguien que pueda {example.toLowerCase()}?</span>
          ))}
        </div>
      </section>

      <section className="trust">
        <h2>Gente confiable cerca de vos.</h2>
        <p>
          Proxi prepara pago protegido, comunicación interna, proveedores verificados, reputación,
          niveles y soporte para que la confianza no dependa de capturas, números sueltos o acuerdos
          por fuera.
        </p>
      </section>

      <style>{`
        .landing { background: #fbfcf8; color: #172033; }
        .hero { min-height: 76vh; display: flex; align-items: center; padding: 56px 24px; background: linear-gradient(135deg, #eef7f0 0%, #f8fbff 55%, #fff7ed 100%); }
        .heroCopy { width: min(1040px, 100%); margin: 0 auto; }
        h1 { max-width: 920px; margin: 14px 0 18px; font-size: 56px; line-height: 1.04; }
        h2 { margin: 10px 0 18px; font-size: 30px; }
        p { color: #52606f; font-size: 18px; line-height: 1.65; }
        .hero p { max-width: 780px; }
        .searchMock { display: grid; gap: 6px; max-width: 720px; margin-top: 24px; padding: 18px; background: #fff; border: 1px solid #dbe4ea; border-radius: 8px; box-shadow: 0 8px 28px rgba(23,32,51,0.08); }
        .searchMock span { font-size: 18px; font-weight: 800; }
        .searchMock strong { color: #52606f; font-size: 14px; }
        .actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
        .section, .trust { width: min(1040px, calc(100% - 48px)); margin: 0 auto; padding: 54px 0; }
        .steps, .split { width: min(1040px, calc(100% - 48px)); margin: 0 auto; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; padding: 28px 0; }
        .split { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .categoryGrid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-top: 20px; }
        .category { background: #ffffff; border: 1px solid #dde5df; border-radius: 8px; padding: 18px; font-weight: 800; }
        .exampleList { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }
        .exampleList span { background: #fff; border: 1px solid #dde5df; border-radius: 999px; padding: 10px 14px; color: #334155; font-weight: 700; }
        .trust { border-top: 1px solid #dde5df; }
        @media (max-width: 860px) {
          .hero { min-height: auto; padding: 44px 18px; }
          h1 { font-size: 36px; }
          h2 { font-size: 24px; }
          p { font-size: 16px; }
          .section, .trust, .steps, .split { width: calc(100% - 36px); }
          .steps, .split, .categoryGrid { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}
