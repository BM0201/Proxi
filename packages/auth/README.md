# @proxi/auth

Utilidades de autenticación compartidas (preparado para JWT):

- `hashPassword` / `verifyPassword`: hashing de contraseñas con bcrypt.
- `signToken` / `verifyToken`: emisión y verificación de JWT.
- `extractBearerToken`: extrae el token del header `Authorization`.

La integración con NestJS (guards, estrategias Passport) vive en el módulo
`auth` de la API.
