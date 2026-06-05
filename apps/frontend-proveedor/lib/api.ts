const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
const TOKEN_KEY = 'proxi:proveedor:accessToken';

export function getProveedorToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setProveedorToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export async function proveedorApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getProveedorToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message ?? `Error ${response.status}`);
  }

  return response.json() as Promise<T>;
}
