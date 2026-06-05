import { FileUploadCard, PageHeader, UploadPreview, VerificationStatusBadge } from '@proxi/ui';

export default function ProveedorVerificationPage() {
  return (
    <main style={{ maxWidth: 1040, margin: '0 auto' }}>
      <PageHeader
        title="Verificación de proveedor independiente"
        description="Tus documentos son privados y solo se usan para verificación interna de Proxi."
        actions={<VerificationStatusBadge status="PENDING_REVIEW" />}
      />
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        <FileUploadCard title="Documento de identidad" description="Frente del documento. Privado." accept=".pdf,.jpg,.jpeg,.png" disabled />
        <FileUploadCard title="Selfie de verificación" description="Foto de apoyo para revisión manual. Privada." accept=".jpg,.jpeg,.png" disabled />
        <FileUploadCard title="Certificación opcional" description="Diploma, licencia o evidencia profesional. Privada hasta revisión." accept=".pdf,.jpg,.jpeg,.png" disabled />
      </div>
      <div style={{ marginTop: 18, display: 'grid', gap: 10 }}>
        <UploadPreview fileName="cedula-frente.pdf" status="private" description="Documento privado para verificación interna." />
        <UploadPreview fileName="certificacion-electricidad.pdf" status="uploaded" description="Pendiente de revisión por Proxi." />
      </div>
    </main>
  );
}
