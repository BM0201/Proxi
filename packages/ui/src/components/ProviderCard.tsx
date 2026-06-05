import * as React from 'react';
import { Badge } from './Badge';
import { Button } from './Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './Card';
import { LevelBadge } from './LevelBadge';
import { RatingStars } from './RatingStars';

export interface ProviderCardProps {
  avatar: string;
  name: string;
  trade: string;
  level: 0 | 1 | 2 | 3 | 4 | 5;
  rating: number;
  completedJobs: number;
  verificationLabel: string;
  services?: string[];
  action?: React.ReactNode;
}

export function ProviderCard({
  avatar,
  name,
  trade,
  level,
  rating,
  completedJobs,
  verificationLabel,
  services = [],
  action,
}: ProviderCardProps) {
  return (
    <Card>
      <CardHeader>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 999,
              background: '#ecfeff',
              color: '#0e7490',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 900,
            }}
          >
            {avatar}
          </div>
          <div>
            <CardTitle>{name}</CardTitle>
            <p style={{ margin: '0.25rem 0 0', color: '#64748b' }}>{trade}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
          <LevelBadge level={level} />
          <RatingStars value={rating} />
          <Badge variant="success">{verificationLabel}</Badge>
        </div>
        <p style={{ margin: '0 0 12px', color: '#334155' }}>{completedJobs} trabajos completados en Proxi.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {services.map((service) => (
            <Badge key={service} variant="neutral">
              {service}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>{action ?? <Button variant="secondary">Ver perfil</Button>}</CardFooter>
    </Card>
  );
}
