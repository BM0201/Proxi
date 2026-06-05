# Estructura del proyecto

La organización principal del monorepo separa las superficies operativas por carpeta:

- `apps/frontend-cliente`: experiencia de clientes.
- `apps/frontend-proveedor`: experiencia de proveedores independientes.
- `apps/frontend-admin`: panel administrativo.
- `apps/frontend-landing`: landing pública.
- `apps/backend-api`: API única de backend.

No se crean backends por frontend.

## Backend modular

`apps/backend-api/src/modules` contiene módulos por dominio:

- `auth`: registro, login, JWT, usuario actual y guards.
- `marketplace`: tareas y ofertas reales.
- `booking`: booking sandbox y pago protegido simulado.
- `locations`: ubicación de tarea con dirección exacta protegida.
- `media`: metadata de archivos y reglas de privacidad.
- `identity`: verificación de proveedor independiente.
- `admin`: revisión manual de verificaciones.
- `profiles`
- `pricing`
- `chat`
- `payments`
- `reputation`
- `subscriptions`
- `disputes`
- `notifications`

## Paquetes compartidos

- `packages/ui`: componentes visuales genéricos sin lógica de negocio.
- `packages/contracts`: tipos, enums, DTOs y mocks compartidos.
- `packages/database`: Prisma y scripts internos.
- `packages/auth`: hash de contraseña, JWT y utilidades auth.
- `packages/config`: configuración compartida.
- `packages/logger`: logging compartido.

## Reglas de aislamiento

- Ningún frontend debe importar desde otro frontend.
- Todo componente compartido debe venir desde `@proxi/ui`.
- Tipos, enums y DTOs compartidos deben vivir en `@proxi/contracts`.
- Prisma/database solo debe ser usado por `apps/backend-api` y scripts internos.
- La lógica de negocio debe vivir en backend.
- Los frontends consumen API real o usan mocks temporales claramente marcados.
