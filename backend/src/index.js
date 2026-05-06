import express from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { configureCors } from './middleware/cors.js';
import { rateLimiter } from './middleware/rateLimit.js';
import analyzeRouter from './routes/analyze.js';
import placesRouter from './routes/places.js';
import { logger } from './utils/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// In Docker: /app/src/index.js → __dirname = /app/src → ../public = /app/public
const FRONTEND_DIST = path.join(__dirname, '../public');

// Trust Cloud Run's load balancer (required for rate-limiter IP detection)
app.set('trust proxy', 1);

// Security middleware — relaxed CSP so the React app loads
app.use(helmet({
  contentSecurityPolicy: false,
}));

app.use(configureCors());
app.use(rateLimiter);
app.use(express.json({ limit: '5mb' }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'NutriLens API is running' });
});

// API routes
app.use('/api/analyze', analyzeRouter);
app.use('/api/places', placesRouter);

// Serve React frontend static files
app.use(express.static(FRONTEND_DIST));

// SPA fallback — all non-API routes return index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err.message);
  res.status(500).json({ status: 'error', message: 'Internal server error' });
});

app.listen(PORT, () => {
  logger.info(`NutriLens server running on port ${PORT}`);
  logger.info(`Serving frontend from: ${FRONTEND_DIST}`);
});
