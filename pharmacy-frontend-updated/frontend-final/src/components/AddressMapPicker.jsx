/**
 * AddressMapPicker
 * A Leaflet map embedded in the address form.
 * - Shows the geocoded location of the typed address
 * - User can drag the pin to fine-tune their exact location
 * - Emits { lat, lng } back to parent via onLocationSelect
 */
import { useEffect, useRef, useState, useCallback } from 'react'

const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
const LEAFLET_JS  = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'

let _loaded  = false
let _loading = false
const _queue = []

function loadLeaflet(cb) {
  if (_loaded) return cb()
  _queue.push(cb)
  if (_loading) return
  _loading = true
  if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'; link.href = LEAFLET_CSS
    document.head.appendChild(link)
  }
  const script = document.createElement('script')
  script.src = LEAFLET_JS
  script.onload  = () => { _loaded = true; _queue.forEach(f => f()); _queue.length = 0 }
  script.onerror = () => { _loading = false }
  document.head.appendChild(script)
}

function makeDraggablePin(color = '#0f9e6e') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="46" viewBox="0 0 34 46">
    <filter id="sh"><feDropShadow dx="0" dy="3" stdDeviation="2.5" flood-opacity="0.35"/></filter>
    <path d="M17 0C7.6 0 0 7.6 0 17c0 12.5 17 29 17 29S34 29.5 34 17C34 7.6 26.4 0 17 0z"
          fill="${color}" filter="url(#sh)"/>
    <circle cx="17" cy="17" r="10" fill="white"/>
    <circle cx="17" cy="17" r="5" fill="${color}"/>
  </svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

const PIN_URL = makeDraggablePin('#0f9e6e')

export default function AddressMapPicker({ address, onLocationSelect, initialLat, initialLng }) {
  const container   = useRef(null)
  const mapRef      = useRef(null)
  const markerRef   = useRef(null)
  const [ready, setReady]           = useState(false)
  const [geocoding, setGeocoding]   = useState(false)
  const [geoError, setGeoError]     = useState('')
  const [pickedCoords, setPickedCoords] = useState(
    initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null
  )

  useEffect(() => { loadLeaflet(() => setReady(true)) }, [])

  // ── Init map ──
  useEffect(() => {
    if (!ready || !container.current) return
    const L = window.L; if (!L) return

    const defaultCenter = initialLat && initialLng
      ? [initialLat, initialLng]
      : [9.9252, 78.1198]  // Madurai default

    const map = L.map(container.current, { zoomControl: true }).setView(defaultCenter, 15)
    mapRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    const icon = L.icon({ iconUrl: PIN_URL, iconSize: [34, 46], iconAnchor: [17, 46], popupAnchor: [0, -48] })

    const marker = L.marker(defaultCenter, { icon, draggable: true })
      .addTo(map)
      .bindPopup('<div style="font-size:12px;font-weight:700;color:#0f9e6e">📍 Drag to set exact location</div>')
      .openPopup()
    markerRef.current = marker

    // On drag end — update coordinates
    marker.on('dragend', (e) => {
      const { lat, lng } = e.target.getLatLng()
      const coords = { lat: parseFloat(lat.toFixed(6)), lng: parseFloat(lng.toFixed(6)) }
      setPickedCoords(coords)
      onLocationSelect(coords)
      setGeoError('')
    })

    // Click on map to move pin
    map.on('click', (e) => {
      const { lat, lng } = e.latlng
      marker.setLatLng([lat, lng])
      const coords = { lat: parseFloat(lat.toFixed(6)), lng: parseFloat(lng.toFixed(6)) }
      setPickedCoords(coords)
      onLocationSelect(coords)
      setGeoError('')
    })

    if (initialLat && initialLng) {
      setPickedCoords({ lat: initialLat, lng: initialLng })
    }

    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null } }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  // ── Geocode typed address ──
  const geocodeAddress = useCallback(async () => {
    const q = [address.street, address.city, address.state, address.zipCode, address.country || 'India']
      .filter(Boolean).join(', ')
    if (!q.trim() || q.length < 8) return setGeoError('Please fill in more address details first.')

    setGeocoding(true); setGeoError('')
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&countrycodes=in`,
        { headers: { 'User-Agent': 'PharmaCareApp/1.0' } }
      )
      const data = await res.json()

      if (!data || data.length === 0) {
        // Try city-only fallback
        const city = [address.city, address.state, 'India'].filter(Boolean).join(', ')
        const res2 = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1&countrycodes=in`,
          { headers: { 'User-Agent': 'PharmaCareApp/1.0' } }
        )
        const data2 = await res2.json()
        if (!data2 || data2.length === 0) {
          setGeoError('Location not found. Please drag the pin to your address manually.')
          return
        }
        data[0] = data2[0]
      }

      const lat = parseFloat(data[0].lat)
      const lng = parseFloat(data[0].lon)

      if (mapRef.current && markerRef.current) {
        mapRef.current.setView([lat, lng], 16)
        markerRef.current.setLatLng([lat, lng])
      }

      const coords = { lat, lng }
      setPickedCoords(coords)
      onLocationSelect(coords)
    } catch {
      setGeoError('Geocoding failed. Please drag the pin to your location manually.')
    } finally {
      setGeocoding(false)
    }
  }, [address, onLocationSelect])

  // ── Use device GPS ──
  const useMyLocation = useCallback(() => {
    if (!navigator.geolocation) return setGeoError('Geolocation not supported by your browser.')
    setGeocoding(true); setGeoError('')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        if (mapRef.current && markerRef.current) {
          mapRef.current.setView([lat, lng], 17)
          markerRef.current.setLatLng([lat, lng])
        }
        const coords = { lat: parseFloat(lat.toFixed(6)), lng: parseFloat(lng.toFixed(6)) }
        setPickedCoords(coords)
        onLocationSelect(coords)
        setGeocoding(false)
      },
      (err) => {
        setGeoError('Could not get your location: ' + err.message)
        setGeocoding(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [onLocationSelect])

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <button type="button"
          onClick={geocodeAddress}
          disabled={geocoding}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem',
            background: 'var(--pc-green)', color: '#fff', border: 'none',
            borderRadius: 'var(--r-md)', padding: '0.45rem 0.9rem',
            fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
            transition: 'all var(--dur-fast)', opacity: geocoding ? 0.7 : 1 }}>
          {geocoding
            ? <><span className="spinner-border spinner-border-sm" /> Locating...</>
            : <><i className="bi bi-search" /> Find on Map</>}
        </button>

        <button type="button"
          onClick={useMyLocation}
          disabled={geocoding}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem',
            background: 'var(--pc-blue-light)', color: 'var(--pc-blue)',
            border: '1.5px solid rgba(37,99,235,0.25)', borderRadius: 'var(--r-md)',
            padding: '0.45rem 0.9rem', fontSize: '0.8rem', fontWeight: 700,
            cursor: 'pointer', transition: 'all var(--dur-fast)' }}>
          <i className="bi bi-geo-alt-fill" /> Use My Location
        </button>

        {pickedCoords && (
          <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--text-3)',
            background: 'var(--surface-1)', padding: '0.3em 0.7em', borderRadius: 'var(--r-sm)',
            border: '1px solid var(--border)' }}>
            <i className="bi bi-check-circle-fill me-1" style={{ color: 'var(--pc-green)' }} />
            {pickedCoords.lat.toFixed(4)}, {pickedCoords.lng.toFixed(4)}
          </span>
        )}
      </div>

      {/* Error */}
      {geoError && (
        <div style={{ background: 'var(--pc-amber-light)', borderRadius: 'var(--r-md)',
          padding: '0.6rem 0.875rem', fontSize: '0.8rem', color: '#92400e',
          marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <i className="bi bi-exclamation-triangle-fill flex-shrink-0" />{geoError}
        </div>
      )}

      {/* Map */}
      <div style={{ position: 'relative', borderRadius: 'var(--r-lg)', overflow: 'hidden',
        border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        {!ready && (
          <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--surface-2)', color: 'var(--text-3)' }}>
            <div className="text-center">
              <div className="spinner-border spinner-border-sm mb-2" style={{ color: 'var(--pc-green)' }} />
              <div style={{ fontSize: '0.78rem' }}>Loading map…</div>
            </div>
          </div>
        )}
        <div ref={container} style={{ height: 260, width: '100%', display: ready ? 'block' : 'none' }} />

        {/* Overlay hint */}
        {ready && !pickedCoords && (
          <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(255,255,255,0.95)', borderRadius: 'var(--r-md)',
            padding: '0.4rem 0.85rem', fontSize: '0.75rem', fontWeight: 600,
            color: 'var(--text-2)', boxShadow: 'var(--shadow-sm)', pointerEvents: 'none',
            border: '1px solid var(--border)', whiteSpace: 'nowrap' }}>
            <i className="bi bi-cursor-fill me-1" style={{ color: 'var(--pc-green)' }} />
            Click map or drag pin to set location
          </div>
        )}
      </div>

      <p style={{ margin: '0.4rem 0 0', fontSize: '0.72rem', color: 'var(--text-4)', lineHeight: 1.45 }}>
        <i className="bi bi-info-circle me-1" />
        Click "Find on Map" to auto-locate from your typed address, or drag the green pin to fine-tune. Your exact coordinates are saved for precise delivery.
      </p>
    </div>
  )
}
