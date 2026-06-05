import * as React from 'react';

export interface FormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

export function FormField({ label, error, hint, children }: FormFieldProps) {
  return (
    <label style={{ display: 'grid', gap: '0.4rem', fontWeight: 700 }}>
      <span>{label}</span>
      {children}
      {hint ? <span style={{ color: '#6b7280', fontSize: 12, fontWeight: 400 }}>{hint}</span> : null}
      {error ? <span style={{ color: '#dc2626', fontSize: 12, fontWeight: 600 }}>{error}</span> : null}
    </label>
  );
}
