import express from 'express';
import { uploadImage, handleMulterError } from '../middleware/validate.js';
import { analyzeFoodImage } from '../utils/gemini.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

/**
 * POST /api/analyze
 * Analyzes food image using Gemini Vision API
 * Accepts multipart/form-data with "image" field
 * Returns nutrition breakdown and health score
 */
router.post('/', uploadImage, handleMulterError, async (req, res) => {
  try {
    // Validate image was uploaded
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No image file provided. Please upload an image.',
      });
    }

    logger.info(`Analyzing image: ${req.file.originalname}, size: ${req.file.size} bytes`);

    // Analyze image with Gemini
    const analysis = await analyzeFoodImage(req.file.buffer, req.file.mimetype);

    logger.info(`Analysis complete: ${analysis.foodName}`);

    // Return successful response
    return res.status(200).json({
      status: 'ok',
      ...analysis,
    });
  } catch (error) {
    logger.error('Analysis endpoint error:', error.message);

    return res.status(500).json({
      status: 'error',
      message: 'Analysis failed. Please try again with a clearer food image.',
    });
  }
});

export default router;
