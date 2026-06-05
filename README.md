# Proxi

Proxi es un marketplace de servicios por tarea que conecta clientes con proveedores independientes verificados. El monorepo separa cada superficie operativa en su propia app para que cliente, proveedor, admin, landing y API puedan evolucionar sin mezclar responsabilidades.

## Estructura

```text
proxi/
  apps/
    frontend-cliente/    # Next.js 15 - app para clientes (puerto 3000)
    frontend-proveedor/  # Next.js 15 - app para proveedores (puerto 3001)
    frontend-admin/      # Next.js 15 - panel de administracion (puerto 3002)
    frontend-landing/    # Next.js 15 - landing publica (puerto 3003)
    backend-api/         # NestJS 10 - backend API unico (puerto 4000)
  packages/
    database/            # Prisma, schema y seeds (@proxi/database)
    contracts/           # Types, DTOs y enums compartidos (@proxi/contracts)
    ui/                  # Componentes React compartidos (@proxi/ui)
    config/              # Configuracion compartida (@proxi/config)
    auth/                # Utilidades de autenticacion (@proxi/auth)
    logger/              # Logger compartido (@proxi/logger)
    eslint-config/       # Configuracion ESLint compartida
    tsconfig/            # Configs base de TypeScript
  docs/
  infra/
```

El backend se mantiene como una sola API en `apps/backend-api`. No hay backends separados por frontend.

## Instalacion

```bash
pnpm install
cp .env.example .env
pnpm docker:up
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

## Desarrollo

```bash
pnpm dev
pnpm dev:cliente
pnpm dev:proveedor
pnpm dev:admin
pnpm dev:landing
pnpm dev:api
```

Puertos:

- Cliente: `http://localhost:3000`
- Proveedor: `http://localhost:3001`
- Admin: `http://localhost:3002`
- Landing: `http://localhost:3003`
- API: `http://localhost:4000/api`

## Scripts principales

```bash
pnpm build
pnpm typecheck
pnpm lint
pnpm build:cliente
pnpm build:proveedor
pnpm build:admin
pnpm build:landing
pnpm build:api
pnpm typecheck:cliente
pnpm typecheck:proveedor
pnpm typecheck:admin
pnpm typecheck:landing
pnpm typecheck:api
pnpm lint:cliente
pnpm lint:proveedor
pnpm lint:admin
pnpm lint:landing
pnpm lint:api
```

## Documentacion

- [Estructura del proyecto](docs/product/project-structure.md)
- [Arquitectura](docs/product/architecture.md)
- [Flujo MVP](docs/product/mvp-flow.md)
- [Modulos de API](docs/api/modules.md)
- [Modelo de proveedor independiente](docs/legal-operational/provider-independent-model.md)
