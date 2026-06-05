'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent, FormField, PageHeader, TextInput } from '@proxi/ui';
import { clienteApi, setClienteToken } from '../../lib/api';

export default function ClienteRegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(event.currentTarget);

    try {
      const response = await clienteApi<{ accessToken: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          displayName: form.get('displayName'),
          email: form.get('email'),
          password: form.get('password'),
          role: 'CLIENT',
        }),
      });
      setClienteToken(response.accessToken);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la cuenta');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: '0 auto' }}>
      <PageHeader
        title="Crear cuenta de cliente"
        description="Registro por correo para publicar tareas y buscar proveedores independientes en Proxi."
      />
      <Card title="Datos de cuenta Proxi">
        <CardContent>
          <form onSubmit={submit} style={{ display: 'grid', gap: 16 }}>
            <FormField label="Nombre visible">
              <TextInput name="displayName" placeholder="Ej: María G." required />
            </FormField>
            <FormField label="Correo">
              <TextInput name="email" type="email" placeholder="correo@ejemplo.com" required />
            </FormField>
            <FormField label="Contraseña" hint="Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo.">
              <TextInput name="password" type="password" required />
            </FormField>
            <FormField label="Rol">
              <TextInput value="CLIENT" readOnly />
            </FormField>
            {error ? <p style={{ margin: 0, color: '#b91c1c' }}>{error}</p> : null}
            <Button type="submit" disabled={loading}>{loading ? 'Creando cuenta...' : 'Crear cuenta'}</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
