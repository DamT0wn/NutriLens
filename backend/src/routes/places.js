import express from 'express';
import { isValidCoordinates, sanitizeCuisineType } from '../middleware/validate.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

/**
 * Call Google Places API (New) - Nearby Search
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Array>} Array of nearby healthy restaurants
 */
async function searchNearbyHealthyPlaces(lat, lng) {
  const apiKey = process.env.MAPS_API_KEY;
  if (!apiKey) {
    throw new Error('MAPS_API_KEY environment variable is required');
  }

  const url = 'https://places.googleapis.com/v1/places:searchNearby';

  const requestBody = {
    includedTypes: [
      'salad_shop',
      'vegetarian_restaurant',
      'health_food_store',
      'vegan_restaurant',
    ],
    maxResultCount: 5,
    locationRestriction: {
      circle: {
        center: {
          latitude: lat,
          longitude: lng,
        },
        radius: 1000, // 1km radius
      },
    },
  };

  const headers = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': apiKey,
    'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location,places.rating,places.priceLevel,places.googleMapsUri',
  };

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    logger.error(`Places API error: ${response.status} - ${errorText}`);
    throw new Error(`Places API request failed: ${response.status}`);
  }

  const data = await response.json();

  // Map results to simplified format
  const places = (data.places || []).slice(0, 3).map((place) => ({
    name: place.displayName?.text || 'Unknown',
    address: place.formattedAddress || 'Address not available',
    lat: place.location?.latitude || 0,
    lng: place.location?.longitude || 0,
    rating: place.rating || null,
    googleMapsUri: place.googleMapsUri || null,
  }));

  return places;
}

/**
 * POST /api/places
 * Finds nearby healthy restaurants using Google Places API
 * Accepts JSON body with lat, lng, and cuisineType
 * Returns top 3 healthy restaurant recommendations
 */
router.post('/', express.json({ limit: '1mb' }), async (req, res) => {
  try {
    const { lat, lng, cuisineType } = req.body;

    // Validate coordinates
    if (!isValidCoordinates(lat, lng)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180.',
      });
    }

    // Sanitize cuisine type (currently not used in search but validated for future use)
    const sanitizedCuisine = sanitizeCuisineType(cuisineType);
    logger.info(`Searching places near (${lat}, ${lng}), cuisine: ${sanitizedCuisine}`);

    // Search for nearby healthy places
    const places = await searchNearbyHealthyPlaces(lat, lng);

    logger.info(`Found ${places.length} healthy places nearby`);

    return res.status(200).json({
      status: 'ok',
      places,
    });
  } catch (error) {
    logger.error('Places endpoint error:', error.message);

    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch nearby places. Please try again.',
    });
  }
});

export default router;
