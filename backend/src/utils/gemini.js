import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from './logger.js';

/**
 * Initialize Gemini AI client
 * @returns {GoogleGenerativeAI} Configured Gemini client
 */
function initGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }
  return new GoogleGenerativeAI(apiKey);
}

/**
 * Analyze food image using Gemini Vision API
 * @param {Buffer} imageBuffer - Image file buffer
 * @param {string} mimeType - Image MIME type (image/jpeg or image/png)
 * @returns {Promise<Object>} Nutrition analysis result
 * @throws {Error} If analysis fails or returns invalid JSON
 */
export async function analyzeFoodImage(imageBuffer, mimeType) {
  try {
    const genAI = initGeminiClient();
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `You are a nutrition expert. Analyze this food image and return ONLY valid JSON with no markdown formatting or code fences:
{
  "foodName": "string",
  "calories": number,
  "protein_g": number,
  "carbs_g": number,
  "fat_g": number,
  "healthScore": number (1-10, where 10 is healthiest),
  "why": "string (one sentence, max 20 words, explaining main health concern or benefit)",
  "cuisineType": "string (e.g. Indian, Italian, Fast Food, Mediterranean)"
}`;

    const imagePart = {
      inlineData: {
        data: imageBuffer.toString('base64'),
        mimeType,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    logger.info('Gemini raw response received');

    // Clean response - remove markdown code fences if present
    let cleanedText = text.trim();
    cleanedText = cleanedText.replace(/^```json\s*/i, '');
    cleanedText = cleanedText.replace(/^```\s*/i, '');
    cleanedText = cleanedText.replace(/\s*```$/i, '');
    cleanedText = cleanedText.trim();

    // Parse JSON
    const parsed = JSON.parse(cleanedText);

    // Validate required fields
    const requiredFields = ['foodName', 'calories', 'protein_g', 'carbs_g', 'fat_g', 'healthScore', 'why', 'cuisineType'];
    const missingFields = requiredFields.filter((field) => !(field in parsed));

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Validate data types and ranges
    if (typeof parsed.healthScore !== 'number' || parsed.healthScore < 1 || parsed.healthScore > 10) {
      throw new Error('healthScore must be a number between 1 and 10');
    }

    return parsed;
  } catch (error) {
    logger.error('Gemini analysis failed:', error.message);
    throw new Error(`Food analysis failed: ${error.message}`);
  }
}
