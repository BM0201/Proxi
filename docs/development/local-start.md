# Arranque local

## Puertos coordinados

- Cliente: `http://localhost:3100`
- Proveedor: `http://localhost:3101`
- Admin: `http://localhost:3102`
- Landing: `http://localhost:3103`
- API: `http://localhost:4000/api`
- Swagger: `http://localhost:4000/api/docs`

## Ver frontends sin backend

Desde la raíz:

```powershell
pnpm dev:frontends
```

También podés levantarlos por separado:

```powershell
pnpm dev:cliente
pnpm dev:proveedor
pnpm dev:admin
pnpm dev:landing
```

## API real

La API requiere `DATABASE_URL` y `JWT_SECRET`.

Ejemplo de `.env` para `apps/backend-api` o raíz, según cómo quieras cargar variables:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/proxi"
JWT_SECRET="dev-secret-cambiame"
JWT_EXPIRES_IN="1d"
CORS_ORIGINS="http://localhost:3100,http://localhost:3101,http://localhost:3102,http://localhost:3103"
PORT=4000
```

Después:

```powershell
pnpm db:generate
pnpm db:migrate
pnpm dev:api
```

## Orden recomendado para probar flujo real

1. Levantar API: `pnpm dev:api`.
2. Levantar frontends: `pnpm dev:frontends`.
3. Cliente: registrar cuenta en `http://localhost:3100/register`.
4. Cliente: publicar tarea en `http://localhost:3100/tasks/new`.
5. Proveedor: registrar cuenta en `http://localhost:3101/register`.
6. Proveedor: ver tareas en `http://localhost:3101/tasks`.
7. Proveedor: enviar oferta.
8. Cliente: aceptar oferta y confirmar pago protegido sandbox.

## Si un puerto queda ocupado

Revisar procesos escuchando:

```powershell
netstat -ano | findstr :3100
```

Luego cerrar el proceso desde el Administrador de tareas o con:

```powershell
Stop-Process -Id PID
```

Reemplazá `PID` por el número que muestra `netstat`.
