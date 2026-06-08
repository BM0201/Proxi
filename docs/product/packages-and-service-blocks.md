# Proyectos por paquete y Bloques de servicio (Sprint 2)

> Terminología legal de Proxi (Nicaragua): un **Proyecto por paquete** es una
> **Tarea** grande (de varios días) que un **Cliente** acuerda con un
> **Proveedor independiente**. Cada día de trabajo es un **Bloque de servicio
> acordado**. No es jornada laboral, turno obligatorio ni relación de empleo:
> es un acuerdo entre partes independientes.

## 1. Proyecto por paquete (`PackageProject`)

Cuando una Tarea supera **1 día** (1440 minutos), deja de ser una Tarea estándar
y se modela como **Proyecto por paquete** (`Task.taskType = PACKAGE_PROJECT`).

Ejemplos: remodelación de baño, pintura de casa completa, instalación eléctrica
de varios ambientes.

El modelo `PackageProject` guarda:

| Campo | Descripción |
|-------|-------------|
| `taskId` | Tarea asociada (relación 1:1). |
| `clientId` | Cliente dueño del proyecto. |
| `providerId` | Proveedor independiente acordado (opcional al inicio). |
| `title` / `description` | Resumen del proyecto. |
| `totalDays` | Cantidad de días acordados. |
| `estimatedStartDate` / `estimatedEndDate` | Fechas estimadas. |
| `totalPrice` | Precio total estimado en Córdobas (C$). |
| `status` | `DRAFT`, etc. (estados se ampliarán en próximos sprints). |

---

## 2. Bloque de servicio acordado (`ServiceBlock`)

Cada **Bloque de servicio acordado** representa un día (o franja) de trabajo
dentro del proyecto. **No es un turno obligatorio**: es un acuerdo entre el
Cliente y el Proveedor independiente sobre cuándo se ejecutará parte del trabajo.

| Campo | Descripción |
|-------|-------------|
| `date` | Fecha del bloque. |
| `startTime` / `endTime` | Hora de inicio y fin (formato `HH:mm`). |
| `status` | `SCHEDULED`, etc. |
| `checkInAt` / `checkOutAt` | Marca de llegada/salida (básico en Sprint 2). |
| `providerPresenceStatus` | Estado de presencia del Proveedor. |
| `clientConfirmationStatus` | Confirmación del Cliente para el bloque. |
| `notes` | Detalle del trabajo de ese bloque. |

> **Check-in / check-out:** en Sprint 2 es **básico** (solo se guardan las marcas
> de tiempo). La lógica completa de presencia, confirmación del Cliente,
> evidencia y liberación parcial de pago protegido por bloque llega en
> **Sprint 3**.

---

## 3. Endpoints de paquetes

| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| `POST` | `/packages` | Cliente | Crear un Proyecto por paquete (marca la Tarea como `PACKAGE_PROJECT`). |
| `GET` | `/packages/:id` | Todos | Ver un proyecto con sus bloques de servicio. |
| `POST` | `/packages/:id/blocks` | Cliente | Agregar un Bloque de servicio acordado. |

---

## 4. Relación con materiales

Un Proyecto por paquete suele necesitar materiales. Se aplica la **misma regla
oficial de Proxi**: el Proveedor **no compra** los materiales; arma una
**Lista Proxi** y el **Cliente compra** (ver `materials-and-tools.md`).

---

## 5. Ejemplo demo (seed)

El seed incluye el proyecto **"Remodelación de baño"** (3 días) con 3 bloques de
servicio acordados:

1. **Día 1** (08:00–16:00): demolición de azulejos viejos y preparación.
2. **Día 2** (08:00–17:00): instalación de azulejos nuevos y montaje del sanitario.
3. **Día 3** (09:00–15:00): acabados, sellado y pintura final.

---

## 6. Próximos pasos (Sprint 3)

- Check-in/check-out completo por bloque con evidencia.
- Confirmación del Cliente por bloque y liberación parcial del Pago protegido.
- Estados de avance del proyecto y del proveedor.
- Reprogramación de bloques acordados entre las partes.
