import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import AnalyzingScreen from './components/AnalyzingScreen.jsx'
import CameraCapture from './components/CameraCapture.jsx'
import MacroBar from './components/MacroBar.jsx'
import MapView from './components/MapView.jsx'
import NutritionCard from './components/NutritionCard.jsx'
import RestaurantCard from './components/RestaurantCard.jsx'
import StreakBanner from './components/StreakBanner.jsx'
import { getScoreTheme } from './utils/healthScore.js'
import { getStreak, incrementStreak } from './utils/streak.js'
import { DEMO_BURGER, DEMO_SALAD, getDemoPlaces } from './utils/demoFallback.js'

const DEMO_LAT = 37.775
const DEMO_LNG = -122.4195
const DEMO_PLACES = getDemoPlaces(DEMO_LAT, DEMO_LNG)
const DEMO_IMAGE = '/demo-burger.png'

function App() {
  const [state, setState] = useState('IDLE')
  const [imagePreview, setImagePreview] = useState(DEMO_IMAGE)
  const [analysis, setAnalysis] = useState(DEMO_BURGER)
  const [places] = useState(DEMO_PLACES)
  const [userLocation] = useState({ lat: DEMO_LAT, lng: DEMO_LNG })
  const [streak, setStreak] = useState(0)
  const fileInputRef = useRef(null)

  useEffect(() => {
    setStreak(getStreak())
  }, [])

  const theme = useMemo(() => getScoreTheme(analysis.healthScore), [analysis.healthScore])

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setImagePreview(URL.createObjectURL(file))
  }

  // Always mock — no real API calls
  const runAnalysis = async () => {
    setState('ANALYZING')
    await new Promise((resolve) => window.setTimeout(resolve, 1800))
    // Alternate between burger and salad for demo effect
    setAnalysis((prev) => (prev.healthScore <= 3 ? DEMO_SALAD : DEMO_BURGER))
    incrementStreak()
    setStreak(getStreak())
    setState('RESULT')
  }

  const resetScan = () => {
    setState('IDLE')
    setImagePreview(DEMO_IMAGE)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

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
          background: 'rgba(10,10,10,0.92)',
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
        <span
          style={{
            border: '0.5px solid var(--orange)',
            background: 'var(--orange-dim)',
            color: 'var(--orange)',
            padding: '5px 12px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '.06em',
            textTransform: 'uppercase',
          }}
        >
          ● DEMO
        </span>
      </header>

      <main style={{ flex: 1 }}>
        {state === 'IDLE' && (
          <CameraCapture
            imagePreview={imagePreview}
            onPickImage={handleImageChange}
            onAnalyse={runAnalysis}
            inputRef={fileInputRef}
          />
        )}

        {state === 'ANALYZING' && <AnalyzingScreen />}

        {state === 'RESULT' && (
          <div style={{ padding: '1rem 1rem 2rem', display: 'grid', gap: '1rem', animation: 'fadeUp 0.4s ease' }}>
            <div aria-live="polite" style={{ position: 'absolute', left: '-9999px' }}>
              Analysis complete. {analysis.foodName} scored {analysis.healthScore} out of 10.
            </div>
            <NutritionCard
              foodName={analysis.foodName}
              calories={analysis.calories}
              protein_g={analysis.protein_g}
              carbs_g={analysis.carbs_g}
              fat_g={analysis.fat_g}
              healthScore={analysis.healthScore}
              why={analysis.why}
            />
            <div>
              <MacroBar label="Protein" value={analysis.protein_g} unit="g" max={80} color="var(--orange)" delay={0.1} />
              <MacroBar label="Carbs" value={analysis.carbs_g} unit="g" max={150} color="var(--amber)" delay={0.2} />
              <MacroBar label="Fat" value={analysis.fat_g} unit="g" max={80} color="var(--red)" delay={0.3} />
              <MacroBar label="Score" value={analysis.healthScore} unit="/10" max={10} color={theme.accent} delay={0.4} />
            </div>
            <StreakBanner streak={streak} />
            <MapView userLocation={userLocation} places={places} />
            <section>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px', letterSpacing: '.08em', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Nearby recommendations
              </div>
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '4px 0 12px', scrollbarWidth: 'none' }}>
                {places.map((restaurant, index) => (
                  <RestaurantCard key={`${restaurant.name}-${index}`} restaurant={restaurant} />
                ))}
              </div>
            </section>
            <button
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
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
