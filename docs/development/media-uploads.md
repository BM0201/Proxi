# Subida de archivos (media) y asociaciones

## Subida real local (Multer)

- `POST /api/media/upload` (multipart) recibe `file` + `purpose`.
- El archivo se guarda en disco bajo `LOCAL_STORAGE_PATH` (por defecto
  `apps/backend-api/storage/local/<categoría>/<userId>/<archivo>`).
- `MediaService` valida MIME, extensión y tamaño:
  - Imágenes: hasta 8 MB.
  - Documentos: hasta 10 MB.
  - Video: hasta 50 MB.
- Se crea un registro `MediaFile` con `ownerUserId`, `purpose`, `status`, ruta y metadata.

> **Mock vs real.** El almacenamiento es **local en disco**, no S3. La ruta a S3/CDN queda
> como `TODO` documentado en `MediaService`. No se procesan miniaturas ni CDN todavía.

### Propósitos (`MediaPurpose`)

`AVATAR`, `PROVIDER_PORTFOLIO`, `VERIFICATION_DOCUMENT`, `VERIFICATION_SELFIE`,
`TASK_PHOTO`, `TASK_VIDEO`, `BOOKING_EVIDENCE`, `DISPUTE_EVIDENCE`.

### Acceso

- `GET /api/media/:id` (privado, requiere ser dueño o admin).
- `GET /api/media/:id/raw` sirve el binario.
- `GET /api/media/public/:id` solo para media pública (AVATAR siempre; PROVIDER_PORTFOLIO
  solo si el proveedor está `APPROVED`).

## Asociaciones

| Endpoint | Descripción |
| --- | --- |
| `POST /api/tasks/:id/media` | Asocia un `MediaFile` (ya subido) a una Tarea. |
| `GET /api/tasks/:id/media` | Lista media de la Tarea. |
| `POST /api/profiles/provider/portfolio-media` | Agrega media al portafolio del proveedor. |
| `GET /api/profiles/provider/:id/portfolio-media` | Lista portafolio (respeta visibilidad). |
| `POST /api/bookings/:id/evidence` | Adjunta evidencia a una reserva. |
| `GET /api/bookings/:id/evidence` | Lista evidencia de la reserva. |

## Flujo en frontend

### Cliente — crear Tarea con fotos (`app/tasks/new`)

1. El usuario elige una foto → `uploadMedia(file, 'TASK_PHOTO')` la sube de inmediato
   (multipart real) y se guarda el `mediaId`.
2. Al publicar la Tarea, por cada foto subida se llama `POST /tasks/:id/media`.
3. El botón **"Usar mi ubicación (GPS)"** usa `navigator.geolocation` para completar
   latitud/longitud; la **dirección exacta queda protegida** hasta el booking.

### Proveedor — verificación (`app/verification`)

Sube documento de identidad (frente obligatorio), reverso y selfie opcionales con
`uploadMedia(file, 'VERIFICATION_DOCUMENT' | 'VERIFICATION_SELFIE')` y envía la
verificación a revisión interna.
