import express from 'express';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de la BD
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Utilidad para mapear floor de BD a número
function mapFloorToNumber(floorValue) {
  const floorMap = {
    'S1': 1,
    'S2': 2,
    'P1': 3,
  };
  return floorMap[floorValue] || 1;
}

// Utilidad para transformar ubicación a formato frontend
function transformLocation(row) {
  return {
    id: row.id,
    name: row.name,
    floor: mapFloorToNumber(row.floor),
  };
}

// Endpoints

// GET /api/locations - Obtener todas las ubicaciones
app.get('/api/locations', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM locations ORDER BY name');
    client.release();
    const locations = result.rows.map(transformLocation);
    res.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Error fetching locations' });
  }
});

// GET /api/locations/:id - Obtener una ubicación específica
app.get('/api/locations/:id', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM locations WHERE id = $1', [req.params.id]);
    client.release();
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    const location = transformLocation(result.rows[0]);
    res.json(location);
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({ error: 'Error fetching location' });
  }
});

function findExistingRouteFile(candidatePathWithoutLeadingSlash) {
  const baseDir = path.resolve('..', 'public', 'videos', 'routes');
  const candidatePaths = [
    candidatePathWithoutLeadingSlash,
    `${candidatePathWithoutLeadingSlash}.mp4`,
    `${candidatePathWithoutLeadingSlash}.mp4.mp4`,
  ];

  for (const candidate of candidatePaths) {
    const normalized = candidate.replace(/^\//, '');
    const fullPath = path.join(baseDir, normalized);
    if (fs.existsSync(fullPath)) {
      return `videos/routes/${normalized}`;
    }
  }

  return null;
}

// GET /api/routes/:originId/:destinationId - Obtener ruta entre dos ubicaciones
app.get('/api/routes/:originId/:destinationId', async (req, res) => {
  try {
    const { originId, destinationId } = req.params;
    
    // Obtener información de origen y destino
    const client = await pool.connect();
    const originResult = await client.query('SELECT * FROM locations WHERE id = $1', [originId]);
    const destResult = await client.query('SELECT * FROM locations WHERE id = $2', [destinationId]);
    client.release();
    
    if (originResult.rows.length === 0 || destResult.rows.length === 0) {
      return res.status(404).json({ error: 'One or both locations not found' });
    }
    
    // Buscar ruta en la tabla routes
    const routeClient = await pool.connect();
    const routeResult = await routeClient.query(
      'SELECT * FROM routes WHERE originId = $1 AND destinationId = $2',
      [originId, destinationId]
    );
    routeClient.release();

    const defaultCandidate = `${originId}__${destinationId}.mp4`;
    const resolvedFallback = findExistingRouteFile(defaultCandidate);

    if (routeResult.rows.length > 0) {
      const route = routeResult.rows[0];
      const suggestedFromDb = route.videoUrl || defaultCandidate;
      const resolvedFromDb = findExistingRouteFile(suggestedFromDb);

      if (resolvedFromDb) {
        route.videoUrl = resolvedFromDb;
      } else if (resolvedFallback) {
        route.videoUrl = resolvedFallback;
      }

      return res.json({
        found: true,
        video: route,
        origin: originResult.rows[0],
        destination: destResult.rows[0]
      });
    }

    if (resolvedFallback) {
      return res.json({
        found: true,
        video: {
          id: `${originId}__${destinationId}`,
          originId,
          destinationId,
          videoUrl: resolvedFallback,
          duration: null
        },
        origin: originResult.rows[0],
        destination: destResult.rows[0]
      });
    }

    return res.json({
      found: false,
      origin: originResult.rows[0],
      destination: destResult.rows[0],
      video: null
    });
  } catch (error) {
    console.error('Error fetching route:', error);
    res.status(500).json({ error: 'Error fetching route' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Servir archivos estáticos del frontend
app.use(express.static(path.join(process.cwd(), '..', 'dist')));

// Catch all handler: send back index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), '..', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ HIC Navigator Server running on http://localhost:${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}/api`);
});
