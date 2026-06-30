import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { cart, updateQuantity, removeItem, applyCoupon, removeCoupon } = useCart()
  const navigate = useNavigate()
  const [couponInput, setCouponInput] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState('')
  const [couponSuccess, setCouponSuccess] = useState('')

  if (!cart?.items?.length) {
    return (
      <div style={{ minHeight: '70vh', background: 'var(--surface-1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-center px-3">
          <div style={{ width: 100, height: 100, background: 'var(--pc-green-light)', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <i className="bi bi-cart-x" style={{ fontSize: '2.5rem', color: 'var(--pc-green)' }}></i>
          </div>
          <h4 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: 'var(--text-1)', marginBottom: '0.5rem' }}>
            Your cart is empty
          </h4>
          <p style={{ color: 'var(--text-3)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Browse our medicine catalog and add items to get started.
          </p>
          <Link to="/medicines" className="btn btn-primary rounded-pill px-5">
            <i className="bi bi-capsule me-2"></i>Browse Medicines
          </Link>
        </div>
      </div>
    )
  }

  const hasPrescriptionItems = cart.items.some(i => i.requiresPrescription && !i.prescriptionId)
  const hasPendingPrescription = cart.items.some(i => i.prescriptionStatus === 'PENDING')
  const totalItems = cart.items.reduce((s, i) => s + i.quantity, 0)

  const subtotal = cart.totalAmount ?? 0
  const discountAmount = cart.discountAmount ?? 0
  const grandTotal = cart.grandTotal ?? subtotal
  const appliedCode = cart.appliedCouponCode

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return
    setCouponLoading(true)
    setCouponError('')
    setCouponSuccess('')
    try {
      await applyCoupon(couponInput.trim())
      setCouponSuccess('Coupon applied successfully!')
      setCouponInput('')
    } catch (err) {
      setCouponError(err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Invalid coupon code.')
    } finally {
      setCouponLoading(false)
    }
  }

  const handleRemoveCoupon = async () => {
    setCouponError('')
    setCouponSuccess('')
    try {
      await removeCoupon()
    } catch {
      setCouponError('Failed to remove coupon.')
    }
  }

  return (
    <div style={{ background: 'var(--surface-1)', minHeight: '80vh', paddingTop: '1.5rem', paddingBottom: '3rem' }}>
      <div className="container">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <div>
            <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, color: 'var(--text-1)', marginBottom: '0.15rem' }}>
              Shopping Cart
            </h2>
            <span style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>{totalItems} item(s)</span>
          </div>
          <Link to="/medicines" className="btn btn-outline-secondary btn-sm rounded-pill px-3">
            <i className="bi bi-arrow-left me-1"></i>Continue Shopping
          </Link>
        </div>

        {hasPrescriptionItems && (
          <div className="alert alert-warning d-flex align-items-center gap-2 mb-3">
            <i className="bi bi-exclamation-triangle-fill flex-shrink-0" />
            <div style={{ fontSize: '0.875rem' }}>
              Some items require a prescription.{' '}
              <Link to="/upload-prescription" className="fw-semibold" style={{ color: 'inherit' }}>
                Upload a prescription
              </Link>{' '}before checkout.
            </div>
          </div>
        )}
        {hasPendingPrescription && (
          <div className="alert alert-info d-flex align-items-center gap-2 mb-3">
            <i className="bi bi-clock-fill flex-shrink-0" />
            <span style={{ fontSize: '0.875rem' }}>Some prescriptions are pending pharmacist approval.</span>
          </div>
        )}

        <div className="row g-4">
          {/* Items */}
          <div className="col-lg-8">
            <div className="d-flex flex-column gap-3">
              {cart.items.map(item => (
                <div key={item.cartItemId} className="card">
                  <div className="card-body">
                    <div className="d-flex flex-column flex-sm-row gap-3 align-items-start align-items-sm-center">
                      {/* Image */}
                      <div className="flex-shrink-0 rounded-3 overflow-hidden"
                        style={{ width: 64, height: 64, background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
                        <img 
                          src={item.medicineImageUrl || '/generic_medicine.png'} 
                          alt={item.medicineName} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-grow-1 min-w-0">
                        <h6 className="fw-bold mb-1 text-truncate" style={{ color: 'var(--text-1)' }}>{item.medicineName}</h6>
                        <p style={{ color: 'var(--text-3)', fontSize: '0.8rem', margin: 0 }}>{item.medicineBrand}</p>
                        <p style={{ color: 'var(--text-3)', fontSize: '0.8rem', margin: 0 }}>₹{item.unitPrice} per unit</p>
                        {item.requiresPrescription && (
                          <span className="badge mt-1" style={{
                            background: item.prescriptionId ? 'var(--pc-green-light)' : 'var(--pc-amber-light)',
                            color: item.prescriptionId ? 'var(--pc-green-dark)' : '#92400e',
                            fontSize: '0.7rem'
                          }}>
                            {item.prescriptionId ? `✓ Rx #${item.prescriptionId} (${item.prescriptionStatus})` : '⚠ Rx Required'}
                          </span>
                        )}
                      </div>

                      {/* Controls */}
                      <div className="d-flex align-items-center gap-3 w-100 w-sm-auto justify-content-between justify-content-sm-end flex-wrap">
                        {/* Qty */}
                        <div className="d-flex align-items-center gap-1" style={{ background: 'var(--surface-1)', borderRadius: 'var(--r-md)', padding: '0.2rem', border: '1px solid var(--border)' }}>
                          <button className="btn btn-sm" style={{ width: 30, height: 30, padding: 0, background: 'transparent', border: 'none', color: item.quantity <= 1 ? 'var(--text-4)' : 'var(--text-2)', cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer' }}
                            onClick={() => { if (item.quantity > 1) updateQuantity(item.cartItemId, item.quantity - 1) }}
                            disabled={item.quantity <= 1}
                            title={item.quantity <= 1 ? 'Remove item to delete from cart' : 'Decrease quantity'}>
                            <i className="bi bi-dash"></i>
                          </button>
                          <span style={{ minWidth: 28, textAlign: 'center', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-1)' }}>
                            {item.quantity}
                          </span>
                          <button className="btn btn-sm" style={{ width: 30, height: 30, padding: 0, background: 'transparent', border: 'none', color: 'var(--text-2)' }}
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}>
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>

                        {/* Total */}
                        <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--pc-green)', minWidth: 72, textAlign: 'right' }}>
                          ₹{(item.unitPrice * item.quantity).toFixed(2)}
                        </span>

                        {/* Remove */}
                        <button className="btn btn-sm d-flex align-items-center justify-content-center"
                          style={{ width: 34, height: 34, padding: 0, background: 'var(--pc-red-light)', color: 'var(--pc-red)', borderRadius: 'var(--r-sm)', border: 'none' }}
                          onClick={() => removeItem(item.cartItemId)} title="Remove item">
                          <i className="bi bi-trash" style={{ fontSize: '0.85rem' }}></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="col-lg-4">
            <div className="card" style={{ position: 'sticky', top: '80px' }}>
              <div className="card-header">
                <span className="fw-bold">Order Summary</span>
              </div>
              <div className="card-body p-4">

                {/* ── Coupon Section ── */}
                {appliedCode ? (
                  <div className="mb-3 p-3 rounded-3 d-flex align-items-center justify-content-between"
                    style={{ background: 'var(--pc-green-light)', border: '1px dashed var(--pc-green)' }}>
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-tag-fill" style={{ color: 'var(--pc-green)' }} />
                      <div>
                        <div className="fw-bold" style={{ color: 'var(--pc-green)', fontSize: '0.85rem' }}>{appliedCode}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>Coupon applied</div>
                      </div>
                    </div>
                    <button className="btn btn-sm" style={{ color: 'var(--pc-red)', background: 'transparent', border: 'none', padding: '0.2rem 0.4rem' }}
                      onClick={handleRemoveCoupon} title="Remove coupon">
                      <i className="bi bi-x-lg" />
                    </button>
                  </div>
                ) : (
                  <div className="mb-3">
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '0.4rem', display: 'block' }}>
                      <i className="bi bi-tag me-1" />Have a coupon?
                    </label>
                    <div className="input-group input-group-sm">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter coupon code"
                        value={couponInput}
                        onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); setCouponSuccess('') }}
                        onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                        style={{ borderRadius: 'var(--r-sm) 0 0 var(--r-sm)', fontSize: '0.82rem', letterSpacing: '0.05em' }}
                      />
                      <button className="btn btn-primary" onClick={handleApplyCoupon} disabled={couponLoading || !couponInput.trim()}
                        style={{ fontSize: '0.8rem', minWidth: 64 }}>
                        {couponLoading ? <span className="spinner-border spinner-border-sm" /> : 'Apply'}
                      </button>
                    </div>
                    {couponError && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--pc-red)', marginTop: '0.35rem' }}>
                        <i className="bi bi-exclamation-circle me-1" />{couponError}
                      </div>
                    )}
                    {couponSuccess && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--pc-green)', marginTop: '0.35rem' }}>
                        <i className="bi bi-check-circle me-1" />{couponSuccess}
                      </div>
                    )}
                  </div>
                )}

                <hr style={{ borderColor: 'var(--border)', margin: '0.75rem 0' }} />

                {/* Price breakdown */}
                <div className="d-flex justify-content-between mb-2 py-1">
                  <span style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>Subtotal ({totalItems} items)</span>
                  <span className="fw-semibold" style={{ color: 'var(--text-1)' }}>₹{parseFloat(subtotal).toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2 py-1">
                  <span style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>Delivery</span>
                  <span className="fw-semibold" style={{ color: 'var(--pc-green)' }}>FREE</span>
                </div>
                {discountAmount > 0 && (
                  <div className="d-flex justify-content-between mb-2 py-1">
                    <span style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>
                      Discount {appliedCode && <span className="badge ms-1" style={{ background: 'var(--pc-green-light)', color: 'var(--pc-green)', fontSize: '0.65rem' }}>{appliedCode}</span>}
                    </span>
                    <span style={{ color: 'var(--pc-green)', fontWeight: 600 }}>- ₹{parseFloat(discountAmount).toFixed(2)}</span>
                  </div>
                )}
                {discountAmount === 0 && (
                  <div className="d-flex justify-content-between mb-2 py-1">
                    <span style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>Discount</span>
                    <span style={{ color: 'var(--text-4)' }}>₹0.00</span>
                  </div>
                )}
                <hr style={{ borderColor: 'var(--border)', margin: '0.75rem 0' }} />
                <div className="d-flex justify-content-between mb-4">
                  <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: 'var(--text-1)', fontSize: '1.05rem' }}>Total</span>
                  <div className="text-end">
                    {discountAmount > 0 && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-4)', textDecoration: 'line-through' }}>₹{parseFloat(subtotal).toFixed(2)}</div>
                    )}
                    <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: 'var(--pc-green)', fontSize: '1.2rem' }}>
                      ₹{parseFloat(grandTotal).toFixed(2)}
                    </span>
                    {discountAmount > 0 && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--pc-green)', marginTop: '0.1rem' }}>
                        You save ₹{parseFloat(discountAmount).toFixed(2)}!
                      </div>
                    )}
                  </div>
                </div>

                <button className="btn btn-primary w-100 btn-lg rounded-pill mb-2" onClick={() => navigate('/checkout')} disabled={hasPrescriptionItems || hasPendingPrescription}>
                  <i className="bi bi-bag-check me-2"></i>Proceed to Checkout
                </button>
                <Link to="/medicines" className="btn btn-outline-secondary w-100 rounded-pill">
                  <i className="bi bi-arrow-left me-2"></i>Continue Shopping
                </Link>

                <div className="mt-3 d-flex align-items-center justify-content-center gap-3">
                  {[
                    { icon: 'bi-shield-check', label: 'Secure', color: 'var(--pc-green)' },
                    { icon: 'bi-truck', label: 'Free delivery', color: 'var(--pc-teal)' },
                    { icon: 'bi-arrow-counterclockwise', label: 'Easy returns', color: 'var(--pc-blue)' },
                  ].map(b => (
                    <div key={b.label} className="d-flex align-items-center gap-1">
                      <i className={`bi ${b.icon}`} style={{ color: b.color, fontSize: '0.8rem' }}></i>
                      <small style={{ color: 'var(--text-3)', fontSize: '0.72rem' }}>{b.label}</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

