const app = require('./src/app');
const { runMigrations } = require('./src/config/db');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  console.log('Starting Vitto backend server...');
  
  // Auto-run migrations on startup
  await runMigrations();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API Health Check: http://localhost:${PORT}/`);
  });
}

startServer().catch(err => {
  console.error('Fatal error during server startup:', err);
  process.exit(1);
});
