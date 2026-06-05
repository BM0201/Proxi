import * as React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  color?: string;
}

const variantStyles: Record<NonNullable<BadgeProps['variant']>, { background: string; color: string }> = {
  default: { background: '#eef2ff', color: '#4f46e5' },
  success: { background: '#dcfce7', color: '#166534' },
  warning: { background: '#fef3c7', color: '#92400e' },
  danger: { background: '#fee2e2', color: '#991b1b' },
  info: { background: '#e0f2fe', color: '#075985' },
  neutral: { background: '#f3f4f6', color: '#374151' },
};

export function Badge({ children, variant = 'default', color }: BadgeProps) {
  const colors = color ? { background: `${color}1a`, color } : variantStyles[variant];

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0.15rem 0.6rem',
        borderRadius: 999,
        background: colors.background,
        color: colors.color,
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {children}
    </span>
  );
}
