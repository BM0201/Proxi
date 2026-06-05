# Sistema UI compartido

`packages/ui` contiene componentes visuales genericos y reutilizables para las apps web de Proxi.

## Que vive en `packages/ui`

- Primitives visuales sin logica de negocio.
- Componentes basicos reutilizables como `Button`, `Card`, `Badge`, `PageHeader`, `EmptyState`, `StatCard`, `StatusPill`, campos de formulario, tablas simples, tabs y badges visuales.
- Estados visuales genericos que pueden ser usados por cliente, proveedor, admin y landing.

## Que no debe vivir en `packages/ui`

- Logica de auth, pagos, liquidaciones, permisos o reglas de negocio.
- Componentes que conozcan rutas internas de una app.
- Componentes especificos de cliente, proveedor, admin o landing.
- Integraciones con API, Prisma, backend o datos reales.

## Como importar

```tsx
import { Button, Card, PageHeader } from '@proxi/ui';
```

Los frontends no deben importar componentes desde otra app. Si un componente basico se repite en dos o mas frontends, debe evaluarse moverlo a `packages/ui`.

## Reglas

- No duplicar componentes basicos entre frontends.
- No meter logica de negocio en UI compartida.
- Mantener `packages/ui` como libreria generica de presentacion.
- Mantener la identidad visual y pantallas especificas dentro de cada frontend.
- Si un componente necesita datos reales o decisiones de dominio, debe vivir en la app correspondiente o en una capa de dominio, no en `packages/ui`.
