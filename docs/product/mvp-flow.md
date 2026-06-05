# Flujo MVP

El MVP debe probar la verdad central de producto:

> Cuando alguien pregunte "¿Conocés a alguien que...?", la respuesta debe ser "Buscalo en Proxi."

## Ciclo inicial visible

1. Cliente entra al inicio y busca lo que necesita resolver.
2. Cliente elige una categoría o publica una tarea.
3. Cliente completa título, descripción, presupuesto, fecha, fotos y zona aproximada.
4. Proxi protege la dirección exacta hasta que exista oferta aceptada y pago protegido.
5. Proveedor independiente ve tareas disponibles.
6. Proveedor envía una oferta con precio, tiempo y condiciones.
7. Cliente compara ofertas por precio, nivel, estrellas, reseñas, trabajos completados y disponibilidad.
8. Cliente revisa el perfil público del proveedor sin ver teléfono, WhatsApp, correo ni dirección exacta.
9. Cliente acepta una oferta.
10. Cliente confirma un pago protegido mock.
11. Proxi muestra una reserva confirmada.
12. Cliente y proveedor coordinan dentro de Proxi en una futura versión.

## Flujo operativo posterior

1. Proveedor realiza el trabajo.
2. Proveedor sube evidencia.
3. Cliente confirma o abre reclamo.
4. Si no hay reclamo, el pago pasa a saldo aprobado.
5. Proxi liquida al proveedor según ciclo y nivel.
6. Cliente y proveedor califican.

## No construir todavía

- Pagos reales.
- Wallet real.
- Tracking en vivo tipo Uber.
- Chat real.
- Apps nativas.
- Subida real a S3.
- Nuevos endpoints backend.
- Migraciones Prisma para este sprint.

El flujo visible ya tiene una primera base funcional para auth, tareas, ubicaciones, ofertas y booking sandbox. Pagos reales, wallet, liquidaciones, chat y tracking siguen pendientes.
