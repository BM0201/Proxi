# Proxi

**Proxi** es un marketplace de servicios por tarea que conecta **clientes** con
**proveedores independientes verificados**. Los clientes publican tareas, los
proveedores envían ofertas y la contratación se realiza con **pago protegido**,
**saldo aprobado** y **liquidación** hacia el proveedor.

> Terminología: usamos *proveedor independiente* (no empleado), *saldo aprobado*,
> *liquidación* y *pago protegido*. Proxi **no** gestiona salarios ni nómina.

---

## 🧱 Arquitectura

Monorepo gestionado con **Turborepo + pnpm**.

```
proxi/
  apps/
    client-web/      # Next.js 15 — app para clientes (puerto 3000)
    provider-web/    # Next.js 15 — app para proveedores (puerto 3001)
    admin-web/       # Next.js 15 — panel de administración (puerto 3002)
    landing/         # Next.js 15 — landing pública (puerto 3003)
    api/             # NestJS 10 — backend API (puerto 4000)
  packages/
    database/        # Prisma 5 + schema + seeds (@proxi/database)
    contracts/       # Types, DTOs (Zod) y enums compartidos (@proxi/contracts)
    ui/              # Componentes React compartidos (@proxi/ui)
    config/          # Configuración y constantes (@proxi/config)
    auth/            # Utilidades de autenticación / JWT (@proxi/auth)
    logger/          # Logger compartido con Pino (@proxi/logger)
    eslint-config/   # Configuración ESLint compartida (@proxi/eslint-config)
    tsconfig/        # Configs base de TypeScript (@proxi/tsconfig)
  infra/
    docker/          # docker-compose: PostgreSQL 16 + Redis 7
  docs/              # Documentación (producto, legal, api, base de datos)
```

### Stack

- **Node 22 LTS** · **TypeScript 5** (strict)
- **Next.js 15** (App Router) · **React 19**
- **NestJS 10** + **Swagger/OpenAPI** + **class-validator**
- **Prisma 5** · **PostgreSQL 16** · **Redis 7**
- **Turborepo** · **pnpm** · **ESLint** + **Prettier**

---

## ✅ Requisitos

- [Node 22](https://nodejs.org) (ver `.nvmrc`)
- [pnpm 9+](https://pnpm.io) (`npm install -g pnpm`)
- [Docker](https://www.docker.com) + Docker Compose

---

## 🚀 Instalación paso a paso

```bash
# 1. Instalar dependencias del monorepo
pnpm install

# 2. Configurar variables de entorno
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp packages/database/.env.example packages/database/.env
cp infra/docker/.env.example infra/docker/.env

# 3. Levantar la infraestructura (PostgreSQL + Redis)
pnpm docker:up

# 4. Generar el cliente de Prisma y aplicar migraciones
pnpm db:generate
pnpm db:migrate

# 5. Cargar las categorías iniciales
pnpm db:seed
```

---

## 🐳 Docker

```bash
pnpm docker:up     # Levanta PostgreSQL 16 y Redis 7
pnpm docker:down   # Detiene los servicios
```

PostgreSQL queda en `localhost:5432` y Redis en `localhost:6379` con volúmenes
persistentes. Ver [`infra/docker/README.md`](infra/docker/README.md).

---

## 🗄️ Base de datos (Prisma)

```bash
pnpm db:generate   # Genera el cliente de Prisma
pnpm db:migrate    # Crea/aplica migraciones (desarrollo)
pnpm db:seed       # Carga categorías iniciales
pnpm db:studio     # Abre Prisma Studio
```

El schema vive en [`packages/database/prisma/schema.prisma`](packages/database/prisma/schema.prisma)
e incluye `AuditLog` desde el inicio para trazabilidad.

---

## 🧑‍💻 Ejecutar las aplicaciones

```bash
# Todo el monorepo en modo desarrollo
pnpm dev

# O cada app por separado
pnpm --filter @proxi/api dev           # API NestJS  → http://localhost:4000/api
pnpm --filter @proxi/client-web dev    # Clientes    → http://localhost:3000
pnpm --filter @proxi/provider-web dev  # Proveedores → http://localhost:3001
pnpm --filter @proxi/admin-web dev     # Admin       → http://localhost:3002
pnpm --filter @proxi/landing dev       # Landing     → http://localhost:3003
```

Documentación de la API (Swagger): `http://localhost:4000/api/docs`
Healthcheck: `http://localhost:4000/api/health` · Versión: `http://localhost:4000/api/version`

---

## 📜 Scripts disponibles (raíz)

| Script              | Descripción                                   |
| ------------------- | --------------------------------------------- |
| `pnpm dev`          | Ejecuta todas las apps en modo desarrollo     |
| `pnpm build`        | Compila todos los paquetes y apps             |
| `pnpm lint`         | Ejecuta ESLint en todo el monorepo            |
| `pnpm typecheck`    | Verifica tipos de TypeScript                  |
| `pnpm test`         | Ejecuta los tests                             |
| `pnpm format`       | Formatea el código con Prettier               |
| `pnpm db:generate`  | Genera el cliente de Prisma                   |
| `pnpm db:migrate`   | Aplica migraciones de Prisma                  |
| `pnpm db:seed`      | Carga datos iniciales                         |
| `pnpm db:studio`    | Abre Prisma Studio                            |
| `pnpm docker:up`    | Levanta PostgreSQL + Redis                    |
| `pnpm docker:down`  | Detiene los contenedores                      |

---

## 🧭 Alcance inicial

Esta es la **base del monorepo**. No incluye (por diseño): pagos reales,
wallet real, apps móviles, IA ni lógica fiscal avanzada. El backend es modular
pero vive en una sola API inicial.

---

## 📄 Licencia

Privado — © Proxi.
