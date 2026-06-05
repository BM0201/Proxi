import * as React from 'react';
import { Card, CardContent } from './Card';

export interface StatCardProps {
  label: string;
  value: React.ReactNode;
  description?: string;
  trend?: React.ReactNode;
}

export function StatCard({ label, value, description, trend }: StatCardProps) {
  return (
    <Card>
      <CardContent style={{ paddingTop: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
          <span style={{ color: '#6b7280', fontSize: 13, fontWeight: 700 }}>{label}</span>
          {trend ? <span style={{ color: '#166534', fontSize: 12, fontWeight: 700 }}>{trend}</span> : null}
        </div>
        <div style={{ marginTop: '0.65rem', fontSize: 28, fontWeight: 800 }}>{value}</div>
        {description ? <p style={{ margin: '0.5rem 0 0', color: '#6b7280', fontSize: 14 }}>{description}</p> : null}
      </CardContent>
    </Card>
  );
}
