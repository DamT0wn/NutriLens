# 🥗 NutriLens

**Snap. Analyze. Eat Better.**

NutriLens is a food health app that uses AI vision to analyze meal photos and recommend nearby healthier restaurant alternatives.

## 🏗️ Architecture

```
┌─────────────────┐
│   Frontend      │  React/Vue (Firebase Hosting)
│  (Port 5173)    │  - Camera capture
└────────┬────────┘  - Results display
         │
         │ HTTPS
         ▼
┌─────────────────┐
│  Backend API    │  Node.js + Express (Cloud Run)
│  (Port 8080)    │  - /api/analyze (Gemini Vision)
└────┬────────┬───┘  - /api/places (Google Maps)
     │        │
     │        └──────► Google Maps Places API
     │
     └───────────────► Gemini 2.0 Flash API
```

## 📁 Project Structure

```
nutrilens/
├── backend/                  # Cloud Run API (Node.js + Express)
│   ├── src/
│   │   ├── index.js          # Express app entry point
│   │   ├── routes/
│   │   │   ├── analyze.js    # POST /api/analyze — Gemini Vision
│   │   │   └── places.js     # POST /api/places — Places Nearby Search
│   │   ├── middleware/
│   │   │   ├── cors.js       # CORS config (whitelist origins)
│   │   │   ├── rateLimit.js  # 30 req/min per IP
│   │   │   └── validate.js   # Input validation & multer config
│   │   └── utils/
│   │       ├── gemini.js     # Gemini API client wrapper
│   │       └── logger.js     # Production-safe logger
│   ├── Dockerfile            # Cloud Run container
│   ├── .dockerignore
│   ├── .eslintrc.json        # Airbnb ESLint rules
│   └── package.json
├── frontend/                 # Placeholder for frontend dev
│   └── README.md
├── .github/
│   └── workflows/
│       └── deploy.yml        # Auto-deploy on push to main
├── firebase.json             # Firebase Hosting config
├── .firebaserc
├── .env.example              # Template (never commit real keys)
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn
- Google Cloud account (for Gemini & Maps APIs)
- Firebase account (for hosting)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nutrilens.git
   cd nutrilens
   ```

2. **Set up environment variables**
   ```bash
   cd backend
   cp ../.env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   GEMINI_API_KEY=your_actual_gemini_key
   MAPS_API_KEY=your_actual_maps_key
   PORT=8080
   FRONTEND_ORIGIN=http://localhost:5173
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Server will start on http://localhost:8080

5. **Test the health endpoint**
   ```bash
   curl http://localhost:8080/health
   ```
   
   Expected response:
   ```json
   {"status":"ok","message":"NutriLens API is running"}
   ```

## 📡 API Documentation

### Base URL
- **Local:** `http://localhost:8080`
- **Production:** `https://nutrilens-api-[hash]-uc.a.run.app`

### Endpoints

#### 1. Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "message": "NutriLens API is running"
}
```

---

#### 2. Analyze Food Image
```http
POST /api/analyze
Content-Type: multipart/form-data
```

**Request:**
- Field: `image` (file)
- Accepted formats: JPEG, PNG
- Max size: 5MB

**Response (Success):**
```json
{
  "status": "ok",
  "foodName": "Chicken Biryani",
  "calories": 450,
  "protein_g": 25,
  "carbs_g": 55,
  "fat_g": 15,
  "healthScore": 6,
  "why": "High in protein but contains refined carbs and saturated fats",
  "cuisineType": "Indian"
}
```

**Response (Error):**
```json
{
  "status": "error",
  "message": "Analysis failed. Please try again with a clearer food image."
}
```

**Example (cURL):**
```bash
curl -X POST http://localhost:8080/api/analyze \
  -F "image=@/path/to/food.jpg"
```

---

#### 3. Find Nearby Healthy Restaurants
```http
POST /api/places
Content-Type: application/json
```

**Request Body:**
```json
{
  "lat": 37.7749,
  "lng": -122.4194,
  "cuisineType": "Indian"
}
```

**Response (Success):**
```json
{
  "status": "ok",
  "places": [
    {
      "name": "Green Leaf Salad Bar",
      "address": "123 Market St, San Francisco, CA",
      "lat": 37.7750,
      "lng": -122.4195,
      "rating": 4.5,
      "googleMapsUri": "https://maps.google.com/?cid=123456789"
    },
    {
      "name": "Veggie Delight",
      "address": "456 Mission St, San Francisco, CA",
      "lat": 37.7755,
      "lng": -122.4200,
      "rating": 4.3,
      "googleMapsUri": "https://maps.google.com/?cid=987654321"
    }
  ]
}
```

**Response (Error):**
```json
{
  "status": "error",
  "message": "Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180."
}
```

**Example (cURL):**
```bash
curl -X POST http://localhost:8080/api/places \
  -H "Content-Type: application/json" \
  -d '{"lat":37.7749,"lng":-122.4194,"cuisineType":"Indian"}'
```

## 🔒 Security Features

- ✅ **API Keys Never Exposed** - All keys stored server-side only
- ✅ **CORS Whitelist** - Only allowed origins can access API
- ✅ **Rate Limiting** - 30 requests/minute per IP
- ✅ **Input Validation** - File type, size, and coordinate validation
- ✅ **Input Sanitization** - Special character removal from user inputs
- ✅ **Helmet.js** - HTTP security headers
- ✅ **Non-root Docker User** - Container runs as unprivileged user
- ✅ **Request Size Limits** - 5MB max payload
- ✅ **No console.log in Production** - Structured logging only

## 🚢 Deployment

### Deploy to Google Cloud Run

1. **Authenticate with Google Cloud**
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

2. **Deploy backend**
   ```bash
   cd backend
   gcloud run deploy nutrilens-api \
     --source . \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars GEMINI_API_KEY=your_key,MAPS_API_KEY=your_key
   ```

3. **Note the service URL** (e.g., `https://nutrilens-api-xyz-uc.a.run.app`)

### Deploy Frontend to Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase (if not done)**
   ```bash
   firebase init hosting
   ```

4. **Build frontend** (after frontend is implemented)
   ```bash
   cd frontend
   npm run build
   ```

5. **Deploy**
   ```bash
   firebase deploy --only hosting
   ```

### Automated CI/CD

The project includes GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically deploys on push to `main` branch.

**Required GitHub Secrets:**
- `GCP_SA_KEY` - Google Cloud service account JSON key
- `GCP_PROJECT_ID` - Your GCP project ID
- `GEMINI_API_KEY` - Gemini API key
- `MAPS_API_KEY` - Google Maps API key
- `FIREBASE_TOKEN` - Firebase CI token (get via `firebase login:ci`)

## 🔑 Required API Keys

### 1. Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add to `.env` as `GEMINI_API_KEY`

### 2. Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable **Places API (New)**
3. Create credentials → API Key
4. Add to `.env` as `MAPS_API_KEY`

### 3. Firebase Token (for CI/CD)
```bash
firebase login:ci
```
Copy the token and add to GitHub Secrets as `FIREBASE_TOKEN`

### 4. GCP Service Account (for CI/CD)
1. Go to IAM & Admin → Service Accounts
2. Create service account with roles:
   - Cloud Run Admin
   - Service Account User
   - Storage Admin
3. Create JSON key
4. Add entire JSON content to GitHub Secrets as `GCP_SA_KEY`

## 🧪 Testing

### Test Health Endpoint
```bash
curl http://localhost:8080/health
```

### Test Analyze Endpoint
```bash
curl -X POST http://localhost:8080/api/analyze \
  -F "image=@test-food.jpg"
```

### Test Places Endpoint
```bash
curl -X POST http://localhost:8080/api/places \
  -H "Content-Type: application/json" \
  -d '{"lat":37.7749,"lng":-122.4194,"cuisineType":"Indian"}'
```

## 📝 Code Quality

- **ESLint** with Airbnb rules
- **JSDoc** comments on all functions
- **Error handling** with try/catch on all async operations
- **Input validation** on every endpoint
- **Structured logging** (no console.log in production)

### Run Linter
```bash
cd backend
npm run lint
```

### Fix Linting Issues
```bash
npm run lint:fix
```

## 🛠️ Tech Stack

**Backend:**
- Node.js 20
- Express.js
- Gemini 2.0 Flash API
- Google Maps Places API (New)
- Multer (file uploads)
- Helmet.js (security)
- express-rate-limit

**Infrastructure:**
- Google Cloud Run (backend)
- Firebase Hosting (frontend)
- Docker (containerization)
- GitHub Actions (CI/CD)

## 📄 License

MIT

## 👥 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### "GEMINI_API_KEY environment variable is required"
- Ensure `.env` file exists in `backend/` directory
- Verify `GEMINI_API_KEY` is set correctly

### "CORS error" when calling from frontend
- Add your frontend URL to `FRONTEND_ORIGIN` in `.env`
- Check `backend/src/middleware/cors.js` whitelist

### "File too large" error
- Images must be under 5MB
- Compress image before uploading

### Rate limit exceeded
- Wait 1 minute before retrying
- Default limit: 30 requests/minute per IP

## 📞 Support

For issues and questions, please open a GitHub issue.

---

**Built with ❤️ for healthier eating**
