# Infraestructura Docker (desarrollo)

Entorno local de Proxi con **PostgreSQL 16** y **Redis 7**.

## Uso

```bash
# Copia las variables de ejemplo
cp infra/docker/.env.example infra/docker/.env

# Levanta los servicios
docker compose -f infra/docker/docker-compose.yml up -d

# Detén los servicios
docker compose -f infra/docker/docker-compose.yml down
```

También disponibles desde la raíz: `pnpm docker:up` y `pnpm docker:down`.

## Servicios

| Servicio   | Puerto | Volumen persistente     |
| ---------- | ------ | ----------------------- |
| PostgreSQL | 5432   | `proxi-postgres-data`   |
| Redis      | 6379   | `proxi-redis-data`      |

El script `init/01-init.sql` habilita extensiones de PostgreSQL al crear la base.
Las tablas se gestionan con migraciones de Prisma (`pnpm db:migrate`).
