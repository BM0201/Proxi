/**
 * Enums de Herramientas, Materiales y Tiendas (Sprint 2).
 *
 * Regla oficial de Proxi: el Proveedor independiente NO compra materiales por
 * defecto. El Cliente compra los materiales. El Proveedor puede crear una
 * Lista Proxi de materiales que el Cliente debe comprar antes del servicio.
 */

/**
 * Quién aporta las herramientas necesarias para la Tarea.
 */
export enum ToolRequirement {
  CLIENT_PROVIDES_TOOLS = 'CLIENT_PROVIDES_TOOLS',
  PROVIDER_BRINGS_TOOLS = 'PROVIDER_BRINGS_TOOLS',
  NO_TOOLS_REQUIRED = 'NO_TOOLS_REQUIRED',
}

/**
 * Responsabilidad sobre los materiales declarada por el Cliente al crear la Tarea.
 */
export enum MaterialResponsibility {
  CLIENT_ALREADY_HAS_MATERIALS = 'CLIENT_ALREADY_HAS_MATERIALS',
  CLIENT_NEEDS_PURCHASE_LIST = 'CLIENT_NEEDS_PURCHASE_LIST',
  NEEDS_DIAGNOSIS_FIRST = 'NEEDS_DIAGNOSIS_FIRST',
  NO_MATERIALS_REQUIRED = 'NO_MATERIALS_REQUIRED',
}

/**
 * Estado de los materiales de una Tarea / Lista Proxi.
 */
export enum MaterialStatus {
  NO_MATERIALS_REQUIRED = 'NO_MATERIALS_REQUIRED',
  CLIENT_ALREADY_HAS_MATERIALS = 'CLIENT_ALREADY_HAS_MATERIALS',
  PURCHASE_LIST_PENDING_PROVIDER = 'PURCHASE_LIST_PENDING_PROVIDER',
  PURCHASE_LIST_SENT = 'PURCHASE_LIST_SENT',
  CLIENT_BUYING_MATERIALS = 'CLIENT_BUYING_MATERIALS',
  MATERIALS_READY = 'MATERIALS_READY',
  MATERIALS_INCORRECT = 'MATERIALS_INCORRECT',
  MISSING_MATERIALS = 'MISSING_MATERIALS',
  NEEDS_UPDATE = 'NEEDS_UPDATE',
}

/**
 * Prioridad de un ítem dentro de una Lista Proxi.
 */
export enum MaterialItemPriority {
  REQUIRED = 'REQUIRED',
  OPTIONAL = 'OPTIONAL',
  RECOMMENDED = 'RECOMMENDED',
  ALTERNATIVE = 'ALTERNATIVE',
}

/**
 * Tipo de tienda/ferretería sugerida.
 */
export enum StoreType {
  HARDWARE_STORE = 'HARDWARE_STORE',
  HOME_IMPROVEMENT = 'HOME_IMPROVEMENT',
  ELECTRICAL_SUPPLY = 'ELECTRICAL_SUPPLY',
  PLUMBING_SUPPLY = 'PLUMBING_SUPPLY',
  PAINT_STORE = 'PAINT_STORE',
  GENERAL_STORE = 'GENERAL_STORE',
  OTHER = 'OTHER',
}
