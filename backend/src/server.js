const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = require('./app');
const { testConnection } = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Test MySQL connection
  const isConnected = await testConnection();
  if (!isConnected) {
    console.warn(
      '[Warning] Database connection failed. Ensure MySQL server is running and .env database credentials match.'
    );
  }

  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 ShopSphere Backend Server active on port ${PORT}`);
    console.log(`🌐 Base API URL: http://localhost:${PORT}/api`);
    console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
    console.log(`==================================================`);
  });
};

startServer();
