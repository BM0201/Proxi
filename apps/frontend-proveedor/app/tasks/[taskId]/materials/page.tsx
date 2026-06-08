'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Button,
  Card,
  CardContent,
  EmptyState,
  PageHeader,
  PartnerStoreCard,
  PurchaseListCard,
} from '@proxi/ui';
import { proveedorApi } from '../../../../lib/api';

interface PurchaseListItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  specification?: string;
  priority?: string;
  estimatedPriceMin?: number;
  estimatedPriceMax?: number;
  notes?: string;
}

interface StoreSuggestion {
  id: string;
  reason?: string;
  isSponsored: boolean;
  store: {
    id: string;
    name: string;
    type: string;
    description?: string;
    department?: string;
    city?: string;
    zone?: string;
    addressLine?: string;
    isSponsored: boolean;
  };
}

interface PurchaseList {
  id: string;
  taskId: string;
  status: string;
  notes?: string;
  items: PurchaseListItem[];
  storeSuggestions: StoreSuggestion[];
}

export default function ProveedorMaterialsViewPage() {
  const params = useParams<{ taskId: string }>();
  const taskId = params.taskId;
  const [list, setList] = useState<PurchaseList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    proveedorApi<PurchaseList>(`/materials/purchase-lists/task/${taskId}`)
      .then(setList)
      .catch((err) => setError(err instanceof Error ? err.message : 'No se pudo cargar la Lista Proxi'))
      .finally(() => setLoading(false));
  }, [taskId]);

  if (loading) return <EmptyState title="Cargando..." description="Consultando la Lista Proxi." />;
  if (error || !list)
    return (
      <main style={{ maxWidth: 760, margin: '0 auto', display: 'grid', gap: 16 }}>
        <EmptyState
          title="Esta tarea no tiene Lista Proxi"
          description={error ?? 'Todavía no creaste una lista de materiales para esta tarea.'}
        />
        <Link href={`/tasks/${taskId}/materials/create`} style={{ textDecoration: 'none' }}>
          <Button>Crear Lista Proxi</Button>
        </Link>
      </main>
    );

  return (
    <main style={{ maxWidth: 980, margin: '0 auto', display: 'grid', gap: 18 }}>
      <PageHeader
        title="Lista Proxi de materiales"
        description="Vista de la lista de materiales que el Cliente debe comprar antes del servicio."
        actions={
          <Link href={`/tasks/${taskId}/materials/create`} style={{ textDecoration: 'none' }}>
            <Button variant="secondary">Editar lista</Button>
          </Link>
        }
      />

      <PurchaseListCard status={list.status} notes={list.notes} items={list.items} />

      {list.storeSuggestions && list.storeSuggestions.length > 0 ? (
        <Card title="Tiendas sugeridas para el Cliente">
          <CardContent style={{ paddingTop: '1rem' }}>
            <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
              {list.storeSuggestions.map((s) => (
                <PartnerStoreCard
                  key={s.id}
                  name={s.store.name}
                  type={s.store.type}
                  description={s.store.description}
                  department={s.store.department}
                  city={s.store.city}
                  zone={s.store.zone}
                  addressLine={s.store.addressLine}
                  isSponsored={s.isSponsored || s.store.isSponsored}
                  reason={s.reason}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </main>
  );
}
