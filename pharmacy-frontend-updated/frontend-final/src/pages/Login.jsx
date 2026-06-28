import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/login', form)
      const { token, email, name, role, userId } = res.data
      login({ email, name, role, userId }, token)
      if (role === 'ADMIN') navigate('/admin')
      else if (role === 'PHARMACIST') navigate('/pharmacist')
      else navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || err.response?.data || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-1)', display: 'flex', alignItems: 'center' }}>
      {/* Left panel (decorative) */}
      <div className="d-none d-lg-flex flex-column justify-content-between"
        style={{
          width: '42%', minHeight: '100vh', flexShrink: 0,
          background: 'linear-gradient(160deg, #064e3b 0%, #0f9e6e 55%, #17b5a0 100%)',
          padding: '3rem', position: 'relative', overflow: 'hidden'
        }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240,
          borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'absolute', bottom: 80, left: -80, width: 320, height: 320,
          borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="d-flex align-items-center gap-2 mb-5">
            <div style={{ width: 38, height: 38, background: 'rgba(255,255,255,0.2)',
              borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', color: '#fff' }}>
              <i className="bi bi-capsule" />
            </div>
            <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: '#fff', fontSize: '1.2rem' }}>
              PharmaCare
            </span>
          </div>

          <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, color: '#fff',
            fontSize: '2rem', lineHeight: 1.2, marginBottom: '1rem' }}>
            Your health,<br />delivered.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', lineHeight: 1.65 }}>
            Access thousands of verified medicines, upload prescriptions, and track orders — all in one place.
          </p>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {[
            { icon: 'bi-shield-check', text: 'Licensed & verified medicines' },
            { icon: 'bi-truck',        text: 'Fast doorstep delivery' },
            { icon: 'bi-lock',         text: 'Secure & private' },
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
        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* Mobile logo */}
          <div className="d-lg-none text-center mb-4">
            <div className="navbar-brand-icon mx-auto mb-2" style={{ width: 48, height: 48, fontSize: '1.3rem' }}>
              <i className="bi bi-capsule" />
            </div>
            <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: 'var(--text-1)', fontSize: '1.2rem' }}>
              PharmaCare
            </span>
          </div>

          <h3 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, color: 'var(--text-1)',
            fontSize: '1.75rem', marginBottom: '0.35rem' }}>Welcome back</h3>
          <p style={{ color: 'var(--text-3)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Sign in to your PharmaCare account
          </p>

          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
              <i className="bi bi-exclamation-circle-fill flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-control form-control-lg" required
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com" autoComplete="email" />
            </div>

            <div className="mb-4">
              <label className="form-label">Password</label>
              <div className="input-group">
                <input type={showPass ? 'text' : 'password'} className="form-control form-control-lg" required
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••" autoComplete="current-password" />
                <button type="button" className="input-group-text" style={{ cursor: 'pointer', background: 'var(--surface-1)', borderLeft: 'none' }}
                  onClick={() => setShowPass(p => !p)}>
                  <i className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'}`} style={{ color: 'var(--text-3)' }} />
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill" disabled={loading}>
              {loading
                ? <><span className="spinner-border spinner-border-sm me-2" />Signing in...</>
                : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-4 mb-0" style={{ fontSize: '0.875rem', color: 'var(--text-3)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--pc-green)', fontWeight: 600, textDecoration: 'none' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
