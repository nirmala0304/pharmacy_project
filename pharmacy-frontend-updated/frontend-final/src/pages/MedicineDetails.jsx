import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/axiosConfig'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function MedicineDetails() {
  const { id } = useParams()
  const [medicine, setMedicine] = useState(null)
  const [prescriptions, setPrescriptions] = useState([])
  const [selectedPrescription, setSelectedPrescription] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)
  const [addError, setAddError] = useState('')
  const { user } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    api.get(`/medicines/${id}`)
      .then(res => setMedicine(res.data))
      .catch(() => navigate('/medicines'))
      .finally(() => setLoading(false))
    if (user?.role === 'CUSTOMER') {
      api.get('/prescriptions/my')
        .then(res => setPrescriptions(res.data.filter(p => p.status === 'APPROVED')))
        .catch(() => {})
    }
  }, [id, user, navigate])

  const handleAddToCart = async () => {
    if (!user) return navigate('/login')
    setAddError('')
    try {
      await addToCart(medicine.id, quantity, selectedPrescription || null)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch {
      setAddError('Failed to add to cart. Please try again.')
      setTimeout(() => setAddError(''), 3000)
    }
  }

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="text-center">
        <div className="spinner-border mb-3" style={{ width: '2.5rem', height: '2.5rem' }} role="status" />
        <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>Loading medicine details...</p>
      </div>
    </div>
  )
  if (!medicine) return null

  const isAvailable = medicine.stockQuantity > 0

  const hasDiscount = medicine.discountPrice && parseFloat(medicine.discountPrice) > 0 && parseFloat(medicine.discountPrice) < parseFloat(medicine.price)
  const effectivePrice = hasDiscount ? parseFloat(medicine.discountPrice) : parseFloat(medicine.price)

  const metaItems = [
    { label: 'Price',    value: hasDiscount
        ? <span>₹{parseFloat(medicine.discountPrice).toFixed(2)} <span style={{ textDecoration:'line-through', color:'var(--text-4)', fontSize:'0.85em', fontWeight:400 }}>₹{medicine.price}</span> {medicine.discountPercentage > 0 && <span style={{ background:'var(--pc-amber-light)', color:'#92400e', borderRadius:'4px', padding:'1px 6px', fontSize:'0.72em', fontWeight:700 }}>{parseFloat(medicine.discountPercentage).toFixed(0)}% OFF</span>}</span>
        : `₹${medicine.price}`,
      highlight: true, color: 'var(--pc-green)' },
    { label: 'Dosage',   value: medicine.dosage || 'See label' },
    { label: 'Stock',    value: `${medicine.stockQuantity} units` },
    { label: 'Expiry',   value: medicine.expiryDate || 'N/A' },
    { label: 'Category', value: medicine.categoryName || '—' },
  ]

  return (
    <div style={{ background: 'var(--surface-1)', minHeight: '80vh', paddingBottom: '3rem' }}>
      {/* Breadcrumb bar */}
      <div style={{ background: 'var(--surface-0)', borderBottom: '1px solid var(--border)', padding: '0.875rem 0' }}>
        <div className="container">
          <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.82rem', color: 'var(--text-3)' }}>
            <Link to="/" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>Home</Link>
            <i className="bi bi-chevron-right" style={{ fontSize: '0.65rem' }} />
            <Link to="/medicines" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>Medicines</Link>
            <i className="bi bi-chevron-right" style={{ fontSize: '0.65rem' }} />
            <span style={{ color: 'var(--text-1)', fontWeight: 600 }}>{medicine.name}</span>
          </div>
        </div>
      </div>

      <div className="container py-4">
        <button className="btn btn-outline-secondary btn-sm rounded-pill px-3 mb-4"
          onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left me-2" />Back
        </button>

        <div className="row g-4 align-items-start">
          {/* Left: Visual panel */}
          <div className="col-md-4">
            <div className="card text-center p-4 p-md-5" style={{ position: 'sticky', top: '80px' }}>
              <div className="mx-auto mb-4 rounded-3 overflow-hidden"
                style={{ width: 200, height: 200, background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
                <img 
                  src={medicine.imageUrl || '/generic_medicine.png'} 
                  alt={medicine.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.onerror = null; e.target.src = '/generic_medicine.png'; }}
                />
              </div>
              <h4 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, color: 'var(--text-1)', marginBottom: '0.5rem' }}>
                {medicine.name}
              </h4>
              {medicine.brand && (
                <p style={{ color: 'var(--text-3)', fontSize: '0.9rem', marginBottom: '1rem' }}>{medicine.brand}</p>
              )}
              <div className="d-flex justify-content-center gap-2 flex-wrap">
                {medicine.categoryName && (
                  <span className="badge" style={{ background: 'var(--pc-teal-light)', color: 'var(--pc-teal)', fontSize: '0.75rem', padding: '0.35em 0.75em' }}>
                    {medicine.categoryName}
                  </span>
                )}
                {medicine.requiresPrescription && (
                  <span className="badge" style={{ background: 'var(--pc-amber-light)', color: '#92400e', fontSize: '0.75rem', padding: '0.35em 0.75em' }}>
                    <i className="bi bi-file-earmark-medical me-1" />Rx Required
                  </span>
                )}
                <span className="badge" style={{
                  background: isAvailable ? 'var(--pc-green-light)' : 'var(--pc-red-light)',
                  color: isAvailable ? 'var(--pc-green-dark)' : 'var(--pc-red)',
                  fontSize: '0.75rem', padding: '0.35em 0.75em'
                }}>
                  {isAvailable ? '✓ In Stock' : '✗ Out of Stock'}
                </span>
              </div>

              {/* Trust badges */}
              <div className="mt-4 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                {[
                  { icon: 'bi-shield-check', text: 'Verified medicine' },
                  { icon: 'bi-truck',        text: 'Fast delivery' },
                  { icon: 'bi-arrow-repeat', text: 'Easy returns' },
                ].map(b => (
                  <div key={b.text} className="d-flex align-items-center gap-2 mb-2 justify-content-center">
                    <i className={`bi ${b.icon}`} style={{ color: 'var(--pc-green)', fontSize: '0.85rem' }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="col-md-8">
            {/* Meta grid */}
            <div className="card mb-4">
              <div className="card-header fw-bold d-flex align-items-center gap-2">
                <i className="bi bi-info-circle" style={{ color: 'var(--pc-green)' }} />
                Product Details
              </div>
              <div className="card-body p-4">
                <div className="row g-3 mb-3">
                  {metaItems.map(item => (
                    <div className="col-6 col-md-4" key={item.label}>
                      <div style={{ background: 'var(--surface-1)', borderRadius: 'var(--r-md)', padding: '0.875rem' }}>
                        <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: '0.25rem' }}>
                          {item.label}
                        </p>
                        <strong style={{ fontSize: '0.95rem', color: item.highlight ? item.color : 'var(--text-1)', fontFamily: item.highlight ? 'Sora, sans-serif' : 'inherit', fontWeight: item.highlight ? 800 : 600 }}>
                          {item.value}
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>

                {medicine.description && (
                  <div style={{ background: 'var(--surface-1)', borderRadius: 'var(--r-md)', padding: '1rem' }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: '0.5rem' }}>
                      Description
                    </p>
                    <p style={{ margin: 0, color: 'var(--text-2)', lineHeight: 1.65, fontSize: '0.9rem' }}>
                      {medicine.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Add to Cart panel */}
            {user?.role === 'CUSTOMER' && isAvailable && (
              <div className="card mb-4">
                <div className="card-header fw-bold d-flex align-items-center gap-2">
                  <i className="bi bi-cart-plus" style={{ color: 'var(--pc-green)' }} />
                  Add to Cart
                </div>
                <div className="card-body p-4">
                  {medicine.requiresPrescription && (
                    <div className="mb-4">
                      <label className="form-label">Select Approved Prescription</label>
                      <select className="form-select" value={selectedPrescription}
                        onChange={e => setSelectedPrescription(e.target.value)}>
                        <option value="">-- Select a prescription --</option>
                        {prescriptions.map(p => (
                          <option key={p.id} value={p.id}>
                            Rx #{p.id} — {p.doctorName || 'Unknown doctor'} ({p.uploadedAt?.split('T')[0]})
                          </option>
                        ))}
                      </select>
                      {prescriptions.length === 0 && (
                        <div className="alert alert-warning d-flex align-items-center gap-2 mt-2">
                          <i className="bi bi-exclamation-triangle-fill flex-shrink-0" />
                          <span style={{ fontSize: '0.875rem' }}>
                            No approved prescriptions.{' '}
                            <Link to="/upload-prescription" className="fw-semibold">Upload one</Link> first.
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="d-flex align-items-center gap-3 flex-wrap">
                    {/* Qty control */}
                    <div className="d-flex align-items-center" style={{ background: 'var(--surface-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                      <button className="btn" style={{ width: 42, height: 42, padding: 0, background: 'transparent', border: 'none', color: 'var(--text-2)', fontSize: '1.1rem' }}
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                      <input type="number" style={{ width: 52, height: 42, textAlign: 'center', border: 'none', background: 'transparent', fontWeight: 700, color: 'var(--text-1)', outline: 'none' }}
                        value={quantity} min={1} max={medicine.stockQuantity}
                        onChange={e => setQuantity(Math.max(1, Math.min(medicine.stockQuantity, parseInt(e.target.value) || 1)))} />
                      <button className="btn" style={{ width: 42, height: 42, padding: 0, background: 'transparent', border: 'none', color: 'var(--text-2)', fontSize: '1.1rem' }}
                        onClick={() => setQuantity(q => Math.min(medicine.stockQuantity, q + 1))}>+</button>
                    </div>

                    <button
                      className={`btn btn-lg rounded-pill flex-fill ${added ? '' : 'btn-primary'}`}
                      style={added ? { background: 'var(--pc-green-light)', color: 'var(--pc-green-dark)', border: '1.5px solid var(--pc-green-mid)' } : {}}
                      onClick={handleAddToCart}
                      disabled={medicine.requiresPrescription && !selectedPrescription && prescriptions.length > 0}>
                      {added
                        ? <><i className="bi bi-check-circle me-2" />Added to Cart!</>
                        : <><i className="bi bi-cart-plus me-2" />Add to Cart · ₹{(effectivePrice * quantity).toFixed(2)}</>}
                    </button>
                  </div>

                  {added && (
                    <Link to="/cart" className="btn btn-outline-primary w-100 rounded-pill mt-3">
                      <i className="bi bi-cart3 me-2" />View Cart & Checkout
                    </Link>
                  )}
                  {addError && (
                    <div className="alert alert-danger d-flex align-items-center gap-2 mt-3 py-2">
                      <i className="bi bi-exclamation-circle-fill flex-shrink-0" />
                      <span style={{ fontSize: '0.875rem' }}>{addError}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!user && (
              <div className="alert alert-info d-flex align-items-center gap-2">
                <i className="bi bi-person-circle flex-shrink-0" />
                <span>
                  <Link to="/login" className="fw-semibold">Sign in</Link> to add medicines to your cart.
                </span>
              </div>
            )}
            {!isAvailable && (
              <div className="alert alert-danger d-flex align-items-center gap-2">
                <i className="bi bi-x-circle flex-shrink-0" />
                <span>This medicine is currently out of stock.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
