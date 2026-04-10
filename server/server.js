import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Conexión MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});

// GET /api/health
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// GET /api/locations
app.get('/api/locations', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM locations ORDER BY name');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Error fetching locations' });
  }
});

// GET /api/routes/:originId/:destinationId
app.get('/api/routes/:originId/:destinationId', async (req, res) => {
  try {
    const { originId, destinationId } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM routes WHERE originId = ? AND destinationId = ?',
      [originId, destinationId]
    );
    if (rows.length === 0) {
      return res.json({ found: false, video: null });
    }
    res.json({ found: true, video: rows[0] });
  } catch (error) {
    console.error('Error fetching route:', error);
    res.status(500).json({ error: 'Error fetching route' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ HIC Navigator Server running on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}/api`);
});