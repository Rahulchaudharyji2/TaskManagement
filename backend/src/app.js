import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import taskRoutes from './routes/task.routes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read swagger spec
let swaggerDocument;
try {
  const swaggerPath = join(__dirname, 'swagger', 'swagger.json');
  swaggerDocument = JSON.parse(readFileSync(swaggerPath, 'utf8'));
} catch (err) {
  console.warn('Swagger documentation file not found or invalid:', err.message);
}

const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive for local development demonstration
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Swagger UI Interactive Docs
if (swaggerDocument) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Task Manager API Documentation"
  }));
}

// Mount Task Routes
app.use('/api/tasks', taskRoutes);

// Root route welcome
app.get('/', (req, res) => {
  res.json({
    name: 'Task Management System REST API',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      tasks: '/api/tasks',
      stats: '/api/tasks/stats',
      health: '/api/health'
    }
  });
});

// 404 and Error Middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
