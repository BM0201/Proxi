# Autenticación y protección de rutas

## Backend

- `POST /api/auth/login` devuelve `{ accessToken }` (JWT firmado con `JWT_SECRET`).
- `GET /api/auth/me` devuelve `{ user: { id, email, role, status, displayName } }`.
- Roles disponibles: `CLIENT`, `PROVIDER`, `ADMIN`, `SUPER_ADMIN`.
- Las rutas protegidas usan `JwtAuthGuard` + `RolesGuard` con el decorador `@Roles(...)`.

## Frontend (cliente / proveedor / admin)

Cada app tiene helpers en `lib/api.ts`:

- Token guardado en `localStorage` con clave propia por app
  (`proxi:cliente`, `proxi:proveedor`, `proxi:admin:accessToken`).
- `isAuthenticated()`, `setXToken()`, `clearXToken()`, `logout()`.
- `getCurrentUser()` valida el token contra `/auth/me`.
- El cliente HTTP agrega `Authorization: Bearer <token>` y, ante un `401`,
  limpia el token automáticamente.

### Guarda de rutas (`components/AppShell.tsx`)

Cada `AppShell` es un Client Component que:

1. Define `PUBLIC_ROUTES` (p. ej. `/login`, `/register`).
2. En rutas privadas, si no hay token, redirige a `/login`.
3. Valida el rol esperado con `getCurrentUser()`:
   - Cliente espera `CLIENT`.
   - Proveedor espera `PROVIDER`.
   - Admin espera `ADMIN` o `SUPER_ADMIN`.
4. Si el rol no coincide o falla la validación, hace `logout()` y redirige.
5. Muestra un loader "Verificando sesión…" mientras valida.
6. El header muestra el nombre del usuario y un botón de **Cerrar sesión**.

### Login admin

`apps/frontend-admin/app/login/page.tsx` realiza login real y rechaza usuarios cuyo rol no
sea `ADMIN`/`SUPER_ADMIN` (validado con `isAdminRole`).
