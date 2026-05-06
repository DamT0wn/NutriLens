export default function StreakBanner({ streak }) {
  if (!streak) {
    return null
  }

  return (
    <div
      style={{
        background: 'var(--green-dim)',
        border: '0.5px solid rgba(0, 230, 118, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        animation: 'bounceIn 0.4s var(--ease-spring)',
      }}
    >
      <span aria-hidden="true" style={{ fontSize: '24px' }}>
        🔥
      </span>
      <div>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', color: 'var(--green)' }}>
          {streak} healthy meal{streak !== 1 ? 's' : ''} today
        </span>
        <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>Keep the streak alive! 💪</div>
      </div>
    </div>
  )
}
