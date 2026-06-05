# Arquitectura

Proxi usa un monorepo con pnpm y Turborepo. Las apps se despliegan como unidades separadas y consumen paquetes compartidos cuando necesitan contratos, UI, configuracion o utilidades comunes.

## Frontends

Los frontends son cuatro apps Next.js independientes:

- Cliente: `@proxi/frontend-cliente`
- Proveedor: `@proxi/frontend-proveedor`
- Admin: `@proxi/frontend-admin`
- Landing: `@proxi/frontend-landing`

Cada frontend mantiene sus rutas, componentes, hooks, servicios, tipos y configuracion en su propia carpeta.

## Backend

El backend es una sola app NestJS:

- API: `@proxi/backend-api`

No existen backends separados para cliente, proveedor o admin. La separacion por dominio se hace dentro de modulos de la API.

## Paquetes compartidos

Los paquetes en `packages` son el punto permitido para reutilizacion transversal. Si dos apps necesitan el mismo contrato o componente, debe vivir en un paquete compartido, no duplicarse como dependencia directa entre apps.
