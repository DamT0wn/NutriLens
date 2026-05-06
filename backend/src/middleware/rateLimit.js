import rateLimit from 'express-rate-limit';

/**
 * Rate limiting middleware - 30 requests per minute per IP
 * Prevents API abuse and excessive usage
 * @returns {Function} Rate limit middleware
 */
export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per window
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  // Skip rate limiting for health check
  skip: (req) => req.path === '/health',
});
