'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { getAdminToken, getCurrentUser, isAdminRole, logout, type CurrentUser } from '../lib/api';

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

/** Rutas públicas que no requieren sesión. */
const PUBLIC_ROUTES = ['/login'];

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
    if (!getAdminToken()) {
      router.replace('/login');
      return;
    }
    let active = true;
    getCurrentUser()
      .then((current) => {
        if (!active) return;
        // Validación de rol: solo ADMIN / SUPER_ADMIN.
        if (!isAdminRole(current.role)) {
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

  if (isPublic) {
    return <div style={{ minHeight: '100vh', padding: '40px 18px' }}>{children}</div>;
  }

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: '#6d6877' }}>
        Verificando sesión…
      </div>
    );
  }

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
          <div className="headerRight">
            <div className="statusPill">Auditoría activa</div>
            {user ? <span className="userName">{user.displayName}</span> : null}
            <button type="button" className="logoutBtn" onClick={logout}>
              Cerrar sesión
            </button>
          </div>
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
        .headerRight { display: flex; align-items: center; gap: 12px; }
        .userName { color: #1f2937; font-weight: 600; font-size: 14px; }
        .statusPill { border: 1px solid #ddd6fe; background: #f5f3ff; color: #5b21b6; border-radius: 999px; padding: 8px 12px; font-size: 13px; font-weight: 700; }
        .logoutBtn { border: 1px solid #fca5a5; background: #fef2f2; color: #b91c1c; border-radius: 8px; padding: 8px 12px; font-size: 13px; font-weight: 700; cursor: pointer; }
        .logoutBtn:hover { background: #fee2e2; }
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
