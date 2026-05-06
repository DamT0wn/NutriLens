export const DEMO_BURGER = {
  foodName: "Classic Cheeseburger",
  calories: 890,
  protein_g: 38,
  carbs_g: 72,
  fat_g: 48,
  healthScore: 2,
  why: "High saturated fat and refined carbs spike insulin with no fibre.",
  cuisineType: "Fast Food"
};

export const DEMO_SALAD = {
  foodName: "Grilled Chicken Salad",
  calories: 340,
  protein_g: 42,
  carbs_g: 18,
  fat_g: 9,
  healthScore: 9,
  why: "High protein, low glycaemic load, rich in micronutrients.",
  cuisineType: "Mediterranean"
};

export const getDemoPlaces = (userLat, userLng) => [
  { name: "Green Bowl Co.", address: "Near you", rating: 4.6, 
    lat: userLat + 0.003, lng: userLng + 0.002, 
    googleMapsUri: "https://maps.google.com" },
  { name: "Nourish Kitchen", address: "350m away", rating: 4.4,
    lat: userLat - 0.002, lng: userLng + 0.004,
    googleMapsUri: "https://maps.google.com" },
  { name: "The Salad Lab", address: "480m away", rating: 4.2,
    lat: userLat + 0.001, lng: userLng - 0.003,
    googleMapsUri: "https://maps.google.com" }
];
