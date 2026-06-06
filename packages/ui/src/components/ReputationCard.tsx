import { LevelBadge } from './LevelBadge';
import { TrustBadge } from './TrustBadge';
import { RatingStars } from './RatingStars';

/**
 * Tarjeta resumen de reputación de un Cliente o Proveedor independiente.
 * Pensada para consumir directamente el ReputationSummaryDto del backend.
 */
export interface ReputationCardProps {
  levelLabel: string;
  levelColor?: string;
  stars?: number | null;
  ratingCount?: number;
  trustScore: number;
  trustStatus: string;
  trustLabel?: string;
  completedTasks?: number;
  cancelledTasks?: number;
  title?: string;
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ textAlign: 'center', flex: 1 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>{value}</div>
      <div style={{ fontSize: 12, color: '#64748b' }}>{label}</div>
    </div>
  );
}

export function ReputationCard({
  levelLabel,
  levelColor,
  stars,
  ratingCount = 0,
  trustScore,
  trustStatus,
  trustLabel,
  completedTasks = 0,
  cancelledTasks = 0,
  title = 'Reputación',
}: ReputationCardProps) {
  return (
    <div
      style={{
        border: '1px solid #e2e8f0',
        borderRadius: 16,
        padding: '1.1rem 1.25rem',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{title}</span>
        <LevelBadge label={levelLabel} color={levelColor} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <RatingStars value={stars ?? 0} />
        <span style={{ fontSize: 13, color: '#64748b' }}>
          {stars != null ? `${stars.toFixed(1)} (${ratingCount})` : 'Sin valoraciones'}
        </span>
      </div>

      <TrustBadge status={trustStatus} trustScore={trustScore} label={trustLabel} />

      <div style={{ display: 'flex', gap: 8, borderTop: '1px solid #f1f5f9', paddingTop: 12 }}>
        <Metric label="Tareas completadas" value={completedTasks} />
        <Metric label="Cancelaciones" value={cancelledTasks} />
        <Metric label="Confianza" value={trustScore} />
      </div>
    </div>
  );
}
