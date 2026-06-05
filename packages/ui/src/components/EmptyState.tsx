import * as React from 'react';

export interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div
      style={{
        border: '1px dashed #cfd6df',
        borderRadius: 8,
        background: '#fbfcfd',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <h3 style={{ margin: 0, fontSize: 18 }}>{title}</h3>
      <p style={{ margin: '0.6rem auto 0', maxWidth: 520, color: '#6b7280', lineHeight: 1.6 }}>{description}</p>
      {action ? <div style={{ marginTop: '1rem' }}>{action}</div> : null}
    </div>
  );
}
