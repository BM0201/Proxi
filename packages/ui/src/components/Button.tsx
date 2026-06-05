import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const baseStyle: React.CSSProperties = {
  borderRadius: 8,
  fontWeight: 600,
  cursor: 'pointer',
  border: '1px solid transparent',
  transition: 'opacity 0.15s ease',
};

const variantStyles: Record<NonNullable<ButtonProps['variant']>, React.CSSProperties> = {
  primary: { background: '#0f766e', color: '#fff' },
  secondary: { background: '#fff', color: '#0f766e', border: '1px solid #0f766e' },
  ghost: { background: 'transparent', color: '#0f766e' },
  danger: { background: '#dc2626', color: '#fff' },
};

const sizeStyles: Record<NonNullable<ButtonProps['size']>, React.CSSProperties> = {
  sm: { padding: '0.35rem 0.75rem', fontSize: 12 },
  md: { padding: '0.5rem 1rem', fontSize: 14 },
  lg: { padding: '0.7rem 1.2rem', fontSize: 16 },
};

export function Button({ variant = 'primary', size = 'md', style, disabled, ...props }: ButtonProps) {
  return (
    <button
      disabled={disabled}
      style={{
        ...baseStyle,
        ...variantStyles[variant],
        ...sizeStyles[size],
        opacity: disabled ? 0.55 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
      {...props}
    />
  );
}
