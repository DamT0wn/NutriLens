import cors from 'cors';

/**
 * CORS configuration middleware
 * Whitelists allowed origins instead of using wildcard
 * @returns {Function} CORS middleware
 */
export function configureCors() {
  const allowedOrigins = [
    process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
    'https://nutrilens-app.web.app',
    'https://nutrilens-app.firebaseapp.com',
  ].filter(Boolean);

  const corsOptions = {
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400, // 24 hours
  };

  return cors(corsOptions);
}
