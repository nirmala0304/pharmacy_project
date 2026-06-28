import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'CUSTOMER' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/auth/register', form)
      setSuccess('Account created! Redirecting to sign in...')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || err.response?.data || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-1)', display: 'flex', alignItems: 'center' }}>
      {/* Left decorative panel */}
      <div className="d-none d-lg-flex flex-column justify-content-between"
        style={{
          width: '38%', minHeight: '100vh', flexShrink: 0,
          background: 'linear-gradient(160deg, #064e3b 0%, #0f9e6e 55%, #17b5a0 100%)',
          padding: '3rem', position: 'relative', overflow: 'hidden'
        }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 260, height: 260,
          borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: 60, left: -100, width: 340, height: 340,
          borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="d-flex align-items-center gap-2 mb-5">
            <div style={{ width: 38, height: 38, background: 'rgba(255,255,255,0.2)', borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', color: '#fff' }}>
              <i className="bi bi-capsule" />
            </div>
            <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: '#fff', fontSize: '1.2rem' }}>PharmaCare</span>
          </div>
          <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, color: '#fff', fontSize: '1.9rem', lineHeight: 1.2, marginBottom: '1rem' }}>
            Join thousands<br />of healthy users
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: 1.65 }}>
            Create your free account and start ordering medicines with confidence.
          </p>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {[
            { icon: 'bi-person-check', text: 'Free to join, no hidden fees' },
            { icon: 'bi-bell',         text: 'Real-time order updates' },
            { icon: 'bi-heart-pulse',  text: 'Trusted by 50,000+ customers' },
          ].map(item => (
            <div key={item.text} className="d-flex align-items-center gap-3 mb-3">
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className={`bi ${item.icon}`} style={{ color: '#fff', fontSize: '0.9rem' }} />
              </div>
              <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem' }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-grow-1 d-flex align-items-center justify-content-center px-3 py-5">
        <div style={{ width: '100%', maxWidth: 460 }}>
          <div className="d-lg-none text-center mb-4">
            <div className="navbar-brand-icon mx-auto mb-2" style={{ width: 48, height: 48, fontSize: '1.3rem' }}>
              <i className="bi bi-capsule" />
            </div>
          </div>

          <h3 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, color: 'var(--text-1)', fontSize: '1.75rem', marginBottom: '0.35rem' }}>
            Create account
          </h3>
          <p style={{ color: 'var(--text-3)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
            Fill in the details below to get started
          </p>

          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-exclamation-circle-fill flex-shrink-0" /><span>{error}</span>
            </div>
          )}
          {success && (
            <div className="alert alert-success d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-check-circle-fill flex-shrink-0" /><span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3 mb-3">
              <div className="col-12">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-control" required
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe" />
              </div>
              <div className="col-12">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-control" required
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com" />
              </div>
              <div className="col-sm-6">
                <label className="form-label">Password</label>
                <div className="input-group">
                  <input type={showPass ? 'text' : 'password'} className="form-control" required minLength={6}
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="Min. 6 characters" />
                  <button type="button" className="input-group-text" style={{ cursor: 'pointer', borderLeft: 'none', background: 'var(--surface-1)' }}
                    onClick={() => setShowPass(p => !p)}>
                    <i className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'}`} style={{ color: 'var(--text-3)' }} />
                  </button>
                </div>
              </div>
              <div className="col-sm-6">
                <label className="form-label">Phone Number</label>
                <input type="tel" className="form-control"
                  value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 43210" />
              </div>
            </div>



            <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill" disabled={loading}>
              {loading
                ? <><span className="spinner-border spinner-border-sm me-2" />Creating account...</>
                : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-4 mb-0" style={{ fontSize: '0.875rem', color: 'var(--text-3)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--pc-green)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
