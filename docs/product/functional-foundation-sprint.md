# Sprint de base funcional

Este sprint convierte el flujo mock inicial de Proxi en una primera base funcional:

cuenta -> tarea -> ubicación -> oferta -> aceptación -> booking sandbox -> pago protegido simulado.

La frase madre sigue guiando el producto:

> "¿Conocés a alguien que...? Buscalo en Proxi."

## Qué se implementó

- Registro e inicio de sesión por correo para cliente y proveedor independiente.
- JWT, guard de autenticación y guard básico por rol.
- Decorator `CurrentUser`.
- Persistencia real de tareas.
- Persistencia real de ubicaciones con zona aproximada y dirección exacta protegida.
- Persistencia real de ofertas.
- Aceptación/rechazo de ofertas por cliente dueño de la tarea.
- Creación de booking sandbox al aceptar una oferta.
- Confirmación sandbox de pago protegido.
- Subida local controlada de metadata de archivos para fotos/documentos.
- Advertencia básica si una oferta contiene teléfono, correo, link o referencia a WhatsApp/Telegram.

## Qué sigue mock o sandbox

- Pago protegido no cobra dinero real.
- Wallet y liquidaciones siguen mock.
- Chat sigue mock.
- Tracking GPS en vivo no existe.
- Admin completo sigue parcial/mock.
- S3 real queda pendiente.
- Antivirus/malware scan queda pendiente.
- Mapas reales pagados quedan pendientes.

## Qué ya es real

- Usuarios y perfiles.
- Auth por correo y password hash.
- Tokens JWT.
- Tareas.
- Ofertas.
- Ubicaciones.
- Bookings sandbox.
- Estado `PROTECTED` simulado para pago protegido.
- Metadata de media.

## Cómo probar cliente

1. Abrir `frontend-cliente`.
2. Ir a `/register`.
3. Crear cuenta con rol fijo `CLIENT`.
4. Ir a `/tasks/new`.
5. Crear ubicación y tarea.
6. Ver tareas reales en `/tasks`.
7. Ver ofertas en `/tasks/:taskId/offers`.
8. Aceptar una oferta cuando exista.
9. Confirmar pago protegido sandbox en `/checkout/protected-payment`.

## Cómo probar proveedor

1. Abrir `frontend-proveedor`.
2. Ir a `/register`.
3. Crear cuenta con rol fijo `PROVIDER`.
4. Ir a `/tasks`.
5. Ver tareas reales disponibles.
6. Entrar a `/offers/new?taskId=...`.
7. Enviar oferta real.
8. Ver ofertas enviadas en `/offers`.
9. Ver bookings aceptados en `/bookings`.

## Cómo probar API

La API usa prefijo global `/api`.

Endpoints principales:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `POST /api/locations`
- `GET /api/locations/me`
- `GET /api/locations/:id`
- `PATCH /api/locations/:id`
- `DELETE /api/locations/:id`
- `POST /api/media/upload`
- `GET /api/media/:id`
- `DELETE /api/media/:id`
- `POST /api/tasks`
- `GET /api/tasks/me`
- `GET /api/tasks/available`
- `GET /api/tasks/:id`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `POST /api/offers`
- `GET /api/offers/me`
- `GET /api/tasks/:taskId/offers`
- `GET /api/offers/:id`
- `POST /api/offers/:id/accept`
- `POST /api/offers/:id/reject`
- `GET /api/bookings/me`
- `GET /api/bookings/:id`
- `POST /api/bookings/from-offer/:offerId`
- `POST /api/bookings/:id/confirm-protected-payment`

## Pendiente

- Migración real en ambiente con `DATABASE_URL`.
- Seed de admin/super admin.
- Admin real para usuarios, tareas y proveedores.
- Persistencia binaria local o S3 compatible para archivos.
- Pago sandbox más completo antes de pasarela real.
- Chat dentro de Proxi.
- Reclamos y evidencia real.
