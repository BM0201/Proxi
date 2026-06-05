import Link from 'next/link';
import type { ReactNode } from 'react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Usuarios', href: '/users' },
  { label: 'Proveedores', href: '/providers' },
  { label: 'Verificaciones', href: '/verifications' },
  { label: 'Categorías', href: '/categories' },
  { label: 'Tareas', href: '/tasks' },
  { label: 'Reservas', href: '/bookings' },
  { label: 'Pagos', href: '/payments' },
  { label: 'Liquidaciones', href: '/payouts' },
  { label: 'Reclamos', href: '/disputes' },
  { label: 'Moderación', href: '/moderation' },
  { label: 'Suscripciones', href: '/subscriptions' },
  { label: 'Auditoría', href: '/audit' },
  { label: 'Configuración', href: '/settings' },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="appShell">
      <aside className="sidebar" aria-label="Navegacion admin">
        <div className="brand">
          <strong>Proxi</strong>
          <span>Administración</span>
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
            <span className="eyebrow">Frontend admin</span>
            <h1>Control operativo</h1>
          </div>
          <div className="statusPill">Auditoría activa</div>
        </header>
        <main className="content">{children}</main>
      </div>
      <style>{`
        .appShell { min-height: 100vh; display: grid; grid-template-columns: 280px 1fr; background: #f8f7fb; }
        .sidebar { background: #ffffff; border-right: 1px solid #e4e1ea; padding: 24px 18px; }
        .brand { display: grid; gap: 4px; margin-bottom: 28px; }
        .brand strong { font-size: 22px; }
        .brand span, .eyebrow { color: #6d6877; font-size: 13px; }
        .navList { display: grid; gap: 7px; }
        .navLink { color: #1f2937; text-decoration: none; border-radius: 8px; padding: 10px 12px; font-weight: 600; }
        .navLink:hover { background: #f3efff; color: #5b21b6; }
        .workspace { min-width: 0; }
        .header { min-height: 76px; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 18px 28px; background: #ffffff; border-bottom: 1px solid #e4e1ea; }
        .header h1 { margin: 4px 0 0; font-size: 24px; }
        .statusPill { border: 1px solid #ddd6fe; background: #f5f3ff; color: #5b21b6; border-radius: 999px; padding: 8px 12px; font-size: 13px; font-weight: 700; }
        .content { padding: 28px; }
        @media (max-width: 900px) {
          .appShell { grid-template-columns: 1fr; }
          .sidebar { border-right: 0; border-bottom: 1px solid #e4e1ea; padding: 18px; }
          .navList { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .header { align-items: flex-start; flex-direction: column; padding: 18px; }
          .content { padding: 18px; }
        }
      `}</style>
    </div>
  );
}
