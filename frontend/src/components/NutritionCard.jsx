import { useEffect, useMemo, useState } from 'react'
import { getScoreTheme } from '../utils/healthScore.js'

export default function NutritionCard({ foodName, calories, protein_g, carbs_g, fat_g, healthScore, why }) {
  const theme = useMemo(() => getScoreTheme(healthScore), [healthScore])
  const [displayCalories, setDisplayCalories] = useState(0)

  useEffect(() => {
    const start = window.performance.now()
    const duration = 600
    let animationFrame = 0

    const tick = (time) => {
      const progress = Math.min(1, (time - start) / duration)
      setDisplayCalories(Math.round(calories * progress))

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(tick)
      }
    }

    animationFrame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(animationFrame)
  }, [calories])

  return (
    <section
      style={{
        background: 'var(--surface)',
        border: '0.5px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '0 0 auto',
          height: '2px',
          background: theme.accent,
          boxShadow: `0 0 16px ${theme.accent}`,
          animation: 'slideRight 0.5s var(--ease-out)',
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'start' }}>
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '22px',
              letterSpacing: '-0.02em',
              color: 'var(--text)',
              margin: 0,
            }}
          >
            {foodName}
          </h2>
          <div style={{ marginTop: '0.35rem', display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.3rem 0.55rem',
                borderRadius: '999px',
                background: theme.badgeBg,
                border: `0.5px solid ${theme.badgeBg}`,
                color: theme.badgeText,
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '.06em',
                textTransform: 'uppercase',
              }}
            >
              {theme.label}
            </span>
          </div>
        </div>
        <div
          style={{
            padding: '6px 14px',
            borderRadius: '20px',
            background: theme.badgeBg,
            border: `0.5px solid ${theme.badgeBg}`,
            animation: 'bounceIn 0.4s var(--ease-spring) 0.2s both, pulse 0.4s ease-in-out 1 0.6s',
            minWidth: '90px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-display)', color: theme.badgeText, lineHeight: 1 }}>
            {healthScore}
          </div>
          <div style={{ fontSize: '10px', fontWeight: 700, color: theme.badgeText, letterSpacing: '.06em', textTransform: 'uppercase', marginTop: '2px' }}>
            Score
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'end', gap: '0.2rem', marginTop: '1rem' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '48px', color: theme.accent, lineHeight: 0.95 }}>
          {displayCalories}
        </span>
        <span style={{ fontSize: '16px', color: 'var(--text-dim)', fontWeight: 300, marginBottom: '0.2rem' }}>kcal</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.65rem', marginTop: '1rem' }}>
        <div style={{ color: 'var(--text-dim)', fontSize: '12px' }}>Protein {protein_g}g</div>
        <div style={{ color: 'var(--text-dim)', fontSize: '12px' }}>Carbs {carbs_g}g</div>
        <div style={{ color: 'var(--text-dim)', fontSize: '12px' }}>Fat {fat_g}g</div>
        <div style={{ color: 'var(--text-dim)', fontSize: '12px' }}>Health {healthScore}/10</div>
      </div>

      <div
        style={{
          marginTop: '1rem',
          borderLeft: `3px solid ${theme.accent}`,
          padding: '0.75rem 1rem',
          background: theme.dim,
          borderRadius: `0 var(--radius-sm) var(--radius-sm) 0`,
          animation: 'fadeUp 0.4s ease 0.3s both',
        }}
      >
        <p style={{ fontSize: '13px', color: 'var(--text)', fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>{why}</p>
      </div>
    </section>
  )
}
