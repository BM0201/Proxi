'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent, FormField, PageHeader, TextInput } from '@proxi/ui';
import { proveedorApi, setProveedorToken } from '../../lib/api';

export default function ProveedorLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(event.currentTarget);

    try {
      const response = await proveedorApi<{ accessToken: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: form.get('email'),
          password: form.get('password'),
        }),
      });
      setProveedorToken(response.accessToken);
      router.push('/tasks');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 620, margin: '0 auto' }}>
      <PageHeader title="Iniciar sesión" description="Entrá a tu cuenta Proxi de proveedor independiente." />
      <Card title="Cuenta proveedor">
        <CardContent>
          <form onSubmit={submit} style={{ display: 'grid', gap: 16 }}>
            <FormField label="Correo">
              <TextInput name="email" type="email" placeholder="correo@ejemplo.com" required />
            </FormField>
            <FormField label="Contraseña">
              <TextInput name="password" type="password" required />
            </FormField>
            {error ? <p style={{ margin: 0, color: '#b91c1c' }}>{error}</p> : null}
            <Button type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Iniciar sesión'}</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
