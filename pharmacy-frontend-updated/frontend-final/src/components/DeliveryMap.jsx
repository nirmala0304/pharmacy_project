import { useEffect, useRef, useState, useCallback } from 'react'

const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
const LEAFLET_JS  = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'

let leafletLoaded  = false
let leafletLoading = false
const leafletQueue = []

function loadLeaflet(cb) {
  if (leafletLoaded) return cb()
  leafletQueue.push(cb)
  if (leafletLoading) return
  leafletLoading = true
  if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'; link.href = LEAFLET_CSS
    document.head.appendChild(link)
  }
  const script = document.createElement('script')
  script.src = LEAFLET_JS
  script.onload  = () => { leafletLoaded = true; leafletQueue.forEach(fn => fn()); leafletQueue.length = 0 }
  script.onerror = () => { leafletLoading = false }
  document.head.appendChild(script)
}

function makePin(color, label) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="46" viewBox="0 0 34 46">
    <filter id="s"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/></filter>
    <path d="M17 0C7.6 0 0 7.6 0 17c0 12.5 17 29 17 29S34 29.5 34 17C34 7.6 26.4 0 17 0z" fill="${color}" filter="url(#s)"/>
    <circle cx="17" cy="17" r="9" fill="white" opacity="0.95"/>
    <text x="17" y="21" text-anchor="middle" font-size="11" font-family="Arial">${label}</text>
  </svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

const DEST_PIN  = makePin('#ef4444', '📍')
const AGENT_PIN = makePin('#0f9e6e', '🛵')

export default function DeliveryMap({ deliveryLocation, currentLocation, estimatedTime }) {
  const container    = useRef(null)
  const mapRef       = useRef(null)
  const agentRef     = useRef(null)
  const routeRef     = useRef(null)
  const prevCoordRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)

  const dest  = deliveryLocation || [9.9252, 78.1198]   // fallback: Madurai
  const start = currentLocation  || [9.9800, 78.1600]

  useEffect(() => { loadLeaflet(() => setReady(true)) }, [])

  // ── Init map ──
  useEffect(() => {
    if (!ready || !container.current) return
    const L = window.L; if (!L) return
    setError(null)

    try {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }

      const map = L.map(container.current, { zoomControl: true }).setView(dest, 14)
      mapRef.current = map

      // Clean light tile layer — clearly readable
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      // Delivery destination marker
      const destIcon = L.icon({ iconUrl: DEST_PIN, iconSize: [34, 46], iconAnchor: [17, 46], popupAnchor: [0, -48] })
      L.marker(dest, { icon: destIcon })
        .bindPopup('<div style="font-size:13px;font-weight:700">📍 Your Delivery Address</div>')
        .addTo(map)
        .openPopup()

      // Agent marker
      const agIcon = L.icon({ iconUrl: AGENT_PIN, iconSize: [34, 46], iconAnchor: [17, 46], popupAnchor: [0, -48] })
      agentRef.current = L.marker(start, { icon: agIcon })
        .bindPopup('<div style="font-size:13px;font-weight:700">🛵 Delivery Agent</div>')
        .addTo(map)

      // Route line
      routeRef.current = L.polyline([start, dest], {
        color: '#0f9e6e', weight: 4, dashArray: '10 6', opacity: 0.85
      }).addTo(map)

      map.fitBounds([start, dest], { padding: [60, 60] })
      setLastUpdate(new Date())
    } catch (err) {
      setError('Map failed to load: ' + err.message)
    }

    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null } }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  // ── Smooth agent movement animation ──
  const animate = useCallback((from, to, steps = 50) => {
    const L = window.L; if (!L || !agentRef.current) return
    const dLat = (to[0] - from[0]) / steps
    const dLng = (to[1] - from[1]) / steps
    let step = 0
    const timer = setInterval(() => {
      if (!agentRef.current) { clearInterval(timer); return }
      step++
      agentRef.current.setLatLng([from[0] + dLat * step, from[1] + dLng * step])
      if (step >= steps) clearInterval(timer)
    }, 16)
  }, [])

  // ── Update agent when prop changes ──
  useEffect(() => {
    if (!ready || !agentRef.current) return
    const newCoords = currentLocation
    if (!newCoords) return
    const prev = prevCoordRef.current || start
    animate(prev, newCoords)
    routeRef.current?.setLatLngs([newCoords, dest])
    prevCoordRef.current = newCoords
    setLastUpdate(new Date())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocation, ready])

  // ── Simulated movement when no live coords ──
  useEffect(() => {
    if (currentLocation || !ready || !agentRef.current) return
    const L = window.L; if (!L) return

    const tick = () => {
      if (!agentRef.current) return
      const cur = agentRef.current.getLatLng()
      const dLat = dest[0] - cur.lat, dLng = dest[1] - cur.lng
      const dist = Math.sqrt(dLat ** 2 + dLng ** 2)
      if (dist < 0.0005) return
      const newLat = cur.lat + dLat * 0.025 + (Math.random() - 0.5) * 0.0003
      const newLng = cur.lng + dLng * 0.025 + (Math.random() - 0.5) * 0.0003
      animate([cur.lat, cur.lng], [newLat, newLng])
      routeRef.current?.setLatLngs([[newLat, newLng], dest])
      setLastUpdate(new Date())
    }
    const iv = setInterval(tick, 4000)
    return () => clearInterval(iv)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, currentLocation])

  const ago = lastUpdate
    ? `${Math.floor((Date.now() - lastUpdate.getTime()) / 1000)}s ago`
    : null

  return (
    <div style={{ borderRadius: 'var(--r-lg)', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--surface-0)' }}>
      {/* Header */}
      <div style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--border)', background: 'var(--surface-1)' }}>
        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-1)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e',
            boxShadow: '0 0 0 2px #bbf7d0', display: 'inline-block',
            animation: 'pulseDot 1.8s ease-in-out infinite' }} />
          Live Delivery Tracking
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {estimatedTime && (
            <span style={{ background: 'var(--pc-green-light)', color: 'var(--pc-green-dark)',
              padding: '0.2em 0.75em', borderRadius: '50rem', fontSize: '0.75rem', fontWeight: 700 }}>
              <i className="bi bi-clock me-1" />{estimatedTime}
            </span>
          )}
          {ago && <span style={{ color: 'var(--text-4)', fontSize: '0.7rem' }}>{ago}</span>}
        </div>
      </div>

      {/* Map */}
      <div style={{ position: 'relative' }}>
        {error && (
          <div style={{ margin: '1rem', background: 'var(--pc-amber-light)', borderRadius: 'var(--r-md)', padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#92400e' }}>
            <i className="bi bi-exclamation-triangle me-2" />{error}
          </div>
        )}
        {!ready && !error && (
          <div style={{ height: 380, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', color: 'var(--text-3)' }}>
              <div className="spinner-border spinner-border-sm mb-2" style={{ color: 'var(--pc-green)' }} />
              <div style={{ fontSize: '0.82rem' }}>Loading map…</div>
            </div>
          </div>
        )}
        <div ref={container} style={{ height: 380, width: '100%', display: (ready && !error) ? 'block' : 'none' }} />
      </div>

      {/* Legend */}
      <div style={{ padding: '0.6rem 1rem', borderTop: '1px solid var(--border)', background: 'var(--surface-1)',
        display: 'flex', gap: '1.5rem', fontSize: '0.78rem', color: 'var(--text-3)' }}>
        <span><span style={{ color: '#0f9e6e', fontWeight: 800, marginRight: 4 }}>●</span>Delivery Agent</span>
        <span><span style={{ color: '#ef4444', fontWeight: 800, marginRight: 4 }}>●</span>Your Address</span>
        {!currentLocation && <span style={{ color: 'var(--text-4)', fontStyle: 'italic' }}>Demo simulation</span>}
      </div>
    </div>
  )
}
