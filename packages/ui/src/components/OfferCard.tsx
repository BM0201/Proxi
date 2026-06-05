import * as React from 'react';
import { Button } from './Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './Card';
import { LevelBadge } from './LevelBadge';
import { RatingStars } from './RatingStars';

export interface OfferCardProps {
  avatar: string;
  name: string;
  trade: string;
  level: 0 | 1 | 2 | 3 | 4 | 5;
  rating: number;
  reviews: number;
  completedJobs: number;
  price: string;
  estimatedTime: string;
  availability: string;
  message?: string;
  profileAction?: React.ReactNode;
  acceptAction?: React.ReactNode;
}

export function OfferCard({
  avatar,
  name,
  trade,
  level,
  rating,
  reviews,
  completedJobs,
  price,
  estimatedTime,
  availability,
  message,
  profileAction,
  acceptAction,
}: OfferCardProps) {
  return (
    <Card>
      <CardHeader>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 999,
              background: '#ccfbf1',
              color: '#0f766e',
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
          <span style={{ color: '#475569', fontSize: 14 }}>
            {rating} · {reviews} reseñas · {completedJobs} trabajos
          </span>
        </div>
        {message ? <p style={{ margin: '0 0 12px', color: '#334155', lineHeight: 1.5 }}>{message}</p> : null}
        <div style={{ display: 'grid', gap: 6, color: '#334155', fontSize: 14 }}>
          <span>
            <strong>Precio ofertado:</strong> {price}
          </span>
          <span>
            <strong>Tiempo estimado:</strong> {estimatedTime}
          </span>
          <span>
            <strong>Disponibilidad:</strong> {availability}
          </span>
        </div>
      </CardContent>
      <CardFooter style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {profileAction ?? <Button variant="secondary">Ver perfil</Button>}
        {acceptAction ?? <Button>Aceptar</Button>}
      </CardFooter>
    </Card>
  );
}
