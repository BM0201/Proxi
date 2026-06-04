import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Proxi · Proveedores',
  description: 'App de proveedores independientes de Proxi: encuentra tareas y envía ofertas.',
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
        {children}
      </body>
    </html>
  );
}
