'use client';

import { useEffect, useState } from 'react';
import { Button, Card, CardContent, FileUploadCard, PageHeader, UploadPreview, VerificationStatusBadge } from '@proxi/ui';
import { proveedorApi, uploadMedia } from '../../lib/api';

type VerStatus = 'NOT_STARTED' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'NEEDS_CORRECTION';

interface MediaRef {
  id: string;
  originalName: string;
}

interface Verification {
  id: string;
  status: VerStatus;
  notes?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
}

export default function ProveedorVerificationPage() {
  const [current, setCurrent] = useState<Verification | null>(null);
  const [front, setFront] = useState<MediaRef | null>(null);
  const [back, setBack] = useState<MediaRef | null>(null);
  const [selfie, setSelfie] = useState<MediaRef | null>(null);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    proveedorApi<Verification | null>('/identity/provider-verification/me')
      .then(setCurrent)
      .catch(() => setCurrent(null));
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (
    file: File,
    purpose: string,
    setter: (m: MediaRef) => void,
    slot: string,
  ) => {
    setBusy(slot);
    setError(null);
    try {
      const media = await uploadMedia(file, purpose);
      setter({ id: media.id, originalName: media.originalName });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir archivo');
    } finally {
      setBusy(null);
    }
  };

  const submit = async () => {
    if (!front) {
      setError('El documento de identidad (frente) es obligatorio.');
      return;
    }
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      await proveedorApi('/identity/provider-verification', {
        method: 'POST',
        body: JSON.stringify({
          identityDocumentFrontMediaId: front.id,
          identityDocumentBackMediaId: back?.id,
          selfieMediaId: selfie?.id,
          notes: notes || undefined,
        }),
      });
      setSuccess('Verificación enviada. Proxi revisará tus documentos de forma interna.');
      setFront(null);
      setBack(null);
      setSelfie(null);
      setNotes('');
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar verificación');
    } finally {
      setSubmitting(false);
    }
  };

  const status: VerStatus = current?.status ?? 'NOT_STARTED';
  const canSubmit = status === 'NOT_STARTED' || status === 'REJECTED' || status === 'NEEDS_CORRECTION';

  return (
    <main style={{ maxWidth: 1040, margin: '0 auto' }}>
      <PageHeader
        title="Verificación de proveedor independiente"
        description="Tus documentos son privados y solo se usan para la verificación interna de Proxi."
        actions={<VerificationStatusBadge status={status} />}
      />

      {current?.rejectionReason && (status === 'REJECTED' || status === 'NEEDS_CORRECTION') ? (
        <Card>
          <CardContent style={{ paddingTop: '1rem' }}>
            <strong>Observación de Proxi:</strong> {current.rejectionReason}
          </CardContent>
        </Card>
      ) : null}

      {status === 'PENDING_REVIEW' ? (
        <Card>
          <CardContent style={{ paddingTop: '1rem' }}>
            Tu verificación está en revisión. Te notificaremos cuando Proxi complete la revisión interna.
          </CardContent>
        </Card>
      ) : null}

      {status === 'APPROVED' ? (
        <Card>
          <CardContent style={{ paddingTop: '1rem' }}>
            ✅ Tu cuenta está verificada. Ya podés recibir Tareas con mayor confianza.
          </CardContent>
        </Card>
      ) : null}

      {canSubmit ? (
        <>
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', marginTop: 16 }}>
            <FileUploadCard
              title="Documento de identidad (frente)"
              description="Obligatorio. Privado."
              accept=".pdf,.jpg,.jpeg,.png"
              actionLabel={busy === 'front' ? 'Subiendo…' : 'Seleccionar archivo'}
              disabled={busy === 'front'}
              onSelect={(file) => handleUpload(file, 'VERIFICATION_DOCUMENT', setFront, 'front')}
            />
            <FileUploadCard
              title="Documento de identidad (reverso)"
              description="Opcional. Privado."
              accept=".pdf,.jpg,.jpeg,.png"
              actionLabel={busy === 'back' ? 'Subiendo…' : 'Seleccionar archivo'}
              disabled={busy === 'back'}
              onSelect={(file) => handleUpload(file, 'VERIFICATION_DOCUMENT', setBack, 'back')}
            />
            <FileUploadCard
              title="Selfie de verificación"
              description="Opcional. Foto de apoyo para revisión manual. Privada."
              accept=".jpg,.jpeg,.png"
              actionLabel={busy === 'selfie' ? 'Subiendo…' : 'Seleccionar archivo'}
              disabled={busy === 'selfie'}
              onSelect={(file) => handleUpload(file, 'VERIFICATION_SELFIE', setSelfie, 'selfie')}
            />
          </div>

          <div style={{ marginTop: 18, display: 'grid', gap: 10 }}>
            {front ? <UploadPreview fileName={front.originalName} status="private" description="Documento de identidad (frente) listo." /> : null}
            {back ? <UploadPreview fileName={back.originalName} status="private" description="Documento de identidad (reverso) listo." /> : null}
            {selfie ? <UploadPreview fileName={selfie.originalName} status="private" description="Selfie de verificación lista." /> : null}
          </div>

          <div style={{ marginTop: 18 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Notas para la revisión (opcional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              maxLength={1000}
              style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #d1d5db' }}
              placeholder="Información adicional para el equipo de verificación de Proxi."
            />
          </div>

          {error ? <p style={{ color: '#b91c1c' }}>{error}</p> : null}
          {success ? <p style={{ color: '#15803d' }}>{success}</p> : null}

          <div style={{ marginTop: 16 }}>
            <Button type="button" onClick={submit} disabled={submitting || !front}>
              {submitting ? 'Enviando…' : 'Enviar verificación'}
            </Button>
          </div>
        </>
      ) : null}

      {error && !canSubmit ? <p style={{ color: '#b91c1c' }}>{error}</p> : null}
      {success && !canSubmit ? <p style={{ color: '#15803d' }}>{success}</p> : null}
    </main>
  );
}
