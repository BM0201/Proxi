import * as React from 'react';
import { Badge } from './Badge';
import { Button } from './Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './Card';
import { StatusPill } from './StatusPill';

export interface TaskCardProps {
  title: string;
  category: string;
  statusLabel: string;
  statusTone?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  budget: string;
  offers: string;
  zone: string;
  date: string;
  description?: string;
  action?: React.ReactNode;
}

export function TaskCard({
  title,
  category,
  statusLabel,
  statusTone = 'info',
  budget,
  offers,
  zone,
  date,
  description,
  action,
}: TaskCardProps) {
  return (
    <Card>
      <CardHeader>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <CardTitle>{title}</CardTitle>
          <StatusPill status={statusTone} label={statusLabel} />
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          <Badge variant="info">{category}</Badge>
          <Badge variant="neutral">{date}</Badge>
          <Badge variant="success">{offers}</Badge>
        </div>
        {description ? <p style={{ margin: '0 0 12px', color: '#475569', lineHeight: 1.5 }}>{description}</p> : null}
        <div style={{ display: 'grid', gap: 6, color: '#334155', fontSize: 14 }}>
          <span>
            <strong>Presupuesto:</strong> {budget}
          </span>
          <span>
            <strong>Ubicación:</strong> {zone}
          </span>
        </div>
      </CardContent>
      <CardFooter>{action ?? <Button size="sm">Ver ofertas</Button>}</CardFooter>
    </Card>
  );
}
