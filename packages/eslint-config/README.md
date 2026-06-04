# @proxi/eslint-config

Configuraciones de ESLint compartidas para el monorepo Proxi.

- `index.js`: base para TypeScript.
- `nest.js`: para la API NestJS.
- `react.js`: para librerías React.
- `next.js`: para apps Next.js.

## Uso

```js
// .eslintrc.js
module.exports = { extends: ['@proxi/eslint-config/nest'] };
```
