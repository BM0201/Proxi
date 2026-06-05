# Módulos de API

La API única vive en `apps/backend-api` y se organiza por módulos NestJS. No se crean APIs separadas por frontend.

## Módulos actuales

- `auth`: registro, login, logout y usuario actual.
- `marketplace`: tareas reales y ofertas reales.
- `booking`: reservas sandbox y pago protegido simulado.
- `locations`: ubicaciones de tarea y privacidad de dirección exacta.
- `media`: metadata de archivos, reglas de privacidad y preparación para storage.
- `identity`: verificación de proveedor independiente y certificaciones.
- `admin`: revisión manual de verificaciones.
- `profiles`
- `pricing`
- `chat`
- `payments`
- `reputation`
- `subscriptions`
- `disputes`
- `notifications`

## Endpoints base

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Marketplace:

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

Booking sandbox:

- `GET /api/bookings/me`
- `GET /api/bookings/:id`
- `POST /api/bookings/from-offer/:offerId`
- `POST /api/bookings/:id/confirm-protected-payment`

Locations:

- `POST /api/locations`
- `GET /api/locations/me`
- `GET /api/locations/:id`
- `PATCH /api/locations/:id`
- `DELETE /api/locations/:id`

Media:

- `POST /api/media/upload`
- `GET /api/media/:id`
- `DELETE /api/media/:id`

Identity:

- `POST /api/identity/provider-verification`
- `GET /api/identity/provider-verification/me`
- `POST /api/identity/provider-certifications`
- `GET /api/identity/provider-certifications/me`

Admin:

- `GET /api/admin/verifications`
- `GET /api/admin/verifications/:id`
- `POST /api/admin/verifications/:id/approve`
- `POST /api/admin/verifications/:id/reject`
- `POST /api/admin/verifications/:id/request-correction`

La landing y los tres frontends operativos deben consumir esta API común.
