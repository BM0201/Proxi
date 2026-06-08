'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Button,
  Card,
  CardContent,
  EmptyState,
  FormField,
  PageHeader,
  PurchaseListItemRow,
  Select,
  TextInput,
  Textarea,
} from '@proxi/ui';
import { proveedorApi } from '../../../../../lib/api';

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

interface PurchaseList {
  id: string;
  taskId: string;
  status: string;
  notes?: string;
  items: PurchaseListItem[];
}

const priorityOptions = [
  { label: 'Obligatorio', value: 'REQUIRED' },
  { label: 'Recomendado', value: 'RECOMMENDED' },
  { label: 'Opcional', value: 'OPTIONAL' },
  { label: 'Alternativa', value: 'ALTERNATIVE' },
];

export default function CreatePurchaseListPage() {
  const params = useParams<{ taskId: string }>();
  const router = useRouter();
  const taskId = params.taskId;

  const [list, setList] = useState<PurchaseList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [addingItem, setAddingItem] = useState(false);

  async function loadList() {
    setLoading(true);
    setError(null);
    try {
      const data = await proveedorApi<PurchaseList>(`/materials/purchase-lists/task/${taskId}`);
      setList(data);
    } catch {
      // 404 = aún no existe la Lista Proxi para esta Tarea.
      setList(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  async function createList(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreating(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    try {
      const created = await proveedorApi<PurchaseList>('/materials/purchase-lists', {
        method: 'POST',
        body: JSON.stringify({
          taskId,
          notes: String(form.get('notes') ?? '').trim() || undefined,
        }),
      });
      setList(created);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la Lista Proxi');
    } finally {
      setCreating(false);
    }
  }

  async function addItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!list) return;
    setAddingItem(true);
    setError(null);
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    const priceMin = form.get('estimatedPriceMin');
    const priceMax = form.get('estimatedPriceMax');
    try {
      await proveedorApi(`/materials/purchase-lists/${list.id}/items`, {
        method: 'POST',
        body: JSON.stringify({
          name: String(form.get('name') ?? '').trim(),
          quantity: Number(form.get('quantity')),
          unit: String(form.get('unit') ?? '').trim(),
          specification: String(form.get('specification') ?? '').trim() || undefined,
          priority: String(form.get('priority') ?? 'REQUIRED'),
          estimatedPriceMin: priceMin ? Number(priceMin) : undefined,
          estimatedPriceMax: priceMax ? Number(priceMax) : undefined,
          notes: String(form.get('notes') ?? '').trim() || undefined,
        }),
      });
      formEl.reset();
      await loadList();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo agregar el material');
    } finally {
      setAddingItem(false);
    }
  }

  async function deleteItem(itemId: string) {
    if (!list) return;
    try {
      await proveedorApi(`/materials/purchase-lists/${list.id}/items/${itemId}`, { method: 'DELETE' });
      await loadList();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar el material');
    }
  }

  return (
    <main style={{ maxWidth: 980, margin: '0 auto', display: 'grid', gap: 18 }}>
      <PageHeader
        title="Lista Proxi de materiales"
        description="Acá indicás los materiales que el Cliente debe comprar antes del servicio. Recordá: el Proveedor no compra materiales; vos solo armás la lista."
        actions={
          <Link href={`/tasks/${taskId}`} style={{ textDecoration: 'none' }}>
            <Button variant="secondary">Volver a la tarea</Button>
          </Link>
        }
      />

      {loading ? (
        <EmptyState title="Cargando..." description="Consultando la Lista Proxi de esta tarea." />
      ) : !list ? (
        <Card title="Crear Lista Proxi">
          <CardContent style={{ paddingTop: '1rem' }}>
            <form onSubmit={createList} style={{ display: 'grid', gap: 14 }}>
              <FormField label="Notas para el Cliente (opcional)">
                <Textarea
                  name="notes"
                  placeholder="Ej: Comprá todo en una sola ferretería para ahorrar. Avisame cuando tengas los materiales listos."
                />
              </FormField>
              {error ? <p style={{ margin: 0, color: '#b91c1c' }}>{error}</p> : null}
              <Button type="submit" disabled={creating}>
                {creating ? 'Creando...' : 'Crear Lista Proxi'}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card title="Agregar material a la lista">
            <CardContent style={{ paddingTop: '1rem' }}>
              <form onSubmit={addItem} style={{ display: 'grid', gap: 14 }}>
                <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                  <FormField label="Material">
                    <TextInput name="name" placeholder="Cable eléctrico THHN #12" required />
                  </FormField>
                  <FormField label="Cantidad">
                    <TextInput name="quantity" type="number" step="any" min="0.01" defaultValue="1" required />
                  </FormField>
                  <FormField label="Unidad">
                    <TextInput name="unit" placeholder="metros, unidad, galón…" required />
                  </FormField>
                  <FormField label="Prioridad">
                    <Select name="priority" options={priorityOptions} defaultValue="REQUIRED" />
                  </FormField>
                </div>
                <FormField label="Especificación (opcional)">
                  <TextInput name="specification" placeholder="Marca, color, medida, calibre…" />
                </FormField>
                <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                  <FormField label="Precio estimado mínimo C$ (opcional)">
                    <TextInput name="estimatedPriceMin" type="number" step="any" min="0" />
                  </FormField>
                  <FormField label="Precio estimado máximo C$ (opcional)">
                    <TextInput name="estimatedPriceMax" type="number" step="any" min="0" />
                  </FormField>
                </div>
                <FormField label="Notas del material (opcional)">
                  <TextInput name="notes" placeholder="Detalle adicional para el Cliente" />
                </FormField>
                {error ? <p style={{ margin: 0, color: '#b91c1c' }}>{error}</p> : null}
                <Button type="submit" disabled={addingItem}>
                  {addingItem ? 'Agregando...' : 'Agregar material'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card title={`Materiales en la lista (${list.items.length})`}>
            <CardContent style={{ paddingTop: '0.5rem' }}>
              {list.items.length === 0 ? (
                <EmptyState
                  title="Aún no hay materiales"
                  description="Agregá los materiales que el Cliente debe comprar para esta tarea."
                />
              ) : (
                <div style={{ display: 'grid' }}>
                  {list.items.map((item) => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1 }}>
                        <PurchaseListItemRow
                          name={item.name}
                          quantity={item.quantity}
                          unit={item.unit}
                          specification={item.specification}
                          priority={item.priority}
                          estimatedPriceMin={item.estimatedPriceMin}
                          estimatedPriceMax={item.estimatedPriceMax}
                          notes={item.notes}
                        />
                      </div>
                      <Button type="button" variant="ghost" onClick={() => deleteItem(item.id)}>
                        Quitar
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ marginTop: 16 }}>
                <Button type="button" onClick={() => router.push(`/tasks/${taskId}/materials`)}>
                  Ver Lista Proxi final
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </main>
  );
}
