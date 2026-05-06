import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getStreak, incrementStreak, resetStreak } from '../utils/streak.js'

const store = {}

beforeEach(() => {
  Object.keys(store).forEach((key) => delete store[key])
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-05-06T12:00:00.000Z'))
  vi.stubGlobal('window', {
    localStorage: {
      getItem: (key) => (key in store ? store[key] : null),
      setItem: (key, value) => {
        store[key] = String(value)
      },
      removeItem: (key) => {
        delete store[key]
      },
    },
  })
})

describe('streak utils', () => {
  it('increments, reads, and resets streak', () => {
    expect(getStreak()).toBe(0)
    expect(incrementStreak()).toBe(1)
    expect(getStreak()).toBe(1)
    resetStreak()
    expect(getStreak()).toBe(0)
  })

  it('auto-resets on a new day', () => {
    store.nutrilens_streak_v1 = '4'
    store.nutrilens_streak_date = '2026-05-05'

    expect(getStreak()).toBe(0)
    expect(store.nutrilens_streak_date).toBe('2026-05-06')
  })
})
