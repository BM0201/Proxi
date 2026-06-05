'use client';

import { FormEvent, useState } from 'react';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Card, CardContent, FormField, PageHeader, Select, TextInput, Textarea } from '@proxi/ui';
import { proveedorApi } from '../../../lib/api';

const booleanOptions = [
  { label: 'Sí', value: 'true' },
  { label: 'No', value: 'false' },
];

export default function NewOfferPage() {
  return (
    <Suspense fallback={<PageHeader title="Enviar oferta" description="Cargando formulario de oferta." />}>
      <NewOfferForm />
    </Suspense>
  );
}

function NewOfferForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get('taskId');
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function submitOffer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!taskId) {
      setError('Falta taskId para enviar oferta');
      return;
    }
    setError(null);
    setSent(true);
    const form = new FormData(event.currentTarget);

    try {
      await proveedorApi('/offers', {
        method: 'POST',
        body: JSON.stringify({
          taskId,
          amount: Number(form.get('amount')),
          estimatedDuration: form.get('estimatedDuration'),
          message: form.get('message'),
          includesMaterials: form.get('includesMaterials') === 'true',
          requiresTechnicalVisit: form.get('requiresTechnicalVisit') === 'true',
          conditions: form.get('conditions'),
        }),
      });
      router.push('/offers');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo enviar la oferta');
      setSent(false);
    }
  }

  return (
    <main style={{ maxWidth: 820, margin: '0 auto' }}>
      <PageHeader
        title="Enviar oferta"
        description="Oferta real para una tarea. Evitá compartir teléfono, WhatsApp, correo o links externos."
      />
      <Card>
        <CardContent style={{ paddingTop: '1.25rem' }}>
          <form onSubmit={submitOffer} style={{ display: 'grid', gap: 16 }}>
            <FormField label="Precio ofertado">
              <TextInput name="amount" type="number" defaultValue="850" required />
            </FormField>
            <FormField label="Tiempo estimado">
              <TextInput name="estimatedDuration" defaultValue="1-2 horas" required />
            </FormField>
            <FormField label="Mensaje al cliente">
              <Textarea name="message" defaultValue="Puedo instalarlo y revisar el punto eléctrico antes de fijarlo." />
            </FormField>
            <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))' }}>
              <FormField label="Incluye materiales">
                <Select name="includesMaterials" options={booleanOptions} defaultValue="false" />
              </FormField>
              <FormField label="Requiere visita técnica">
                <Select name="requiresTechnicalVisit" options={booleanOptions} defaultValue="false" />
              </FormField>
            </div>
            <FormField label="Condiciones">
              <Textarea name="conditions" defaultValue="Incluye instalación. Materiales adicionales se confirman dentro de Proxi." />
            </FormField>
            {error ? <p style={{ margin: 0, color: '#b91c1c' }}>{error}</p> : null}
            <Button type="submit" disabled={sent}>{sent ? 'Enviando...' : 'Enviar oferta'}</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
