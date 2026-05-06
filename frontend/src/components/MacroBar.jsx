import { useEffect, useState } from 'react'

export default function MacroBar({ label, value, unit, max, color, delay = 0 }) {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100))
  const [fillWidth, setFillWidth] = useState(0)

  useEffect(() => {
    const timer = window.setTimeout(() => setFillWidth(percentage), delay * 1000)
    return () => window.clearTimeout(timer)
  }, [delay, percentage])

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span
          style={{
            fontSize: '12px',
            color: 'var(--text-dim)',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '.08em',
          }}
        >
          {label}
        </span>
        <span style={{ fontSize: '12px', color: 'var(--text)', fontWeight: 500 }}>
          {value}
          {unit}
        </span>
      </div>
      <div
        style={{
          width: '100%',
          height: '4px',
          background: 'var(--border)',
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      >
        <span
          style={{
            display: 'block',
            height: '100%',
            width: `${fillWidth}%`,
            borderRadius: '2px',
            background: color,
            boxShadow: `0 0 8px ${color}`,
            transition: 'width 0.8s var(--ease-out)',
          }}
        />
      </div>
    </div>
  )
}
