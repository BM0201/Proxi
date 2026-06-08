'use client';

import { FormEvent, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  EmptyState,
  FormField,
  PageHeader,
  TextInput,
  Textarea,
  ToolBadge,
} from '@proxi/ui';
import { proveedorApi } from '../../lib/api';

/** Herramienta del Proveedor independiente (no son materiales del Cliente). */
interface ProviderTool {
  id: string;
  providerId: string;
  name: string;
  category?: string;
  description?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProveedorToolsPage() {
  const [tools, setTools] = useState<ProviderTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function loadTools() {
    setLoading(true);
    setError(null);
    try {
      const data = await proveedorApi<ProviderTool[]>('/tools/my-tools');
      setTools(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar las herramientas');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTools();
  }, []);

  async function submitTool(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    const payload = {
      name: String(form.get('name') ?? '').trim(),
      category: String(form.get('category') ?? '').trim() || undefined,
      description: String(form.get('description') ?? '').trim() || undefined,
    };

    try {
      if (editingId) {
        await proveedorApi(`/tools/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await proveedorApi('/tools', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      formEl.reset();
      setEditingId(null);
      await loadTools();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar la herramienta');
    } finally {
      setSaving(false);
    }
  }

  async function deleteTool(id: string) {
    if (typeof window !== 'undefined' && !window.confirm('¿Eliminar esta herramienta?')) return;
    try {
      await proveedorApi(`/tools/${id}`, { method: 'DELETE' });
      await loadTools();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar la herramienta');
    }
  }

  const editing = editingId ? tools.find((t) => t.id === editingId) : undefined;

  return (
    <main style={{ maxWidth: 980, margin: '0 auto' }}>
      <PageHeader
        title="Mis herramientas"
        description="Las herramientas son tuyas (taladro, escalera, llaves, martillo…). NO son materiales: los materiales los compra el Cliente con tu Lista Proxi."
      />

      <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'minmax(0, 1fr)' }}>
        <Card title={editingId ? 'Editar herramienta' : 'Agregar herramienta'}>
          <CardContent style={{ paddingTop: '1rem' }}>
            <form onSubmit={submitTool} style={{ display: 'grid', gap: 14 }} key={editingId ?? 'new'}>
              <FormField label="Nombre de la herramienta">
                <TextInput name="name" defaultValue={editing?.name ?? ''} placeholder="Taladro percutor" required />
              </FormField>
              <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                <FormField label="Categoría (opcional)">
                  <TextInput name="category" defaultValue={editing?.category ?? ''} placeholder="Eléctrica" />
                </FormField>
              </div>
              <FormField label="Descripción (opcional)">
                <Textarea
                  name="description"
                  defaultValue={editing?.description ?? ''}
                  placeholder="Detalles, marca, capacidad, etc."
                />
              </FormField>
              {error ? <p style={{ margin: 0, color: '#b91c1c' }}>{error}</p> : null}
              <div style={{ display: 'flex', gap: 10 }}>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Agregar herramienta'}
                </Button>
                {editingId ? (
                  <Button type="button" variant="secondary" onClick={() => setEditingId(null)}>
                    Cancelar
                  </Button>
                ) : null}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card title={`Herramientas declaradas (${tools.length})`}>
          <CardContent style={{ paddingTop: '1rem' }}>
            {loading ? (
              <p style={{ margin: 0, color: '#6b7280' }}>Cargando herramientas...</p>
            ) : tools.length === 0 ? (
              <EmptyState
                title="Aún no declaraste herramientas"
                description="Agregá las herramientas que usás en tus servicios. Esto da más confianza al Cliente."
              />
            ) : (
              <div style={{ display: 'grid', gap: 12 }}>
                {tools.map((tool) => (
                  <div
                    key={tool.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                      border: '1px solid #e5e7eb',
                      borderRadius: 12,
                      padding: '0.75rem 0.9rem',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <ToolBadge name={tool.name} category={tool.category} isVerified={tool.isVerified} />
                      {tool.description ? (
                        <span style={{ fontSize: 13, color: '#6b7280' }}>{tool.description}</span>
                      ) : null}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Button type="button" variant="secondary" onClick={() => setEditingId(tool.id)}>
                        Editar
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => deleteTool(tool.id)}>
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
