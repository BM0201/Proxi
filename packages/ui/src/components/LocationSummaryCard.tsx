import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card';
import { StatusPill } from './StatusPill';

export interface LocationSummaryCardProps {
  title: string;
  city: string;
  zone: string;
  reference?: string;
  exactProtected?: boolean;
}

export function LocationSummaryCard({ title, city, zone, reference, exactProtected = true }: LocationSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {city} · {zone}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {reference ? <p style={{ margin: '0 0 0.8rem', color: '#6b7280' }}>{reference}</p> : null}
        <StatusPill status={exactProtected ? 'warning' : 'success'} label={exactProtected ? 'Dirección exacta protegida' : 'Dirección visible'} />
      </CardContent>
    </Card>
  );
}
