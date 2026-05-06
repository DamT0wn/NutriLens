import express from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { configureCors } from './middleware/cors.js';
import { rateLimiter } from './middleware/rateLimit.js';
import analyzeRouter from './routes/analyze.js';
import placesRouter from './routes/places.js';
import { logger } from './utils/logger.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(configureCors());

// Rate limiting
app.use(rateLimiter);

// Body parser for JSON (with size limit)
app.use(express.json({ limit: '5mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'NutriLens API is running' });
});

// API routes
app.use('/api/analyze', analyzeRouter);
app.use('/api/places', placesRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err.message);

  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`NutriLens API server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
