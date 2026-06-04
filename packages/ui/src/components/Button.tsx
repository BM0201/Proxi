import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Variante visual del botón. */
  variant?: 'primary' | 'secondary' | 'ghost';
}

const baseStyle: React.CSSProperties = {
  borderRadius: 8,
  padding: '0.5rem 1rem',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  border: '1px solid transparent',
  transition: 'opacity 0.15s ease',
};

const variantStyles: Record<NonNullable<ButtonProps['variant']>, React.CSSProperties> = {
  primary: { background: '#4f46e5', color: '#fff' },
  secondary: { background: '#fff', color: '#4f46e5', border: '1px solid #4f46e5' },
  ghost: { background: 'transparent', color: '#4f46e5' },
};

/** Botón básico reutilizable de la plataforma Proxi. */
export function Button({ variant = 'primary', style, ...props }: ButtonProps) {
  return <button style={{ ...baseStyle, ...variantStyles[variant], ...style }} {...props} />;
}
