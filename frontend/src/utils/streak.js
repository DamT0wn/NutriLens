const KEY = 'nutrilens_streak_v1'
const DATE_KEY = 'nutrilens_streak_date'

function getTodayKey() {
  return new Date().toISOString().slice(0, 10)
}

function readValue(key) {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(key)
}

function writeValue(key, value) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(key, value)
}

function resetIfNewDay() {
  const storedDate = readValue(DATE_KEY)
  const today = getTodayKey()

  if (!storedDate) {
    writeValue(DATE_KEY, today)
    return
  }

  if (storedDate !== today) {
    writeValue(KEY, '0')
    writeValue(DATE_KEY, today)
  }
}

export function getStreak() {
  resetIfNewDay()
  return Number(readValue(KEY) || '0')
}

export function incrementStreak() {
  resetIfNewDay()
  const nextValue = getStreak() + 1
  writeValue(KEY, String(nextValue))
  writeValue(DATE_KEY, getTodayKey())
  return nextValue
}

export function resetStreak() {
  writeValue(KEY, '0')
  writeValue(DATE_KEY, getTodayKey())
}
