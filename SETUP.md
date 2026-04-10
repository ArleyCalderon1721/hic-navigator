# HIC Navigator - Guía de Ejecución

## 📋 Requisitos
- Node.js v16+ instalado
- npm
- Acceso a la BD MySQL: `b7qmfmqoaqw4ncxscdio` en `b7qmfmqoaqw4ncxscdio-mysql.services.clever-cloud.com`

## 🚀 Inicio Rápido

### 1. Instalar dependencias del Frontend
```bash
npm install
```

### 2. Instalar dependencias del Servidor (API)
```bash
cd server
npm install
cd ..
```

### 3. Configurar variables de entorno
Ya están configuradas en:
- `.env` (Frontend) - URL de la API
- `server/.env` (Backend) - Credenciales de BD

### 4. Importar tablas en BD MySQL
```bash
# Importar ubicaciones (si no lo has hecho)
mysql -u [usuario] -p [base_datos] < db/b7qmfmqoaqw4ncxscdio.sql

# Importar tabla de rutas (NUEVO)
mysql -u [usuario] -p [base_datos] < db/routes.sql
```

**Credenciales de BD actualizadas:**
- Host: `b7qmfmqoaqw4ncxscdio-mysql.services.clever-cloud.com`
- Usuario: `uxnwdqemnxkthi3u`
- Contraseña: `kKDwHDd9LjS2xEPYu9yQ`
- Base de datos: `b7qmfmqoaqw4ncxscdio`
- Puerto: `3306`

## ▶️ Ejecución en Desarrollo

### Terminal 1 - Servidor (API)
```bash
cd server
npm run dev
```
El servidor estará disponible en: `http://localhost:5000/api`

**Health check**: `http://localhost:5000/api/health`

### Terminal 2 - Frontend (Vite Dev)
```bash
npm run dev
```
La app estará disponible en: `http://localhost:5173`

## ✅ Verificación
Una vez ambos están corriendo:
1. Abre `http://localhost:5173` en el navegador
2. Deberías ver las ubicaciones cargadas desde la BD
3. Prueba buscando en los campos de "¿Dónde estás?" y "¿A dónde quieres ir?"

## 📡 Endpoints de la API

### GET `/api/locations`
Retorna todas las ubicaciones del hospital

**Respuesta:**
```json
[
  {
    "id": "p1-lobby",
    "name": "Lobby Principal",
    "floor": "P1",
    "floor_label": "Piso 1",
    "area": "Acceso General",
    "description": "..."
  },
  ...
]
```

### GET `/api/locations/:id`
Obtiene una ubicación específica

### GET `/api/routes/:originId/:destinationId`
Busca una ruta entre dos ubicaciones

**Respuesta:**
```json
{
  "found": false,
  "origin": { ... },
  "destination": { ... },
  "video": null
}
```

## 🔧 Estructura del Proyecto

```
hic-navigator/
├── src/
│   ├── components/
│   │   └── LocationSelector/     # Combobox de búsqueda
│   ├── modules/search/
│   │   └── SearchService.ts      # Ahora consume API
│   ├── hooks/
│   │   └── useRouteVideo.ts      # Hook con carga de datos
│   ├── pages/Home/
│   │   └── HomePage.tsx          # Página principal
│   └── ...
├── server/
│   ├── server.js                 # Servidor Express
│   ├── package.json
│   └── .env                      # Credenciales BD
├── .env                          # URL de API (frontend)
└── ...
```

## 🗄️ Tabla de BD

### `locations`
- `id` (varchar) - ID único de la ubicación
- `name` (varchar) - Nombre de la ubicación
- `floor` (enum) - Piso: S1, S2, P1
- `floor_label` (varchar) - Etiqueta del piso (ej: "Piso 1")
- `area` (varchar) - Área del hospital
- `description` (text) - Descripción

### `routes` (nueva tabla)
- `id` (varchar) - ID único de la ruta (formato: originId__destinationId)
- `originId` (varchar) - FK a locations.id (ubicación de origen)
- `destinationId` (varchar) - FK a locations.id (ubicación de destino)
- `videoUrl` (varchar) - URL del video (ej: videos/routes/p1-lobby__s1-farmacia.mp4)
- `duration` (varchar) - Duración del video (opcional)
- `created_at` (timestamp) - Fecha de creación

## 🎥 Agregar nuevas rutas con videos

### 1. Crear el video
- Grabar el video de la ruta
- Nombrarlo con el formato: `originId__destinationId.mp4`
- Ejemplo: `p1-lobby__s1-farmacia.mp4`

### 2. Guardar el video
- Ubicación: `public/videos/routes/`
- Asegurarse de que el video esté en formato MP4

### 3. Agregar registro en BD
```sql
INSERT INTO routes (id, originId, destinationId, videoUrl, duration)
VALUES ('p1-lobby__s1-farmacia', 'p1-lobby', 's1-farmacia', 'videos/routes/p1-lobby__s1-farmacia.mp4', '01:10');
```

### 4. Agregar ruta inversa (opcional)
```sql
INSERT INTO routes (id, originId, destinationId, videoUrl, duration)
VALUES ('s1-farmacia__p1-lobby', 's1-farmacia', 'p1-lobby', 'videos/routes/s1-farmacia__p1-lobby.mp4', '01:10');
```

## 📋 IDs de ubicaciones disponibles
Ejecuta esta consulta para ver todas las ubicaciones:
```sql
SELECT id, name, floor FROM locations ORDER BY floor, name;
```

## 🛠️ Cambios Realizados

1. ✅ **Backend API** - Servidor Node.js/Express con conexión a MySQL
2. ✅ **SearchService.ts** - Ahora hace fetch() a la API
3. ✅ **useRouteVideo** - Hook con estado de carga
4. ✅ **HomePage** - Muestra estado de carga
5. ✅ **LocationSelector** - Combobox con búsqueda funcional
6. ✅ **Variables de entorno** - `.env` para ambas capas

## 📝 Notas
- Las credenciales de BD están en `server/.env`
- El frontend se comunica con el backend via HTTP en `http://localhost:5000/api`
- Si necesitas cambiar el host/puerto del API, actualiza `VITE_API_URL` en `.env`
