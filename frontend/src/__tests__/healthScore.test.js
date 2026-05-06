import { describe, expect, it } from 'vitest'
import { getColor, getHealthLabel } from '../utils/healthScore.js'

describe('health score helpers', () => {
  it('maps low scores to red', () => {
    expect(getColor(1)).toBe('#FF3D3D')
    expect(getHealthLabel(3)).toBe('⚠ Unhealthy')
  })

  it('maps moderate scores to amber', () => {
    expect(getColor(4)).toBe('#FFB300')
    expect(getHealthLabel(6)).toBe('~ Moderate')
  })

  it('maps high scores to green', () => {
    expect(getColor(7)).toBe('#00E676')
    expect(getHealthLabel(9)).toBe('✓ Healthy')
  })

  it('respects boundaries', () => {
    expect(getColor(3)).toBe('#FF3D3D')
    expect(getColor(4)).toBe('#FFB300')
    expect(getColor(6)).toBe('#FFB300')
    expect(getColor(7)).toBe('#00E676')
  })
})
