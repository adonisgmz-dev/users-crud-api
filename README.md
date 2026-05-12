# CRUD USERS API

Una API REST de gestión de usuarios CRUD desarrollada con Node.js y Express.

## FUNCIONES

- Crear usuario (registro)
- Obtener usuarios
- Actualizar usuario
- Eliminar usuario
- Validaciones de datos
- Hash de contraseñas
- Login con JWT
- Roles y permisos

## ENDPOINTS

- POST /users
- POST /login
- GET /users
- GET /users/:id
- PUT /users/:id
- DELETE /users/:id

## MEJORAS  Y SEGURIDAD IMPLEMENTADAS

- Refactor a arquitectura profesional por capas (routes, controllers, services, middlewares, data, constants)
- Sistema de autenticación con JWT usando cookies httpOnly
- Protección de rutas privadas y control de acceso
- Sistema de roles y permisos centralizado
- Seguridad en endpoints (protección contra accesos no autorizados e IDOR)
- Hash de contraseñas con bcrypt
- Validación básica de datos en usuarios
- Control de intentos de login y bloqueo temporal
- Validación avanzada con Zod
- Middleware global de manejo de errores
- Sanitización de respuestas (no exponer datos sensibles)
- Migración a PostgreSQL + Prisma
- Uso de UUIDs para IDs no predecibles
- Seguridad adicional (helmet, cors, rate limit)
- Logging de errores y requests

## PROXIMAS MEJORAS

- Frontend básico con HTML/CSS/JS
- Deploy de la API
- Docker y CI/CD
- Refresh Tokens

## ARQUITECTURA

```txt
src/
├── controllers/
├── routes/
├── services/
├── middlewares/
├── schemas/
├── constants/
├── config/
├── utils/

tests/
├── auth/
├── users/

prisma/

app.js
server.js
```

## COMO EJECUTARLO

```bash
npm install
npm run dev
```
