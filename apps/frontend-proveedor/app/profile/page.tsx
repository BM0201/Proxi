import { Card, CardContent, FileUploadCard, PageHeader, Textarea, TextInput, UploadPreview } from '@proxi/ui';

export default function ProveedorProfilePage() {
  return (
    <main style={{ maxWidth: 1040, margin: '0 auto' }}>
      <PageHeader
        title="Perfil de proveedor"
        description="Mock para foto de perfil, portafolio y video corto de presentación."
      />
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'minmax(0, 1fr) minmax(280px, 0.8fr)' }}>
        <Card title="Información visible">
          <CardContent>
            <div style={{ display: 'grid', gap: 14 }}>
              <TextInput placeholder="Nombre visible" defaultValue="Carlos M." />
              <Textarea placeholder="Bio" defaultValue="Electricista independiente con experiencia en instalaciones residenciales." />
            </div>
          </CardContent>
        </Card>
        <div style={{ display: 'grid', gap: 14 }}>
          <FileUploadCard title="Foto de perfil" description="Puede ser pública como avatar." accept=".jpg,.jpeg,.png,.webp" disabled />
          <FileUploadCard title="Fotos de trabajos anteriores" description="Portafolio público después de aprobación." accept=".jpg,.jpeg,.png,.webp" disabled />
          <FileUploadCard title="Video corto opcional" description="Presentación breve para generar confianza." accept=".mp4,.mov,.webm" disabled />
        </div>
      </div>
      <div style={{ marginTop: 18, display: 'grid', gap: 10 }}>
        <UploadPreview fileName="instalacion-abanico.webp" status="uploaded" description="Portafolio pendiente de aprobación." />
        <UploadPreview fileName="presentacion.mp4" status="ready" description="Video opcional mock." />
      </div>
    </main>
  );
}
