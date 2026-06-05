const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
const TOKEN_KEY = 'proxi:admin:accessToken';

/** Roles permitidos en el panel de administración. */
export const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN'] as const;

export interface CurrentUser {
  id: string;
  email: string;
  role: 'CLIENT' | 'PROVIDER' | 'ADMIN' | 'SUPER_ADMIN';
  status: string;
  displayName: string;
}

export function getAdminToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

/** Elimina el token de sesión del almacenamiento local. */
export function clearAdminToken() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(TOKEN_KEY);
}

/** Indica si hay un token de sesión presente. */
export function isAuthenticated() {
  return Boolean(getAdminToken());
}

/** Cierra la sesión: limpia el token y redirige a /login. */
export function logout() {
  clearAdminToken();
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}

export async function adminApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAdminToken();
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    clearAdminToken();
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message ?? `Error ${response.status}`);
  }

  return response.json() as Promise<T>;
}

/** Obtiene el usuario autenticado actual desde /auth/me. */
export async function getCurrentUser(): Promise<CurrentUser> {
  const data = await adminApi<{ user: CurrentUser }>('/auth/me');
  return data.user;
}

/** Devuelve true si el rol corresponde a un administrador. */
export function isAdminRole(role: string) {
  return (ADMIN_ROLES as readonly string[]).includes(role);
}
