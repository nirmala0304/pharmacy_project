import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axiosConfig'
import OrderStatusBar from '../components/OrderStatusBar'
import DeliveryMap from '../components/DeliveryMap'
import SMSNotifications from '../components/SMSNotifications'

export default function OrderTracking() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [trackingData, setTrackingData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchTracking = useCallback(() => {
    api.get(`/orders/${id}/delivery-tracking`)
      .then(res => setTrackingData(res.data))
      .catch(() => {})
  }, [id])

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(res => setOrder(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
    fetchTracking()
    const interval = setInterval(fetchTracking, 15000)
    return () => clearInterval(interval)
  }, [id, fetchTracking])

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="text-center">
        <div className="spinner-border mb-3" style={{ width: '2.5rem', height: '2.5rem' }} role="status" />
        <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>Loading order tracking...</p>
      </div>
    </div>
  )
  if (!order) return (
    <div className="container py-5 text-center">
      <h5 style={{ color: 'var(--text-1)' }}>Order not found.</h5>
      <Link to="/orders" className="btn btn-outline-primary rounded-pill mt-3">Back to Orders</Link>
    </div>
  )

  const deliveryCoords = trackingData?.deliveryLatitude && trackingData?.deliveryLongitude
    ? [trackingData.deliveryLatitude, trackingData.deliveryLongitude] : null
  const currentCoords = trackingData?.currentLatitude && trackingData?.currentLongitude
    ? [trackingData.currentLatitude, trackingData.currentLongitude] : null
  const estimatedTimeLabel = trackingData?.estimatedTimeMinutes != null
    ? trackingData.estimatedTimeMinutes === 0 ? 'Arriving now!' : `~${trackingData.estimatedTimeMinutes} mins away`
    : null
  const showMap = order.status !== 'CANCELLED'

  const STATUS_CFG = {
    DELIVERED: { color: 'var(--pc-green)', bg: 'var(--pc-green-light)', icon: 'bi-check-circle-fill' },
    CANCELLED:  { color: 'var(--pc-red)',   bg: 'var(--pc-red-light)',   icon: 'bi-x-circle' },
    SHIPPED:    { color: 'var(--pc-amber)', bg: 'var(--pc-amber-light)', icon: 'bi-truck' },
    OUT_FOR_DELIVERY: { color: 'var(--pc-teal)', bg: 'var(--pc-teal-light)', icon: 'bi-truck' },
  }
  const sc = STATUS_CFG[order.status] || { color: 'var(--pc-blue)', bg: 'var(--pc-blue-light)', icon: 'bi-hourglass' }

  const fmtDate = d => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'

  return (
    <div style={{ background: 'var(--surface-1)', minHeight: '80vh', paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ background: 'var(--surface-0)', borderBottom: '1px solid var(--border)', padding: '1.25rem 0' }}>
        <div className="container">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, color: 'var(--text-1)', marginBottom: '0.1rem', fontSize: '1.5rem' }}>
                <i className="bi bi-truck me-2" style={{ color: 'var(--pc-green)' }} />Track Order
              </h2>
              <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', margin: 0 }}>
                Order #{order.id} · <span style={{ fontWeight: 600 }}>{order.trackingNumber}</span>
              </p>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              background: sc.bg, color: sc.color, padding: '0.4em 1em', borderRadius: 'var(--r-md)', fontWeight: 700, fontSize: '0.85rem' }}>
              <i className={`bi ${sc.icon}`} />{order.status.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      </div>

      <div className="container py-4">
        <div className="row g-4">
          {/* Left */}
          <div className="col-md-8">
            {/* Status tracker */}
            <div className="card mb-4">
              <div className="card-header fw-bold d-flex align-items-center gap-2">
                <i className="bi bi-map" style={{ color: 'var(--pc-green)' }} />
                Delivery Progress
              </div>
              <div className="card-body p-4">
                <OrderStatusBar status={order.status} />

                {/* Map */}
                {showMap && (
                  <div className="mt-4">
                    <div className="delivery-map-container">
                      <DeliveryMap
                        deliveryLocation={deliveryCoords}
                        currentLocation={currentCoords}
                        estimatedTime={estimatedTimeLabel}
                      />
                    </div>

                    {trackingData?.deliveryAgentName && (
                      <div className="d-flex align-items-center gap-3 mt-3 p-3 rounded-3"
                        style={{ background: 'var(--pc-teal-light)', border: '1px solid rgba(23,181,160,0.2)' }}>
                        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--pc-teal)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <i className="bi bi-person-badge" style={{ color: '#fff', fontSize: '1.1rem' }} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-1)', fontSize: '0.9rem' }}>
                            {trackingData.deliveryAgentName}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <span><i className="bi bi-telephone me-1" />{trackingData.deliveryAgentPhone}</span>
                            {trackingData.distanceKm != null && (
                              <span><i className="bi bi-pin-map me-1" />{trackingData.distanceKm.toFixed(1)} km away</span>
                            )}
                            {estimatedTimeLabel && (
                              <span style={{ color: 'var(--pc-teal)', fontWeight: 600 }}>
                                <i className="bi bi-clock me-1" />{estimatedTimeLabel}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Timeline dates */}
                <div className="row g-3 mt-1">
                  {[
                    { label: 'Order Placed',        val: fmtDate(order.placedAt),          icon: 'bi-bag-check',   color: 'var(--pc-green)' },
                    { label: 'Est. Delivery',        val: fmtDate(order.estimatedDelivery), icon: 'bi-calendar3',   color: 'var(--pc-blue)' },
                    order.deliveredAt && { label: 'Delivered On', val: fmtDate(order.deliveredAt), icon: 'bi-house-check', color: 'var(--pc-green)' },
                  ].filter(Boolean).map(d => (
                    <div className="col-6 col-md-4" key={d.label}>
                      <div style={{ background: 'var(--surface-1)', borderRadius: 'var(--r-md)', padding: '0.875rem' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <i className={`bi ${d.icon}`} style={{ color: d.color }} />{d.label}
                        </div>
                        <strong style={{ color: 'var(--text-1)', fontSize: '0.875rem' }}>{d.val}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="card">
              <div className="card-header fw-bold d-flex align-items-center gap-2">
                <i className="bi bi-bag" style={{ color: 'var(--pc-green)' }} />
                Order Items
              </div>
              <div className="table-responsive">
                <table className="table mb-0">
                  <thead>
                    <tr>
                      <th>Medicine</th><th>Qty</th><th>Unit Price</th><th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items?.map((item, idx) => (
                      <tr key={`item-${item.medicineName}-${idx}`}>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text-1)' }}>{item.medicineName}</div>
                          {item.medicineBrand && <small style={{ color: 'var(--text-3)' }}>{item.medicineBrand}</small>}
                        </td>
                        <td style={{ color: 'var(--text-2)' }}>{item.quantity}</td>
                        <td style={{ color: 'var(--text-2)' }}>₹{item.unitPrice}</td>
                        <td style={{ fontWeight: 700, color: 'var(--pc-green)' }}>₹{(item.unitPrice * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-between align-items-center px-4 py-3"
                style={{ borderTop: '1px solid var(--border)' }}>
                <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: 'var(--text-1)' }}>Total</span>
                <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '1.2rem', color: 'var(--pc-green)' }}>
                  ₹{order.totalAmount?.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="col-md-4">
            <SMSNotifications orderId={order.id} />

            {/* Delivery Address */}
            <div className="card mb-3">
              <div className="card-header fw-bold d-flex align-items-center gap-2">
                <i className="bi bi-geo-alt-fill" style={{ color: 'var(--pc-red)' }} />
                Delivery Address
              </div>
              <div className="card-body p-4">
                {order.deliveryAddress ? (
                  <div>
                    <p style={{ fontWeight: 700, color: 'var(--text-1)', margin: '0 0 0.35rem', fontSize: '0.9rem' }}>
                      {order.deliveryAddress.fullName}
                    </p>
                    {[
                      { icon: 'bi-house',      val: order.deliveryAddress.street },
                      { icon: 'bi-buildings',  val: `${order.deliveryAddress.city}, ${order.deliveryAddress.state} – ${order.deliveryAddress.zipCode}` },
                      { icon: 'bi-globe',      val: order.deliveryAddress.country || 'India' },
                      { icon: 'bi-telephone',  val: order.deliveryAddress.phone },
                    ].map((row, i) => (
                      <div key={`addr-${row.icon}`} className="d-flex align-items-start gap-2 mb-1">
                        <i className={`bi ${row.icon}`} style={{ color: 'var(--text-4)', fontSize: '0.8rem', marginTop: '0.2rem', flexShrink: 0 }} />
                        <span style={{ color: 'var(--text-3)', fontSize: '0.82rem', lineHeight: 1.45 }}>{row.val}</span>
                      </div>
                    ))}
                    {order.deliveryNotes && (
                      <div className="mt-2 p-2 rounded-3" style={{ background: 'var(--pc-blue-light)', fontSize: '0.82rem' }}>
                        <i className="bi bi-chat-text me-1" style={{ color: 'var(--pc-blue)' }} />
                        <strong>Note:</strong> {order.deliveryNotes}
                      </div>
                    )}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', margin: 0 }}>No address on record</p>
                )}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="card">
              <div className="card-header fw-bold">Payment Summary</div>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between mb-2 pb-2" style={{ borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>Subtotal</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-1)' }}>₹{order.totalAmount?.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3 pb-2" style={{ borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>Delivery</span>
                  <span style={{ fontWeight: 600, color: 'var(--pc-green)' }}>FREE</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: 'var(--text-1)' }}>Total</span>
                  <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '1.2rem', color: 'var(--pc-green)' }}>
                    ₹{order.totalAmount?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
