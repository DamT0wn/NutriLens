export function getScoreTheme(score) {
  if (score <= 3) {
    return {
      accent: '#FF3D3D',
      dim: 'var(--red-dim)',
      label: '⚠ Unhealthy',
      glow: '#FF3D3D33',
    }
  }

  if (score <= 6) {
    return {
      accent: '#FFB300',
      dim: 'var(--amber-dim)',
      label: '~ Moderate',
      glow: '#FFB30033',
    }
  }

  return {
    accent: '#00E676',
    dim: 'var(--green-dim)',
    label: '✓ Healthy',
    glow: '#00E67633',
  }
}

export function getHealthLabel(score) {
  return getScoreTheme(score).label
}

export function getColor(score) {
  return getScoreTheme(score).accent
}
