'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  CardContent,
  FileUploadCard,
  FormField,
  LocationPreview,
  MapPinSelectorMock,
  PageHeader,
  Select,
  TextInput,
  Textarea,
  UploadPreview,
} from '@proxi/ui';
import { clienteApi, uploadMedia } from '../../../lib/api';
import { TaskTypeSelector, TaskTypeOption } from '../../../components/TaskTypeSelector';

const quickModeOptions = [
  { label: 'Aceptación directa (primer Proveedor elegible)', value: 'DIRECT_ACCEPT' },
  { label: 'Subasta rápida (varias ofertas en poco tiempo)', value: 'QUICK_AUCTION' },
];

const categoryOptions = [
  { label: 'Electricidad', value: 'Electricidad' },
  { label: 'Fontanería', value: 'Fontanería' },
  { label: 'Limpieza', value: 'Limpieza' },
  { label: 'Clases', value: 'Clases' },
  { label: 'Mandados', value: 'Mandados' },
  { label: 'Instalaciones', value: 'Instalaciones' },
  { label: 'Reparaciones', value: 'Reparaciones' },
];

const pricingOptions = [
  { label: 'Precio fijo', value: 'FIXED' },
  { label: 'Por hora', value: 'HOURLY' },
  { label: 'Visita técnica', value: 'TECHNICAL_VISIT' },
  { label: 'Abierto a ofertas', value: 'OPEN_TO_OFFERS' },
];

const toolRequirementOptions = [
  { label: 'No se requieren herramientas', value: 'NO_TOOLS_REQUIRED' },
  { label: 'El Proveedor trae sus herramientas', value: 'PROVIDER_BRINGS_TOOLS' },
  { label: 'Yo (Cliente) aporto las herramientas', value: 'CLIENT_PROVIDES_TOOLS' },
];

const materialResponsibilityOptions = [
  { label: 'No se requieren materiales', value: 'NO_MATERIALS_REQUIRED' },
  { label: 'Ya tengo los materiales', value: 'CLIENT_ALREADY_HAS_MATERIALS' },
  { label: 'Necesito que el Proveedor me arme una Lista Proxi', value: 'CLIENT_NEEDS_PURCHASE_LIST' },
  { label: 'Primero se necesita un diagnóstico', value: 'NEEDS_DIAGNOSIS_FIRST' },
];

interface PendingMedia {
  id: string;
  originalName: string;
}

export default function ClienteNewTaskPage() {
  const router = useRouter();
  const [media, setMedia] = useState<PendingMedia[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [latitude, setLatitude] = useState('12.114');
  const [longitude, setLongitude] = useState('-86.236');
  const [geoStatus, setGeoStatus] = useState<string | null>(null);
  const [taskType, setTaskType] = useState<TaskTypeOption>('STANDARD_TASK');
  const [toolRequirement, setToolRequirement] = useState('NO_TOOLS_REQUIRED');
  const [materialResponsibility, setMaterialResponsibility] = useState('NO_MATERIALS_REQUIRED');

  function useMyLocation() {
    setGeoStatus(null);
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setGeoStatus('Tu navegador no permite geolocalización. Ingresá las coordenadas manualmente.');
      return;
    }
    setGeoStatus('Obteniendo ubicación…');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        setGeoStatus('Ubicación GPS aplicada. La dirección exacta queda protegida hasta el booking.');
      },
      (geoError) => {
        setGeoStatus(`No se pudo obtener el GPS (${geoError.message}). Ingresá las coordenadas manualmente.`);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  async function handleFileSelect(file: File) {
    setError(null);
    setUploading(true);
    try {
      const uploaded = await uploadMedia(file, 'TASK_PHOTO');
      setMedia((current) => [...current, { id: uploaded.id, originalName: uploaded.originalName }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo subir la foto');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(event.currentTarget);

    try {
      const location = await clienteApi<{ id: string }>('/locations', {
        method: 'POST',
        body: JSON.stringify({
          label: 'Ubicación de tarea',
          country: 'Nicaragua',
          department: form.get('department'),
          city: form.get('city'),
          zone: form.get('zone'),
          addressLine1: form.get('addressLine1'),
          latitude: Number(latitude),
          longitude: Number(longitude),
          isExact: true,
          visibility: 'BOOKING_ONLY',
        }),
      });

      let task: { id: string };
      if (taskType === 'QUICK_TASK') {
        task = await clienteApi<{ id: string }>('/quick-tasks', {
          method: 'POST',
          body: JSON.stringify({
            categoryName: form.get('categoryName'),
            title: form.get('title'),
            description: form.get('description'),
            quickTaskMode: form.get('quickTaskMode'),
            estimatedDurationMinutes: Number(form.get('estimatedDurationMinutes')),
            radiusKm: Number(form.get('radiusKm')),
            budgetMin: Number(form.get('budgetMin')),
            budgetMax: Number(form.get('budgetMax')),
            pricingType: form.get('pricingType'),
            locationId: location.id,
          }),
        });
      } else {
        task = await clienteApi<{ id: string }>('/tasks', {
          method: 'POST',
          body: JSON.stringify({
            categoryName: form.get('categoryName'),
            title: form.get('title'),
            description: form.get('description'),
            taskType: 'STANDARD_TASK',
            toolRequirement,
            materialResponsibility,
            budgetMin: Number(form.get('budgetMin')),
            budgetMax: Number(form.get('budgetMax')),
            pricingType: form.get('pricingType'),
            locationId: location.id,
          }),
        });
      }

      // Asocia cada foto ya subida (multipart real) a la tarea recién creada.
      for (const item of media) {
        await clienteApi(`/tasks/${task.id}/media`, {
          method: 'POST',
          body: JSON.stringify({ mediaId: item.id }),
        });
      }

      router.push('/tasks');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo publicar la tarea');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gap: 18 }}>
      <PageHeader
        title="Publicar tarea"
        description="Crea una tarea real con ubicación protegida. Fotos usan subida local controlada de metadata."
      />

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 18, gridTemplateColumns: 'minmax(0, 1fr) minmax(300px, 0.8fr)' }}>
        <div style={{ display: 'grid', gap: 18 }}>
          <Card title="Tipo de tarea">
            <CardContent>
              <div style={{ display: 'grid', gap: 14 }}>
                <TaskTypeSelector value={taskType} onChange={setTaskType} />
                {taskType === 'QUICK_TASK' ? (
                  <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
                    <FormField label="Modo de tarea rápida">
                      <Select name="quickTaskMode" options={quickModeOptions} defaultValue="DIRECT_ACCEPT" />
                    </FormField>
                    <FormField label="Duración estimada (minutos)" hint="Máximo 1 día (1440 min).">
                      <TextInput name="estimatedDurationMinutes" type="number" min="1" max="1440" defaultValue="60" />
                    </FormField>
                    <FormField label="Radio de cobertura (km)">
                      <TextInput name="radiusKm" type="number" step="0.5" min="0.5" max="100" defaultValue="5" />
                    </FormField>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card title="Qué necesitás resolver">
            <CardContent>
              <div style={{ display: 'grid', gap: 16 }}>
                <FormField label="Categoría">
                  <Select name="categoryName" options={categoryOptions} defaultValue="Instalaciones" />
                </FormField>
                <FormField label="Título">
                  <TextInput name="title" defaultValue="Instalar un abanico de techo" required />
                </FormField>
                <FormField label="Descripción" hint="No compartás teléfono, WhatsApp, correo ni links externos.">
                  <Textarea name="description" defaultValue="Necesito instalar un abanico de techo en la sala. Ya tengo el abanico comprado." required />
                </FormField>
                <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
                  <FormField label="Presupuesto mínimo">
                    <TextInput name="budgetMin" type="number" defaultValue="700" required />
                  </FormField>
                  <FormField label="Presupuesto máximo">
                    <TextInput name="budgetMax" type="number" defaultValue="950" required />
                  </FormField>
                </div>
                <FormField label="Tipo de precio">
                  <Select name="pricingType" options={pricingOptions} defaultValue="FIXED" />
                </FormField>
              </div>
            </CardContent>
          </Card>

          {taskType !== 'QUICK_TASK' ? (
            <Card title="Herramientas y materiales">
              <CardContent>
                <div style={{ display: 'grid', gap: 16 }}>
                  <FormField
                    label="Herramientas"
                    hint="Las herramientas son del Proveedor independiente (taladro, escalera, llaves…)."
                  >
                    <Select
                      name="toolRequirement"
                      options={toolRequirementOptions}
                      value={toolRequirement}
                      onChange={(e) => setToolRequirement(e.target.value)}
                    />
                  </FormField>
                  <FormField
                    label="Materiales"
                    hint="Regla Proxi: el Proveedor NO compra los materiales. Vos (Cliente) los comprás."
                  >
                    <Select
                      name="materialResponsibility"
                      options={materialResponsibilityOptions}
                      value={materialResponsibility}
                      onChange={(e) => setMaterialResponsibility(e.target.value)}
                    />
                  </FormField>
                  {materialResponsibility === 'CLIENT_NEEDS_PURCHASE_LIST' ? (
                    <div
                      style={{
                        background: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        borderRadius: 10,
                        padding: '0.75rem 0.9rem',
                        fontSize: 13,
                        color: '#1e40af',
                      }}
                    >
                      📋 El Proveedor independiente te armará una <strong>Lista Proxi</strong> con los
                      materiales que necesitás comprar antes del servicio. Recordá: el Proveedor no
                      compra los materiales; vos los comprás (te sugeriremos ferreterías cercanas).
                    </div>
                  ) : null}
                  {materialResponsibility === 'NEEDS_DIAGNOSIS_FIRST' ? (
                    <div
                      style={{
                        background: '#fef9c3',
                        border: '1px solid #fde68a',
                        borderRadius: 10,
                        padding: '0.75rem 0.9rem',
                        fontSize: 13,
                        color: '#854d0e',
                      }}
                    >
                      🔎 El Proveedor hará primero un diagnóstico y luego definirá qué materiales
                      comprar. La Lista Proxi se generará después de la visita.
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ) : null}

          <Card title="Fotos opcionales">
            <CardContent>
              <FileUploadCard
                title="Agregar fotos"
                description="Subida local real (multipart) al almacenamiento del servidor. Sin S3 todavía."
                accept="image/*"
                actionLabel={uploading ? 'Subiendo…' : 'Elegir archivo'}
                disabled={uploading}
                onSelect={handleFileSelect}
              />
              <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
                {media.map((item) => (
                  <UploadPreview key={item.id} fileName={item.originalName} status="uploaded" description="Foto subida; se asociará a la tarea." />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div style={{ display: 'grid', gap: 18, alignContent: 'start' }}>
          <Card title="Ubicación de tarea">
            <CardContent>
              <div style={{ display: 'grid', gap: 14 }}>
                <MapPinSelectorMock latitude={latitude} longitude={longitude} label="Selector visual de ubicación" />
                <Button type="button" variant="secondary" onClick={useMyLocation}>
                  Usar mi ubicación (GPS)
                </Button>
                {geoStatus ? <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569' }}>{geoStatus}</p> : null}
                <FormField label="Departamento">
                  <TextInput name="department" defaultValue="Managua" required />
                </FormField>
                <FormField label="Ciudad">
                  <TextInput name="city" defaultValue="Managua" required />
                </FormField>
                <FormField label="Zona">
                  <TextInput name="zone" defaultValue="Carretera a Masaya, zona aproximada" required />
                </FormField>
                <FormField label="Dirección exacta protegida">
                  <Textarea name="addressLine1" defaultValue="Dirección exacta para compartir solo con booking y pago protegido." required />
                </FormField>
                <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
                  <FormField label="Latitud">
                    <TextInput name="latitude" type="number" step="0.000001" value={latitude} onChange={(e) => setLatitude(e.target.value)} required />
                  </FormField>
                  <FormField label="Longitud">
                    <TextInput name="longitude" type="number" step="0.000001" value={longitude} onChange={(e) => setLongitude(e.target.value)} required />
                  </FormField>
                </div>
              </div>
            </CardContent>
          </Card>

          <LocationPreview
            city="Managua"
            zone="Carretera a Masaya, zona aproximada"
            reference="Antes del booking, proveedores ven solo zona aproximada. La dirección exacta queda protegida."
            latitude={12.114}
            longitude={-86.236}
          />

          {error ? <p style={{ margin: 0, color: '#b91c1c' }}>{error}</p> : null}
          <Button type="submit" size="lg" disabled={loading}>{loading ? 'Publicando...' : 'Publicar tarea'}</Button>
        </div>
      </form>
    </main>
  );
}
