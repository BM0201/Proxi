/**
 * Configuración de ESLint para las aplicaciones Next.js (App Router).
 */
module.exports = {
  extends: ['./index.js', 'next/core-web-vitals'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
  },
};
