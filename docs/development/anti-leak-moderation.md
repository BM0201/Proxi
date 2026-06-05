# Anti-fuga y moderación

Proxi mantiene la comunicación, las ofertas y el pago dentro de la plataforma. Para evitar
que se filtren datos de contacto externos (intento de "fuga" del pago protegido), existe
detección automática.

## Detector

`apps/backend-api/src/common/moderation/detect-external-contact.ts` exporta
`detectExternalContact(text)` que devuelve `{ detected: boolean, reasons: string[] }`.

Detecta:

- Números de teléfono.
- Correos electrónicos.
- URLs y dominios.
- Mensajeros: WhatsApp, Telegram, `wa.me`, `t.me`, handles `@usuario`.
- Frases en español que sugieren contacto fuera de la plataforma.

## Uso

### Ofertas

`MarketplaceService` ejecuta el detector sobre el mensaje de cada **Oferta**. Si detecta
contacto externo:

- Marca la oferta con `contactWarning`.
- Crea un `ModerationFlag` (`entityType = OFFER`, `status = OPEN`) con la razón
  `"Detección automática anti-fuga: ..."`.

### Reseñas

`ReputationService` aplica el mismo detector al comentario de la reseña y crea un flag si
corresponde.

> **Decisión de diseño.** `ModerationFlag.reporterId` es obligatorio (FK a `User`). Como no
> existe un usuario "sistema", se usa el `id` del propio autor (proveedor para ofertas,
> autor para reseñas). Está documentado en los comentarios del código.

## Panel de administración

- `GET /api/admin/moderation-flags` lista los flags con su reportante.
- `POST /api/admin/moderation-flags/:id/resolve` con `{ status }` donde
  `status ∈ { REVIEWED, ACTIONED, DISMISSED }`.
- En el frontend admin (`app/moderation`), cada flag abierto muestra botones para
  **Marcar revisado**, **Aplicar acción** o **Descartar**.

Estados de `ModerationStatus`: `OPEN`, `REVIEWED`, `ACTIONED`, `DISMISSED`.
