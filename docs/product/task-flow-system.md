# Sistema de flujo de tareas

El flujo de tareas de Proxi responde a la frase madre:

> "¿Conocés a alguien que...?"
> "Buscalo en Proxi."

## Paso 1: Inicio / Buscar

El cliente entra al frontend cliente y ve un buscador grande, categorías rápidas y el CTA para publicar una tarea.

## Paso 2: Publicar tarea

La ruta `/tasks/new` crea una tarea real cuando el cliente tiene sesión. También crea una ubicación real asociada a la tarea.

La regla de privacidad es central:

- Proveedores ven país, departamento, ciudad y zona.
- La dirección exacta queda protegida.
- La dirección exacta se reserva para booking confirmado y pago protegido sandbox.

## Paso 3: Comparar ofertas

La ruta `/tasks/:taskId/offers` consulta ofertas reales de esa tarea. Si no hay ofertas, muestra un estado vacío.

Cada oferta conserva:

- Proveedor independiente.
- Nivel.
- Estrellas.
- Trabajos completados.
- Precio ofertado.
- Tiempo estimado.
- Mensaje.
- Advertencia básica si contiene teléfono, correo, link o WhatsApp/Telegram.

## Paso 4: Confirmar con pago protegido

La ruta `/checkout/protected-payment` usa booking sandbox. No procesa pagos reales.

Al confirmar, el backend marca:

- Booking: `protectedPaymentStatus = PROTECTED`.
- Tarea: `status = PROTECTED_PAYMENT_CONFIRMED`.

## Estados del flujo

- `DRAFT`
- `PUBLISHED`
- `RECEIVING_OFFERS`
- `OFFER_ACCEPTED`
- `PROTECTED_PAYMENT_CONFIRMED`
- `IN_PROGRESS`
- `COMPLETED`
- `CANCELLED`
- `DISPUTED`

## Qué ya es real

- Registro/login por correo.
- Creación de tareas.
- Ubicación de tarea con dirección exacta protegida.
- Ofertas de proveedor independiente.
- Aceptación/rechazo de ofertas.
- Booking sandbox.
- Confirmación sandbox de pago protegido.

## Qué sigue mock o sandbox

- Pago protegido no cobra dinero real.
- Wallet y liquidaciones no mueven saldo real.
- Chat sigue pendiente.
- Admin de tareas/proveedores sigue parcial.
- Persistencia binaria real de archivos queda pendiente.

## Pendiente para backend completo

- Matching y búsqueda avanzada.
- Checkout real con proveedor de pago.
- Chat dentro de Proxi.
- Notificaciones.
- Liquidaciones reales.
- Sistema de reclamos con evidencia real.
