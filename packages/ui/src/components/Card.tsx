import * as React from 'react';

export interface CardProps {
  title?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function Card({ title, children, style }: CardProps) {
  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        background: '#fff',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        ...style,
      }}
    >
      {title ? (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      ) : null}
      {children}
    </div>
  );
}

export interface CardSectionProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function CardHeader({ children, style }: CardSectionProps) {
  return <div style={{ padding: '1.25rem 1.25rem 0.75rem', ...style }}>{children}</div>;
}

export function CardTitle({ children, style }: CardSectionProps) {
  return <h3 style={{ margin: 0, fontSize: 16, lineHeight: 1.3, ...style }}>{children}</h3>;
}

export function CardDescription({ children, style }: CardSectionProps) {
  return <p style={{ margin: '0.4rem 0 0', color: '#6b7280', fontSize: 14, lineHeight: 1.5, ...style }}>{children}</p>;
}

export function CardContent({ children, style }: CardSectionProps) {
  return <div style={{ padding: '0 1.25rem 1.25rem', ...style }}>{children}</div>;
}

export function CardFooter({ children, style }: CardSectionProps) {
  return (
    <div
      style={{
        borderTop: '1px solid #eef0f3',
        padding: '0.9rem 1.25rem',
        background: '#fafafa',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
