import Link from 'next/link';
import { providersMock, reviewsMock } from '@proxi/contracts';
import {
  Badge,
  Button,
  Card,
  CardContent,
  LevelBadge,
  PageHeader,
  ProviderCard,
  RatingStars,
  UploadPreview,
} from '@proxi/ui';

const levelMap = {
  LEVEL_0: 0,
  LEVEL_1: 1,
  LEVEL_2: 2,
  LEVEL_3: 3,
  LEVEL_4_PRO: 4,
  LEVEL_5_PREMIUM: 5,
} as const;

export default function ClienteProviderProfilePage() {
  const provider = providersMock[0];
  const providerReviews = reviewsMock.filter((review) => review.providerId === provider.id);

  return (
    <main style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gap: 18 }}>
      <PageHeader
        title={provider.name}
        description="Perfil público mock del proveedor independiente. No se muestra teléfono, WhatsApp, correo ni dirección exacta."
        actions={<LevelBadge level={levelMap[provider.level]} />}
      />

      <ProviderCard
        avatar={provider.avatarUrl}
        name={provider.name}
        trade={provider.trade}
        level={levelMap[provider.level]}
        rating={provider.rating}
        completedJobs={provider.completedJobs}
        verificationLabel="Verificación aprobada"
        services={provider.services}
        action={
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link href="/tasks/new" style={{ textDecoration: 'none' }}>
              <Button variant="secondary">Solicitar oferta</Button>
            </Link>
            <Link href="/checkout/protected-payment?taskId=mock-task-001&offerId=mock-offer-001" style={{ textDecoration: 'none' }}>
              <Button>Aceptar oferta</Button>
            </Link>
          </div>
        }
      />

      <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        <Card title="Reputación">
          <CardContent>
            <RatingStars value={provider.rating} />
            <p style={{ margin: '0.7rem 0 0' }}>
              {provider.rating} estrellas · {provider.reviewCount} reseñas · {provider.completedJobs} trabajos completados
            </p>
            <p style={{ margin: '0.5rem 0 0', color: '#64748b' }}>Puntualidad: {provider.punctuality}</p>
          </CardContent>
        </Card>
        <Card title="Tarifas y herramientas">
          <CardContent>
            <p><strong>Tarifa base:</strong> {provider.baseRate}</p>
            <p><strong>{provider.minimumVisit}</strong></p>
            <p><strong>Vehículo:</strong> {provider.vehicle}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {provider.tools.map((tool) => <Badge key={tool} variant="neutral">{tool}</Badge>)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card title="Certificaciones">
        <CardContent>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {provider.certifications.map((certification) => <Badge key={certification} variant="success">{certification}</Badge>)}
          </div>
        </CardContent>
      </Card>

      <Card title="Fotos de trabajos">
        <CardContent>
          <div style={{ display: 'grid', gap: 10 }}>
            {provider.portfolioPhotos.map((photo) => (
              <UploadPreview key={photo} fileName={photo} status="uploaded" description="Trabajo anterior mostrado como mock." />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card title="Reseñas">
        <CardContent>
          <div style={{ display: 'grid', gap: 12 }}>
            {providerReviews.map((review) => (
              <div key={review.id} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>
                <strong>{review.authorName}</strong>
                <div><RatingStars value={review.rating} /></div>
                <p style={{ margin: '0.3rem 0', color: '#334155' }}>{review.comment}</p>
                <span style={{ color: '#64748b', fontSize: 13 }}>{review.taskTitle}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
