export default function ExpiryAlert({ alerts }) {
  if (!alerts) return (
    <div className="card p-4 text-center" style={{ color: 'var(--text-3)' }}>
      <div className="spinner-border spinner-border-sm mx-auto mb-2" />
      <p style={{ margin: 0, fontSize: '0.875rem' }}>Loading alerts...</p>
    </div>
  )

  const { lowStock = [], expiringSoon = [], expiringCritical = [] } = alerts
  const allClear = !lowStock.length && !expiringCritical.length && !expiringSoon.length

  const AlertSection = ({ title, icon, items, bgColor, borderColor, iconColor, textColor, detail }) => (
    <div className="card mb-3" style={{ background: bgColor, border: `1px solid ${borderColor}` }}>
      <div className="card-body p-3 p-md-4">
        <div className="d-flex align-items-center gap-2 mb-2">
          <i className={`bi ${icon}`} style={{ color: iconColor, fontSize: '1rem' }} />
          <strong style={{ color: textColor, fontSize: '0.875rem' }}>{title} ({items.length})</strong>
        </div>
        {detail && items.length > 0 && (
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            {items.map(m => (
              <li key={m.id} style={{ fontSize: '0.82rem', color: textColor, opacity: 0.85, lineHeight: 1.6 }}>
                <strong>{m.name}</strong>
                {m.expiryDate && ` — expires ${m.expiryDate} (stock: ${m.stockQuantity})`}
                {!m.expiryDate && ` — only ${m.stockQuantity} left (min: ${m.minStockLevel})`}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )

  return (
    <div>
      {expiringCritical.length > 0 && (
        <AlertSection title="Critical: Expiring in ≤ 7 days" icon="bi-exclamation-triangle-fill"
          items={expiringCritical} detail
          bgColor="var(--pc-red-light)" borderColor="rgba(239,68,68,0.25)"
          iconColor="var(--pc-red)" textColor="#b91c1c" />
      )}
      {lowStock.length > 0 && (
        <AlertSection title="Low Stock Medicines" icon="bi-arrow-down-circle-fill"
          items={lowStock} detail
          bgColor="var(--pc-amber-light)" borderColor="rgba(245,158,11,0.25)"
          iconColor="var(--pc-amber)" textColor="#92400e" />
      )}
      {expiringSoon.length > 0 && expiringCritical.length === 0 && (
        <AlertSection title="Expiring within 30 days" icon="bi-clock-fill"
          items={expiringSoon} detail={false}
          bgColor="var(--pc-teal-light)" borderColor="rgba(23,181,160,0.25)"
          iconColor="var(--pc-teal)" textColor="#0e7490" />
      )}
      {allClear && (
        <div className="card p-4 text-center" style={{ background: 'var(--pc-green-light)', border: '1px solid var(--pc-green-mid)' }}>
          <i className="bi bi-check-circle-fill" style={{ fontSize: '2rem', color: 'var(--pc-green)', marginBottom: '0.5rem' }} />
          <p style={{ color: 'var(--pc-green-dark)', fontWeight: 600, margin: 0, fontSize: '0.875rem' }}>
            All inventory levels are healthy!
          </p>
        </div>
      )}
    </div>
  )
}
