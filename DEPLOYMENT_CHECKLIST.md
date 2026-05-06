# 🚀 NutriLens Deployment Checklist

Use this checklist to ensure everything is set up correctly before deployment.

---

## ✅ Pre-Deployment Checklist

### Local Development Setup

- [ ] **Node.js 20+ installed**
  ```bash
  node --version  # Should be v20.x.x or higher
  ```

- [ ] **Backend dependencies installed**
  ```bash
  cd backend && npm install
  ```

- [ ] **Environment variables configured**
  - [ ] Created `.env` file in `backend/` directory
  - [ ] Set `GEMINI_API_KEY` with valid API key
  - [ ] Set `MAPS_API_KEY` with valid API key
  - [ ] Set `PORT=8080`
  - [ ] Set `FRONTEND_ORIGIN=http://localhost:5173`

- [ ] **Server starts without errors**
  ```bash
  cd backend && npm run dev
  # Should show: "NutriLens API server running on port 8080"
  ```

- [ ] **Health endpoint responds**
  ```bash
  curl http://localhost:8080/health
  # Should return: {"status":"ok","message":"NutriLens API is running"}
  ```

- [ ] **Analyze endpoint works** (optional but recommended)
  ```bash
  curl -X POST http://localhost:8080/api/analyze -F "image=@test-food.jpg"
  # Should return nutrition analysis JSON
  ```

- [ ] **Places endpoint works** (optional but recommended)
  ```bash
  curl -X POST http://localhost:8080/api/places \
    -H "Content-Type: application/json" \
    -d '{"lat":37.7749,"lng":-122.4194,"cuisineType":"Indian"}'
  # Should return array of nearby healthy restaurants
  ```

---

### Google Cloud Setup

- [ ] **Google Cloud project created**
  - Project ID: ___________________

- [ ] **Billing enabled** on GCP project

- [ ] **APIs enabled**
  - [ ] Cloud Run API
  - [ ] Container Registry API
  - [ ] Places API (New)
  - [ ] Generative Language API (Gemini)

- [ ] **Service Account created**
  - [ ] Name: nutrilens-deployer (or similar)
  - [ ] Roles assigned:
    - [ ] Cloud Run Admin
    - [ ] Service Account User
    - [ ] Storage Admin
  - [ ] JSON key downloaded

- [ ] **Gemini API key obtained**
  - Get from: https://makersuite.google.com/app/apikey
  - Key: ___________________

- [ ] **Maps API key obtained**
  - Get from: GCP Console → APIs & Services → Credentials
  - [ ] Places API (New) enabled for this key
  - Key: ___________________

---

### Firebase Setup

- [ ] **Firebase project created**
  - Project ID: ___________________
  - [ ] Linked to same GCP project

- [ ] **Firebase CLI installed**
  ```bash
  npm install -g firebase-tools
  firebase --version
  ```

- [ ] **Firebase authenticated**
  ```bash
  firebase login
  ```

- [ ] **Firebase CI token obtained**
  ```bash
  firebase login:ci
  # Copy the token that appears
  ```
  - Token: ___________________

- [ ] **Firebase Hosting initialized**
  ```bash
  firebase init hosting
  # Select: frontend/dist as public directory
  # Configure as single-page app: Yes
  ```

---

### GitHub Setup

- [ ] **Repository created** on GitHub
  - URL: ___________________

- [ ] **Local git initialized**
  ```bash
  git init
  git add .
  git commit -m "Initial NutriLens backend implementation"
  ```

- [ ] **Remote added and pushed**
  ```bash
  git remote add origin https://github.com/yourusername/nutrilens.git
  git branch -M main
  git push -u origin main
  ```

- [ ] **GitHub Secrets configured**
  - Go to: Repository → Settings → Secrets and variables → Actions → New repository secret
  
  - [ ] `GCP_SA_KEY` - Paste entire JSON key content
  - [ ] `GCP_PROJECT_ID` - Your GCP project ID
  - [ ] `GEMINI_API_KEY` - Your Gemini API key
  - [ ] `MAPS_API_KEY` - Your Google Maps API key
  - [ ] `FIREBASE_TOKEN` - Your Firebase CI token

---

### First Deployment

- [ ] **Manual Cloud Run deployment** (recommended first time)
  ```bash
  gcloud auth login
  gcloud config set project YOUR_PROJECT_ID
  
  cd backend
  gcloud run deploy nutrilens-api \
    --source . \
    --region us-central1 \
    --allow-unauthenticated \
    --set-env-vars GEMINI_API_KEY=your_key,MAPS_API_KEY=your_key,NODE_ENV=production
  ```

- [ ] **Cloud Run service URL obtained**
  - URL: ___________________

- [ ] **Cloud Run health check passes**
  ```bash
  curl https://your-cloud-run-url/health
  # Should return: {"status":"ok","message":"NutriLens API is running"}
  ```

- [ ] **Update CORS whitelist** (if needed)
  - Edit `backend/src/middleware/cors.js`
  - Add production frontend URL to `allowedOrigins`

---

### CI/CD Verification

- [ ] **GitHub Actions workflow runs successfully**
  - Check: Repository → Actions tab
  - Verify both jobs complete:
    - [ ] deploy-backend
    - [ ] deploy-frontend

- [ ] **Automatic deployment works**
  - Make a small change (e.g., update README)
  - Push to main branch
  - Verify GitHub Actions deploys automatically

---

### Frontend Integration (for frontend developer)

- [ ] **Backend API URL shared** with frontend developer
  - Production URL: ___________________
  - Local URL: http://localhost:8080

- [ ] **API documentation shared**
  - Share: README.md (API Documentation section)

- [ ] **CORS configured** for frontend origin
  - Frontend URL added to backend CORS whitelist

- [ ] **Frontend build output** configured
  - Must build to: `frontend/dist/`

---

## 🧪 Post-Deployment Testing

### Backend API Tests

- [ ] **Health endpoint**
  ```bash
  curl https://your-cloud-run-url/health
  ```

- [ ] **Analyze endpoint** (with real food image)
  ```bash
  curl -X POST https://your-cloud-run-url/api/analyze \
    -F "image=@food.jpg"
  ```

- [ ] **Places endpoint** (with real coordinates)
  ```bash
  curl -X POST https://your-cloud-run-url/api/places \
    -H "Content-Type: application/json" \
    -d '{"lat":37.7749,"lng":-122.4194,"cuisineType":"Indian"}'
  ```

### Security Tests

- [ ] **Rate limiting works**
  - Send 31 requests in 1 minute
  - 31st request should return 429 error

- [ ] **CORS blocks unauthorized origins**
  - Try accessing from non-whitelisted domain
  - Should see CORS error

- [ ] **File size limit enforced**
  - Upload image > 5MB
  - Should return "File too large" error

- [ ] **Invalid file type rejected**
  - Upload .txt or .pdf file
  - Should return "Invalid file type" error

- [ ] **Invalid coordinates rejected**
  - Send lat=999, lng=999
  - Should return validation error

---

## 📊 Monitoring Setup (Optional but Recommended)

- [ ] **Cloud Run metrics enabled**
  - Check: GCP Console → Cloud Run → nutrilens-api → Metrics

- [ ] **Error reporting configured**
  - Check: GCP Console → Error Reporting

- [ ] **Logging configured**
  - Check: GCP Console → Logging → Logs Explorer
  - Filter: resource.type="cloud_run_revision"

---

## 🎯 Success Criteria

Your deployment is successful when:

✅ Health endpoint returns 200 OK
✅ Analyze endpoint returns valid nutrition JSON
✅ Places endpoint returns array of restaurants
✅ Rate limiting blocks excessive requests
✅ CORS allows only whitelisted origins
✅ GitHub Actions deploys automatically on push
✅ No errors in Cloud Run logs
✅ Frontend can successfully call backend APIs

---

## 🐛 Common Issues & Solutions

### "npm not found"
**Solution:** Install Node.js from https://nodejs.org/

### "GEMINI_API_KEY environment variable is required"
**Solution:** Create `.env` file in `backend/` with your API key

### "CORS error" from frontend
**Solution:** Add frontend URL to `backend/src/middleware/cors.js` whitelist

### "Permission denied" on Cloud Run deployment
**Solution:** Verify service account has Cloud Run Admin role

### "Places API request failed: 403"
**Solution:** Enable Places API (New) in GCP Console for your project

### GitHub Actions fails with "Invalid credentials"
**Solution:** Verify `GCP_SA_KEY` secret contains valid JSON key

---

## 📞 Need Help?

1. Check `README.md` troubleshooting section
2. Review `backend/SETUP.md` for setup details
3. Check Cloud Run logs in GCP Console
4. Verify all environment variables are set correctly

---

**Last Updated:** May 6, 2026
**Version:** 1.0.0
