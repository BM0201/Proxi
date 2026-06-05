import { Button, Card, CardContent, PageHeader, UploadPreview, VerificationStatusBadge } from '@proxi/ui';

export default function AdminVerificationDetailPage() {
  return (
    <main style={{ maxWidth: 1040, margin: '0 auto' }}>
      <PageHeader
        title="Detalle de verificación"
        description="Mock de revisión interna. No muestra documentos a clientes."
        actions={<VerificationStatusBadge status="PENDING_REVIEW" />}
      />
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'minmax(0, 1fr) minmax(280px, 0.7fr)' }}>
        <Card title="Perfil del proveedor">
          <CardContent>
            <p><strong>Nombre:</strong> Carlos M.</p>
            <p><strong>Correo:</strong> carlos@proxi.local</p>
            <p><strong>Servicio:</strong> Electricidad básica</p>
          </CardContent>
        </Card>
        <Card title="Acciones">
          <CardContent>
            <div style={{ display: 'grid', gap: 10 }}>
              <Button disabled>Aprobar</Button>
              <Button variant="danger" disabled>Rechazar</Button>
              <Button variant="secondary" disabled>Pedir corrección</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div style={{ marginTop: 18, display: 'grid', gap: 10 }}>
        <UploadPreview fileName="documento-identidad-frente.pdf" status="private" description="Documento privado." />
        <UploadPreview fileName="selfie-verificacion.jpg" status="private" description="Selfie privada." />
        <UploadPreview fileName="certificacion-electricidad.pdf" status="uploaded" description="Certificación opcional." />
      </div>
    </main>
  );
}
