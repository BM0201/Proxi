# Reglas de reputación, niveles y confianza (Sprint 1)

> Terminología legal de Proxi (Nicaragua): trabajamos con **Clientes** y
> **Proveedores independientes**. Nunca usamos términos laborales (empleado,
> salario, jefe, nómina, jornada, despido). El nivel y la confianza reflejan
> únicamente el historial de cada persona dentro de la plataforma, no una
> relación de subordinación.

Este documento describe el modelo de reputación implementado en el Sprint 1:
**niveles**, **puntaje de confianza (trustScore)**, **estado de confianza
(trustStatus)** y **eventos de reputación**.

---

## 1. Niveles del Proveedor independiente

El nivel se calcula de forma determinista a partir de la verificación de
identidad, las Tareas completadas y el promedio de valoraciones.

| Nivel | Clave | Requisitos | Etiqueta |
|------|-------|-----------|----------|
| 0 | `LEVEL_0_NEW` | Sin verificar o 0 Tareas completadas | Nuevo |
| 1 | `LEVEL_1_VERIFIED` | Verificado (identidad aprobada) | Verificado |
| 2 | `LEVEL_2_TRUSTED` | Verificado + ≥ 10 Tareas + valoración ≥ 4.3 | De confianza |
| 3 | `LEVEL_3_GOLD` | Verificado + ≥ 50 Tareas + valoración ≥ 4.7 | Oro |
| 4 | `LEVEL_4_PLATINUM` | Verificado + ≥ 150 Tareas + valoración ≥ 4.8 | Platino |
| 5 | `LEVEL_5_DIAMOND` | Verificado + ≥ 300 Tareas + valoración ≥ 4.9 | Diamante |

> El cálculo vive en `apps/backend-api/src/modules/reputation/helpers/level-calculator.ts`
> (`calculateProviderLevel`).

## 2. Niveles del Cliente

| Nivel | Clave | Requisitos | Etiqueta |
|------|-------|-----------|----------|
| 0 | `CLIENT_0_NEW` | Recién registrado | Nuevo |
| 1 | `CLIENT_1_VERIFIED` | Verificado o ≥ 3 Tareas completadas | Verificado |
| 2 | `CLIENT_2_TRUSTED` | ≥ 10 Tareas completadas y ≤ 5 cancelaciones | De confianza |
| 3 | `CLIENT_3_GOLD` | ≥ 30 Tareas completadas y ≤ 3 cancelaciones | Oro |

> El cálculo vive en el mismo archivo (`calculateClientLevel`).

---

## 3. Puntaje de confianza (trustScore)

- Rango: **0 a 100**. Valor inicial: **70**.
- Cada evento de reputación suma o resta puntos al `trustScore`.
- El puntaje se mantiene acotado al rango con `clampTrustScore`.

### Impacto por tipo de evento

| Evento | Clave | Impacto |
|--------|-------|--------:|
| Tarea completada | `TASK_COMPLETED` | +2 |
| Buena reseña | `GOOD_REVIEW` | +3 |
| Mala reseña | `BAD_REVIEW` | -5 |
| Cancelación tardía | `LATE_CANCELLATION` | -4 |
| Cancelación el mismo día | `SAME_DAY_CANCELLATION` | -8 |
| Ausencia (no se presentó) | `NO_SHOW` | -15 |
| Tarea abandonada | `ABANDONED_TASK` | -20 |
| Tarea incompleta | `INCOMPLETE_TASK` | -10 |
| Intento de contacto externo | `EXTERNAL_CONTACT_ATTEMPT` | -15 |
| Intento de pago externo | `EXTERNAL_PAYMENT_ATTEMPT` | -25 |
| Inactividad silenciosa | `INACTIVITY_SILENT` | -3 |
| Ajuste manual de administración | `MANUAL_ADMIN_ADJUSTMENT` | variable |

> Los valores por defecto viven en
> `apps/backend-api/src/modules/reputation/helpers/trust-score-calculator.ts`
> (`TRUST_EVENT_IMPACT`).

---

## 4. Estado de confianza (trustStatus)

El estado se deriva del `trustScore`:

| Rango de puntaje | Estado | Clave | Efecto |
|------------------|--------|-------|--------|
| 60 – 100 | Normal | `NORMAL` | Operación plena |
| 40 – 59 | En observación | `WATCHLIST` | Operación plena, bajo monitoreo |
| 20 – 39 | Restringido | `RESTRICTED` | No puede tomar Tareas rápidas |
| 1 – 19 | Suspendido | `SUSPENDED` | Operación bloqueada temporalmente |
| 0 | Bloqueado | `BANNED` | Sin acceso operativo |

---

## 5. Eventos de reputación

Cada evento se guarda en la tabla `ReputationEvent` con: usuario, rol,
tipo de evento, impacto en el puntaje, motivo y referencias opcionales a la
Tarea o reserva relacionada.

Al registrar un evento (`createReputationEvent`), el backend:

1. Crea el registro `ReputationEvent`.
2. Aplica el `scoreImpact` al `trustScore` del perfil correspondiente.
3. Recalcula el `trustStatus` y el `level`.

### Endpoints relacionados

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | `/api/reputation/user/:userId` | Público | Resumen de reputación de un usuario |
| GET | `/api/reputation/provider/:providerId` | Público | Resumen por id de perfil de Proveedor |
| GET | `/api/reputation/client/:clientId` | Público | Resumen por id de perfil de Cliente |
| GET | `/api/reputation/events/:userId` | Admin | Lista de eventos de un usuario |
| POST | `/api/reputation/events` | Admin | Registra un evento manual |

---

## 6. Estados de inactividad (InactivityStatus)

La inactividad **no** es una relación laboral: el Proveedor independiente
decide libremente su disponibilidad. Estados disponibles: `ACTIVE`,
`AVAILABLE`, `BUSY`, `PAUSED_VOLUNTARILY`, `VACATION_OR_OUT_OF_SERVICE`,
`INACTIVE_SILENT`, `REACTIVATION_REQUIRED`.

> En el Sprint 1 estos estados se modelan y exponen en el resumen de
> reputación. La automatización de transiciones por inactividad se aborda en
> sprints siguientes.
