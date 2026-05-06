import axios from 'axios'

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation unavailable'))
      return
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    })
  })
}

export async function fetchNearbyPlaces(cuisineType = 'healthy') {
  try {
    const position = await getCurrentPosition()
    const { latitude: lat, longitude: lng } = position.coords
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/places`,
      { lat, lng, cuisineType },
      { timeout: 15000 },
    )

    return {
      places: response.data?.places || response.data || [],
      userLat: lat,
      userLng: lng,
    }
  } catch {
    return {
      places: [],
      userLat: null,
      userLng: null,
    }
  }
}
