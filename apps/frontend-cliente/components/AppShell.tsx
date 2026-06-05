import Link from 'next/link';
import type { ReactNode } from 'react';

const navItems = [
  { label: 'Inicio', href: '/' },
  { label: 'Publicar tarea', href: '/tasks/new' },
  { label: 'Tareas', href: '/tasks' },
  { label: 'Ofertas', href: '/offers' },
  { label: 'Mensajes', href: '/messages' },
  { label: 'Reservas', href: '/bookings' },
  { label: 'Pagos', href: '/payments' },
  { label: 'Reseñas', href: '/reviews' },
  { label: 'Perfil', href: '/account' },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="appShell">
      <aside className="sidebar" aria-label="Navegación cliente">
        <div className="brand">
          <strong>Proxi</strong>
          <span>Cliente</span>
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
            <span className="eyebrow">Frontend cliente</span>
            <h1>Buscar, publicar y comparar</h1>
          </div>
          <div className="statusPill">Pago protegido</div>
        </header>
        <main className="content">{children}</main>
      </div>
      <style>{`
        .appShell { min-height: 100vh; display: grid; grid-template-columns: 260px 1fr; background: #f6fbf9; }
        .sidebar { background: #ffffff; border-right: 1px solid #dde3ea; padding: 24px 18px; }
        .brand { display: grid; gap: 4px; margin-bottom: 28px; }
        .brand strong { font-size: 22px; }
        .brand span, .eyebrow { color: #687385; font-size: 13px; }
        .navList { display: grid; gap: 8px; }
        .navLink { color: #1f2937; text-decoration: none; border-radius: 8px; padding: 10px 12px; font-weight: 600; }
        .navLink:hover { background: #ecfdf5; color: #0f766e; }
        .workspace { min-width: 0; }
        .header { min-height: 76px; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 18px 28px; background: #ffffff; border-bottom: 1px solid #dde3ea; }
        .header h1 { margin: 4px 0 0; font-size: 24px; }
        .statusPill { border: 1px solid #99f6e4; background: #f0fdfa; color: #0f766e; border-radius: 999px; padding: 8px 12px; font-size: 13px; font-weight: 700; }
        .content { padding: 28px; }
        @media (max-width: 780px) {
          .appShell { grid-template-columns: 1fr; }
          .sidebar { border-right: 0; border-bottom: 1px solid #dde3ea; padding: 18px; }
          .navList { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .header { align-items: flex-start; flex-direction: column; padding: 18px; }
          .content { padding: 18px; }
        }
      `}</style>
    </div>
  );
}
