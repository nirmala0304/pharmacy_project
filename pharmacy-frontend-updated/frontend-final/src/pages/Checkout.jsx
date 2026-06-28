import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig'
import { useCart } from '../context/CartContext'
import AddressMapPicker from '../components/AddressMapPicker'

export default function Checkout() {
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState('')
  const [newAddress, setNewAddress] = useState({ fullName: '', street: '', city: '', state: '', zipCode: '', country: 'India', phone: '' })
  const [showNewForm, setShowNewForm] = useState(false)
  const [deliveryNotes, setDeliveryNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [savingAddress, setSavingAddress] = useState(false)
  const [pickedCoords, setPickedCoords] = useState(null)
  const [error, setError] = useState('')
  const { cart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/addresses').then(res => {
      setAddresses(res.data)
      const def = res.data.find(a => a["default"])
      if (def) setSelectedAddress(def.id)
      else if (res.data.length > 0) setSelectedAddress(res.data[0].id)
      else setShowNewForm(true)
    }).catch(() => setShowNewForm(true))
  }, [])

  const resetNewAddress = () => { setNewAddress({ fullName: '', street: '', city: '', state: '', zipCode: '', country: 'India', phone: '' }); setPickedCoords(null) }

  const saveAddress = async () => {
    const missingField = ['fullName', 'street', 'city', 'state', 'zipCode', 'phone'].find(f => !newAddress[f]?.toString().trim())
    if (missingField) { setError('Please fill in all delivery address fields.'); return null }
    setSavingAddress(true); setError('')
    try {
      const payload = { ...newAddress, latitude: pickedCoords?.lat || null, longitude: pickedCoords?.lng || null }
      const res = await api.post('/addresses', payload)
      setAddresses(prev => [...prev, res.data])
      setSelectedAddress(res.data.id)
      setShowNewForm(false); resetNewAddress()
      return res.data
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to save address.')
      return null
    } finally { setSavingAddress(false) }
  }

  const placeOrder = async () => {
    const hasPrescriptionItems = cart.items?.some(i => i.requiresPrescription && !i.prescriptionId)
    const hasPendingPrescription = cart.items?.some(i => i.prescriptionStatus === 'PENDING')
    if (hasPrescriptionItems || hasPendingPrescription) {
      return setError('Some items require an approved prescription. Please upload one and wait for pharmacist approval.')
    }

    if (showNewForm && Object.values(newAddress).some(v => v?.toString().trim())) {
      const saved = await saveAddress(); if (!saved) return
    }
    if (!selectedAddress) return setError('Please select or add a delivery address.')
    setLoading(true); setError('')
    try {
      const res = await api.post('/orders', { addressId: selectedAddress, deliveryNotes })
      navigate(`/orders/${res.data.id}`)
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Order placement failed.')
    } finally { setLoading(false) }
  }

  const fields = [
    { key: 'fullName', label: 'Full Name', col: 'col-12' },
    { key: 'street',   label: 'Street Address', col: 'col-12' },
    { key: 'city',     label: 'City', col: 'col-md-4' },
    { key: 'state',    label: 'State', col: 'col-md-4' },
    { key: 'zipCode',  label: 'ZIP Code', col: 'col-md-4' },
    { key: 'phone',    label: 'Phone', col: 'col-12' },
  ]

  return (
    <div style={{ background: 'var(--surface-1)', minHeight: '80vh', paddingTop: '1.5rem', paddingBottom: '3rem' }}>
      <div className="container">
        {/* Steps */}
        <div className="d-flex align-items-center gap-2 mb-4">
          <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: 'var(--text-1)', fontSize: '1.5rem' }}>Checkout</span>
          <span style={{ color: 'var(--text-4)' }}>→</span>
          <span style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>Delivery & Payment</span>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
            <i className="bi bi-exclamation-circle-fill flex-shrink-0" /><span>{error}</span>
          </div>
        )}

        <div className="row g-4">
          {/* Left */}
          <div className="col-md-7">
            {/* Delivery Address */}
            <div className="card mb-4">
              <div className="card-header d-flex align-items-center justify-content-between">
                <span className="d-flex align-items-center gap-2">
                  <i className="bi bi-geo-alt" style={{ color: 'var(--pc-green)' }}></i>
                  Delivery Address
                </span>
                <button className="btn btn-sm btn-outline-primary rounded-pill px-3"
                  onClick={() => { setShowNewForm(p => !p); if (!showNewForm) setError('') }}>
                  {showNewForm ? 'Cancel' : '+ Add New'}
                </button>
              </div>
              <div className="card-body p-4">
                {addresses.map(addr => (
                  <div key={addr.id}
                    onClick={() => { setSelectedAddress(addr.id); setShowNewForm(false) }}
                    style={{
                      border: `2px solid ${selectedAddress === addr.id ? 'var(--pc-green)' : 'var(--border)'}`,
                      borderRadius: 'var(--r-lg)', padding: '1rem', marginBottom: '0.75rem', cursor: 'pointer',
                      background: selectedAddress === addr.id ? 'var(--pc-green-light)' : 'var(--surface-0)',
                      transition: 'all var(--dur-fast)'
                    }}>
                    <div className="d-flex gap-3 align-items-start">
                      <div style={{ width: 20, height: 20, borderRadius: '50%',
                        border: `2px solid ${selectedAddress === addr.id ? 'var(--pc-green)' : 'var(--border)'}`,
                        background: selectedAddress === addr.id ? 'var(--pc-green)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2
                      }}>
                        {selectedAddress === addr.id && <i className="bi bi-check" style={{ color: '#fff', fontSize: '0.7rem' }} />}
                      </div>
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <strong style={{ fontSize: '0.9rem', color: 'var(--text-1)' }}>{addr.fullName}</strong>
                          {addr["default"] && (
                            <span className="badge" style={{ background: 'var(--pc-green-light)', color: 'var(--pc-green-dark)', fontSize: '0.68rem' }}>
                              Default
                            </span>
                          )}
                        </div>
                        <p style={{ margin: 0, color: 'var(--text-3)', fontSize: '0.82rem', lineHeight: 1.5 }}>
                          {addr.street}, {addr.city}, {addr.state} – {addr.zipCode}
                        </p>
                        <p style={{ margin: 0, color: 'var(--text-3)', fontSize: '0.82rem' }}>{addr.phone}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {showNewForm && (
                  <div style={{ border: '1.5px dashed var(--border-md)', borderRadius: 'var(--r-lg)', padding: '1.25rem', marginTop: '0.5rem' }}>
                    <h6 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: 'var(--text-1)', marginBottom: '1rem' }}>
                      New Delivery Address
                    </h6>
                    <div className="row g-3">
                      {fields.map(f => (
                        <div className={f.col} key={f.key}>
                          <label className="form-label">{f.label}</label>
                          <input className="form-control" placeholder={f.label}
                            value={newAddress[f.key]}
                            onChange={e => { setNewAddress({ ...newAddress, [f.key]: e.target.value }); if (error) setError('') }} />
                        </div>
                      ))}
                    </div>
                    {/* Map picker */}
                    <div className="mt-3">
                      <label className="form-label d-flex align-items-center gap-2">
                        <i className="bi bi-geo-alt-fill" style={{ color:'var(--pc-green)' }} />
                        Pin Your Exact Location
                        <span style={{ fontWeight:400, color:'var(--text-4)', fontSize:'0.75rem' }}>(for accurate delivery)</span>
                      </label>
                      <AddressMapPicker
                        address={newAddress}
                        onLocationSelect={setPickedCoords}
                        initialLat={pickedCoords?.lat}
                        initialLng={pickedCoords?.lng}
                      />
                      {pickedCoords && (
                        <div style={{ marginTop:'0.4rem', display:'inline-flex', alignItems:'center', gap:'0.4rem',
                          background:'var(--pc-green-light)', color:'var(--pc-green-dark)', padding:'0.25em 0.65em',
                          borderRadius:'50rem', fontSize:'0.72rem', fontWeight:700 }}>
                          <i className="bi bi-check-circle-fill" />
                          Location pinned
                        </div>
                      )}
                    </div>
                    <button className="btn btn-primary mt-3 rounded-pill px-4" onClick={saveAddress} disabled={savingAddress}>
                      {savingAddress ? 'Saving...' : <><i className="bi bi-check-lg me-2" />Save Address</>}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="card">
              <div className="card-header">
                <span className="d-flex align-items-center gap-2">
                  <i className="bi bi-chat-text" style={{ color: 'var(--pc-green)' }}></i>
                  Delivery Notes
                  <span style={{ color: 'var(--text-4)', fontSize: '0.75rem' }}>(optional)</span>
                </span>
              </div>
              <div className="card-body p-4">
                <textarea className="form-control" rows={3}
                  placeholder="Any special instructions for delivery..."
                  value={deliveryNotes} onChange={e => setDeliveryNotes(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="col-md-5">
            <div className="card" style={{ position: 'sticky', top: '80px' }}>
              <div className="card-header">
                <span className="fw-bold">Order Summary</span>
              </div>
              <div className="card-body p-4">
                {cart.items?.map(item => (
                  <div key={item.cartItemId} className="d-flex justify-content-between align-items-center py-2"
                    style={{ borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-1)', fontWeight: 500 }}>{item.medicineName}</span>
                      <span style={{ color: 'var(--text-3)', fontSize: '0.8rem', marginLeft: '0.4rem' }}>×{item.quantity}</span>
                    </div>
                    <span style={{ fontWeight: 600, color: 'var(--text-1)', fontSize: '0.875rem' }}>
                      ₹{(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="d-flex justify-content-between py-2">
                  <span style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>Delivery</span>
                  <span style={{ color: 'var(--pc-green)', fontWeight: 600, fontSize: '0.875rem' }}>FREE</span>
                </div>
                {cart.discountAmount > 0 && (
                  <div className="d-flex justify-content-between py-2">
                    <span style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>
                      Discount
                      {cart.appliedCouponCode && (
                        <span className="badge ms-2" style={{ background:'var(--pc-green-light)', color:'var(--pc-green-dark)', fontSize:'0.65rem' }}>
                          {cart.appliedCouponCode}
                        </span>
                      )}
                    </span>
                    <span style={{ color: 'var(--pc-green)', fontWeight: 600, fontSize: '0.875rem' }}>
                      - ₹{parseFloat(cart.discountAmount).toFixed(2)}
                    </span>
                  </div>
                )}
                <hr style={{ borderColor: 'var(--border)' }} />
                <div className="d-flex justify-content-between mb-4">
                  <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: 'var(--text-1)' }}>Total</span>
                  <div className="text-end">
                    {cart.discountAmount > 0 && (
                      <div style={{ fontSize:'0.78rem', color:'var(--text-4)', textDecoration:'line-through' }}>
                        ₹{parseFloat(cart.totalAmount).toFixed(2)}
                      </div>
                    )}
                    <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, color: 'var(--pc-green)', fontSize: '1.25rem' }}>
                      ₹{parseFloat(cart.grandTotal ?? cart.totalAmount).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button className="btn btn-primary w-100 btn-lg rounded-pill" onClick={placeOrder} disabled={loading}>
                  {loading
                    ? <><span className="spinner-border spinner-border-sm me-2" />Placing Order...</>
                    : <><i className="bi bi-check-circle me-2" />Place Order</>}
                </button>

                <div className="mt-3 d-flex align-items-center justify-content-center gap-2">
                  <i className="bi bi-lock-fill" style={{ color: 'var(--text-4)', fontSize: '0.75rem' }}></i>
                  <small style={{ color: 'var(--text-4)', fontSize: '0.75rem' }}>Secure & encrypted checkout</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
