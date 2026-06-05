# Flujo post-booking, pago protegido y reseñas

## Máquina de estados de la reserva (Booking)

1. **CONFIRMED** — el Cliente acepta una Oferta (`acceptOffer` crea el Booking).
2. **Pago protegido**: el Cliente confirma el pago protegido → `protectedPaymentStatus = PROTECTED`.
3. `POST /api/bookings/:id/start` (Proveedor) — requiere `CONFIRMED` + `PROTECTED` →
   `IN_PROGRESS`.
4. `POST /api/bookings/:id/complete-by-provider` (Proveedor) — `IN_PROGRESS` →
   `COMPLETED_BY_PROVIDER`.
5. `POST /api/bookings/:id/confirm-by-client` (Cliente) →
   `COMPLETED` + `protectedPaymentStatus = APPROVED_FOR_PAYOUT`.

### Liquidación en sandbox (al confirmar el Cliente)

- Se hace `upsert` de la `LedgerAccount` del Proveedor.
- Se registran asientos `RELEASE` y `CREDIT` por el neto (`total - platformFee`).
- Se incrementan `availableBalance` y `balance` del Proveedor.
- Se incrementa `completedJobs` del perfil del Proveedor.

> **Mock vs real.** No hay procesamiento de pagos real (sin pasarela). Todo el movimiento
> financiero es **sandbox contable** sobre `LedgerAccount`/`LedgerEntry`. La integración con
> una pasarela queda como `TODO`.

Estados de `ProtectedPaymentStatus`: `NOT_STARTED`, `PENDING`, `PROTECTED`,
`APPROVED_FOR_PAYOUT`, `DISPUTED`, `REFUNDED`.

## Evidencia

`POST /api/bookings/:id/evidence` y `GET /api/bookings/:id/evidence` permiten adjuntar y
listar evidencia (`BOOKING_EVIDENCE`) del trabajo realizado.

## Reseñas (reputación)

- `POST /api/reviews` con `{ bookingId, rating (1–5), comment? }`.
  - Valida que la reserva esté `COMPLETED` y que el autor sea parte de ella.
  - Evita reseñas duplicadas del mismo autor para la misma reserva.
  - `revieweeId` = la contraparte.
  - Aplica el detector anti-fuga al comentario.
  - Recalcula `ratingAverage` y `ratingCount` del Proveedor (agregación).
- `GET /api/reviews/provider/:userId` — público, lista reseñas del Proveedor.
