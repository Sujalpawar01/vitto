const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'DATABASE_URL is required. Set it in your environment or .env file for local development, and configure it in Render as an env var.'
  );
}

const poolConfig = {
  connectionString,
};

// Deployed DBs on Neon/Render/Supabase typically require SSL in production
if (isProduction || process.env.PGSSL === 'true' || connectionString.includes('neon.tech') || connectionString.includes('supabase.co')) {
  poolConfig.ssl = {
    rejectUnauthorized: false
  };
}

const pool = new Pool(poolConfig);

pool.on('connect', () => {
  console.log('PostgreSQL database client connected.');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle database client:', err);
});

// Run migrations automatically
async function runMigrations() {
  try {
    const migrationPath = path.join(__dirname, '../../../migrations/001_init.sql');
    if (fs.existsSync(migrationPath)) {
      console.log('Reading migration file:', migrationPath);
      const sql = fs.readFileSync(migrationPath, 'utf8');
      await pool.query(sql);
      console.log('Database schema checked and migrations applied successfully.');
    } else {
      console.warn('Migration file not found at:', migrationPath);
    }
  } catch (err) {
    console.error('Error running migrations on startup:', err);
    throw err;
  }
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  runMigrations
};
