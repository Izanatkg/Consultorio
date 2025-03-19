# Consultorio v2

Sistema de gestión para consultorios médicos con autenticación y base de datos MongoDB Atlas.

## Configuración

### Backend (Puerto 5001)
```bash
cd backend
npm install
# Crear archivo .env con las siguientes variables:
# PORT=5001
# MONGODB_URI=mongodb+srv://[usuario]:[contraseña]@cluster0.flog9.mongodb.net/consultorio-v2
# JWT_SECRET=[tu_secreto_jwt]
npm run dev
```

### Frontend (Puerto 3005)
```bash
cd frontend
npm install
npm run dev
```

## Características

- Autenticación con JWT
- Dashboard con estadísticas
- Gestión de pacientes:
  - Registro completo con datos personales y médicos
  - Listado con filtros
  - Edición y eliminación
- Interfaz moderna con Material-UI
- Diseño responsivo

## Estructura del Proyecto

```
consultorio-v2/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── store/
    │   └── config/
    └── package.json
```

## Tecnologías

- Backend:
  - Node.js
  - Express
  - MongoDB Atlas
  - JWT

- Frontend:
  - React
  - TypeScript
  - Material-UI
  - Redux Toolkit
  - React Router v6
