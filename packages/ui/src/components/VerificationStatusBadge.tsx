import { Badge } from './Badge';

export interface VerificationStatusBadgeProps {
  status: 'NOT_STARTED' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'NEEDS_CORRECTION';
}

const labels: Record<VerificationStatusBadgeProps['status'], string> = {
  NOT_STARTED: 'No iniciada',
  PENDING_REVIEW: 'En revisión',
  APPROVED: 'Aprobada',
  REJECTED: 'Rechazada',
  NEEDS_CORRECTION: 'Necesita corrección',
};

const variants = {
  NOT_STARTED: 'neutral',
  PENDING_REVIEW: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger',
  NEEDS_CORRECTION: 'info',
} as const;

export function VerificationStatusBadge({ status }: VerificationStatusBadgeProps) {
  return <Badge variant={variants[status]}>{labels[status]}</Badge>;
}
