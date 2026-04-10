# 🎥 Guía para Agregar Rutas con Videos - HIC Navigator

## 📋 Requisitos Previos

1. **Base de datos actualizada**: Importar `db/routes.sql` en tu BD MySQL
2. **Servidor corriendo**: `cd server && npm run dev`
3. **Videos preparados**: Archivos MP4 con el formato correcto

## 📁 Estructura de Carpetas

```
public/
  videos/
    routes/           # ← Aquí van los videos de rutas
      p1-lobby__s1-farmacia.mp4
      s1-farmacia__p1-lobby.mp4
```

## 🏷️ Convención de Nombres para Videos

### Formato obligatorio:
```
{originId}__{destinationId}.mp4
```

### Ejemplos:
- `p1-lobby__s1-farmacia.mp4` → Lobby Principal → Farmacia Salud Mía
- `s1-farmacia__p1-lobby.mp4` → Farmacia Salud Mía → Lobby Principal
- `p1-uet-front__s2-pediatrico.mp4` → UET Front → Pediátrico

## 🗄️ Agregar Nueva Ruta en BD

### 1. Identificar IDs de ubicaciones
```sql
-- Ver todas las ubicaciones disponibles
SELECT id, name, floor_label FROM locations ORDER BY floor, name;
```

### 2. Insertar ruta en BD
```sql
INSERT INTO routes (id, originId, destinationId, videoUrl, duration)
VALUES (
  'p1-lobby__s1-farmacia',     -- ID único de la ruta
  'p1-lobby',                  -- ID de origen
  's1-farmacia',               -- ID de destino
  'videos/routes/p1-lobby__s1-farmacia.mp4',  -- URL del video
  '01:10'                      -- Duración (opcional)
);
```

### 3. Agregar ruta inversa (recomendado)
```sql
INSERT INTO routes (id, originId, destinationId, videoUrl, duration)
VALUES ('s1-farmacia__p1-lobby', 's1-farmacia', 'p1-lobby', 'videos/routes/s1-farmacia__p1-lobby.mp4', '01:10');
```

## 🎬 Crear Videos de Rutas

### Recomendaciones técnicas:
- **Formato**: MP4 (H.264)
- **Resolución**: 1920x1080 (Full HD) o 1280x720 (HD)
- **Duración**: Máximo 5 minutos por ruta
- **Calidad**: Buena iluminación, enfoque claro
- **Contenido**: Mostrar camino completo, puntos de referencia

### Proceso sugerido:
1. Grabar video caminando la ruta
2. Editar para mostrar puntos importantes
3. Comprimir manteniendo calidad
4. Nombrar según convención
5. Colocar en `public/videos/routes/`

## 🧪 Probar Nueva Ruta

### 1. Reiniciar servidor
```bash
# En terminal del servidor
Ctrl+C
npm run dev
```

### 2. Probar endpoint
```bash
curl http://localhost:5000/api/routes/{originId}/{destinationId}
```

### 3. Verificar respuesta
```json
{
  "found": true,
  "video": {
    "id": "p1-lobby__s1-farmacia",
    "videoUrl": "videos/routes/p1-lobby__s1-farmacia.mp4",
    "duration": "01:10"
  },
  "origin": { "id": "p1-lobby", "name": "Lobby Principal" },
  "destination": { "id": "s1-farmacia", "name": "Farmacia Salud Mía" }
}
```

## 📊 IDs de Ubicaciones Populares

### Piso 1 (P1):
- `p1-lobby` - Lobby Principal
- `p1-uet-front` - UET — Front (Recepción)
- `p1-farmacia-uet` - Farmacia UET

### Sótano 1 (S1):
- `s1-farmacia` - Farmacia Salud Mía
- `s1-laboratorio-clinico` - Laboratorio Clínico
- `s1-radiologia` - Radiología

### Sótano 2 (S2):
- `s2-pediatrico` - Pediátrico
- `s2-biblioteca` - Biblioteca

## 🔧 Solución de Problemas

### Error "Table 'routes' doesn't exist"
- Importar `db/routes.sql` en la BD

### Video no se reproduce
- Verificar nombre del archivo coincide con `videoUrl`
- Verificar archivo existe en `public/videos/routes/`
- Verificar formato MP4 válido

### Ruta no encontrada
- Verificar IDs de origen y destino existen en BD
- Verificar registro existe en tabla `routes`
- Reiniciar servidor después de cambios en BD

## 📞 Soporte

Si tienes problemas:
1. Verifica logs del servidor
2. Confirma BD tiene tabla `routes`
3. Verifica archivos de video existen
4. Revisa convención de nombres