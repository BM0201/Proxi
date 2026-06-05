import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AppShell } from '../components/AppShell';

export const metadata: Metadata = {
  title: 'Proxi · Administración',
  description: 'Panel de administración de la plataforma Proxi.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          background: '#f9fafb',
          color: '#111827',
        }}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
