export default function OrderStatusBar({ status }) {
  const steps = ['PENDING', 'CONFIRMED', 'PROCESSING', 'OUT_FOR_DELIVERY', 'DELIVERED']
  const currentIdx = steps.indexOf(status)
  const displayIdx = status === 'SHIPPED' ? steps.indexOf('OUT_FOR_DELIVERY') : currentIdx

  const labels = {
    PENDING: 'Order Placed', CONFIRMED: 'Confirmed', PROCESSING: 'Processing',
    SHIPPED: 'Out for Delivery', OUT_FOR_DELIVERY: 'Out for Delivery',
    DELIVERY_ATTEMPTED: 'Attempted', DELIVERED: 'Delivered'
  }
  const icons = {
    PENDING: 'bi-bag-check', CONFIRMED: 'bi-check-circle', PROCESSING: 'bi-gear',
    SHIPPED: 'bi-truck', OUT_FOR_DELIVERY: 'bi-truck',
    DELIVERY_ATTEMPTED: 'bi-exclamation-circle', DELIVERED: 'bi-house-check'
  }

  if (status === 'CANCELLED') {
    return (
      <div className="d-flex align-items-center gap-2 p-3 rounded-3"
        style={{ background: 'var(--pc-red-light)', color: 'var(--pc-red)' }}>
        <i className="bi bi-x-circle-fill" style={{ fontSize: '1.1rem' }} />
        <span className="fw-semibold">Order Cancelled</span>
      </div>
    )
  }

  const pct = steps.length > 1 ? (displayIdx / (steps.length - 1)) * 88 : 0

  return (
    <div className="order-status-track">
      <div className="order-status-progress" style={{ width: `${pct}%` }} />
      {steps.map((step, idx) => {
        const done = idx < displayIdx
        const current = idx === displayIdx
        return (
          <div key={step} className="status-step">
            <div className={`status-step-dot ${done ? 'done' : current ? 'current' : ''}`}>
              <i className={`bi ${icons[step]}`} style={{ fontSize: '0.9rem' }} />
            </div>
            <span className={`status-step-label ${(done || current) ? 'active' : ''}`}>
              {labels[step]}
            </span>
          </div>
        )
      })}
    </div>
  )
}
