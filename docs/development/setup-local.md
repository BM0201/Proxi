# Setup local

## Requisitos

- Node.js 20+
- pnpm 9.15.9
- PostgreSQL 15+ (local o gestionado)

## 1. Variables de entorno

Cada app/paquete lee variables de su propio `.env` (no versionado). Mínimo:

### Raíz / `apps/backend-api/.env`

```env
DATABASE_URL="postgresql://proxi:proxi@localhost:5432/proxi"
JWT_SECRET="dev-secret-cambiame"
JWT_EXPIRES_IN="1d"
CORS_ORIGINS="http://localhost:3100,http://localhost:3101,http://localhost:3102,http://localhost:3103"
PORT=4000
LOCAL_STORAGE_PATH="storage/local"
```

`CORS_ORIGINS` ya incluye los cuatro frontends (3100–3103). `LOCAL_STORAGE_PATH` es opcional
y define dónde se guardan los archivos subidos (por defecto `storage/local`).

### `packages/database/.env`

```env
DATABASE_URL="postgresql://proxi:proxi@localhost:5432/proxi"
```

### Frontends

Cada frontend usa `NEXT_PUBLIC_API_URL` apuntando a `http://localhost:4000/api`.

## 2. Instalar dependencias

```bash
pnpm install
```

## 3. Base de datos

```bash
# Generar Prisma Client en todos los paquetes
pnpm db:generate

# Aplicar migraciones (incluye next_functional_level_media_auth_location_admin)
pnpm db:migrate:dev

# Cargar datos de ejemplo
pnpm db:seed
```

> No ejecutar `prisma migrate reset` salvo que quieras borrar todos los datos. La migración
> `next_functional_level_media_auth_location_admin` ya está creada y aplicada.

### Credenciales del seed

| Rol | Correo | Contraseña |
| --- | --- | --- |
| Admin | `admin@proxi.local` | `ProxiAdmin123!` |
| Cliente | `cliente@proxi.local` | `ProxiCliente123!` |
| Proveedor | `proveedor@proxi.local` | `ProxiProveedor123!` |

## 4. Arranque

```bash
# API
pnpm dev:api

# Frontends (en paralelo)
pnpm dev:frontends
```

## 5. Verificación del monorepo

```bash
pnpm build       # turbo run build
pnpm typecheck   # turbo run typecheck
pnpm lint        # turbo run lint
```
