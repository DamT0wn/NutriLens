/**
 * Simple logger that respects NODE_ENV
 * Prevents console.log in production while allowing structured logging
 */

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Log info message
 * @param {...any} args - Arguments to log
 */
function info(...args) {
  if (!isProduction) {
    console.log('[INFO]', ...args);
  }
}

/**
 * Log warning message
 * @param {...any} args - Arguments to log
 */
function warn(...args) {
  console.warn('[WARN]', ...args);
}

/**
 * Log error message
 * @param {...any} args - Arguments to log
 */
function error(...args) {
  console.error('[ERROR]', ...args);
}

export const logger = {
  info,
  warn,
  error,
};
