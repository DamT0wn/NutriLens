export default function AnalyzingScreen() {
  const bars = [0, 100, 200, 300, 400]

  return (
    <div
      aria-busy="true"
      aria-live="polite"
      style={{
        minHeight: 'calc(100dvh - 72px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        padding: '2rem',
      }}
    >
      <div style={{ display: 'flex', gap: '8px', alignItems: 'end' }}>
        {bars.map((delay, index) => (
          <span
            key={delay}
            style={{
              width: '6px',
              height: `${24 + index * 6}px`,
              borderRadius: '3px',
              background: 'var(--orange)',
              transformOrigin: 'bottom',
              animation: `barDance 0.8s ease-in-out ${delay}ms infinite`,
              boxShadow: 'var(--orange-glow-sm)',
            }}
          />
        ))}
      </div>
      <div style={{ textAlign: 'center' }}>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '15px',
            color: 'var(--text)',
            letterSpacing: '.04em',
            margin: 0,
          }}
        >
          Analysing with Gemini
        </p>
        <p
          style={{
            fontSize: '12px',
            color: 'var(--text-dim)',
            animation: 'fadeIn 0.5s ease 0.3s both',
            margin: '0.5rem 0 0',
          }}
        >
          Identifying ingredients • Calculating macros • Finding spots nearby
        </p>
      </div>
      <div
        style={{
          width: '100%',
          maxWidth: '320px',
          height: '1px',
          position: 'relative',
          overflow: 'hidden',
          background: 'var(--border)',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 0,
            width: '30%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, var(--orange), transparent)',
            animation: 'scanLine 1.5s linear infinite',
          }}
        />
      </div>
    </div>
  )
}
