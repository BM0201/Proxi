# Mock vs Real

Resumen de qué quedó funcional de verdad y qué sigue siendo simulado o pendiente tras el
sprint *Next Functional Level*.

## Real (funcional de extremo a extremo)

- **Auth**: login JWT, `/auth/me`, guardas por rol, logout y protección de rutas en los tres
  frontends (cliente, proveedor, admin).
- **Subida de archivos**: multipart real con Multer, almacenamiento **local en disco**,
  validación de MIME/extensión/tamaño y registros `MediaFile`.
- **Asociaciones de media**: tareas, portafolio de proveedor y evidencia de reservas.
- **Anti-fuga**: detección automática de contacto externo en ofertas y reseñas, con creación
  de `ModerationFlag`.
- **Flujo post-booking**: start → complete-by-provider → confirm-by-client con transiciones
  de estado reales.
- **Reseñas**: creación validada y recálculo de reputación del proveedor.
- **Panel admin**: dashboard, usuarios, proveedores, tareas, reservas, pagos protegidos,
  moderación y verificaciones, todos con datos reales de la base.
- **Verificación de proveedor**: subida de documentos + revisión admin
  (aprobar/rechazar/pedir corrección).
- **Geolocalización**: botón GPS con `navigator.geolocation` en la creación de Tareas.

## Mock / Simulado

- **Mapa**: `MapPinSelectorMock` es un selector **visual**; no usa Google Maps ni una API de
  mapas real (no hay API key).
- **Pago protegido**: es un **sandbox contable** (`LedgerAccount`/`LedgerEntry`). No hay
  pasarela de pago ni movimiento de dinero real.

## TODO (próximos pasos)

- Almacenamiento en **S3/CDN** en lugar de disco local (TODO marcado en `MediaService`).
- Integración con **pasarela de pago** real para la liquidación.
- **Mapa real** con API key (Google Maps u OpenStreetMap) reemplazando el mock.
- Notificaciones (correo/push) en cambios de estado de reservas y verificaciones.
- Disputas: el estado `DISPUTED`/`REFUNDED` existe en el modelo pero falta UI/flujo completo.
- Usuario "sistema" para `ModerationFlag.reporterId` en detecciones automáticas.
