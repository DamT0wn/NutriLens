import { useEffect, useRef, useState } from 'react'

export default function OrangeCursor() {
  const [isFinePointer, setIsFinePointer] = useState(false)
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const ringPositionRef = useRef({ x: 0, y: 0 })
  const targetPositionRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef(0)

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine)')
    setIsFinePointer(media.matches)

    const handleChange = (event) => setIsFinePointer(event.matches)
    media.addEventListener('change', handleChange)

    return () => media.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (!isFinePointer) {
      document.body.style.cursor = ''
      return undefined
    }

    document.body.style.cursor = 'none'

    const updateRing = () => {
      ringPositionRef.current.x += (targetPositionRef.current.x - ringPositionRef.current.x) * 0.18
      ringPositionRef.current.y += (targetPositionRef.current.y - ringPositionRef.current.y) * 0.18

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPositionRef.current.x}px, ${ringPositionRef.current.y}px, 0) translate(-50%, -50%)`
      }

      rafRef.current = window.requestAnimationFrame(updateRing)
    }

    const handleMove = (event) => {
      targetPositionRef.current = { x: event.clientX, y: event.clientY }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`
      }
    }

    const handleOver = (event) => {
      if (!ringRef.current) {
        return
      }

      const interactive = event.target.closest('button, a, input, [role="button"]')
      ringRef.current.style.width = interactive ? '48px' : '32px'
      ringRef.current.style.height = interactive ? '48px' : '32px'
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseover', handleOver)
    rafRef.current = window.requestAnimationFrame(updateRing)

    return () => {
      document.body.style.cursor = ''
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseover', handleOver)
      window.cancelAnimationFrame(rafRef.current)
    }
  }, [isFinePointer])

  if (!isFinePointer) {
    return null
  }

  return (
    <>
      <span
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'var(--orange)',
          boxShadow: 'var(--orange-glow-sm)',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
        }}
      />
      <span
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: '1px solid var(--orange)',
          pointerEvents: 'none',
          zIndex: 9998,
          transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
          transition: 'width 0.2s ease, height 0.2s ease',
        }}
      />
    </>
  )
}
