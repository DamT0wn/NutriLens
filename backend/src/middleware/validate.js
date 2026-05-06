import multer from 'multer';

/**
 * Multer configuration for image upload
 * Validates file type and size
 */
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG and PNG images are allowed.'), false);
  }
};

/**
 * Multer middleware for single image upload
 * Max size: 5MB
 */
export const uploadImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
}).single('image');

/**
 * Validate latitude and longitude values
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {boolean} True if valid
 */
export function isValidCoordinates(lat, lng) {
  return (
    typeof lat === 'number'
    && typeof lng === 'number'
    && lat >= -90
    && lat <= 90
    && lng >= -180
    && lng <= 180
    && !Number.isNaN(lat)
    && !Number.isNaN(lng)
  );
}

/**
 * Sanitize cuisine type string
 * Removes special characters and limits length
 * @param {string} cuisineType - Raw cuisine type input
 * @returns {string} Sanitized cuisine type
 */
export function sanitizeCuisineType(cuisineType) {
  if (typeof cuisineType !== 'string') {
    return '';
  }

  // Remove special characters, keep only alphanumeric, spaces, and hyphens
  const sanitized = cuisineType
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .substring(0, 50); // Max 50 characters

  return sanitized;
}

/**
 * Middleware to handle multer errors
 * @param {Error} err - Error object
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 */
export function handleMulterError(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'error',
        message: 'File too large. Maximum size is 5MB.',
      });
    }
    return res.status(400).json({
      status: 'error',
      message: `Upload error: ${err.message}`,
    });
  }

  if (err) {
    return res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }

  next();
}
