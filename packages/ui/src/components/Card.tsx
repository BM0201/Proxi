import * as React from 'react';

export interface CardProps {
  /** Título opcional de la tarjeta. */
  title?: string;
  children?: React.ReactNode;
}

/** Contenedor tipo tarjeta reutilizable. */
export function Card({ title, children }: CardProps) {
  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: '1.25rem',
        background: '#fff',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      }}
    >
      {title ? <h3 style={{ margin: '0 0 0.75rem', fontSize: 16 }}>{title}</h3> : null}
      {children}
    </div>
  );
}
