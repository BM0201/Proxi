import Link from 'next/link';
import type { ReactNode } from 'react';

const navItems = [
  { label: 'Inicio', href: '/' },
  { label: 'Onboarding', href: '/onboarding' },
  { label: 'Verificación', href: '/verification' },
  { label: 'Perfil', href: '/profile' },
  { label: 'Servicios', href: '/services' },
  { label: 'Paquetes', href: '/packages' },
  { label: 'Tareas disponibles', href: '/tasks' },
  { label: 'Ofertas', href: '/offers' },
  { label: 'Reservas', href: '/bookings' },
  { label: 'Wallet', href: '/wallet' },
  { label: 'Liquidaciones', href: '/payouts' },
  { label: 'Reputación', href: '/reputation' },
  { label: 'Cuenta', href: '/account' },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="appShell">
      <aside className="sidebar" aria-label="Navegacion proveedor">
        <div className="brand">
          <strong>Proxi</strong>
          <span>Proveedor independiente</span>
        </div>
        <nav className="navList">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="navLink">
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="workspace">
        <header className="header">
          <div>
            <span className="eyebrow">Frontend proveedor</span>
            <h1>Operación y reputación</h1>
          </div>
          <div className="statusPill">Nivel pendiente</div>
        </header>
        <main className="content">{children}</main>
      </div>
      <style>{`
        .appShell { min-height: 100vh; display: grid; grid-template-columns: 280px 1fr; background: #f7f8f5; }
        .sidebar { background: #ffffff; border-right: 1px solid #dfe6dd; padding: 24px 18px; }
        .brand { display: grid; gap: 4px; margin-bottom: 28px; }
        .brand strong { font-size: 22px; }
        .brand span, .eyebrow { color: #657366; font-size: 13px; }
        .navList { display: grid; gap: 7px; }
        .navLink { color: #1f2937; text-decoration: none; border-radius: 8px; padding: 10px 12px; font-weight: 600; }
        .navLink:hover { background: #eef7ed; color: #166534; }
        .workspace { min-width: 0; }
        .header { min-height: 76px; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 18px 28px; background: #ffffff; border-bottom: 1px solid #dfe6dd; }
        .header h1 { margin: 4px 0 0; font-size: 24px; }
        .statusPill { border: 1px solid #bbf7d0; background: #f0fdf4; color: #166534; border-radius: 999px; padding: 8px 12px; font-size: 13px; font-weight: 700; }
        .content { padding: 28px; }
        @media (max-width: 860px) {
          .appShell { grid-template-columns: 1fr; }
          .sidebar { border-right: 0; border-bottom: 1px solid #dfe6dd; padding: 18px; }
          .navList { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .header { align-items: flex-start; flex-direction: column; padding: 18px; }
          .content { padding: 18px; }
        }
      `}</style>
    </div>
  );
}
