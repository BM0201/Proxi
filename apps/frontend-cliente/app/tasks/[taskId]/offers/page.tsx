'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Badge, Button, Card, CardContent, EmptyState, OfferCard, PageHeader } from '@proxi/ui';
import { clienteApi } from '../../../../lib/api';

interface ApiOffer {
  id: string;
  provider: {
    displayName: string;
    level: string;
    ratingAverage: number;
    ratingCount: number;
    completedJobs: number;
  };
  amount: number;
  estimatedDuration: string;
  message: string | null;
  status: string;
  contactWarning: boolean;
}

const levelMap: Record<string, 0 | 1 | 2 | 3 | 4 | 5> = {
  LEVEL_0: 0,
  LEVEL_1: 1,
  LEVEL_2: 2,
  LEVEL_3: 3,
  LEVEL_4_PRO: 4,
  LEVEL_5_PREMIUM: 5,
};

export default function ClienteTaskOffersPage() {
  const params = useParams<{ taskId: string }>();
  const router = useRouter();
  const [offers, setOffers] = useState<ApiOffer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clienteApi<ApiOffer[]>(`/tasks/${params.taskId}/offers`)
      .then(setOffers)
      .catch((err) => setError(err instanceof Error ? err.message : 'No se pudieron cargar ofertas'))
      .finally(() => setLoading(false));
  }, [params.taskId]);

  async function acceptOffer(offerId: string) {
    const response = await clienteApi<{ bookingId: string }>(`/offers/${offerId}/accept`, { method: 'POST' });
    window.localStorage.setItem('proxi:cliente:lastBookingId', response.bookingId);
    router.push(`/checkout/protected-payment?bookingId=${response.bookingId}&offerId=${offerId}`);
  }

  return (
    <main style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gap: 18 }}>
      <PageHeader
        title="Comparar ofertas"
        description="Ofertas reales de proveedores independientes. Si aparece una advertencia, revisá el mensaje antes de aceptar."
        actions={<Badge variant="success">{offers.length} ofertas recibidas</Badge>}
      />

      <Card title="Resumen de la tarea">
        <CardContent>
          <p style={{ margin: 0, color: '#475569' }}>Tarea real: {params.taskId}. La dirección exacta permanece protegida.</p>
        </CardContent>
      </Card>

      {loading ? <EmptyState title="Cargando ofertas" description="Consultando ofertas reales." /> : null}
      {error ? <EmptyState title="No pudimos cargar ofertas" description={error} /> : null}
      {!loading && !error && offers.length === 0 ? (
        <EmptyState title="Todavía no hay ofertas" description="Te avisaremos cuando un proveedor responda." />
      ) : null}

      <div style={{ display: 'grid', gap: 14 }}>
        {offers.map((offer) => (
          <OfferCard
            key={offer.id}
            avatar={offer.provider.displayName.slice(0, 2).toUpperCase()}
            name={offer.provider.displayName}
            trade="Proveedor independiente"
            level={levelMap[offer.provider.level] ?? 0}
            rating={offer.provider.ratingAverage}
            reviews={offer.provider.ratingCount}
            completedJobs={offer.provider.completedJobs}
            price={`C$ ${offer.amount}`}
            estimatedTime={offer.estimatedDuration}
            availability={offer.status}
            message={offer.contactWarning ? `${offer.message ?? ''}\nAdvertencia: posible dato de contacto externo.` : offer.message ?? undefined}
            profileAction={
              <Link href="/providers/mock-provider-001" style={{ textDecoration: 'none' }}>
                <Button variant="secondary">Ver perfil</Button>
              </Link>
            }
            acceptAction={<Button onClick={() => acceptOffer(offer.id)}>Aceptar</Button>}
          />
        ))}
      </div>
    </main>
  );
}
