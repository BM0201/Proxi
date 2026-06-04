/**
 * Configuración de ESLint para librerías y componentes React.
 */
module.exports = {
  extends: ['./index.js'],
  env: {
    browser: true,
    node: true,
  },
  settings: {
    react: { version: 'detect' },
  },
};
