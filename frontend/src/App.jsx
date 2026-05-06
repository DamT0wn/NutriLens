import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import AnalyzingScreen from './components/AnalyzingScreen.jsx'
import CameraCapture from './components/CameraCapture.jsx'
import MacroBar from './components/MacroBar.jsx'
import MapView from './components/MapView.jsx'
import NutritionCard from './components/NutritionCard.jsx'
import OrangeCursor from './components/OrangeCursor.jsx'
import RestaurantCard from './components/RestaurantCard.jsx'
import StreakBanner from './components/StreakBanner.jsx'
import { analyzeFood } from './hooks/useGeminiAnalysis.js'
import { fetchNearbyPlaces } from './hooks/useNearbyPlaces.js'
import { getScoreTheme } from './utils/healthScore.js'
import { getStreak, incrementStreak } from './utils/streak.js'

import { DEMO_BURGER, DEMO_SALAD, getDemoPlaces } from './utils/demoFallback.js'

// Demo mode burger image (shown by default so judges can click Analyse immediately)
const DEMO_IMAGE = '/demo-burger.png'

function App() {
  const [state, setState] = useState('IDLE')
  const [demoMode, setDemoMode] = useState(true)
  const [imageFile, setImageFile] = useState(null)
  // Pre-load the burger image preview in demo mode
  const [imagePreview, setImagePreview] = useState(DEMO_IMAGE)
  const [analysis, setAnalysis] = useState(DEMO_BURGER)
  const [places, setPlaces] = useState([])
  const [userLocation, setUserLocation] = useState(null)
  const [streak, setStreak] = useState(0)
  const fileInputRef = useRef(null)

  useEffect(() => {
    setStreak(getStreak())
  }, [])

  // When demo mode toggles, reset preview to burger (or clear if turning off)
  useEffect(() => {
    if (demoMode) {
      setImagePreview(DEMO_IMAGE)
    } else {
      setImagePreview('')
      setImageFile(null)
    }
  }, [demoMode])

  useEffect(() => {
    return () => {
      // Only revoke blob URLs, not our static demo-burger.png path
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  const theme = useMemo(() => getScoreTheme(analysis.healthScore), [analysis.healthScore])

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const runAnalysis = async () => {
    // Demo mode: no real file needed — run mock instantly
    if (!demoMode && !imageFile) return

    setState('ANALYZING')

    try {
      if (demoMode) {
        // Simulate a short loading delay then return mock data
        await new Promise((resolve) => window.setTimeout(resolve, 1600))
        // Alternate burger/salad on each click to show both scorecards
        setAnalysis(analysis.healthScore <= 3 ? DEMO_SALAD : DEMO_BURGER)
        const lat = 37.775
        const lng = -122.4195
        setPlaces(getDemoPlaces(lat, lng))
        setUserLocation({ lat, lng })
      } else {
        const result = await analyzeFood(imageFile)
        setAnalysis({
          foodName: result.foodName || result.food_name || 'Meal Analysis',
          calories: Number(result.calories || 0),
          protein_g: Number(result.protein_g || result.protein || 0),
          carbs_g: Number(result.carbs_g || result.carbs || 0),
          fat_g: Number(result.fat_g || result.fat || 0),
          healthScore: Number(result.healthScore || result.health_score || 7),
          why:
            result.why ||
            result.reason ||
            'Balanced ingredients and portions support a moderate health score.',
          cuisineType: result.cuisineType || 'healthy',
        })

        const nearby = await fetchNearbyPlaces(result.cuisineType || 'healthy')
        setPlaces(nearby.places?.length ? nearby.places : getDemoPlaces(37.775, -122.4195))
        setUserLocation(
          nearby.userLat && nearby.userLng
            ? { lat: nearby.userLat, lng: nearby.userLng }
            : { lat: 37.775, lng: -122.4195 },
        )
      }

      incrementStreak()
      setStreak(getStreak())
      setState('RESULT')
    } catch {
      // Any real API failure → silently fall back to mock
      setAnalysis(DEMO_BURGER)
      setPlaces(getDemoPlaces(37.775, -122.4195))
      setUserLocation({ lat: 37.775, lng: -122.4195 })
      incrementStreak()
      setStreak(getStreak())
      setState('RESULT')
    }
  }

  const resetScan = () => {
    setState('IDLE')
    setImageFile(null)

    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }
    // In demo mode always restore burger image
    setImagePreview(demoMode ? DEMO_IMAGE : '')

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const resultSections = [
    <NutritionCard
      key="nutrition"
      foodName={analysis.foodName}
      calories={analysis.calories}
      protein_g={analysis.protein_g}
      carbs_g={analysis.carbs_g}
      fat_g={analysis.fat_g}
      healthScore={analysis.healthScore}
      why={analysis.why}
    />,
    <div key="macros">
      <MacroBar label="Protein" value={analysis.protein_g} unit="g" max={80} color="var(--orange)" delay={0.1} />
      <MacroBar label="Carbs" value={analysis.carbs_g} unit="g" max={150} color="var(--amber)" delay={0.2} />
      <MacroBar label="Fat" value={analysis.fat_g} unit="g" max={80} color="var(--red)" delay={0.3} />
      <MacroBar label="Score" value={analysis.healthScore} unit="/10" max={10} color={theme.accent} delay={0.4} />
    </div>,
    <StreakBanner key="streak" streak={streak} />,
    <MapView key="map" userLocation={userLocation} places={places} />,
    <section key="restaurants">
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '13px',
          letterSpacing: '.08em',
          color: 'var(--text-dim)',
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}
      >
        Nearby recommendations
      </div>
      <div
        style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          padding: '4px 0 12px 0',
          scrollbarWidth: 'none',
        }}
      >
        {(places.length ? places : getDemoPlaces(37.775, -122.4195)).map((restaurant, index) => (
          <RestaurantCard key={`${restaurant.name}-${index}`} restaurant={restaurant} />
        ))}
      </div>
    </section>,
    <button
      key="reset"
      type="button"
      onClick={resetScan}
      style={{
        width: '100%',
        padding: '15px',
        background: 'transparent',
        color: 'var(--text)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: '14px',
        letterSpacing: '.02em',
        cursor: 'pointer',
      }}
    >
      Scan Another Meal
    </button>,
  ]

  return (
    <div
      id="app-shell"
      style={{
        maxWidth: '430px',
        margin: '0 auto',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <OrangeCursor />
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '0.5px solid var(--border)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(10,10,10,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px', letterSpacing: '-0.02em', color: 'var(--text)' }}>
            Nutri<span style={{ color: 'var(--orange)' }}>Lens</span>
          </span>
          <span
            aria-hidden="true"
            style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--orange)', animation: 'pulseGlow 2s ease-in-out infinite' }}
          />
        </div>
        <button
          type="button"
          onClick={() => setDemoMode((value) => !value)}
          aria-label="Toggle demo mode"
          style={{
            border: '0.5px solid var(--border)',
            background: demoMode ? 'var(--orange-dim)' : 'transparent',
            color: demoMode ? 'var(--orange)' : 'var(--text-dim)',
            borderColor: demoMode ? 'var(--orange)' : 'var(--border)',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 500,
            fontFamily: 'var(--font-body)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            letterSpacing: '.04em',
            textTransform: 'uppercase',
          }}
        >
          {demoMode ? '● DEMO' : 'Demo Mode'}
        </button>
      </header>

      <AnimatePresence mode="wait">
        {state === 'IDLE' ? (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <CameraCapture
              imagePreview={imagePreview}
              onPickImage={handleImageChange}
              onAnalyse={runAnalysis}
              inputRef={fileInputRef}
              demoMode={demoMode}
            />
          </motion.div>
        ) : null}

        {state === 'ANALYZING' ? (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AnalyzingScreen />
          </motion.div>
        ) : null}

        {state === 'RESULT' ? (
          <motion.main key="result" style={{ padding: '1rem 1rem 2rem' }}>
            <div style={{ display: 'grid', gap: '1rem' }} aria-live="polite">
              {resultSections.map((section, index) => (
                <motion.div
                  key={section.key}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.1 * index }}
                >
                  {section}
                </motion.div>
              ))}
            </div>
            <p style={{ position: 'absolute', left: '-9999px' }} aria-live="polite">
              Analysis complete. {analysis.foodName} is {theme.label}. Score: {analysis.healthScore} out of 10.
            </p>
          </motion.main>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default App
