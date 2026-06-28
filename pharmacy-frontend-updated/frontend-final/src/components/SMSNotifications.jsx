import { useEffect, useState, useCallback } from 'react'
import api from '../api/axiosConfig'

// ─── Browser Push Notification helpers ───────────────────────────────────────
const PUSH_SUPPORTED = 'Notification' in window

async function requestBrowserPermission() {
  if (!PUSH_SUPPORTED) return 'unsupported'
  if (Notification.permission === 'granted') return 'granted'
  if (Notification.permission === 'denied') return 'denied'
  const result = await Notification.requestPermission()
  return result
}

function sendBrowserNotification(title, body, icon = '💊') {
  if (!PUSH_SUPPORTED || Notification.permission !== 'granted') return
  try {
    new Notification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'pharmacy-order-update',
      requireInteraction: false,
    })
  } catch {
    // Some browsers may block even after permission granted
  }
}

// Track last-seen notification so we only alert on NEW ones
const seenNotifIds = new Set()

export default function SMSNotifications({ orderId }) {
  const [notifications, setNotifications] = useState([])
  const [smsEnabled, setSmsEnabled] = useState(true)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [message, setMessage] = useState(null)
  const [pushPermission, setPushPermission] = useState(PUSH_SUPPORTED ? Notification.permission : 'unsupported')
  const [pushRequesting, setPushRequesting] = useState(false)

  const showMsg = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 4000)
  }

  const fetchPreferences = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    else setRefreshing(true)
    try {
      const res = await api.get(`/orders/${orderId}/sms-preferences`)
      setSmsEnabled(res.data.enabled ?? true)
      setPhoneNumber(res.data.phoneNumber || '')
      const newNotifs = res.data.notifications || []

      // Fire browser push for any new notifications
      if (Notification.permission === 'granted') {
        newNotifs.forEach(n => {
          const key = `${orderId}-${n.sentAt}-${n.type}`
          if (!seenNotifIds.has(key)) {
            seenNotifIds.add(key)
            // Only push if this was loaded after initial load (silent refresh)
            if (silent) {
              sendBrowserNotification(
                '📦 Order Update',
                n.message || `Your order status changed to ${n.type}`,
              )
            } else {
              seenNotifIds.add(key) // mark as seen without alerting on initial load
            }
          }
        })
      }

      setNotifications(newNotifs)
    } catch {
      // ignore
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [orderId])

  useEffect(() => {
    fetchPreferences()
    const interval = setInterval(() => fetchPreferences(true), 30000)
    return () => clearInterval(interval)
  }, [fetchPreferences])

  // Keep permission state in sync (user may change in browser settings)
  useEffect(() => {
    if (!PUSH_SUPPORTED) return
    const timer = setInterval(() => {
      if (Notification.permission !== pushPermission) {
        setPushPermission(Notification.permission)
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [pushPermission])

  const handleEnablePush = async () => {
    setPushRequesting(true)
    const result = await requestBrowserPermission()
    setPushPermission(result)
    setPushRequesting(false)
    if (result === 'granted') {
      showMsg('success', '🔔 Browser notifications enabled! You will see popups for order updates.')
      // Send a test notification
      sendBrowserNotification('✅ Notifications Active', 'You will now receive order update popups in this browser.')
    } else if (result === 'denied') {
      showMsg('error', 'Browser notifications were blocked. Please enable them in your browser settings.')
    }
  }

  const cleanPhone = (v) => v.replace(/\D/g, '').trim()

  const handleSave = async () => {
    const cleaned = cleanPhone(phoneNumber)
    if (!cleaned || cleaned.length < 10) {
      showMsg('error', 'Enter a valid 10-digit mobile number.')
      return
    }
    setSaving(true)
    try {
      await api.put(`/orders/${orderId}/sms-preferences`, {
        enabled: true,
        phoneNumber: cleaned
      })
      setSmsEnabled(true)
      setPhoneNumber(cleaned)
      showMsg('success', '✅ Phone number saved! You will receive SMS updates when your order status changes.')
    } catch {
      showMsg('error', 'Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const toggleSMS = async () => {
    const newEnabled = !smsEnabled
    const cleaned = cleanPhone(phoneNumber)
    if (newEnabled && (!cleaned || cleaned.length < 10)) {
      showMsg('error', 'Enter a valid 10-digit number before enabling SMS.')
      return
    }
    setSaving(true)
    try {
      await api.put(`/orders/${orderId}/sms-preferences`, {
        enabled: newEnabled,
        phoneNumber: cleaned
      })
      setSmsEnabled(newEnabled)
      showMsg('success', newEnabled ? 'SMS notifications enabled.' : 'SMS notifications disabled.')
    } catch {
      showMsg('error', 'Failed to update preferences.')
    } finally {
      setSaving(false)
    }
  }

  const statusLabels = {
    CONFIRMED:          { label: 'Order Confirmed',    color: 'primary', icon: 'bi-check-circle-fill' },
    PROCESSING:         { label: 'Processing',         color: 'info',    icon: 'bi-gear-fill' },
    SHIPPED:            { label: 'Shipped',             color: 'info',    icon: 'bi-truck' },
    OUT_FOR_DELIVERY:   { label: 'Out for Delivery',   color: 'warning', icon: 'bi-bicycle' },
    DELIVERY_ATTEMPTED: { label: 'Delivery Attempted', color: 'warning', icon: 'bi-exclamation-circle' },
    DELIVERED:          { label: 'Delivered',          color: 'success', icon: 'bi-bag-check-fill' },
    CANCELLED:          { label: 'Cancelled',          color: 'danger',  icon: 'bi-x-circle-fill' },
  }

  if (loading) return (
    <div className="card border-0 shadow-sm mb-3 p-3 text-center" style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)' }}>
      <div className="spinner-border spinner-border-sm text-primary me-2"></div>
      <small className="text-muted">Loading notifications...</small>
    </div>
  )

  return (
    <div className="card border-0 shadow-sm mb-3" style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)', border: '1px solid var(--pc-green-light) !important' }}>
      {/* Header */}
      <div className="card-header bg-transparent d-flex align-items-center justify-content-between py-3">
        <div className="d-flex align-items-center gap-2">
          <div className="rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 36, height: 36, background: 'var(--pc-green-light)', border: '1px solid var(--pc-green-mid)' }}>
            <i className="bi bi-bell-fill" style={{ color: 'var(--pc-green)' }}></i>
          </div>
          <div>
            <div className="fw-bold mb-0">Notifications</div>
            <small className="text-muted">SMS + Browser alerts</small>
          </div>
        </div>
        <div className="form-check form-switch m-0">
          <input className="form-check-input" type="checkbox" id={`smsToggle-${orderId}`}
            checked={smsEnabled} onChange={toggleSMS} disabled={saving}
            style={{ width: '2.5rem', height: '1.25rem', cursor: 'pointer' }} />
          <label className="form-check-label fw-semibold small" htmlFor={`smsToggle-${orderId}`}>
            {smsEnabled
              ? <span style={{ color: '#43e97b' }}>SMS On</span>
              : <span className="text-muted">SMS Off</span>}
          </label>
        </div>
      </div>

      <div className="card-body p-3">
        {/* Success / error message */}
        {message && (
          <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} py-2 d-flex align-items-start gap-2 mb-3`}>
            <i className={`bi bi-${message.type === 'success' ? 'check-circle-fill' : 'exclamation-circle-fill'} mt-1`}></i>
            <span className="small">{message.text}</span>
          </div>
        )}

        {/* ── Browser Push Notification Section ── */}
        {PUSH_SUPPORTED && pushPermission !== 'granted' && (
          <div className="notif-permission-banner mb-3">
            <div className="notif-icon">
              <i className="bi bi-bell"></i>
            </div>
            <div className="flex-grow-1">
              <div className="fw-semibold small mb-1">
                {pushPermission === 'denied'
                  ? '🔕 Browser notifications blocked'
                  : '🔔 Get browser notifications'}
              </div>
              <div className="text-muted" style={{ fontSize: '0.78rem' }}>
                {pushPermission === 'denied'
                  ? 'Enable in browser settings → Site Settings → Notifications'
                  : 'See order updates as desktop popups even when tab is in background'}
              </div>
            </div>
            {pushPermission !== 'denied' && (
              <button
                className="btn btn-sm rounded-pill fw-semibold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, var(--pc-green), var(--pc-teal))', color: 'white', border: 'none' }}
                onClick={handleEnablePush}
                disabled={pushRequesting}
              >
                {pushRequesting
                  ? <span className="spinner-border spinner-border-sm"></span>
                  : <><i className="bi bi-bell-fill me-1"></i>Enable</>}
              </button>
            )}
          </div>
        )}

        {/* Browser push enabled indicator */}
        {PUSH_SUPPORTED && pushPermission === 'granted' && (
          <div className="d-flex align-items-center gap-2 mb-3 p-2 rounded-3"
            style={{ background: 'rgba(67,233,123,0.08)', border: '1px solid rgba(67,233,123,0.25)' }}>
            <span className="live-dot"></span>
            <small className="fw-semibold" style={{ color: '#43e97b' }}>
              Browser notifications active — you'll see popups for order updates
            </small>
          </div>
        )}

        {/* Phone number input */}
        <div className="mb-3">
          <label className="form-label fw-semibold small">
            <i className="bi bi-telephone me-1" style={{ color: 'var(--pc-green)' }}></i>Phone for SMS Updates
          </label>
          <div className="input-group">
            <span className="input-group-text fw-semibold">+91</span>
            <input
              type="tel"
              className="form-control"
              placeholder="9876543210"
              value={phoneNumber}
              maxLength={10}
              onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
            />
            <button className="btn btn-primary" type="button" onClick={handleSave} disabled={saving}>
              {saving
                ? <span className="spinner-border spinner-border-sm"></span>
                : <><i className="bi bi-save me-1"></i>Save</>}
            </button>
          </div>
          <small className="text-muted d-block mt-1">
            <i className="bi bi-info-circle me-1"></i>
            {smsEnabled
              ? 'You will receive SMS when your order status changes.'
              : 'Enable the toggle above to receive SMS updates.'}
          </small>
        </div>

        {/* Notification history */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <label className="small text-muted fw-semibold mb-0">
            <i className="bi bi-clock-history me-1"></i>Notification History
            {notifications.length > 0 && (
              <span className="badge ms-2 rounded-pill" style={{ background: 'var(--pc-green-light)', color: 'var(--pc-green)' }}>{notifications.length}</span>
            )}
          </label>
          <button
            className="btn btn-sm btn-outline-secondary py-0 px-2"
            onClick={() => fetchPreferences(true)}
            disabled={refreshing}
            title="Refresh notifications"
          >
            <i className={`bi bi-arrow-clockwise ${refreshing ? 'spin' : ''}`}></i>
          </button>
        </div>

        {notifications.length > 0 ? (
          <div style={{ maxHeight: 240, overflowY: 'auto' }}>
            {notifications.map((notif, idx) => {
              const meta = statusLabels[notif.type] || { label: notif.type, color: 'secondary', icon: 'bi-bell' }
              return (
                <div key={idx} className={`border-start border-3 border-${meta.color} ps-3 mb-3`}>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className={`badge bg-${meta.color} bg-opacity-10 text-${meta.color} fw-semibold small`}>
                      <i className={`bi ${meta.icon} me-1`}></i>{meta.label}
                    </span>
                    <small className="text-muted">
                      {new Date(notif.sentAt).toLocaleString('en-IN', {
                        day: 'numeric', month: 'short',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </small>
                  </div>
                  <p className="mb-0 mt-1 small text-body">{notif.message}</p>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="rounded p-3 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <i className="bi bi-bell-slash text-muted d-block mb-1" style={{ fontSize: '1.5rem' }}></i>
            <small className="text-muted d-block fw-semibold">No notifications yet</small>
            <small className="text-muted">
              Notifications appear here and as browser popups when the pharmacist updates your order status.
            </small>
          </div>
        )}
      </div>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
