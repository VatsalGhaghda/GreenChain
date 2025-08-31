require('dotenv').config();
const { Pool } = require('pg');

async function testDatabase() {
  const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'greenchain',
    password: 'root',
    port: 5432,
  });

  try {
    console.log('=== Database Connection Test ===');
    console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
    console.log('Attempting to connect...');
    
    // Test basic connection
    const result = await pool.query('SELECT NOW() as current_time');
    console.log('✅ Database connected successfully!');
    console.log('Current time from DB:', result.rows[0].current_time);
    
    // Test users table
    const userCount = await pool.query('SELECT COUNT(*) as count FROM users');
    console.log('Users in database:', userCount.rows[0].count);
    
    // Test batches table
    const batchCount = await pool.query('SELECT COUNT(*) as count FROM batches');
    console.log('Batches in database:', batchCount.rows[0].count);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Error details:', error);
  } finally {
    await pool.end();
  }
}

testDatabase();