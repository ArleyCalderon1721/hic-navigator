# HIC Navigator

Una aplicación web para navegación en el Hospital Internacional de Colombia (HIC), que permite a los usuarios encontrar rutas visuales entre diferentes ubicaciones del hospital.

## Características

- Navegación visual con videos de rutas
- Interfaz intuitiva para seleccionar origen y destino
- API REST para datos de ubicaciones y rutas
- Despliegue fácil en Render

## Tecnologías

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express
- **Base de datos**: PostgreSQL
- **Despliegue**: Render

## Instalación y desarrollo local

### Prerrequisitos

- Node.js (versión 18 o superior)
- PostgreSQL

### Configuración

1. Clona el repositorio
2. Instala dependencias del frontend:
   ```bash
   npm install
   ```
3. Instala dependencias del backend:
   ```bash
   cd server
   npm install
   cd ..
   ```
4. Configura la base de datos PostgreSQL ejecutando el script `db/postgres_setup.sql`
5. Crea un archivo `.env` basado en `.env.example` con tu configuración de base de datos

### Desarrollo

Para ejecutar en modo desarrollo:
```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
npm run dev
```

## Despliegue en Render

### 1. Preparar la base de datos

1. Crea una base de datos PostgreSQL en Render
2. Ejecuta el script `db/postgres_setup.sql` en tu base de datos

### 2. Desplegar la aplicación

1. Conecta tu repositorio de GitHub a Render
2. Crea un nuevo servicio web usando el archivo `render.yaml` incluido
3. Render detectará automáticamente la configuración
4. Asegúrate de que la variable de entorno `DATABASE_URL` esté configurada (Render la proporciona automáticamente para bases de datos PostgreSQL)
5. Despliega

### Variables de entorno

Render configura automáticamente:
- `DATABASE_URL`: URL de conexión a PostgreSQL
- `NODE_ENV`: `production`

### Archivos importantes para el despliegue

- `render.yaml`: Configuración de despliegue para Render
- `db/postgres_setup.sql`: Script de inicialización de la base de datos
- `.env.example`: Variables de entorno de ejemplo

## Estructura del proyecto

```
├── db/                 # Scripts de base de datos
├── public/            # Archivos estáticos
│   └── videos/        # Videos de rutas
├── server/            # Backend Node.js
│   ├── server.js      # Servidor Express
│   └── package.json
├── src/               # Frontend React
│   ├── components/    # Componentes
│   ├── pages/         # Páginas
│   └── ...
├── .env.example       # Variables de entorno de ejemplo
└── package.json       # Dependencias del frontend
```

## API Endpoints

- `GET /api/locations` - Lista todas las ubicaciones
- `GET /api/locations/:id` - Detalles de una ubicación
- `GET /api/routes/:originId/:destinationId` - Ruta entre dos ubicaciones
- `GET /api/health` - Health check

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
