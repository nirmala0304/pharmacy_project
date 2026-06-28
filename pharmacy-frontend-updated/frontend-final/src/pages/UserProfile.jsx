import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import api from '../api/axiosConfig'
import AddressMapPicker from '../components/AddressMapPicker'

const EMPTY_ADDR = { fullName: '', street: '', city: '', state: '', zipCode: '', country: 'India', phone: '' }

function AddressesTab() {
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading]     = useState(true)
  const [showForm, setShowForm]   = useState(false)
  const [editId, setEditId]       = useState(null)
  const [form, setForm]           = useState(EMPTY_ADDR)
  const [pickedCoords, setPickedCoords] = useState(null)
  const [saving, setSaving]       = useState(false)
  const [deleting, setDeleting]   = useState(null)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState('')

  useEffect(() => { fetchAddresses() }, [])

  const fetchAddresses = () => {
    setLoading(true)
    api.get('/addresses').then(r => setAddresses(r.data)).catch(() => setError('Failed to load.'))
      .finally(() => setLoading(false))
  }

  const openAdd = () => {
    setEditId(null); setForm(EMPTY_ADDR); setPickedCoords(null); setError(''); setShowForm(true)
  }
  const openEdit = (a) => {
    setEditId(a.id)
    setForm({ fullName: a.fullName||'', street: a.street||'', city: a.city||'',
      state: a.state||'', zipCode: a.zipCode||'', country: a.country||'India', phone: a.phone||'' })
    setPickedCoords(a.latitude && a.longitude ? { lat: a.latitude, lng: a.longitude } : null)
    setError(''); setShowForm(true)
  }

  const handleSave = async () => {
    const miss = ['fullName','street','city','state','zipCode','phone'].find(f => !form[f]?.trim())
    if (miss) return setError(`Please fill in: ${miss}`)
    setSaving(true); setError('')
    try {
      const payload = {
        ...form,
        latitude:  pickedCoords?.lat  || null,
        longitude: pickedCoords?.lng  || null,
      }
      if (editId) {
        const r = await api.put(`/addresses/${editId}`, payload)
        setAddresses(p => p.map(a => a.id === editId ? r.data : a))
      } else {
        const r = await api.post('/addresses', payload)
        setAddresses(p => [...p, r.data])
      }
      setShowForm(false); setEditId(null); setPickedCoords(null)
      setSuccess(editId ? 'Address updated!' : 'Address added!')
      setTimeout(() => setSuccess(''), 3000)
    } catch { setError('Failed to save address.') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this address?')) return
    setDeleting(id)
    try {
      await api.delete(`/addresses/${id}`)
      setAddresses(p => p.filter(a => a.id !== id))
      setSuccess('Address deleted.'); setTimeout(() => setSuccess(''), 2500)
    } catch { setError('Failed to delete.') }
    finally { setDeleting(null) }
  }

  const handleSetDefault = async (addr) => {
    setSaving(true)
    try {
      await api.put(`/addresses/${addr.id}`, { ...addr, isDefault: true, default: true })
      setAddresses(p => p.map(a => ({ ...a, default: a.id === addr.id })))
      setSuccess('Default updated!'); setTimeout(() => setSuccess(''), 2500)
    } catch { setError('Failed.') }
    finally { setSaving(false) }
  }

  const fields = [
    { key:'fullName', label:'Full Name',  col:'col-md-6' },
    { key:'phone',    label:'Phone',      col:'col-md-6', type:'tel' },
    { key:'street',   label:'Street Address', col:'col-12' },
    { key:'city',     label:'City',       col:'col-md-4' },
    { key:'state',    label:'State',      col:'col-md-4' },
    { key:'zipCode',  label:'PIN Code',   col:'col-md-4' },
    { key:'country',  label:'Country',    col:'col-md-6' },
  ]

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h5 style={{ fontFamily:'Sora, sans-serif', fontWeight:700, color:'var(--text-1)', margin:0 }}>
          Delivery Addresses
        </h5>
        {!showForm && (
          <button className="btn btn-primary btn-sm rounded-pill px-3" onClick={openAdd}>
            <i className="bi bi-plus-circle me-1" />Add New
          </button>
        )}
      </div>

      {success && <div className="alert alert-success d-flex align-items-center gap-2 mb-3"><i className="bi bi-check-circle-fill flex-shrink-0" /><span>{success}</span></div>}
      {error   && <div className="alert alert-danger d-flex align-items-center gap-2 mb-3"><i className="bi bi-exclamation-circle-fill flex-shrink-0" /><span>{error}</span></div>}

      {showForm && (
        <div className="mb-4 p-4 rounded-3" style={{ background:'var(--surface-1)', border:'1.5px dashed var(--border-md)' }}>
          <h6 style={{ fontFamily:'Sora, sans-serif', fontWeight:700, color:'var(--text-1)', marginBottom:'1rem' }}>
            {editId ? 'Edit Address' : 'New Delivery Address'}
          </h6>

          <div className="row g-3 mb-4">
            {fields.map(f => (
              <div className={f.col} key={f.key}>
                <label className="form-label">{f.label}</label>
                <input type={f.type||'text'} className="form-control" value={form[f.key]}
                  onChange={e => { setForm(p => ({ ...p, [f.key]: e.target.value })); setError('') }} />
              </div>
            ))}
          </div>

          {/* Map picker */}
          <div className="mb-4">
            <label className="form-label d-flex align-items-center gap-2">
              <i className="bi bi-geo-alt-fill" style={{ color:'var(--pc-green)' }} />
              Pin Your Exact Location
              <span style={{ fontWeight:400, color:'var(--text-4)', fontSize:'0.78rem' }}>(recommended for accurate delivery)</span>
            </label>
            <AddressMapPicker
              address={form}
              onLocationSelect={setPickedCoords}
              initialLat={pickedCoords?.lat}
              initialLng={pickedCoords?.lng}
            />
            {pickedCoords && (
              <div style={{ marginTop:'0.5rem', display:'inline-flex', alignItems:'center', gap:'0.4rem',
                background:'var(--pc-green-light)', color:'var(--pc-green-dark)', padding:'0.3em 0.75em',
                borderRadius:'50rem', fontSize:'0.75rem', fontWeight:700 }}>
                <i className="bi bi-check-circle-fill" />
                Location pinned: {pickedCoords.lat.toFixed(4)}, {pickedCoords.lng.toFixed(4)}
              </div>
            )}
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-primary rounded-pill px-4" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : <><i className="bi bi-check-lg me-1" />{editId ? 'Update' : 'Save'} Address</>}
            </button>
            <button className="btn btn-outline-secondary rounded-pill px-4"
              onClick={() => { setShowForm(false); setPickedCoords(null); setError('') }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-4"><div className="spinner-border" style={{ color:'var(--pc-green)' }} /></div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-5" style={{ color:'var(--text-3)' }}>
          <i className="bi bi-geo-alt" style={{ fontSize:'2.5rem', opacity:.4, display:'block', marginBottom:'0.75rem' }} />
          <h6 style={{ color:'var(--text-2)' }}>No addresses saved</h6>
          <p style={{ fontSize:'0.875rem' }}>Add an address to speed up checkout.</p>
        </div>
      ) : (
        <div className="row g-3">
          {addresses.map(addr => (
            <div className="col-md-6" key={addr.id}>
              <div style={{
                border:`2px solid ${addr.default||addr['default'] ? 'var(--pc-green)' : 'var(--border)'}`,
                borderRadius:'var(--r-lg)', padding:'1.25rem',
                background: addr.default||addr['default'] ? 'var(--pc-green-light)' : 'var(--surface-0)',
                transition:'all var(--dur-fast)', position:'relative'
              }}>
                {(addr.default||addr['default']) && (
                  <span className="badge position-absolute" style={{ top:'0.75rem', right:'0.75rem', background:'var(--pc-green)', color:'#fff', fontSize:'0.68rem' }}>
                    ★ Default
                  </span>
                )}
                <div style={{ fontWeight:700, color:'var(--text-1)', marginBottom:'0.5rem' }}>{addr.fullName}</div>
                {[addr.street, `${addr.city}, ${addr.state} – ${addr.zipCode}`, addr.country||'India', addr.phone].map((row, i) => (
                  <div key={i} style={{ color:'var(--text-3)', fontSize:'0.82rem', lineHeight:1.5 }}>{row}</div>
                ))}

                {/* Show map pin if coordinates are saved */}
                {addr.latitude && addr.longitude && (
                  <div style={{ marginTop:'0.6rem', display:'inline-flex', alignItems:'center', gap:'0.4rem',
                    background:'var(--pc-teal-light)', color:'var(--pc-teal)', padding:'0.25em 0.65em',
                    borderRadius:'50rem', fontSize:'0.72rem', fontWeight:700 }}>
                    <i className="bi bi-geo-alt-fill" />
                    Location pinned · {parseFloat(addr.latitude).toFixed(3)}, {parseFloat(addr.longitude).toFixed(3)}
                  </div>
                )}

                <div className="d-flex gap-2 mt-3 flex-wrap">
                  <button className="btn btn-sm btn-outline-primary rounded-pill px-3" onClick={() => openEdit(addr)}>
                    <i className="bi bi-pencil me-1" />Edit
                  </button>
                  {!(addr.default||addr['default']) && (
                    <button className="btn btn-sm btn-outline-success rounded-pill px-3" onClick={() => handleSetDefault(addr)} disabled={saving}>
                      <i className="bi bi-star me-1" />Set Default
                    </button>
                  )}
                  <button className="btn btn-sm btn-outline-danger rounded-pill px-3 ms-auto"
                    onClick={() => handleDelete(addr.id)} disabled={deleting === addr.id}>
                    {deleting === addr.id ? <span className="spinner-border spinner-border-sm" /> : <><i className="bi bi-trash me-1" />Delete</>}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function UserProfile() {
  const { user, logout } = useAuth()
  const { darkMode, toggleDarkMode, preferences, updatePreference } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('profile')
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')

  useEffect(() => {
    const hash = location.hash.replace('#', '')
    if (['preferences','security','addresses'].includes(hash)) setActiveTab(hash)
    else setActiveTab('profile')
  }, [location.hash])

  const handleLogout = () => { logout(); navigate('/login') }
  const handleSavePreferences = () => { setSavedMsg('Preferences saved!'); setTimeout(() => setSavedMsg(''), 3000) }

  const tabs = [
    { id:'profile',     icon:'bi-person-circle',  label:'My Profile' },
    { id:'addresses',   icon:'bi-geo-alt',         label:'Addresses' },
    { id:'preferences', icon:'bi-sliders',         label:'Preferences' },
    { id:'security',    icon:'bi-shield-lock',     label:'Security' },
  ]

  return (
    <div style={{ background:'var(--surface-1)', minHeight:'80vh', paddingBottom:'3rem' }}>
      <div className="container py-4">
        <div className="row g-4 align-items-start">
          {/* Sidebar */}
          <div className="col-lg-3">
            <div className="card text-center p-4 mb-3">
              <div className="profile-avatar-ring mx-auto mb-3">{user?.name?.charAt(0).toUpperCase()}</div>
              <h5 style={{ fontFamily:'Sora, sans-serif', fontWeight:800, color:'var(--text-1)', marginBottom:'0.25rem' }}>{user?.name}</h5>
              <span style={{ background:'var(--pc-green-light)', color:'var(--pc-green-dark)', padding:'0.25em 0.85em', borderRadius:'50rem', fontSize:'0.75rem', fontWeight:700 }}>
                {user?.role}
              </span>
              <p style={{ color:'var(--text-3)', fontSize:'0.8rem', marginTop:'0.5rem', marginBottom:0 }}>{user?.email}</p>
            </div>
            <div className="card p-2">
              <div className="profile-tab-nav">
                {tabs.map(t => (
                  <button key={t.id} className={`profile-tab-btn ${activeTab === t.id ? 'active' : ''}`}
                    onClick={() => { setActiveTab(t.id); navigate(`#${t.id}`) }}>
                    <i className={`bi ${t.icon}`} style={{ fontSize:'1rem' }} />{t.label}
                  </button>
                ))}
                <button className="profile-tab-btn" style={{ color:'var(--pc-red)' }} onClick={() => setShowLogoutModal(true)}>
                  <i className="bi bi-box-arrow-right" style={{ fontSize:'1rem' }} />Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="col-lg-9">
            {activeTab === 'profile' && (
              <div className="card p-4 p-md-5">
                <h5 style={{ fontFamily:'Sora, sans-serif', fontWeight:700, color:'var(--text-1)', marginBottom:'1.5rem' }}>Profile Details</h5>
                <div className="row g-3 mb-4">
                  {[
                    { icon:'bi-person',    label:'Full Name',  val: user?.name },
                    { icon:'bi-envelope',  label:'Email',      val: user?.email },
                    { icon:'bi-briefcase', label:'Role',       val: user?.role, badge:true },
                    { icon:'bi-hash',      label:'Account ID', val: `#${user?.userId || '—'}` },
                  ].map(item => (
                    <div className="col-sm-6" key={item.label}>
                      <div style={{ background:'var(--surface-1)', border:'1px solid var(--border)', borderRadius:'var(--r-md)', padding:'1rem' }}>
                        <div style={{ fontSize:'0.72rem', color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.05em', fontWeight:700, marginBottom:'0.4rem', display:'flex', alignItems:'center', gap:'0.4rem' }}>
                          <i className={`bi ${item.icon}`} />{item.label}
                        </div>
                        {item.badge
                          ? <span style={{ background:'var(--pc-green-light)', color:'var(--pc-green-dark)', padding:'0.25em 0.75em', borderRadius:'50rem', fontSize:'0.82rem', fontWeight:700 }}>{item.val}</span>
                          : <strong style={{ color:'var(--text-1)', fontSize:'0.95rem', wordBreak:'break-all' }}>{item.val}</strong>}
                      </div>
                    </div>
                  ))}
                </div>
                <h6 style={{ fontFamily:'Sora, sans-serif', fontWeight:700, color:'var(--text-1)', marginBottom:'1rem' }}>Quick Actions</h6>
                <div className="d-flex flex-wrap gap-2">
                  {user?.role === 'CUSTOMER' && (
                    <>
                      <button onClick={() => navigate('/orders')} className="btn btn-outline-primary rounded-pill px-4"><i className="bi bi-bag me-2" />My Orders</button>
                      <button onClick={() => navigate('/upload-prescription')} className="btn btn-outline-secondary rounded-pill px-4"><i className="bi bi-file-earmark-medical me-2" />Prescriptions</button>
                      <button onClick={() => navigate('/cart')} className="btn btn-outline-secondary rounded-pill px-4"><i className="bi bi-cart me-2" />Cart</button>
                    </>
                  )}
                  {(user?.role === 'PHARMACIST' || user?.role === 'ADMIN') && (
                    <button onClick={() => navigate('/pharmacist')} className="btn btn-primary rounded-pill px-4"><i className="bi bi-speedometer2 me-2" />Dashboard</button>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="card p-4 p-md-5"><AddressesTab /></div>
            )}

            {activeTab === 'preferences' && (
              <div className="card p-4 p-md-5">
                <h5 style={{ fontFamily:'Sora, sans-serif', fontWeight:700, color:'var(--text-1)', marginBottom:'1.5rem' }}>Preferences</h5>
                {savedMsg && <div className="alert alert-success d-flex align-items-center gap-2 mb-4"><i className="bi bi-check-circle-fill flex-shrink-0" /><span>{savedMsg}</span></div>}
                <h6 style={{ fontSize:'0.72rem', textTransform:'uppercase', letterSpacing:'0.07em', color:'var(--text-3)', fontWeight:700, marginBottom:'0.75rem' }}>Appearance</h6>
                <div className="card mb-4">
                  {[
                    { key:'darkMode', icon:'bi-moon-stars', label:'Dark Mode', desc:'Switch to dark interface', val:darkMode, onChange:toggleDarkMode },
                    { key:'compactView', icon:'bi-arrows-collapse', label:'Compact View', desc:'Reduce spacing for more content', val:preferences?.compactView, onChange:e => updatePreference('compactView', e.target.checked) },
                  ].map((item, i, arr) => (
                    <div key={item.key} className="d-flex align-items-center justify-content-between p-3 px-4"
                      style={{ borderBottom: i < arr.length-1 ? '1px solid var(--border)' : 'none' }}>
                      <div className="d-flex align-items-center gap-3">
                        <div style={{ width:38, height:38, background:'var(--surface-2)', borderRadius:'var(--r-sm)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                          <i className={`bi ${item.icon}`} style={{ color:'var(--text-2)' }} />
                        </div>
                        <div>
                          <div style={{ fontWeight:600, color:'var(--text-1)', fontSize:'0.875rem' }}>{item.label}</div>
                          <div style={{ color:'var(--text-3)', fontSize:'0.78rem' }}>{item.desc}</div>
                        </div>
                      </div>
                      <div className="form-check form-switch m-0">
                        <input className="form-check-input" type="checkbox" role="switch" style={{ width:'2.75rem', height:'1.4rem', cursor:'pointer' }}
                          checked={!!item.val} onChange={item.onChange} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-end">
                  <button onClick={handleSavePreferences} className="btn btn-primary rounded-pill px-5">
                    <i className="bi bi-check2-circle me-2" />Save Preferences
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="card p-4 p-md-5">
                <h5 style={{ fontFamily:'Sora, sans-serif', fontWeight:700, color:'var(--text-1)', marginBottom:'1.5rem' }}>Security</h5>
                <div className="alert alert-info d-flex align-items-start gap-3 mb-4">
                  <i className="bi bi-info-circle-fill flex-shrink-0 mt-1" />
                  <div style={{ fontSize:'0.875rem' }}><strong>Account Protection:</strong> Password changes are managed by the admin.</div>
                </div>
                <div className="p-4 rounded-3" style={{ border:'1.5px solid rgba(239,68,68,0.3)', background:'var(--pc-red-light)' }}>
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                    <div>
                      <h6 style={{ fontFamily:'Sora, sans-serif', fontWeight:700, color:'var(--pc-red)', marginBottom:'0.25rem' }}>Sign Out Everywhere</h6>
                      <p style={{ color:'var(--pc-red)', fontSize:'0.82rem', margin:0, opacity:.85 }}>Logout from all active sessions</p>
                    </div>
                    <button className="btn rounded-pill px-4" style={{ background:'var(--pc-red)', color:'#fff' }} onClick={() => setShowLogoutModal(true)}>
                      <i className="bi bi-box-arrow-right me-2" />Logout Now
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showLogoutModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:1055, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
          <div style={{ background:'var(--surface-0)', borderRadius:'var(--r-xl)', padding:'2rem', maxWidth:380, width:'100%', textAlign:'center', boxShadow:'var(--shadow-xl)' }}>
            <div style={{ width:60, height:60, background:'var(--pc-red-light)', borderRadius:'var(--r-md)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem' }}>
              <i className="bi bi-box-arrow-right" style={{ color:'var(--pc-red)', fontSize:'1.5rem' }} />
            </div>
            <h5 style={{ fontFamily:'Sora, sans-serif', fontWeight:800, color:'var(--text-1)', marginBottom:'0.5rem' }}>Sign Out?</h5>
            <p style={{ color:'var(--text-3)', fontSize:'0.875rem', marginBottom:'1.5rem' }}>You will need to enter your credentials to sign back in.</p>
            <div className="d-flex gap-2 justify-content-center">
              <button className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setShowLogoutModal(false)}>Cancel</button>
              <button className="btn rounded-pill px-4" style={{ background:'var(--pc-red)', color:'#fff' }} onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2" />Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
