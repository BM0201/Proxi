import * as React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  color?: string;
}

/** Etiqueta/insignia para mostrar estados (ej. estado de una tarea). */
export function Badge({ children, color = '#4f46e5' }: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0.15rem 0.6rem',
        borderRadius: 999,
        background: `${color}1a`,
        color,
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {children}
    </span>
  );
}
