import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axiosConfig'

const STATUS_CONFIG = {
  PENDING:    { color: 'var(--text-3)',      bg: 'var(--surface-2)',        icon: 'bi-hourglass',          label: 'Pending' },
  CONFIRMED:  { color: 'var(--pc-blue)',     bg: 'var(--pc-blue-light)',    icon: 'bi-check-circle',       label: 'Confirmed' },
  PROCESSING: { color: 'var(--pc-teal)',     bg: 'var(--pc-teal-light)',    icon: 'bi-gear',               label: 'Processing' },
  SHIPPED:    { color: 'var(--pc-amber)',    bg: 'var(--pc-amber-light)',   icon: 'bi-truck',              label: 'Shipped' },
  DELIVERED:  { color: 'var(--pc-green)',    bg: 'var(--pc-green-light)',   icon: 'bi-check-circle-fill',  label: 'Delivered' },
  CANCELLED:  { color: 'var(--pc-red)',      bg: 'var(--pc-red-light)',     icon: 'bi-x-circle',           label: 'Cancelled' },
}

export default function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders/my').then(res => setOrders(res.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="text-center">
        <div className="spinner-border mb-3" style={{ width: '2.5rem', height: '2.5rem' }} role="status" />
        <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>Loading your orders...</p>
      </div>
    </div>
  )

  return (
    <div style={{ background: 'var(--surface-1)', minHeight: '80vh', paddingTop: '1.5rem', paddingBottom: '3rem' }}>
      <div className="container">
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <div>
            <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, color: 'var(--text-1)', marginBottom: '0.15rem' }}>My Orders</h2>
            <span style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>{orders.length} order(s) total</span>
          </div>
          <Link to="/medicines" className="btn btn-outline-primary btn-sm rounded-pill px-3">
            <i className="bi bi-plus me-1"></i>Shop More
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-5">
            <div style={{ width: 100, height: 100, background: 'var(--pc-green-light)', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <i className="bi bi-bag-x" style={{ fontSize: '2.5rem', color: 'var(--pc-green)' }}></i>
            </div>
            <h5 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: 'var(--text-1)' }}>No orders yet</h5>
            <p style={{ color: 'var(--text-3)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Start shopping to see your orders here.
            </p>
            <Link to="/medicines" className="btn btn-primary rounded-pill px-5">
              <i className="bi bi-capsule me-2"></i>Shop Now
            </Link>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {orders.map(order => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING
              return (
                <div className="card" key={order.id}
                  style={{ transition: 'all var(--dur-mid)', cursor: 'pointer' }}>
                  <div className="card-body p-0">
                    {/* Header */}
                    <div className="d-flex align-items-center justify-content-between p-3 flex-wrap gap-2"
                      style={{ borderBottom: '1px solid var(--border)' }}>
                      <div className="d-flex align-items-center gap-3 flex-wrap">
                        <div>
                          <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: 'var(--text-1)', fontSize: '0.95rem' }}>
                            Order #{order.id}
                          </span>
                          {order.trackingNumber && (
                            <span style={{ color: 'var(--text-4)', fontSize: '0.75rem', marginLeft: '0.5rem' }}>
                              · {order.trackingNumber}
                            </span>
                          )}
                        </div>
                        <span style={{ color: 'var(--text-4)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <i className="bi bi-calendar3" style={{ fontSize: '0.75rem' }}></i>
                          {new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <span style={{
                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                        background: cfg.bg, color: cfg.color,
                        padding: '0.35em 0.85em', borderRadius: 'var(--r-md)',
                        fontSize: '0.78rem', fontWeight: 700
                      }}>
                        <i className={`bi ${cfg.icon}`} />
                        {cfg.label}
                      </span>
                    </div>

                    {/* Items */}
                    <div className="p-3">
                      {order.items?.length > 0 && (
                        <div className="d-flex gap-2 flex-wrap mb-3">
                          {order.items.map((item, idx) => (
                            <div key={`${order.id}-item-${item.medicineName}-${idx}`} className="d-flex align-items-center gap-2 px-3 py-2 rounded-3"
                              style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
                              <i className="bi bi-capsule" style={{ color: 'var(--pc-green)', fontSize: '0.8rem' }}></i>
                              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-1)' }}>{item.medicineName}</span>
                              <span style={{ background: 'var(--pc-green-light)', color: 'var(--pc-green-dark)',
                                padding: '0.15em 0.5em', borderRadius: 'var(--r-sm)', fontSize: '0.72rem', fontWeight: 700 }}>
                                ×{item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                        <div className="d-flex gap-4 flex-wrap">
                          <div>
                            <div style={{ color: 'var(--text-3)', fontSize: '0.75rem', marginBottom: '0.1rem' }}>Items</div>
                            <strong style={{ color: 'var(--text-1)', fontSize: '0.875rem' }}>{order.items?.length || 0} item(s)</strong>
                          </div>
                          <div>
                            <div style={{ color: 'var(--text-3)', fontSize: '0.75rem', marginBottom: '0.1rem' }}>Total</div>
                            <strong style={{ color: 'var(--pc-green)', fontSize: '1rem', fontFamily: 'Sora, sans-serif' }}>
                              ₹{order.totalAmount?.toFixed(2)}
                            </strong>
                          </div>
                        </div>
                        <Link to={`/orders/${order.id}`} className="btn btn-outline-primary btn-sm rounded-pill px-4">
                          <i className="bi bi-eye me-1"></i>Track Order
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
