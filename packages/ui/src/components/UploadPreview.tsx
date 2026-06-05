import { Badge } from './Badge';

export interface UploadPreviewProps {
  fileName: string;
  description?: string;
  status?: 'ready' | 'uploaded' | 'private' | 'rejected';
}

const statusVariant = {
  ready: 'neutral',
  uploaded: 'success',
  private: 'warning',
  rejected: 'danger',
} as const;

export function UploadPreview({ fileName, description, status = 'ready' }: UploadPreviewProps) {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '0.8rem', background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
        <strong>{fileName}</strong>
        <Badge variant={statusVariant[status]}>{status}</Badge>
      </div>
      {description ? <p style={{ margin: '0.45rem 0 0', color: '#6b7280', fontSize: 14 }}>{description}</p> : null}
    </div>
  );
}
