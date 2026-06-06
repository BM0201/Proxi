/**
 * Enums de tipos de Tarea y modos de Tarea rápida.
 */

/**
 * Tipo de Tarea en Proxi.
 * - QUICK_TASK: Tarea rápida (corta duración, aceptación directa o subasta rápida).
 * - STANDARD_TASK: Tarea estándar con ofertas (duración hasta 1 día).
 * - PACKAGE_PROJECT: Proyecto por paquete / varios días (Próximamente, Sprint 2).
 */
export enum TaskType {
  QUICK_TASK = 'QUICK_TASK',
  STANDARD_TASK = 'STANDARD_TASK',
  PACKAGE_PROJECT = 'PACKAGE_PROJECT',
}

/**
 * Modo de una Tarea rápida.
 * - DIRECT_ACCEPT: el primer Proveedor elegible que acepte toma la Tarea.
 * - QUICK_AUCTION: subasta rápida con varias Ofertas en una ventana corta.
 */
export enum QuickTaskMode {
  DIRECT_ACCEPT = 'DIRECT_ACCEPT',
  QUICK_AUCTION = 'QUICK_AUCTION',
}
