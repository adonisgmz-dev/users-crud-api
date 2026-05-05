# CRUD USERS API

Una API REST de gestión de usuarios CRUD desarrollada con Node.js y Express.

## FUNCIONES

- Crear usuario (registro)
- Obtener usuarios
- Actualizar usuario
- Eliminar usuario
- Validaciones de datos
- Hash de contraseñas

## ENDPOINTS

- POST /users
- GET /users
- PUT /users/:id
- DELETE /users/:id

## MEJORAS IMPLEMENTADAS

- Refactor a arquitectura profesional por capas (routes, controllers, services, middlewares, data, constants)
- Sistema de autenticación con JWT usando cookies httpOnly
- Protección de rutas privadas y control de acceso
- Sistema de roles y permisos centralizado
- Seguridad en endpoints (protección contra accesos no autorizados e IDOR)
- Hash de contraseñas con bcrypt
- Validación básica de datos en usuarios
- Control de intentos de login y bloqueo temporal

## PROXIMAS MEJORAS

- Validación avanzada con Zod
- Middleware global de manejo de errores
- Sanitización de respuestas (no exponer password)
- Migración a PostgreSQL + Prisma
- Uso de UUIDs para IDs no predecibles
- Seguridad adicional (helmet, cors, rate limit)
- Logging de errores y requests
- Tests automatizados

## COMO EJECUTARLO

```bash
npm install
npm run dev
```
