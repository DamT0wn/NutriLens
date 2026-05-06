# NutriLens Frontend

This directory is a placeholder for the frontend application.

The frontend developer will implement the React/Vue/Svelte application here.

## Expected Structure

```
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   │   └── api.js          # API client for backend endpoints
│   └── main.jsx
├── dist/                    # Build output (for Firebase Hosting)
├── package.json
└── vite.config.js
```

## Backend API Endpoints

The frontend should connect to these backend endpoints:

- **POST /api/analyze** - Upload food image for nutrition analysis
- **POST /api/places** - Get nearby healthy restaurants

See main README.md for detailed API documentation.
