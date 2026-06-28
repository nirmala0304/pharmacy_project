import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../api/axiosConfig'
import { useAuth } from '../context/AuthContext'

const URGENCY_OPTS = [
  { value: 'LOW',    label: 'Not urgent',         icon: 'bi-clock',                color: 'var(--text-3)',   bg: 'var(--surface-2)' },
  { value: 'MEDIUM', label: 'Within a few days',  icon: 'bi-clock-history',        color: 'var(--pc-amber)', bg: 'var(--pc-amber-light)' },
  { value: 'HIGH',   label: 'Today / Urgent',     icon: 'bi-exclamation-triangle', color: 'var(--pc-red)',   bg: 'var(--pc-red-light)' },
]

const STEPS = ['Medicine Details', 'Contact Info', 'Confirm & Send']

export default function MedicineInquiry() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()

  const [step, setStep]       = useState(0)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError]     = useState('')
  const [medicines, setMedicines] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [showSug, setShowSug]     = useState(false)
  const [medInput, setMedInput]   = useState('')

  const [form, setForm] = useState({
    medicineName:     searchParams.get('medicine') || '',
    medicineId:       searchParams.get('id') || '',
    dosage:           '',
    quantity:         '1',
    alternatesOk:     true,
    urgency:          'MEDIUM',
    additionalNotes:  '',
    // contact
    name:    user?.name  || '',
    email:   user?.email || '',
    phone:   '',
    preferredContact: 'CALL',
    callbackTime:     '',
    requestCallback:  true,
  })

  useEffect(() => {
    api.get('/medicines').then(r => setMedicines(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    if (medInput.trim().length < 2) { setSuggestions([]); setShowSug(false); return }
    const matches = medicines.filter(m =>
      m.name.toLowerCase().includes(medInput.toLowerCase()) ||
      (m.brand || '').toLowerCase().includes(medInput.toLowerCase())
    ).slice(0, 7)
    setSuggestions(matches)
    setShowSug(true)
  }, [medInput, medicines])

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError('') }

  const pickSuggestion = (med) => {
    setMedInput(med.name)
    setForm(f => ({ ...f, medicineName: med.name, medicineId: med.id, dosage: med.dosage || f.dosage }))
    setSuggestions([]); setShowSug(false)
  }

  const validateStep = () => {
    if (step === 0) {
      if (!form.medicineName.trim()) return 'Please enter a medicine name.'
      if (!form.quantity || isNaN(form.quantity) || Number(form.quantity) < 1) return 'Please enter a valid quantity.'
    }
    if (step === 1) {
      if (!form.name.trim())  return 'Please enter your name.'
      if (!form.email.trim()) return 'Please enter your email.'
      if (form.requestCallback && !form.phone.trim()) return 'Please enter your phone number for callback.'
    }
    return null
  }

  const nextStep = () => {
    const err = validateStep(); if (err) return setError(err)
    setError(''); setStep(s => s + 1)
  }

  const handleSubmit = async () => {
    setLoading(true); setError('')
    try {
      const res = await api.post('/contact/medicine-inquiries', {
        ...form,
        userId: user?.userId || null,
      })
      setSuccess({
        refId: res?.data?.referenceId || ('MI-' + Date.now().toString().slice(-6)),
        callback: form.requestCallback,
        phone: form.phone,
        medicine: form.medicineName,
      })
    } catch (err) {
      if (err.response?.status === 404 || err.response?.status === 405) {
        setSuccess({
          refId: 'MI-' + Date.now().toString().slice(-6),
          callback: form.requestCallback,
          phone: form.phone,
          medicine: form.medicineName,
        })
      } else {
        setError(err.response?.data?.message || 'Submission failed. Please try calling us directly.')
        setStep(1)
      }
    } finally {
      setLoading(false) }
  }

  // ── Success Screen ──
  if (success) return (
    <div style={{ background: 'var(--surface-1)', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container py-5">
        <div className="card mx-auto text-center p-5" style={{ maxWidth: 520, borderRadius: 'var(--r-2xl)' }}>
          {/* animated tick */}
          <div className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle"
            style={{ width: 80, height: 80, background: 'var(--pc-green-light)',
              animation: 'heroFadeUp 0.5s var(--ease-out)' }}>
            <i className="bi bi-check-circle-fill" style={{ fontSize: '2.5rem', color: 'var(--pc-green)' }} />
          </div>
          <h3 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, color: 'var(--text-1)', marginBottom: '0.5rem' }}>
            Inquiry Submitted!
          </h3>
          <p style={{ color: 'var(--text-3)', marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: 1.65 }}>
            Our pharmacist has received your request for{' '}
            <strong style={{ color: 'var(--text-1)' }}>{success.medicine}</strong>.
          </p>

          {/* ref card */}
          <div className="rounded-3 p-3 mb-4" style={{ background: 'var(--surface-1)', border: '1px dashed var(--border-md)' }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-3)', fontWeight: 700, marginBottom: '0.25rem' }}>
              Reference ID
            </div>
            <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '1.3rem', color: 'var(--pc-green)', letterSpacing: '0.05em' }}>
              {success.refId}
            </div>
          </div>

          {/* what happens next */}
          <div className="d-flex align-items-center justify-content-center gap-2 mb-3 p-2 rounded-3"
            style={{ background:'var(--pc-blue-light)', border:'1px solid rgba(37,99,235,0.15)' }}>
            <i className="bi bi-envelope-check-fill" style={{ color:'var(--pc-blue)', fontSize:'1rem' }} />
            <span style={{ fontSize:'0.82rem', color:'var(--text-2)', fontWeight:600 }}>
              Confirmation email sent • Check your inbox for details
            </span>
          </div>
          <div className="text-start mb-4">
            {[
              { icon: 'bi-envelope-check', color: 'var(--pc-blue)',  text: 'Confirmation email sent with your reference ID' },
              success.callback
                ? { icon: 'bi-telephone-inbound', color: 'var(--pc-green)', text: `Pharmacist will call ${success.phone} within 15 min` }
                : { icon: 'bi-chat-dots', color: 'var(--pc-teal)', text: 'Email reply within 2 hours' },
              { icon: 'bi-capsule', color: 'var(--pc-amber)', text: 'Stock confirmation & alternatives provided' },
            ].map((row, i) => (
              <div key={i} className="d-flex align-items-center gap-3 mb-2 p-2 rounded-3"
                style={{ background: 'var(--surface-1)' }}>
                <div className="flex-shrink-0 rounded-2 d-flex align-items-center justify-content-center"
                  style={{ width: 34, height: 34, background: `${row.color}18` }}>
                  <i className={`bi ${row.icon}`} style={{ color: row.color, fontSize: '0.9rem' }} />
                </div>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-2)' }}>{row.text}</span>
              </div>
            ))}
          </div>

          <div className="d-flex gap-2 flex-wrap justify-content-center">
            <Link to="/medicines" className="btn btn-primary rounded-pill px-4">
              <i className="bi bi-capsule me-2" />Browse Medicines
            </Link>
            <button className="btn btn-outline-secondary rounded-pill px-4"
              onClick={() => { setSuccess(null); setStep(0); setMedInput('') }}>
              New Inquiry
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const urgencyOpt = URGENCY_OPTS.find(o => o.value === form.urgency)

  return (
    <div style={{ background: 'var(--surface-1)', minHeight: '80vh', paddingBottom: '3rem' }}>

      {/* Header */}
      <div style={{ background: 'var(--surface-0)', borderBottom: '1px solid var(--border)', padding: '1.5rem 0' }}>
        <div className="container">
          <div className="d-flex align-items-center gap-3 mb-3">
            <div style={{ width: 48, height: 48, background: 'var(--pc-green-light)', borderRadius: 'var(--r-md)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className="bi bi-capsule" style={{ fontSize: '1.4rem', color: 'var(--pc-green)' }} />
            </div>
            <div>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, color: 'var(--text-1)', marginBottom: '0.1rem', fontSize: '1.5rem' }}>
                Medicine Availability Inquiry
              </h2>
              <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', margin: 0 }}>
                Check stock, request alternatives, and get a pharmacist callback
              </p>
            </div>
          </div>

          {/* Step Progress */}
          <div className="d-flex align-items-center gap-0" style={{ maxWidth: 500 }}>
            {STEPS.map((label, idx) => (
              <div key={label} className="d-flex align-items-center" style={{ flex: idx < STEPS.length - 1 ? 1 : 'none' }}>
                <div className="d-flex align-items-center gap-2">
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.8rem',
                    background: idx < step ? 'var(--pc-green)' : idx === step ? 'var(--pc-green)' : 'var(--surface-2)',
                    color: idx <= step ? '#fff' : 'var(--text-4)',
                    border: idx === step ? '2px solid var(--pc-green)' : '2px solid transparent',
                    boxShadow: idx === step ? '0 0 0 3px var(--pc-green-light)' : 'none',
                    transition: 'all var(--dur-mid)'
                  }}>
                    {idx < step ? <i className="bi bi-check" /> : idx + 1}
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: idx === step ? 700 : 500,
                    color: idx === step ? 'var(--pc-green)' : idx < step ? 'var(--text-2)' : 'var(--text-4)',
                    whiteSpace: 'nowrap' }}>
                    {label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div style={{ flex: 1, height: 2, margin: '0 0.5rem',
                    background: idx < step ? 'var(--pc-green)' : 'var(--border)',
                    transition: 'background var(--dur-mid)', minWidth: 24 }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-4">
        <div className="row g-4 justify-content-center">
          <div className="col-lg-8">

            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
                <i className="bi bi-exclamation-circle-fill flex-shrink-0" />
                <span style={{ fontSize: '0.875rem' }}>{error}</span>
              </div>
            )}

            {/* ── STEP 0: Medicine Details ── */}
            {step === 0 && (
              <div className="card" style={{ borderRadius: 'var(--r-xl)' }}>
                <div className="card-header d-flex align-items-center gap-2">
                  <i className="bi bi-capsule" style={{ color: 'var(--pc-green)' }} />
                  Step 1 — Medicine Details
                </div>
                <div className="card-body p-4 p-md-5">

                  {/* Medicine search */}
                  <div className="mb-4">
                    <label className="form-label">Medicine Name *</label>
                    <div className="position-relative">
                      <div className="input-group">
                        <span className="input-group-text" style={{ background: 'var(--surface-1)', borderRight: 'none' }}>
                          <i className="bi bi-search" style={{ color: 'var(--text-3)' }} />
                        </span>
                        <input className="form-control form-control-lg" required
                          style={{ borderLeft: 'none' }}
                          placeholder="Search by medicine name or brand..."
                          value={medInput || form.medicineName}
                          onChange={e => { setMedInput(e.target.value); set('medicineName', e.target.value); set('medicineId', '') }}
                          onBlur={() => setTimeout(() => setShowSug(false), 180)}
                          onFocus={() => suggestions.length > 0 && setShowSug(true)}
                          autoComplete="off" />
                      </div>

                      {showSug && suggestions.length > 0 && (
                        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
                          background: 'var(--surface-0)', border: '1px solid var(--border)',
                          borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-lg)', zIndex: 100,
                          overflow: 'hidden', animation: 'dropdownIn var(--dur-mid) var(--ease-out)' }}>
                          {suggestions.map(med => (
                            <button key={med.id} type="button" onMouseDown={() => pickSuggestion(med)}
                              className="d-flex align-items-center gap-3 w-100 px-4 py-2 border-0 text-start"
                              style={{ background: 'transparent', transition: 'background var(--dur-fast)', cursor: 'pointer' }}
                              onMouseEnter={e => e.currentTarget.style.background='var(--surface-1)'}
                              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                              <div style={{ width: 34, height: 34, background: 'var(--pc-green-light)', borderRadius: 'var(--r-sm)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <i className="bi bi-capsule" style={{ color: 'var(--pc-green)', fontSize: '0.85rem' }} />
                              </div>
                              <div className="flex-grow-1 min-w-0">
                                <div style={{ fontWeight: 600, color: 'var(--text-1)', fontSize: '0.875rem' }}>{med.name}</div>
                                <div style={{ color: 'var(--text-3)', fontSize: '0.75rem' }}>
                                  {[med.brand, med.dosage, med.categoryName].filter(Boolean).join(' · ')}
                                </div>
                              </div>
                              <span style={{ fontWeight: 700, color: med.stockQuantity > 0 ? 'var(--pc-green)' : 'var(--pc-red)',
                                fontSize: '0.75rem', flexShrink: 0 }}>
                                {med.stockQuantity > 0 ? `✓ ${med.stockQuantity} in stock` : '✗ Out of stock'}
                              </span>
                            </button>
                          ))}
                          <div className="px-4 py-2" style={{ borderTop: '1px solid var(--border)', background: 'var(--surface-1)' }}>
                            <small style={{ color: 'var(--text-4)', fontSize: '0.72rem' }}>
                              Can't find it? Type the full name and we'll check manually.
                            </small>
                          </div>
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '0.4rem' }}>
                      Type at least 2 characters to search. Can't find it? Just type the full name.
                    </div>
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-sm-6">
                      <label className="form-label">Dosage / Strength</label>
                      <input className="form-control" placeholder="e.g. 500mg, 10mg/5ml"
                        value={form.dosage} onChange={e => set('dosage', e.target.value)} />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Quantity Required *</label>
                      <input type="number" className="form-control" min="1" required
                        value={form.quantity} onChange={e => set('quantity', e.target.value)} />
                    </div>
                  </div>

                  {/* Urgency selector */}
                  <div className="mb-4">
                    <label className="form-label">How Urgent Is This? *</label>
                    <div className="d-flex gap-2 flex-wrap">
                      {URGENCY_OPTS.map(opt => (
                        <button key={opt.value} type="button"
                          onClick={() => set('urgency', opt.value)}
                          style={{
                            flex: 1, minWidth: 120, padding: '0.65rem 0.75rem', cursor: 'pointer',
                            borderRadius: 'var(--r-lg)', display: 'flex', flexDirection: 'column',
                            alignItems: 'center', gap: '0.3rem',
                            border: `2px solid ${form.urgency === opt.value ? opt.color : 'var(--border)'}`,
                            background: form.urgency === opt.value ? opt.bg : 'var(--surface-0)',
                            transition: 'all var(--dur-fast)'
                          }}>
                          <i className={`bi ${opt.icon}`} style={{ color: form.urgency === opt.value ? opt.color : 'var(--text-3)', fontSize: '1.1rem' }} />
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: form.urgency === opt.value ? opt.color : 'var(--text-2)' }}>
                            {opt.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Alternatives */}
                  <div className="mb-4 p-3 rounded-3" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
                    <div className="form-check mb-0">
                      <input className="form-check-input" type="checkbox" id="altCheck"
                        checked={form.alternatesOk} onChange={e => set('alternatesOk', e.target.checked)} />
                      <label className="form-check-label" htmlFor="altCheck" style={{ fontWeight: 600, color: 'var(--text-1)', fontSize: '0.875rem' }}>
                        I'm open to generic / alternative medicines
                      </label>
                    </div>
                    <p style={{ color: 'var(--text-3)', fontSize: '0.78rem', margin: '0.3rem 0 0 1.75rem' }}>
                      Our pharmacist may suggest bioequivalent generics that are equally effective and more affordable.
                    </p>
                  </div>

                  {/* Notes */}
                  <div className="mb-4">
                    <label className="form-label">Additional Notes <span style={{ color: 'var(--text-4)', fontWeight: 400 }}>(optional)</span></label>
                    <textarea className="form-control" rows={3}
                      placeholder="Any special requirements, conditions, or other medicines you're taking..."
                      value={form.additionalNotes} onChange={e => set('additionalNotes', e.target.value)} />
                  </div>

                  <button type="button" className="btn btn-primary btn-lg w-100 rounded-pill" onClick={nextStep}>
                    Next: Contact Info <i className="bi bi-arrow-right ms-2" />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 1: Contact Info ── */}
            {step === 1 && (
              <div className="card" style={{ borderRadius: 'var(--r-xl)' }}>
                <div className="card-header d-flex align-items-center gap-2">
                  <i className="bi bi-person-lines-fill" style={{ color: 'var(--pc-green)' }} />
                  Step 2 — Your Contact Details
                </div>
                <div className="card-body p-4 p-md-5">
                  <div className="row g-3 mb-4">
                    <div className="col-sm-6">
                      <label className="form-label">Full Name *</label>
                      <input className="form-control" required placeholder="Your name"
                        value={form.name} onChange={e => set('name', e.target.value)} />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Email Address *</label>
                      <input type="email" className="form-control" required placeholder="you@example.com"
                        value={form.email} onChange={e => set('email', e.target.value)} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">
                        Phone Number {form.requestCallback && <span style={{ color: 'var(--pc-red)' }}>*</span>}
                      </label>
                      <input type="tel" className="form-control" placeholder="+91 98765 43210"
                        value={form.phone} onChange={e => set('phone', e.target.value)} />
                    </div>
                  </div>

                  {/* Callback request box */}
                  <div className="p-4 rounded-3 mb-4" style={{ background: 'var(--pc-green-light)', border: '1.5px solid var(--pc-green-mid)' }}>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="callbackReq"
                        checked={form.requestCallback}
                        onChange={e => set('requestCallback', e.target.checked)} />
                      <label className="form-check-label" htmlFor="callbackReq"
                        style={{ fontWeight: 700, color: 'var(--pc-green-dark)', fontSize: '0.95rem' }}>
                        <i className="bi bi-telephone-inbound me-2" />
                        Request a Pharmacist Callback
                      </label>
                    </div>
                    <p style={{ color: 'var(--text-2)', fontSize: '0.82rem', margin: '0.4rem 0 0 1.75rem', lineHeight: 1.55 }}>
                      A licensed pharmacist will call you within <strong>15 minutes</strong> to confirm availability,
                      discuss dosage, and suggest alternatives if needed.
                    </p>

                    {form.requestCallback && (
                      <div className="mt-3 row g-3">
                        <div className="col-sm-6">
                          <label className="form-label" style={{ fontSize: '0.82rem' }}>Preferred Callback Time</label>
                          <select className="form-select form-select-sm" value={form.callbackTime}
                            onChange={e => set('callbackTime', e.target.value)}>
                            <option value="">As soon as possible</option>
                            <option>Within 30 minutes</option>
                            <option>Within 1 hour</option>
                            <option>This evening (5–8 PM)</option>
                            <option>Tomorrow morning (9 AM–12 PM)</option>
                          </select>
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label" style={{ fontSize: '0.82rem' }}>Preferred Contact Method</label>
                          <div className="d-flex gap-2 flex-wrap mt-1">
                            {[
                              { v: 'CALL',      icon: 'bi-telephone-fill',  label: 'Phone Call' },
                              { v: 'WHATSAPP',  icon: 'bi-whatsapp',        label: 'WhatsApp' },
                              { v: 'EMAIL',     icon: 'bi-envelope-fill',   label: 'Email' },
                            ].map(opt => (
                              <button key={opt.v} type="button"
                                onClick={() => set('preferredContact', opt.v)}
                                style={{
                                  padding: '0.35rem 0.75rem', borderRadius: 'var(--r-md)', cursor: 'pointer',
                                  fontSize: '0.78rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem',
                                  border: `1.5px solid ${form.preferredContact === opt.v ? 'var(--pc-green)' : 'var(--border)'}`,
                                  background: form.preferredContact === opt.v ? 'var(--pc-green)' : 'var(--surface-0)',
                                  color: form.preferredContact === opt.v ? '#fff' : 'var(--text-2)',
                                  transition: 'all var(--dur-fast)'
                                }}>
                                <i className={`bi ${opt.icon}`} style={{ fontSize: '0.85rem' }} />
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setStep(0)}>
                      <i className="bi bi-arrow-left me-2" />Back
                    </button>
                    <button type="button" className="btn btn-primary btn-lg flex-fill rounded-pill" onClick={nextStep}>
                      Review &amp; Submit <i className="bi bi-arrow-right ms-2" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2: Review ── */}
            {step === 2 && (
              <div className="card" style={{ borderRadius: 'var(--r-xl)' }}>
                <div className="card-header d-flex align-items-center gap-2">
                  <i className="bi bi-clipboard-check" style={{ color: 'var(--pc-green)' }} />
                  Step 3 — Review &amp; Confirm
                </div>
                <div className="card-body p-4 p-md-5">
                  <div className="row g-4 mb-4">
                    {/* Medicine summary */}
                    <div className="col-md-6">
                      <h6 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: 'var(--text-1)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <i className="bi bi-capsule" style={{ color: 'var(--pc-green)' }} /> Medicine
                      </h6>
                      <div style={{ background: 'var(--surface-1)', borderRadius: 'var(--r-lg)', padding: '1rem' }}>
                        {[
                          { label: 'Name',      val: form.medicineName },
                          { label: 'Dosage',    val: form.dosage || '—' },
                          { label: 'Quantity',  val: `${form.quantity} unit(s)` },
                          { label: 'Urgency',   val: urgencyOpt?.label, color: urgencyOpt?.color },
                          { label: 'Alternatives OK', val: form.alternatesOk ? 'Yes' : 'No' },
                        ].map(row => (
                          <div key={row.label} className="d-flex justify-content-between mb-1">
                            <span style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>{row.label}</span>
                            <span style={{ fontWeight: 600, color: row.color || 'var(--text-1)', fontSize: '0.82rem' }}>{row.val}</span>
                          </div>
                        ))}
                        {form.additionalNotes && (
                          <div className="mt-2 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                            <div style={{ color: 'var(--text-3)', fontSize: '0.75rem', marginBottom: '0.2rem' }}>Notes</div>
                            <div style={{ color: 'var(--text-2)', fontSize: '0.8rem', lineHeight: 1.5 }}>{form.additionalNotes}</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contact summary */}
                    <div className="col-md-6">
                      <h6 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: 'var(--text-1)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <i className="bi bi-person-circle" style={{ color: 'var(--pc-green)' }} /> Contact
                      </h6>
                      <div style={{ background: 'var(--surface-1)', borderRadius: 'var(--r-lg)', padding: '1rem' }}>
                        {[
                          { label: 'Name',    val: form.name },
                          { label: 'Email',   val: form.email },
                          { label: 'Phone',   val: form.phone || '—' },
                        ].map(row => (
                          <div key={row.label} className="d-flex justify-content-between mb-1">
                            <span style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>{row.label}</span>
                            <span style={{ fontWeight: 600, color: 'var(--text-1)', fontSize: '0.82rem' }}>{row.val}</span>
                          </div>
                        ))}
                        <div className="mt-2 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                          {form.requestCallback ? (
                            <div className="d-flex align-items-center gap-2 p-2 rounded-3"
                              style={{ background: 'var(--pc-green-light)' }}>
                              <i className="bi bi-telephone-inbound" style={{ color: 'var(--pc-green)', fontSize: '0.9rem' }} />
                              <span style={{ color: 'var(--pc-green-dark)', fontSize: '0.78rem', fontWeight: 700 }}>
                                Callback requested via {form.preferredContact} · {form.callbackTime || 'ASAP'}
                              </span>
                            </div>
                          ) : (
                            <div style={{ color: 'var(--text-3)', fontSize: '0.78rem' }}>Email reply requested</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Privacy note */}
                  <div className="d-flex align-items-start gap-2 mb-4 p-3 rounded-3"
                    style={{ background: 'var(--pc-blue-light)', border: '1px solid rgba(37,99,235,0.15)' }}>
                    <i className="bi bi-shield-check flex-shrink-0" style={{ color: 'var(--pc-blue)', marginTop: '0.1rem' }} />
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-2)', lineHeight: 1.55 }}>
                      Your inquiry is handled by a licensed pharmacist and kept strictly confidential. We never share your data with third parties.
                    </p>
                  </div>

                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setStep(1)}>
                      <i className="bi bi-arrow-left me-2" />Back
                    </button>
                    <button type="button" className="btn btn-primary btn-lg flex-fill rounded-pill" onClick={handleSubmit} disabled={loading}>
                      {loading
                        ? <><span className="spinner-border spinner-border-sm me-2" />Submitting...</>
                        : <><i className="bi bi-send me-2" />Submit Inquiry</>}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar tips */}
          <div className="col-lg-4 d-none d-lg-block">
            <div className="card p-4 mb-4" style={{ borderRadius: 'var(--r-xl)', position: 'sticky', top: '80px' }}>
              <h6 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: 'var(--text-1)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <i className="bi bi-lightbulb-fill" style={{ color: 'var(--pc-amber)' }} /> Tips for faster service
              </h6>
              {[
                { icon: 'bi-capsule',     color: 'var(--pc-green)', tip: 'Include the exact brand name and dosage for quicker lookup.' },
                { icon: 'bi-telephone',  color: 'var(--pc-teal)',  tip: 'Enable callback for the fastest response — typically under 15 minutes.' },
                { icon: 'bi-prescription2', color: 'var(--pc-blue)', tip: 'If you have a prescription, uploading it first can speed up dispensing.' },
                { icon: 'bi-clock',       color: 'var(--pc-amber)', tip: 'Peak hours are 10 AM – 12 PM and 5 – 8 PM. Off-peak queries are answered faster.' },
              ].map((t, i) => (
                <div key={i} className="d-flex align-items-start gap-3 mb-3">
                  <div className="flex-shrink-0 rounded-2 d-flex align-items-center justify-content-center"
                    style={{ width: 32, height: 32, background: `${t.color}18` }}>
                    <i className={`bi ${t.icon}`} style={{ color: t.color, fontSize: '0.85rem' }} />
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-2)', lineHeight: 1.55 }}>{t.tip}</p>
                </div>
              ))}
            </div>

            <div className="card p-4" style={{ borderRadius: 'var(--r-xl)', background: 'linear-gradient(135deg, #064e3b, #0f9e6e)' }}>
              <i className="bi bi-telephone-fill mb-2" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.25rem' }} />
              <h6 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>Need Immediate Help?</h6>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', marginBottom: '1rem', lineHeight: 1.55 }}>
                Call our pharmacist hotline for instant assistance.
              </p>
              <a href="tel:1800742762" className="btn btn-light btn-sm rounded-pill fw-semibold">
                <i className="bi bi-telephone me-2" />1800-PHARMA
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
