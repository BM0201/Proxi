# Herramientas y Materiales (Sprint 2)

> Terminología legal de Proxi (Nicaragua): una **Tarea** es un trabajo puntual
> publicado por un **Cliente** y ejecutado por un **Proveedor independiente**.
> No existe relación laboral ni de subordinación. Las **Herramientas** son del
> Proveedor; los **Materiales** los compra el Cliente.

## Regla oficial de Proxi sobre materiales

> **El Proveedor independiente NO compra los materiales por defecto.**
> El **Cliente** compra los materiales. Cuando hace falta, el Proveedor arma una
> **Lista Proxi** con los materiales que el Cliente debe comprar **antes** del
> servicio. Proxi puede sugerir ferreterías/tiendas cercanas para esa compra.

Esto evita confusiones, reembolsos complicados y disputas: el dinero del Cliente
para materiales no pasa por el Proveedor. El **Pago protegido** cubre el precio
del servicio (mano de obra), no los materiales.

---

## 1. Herramientas (`ProviderTool`)

Las **Herramientas** son propiedad del Proveedor independiente: taladro,
escalera, llaves, martillo, nivel, carro de carga, etc. **No son materiales.**

Cada Proveedor declara sus herramientas para dar más confianza al Cliente. El
modelo `ProviderTool` guarda:

| Campo | Descripción |
|-------|-------------|
| `name` | Nombre de la herramienta (ej. "Taladro percutor"). |
| `category` | Categoría opcional (Eléctrica, Manual, Medición, etc.). |
| `description` | Detalle opcional (marca, capacidad…). |
| `isVerified` | Si Proxi verificó que el Proveedor realmente la tiene. |

### Endpoints de herramientas

| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| `POST` | `/tools` | Proveedor | Crear una herramienta. |
| `GET` | `/tools/my-tools` | Proveedor | Listar mis herramientas. |
| `GET` | `/tools/provider/:providerId` | Todos | Herramientas públicas de un Proveedor. |
| `PUT` | `/tools/:id` | Proveedor | Actualizar una herramienta propia. |
| `DELETE` | `/tools/:id` | Proveedor | Eliminar una herramienta propia. |

### Requerimiento de herramientas en la Tarea (`Task.toolRequirement`)

El Cliente indica al publicar la Tarea quién aporta las herramientas:

| Valor | Significado |
|-------|-------------|
| `NO_TOOLS_REQUIRED` | No se requieren herramientas. |
| `PROVIDER_BRINGS_TOOLS` | El Proveedor trae sus herramientas. |
| `CLIENT_PROVIDES_TOOLS` | El Cliente aporta las herramientas. |

---

## 2. Responsabilidad de materiales (`Task.materialResponsibility`)

El Cliente declara, al publicar la Tarea, cómo se manejan los materiales:

| Valor | Significado |
|-------|-------------|
| `NO_MATERIALS_REQUIRED` | El trabajo no necesita materiales. |
| `CLIENT_ALREADY_HAS_MATERIALS` | El Cliente ya tiene los materiales. |
| `CLIENT_NEEDS_PURCHASE_LIST` | El Proveedor arma una **Lista Proxi** y el Cliente compra. |
| `NEEDS_DIAGNOSIS_FIRST` | Primero hace falta un diagnóstico; la lista se arma después. |

A partir de este valor, Proxi deriva el **estado inicial de materiales**
(`Task.materialStatus`).

---

## 3. Estado de materiales (`Task.materialStatus` / `PurchaseList.status`)

| Estado | Significado |
|--------|-------------|
| `NO_MATERIALS_REQUIRED` | Sin materiales. |
| `CLIENT_ALREADY_HAS_MATERIALS` | El Cliente ya los tiene. |
| `PURCHASE_LIST_PENDING_PROVIDER` | Falta que el Proveedor arme la Lista Proxi. |
| `PURCHASE_LIST_SENT` | La Lista Proxi fue enviada al Cliente. |
| `CLIENT_BUYING_MATERIALS` | El Cliente está comprando. |
| `MATERIALS_READY` | El Cliente confirmó que los materiales están listos. |
| `MATERIALS_INCORRECT` | El Cliente reportó materiales incorrectos. |
| `MISSING_MATERIALS` | Faltan materiales. |
| `NEEDS_UPDATE` | La lista requiere actualización (ej. tras diagnóstico). |

---

## 4. Lista Proxi (`PurchaseList` + `PurchaseListItem`)

La **Lista Proxi** es la lista de materiales que el Proveedor arma para que el
Cliente la compre. Hay **una Lista Proxi por Tarea** (`taskId` único).

Cada ítem (`PurchaseListItem`) tiene:

| Campo | Descripción |
|-------|-------------|
| `name` | Material (ej. "Cable eléctrico THHN #12"). |
| `quantity` + `unit` | Cantidad y unidad (3 metros, 1 unidad, 1 galón…). |
| `specification` | Detalle (marca, color, calibre…). |
| `priority` | `REQUIRED`, `RECOMMENDED`, `OPTIONAL`, `ALTERNATIVE`. |
| `estimatedPriceMin` / `estimatedPriceMax` | Rango estimado en Córdobas (C$). |
| `notes` | Notas para el Cliente. |

### Endpoints de materiales

| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| `POST` | `/materials/purchase-lists` | Proveedor | Crear la Lista Proxi de una Tarea. |
| `GET` | `/materials/purchase-lists/task/:taskId` | Cliente/Proveedor | Ver la Lista Proxi de una Tarea. |
| `POST` | `/materials/purchase-lists/:id/items` | Proveedor | Agregar un material. |
| `PUT` | `/materials/purchase-lists/:id/items/:itemId` | Proveedor | Editar un material. |
| `DELETE` | `/materials/purchase-lists/:id/items/:itemId` | Proveedor | Quitar un material. |
| `PATCH` | `/materials/tasks/:taskId/status` | Cliente | Marcar materiales listos / incorrectos. |
| `GET` | `/materials/purchase-lists/:id/stores` | Cliente/Proveedor | Tiendas sugeridas para la lista. |

---

## 5. Tiendas y ferreterías (`PartnerStore` + `PurchaseListStoreSuggestion`)

Para facilitar la compra, Proxi sugiere **tiendas/ferreterías** donde el Cliente
puede comprar los materiales. Las tiendas **patrocinadas** se destacan primero.

`PartnerStore` guarda tipo (`StoreType`: ferretería, mejoras del hogar,
materiales eléctricos, fontanería, pinturería, etc.), ubicación aproximada
(departamento, ciudad, zona, coordenadas) y si es patrocinada (`isSponsored`).

### Endpoints de tiendas

| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| `POST` | `/partner-stores` | Admin | Crear una tienda. |
| `GET` | `/partner-stores` | Todos | Listar tiendas activas. |
| `GET` | `/partner-stores/nearby?lat&lng&radiusKm` | Todos | Tiendas cercanas (orden: patrocinadas primero, luego por distancia). |
| `PUT` | `/partner-stores/:id` | Admin | Actualizar una tienda. |

> El mapa de tiendas en el frontend es un **selector visual mock**
> (`MapPinSelectorMock`). No usa la API de Google Maps ni GPS en tiempo real.

---

## 6. Flujo completo (resumen)

1. El **Cliente** publica una Tarea y elige `materialResponsibility`.
2. Si es `CLIENT_NEEDS_PURCHASE_LIST`, el **Proveedor** arma la **Lista Proxi**.
3. Proxi muestra al Cliente la lista + **tiendas sugeridas** (patrocinadas primero).
4. El **Cliente compra** los materiales (el Proveedor NO los compra).
5. El Cliente marca **"materiales listos"** o reporta **"materiales incorrectos"**.
6. Con los materiales listos, el servicio puede ejecutarse.

> Pendiente para próximos sprints: integración con el flujo de booking/pago
> protegido para condicionar el inicio del servicio al estado `MATERIALS_READY`,
> y comisiones/acuerdos con tiendas patrocinadas.
