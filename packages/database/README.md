# @proxi/database

Capa de datos de Proxi: schema de Prisma, cliente compartido y seeds.

## Comandos

- `pnpm db:generate` — genera el cliente de Prisma.
- `pnpm db:migrate` — crea/aplica migraciones en desarrollo.
- `pnpm db:migrate:deploy` — aplica migraciones en producción.
- `pnpm db:push` — sincroniza el schema sin migración (prototipado).
- `pnpm db:seed` — carga las categorías iniciales.
- `pnpm db:studio` — abre Prisma Studio.

## Variables de entorno

Requiere `DATABASE_URL` (ver `.env.example`).
