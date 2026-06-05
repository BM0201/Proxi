import * as React from 'react';

export interface CategoryCardProps {
  label: string;
  description?: string;
  action?: React.ReactNode;
}

export function CategoryCard({ label, description, action }: CategoryCardProps) {
  return (
    <div
      style={{
        border: '1px solid #d1fae5',
        borderRadius: 12,
        background: '#ffffff',
        padding: '1rem',
        minHeight: 96,
        display: 'grid',
        gap: 8,
      }}
    >
      <strong style={{ color: '#0f172a', fontSize: 16 }}>{label}</strong>
      {description ? <span style={{ color: '#64748b', fontSize: 13, lineHeight: 1.4 }}>{description}</span> : null}
      {action ? <div>{action}</div> : null}
    </div>
  );
}
