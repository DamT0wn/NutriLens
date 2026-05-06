export function getScoreTheme(score) {
  if (score <= 3) {
    return {
      accent: '#FF3D3D',
      badgeBg: '#FF3D3D',
      badgeText: '#000000',
      dim: 'var(--red-dim)',
      label: '⚠ Unhealthy',
      glow: '#FF3D3D33',
    }
  }

  if (score <= 6) {
    return {
      accent: '#FFB300',
      badgeBg: '#FFB300',
      badgeText: '#000000',
      dim: 'var(--amber-dim)',
      label: '~ Moderate',
      glow: '#FFB30033',
    }
  }

  return {
    accent: '#00E676',
    badgeBg: '#00E676',
    badgeText: '#000000',
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
