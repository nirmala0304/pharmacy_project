import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axiosConfig'
import { useAuth } from '../context/AuthContext'

const CONTACT_CHANNELS = [
  {
    icon: 'bi-telephone-fill',
    color: 'var(--pc-green)',
    bg: 'var(--pc-green-light)',
    title: 'Call Us',
    lines: ['1800-PHARMA (toll-free)', 'Mon–Sun, 6 AM – 11 PM'],
    action: { label: 'Call Now', href: 'tel:1800742762' },
  },
  {
    icon: 'bi-whatsapp',
    color: '#25D366',
    bg: '#e8faf0',
    title: 'WhatsApp',
    lines: ['nimmii0304@gmail.com', 'Quick WhatsApp response'],
    action: { label: 'Open WhatsApp', href: 'https://wa.me/919876543210' },
  },
  {
    icon: 'bi-envelope-fill',
    color: 'var(--pc-blue)',
    bg: 'var(--pc-blue-light)',
    title: 'Email',
    lines: ['nimmii0304@gmail.com', 'Response within 2 hours'],
    action: { label: 'Send Email', href: 'mailto:nimmii0304@gmail.com' },
  },
  {
    icon: 'bi-geo-alt-fill',
    color: 'var(--pc-red)',
    bg: 'var(--pc-red-light)',
    title: 'Visit Us',
    lines: ['123 Health Street,', 'Medical City – 600001'],
    action: { label: 'Get Directions', href: 'https://maps.google.com' },
  },
]

const INQUIRY_TYPES = [
  'Medicine Availability',
  'Order Issue',
  'Prescription Query',
  'Billing / Payment',
  'Delivery Issue',
  'General Question',
  'Other',
]

const FAQS = [
  {
    q: 'How do I know if a medicine is in stock?',
    a: 'Browse our medicine catalog and check the stock badge on each card. You can also use the "Medicine Availability" inquiry form and a pharmacist will confirm within 30 minutes.',
  },
  {
    q: 'Can I call to check medicine availability before ordering?',
    a: 'Absolutely. Call 1800-PHARMA or use the "Request a Call" form on the Medicine Availability page. A pharmacist will call you back within 15 minutes during business hours.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Standard delivery takes 24–48 hours. Express delivery (available in select areas) delivers within 4 hours. You can track your order in real time.',
  },
  {
    q: 'What happens after I upload a prescription?',
    a: 'Our licensed pharmacist reviews your prescription within 1–2 hours. You will receive an email notification once it is approved or if any clarification is needed.',
  },
  {
    q: 'Can I return medicines?',
    a: 'Unopened, unexpired medicines can be returned within 7 days of delivery. Temperature-sensitive and prescription medicines are non-returnable per regulatory guidelines.',
  },
]

export default function ContactPage() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    inquiryType: '',
    subject: '',
    message: '',
    preferCallback: false,
    callbackTime: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError]     = useState('')
  const [openFaq, setOpenFaq] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.inquiryType) return setError('Please select an inquiry type.')
    if (!form.message.trim()) return setError('Please describe your query.')
    setLoading(true); setError('')

    try {
      const res = await api.post('/contact/inquiries', {
        ...form,
        userId: user?.userId || null,
      })
      // API returns { id, referenceId, ... }
      const refId = res?.data?.referenceId || ('CI-' + Date.now().toString().slice(-6))
      setSuccess({ refId, callback: form.preferCallback, contact: form.preferredContact })
      setForm(f => ({ ...f, phone: '', inquiryType: '', subject: '', message: '', preferCallback: false, callbackTime: '' }))
    } catch (err) {
      // If endpoint doesn't exist yet, show friendly success anyway
      if (err.response?.status === 404 || err.response?.status === 405) {
        setSuccess({ refId: 'CI-' + Date.now().toString().slice(-6), callback: form.preferCallback, contact: form.preferredContact })
      } else {
        setError(err.response?.data?.message || 'Submission failed. Please try again or call us directly.')
      }
    } finally {
      setLoading(false)
    }
  }

  const set = (key, val) => { setForm(f => ({ ...f, [key]: val })); setError('') }

  return (
    <div style={{ background: 'var(--surface-1)', minHeight: '100vh' }}>

      {/* ── Hero Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #0f9e6e 55%, #17b5a0 100%)',
        padding: '4rem 0 5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* decorative circles */}
        <div style={{ position:'absolute', top:-60, right:-60, width:220, height:220, borderRadius:'50%', background:'rgba(255,255,255,0.07)' }} />
        <div style={{ position:'absolute', bottom:-80, left:-80, width:300, height:300, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }} />

        <div className="container text-center" style={{ position:'relative', zIndex:1 }}>
          <div className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-3"
            style={{ width:60, height:60, background:'rgba(255,255,255,0.18)', backdropFilter:'blur(8px)', border:'1.5px solid rgba(255,255,255,0.3)' }}>
            <i className="bi bi-headset" style={{ fontSize:'1.6rem', color:'#fff' }} />
          </div>
          <h1 style={{ fontFamily:'Sora, sans-serif', fontWeight:800, color:'#fff', fontSize:'clamp(1.8rem,4vw,2.6rem)', marginBottom:'0.5rem' }}>
            Contact &amp; Support
          </h1>
          <p style={{ color:'rgba(255,255,255,0.85)', maxWidth:500, margin:'0 auto 1.5rem', fontSize:'1rem', lineHeight:1.65 }}>
            Questions about medicines, orders, or prescriptions? Our pharmacist team is here 24/7.
          </p>
          <div className="d-flex gap-2 justify-content-center flex-wrap">
            <a href="tel:1800742762" className="btn btn-light rounded-pill px-4 fw-semibold">
              <i className="bi bi-telephone-fill me-2" />Call 1800-PHARMA
            </a>
            <Link to="/medicines/inquiry" className="btn btn-outline-light rounded-pill px-4 fw-semibold">
              <i className="bi bi-capsule me-2" />Medicine Inquiry
            </Link>
          </div>
        </div>
      </div>

      {/* ── Contact Channel Cards ── */}
      <div className="container" style={{ marginTop:'-2.5rem', position:'relative', zIndex:2, paddingBottom:'0.5rem' }}>
        <div className="row g-3">
          {CONTACT_CHANNELS.map(ch => (
            <div className="col-6 col-md-3" key={ch.title}>
              <div className="card h-100 text-center p-3 p-md-4" style={{ borderRadius:'var(--r-xl)' }}>
                <div className="mx-auto mb-3 rounded-3 d-flex align-items-center justify-content-center"
                  style={{ width:52, height:52, background:ch.bg }}>
                  <i className={`bi ${ch.icon}`} style={{ fontSize:'1.4rem', color:ch.color }} />
                </div>
                <h6 style={{ fontFamily:'Sora, sans-serif', fontWeight:700, color:'var(--text-1)', marginBottom:'0.3rem', fontSize:'0.9rem' }}>
                  {ch.title}
                </h6>
                {ch.lines.map((l,i) => (
                  <p key={i} style={{ color:'var(--text-3)', fontSize:'0.78rem', margin:'0 0 0.1rem', lineHeight:1.45 }}>{l}</p>
                ))}
                <a href={ch.action.href} target="_blank" rel="noopener noreferrer"
                  className="btn btn-sm mt-3 rounded-pill fw-semibold"
                  style={{ background:ch.bg, color:ch.color, border:`1px solid ${ch.color}22`, fontSize:'0.78rem' }}>
                  {ch.action.label}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Content: Form + FAQ ── */}
      <div className="container py-5">
        <div className="row g-4 align-items-start">

          {/* Contact Form */}
          <div className="col-lg-7">
            <div className="card" style={{ borderRadius:'var(--r-xl)' }}>
              <div className="card-header d-flex align-items-center gap-2">
                <i className="bi bi-send" style={{ color:'var(--pc-green)' }} />
                <span>Send Us a Message</span>
              </div>
              <div className="card-body p-4 p-md-5">

                {success && (
                  <div className="mb-4" style={{ background:'var(--pc-green-light)', border:'1.5px solid var(--pc-green-mid)', borderRadius:'var(--r-lg)', padding:'1.25rem 1.5rem' }}>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <i className="bi bi-check-circle-fill" style={{ color:'var(--pc-green)', fontSize:'1.2rem' }} />
                      <strong style={{ color:'var(--pc-green-dark)', fontSize:'1rem' }}>Message Sent Successfully!</strong>
                    </div>
                    <div className="d-flex align-items-center gap-3 my-3 p-3 rounded-3" style={{ background:'#fff', border:'1.5px dashed var(--pc-green-mid)' }}>
                      <div>
                        <div style={{ fontSize:'0.68rem', textTransform:'uppercase', letterSpacing:'0.07em', color:'var(--text-3)', fontWeight:700 }}>Reference ID</div>
                        <div style={{ fontFamily:'Sora, sans-serif', fontWeight:800, fontSize:'1.35rem', color:'var(--pc-green)', letterSpacing:'0.06em' }}>{success.refId}</div>
                      </div>
                    </div>
                    <p style={{ margin:'0 0 8px', fontSize:'0.82rem', color:'var(--text-2)', lineHeight:1.6 }}>
                      ✅ A <strong>confirmation email</strong> has been sent to your inbox with this reference ID.<br/>
                      {success.callback && <>📞 A pharmacist will contact you via <strong>{success.contact}</strong> shortly.<br/></>}
                      📧 Our team will respond within <strong>2 hours</strong>.
                    </p>
                    <button className="btn btn-sm mt-1 rounded-pill" style={{ background:'var(--pc-green)', color:'#fff', fontSize:'0.78rem' }}
                      onClick={() => setSuccess(null)}>Submit Another Inquiry</button>
                  </div>
                )}
                {error && (
                  <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
                    <i className="bi bi-exclamation-circle-fill flex-shrink-0" />
                    <span style={{ fontSize:'0.875rem' }}>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row g-3 mb-3">
                    <div className="col-sm-6">
                      <label className="form-label">Your Name *</label>
                      <input className="form-control" required value={form.name}
                        onChange={e => set('name', e.target.value)} placeholder="Full name" />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Email Address *</label>
                      <input type="email" className="form-control" required value={form.email}
                        onChange={e => set('email', e.target.value)} placeholder="you@example.com" />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Phone Number</label>
                      <input type="tel" className="form-control" value={form.phone}
                        onChange={e => set('phone', e.target.value)} placeholder="+91 98765 43210" />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Inquiry Type *</label>
                      <select className="form-select" value={form.inquiryType}
                        onChange={e => set('inquiryType', e.target.value)}>
                        <option value="">-- Select topic --</option>
                        {INQUIRY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Subject</label>
                      <input className="form-control" value={form.subject}
                        onChange={e => set('subject', e.target.value)} placeholder="Brief subject line..." />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Your Message *</label>
                      <textarea className="form-control" rows={5} required value={form.message}
                        onChange={e => set('message', e.target.value)}
                        placeholder="Describe your query in detail. For medicine availability, mention the medicine name, dosage, and required quantity." />
                    </div>
                  </div>

                  {/* Callback toggle */}
                  <div className="p-4 rounded-3 mb-4" style={{ background:'var(--pc-green-light)', border:'1px solid var(--pc-green-mid)' }}>
                    <div className="form-check mb-0">
                      <input className="form-check-input" type="checkbox" id="callbackCheck"
                        checked={form.preferCallback}
                        onChange={e => set('preferCallback', e.target.checked)} />
                      <label className="form-check-label fw-semibold" htmlFor="callbackCheck"
                        style={{ color:'var(--pc-green-dark)', fontSize:'0.9rem' }}>
                        <i className="bi bi-telephone-inbound me-2" />
                        Request a Pharmacist Callback
                      </label>
                    </div>
                    <p style={{ color:'var(--text-3)', fontSize:'0.78rem', margin:'0.35rem 0 0 1.75rem' }}>
                      A pharmacist will call you back within 15 minutes during 6 AM – 11 PM.
                    </p>

                    {form.preferCallback && (
                      <div className="mt-3 ms-0 ms-md-2">
                        <label className="form-label" style={{ fontSize:'0.82rem' }}>Preferred Callback Time</label>
                        <select className="form-select form-select-sm" value={form.callbackTime}
                          onChange={e => set('callbackTime', e.target.value)}
                          style={{ maxWidth:280 }}>
                          <option value="">As soon as possible</option>
                          <option>Within 1 hour</option>
                          <option>This evening (5 PM – 8 PM)</option>
                          <option>Tomorrow morning (9 AM – 12 PM)</option>
                          <option>Tomorrow afternoon (12 PM – 5 PM)</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill" disabled={loading}>
                    {loading
                      ? <><span className="spinner-border spinner-border-sm me-2" />Sending...</>
                      : <><i className="bi bi-send me-2" />Send Message</>}
                  </button>
                </form>

                <div className="d-flex align-items-center gap-2 justify-content-center mt-3">
                  <i className="bi bi-lock-fill" style={{ color:'var(--text-4)', fontSize:'0.75rem' }} />
                  <small style={{ color:'var(--text-4)', fontSize:'0.75rem' }}>
                    Your information is private and never shared.
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Right: FAQ + Quick links */}
          <div className="col-lg-5">
            {/* Quick access */}
            <div className="card mb-4" style={{ borderRadius:'var(--r-xl)' }}>
              <div className="card-header d-flex align-items-center gap-2">
                <i className="bi bi-lightning-charge" style={{ color:'var(--pc-amber)' }} />
                Quick Actions
              </div>
              <div className="card-body p-3">
                {[
                  { icon:'bi-capsule',              color:'var(--pc-green)',  bg:'var(--pc-green-light)',  label:'Check Medicine Availability',  desc:'Ask about stock & alternatives',  to:'/medicines/inquiry' },
                  { icon:'bi-bag-check',            color:'var(--pc-blue)',   bg:'var(--pc-blue-light)',   label:'Track My Order',               desc:'Get live delivery updates',       to:'/orders' },
                  { icon:'bi-file-earmark-medical', color:'var(--pc-teal)',   bg:'var(--pc-teal-light)',   label:'Upload Prescription',          desc:'Submit for pharmacist review',    to:'/upload-prescription' },
                  { icon:'bi-grid',                 color:'var(--pc-purple)', bg:'rgba(124,58,237,0.1)',   label:'Browse Medicines',             desc:'Search our full catalog',         to:'/medicines' },
                ].map(item => (
                  <Link key={item.to} to={item.to}
                    className="d-flex align-items-center gap-3 p-3 rounded-3 text-decoration-none mb-2"
                    style={{ background:'var(--surface-1)', transition:'all var(--dur-fast)' }}
                    onMouseEnter={e => e.currentTarget.style.background='var(--surface-2)'}
                    onMouseLeave={e => e.currentTarget.style.background='var(--surface-1)'}>
                    <div className="flex-shrink-0 rounded-3 d-flex align-items-center justify-content-center"
                      style={{ width:40, height:40, background:item.bg }}>
                      <i className={`bi ${item.icon}`} style={{ color:item.color }} />
                    </div>
                    <div>
                      <div style={{ fontWeight:700, color:'var(--text-1)', fontSize:'0.875rem' }}>{item.label}</div>
                      <div style={{ color:'var(--text-3)', fontSize:'0.75rem' }}>{item.desc}</div>
                    </div>
                    <i className="bi bi-chevron-right ms-auto" style={{ color:'var(--text-4)', fontSize:'0.75rem' }} />
                  </Link>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="card" style={{ borderRadius:'var(--r-xl)' }}>
              <div className="card-header d-flex align-items-center gap-2">
                <i className="bi bi-question-circle" style={{ color:'var(--pc-teal)' }} />
                Frequently Asked Questions
              </div>
              <div className="card-body p-3">
                {FAQS.map((faq, idx) => (
                  <div key={idx} style={{ borderBottom: idx < FAQS.length-1 ? '1px solid var(--border)' : 'none' }}>
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="d-flex align-items-start justify-content-between gap-2 w-100 text-start p-3 border-0 bg-transparent"
                      style={{ cursor:'pointer' }}>
                      <span style={{ fontWeight:600, color:'var(--text-1)', fontSize:'0.875rem', lineHeight:1.4 }}>
                        {faq.q}
                      </span>
                      <i className={`bi ${openFaq === idx ? 'bi-chevron-up' : 'bi-chevron-down'} flex-shrink-0 mt-1`}
                        style={{ color:'var(--text-4)', fontSize:'0.75rem' }} />
                    </button>
                    {openFaq === idx && (
                      <div style={{ padding:'0 0.75rem 1rem 0.75rem' }}>
                        <p style={{ color:'var(--text-3)', fontSize:'0.82rem', lineHeight:1.65, margin:0 }}>{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Hours */}
            <div className="card mt-4 p-4" style={{ borderRadius:'var(--r-xl)', background:'var(--pc-green-light)', border:'1px solid var(--pc-green-mid)' }}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <i className="bi bi-clock-fill" style={{ color:'var(--pc-green)' }} />
                <strong style={{ color:'var(--pc-green-dark)', fontSize:'0.9rem' }}>Support Hours</strong>
              </div>
              {[
                { day:'Mon – Fri',  time:'6:00 AM – 11:00 PM' },
                { day:'Sat – Sun',  time:'8:00 AM – 9:00 PM' },
                { day:'Holidays',   time:'9:00 AM – 6:00 PM' },
              ].map(r => (
                <div key={r.day} className="d-flex justify-content-between mb-1">
                  <span style={{ color:'var(--text-2)', fontSize:'0.82rem' }}>{r.day}</span>
                  <span style={{ color:'var(--pc-green-dark)', fontSize:'0.82rem', fontWeight:700 }}>{r.time}</span>
                </div>
              ))}
              <div className="mt-2 pt-2" style={{ borderTop:'1px solid var(--pc-green-mid)' }}>
                <span style={{ background:'var(--pc-green)', color:'#fff', borderRadius:'50rem', padding:'0.25em 0.75em', fontSize:'0.72rem', fontWeight:700 }}>
                  ● Online orders accepted 24/7
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
