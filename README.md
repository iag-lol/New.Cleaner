# Sistema de Registro de Aseo de Buses

Aplicación full-stack (React + TypeScript + Tailwind en frontend, Express + PostgreSQL en backend) para registrar aseos, gestionar tareas/mensajes y administrar horarios de colación para cleaners y supervisores.

## Estructura
- `backend/`: API REST en Node/Express, subida de imágenes a S3 (con fallback local).
- `frontend/`: SPA/PWA en React (Vite + Tailwind).

## Backend
1. Crea un archivo `.env` en `backend/` basado en `.env.example`.
2. Provisiona la base de datos PostgreSQL y ejecuta el esquema:
   ```bash
   cd backend
   psql \"$DATABASE_URL\" -f schema.sql
   npm install
   npm run dev   # nodemon + ts-node
   ```
3. Endpoints principales:
   - `POST /api/users` y `GET /api/users`
   - `POST /api/registrations` (multipart: `imageFront`, `imageBack`) y `GET /api/registrations`
   - `GET /api/registrations/recent/ppu?userId=...`
   - `POST /api/tasks`, `GET /api/tasks`, `PATCH /api/tasks/:id/complete`
   - `POST /api/breaks`, `GET /api/breaks`
   - `POST /api/inspections`, `GET /api/inspections`
   - `GET /api/dashboard/summary`, `GET /api/dashboard/cleaner/:id`
4. Subida de imágenes:
   - Con variables S3 configuradas se suben al bucket indicado.
   - Sin S3, se guardan en `backend/uploads` y se exponen vía `/uploads/...`.

## Frontend
1. Configura la URL de la API con `VITE_API_URL` (por defecto `http://localhost:4000`).
2. Instala y levanta:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. Funcionalidades clave:
   - **Pantalla inicial**: selección CLEANER/SUPERVISOR y nombre (persistencia en BD y localStorage, sugerencias de nombres existentes).
   - **Cleaner (móvil)**: header con nombre/cargo/colación, bottom nav, formulario de registro con fotos, lista de registros propios, tareas pendientes/realizadas con botón “Marcar realizada”.
   - **Supervisor (desktop)**: sidebar, dashboard, tabla de registros con filtros y detalle, informes por cleaner, fiscalizaciones, creación/listado de tareas, configuración de colaciones.
4. PWA: `manifest.webmanifest` y `public/sw.js` para soporte offline básico.

## Notas de diseño y UX
- Estilo limpio y corporativo con paleta en blancos y azules suaves.
- Tipografía `Plus Jakarta Sans`.
- Layout responsivo: bottom navigation para cleaners, sidebar para supervisores.

## Próximos pasos sugeridos
- Añadir autenticación ligera si se requiere control de acceso.
- Conectar un proveedor real de S3 y CDN para las imágenes.
- Incorporar pruebas E2E o unitarias para las rutas API y componentes críticos.
