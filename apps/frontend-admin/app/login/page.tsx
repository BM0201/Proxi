'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent, FormField, PageHeader, TextInput } from '@proxi/ui';
import { adminApi, getCurrentUser, isAdminRole, logout, setAdminToken } from '../../lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(event.currentTarget);

    try {
      const response = await adminApi<{ accessToken: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: form.get('email'),
          password: form.get('password'),
        }),
      });
      setAdminToken(response.accessToken);
      // Validamos que la cuenta tenga rol de administración.
      const user = await getCurrentUser();
      if (!isAdminRole(user.role)) {
        logout();
        setError('Esta cuenta no tiene permisos de administración.');
        return;
      }
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 620, margin: '0 auto' }}>
      <PageHeader title="Administración Proxi" description="Acceso exclusivo para el equipo de administración." />
      <Card title="Iniciar sesión">
        <CardContent>
          <form onSubmit={submit} style={{ display: 'grid', gap: 16 }}>
            <FormField label="Correo">
              <TextInput name="email" type="email" placeholder="admin@proxi.local" required />
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
