import { motion } from 'framer-motion'

export default function CameraCapture({ imagePreview, onPickImage, onAnalyse, inputRef }) {
  return (
    <div
      style={{
        minHeight: 'calc(100dvh - 72px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div style={{ width: '100%', maxWidth: '320px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '38px',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: 'var(--text)',
            margin: '0 0 0.5rem',
          }}
        >
          Know before
          <br />
          <span style={{ color: 'var(--orange)' }}>you eat it.</span>
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-dim)', fontWeight: 300, lineHeight: 1.6, margin: '0 0 2.5rem' }}>
          Point your camera at any meal - instant nutrition breakdown + nearby healthier spots on the map.
        </p>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          aria-label="Capture or upload meal photo"
          onChange={onPickImage}
          style={{ display: 'none' }}
        />

        {!imagePreview ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            aria-label="Capture or upload a meal photo"
            style={{
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              border: '1.5px solid var(--orange)',
              background: 'transparent',
              position: 'relative',
              margin: '0 auto',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--orange)',
              cursor: 'pointer',
              overflow: 'hidden',
            }}
          >
            <span aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid var(--orange)', animation: 'ringPulse 2.5s ease-out infinite' }} />
            <span aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid var(--orange)', animation: 'ringPulse 2.5s ease-out infinite', animationDelay: '0.8s' }} />
            <span style={{ fontSize: '48px', lineHeight: 1 }}>📷</span>
          </button>
        ) : (
          <motion.button
            type="button"
            onClick={() => inputRef.current?.click()}
            aria-label="Replace meal photo"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              border: '2px solid var(--orange)',
              backgroundImage: `url(${imagePreview})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              boxShadow: 'var(--orange-glow)',
              cursor: 'pointer',
              overflow: 'hidden',
              position: 'relative',
              padding: 0,
            }}
          >
            <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 20%, rgba(0,0,0,0.3) 100%)' }} />
            <span style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
              <span style={{ position: 'absolute', top: 0, left: 0, width: '60%', height: '2px', background: 'linear-gradient(90deg, transparent, var(--orange), transparent)', animation: 'scanLine 2s linear infinite' }} />
            </span>
            <span style={{ position: 'absolute', bottom: '10px', left: 0, right: 0, fontSize: '10px', letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(240,237,232,0.8)' }}>
              Tap to replace
            </span>
          </motion.button>
        )}

        <div style={{ marginTop: '1rem', fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
          tap to scan
        </div>

        {imagePreview ? (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{ marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={onAnalyse}
              aria-label="Analyse this meal with Gemini AI"
              style={{
                width: '100%',
                padding: '18px',
                background: 'var(--orange)',
                color: '#0a0a0a',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '16px',
                letterSpacing: '.02em',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.15s var(--ease-spring), box-shadow 0.15s ease',
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.transform = 'scale(1.02)'
                event.currentTarget.style.boxShadow = 'var(--orange-glow)'
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.transform = 'scale(1)'
                event.currentTarget.style.boxShadow = 'none'
              }}
              onMouseDown={(event) => {
                event.currentTarget.style.transform = 'scale(0.97)'
              }}
            >
              Analyse This Meal →
              <span aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)', animation: 'shimmer 3s ease-in-out infinite' }} />
            </button>
          </motion.div>
        ) : null}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          style={{
            marginTop: '0.8rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-dim)',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          or upload a photo
        </button>
      </div>
    </div>
  )
}
