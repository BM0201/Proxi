const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
const TOKEN_KEY = 'proxi:cliente:accessToken';

/** Rol esperado para esta aplicación (frontend de clientes). */
export const EXPECTED_ROLE = 'CLIENT';

export interface CurrentUser {
  id: string;
  email: string;
  role: 'CLIENT' | 'PROVIDER' | 'ADMIN' | 'SUPER_ADMIN';
  status: string;
  displayName: string;
}

export function getClienteToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setClienteToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

/** Elimina el token de sesión del almacenamiento local. */
export function clearClienteToken() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(TOKEN_KEY);
}

/** Indica si hay un token de sesión presente (no valida expiración en cliente). */
export function isAuthenticated() {
  return Boolean(getClienteToken());
}

/** Cierra la sesión: limpia el token y redirige a /login. */
export function logout() {
  clearClienteToken();
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}

export async function clienteApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getClienteToken();
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      // No fijar Content-Type cuando se envía FormData (el navegador agrega el boundary).
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    // Token inválido o expirado: limpiamos la sesión.
    clearClienteToken();
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message ?? `Error ${response.status}`);
  }

  return response.json() as Promise<T>;
}

/** Sube un archivo real al backend (multipart) y devuelve la metadata del MediaFile. */
export async function uploadMedia(file: File, purpose: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('purpose', purpose);
  return clienteApi<{ id: string; originalName: string; mimeType: string; sizeBytes: number; status: string }>(
    '/media/upload',
    { method: 'POST', body: formData },
  );
}

/** Obtiene el usuario autenticado actual desde /auth/me. */
export async function getCurrentUser(): Promise<CurrentUser> {
  const data = await clienteApi<{ user: CurrentUser }>('/auth/me');
  return data.user;
}
