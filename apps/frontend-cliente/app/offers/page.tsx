import { Badge, Card, CardContent, LevelBadge, PageHeader, RatingStars, SimpleTable, StatusPill } from '@proxi/ui';

const rows = [
  ['Carlos M.', <LevelBadge key="level" level={3} />, <RatingStars key="stars" value={5} />, 'C$850', <StatusPill key="status" status="info" label="Oferta mock" />],
  ['Ana R.', <LevelBadge key="level" level={2} />, <RatingStars key="stars" value={4} />, 'C$700', <StatusPill key="status" status="warning" label="Negociable" />],
];

export default function ClienteOffersPage() {
  return (
    <main style={{ maxWidth: 1040, margin: '0 auto' }}>
      <PageHeader
        title="Ofertas recibidas"
        description="Compará precio, nivel, estrellas y experiencia antes de aceptar y pagar protegido."
        actions={<Badge variant="neutral">Sin datos reales</Badge>}
      />
      <Card>
        <CardContent style={{ paddingTop: '1.25rem' }}>
          <SimpleTable headers={['Proveedor', 'Nivel', 'Estrellas', 'Precio', 'Estado']} rows={rows} />
        </CardContent>
      </Card>
    </main>
  );
}
