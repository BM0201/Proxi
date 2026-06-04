# @proxi/tsconfig

Configuraciones base de TypeScript compartidas para todo el monorepo Proxi.

## Configuraciones disponibles

- `base.json`: configuración base con `strict` activado para cualquier paquete.
- `nestjs.json`: configuración para la API NestJS (decoradores, CommonJS).
- `nextjs.json`: configuración para las apps Next.js (App Router).
- `react-library.json`: configuración para librerías React (ej. `@proxi/ui`).

## Uso

```json
{
  "extends": "@proxi/tsconfig/base.json"
}
```
