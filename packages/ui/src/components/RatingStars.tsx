export interface RatingStarsProps {
  value: number;
}

export function RatingStars({ value }: RatingStarsProps) {
  const normalized = Math.max(0, Math.min(5, Math.round(value)));

  return (
    <span aria-label={`${normalized} de 5 estrellas`} style={{ color: '#f59e0b', fontSize: 18, letterSpacing: 0 }}>
      {'★'.repeat(normalized)}
      <span style={{ color: '#d1d5db' }}>{'★'.repeat(5 - normalized)}</span>
    </span>
  );
}
