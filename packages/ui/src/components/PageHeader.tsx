import * as React from 'react';

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
      }}
    >
      <div>
        <h2 style={{ margin: 0, fontSize: 28, lineHeight: 1.2 }}>{title}</h2>
        {description ? <p style={{ margin: '0.5rem 0 0', color: '#6b7280', lineHeight: 1.6 }}>{description}</p> : null}
      </div>
      {actions ? <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>{actions}</div> : null}
    </div>
  );
}
