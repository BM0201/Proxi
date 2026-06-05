# Auth, verificación, media y ubicación

Este sprint deja la primera base funcional real para cuenta por correo, archivos, verificación de proveedor independiente y ubicación de tarea.

## Registro por correo

- `POST /api/auth/register`
- Permite crear cuentas públicas con rol `CLIENT` o `PROVIDER`.
- `ADMIN` y `SUPER_ADMIN` no se crean desde frontend público.
- La contraseña se hashea con `@proxi/auth`.
- La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula, número y símbolo.

## Login

- `POST /api/auth/login`
- Devuelve `accessToken` JWT y usuario actual.
- `GET /api/auth/me` devuelve la cuenta autenticada.
- `POST /api/auth/logout` queda como respuesta simple sin estado de servidor.

Pendiente: refresh token, rate limit y recuperación de contraseña.

## Roles

- `CLIENT`
- `PROVIDER`
- `ADMIN`
- `SUPER_ADMIN`

Los guards de backend validan JWT y roles para rutas protegidas.

## Subida de archivos

- `POST /api/media/upload`
- Registra metadata validada de archivo.
- Valida MIME, extensión y tamaño.
- Sanitiza nombres de archivo.
- No devuelve rutas internas.
- Documentos de verificación, evidencia y reclamos quedan privados.
- Avatar puede tener URL pública.

Pendiente: escritura binaria real local/S3, URLs firmadas, antivirus y escaneo de malware.

## Verificación de proveedor

Endpoints proveedor:

- `POST /api/identity/provider-verification`
- `GET /api/identity/provider-verification/me`
- `POST /api/identity/provider-certifications`
- `GET /api/identity/provider-certifications/me`

Endpoints admin:

- `GET /api/admin/verifications`
- `GET /api/admin/verifications/:id`
- `POST /api/admin/verifications/:id/approve`
- `POST /api/admin/verifications/:id/reject`
- `POST /api/admin/verifications/:id/request-correction`

La verificación inicial es manual. Al aprobar identidad, el perfil pasa a `APPROVED` y puede subir a `LEVEL_1`.

## Ubicación de tarea

- `POST /api/locations`
- `GET /api/locations/me`
- `GET /api/locations/:id`
- `PATCH /api/locations/:id`
- `DELETE /api/locations/:id`

La ubicación guarda país, departamento, ciudad, zona, referencia, latitud y longitud. La API devuelve vista exacta al dueño o admin, y vista aproximada para otros casos.

## Privacidad de dirección

Antes de contratar, un proveedor solo debe ver ciudad, zona aproximada y contexto general. La dirección exacta y coordenadas exactas deben revelarse solo cuando exista oferta aceptada, pago protegido creado o simulado, y booking confirmado.

## Implementado

- Modelos Prisma para usuario, perfiles, media, verificación, certificaciones y ubicaciones.
- DTOs/enums compartidos en `@proxi/contracts`.
- Auth por correo con hash y JWT.
- Guards de JWT y roles.
- Endpoints mínimos de auth, media, identity, admin y locations.
- Pantallas mock en cliente, proveedor y admin.

## Pendiente

- Persistencia binaria real.
- S3 compatible o storage autorizado.
- URLs firmadas para documentos privados.
- Refresh tokens.
- Rate limit.
- Email verification.
- Recuperación de contraseña.
- Booking real que habilite dirección exacta.
- Integración con mapa real.
- Antivirus/escaneo de malware.
