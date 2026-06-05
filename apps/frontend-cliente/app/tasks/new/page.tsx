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

      const task = await clienteApi<{ id: string }>('/tasks', {
        method: 'POST',
        body: JSON.stringify({
          categoryName: form.get('categoryName'),
          title: form.get('title'),
          description: form.get('description'),
          budgetMin: Number(form.get('budgetMin')),
          budgetMax: Number(form.get('budgetMax')),
          pricingType: form.get('pricingType'),
          locationId: location.id,
        }),
      });

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
