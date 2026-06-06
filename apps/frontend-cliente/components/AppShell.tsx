'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { EXPECTED_ROLE, getCurrentUser, getClienteToken, logout, type CurrentUser } from '../lib/api';

const navItems = [
  { label: 'Inicio', href: '/' },
  { label: 'Publicar tarea', href: '/tasks/new' },
  { label: 'Tareas', href: '/tasks' },
  { label: 'Tareas rápidas', href: '/quick-tasks' },
  { label: 'Ofertas', href: '/offers' },
  { label: 'Mensajes', href: '/messages' },
  { label: 'Reservas', href: '/bookings' },
  { label: 'Pagos', href: '/payments' },
  { label: 'Reseñas', href: '/reviews' },
  { label: 'Reputación', href: '/account/reputation' },
  { label: 'Perfil', href: '/account' },
];

/** Rutas públicas que no requieren sesión ni muestran el layout completo. */
const PUBLIC_ROUTES = ['/login', '/register'];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isPublic = PUBLIC_ROUTES.some((route) => pathname?.startsWith(route));
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [checking, setChecking] = useState(!isPublic);

  useEffect(() => {
    if (isPublic) {
      setChecking(false);
      return;
    }
    // Protección de ruta: sin token redirigimos a /login.
    if (!getClienteToken()) {
      router.replace('/login');
      return;
    }
    let active = true;
    getCurrentUser()
      .then((current) => {
        if (!active) return;
        // Validación de rol: esta app es solo para clientes.
        if (current.role !== EXPECTED_ROLE) {
          logout();
          return;
        }
        setUser(current);
        setChecking(false);
      })
      .catch(() => {
        if (active) logout();
      });
    return () => {
      active = false;
    };
  }, [isPublic, pathname, router]);

  // Las rutas públicas (login/registro) se renderizan sin el chrome de la app.
  if (isPublic) {
    return (
      <div style={{ minHeight: '100vh', padding: '40px 18px' }}>{children}</div>
    );
  }

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: '#687385' }}>
        Verificando sesión…
      </div>
    );
  }

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
          <div className="headerRight">
            <div className="statusPill">Pago protegido</div>
            {user ? <span className="userName">{user.displayName}</span> : null}
            <button type="button" className="logoutBtn" onClick={logout}>
              Cerrar sesión
            </button>
          </div>
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
        .headerRight { display: flex; align-items: center; gap: 12px; }
        .userName { color: #1f2937; font-weight: 600; font-size: 14px; }
        .statusPill { border: 1px solid #99f6e4; background: #f0fdfa; color: #0f766e; border-radius: 999px; padding: 8px 12px; font-size: 13px; font-weight: 700; }
        .logoutBtn { border: 1px solid #fca5a5; background: #fef2f2; color: #b91c1c; border-radius: 8px; padding: 8px 12px; font-size: 13px; font-weight: 700; cursor: pointer; }
        .logoutBtn:hover { background: #fee2e2; }
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
