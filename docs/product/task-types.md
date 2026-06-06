# Tipos de Tarea (Sprint 1)

> Terminología legal de Proxi (Nicaragua): una **Tarea** es un trabajo puntual
> publicado por un **Cliente** y ejecutado por un **Proveedor independiente**.
> No existe relación laboral ni de subordinación.

Proxi soporta tres tipos de Tarea. El tipo se guarda en `Task.taskType`.

| Tipo | Clave | Estado en Sprint 1 |
|------|-------|--------------------|
| Tarea rápida | `QUICK_TASK` | ✅ Disponible |
| Tarea estándar | `STANDARD_TASK` | ✅ Disponible (por defecto) |
| Proyecto por paquete | `PACKAGE_PROJECT` | 🔒 Próximamente (Sprint 2) |

---

## 1. Tarea rápida (`QUICK_TASK`)

Trabajo de **corta duración** (máximo **1 día = 1440 minutos**) que se resuelve
de forma ágil. Se notifica a los Proveedores independientes elegibles dentro de
un **radio de cobertura** (`radiusKm`).

Tiene dos modos (`quickTaskMode`):

- **Aceptación directa (`DIRECT_ACCEPT`)**: el primer Proveedor elegible que
  acepte toma la Tarea.
- **Subasta rápida (`QUICK_AUCTION`)**: el Cliente recibe varias Ofertas en una
  ventana corta de tiempo y elige.

### Filtros de elegibilidad

Una Tarea rápida puede exigir requisitos mínimos al Proveedor:

- `minProviderRating`: valoración mínima (0 – 5).
- `minProviderTrustScore`: puntaje de confianza mínimo (0 – 100).
- El estado de confianza del Proveedor debe ser operativo (no `RESTRICTED`,
  `SUSPENDED` ni `BANNED`).

La validación vive en `QuickTasksService.checkEligibility`.

### Endpoints

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| POST | `/api/quick-tasks` | Cliente | Crea una Tarea rápida |
| GET | `/api/quick-tasks/available` | Proveedor / Admin | Tareas rápidas elegibles |
| GET | `/api/quick-tasks/:id` | Cliente / Proveedor / Admin | Detalle + elegibilidad |

---

## 2. Tarea estándar (`STANDARD_TASK`)

Es el tipo **por defecto**. El Cliente publica la Tarea y recibe **Ofertas** de
varios Proveedores independientes. Pensada para trabajos de **hasta 1 día**.

- Si se envía `estimatedDurationMinutes` mayor a 1440, el backend rechaza la
  creación y sugiere usar un proyecto por paquete (Próximamente).
- Se crea con el endpoint existente `POST /api/tasks` (campo `taskType`
  opcional; por defecto `STANDARD_TASK`).

---

## 3. Proyecto por paquete (`PACKAGE_PROJECT`) — Próximamente

Trabajos de **varios días** organizados por etapas o entregables. En el
Sprint 1 está **deshabilitado**:

- En el frontend del Cliente, la opción aparece como **"Próximamente"** y no es
  seleccionable.
- En el backend, `POST /api/tasks` con `taskType = PACKAGE_PROJECT` devuelve un
  error indicando que estará disponible próximamente.

Se implementará por completo en el Sprint 2.

---

## 4. Selector de tipo en el frontend del Cliente

El componente `TaskTypeSelector`
(`apps/frontend-cliente/components/TaskTypeSelector.tsx`) muestra las tres
opciones. Al elegir **Tarea rápida** se habilitan campos adicionales: modo,
duración estimada y radio de cobertura. El formulario envía a `/quick-tasks` o
a `/tasks` según el tipo seleccionado.
