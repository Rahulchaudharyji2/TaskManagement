import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` Task Management Backend Server Running`);
  console.log(` Mode:        ${NODE_ENV}`);
  console.log(` Port:        ${PORT}`);
  console.log(` API Base:    http://localhost:${PORT}/api/tasks`);
  console.log(` Swagger Doc: http://localhost:${PORT}/api-docs`);
  console.log(` Healthcheck: http://localhost:${PORT}/api/health`);
  console.log(`===============================================`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
