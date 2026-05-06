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
          Point your camera at any meal — instant nutrition breakdown + nearby healthier spots.
        </p>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          aria-label="Upload meal photo"
          onChange={onPickImage}
          style={{ display: 'none' }}
        />

        {/* Meal image preview / tap target */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          aria-label={imagePreview ? 'Replace meal photo' : 'Upload a meal photo'}
          style={{
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            border: '2px solid var(--orange)',
            background: imagePreview ? 'transparent' : 'var(--surface)',
            backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            boxShadow: 'var(--orange-glow)',
            cursor: 'pointer',
            overflow: 'hidden',
            position: 'relative',
            padding: 0,
            margin: '0 auto',
            display: 'block',
          }}
        >
          {!imagePreview && (
            <span style={{ fontSize: '48px', lineHeight: 1 }}>📷</span>
          )}
          {imagePreview && (
            <>
              <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 20%, rgba(0,0,0,0.3) 100%)' }} />
              <span style={{ position: 'absolute', bottom: '10px', left: 0, right: 0, fontSize: '10px', letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(240,237,232,0.8)' }}>
                Tap to change
              </span>
            </>
          )}
        </button>

        <div style={{ marginTop: '1rem', fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
          {imagePreview ? 'ready to analyse' : 'tap to scan'}
        </div>

        {/* Analyse button — always visible */}
        <div style={{ marginTop: '1.5rem' }}>
          <button
            type="button"
            onClick={onAnalyse}
            aria-label="Analyse this meal"
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
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)'
              e.currentTarget.style.boxShadow = 'var(--orange-glow)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Analyse This Meal →
            <span aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)', animation: 'shimmer 3s ease-in-out infinite' }} />
          </button>
        </div>
      </div>
    </div>
  )
}
