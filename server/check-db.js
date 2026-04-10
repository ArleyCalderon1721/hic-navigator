import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function checkDatabase() {
  try {
    console.log('🔍 Conectando a BD...');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    
    console.log('✅ Conexión exitosa!\n');
    
    // Listar todas las tablas
    console.log('📋 Tablas en la BD:');
    const [tables] = await connection.query('SHOW TABLES');
    console.log(tables);
    
    // Verificar tabla locations
    console.log('\n🔎 Verificando tabla locations:');
    const [columns] = await connection.query('DESCRIBE locations');
    console.log('Columnas:', columns);
    
    // Contar registros
    console.log('\n📊 Registros en locations:');
    const [count] = await connection.query('SELECT COUNT(*) as total FROM locations');
    console.log(count[0]);
    
    // Ver los datos
    console.log('\n📍 Datos en locations:');
    const [rows] = await connection.query('SELECT * FROM locations');
    console.log(rows);
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkDatabase();
