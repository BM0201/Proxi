import { Card, CardContent, PageHeader, StatCard, StatusPill } from '@proxi/ui';

export default function ProviderWalletPage() {
  return (
    <main style={{ maxWidth: 1040, margin: '0 auto', display: 'grid', gap: 18 }}>
      <PageHeader
        title="Wallet"
        description="Vista mock de saldos. No hay liquidaciones reales ni pagos reales."
        actions={<StatusPill status="warning" label="Mock financiero" />}
      />
      <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <StatCard label="Saldo pendiente" value="C$ 918" description="Pago protegido aún no aprobado para liquidación." />
        <StatCard label="Saldo aprobado" value="C$ 0" description="Disponible cuando el cliente aprueba el trabajo." />
        <StatCard label="Próxima liquidación" value="Viernes" description="Ciclo mock según nivel y reputación." />
      </div>
      <Card title="Liquidaciones">
        <CardContent>
          <p style={{ margin: 0, color: '#475569', lineHeight: 1.6 }}>
            Las liquidaciones se realizan según tu nivel y ciclo de pago. Esta pantalla solo muestra estructura visual.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
