import { Loader } from '@googlemaps/js-api-loader'
import { useEffect, useMemo, useRef, useState } from 'react'

const darkMapStyles = [
  { elementType: 'geometry', stylers: [{ color: '#1a1a1a' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#888880' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0a0a0a' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2a2a2a' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#111111' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0d0d0d' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
]

function buildPin(color, number) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
      <circle cx="14" cy="14" r="10" fill="${color}" stroke="#f0ede8" stroke-width="2" />
      <text x="14" y="18" font-size="10" text-anchor="middle" fill="#0a0a0a" font-family="Arial" font-weight="700">${number}</text>
    </svg>
  `)}`
}

function buildUserPin() {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
      <circle cx="14" cy="14" r="10" fill="#ff5c00" stroke="#f0ede8" stroke-width="2" />
      <circle cx="14" cy="14" r="14" fill="none" stroke="#ff5c00" stroke-width="2" opacity="0.4" />
    </svg>
  `)}`
}

export default function MapView({ userLocation, places = [] }) {
  const mapRef = useRef(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const mapInstanceRef = useRef(null)
  const infoWindowRef = useRef(null)
  const markersRef = useRef([])

  const loader = useMemo(
    () => new Loader({ apiKey: import.meta.env.VITE_MAPS_API_KEY || '', version: 'weekly' }),
    [],
  )

  useEffect(() => {
    let isMounted = true

    async function initMap() {
      if (!mapRef.current || !import.meta.env.VITE_MAPS_API_KEY) {
        setMapLoaded(false)
        return
      }

      try {
        await loader.load()

        if (!isMounted) {
          return
        }

        const google = window.google
        const center = userLocation || { lat: 37.7749, lng: -122.4194 }

        mapInstanceRef.current = new google.maps.Map(mapRef.current, {
          center,
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
          styles: darkMapStyles,
          disableDefaultUI: false,
        })

        infoWindowRef.current = new google.maps.InfoWindow()

        markersRef.current.forEach((marker) => marker.setMap?.(null))
        markersRef.current = []

        const userMarker = new google.maps.Marker({
          map: mapInstanceRef.current,
          position: center,
          icon: {
            url: buildUserPin(),
            scaledSize: new google.maps.Size(28, 28),
          },
          title: 'Your location',
        })

        markersRef.current.push(userMarker)

        places.slice(0, 3).forEach((place, index) => {
          const marker = new google.maps.Marker({
            map: mapInstanceRef.current,
            position: place.location || center,
            icon: {
              url: buildPin('#00e676', index + 1),
              scaledSize: new google.maps.Size(28, 28),
            },
            title: place.name,
          })

          marker.addListener('click', () => {
            infoWindowRef.current?.setContent?.(`
              <div style="background:#1a1a1a;color:#f0ede8;padding:10px 12px;border-radius:10px;min-width:180px;">
                <div style="font-family:Syne,sans-serif;font-weight:700;font-size:13px;">${place.name}</div>
                <div style="color:#ffb300;font-size:12px;margin-top:4px;">⭐ ${place.rating ?? 4.6}</div>
                <a href="${place.mapsUrl || '#'}" target="_blank" rel="noreferrer" style="display:inline-block;margin-top:6px;color:#ff5c00;font-size:11px;">Open in Maps →</a>
              </div>
            `)
            infoWindowRef.current?.open?.(mapInstanceRef.current, marker)
          })

          markersRef.current.push(marker)
        })

        setMapLoaded(true)
      } catch {
        setMapLoaded(false)
      }
    }

    initMap()

    return () => {
      isMounted = false
    }
  }, [loader, places, userLocation])

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        infoWindowRef.current?.close?.()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <section>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '13px',
          letterSpacing: '.08em',
          color: 'var(--text-dim)',
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}
      >
        Healthier spots near you
      </div>
      <div
        style={{
          height: '280px',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: '0.5px solid var(--border)',
          animation: 'fadeIn 0.6s ease 0.3s both',
          background: 'var(--surface2)',
          position: 'relative',
        }}
      >
        {import.meta.env.VITE_MAPS_API_KEY ? (
          <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background:
                'radial-gradient(circle at 20% 20%, rgba(255,92,0,0.18), transparent 30%), radial-gradient(circle at 80% 75%, rgba(0,230,118,0.14), transparent 28%), linear-gradient(135deg, #141414, #0a0a0a)',
              position: 'relative',
            }}
          >
            <div style={{ position: 'absolute', inset: '1rem', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)' }} />
            <div style={{ position: 'absolute', left: '22%', top: '28%', width: '14px', height: '14px', borderRadius: '50%', background: 'var(--orange)', boxShadow: 'var(--orange-glow)' }} />
            <div style={{ position: 'absolute', left: '62%', top: '56%', width: '14px', height: '14px', borderRadius: '50%', background: 'var(--green)', boxShadow: 'var(--green-glow)' }} />
            <div style={{ position: 'absolute', left: '72%', top: '38%', width: '14px', height: '14px', borderRadius: '50%', background: 'var(--green)', boxShadow: 'var(--green-glow)' }} />
            <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem', color: 'var(--text-dim)', fontSize: '12px' }}>
              {mapLoaded ? 'Live map loaded.' : 'Add VITE_MAPS_API_KEY to enable the live Google Map.'}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
