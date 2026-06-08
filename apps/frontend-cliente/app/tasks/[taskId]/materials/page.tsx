'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Button,
  Card,
  CardContent,
  EmptyState,
  MapPinSelectorMock,
  PageHeader,
  PartnerStoreCard,
  PurchaseListCard,
} from '@proxi/ui';
import { clienteApi } from '../../../../lib/api';

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
    latitude?: number;
    longitude?: number;
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

export default function ClienteMaterialsPage() {
  const params = useParams<{ taskId: string }>();
  const taskId = params.taskId;
  const [list, setList] = useState<PurchaseList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function loadList() {
    setLoading(true);
    setError(null);
    try {
      const data = await clienteApi<PurchaseList>(`/materials/purchase-lists/task/${taskId}`);
      setList(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar la Lista Proxi');
      setList(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  async function updateStatus(status: string, label: string) {
    setBusy(true);
    setActionMsg(null);
    setError(null);
    try {
      await clienteApi(`/materials/tasks/${taskId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setActionMsg(label);
      await loadList();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar el estado de materiales');
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <EmptyState title="Cargando..." description="Consultando la Lista Proxi de tu tarea." />;

  if (error || !list)
    return (
      <main style={{ maxWidth: 760, margin: '0 auto', display: 'grid', gap: 16 }}>
        <PageHeader title="Materiales (Lista Proxi)" description="Materiales que debés comprar antes del servicio." />
        <EmptyState
          title="Esta tarea aún no tiene Lista Proxi"
          description={
            error ??
            'Cuando el Proveedor independiente arme la lista de materiales que debés comprar, aparecerá acá.'
          }
        />
        <Link href={`/tasks/${taskId}`} style={{ textDecoration: 'none' }}>
          <Button variant="secondary">Volver a la tarea</Button>
        </Link>
      </main>
    );

  return (
    <main style={{ maxWidth: 1040, margin: '0 auto', display: 'grid', gap: 18 }}>
      <PageHeader
        title="Materiales (Lista Proxi)"
        description="Comprá estos materiales antes del servicio. El Proveedor independiente NO compra los materiales; vos los comprás."
        actions={
          <Link href={`/tasks/${taskId}`} style={{ textDecoration: 'none' }}>
            <Button variant="secondary">Volver a la tarea</Button>
          </Link>
        }
      />

      <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'minmax(0, 1fr) minmax(300px, 0.8fr)' }}>
        <div style={{ display: 'grid', gap: 18 }}>
          <PurchaseListCard status={list.status} notes={list.notes} items={list.items} />

          <Card title="¿Ya compraste los materiales?">
            <CardContent>
              <p style={{ margin: '0 0 12px', fontSize: 13, color: '#475569' }}>
                Confirmá cuando tengas todos los materiales listos, o avisá si algo no coincide con la
                Lista Proxi.
              </p>
              {actionMsg ? <p style={{ margin: '0 0 10px', color: '#166534' }}>{actionMsg}</p> : null}
              {error ? <p style={{ margin: '0 0 10px', color: '#b91c1c' }}>{error}</p> : null}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Button
                  type="button"
                  disabled={busy}
                  onClick={() => updateStatus('MATERIALS_READY', 'Marcaste los materiales como listos. ✅')}
                >
                  Marcar materiales listos
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={busy}
                  onClick={() =>
                    updateStatus('MATERIALS_INCORRECT', 'Reportaste materiales incorrectos. El Proveedor revisará la lista.')
                  }
                >
                  Reportar materiales incorrectos
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div style={{ display: 'grid', gap: 18, alignContent: 'start' }}>
          <Card title="Ferreterías y tiendas sugeridas">
            <CardContent>
              <MapPinSelectorMock
                latitude={list.storeSuggestions[0]?.store.latitude?.toString() ?? '12.114'}
                longitude={list.storeSuggestions[0]?.store.longitude?.toString() ?? '-86.236'}
                label="Mapa visual de tiendas sugeridas (referencial)"
              />
              <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
                {list.storeSuggestions && list.storeSuggestions.length > 0 ? (
                  list.storeSuggestions.map((s) => (
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
                  ))
                ) : (
                  <p style={{ margin: 0, fontSize: 13, color: '#94a3b8' }}>
                    Aún no hay tiendas sugeridas para esta lista.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
