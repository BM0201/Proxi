# Sprint: Next Functional Level

Este sprint llevó a Proxi del prototipo mayormente mockeado a un flujo funcional real de
extremo a extremo: autenticación con protección de rutas, subida real de archivos al
servidor, asociación de media a tareas/perfiles/reservas, detección automática anti-fuga,
flujo post-booking con pago protegido en sandbox, reseñas y panel de administración con
datos reales.

> **Terminología legal (Nicaragua).** Proxi conecta **Clientes** con **Proveedores
> independientes**. No existe relación laboral: no se usan los términos *empleado*,
> *salario* ni *jefe*. Los conceptos clave son **Tarea**, **Oferta**, **Pago protegido**,
> **Saldo aprobado**, **Liquidación**, **Verificación** y **Dirección exacta protegida**.

## Documentos de este sprint

- [`setup-local.md`](./setup-local.md) — instalación, base de datos, seed y arranque.
- [`auth-and-route-protection.md`](./auth-and-route-protection.md) — login, roles, guardas y logout.
- [`media-uploads.md`](./media-uploads.md) — subida local real (Multer) y asociaciones.
- [`anti-leak-moderation.md`](./anti-leak-moderation.md) — detección anti-fuga y moderación.
- [`booking-and-reviews.md`](./booking-and-reviews.md) — flujo post-booking, pago protegido y reseñas.
- [`mock-vs-real.md`](./mock-vs-real.md) — qué es real y qué sigue siendo mock/TODO.

## Puertos

| App | URL |
| --- | --- |
| Cliente | `http://localhost:3100` |
| Proveedor | `http://localhost:3101` |
| Admin | `http://localhost:3102` |
| Landing | `http://localhost:3103` |
| API | `http://localhost:4000/api` |
| Swagger | `http://localhost:4000/api/docs` |

> **Nota sobre localhost.** Cuando el equipo de Proxi ejecuta esto en una VM compartida,
> `localhost` se refiere a la máquina del agente/servidor, no a la computadora del usuario
> final. Para uso local, descargá los archivos y desplegá el proyecto en tu propia máquina.
