import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useState } from 'react'

export default function MedicineCard({ medicine }) {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState('')

  const handleAdd = async () => {
    // Prescription-required medicines must go through the details page
    if (medicine.requiresPrescription) {
      setAddError('Rx required — open details to select a prescription.')
      setTimeout(() => setAddError(''), 3000)
      return
    }
    setAdding(true)
    setAddError('')
    try {
      await addToCart(medicine.id, 1)
      setAdded(true)
      setTimeout(() => setAdded(false), 2500)
    } catch {
      setAddError('Failed to add. Please try again.')
      setTimeout(() => setAddError(''), 3000)
    } finally {
      setAdding(false)
    }
  }

  const isAvailable = medicine.stockQuantity > 0

  return (
    <div className="med-card">
      {/* Badges */}
      <div className="med-card__badges">
        <span className="med-badge med-badge--category">
          {medicine.categoryName || 'General'}
        </span>
        {medicine.requiresPrescription && (
          <span className="med-badge med-badge--rx">
            <i className="bi bi-file-earmark-medical me-1" />Rx
          </span>
        )}
      </div>

      {/* Image */}
      <div className="med-card__img-wrap" style={{ 
        width: '100%', 
        height: '160px', 
        borderRadius: 'var(--r-md)', 
        overflow: 'hidden',
        background: 'var(--surface-1)'
      }}>
        <img 
          src={medicine.imageUrl || '/generic_medicine.png'} 
          alt={medicine.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      </div>

      {/* Info */}
      <div className="med-card__info">
        <h6 className="med-card__name">{medicine.name}</h6>
        {medicine.brand   && <p className="med-card__brand">{medicine.brand}</p>}
        {medicine.dosage  && <p className="med-card__dosage">{medicine.dosage}</p>}
        {medicine.description && <p className="med-card__desc">{medicine.description}</p>}
      </div>

      {/* Price + Stock */}
      <div className="med-card__meta">
        <div className="med-card__price-wrap">
          {(() => {
            const orig = parseFloat(medicine.price) || 0
            const disc = parseFloat(medicine.discountPrice) || 0
            const pct  = parseFloat(medicine.discountPercentage) || 0
            const hasDiscount = disc > 0 && disc < orig
            return hasDiscount ? (
              <>
                <span className="med-card__price med-card__price--discounted">₹{disc.toFixed(2)}</span>
                <span className="med-card__price med-card__price--original">₹{orig.toFixed(2)}</span>
                {pct > 0 && <span className="med-badge med-badge--discount">{pct.toFixed(0)}% OFF</span>}
              </>
            ) : (
              <span className="med-card__price">₹{orig.toFixed(2)}</span>
            )
          })()}
        </div>
        <span className={`med-stock ${isAvailable ? 'med-stock--in' : 'med-stock--out'}`}>
          {isAvailable
            ? <><i className="bi bi-check-circle-fill" style={{ marginRight: '0.25rem' }} />{medicine.stockQuantity} left</>
            : <><i className="bi bi-x-circle-fill" style={{ marginRight: '0.25rem' }} />Out of Stock</>
          }
        </span>
      </div>

      {/* Actions */}
      <div className="med-card__actions">
        <Link to={`/medicines/${medicine.id}`} className="med-btn med-btn--outline">
          <i className="bi bi-eye" style={{ marginRight: '0.25rem' }} />View
        </Link>
        {user?.role === 'CUSTOMER' && isAvailable && (
          <button
            className={`med-btn ${added ? 'med-btn--success' : 'med-btn--primary'}`}
            onClick={handleAdd}
            disabled={adding}
          >
            {adding
              ? <span className="spinner-border spinner-border-sm" />
              : added
                ? <><i className="bi bi-check-lg" style={{ marginRight: '0.25rem' }} />Added!</>
                : <><i className="bi bi-cart-plus" style={{ marginRight: '0.25rem' }} />Add</>
            }
          </button>
        )}
      </div>

      {added && (
        <Link to="/cart" className="med-btn med-btn--cart-link" style={{ marginTop: '0.5rem' }}>
          <i className="bi bi-cart3" style={{ marginRight: '0.25rem' }} />
          View Cart <i className="bi bi-arrow-right" style={{ marginLeft: '0.25rem' }} />
        </Link>
      )}
      {addError && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--pc-red)',
          background: 'var(--pc-red-light)', borderRadius: 'var(--r-sm)', padding: '0.4rem 0.6rem',
          display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <i className="bi bi-exclamation-circle-fill" />
          {addError}
        </div>
      )}
    </div>
  )
}
