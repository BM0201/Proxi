'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Card, CardContent, PageHeader, UploadPreview, VerificationStatusBadge } from '@proxi/ui';
import { adminApi } from '../../../lib/api';

type VerStatus = 'NOT_STARTED' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'NEEDS_CORRECTION';

interface MediaFile {
  id: string;
  originalName: string;
  mimeType: string;
  purpose: string;
}

interface VerificationDetail {
  id: string;
  status: VerStatus;
  notes?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  identityDocumentFrontMedia?: MediaFile | null;
  identityDocumentBackMedia?: MediaFile | null;
  selfieMedia?: MediaFile | null;
  provider: {
    headline?: string | null;
    user: { id: string; email: string; displayName: string | null; status: string };
    certifications?: { id: string; title: string; issuer?: string | null; status: string }[];
  };
}

export default function AdminVerificationDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<VerificationDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => {
    adminApi<VerificationDetail>(`/admin/verifications/${params.id}`)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar'));
  };

  useEffect(() => {
    if (params.id) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const decide = async (action: 'approve' | 'reject' | 'request-correction') => {
    if ((action === 'reject' || action === 'request-correction') && !reason.trim()) {
      setError('Indicá una observación para el proveedor.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await adminApi(`/admin/verifications/${params.id}/${action}`, {
        method: 'POST',
        body: action === 'approve' ? undefined : JSON.stringify({
          status: action === 'reject' ? 'REJECTED' : 'NEEDS_CORRECTION',
          rejectionReason: reason,
        }),
      });
      router.push('/verifications');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar');
    } finally {
      setBusy(false);
    }
  };

  if (!data) {
    return (
      <main style={{ maxWidth: 1040, margin: '0 auto' }}>
        <PageHeader title="Detalle de verificación" description="Cargando…" />
        {error ? <p style={{ color: '#b91c1c' }}>{error}</p> : null}
      </main>
    );
  }

  const media = [
    { m: data.identityDocumentFrontMedia, label: 'Documento de identidad (frente)' },
    { m: data.identityDocumentBackMedia, label: 'Documento de identidad (reverso)' },
    { m: data.selfieMedia, label: 'Selfie de verificación' },
  ].filter((x) => x.m);

  const pending = data.status === 'PENDING_REVIEW' || data.status === 'NEEDS_CORRECTION';

  return (
    <main style={{ maxWidth: 1040, margin: '0 auto' }}>
      <PageHeader
        title="Detalle de verificación"
        description="Revisión interna. Los documentos no se muestran a clientes."
        actions={<VerificationStatusBadge status={data.status} />}
      />
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'minmax(0, 1fr) minmax(280px, 0.7fr)' }}>
        <Card title="Perfil del proveedor">
          <CardContent>
            <p><strong>Nombre:</strong> {data.provider.user.displayName ?? '—'}</p>
            <p><strong>Correo:</strong> {data.provider.user.email}</p>
            <p><strong>Estado de cuenta:</strong> {data.provider.user.status}</p>
            {data.provider.headline ? <p><strong>Perfil:</strong> {data.provider.headline}</p> : null}
            {data.notes ? <p><strong>Notas del proveedor:</strong> {data.notes}</p> : null}
            {data.rejectionReason ? <p><strong>Observación previa:</strong> {data.rejectionReason}</p> : null}
          </CardContent>
        </Card>
        <Card title="Acciones">
          <CardContent>
            {pending ? (
              <div style={{ display: 'grid', gap: 10 }}>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  placeholder="Observación (requerida para rechazo o corrección)"
                  style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #d1d5db' }}
                />
                <Button onClick={() => decide('approve')} disabled={busy}>Aprobar</Button>
                <Button variant="danger" onClick={() => decide('reject')} disabled={busy}>Rechazar</Button>
                <Button variant="secondary" onClick={() => decide('request-correction')} disabled={busy}>Pedir corrección</Button>
              </div>
            ) : (
              <p>Esta verificación ya fue resuelta ({data.status}).</p>
            )}
            {error ? <p style={{ color: '#b91c1c' }}>{error}</p> : null}
          </CardContent>
        </Card>
      </div>
      <div style={{ marginTop: 18, display: 'grid', gap: 10 }}>
        {media.map(({ m, label }) => (
          <UploadPreview key={m!.id} fileName={`${label} — ${m!.originalName}`} status="private" description={`Archivo privado (${m!.mimeType}).`} />
        ))}
        {data.provider.certifications?.map((c) => (
          <UploadPreview key={c.id} fileName={`Certificación: ${c.title}${c.issuer ? ` (${c.issuer})` : ''}`} status="uploaded" description={`Estado: ${c.status}`} />
        ))}
      </div>
    </main>
  );
}
