# Backend Setup Instructions

## Prerequisites

Before running the backend, ensure you have:

1. **Node.js 20+** installed
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

## Installation Steps

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp ../.env.example .env
   ```

4. **Edit .env file with your API keys**
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key
   MAPS_API_KEY=your_actual_maps_api_key
   PORT=8080
   FRONTEND_ORIGIN=http://localhost:5173
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Test the server**
   Open browser or use curl:
   ```bash
   curl http://localhost:8080/health
   ```

   Expected response:
   ```json
   {"status":"ok","message":"NutriLens API is running"}
   ```

## Next Steps

Once the server is running:

1. Test the `/api/analyze` endpoint with a food image
2. Test the `/api/places` endpoint with coordinates
3. Connect the frontend to these endpoints

## Troubleshooting

- **"npm not found"**: Install Node.js from nodejs.org
- **Port 8080 already in use**: Change PORT in .env file
- **API key errors**: Verify keys are correctly set in .env
