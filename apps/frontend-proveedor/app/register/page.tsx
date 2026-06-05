'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent, FormField, PageHeader, TextInput } from '@proxi/ui';
import { proveedorApi, setProveedorToken } from '../../lib/api';

export default function ProveedorRegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(event.currentTarget);

    try {
      const response = await proveedorApi<{ accessToken: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          displayName: form.get('displayName'),
          email: form.get('email'),
          password: form.get('password'),
          role: 'PROVIDER',
        }),
      });
      setProveedorToken(response.accessToken);
      router.push('/tasks');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la cuenta');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: '0 auto' }}>
      <PageHeader
        title="Crear cuenta de proveedor independiente"
        description="Registro por correo para ofrecer servicios dentro de Proxi."
      />
      <Card title="Datos de cuenta Proxi">
        <CardContent>
          <form onSubmit={submit} style={{ display: 'grid', gap: 16 }}>
            <FormField label="Nombre visible">
              <TextInput name="displayName" placeholder="Ej: Carlos M." required />
            </FormField>
            <FormField label="Correo">
              <TextInput name="email" type="email" placeholder="correo@ejemplo.com" required />
            </FormField>
            <FormField label="Contraseña" hint="Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo.">
              <TextInput name="password" type="password" required />
            </FormField>
            <FormField label="Rol">
              <TextInput value="PROVIDER" readOnly />
            </FormField>
            {error ? <p style={{ margin: 0, color: '#b91c1c' }}>{error}</p> : null}
            <Button type="submit" disabled={loading}>{loading ? 'Creando cuenta...' : 'Crear cuenta de proveedor independiente'}</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
