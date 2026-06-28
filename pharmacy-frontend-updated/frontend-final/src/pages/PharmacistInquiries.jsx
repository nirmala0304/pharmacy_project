import { useEffect, useState, useCallback, useRef } from 'react'
import api from '../api/axiosConfig'

const STATUS_CFG = {
  NEW:         { color: 'var(--pc-blue)',   bg: 'var(--pc-blue-light)',   icon: 'bi-envelope',          label: 'New' },
  IN_PROGRESS: { color: 'var(--pc-amber)',  bg: 'var(--pc-amber-light)',  icon: 'bi-hourglass-split',   label: 'In Progress' },
  RESOLVED:    { color: 'var(--pc-green)',  bg: 'var(--pc-green-light)',  icon: 'bi-check-circle-fill', label: 'Resolved' },
  CLOSED:      { color: 'var(--text-3)',    bg: 'var(--surface-2)',       icon: 'bi-x-circle',          label: 'Closed' },
}
const URGENCY_CFG = {
  HIGH:   { color: 'var(--pc-red)',   bg: 'var(--pc-red-light)',   icon: 'bi-exclamation-triangle-fill', label: 'Urgent' },
  MEDIUM: { color: 'var(--pc-amber)', bg: 'var(--pc-amber-light)', icon: 'bi-clock-history',             label: 'Medium' },
  LOW:    { color: 'var(--text-3)',   bg: 'var(--surface-2)',       icon: 'bi-clock',                    label: 'Low' },
}
const TABS = [
  { key: 'ALL',         label: 'All',         icon: 'bi-inbox' },
  { key: 'NEW',         label: 'New',         icon: 'bi-envelope' },
  { key: 'IN_PROGRESS', label: 'In Progress', icon: 'bi-hourglass-split' },
  { key: 'RESOLVED',    label: 'Resolved',    icon: 'bi-check-circle' },
  { key: 'CALLBACK',    label: 'Callbacks',   icon: 'bi-telephone-inbound' },
]

function timeAgo(iso) {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.NEW
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', background:cfg.bg,
      color:cfg.color, padding:'0.25em 0.65em', borderRadius:'var(--r-sm)', fontSize:'0.72rem', fontWeight:700 }}>
      <i className={`bi ${cfg.icon}`} />{cfg.label}
    </span>
  )
}

function InquiryCard({ inq, onStatusChange, onNoteUpdate }) {
  const [note, setNote]      = useState(inq.pharmacistNote || '')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving]   = useState(false)
  const sc = STATUS_CFG[inq.status] || STATUS_CFG.NEW
  const uc = URGENCY_CFG[inq.urgency] || URGENCY_CFG.LOW

  const saveNote = async () => {
    setSaving(true)
    try { await onNoteUpdate(inq.type, inq.id, note); setEditing(false) }
    finally { setSaving(false) }
  }

  const isMed = inq.type === 'medicine'
  const hasCallback = isMed ? inq.requestCallback : inq.preferCallback

  return (
    <div className="card" style={{
      borderRadius: 'var(--r-xl)',
      borderLeft: `4px solid ${inq.urgency === 'HIGH' ? 'var(--pc-red)' : inq.urgency === 'MEDIUM' ? 'var(--pc-amber)' : 'var(--border)'}`,
    }}>
      <div className="card-body p-4">
        {/* Header row */}
        <div className="d-flex align-items-start justify-content-between gap-2 mb-3 flex-wrap">
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem',
              background: isMed ? 'var(--pc-teal-light)' : 'var(--pc-blue-light)',
              color: isMed ? 'var(--pc-teal)' : 'var(--pc-blue)',
              padding:'0.2em 0.65em', borderRadius:'var(--r-sm)', fontSize:'0.7rem', fontWeight:700 }}>
              <i className={`bi ${isMed ? 'bi-capsule' : 'bi-chat-dots'}`} />
              {isMed ? 'Medicine Inquiry' : (inq.inquiryType || 'Contact')}
            </span>
            <span style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem',
              background: uc.bg, color: uc.color,
              padding:'0.2em 0.65em', borderRadius:'var(--r-sm)', fontSize:'0.7rem', fontWeight:700 }}>
              <i className={`bi ${uc.icon}`} />{uc.label}
            </span>
            <StatusBadge status={inq.status} />
            {hasCallback && (
              <span style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem',
                background:'var(--pc-green-light)', color:'var(--pc-green-dark)',
                padding:'0.2em 0.65em', borderRadius:'var(--r-sm)', fontSize:'0.7rem', fontWeight:700 }}>
                <i className="bi bi-telephone-inbound" />Callback
              </span>
            )}
          </div>
          <div className="d-flex flex-column align-items-end gap-1">
            <span style={{ color:'var(--text-4)', fontSize:'0.72rem' }}>{timeAgo(inq.createdAt)}</span>
            <span style={{ color:'var(--text-4)', fontSize:'0.68rem' }}>
              {inq.createdAt ? new Date(inq.createdAt).toLocaleString('en-IN', { dateStyle:'medium', timeStyle:'short' }) : ''}
            </span>
          </div>
        </div>

        <div className="row g-3 mb-3">
          {/* Inquiry details */}
          <div className="col-md-6">
            {isMed ? (
              <>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <div style={{ width:42, height:42, background:'var(--pc-green-light)', borderRadius:'var(--r-sm)',
                    display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <i className="bi bi-capsule" style={{ color:'var(--pc-green)', fontSize:'1rem' }} />
                  </div>
                  <div>
                    <div style={{ fontFamily:'Sora, sans-serif', fontWeight:700, color:'var(--text-1)', fontSize:'0.95rem' }}>
                      {inq.medicineName}
                    </div>
                    <div style={{ color:'var(--text-3)', fontSize:'0.78rem' }}>
                      {[inq.dosage, `Qty: ${inq.quantity}`].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize:'0.78rem', color:'var(--text-3)' }}>
                  <i className="bi bi-arrows-collapse me-1" />
                  Alternatives: <strong style={{ color:'var(--text-1)' }}>{inq.alternatesOk ? 'Accepted' : 'Not accepted'}</strong>
                </div>
                {inq.additionalNotes && (
                  <div className="mt-2 p-2 rounded-2" style={{ background:'var(--surface-1)', fontSize:'0.78rem', color:'var(--text-2)' }}>
                    <i className="bi bi-chat-text me-1" style={{ color:'var(--text-3)' }} />{inq.additionalNotes}
                  </div>
                )}
              </>
            ) : (
              <>
                <div style={{ fontFamily:'Sora, sans-serif', fontWeight:700, color:'var(--text-1)', marginBottom:'0.25rem' }}>
                  {inq.subject || inq.inquiryType}
                </div>
                <p style={{ color:'var(--text-3)', fontSize:'0.82rem', lineHeight:1.5, margin:0,
                  display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                  {inq.message}
                </p>
              </>
            )}
          </div>

          {/* Customer details */}
          <div className="col-md-6">
            <div style={{ background:'var(--surface-1)', borderRadius:'var(--r-md)', padding:'0.875rem' }}>
              <div style={{ fontWeight:700, color:'var(--text-1)', fontSize:'0.875rem', marginBottom:'0.5rem', display:'flex', alignItems:'center', gap:'0.4rem' }}>
                <i className="bi bi-person-circle" style={{ color:'var(--pc-green)' }} />{inq.name}
              </div>
              {[
                { icon:'bi-envelope',   val: inq.email, href: `mailto:${inq.email}` },
                inq.phone && { icon:'bi-telephone', val: inq.phone, href: `tel:${inq.phone}` },
              ].filter(Boolean).map((row, i) => (
                <div key={i} className="d-flex align-items-center gap-2 mb-1">
                  <i className={`bi ${row.icon}`} style={{ color:'var(--text-4)', fontSize:'0.75rem' }} />
                  <a href={row.href} style={{ color:'var(--pc-green)', fontSize:'0.8rem', textDecoration:'none', fontWeight:500 }}>
                    {row.val}
                  </a>
                </div>
              ))}
              {hasCallback && (
                <div className="mt-2 p-2 rounded-2" style={{ background:'var(--pc-green-light)' }}>
                  <div style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--pc-green-dark)', display:'flex', alignItems:'center', gap:'0.3rem' }}>
                    <i className="bi bi-telephone-inbound" />
                    {inq.preferredContact} · {inq.callbackTime || 'ASAP'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pharmacist note */}
        <div className="mb-3">
          <div className="d-flex align-items-center justify-content-between mb-1">
            <label style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.04em' }}>
              Pharmacist Note
            </label>
            {!editing && (
              <button style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--pc-green)', fontSize:'0.78rem', fontWeight:600, padding:0 }}
                onClick={() => setEditing(true)}>
                <i className="bi bi-pencil me-1" />{note ? 'Edit' : 'Add note'}
              </button>
            )}
          </div>
          {editing ? (
            <div>
              <textarea className="form-control form-control-sm mb-2" rows={2}
                placeholder="Add your response or internal note..."
                value={note} onChange={e => setNote(e.target.value)} />
              <div className="d-flex gap-2">
                <button className="btn btn-primary btn-sm rounded-pill px-3" onClick={saveNote} disabled={saving}>
                  {saving ? <span className="spinner-border spinner-border-sm" /> : <><i className="bi bi-check me-1" />Save</>}
                </button>
                <button className="btn btn-outline-secondary btn-sm rounded-pill px-3" onClick={() => { setEditing(false); setNote(inq.pharmacistNote || '') }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : note ? (
            <div className="p-2 rounded-3" style={{ background:'var(--pc-blue-light)', fontSize:'0.82rem', color:'var(--text-2)', border:'1px solid rgba(37,99,235,0.15)' }}>
              <i className="bi bi-person-badge me-1" style={{ color:'var(--pc-blue)' }} />{note}
            </div>
          ) : (
            <div style={{ color:'var(--text-4)', fontSize:'0.78rem', fontStyle:'italic' }}>No note added yet.</div>
          )}
        </div>

        {/* Action row */}
        <div className="d-flex align-items-center gap-2 flex-wrap pt-2" style={{ borderTop:'1px solid var(--border)' }}>
          <select className="form-select form-select-sm" style={{ width:'auto', minWidth:145 }}
            value={inq.status}
            onChange={e => onStatusChange(inq.type, inq.id, e.target.value)}>
            {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          {inq.phone && (
            <a href={`tel:${inq.phone}`} className="btn btn-sm rounded-pill fw-semibold"
              style={{ background:'var(--pc-green-light)', color:'var(--pc-green-dark)', border:'1px solid var(--pc-green-mid)' }}>
              <i className="bi bi-telephone-fill me-1" />Call
            </a>
          )}
          {inq.phone && (
            <a href={`https://wa.me/${inq.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
              className="btn btn-sm rounded-pill fw-semibold"
              style={{ background:'#e8faf0', color:'#25D366', border:'1px solid #c3f0d4' }}>
              <i className="bi bi-whatsapp me-1" />WhatsApp
            </a>
          )}
          <a href={`mailto:${inq.email}`} className="btn btn-sm btn-outline-secondary rounded-pill">
            <i className="bi bi-envelope me-1" />Email
          </a>
        </div>
      </div>
    </div>
  )
}

export default function PharmacistInquiries() {
  const [contactInqs,  setContactInqs]  = useState([])
  const [medicineInqs, setMedicineInqs] = useState([])
  const [stats, setStats]   = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')
  const [activeTab, setActiveTab] = useState('ALL')
  const [searchVal, setSearchVal] = useState('')
  const pollRef = useRef(null)

  const fetchAll = useCallback(async () => {
    try {
      const [cRes, mRes, sRes] = await Promise.all([
        api.get('/contact/inquiries'),
        api.get('/contact/medicine-inquiries'),
        api.get('/contact/stats'),
      ])
      setContactInqs(cRes.data.map(i => ({ ...i, type: 'contact' })))
      setMedicineInqs(mRes.data.map(i => ({ ...i, type: 'medicine' })))
      setStats(sRes.data)
      setError('')
    } catch (err) {
      setError('Failed to load inquiries. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
    // Auto-refresh every 30 seconds
    pollRef.current = setInterval(fetchAll, 30000)
    return () => clearInterval(pollRef.current)
  }, [fetchAll])

  const handleStatusChange = useCallback(async (type, id, status) => {
    const endpoint = type === 'medicine'
      ? `/contact/medicine-inquiries/${id}/status`
      : `/contact/inquiries/${id}/status`
    // Optimistic update
    if (type === 'medicine') {
      setMedicineInqs(prev => prev.map(i => i.id === id ? { ...i, status } : i))
    } else {
      setContactInqs(prev => prev.map(i => i.id === id ? { ...i, status } : i))
    }
    try {
      await api.put(endpoint, { status })
      fetchAll() // re-sync stats
    } catch { fetchAll() } // revert on error
  }, [fetchAll])

  const handleNoteUpdate = useCallback(async (type, id, note) => {
    const endpoint = type === 'medicine'
      ? `/contact/medicine-inquiries/${id}/note`
      : `/contact/inquiries/${id}/note`
    // Optimistic update
    if (type === 'medicine') {
      setMedicineInqs(prev => prev.map(i => i.id === id ? { ...i, pharmacistNote: note } : i))
    } else {
      setContactInqs(prev => prev.map(i => i.id === id ? { ...i, pharmacistNote: note } : i))
    }
    await api.put(endpoint, { note })
  }, [])

  // Combine + sort by urgency then date
  const allInquiries = [
    ...contactInqs,
    ...medicineInqs,
  ].sort((a, b) => {
    const urgOrder = { HIGH:0, MEDIUM:1, LOW:2 }
    const ud = (urgOrder[a.urgency] ?? 1) - (urgOrder[b.urgency] ?? 1)
    if (ud !== 0) return ud
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  const filtered = allInquiries.filter(inq => {
    const cb = inq.type === 'medicine' ? inq.requestCallback : inq.preferCallback
    const matchTab =
      activeTab === 'ALL'      ? true :
      activeTab === 'CALLBACK' ? cb && inq.status !== 'RESOLVED' && inq.status !== 'CLOSED' :
      inq.status === activeTab
    const q = searchVal.toLowerCase().trim()
    const matchSearch = !q ||
      (inq.medicineName || '').toLowerCase().includes(q) ||
      (inq.name || '').toLowerCase().includes(q) ||
      (inq.email || '').toLowerCase().includes(q) ||
      (inq.phone || '').toLowerCase().includes(q) ||
      (inq.subject || '').toLowerCase().includes(q) ||
      (inq.inquiryType || '').toLowerCase().includes(q) ||
      (inq.message || '').toLowerCase().includes(q)
    return matchTab && matchSearch
  })

  const tabCount = (key) => {
    if (key === 'ALL') return allInquiries.length
    if (key === 'CALLBACK') return allInquiries.filter(i => {
      const cb = i.type === 'medicine' ? i.requestCallback : i.preferCallback
      return cb && i.status !== 'RESOLVED' && i.status !== 'CLOSED'
    }).length
    return allInquiries.filter(i => i.status === key).length
  }

  const statCards = [
    { label:'New Inquiries',     value: stats.new,        icon:'bi-envelope',          color:'var(--pc-blue)',  bg:'var(--pc-blue-light)' },
    { label:'Callback Requests', value: stats.callbacks,  icon:'bi-telephone-inbound', color:'var(--pc-green)', bg:'var(--pc-green-light)' },
    { label:'Urgent / High',     value: stats.urgent,     icon:'bi-exclamation-triangle-fill', color:'var(--pc-red)', bg:'var(--pc-red-light)' },
    { label:'In Progress',       value: stats.inProgress, icon:'bi-hourglass-split',   color:'var(--pc-amber)', bg:'var(--pc-amber-light)' },
  ]

  return (
    <div style={{ background:'var(--surface-1)', minHeight:'80vh', paddingBottom:'3rem' }}>
      {/* Header */}
      <div style={{ background:'var(--surface-0)', borderBottom:'1px solid var(--border)', padding:'1.5rem 0' }}>
        <div className="container-fluid px-3 px-md-4">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div>
              <h2 style={{ fontFamily:'Sora, sans-serif', fontWeight:800, color:'var(--text-1)', marginBottom:'0.1rem', fontSize:'1.5rem' }}>
                <i className="bi bi-inbox me-2" style={{ color:'var(--pc-green)' }} />Customer Inquiries
              </h2>
              <p style={{ color:'var(--text-3)', fontSize:'0.875rem', margin:0 }}>
                Real-time contact messages, medicine requests, and callback queue — stored in MySQL
              </p>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              {stats.new > 0 && (
                <span style={{ background:'var(--pc-red)', color:'#fff', borderRadius:'50rem',
                  padding:'0.3em 0.85em', fontSize:'0.82rem', fontWeight:700, display:'flex', alignItems:'center', gap:'0.4rem' }}>
                  <i className="bi bi-bell-fill" />{stats.new} new
                </span>
              )}
              <button className="btn btn-outline-secondary btn-sm rounded-pill px-3" onClick={fetchAll} disabled={loading}>
                <i className={`bi bi-arrow-clockwise me-1 ${loading ? 'spin' : ''}`} />Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid px-3 px-md-4 py-4">
        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
            <i className="bi bi-exclamation-circle-fill flex-shrink-0" />
            <span>{error}</span>
            <button className="btn btn-sm btn-outline-danger ms-auto rounded-pill" onClick={fetchAll}>Retry</button>
          </div>
        )}

        {/* Stat cards */}
        <div className="row g-3 mb-4">
          {statCards.map(s => (
            <div className="col-6 col-md-3" key={s.label}>
              <div className="dashboard-stat-card">
                <div className="dashboard-stat-icon" style={{ background:s.bg }}>
                  <i className={`bi ${s.icon}`} style={{ color:s.color }} />
                </div>
                <div>
                  <p className="dashboard-stat-label">{s.label}</p>
                  <p className="dashboard-stat-value">{loading ? '—' : (s.value ?? 0)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search + Tabs */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-3 mb-4">
          <div className="input-group" style={{ maxWidth:340 }}>
            <span className="input-group-text" style={{ background:'var(--surface-0)', borderRight:'none' }}>
              <i className="bi bi-search" style={{ color:'var(--text-3)' }} />
            </span>
            <input className="form-control" style={{ borderLeft:'none' }}
              placeholder="Search name, medicine, email..."
              value={searchVal} onChange={e => setSearchVal(e.target.value)} />
            {searchVal && (
              <button className="input-group-text" style={{ cursor:'pointer', borderLeft:'none', background:'var(--surface-0)' }}
                onClick={() => setSearchVal('')}>
                <i className="bi bi-x-lg" style={{ color:'var(--text-3)', fontSize:'0.75rem' }} />
              </button>
            )}
          </div>
          <div className="dashboard-tabs flex-grow-1">
            {TABS.map(t => {
              const cnt = tabCount(t.key)
              return (
                <button key={t.key} className={`dashboard-tab-btn ${activeTab === t.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(t.key)}>
                  <i className={`bi ${t.icon}`} />{t.label}
                  {cnt > 0 && (
                    <span style={{ background: activeTab === t.key ? 'var(--pc-green)' : 'var(--surface-3)',
                      color: activeTab === t.key ? '#fff' : 'var(--text-3)',
                      borderRadius:'50rem', fontSize:'0.65rem', padding:'0.15em 0.5em', fontWeight:700 }}>
                      {cnt}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Urgent banner */}
        {(stats.urgent > 0) && activeTab !== 'RESOLVED' && activeTab !== 'CLOSED' && (
          <div className="d-flex align-items-center gap-3 p-3 rounded-3 mb-4"
            style={{ background:'var(--pc-red-light)', border:'1px solid rgba(239,68,68,0.25)' }}>
            <i className="bi bi-exclamation-triangle-fill" style={{ color:'var(--pc-red)', fontSize:'1.1rem', flexShrink:0 }} />
            <p style={{ margin:0, color:'#b91c1c', fontSize:'0.875rem', fontWeight:600 }}>
              {stats.urgent} urgent {stats.urgent === 1 ? 'inquiry requires' : 'inquiries require'} immediate callback — promised within 15 minutes.
            </p>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border mb-3" style={{ width:'2.5rem', height:'2.5rem', color:'var(--pc-green)' }} />
            <p style={{ color:'var(--text-3)', fontSize:'0.9rem' }}>Loading inquiries from database...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-5">
            <div style={{ width:80, height:80, background:'var(--pc-green-light)', borderRadius:'50%',
              display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.25rem' }}>
              <i className="bi bi-inbox" style={{ fontSize:'2rem', color:'var(--pc-green)' }} />
            </div>
            <h5 style={{ color:'var(--text-1)', fontWeight:700 }}>
              {searchVal ? 'No results' : 'No inquiries yet'}
            </h5>
            <p style={{ color:'var(--text-3)', fontSize:'0.875rem' }}>
              {searchVal ? 'No records match your search.' : 'Submitted inquiries will appear here in real time.'}
            </p>
            {searchVal && (
              <button className="btn btn-outline-primary rounded-pill px-4" onClick={() => setSearchVal('')}>
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {filtered.map(inq => (
              <InquiryCard
                key={`${inq.type}-${inq.id}`}
                inq={inq}
                onStatusChange={handleStatusChange}
                onNoteUpdate={handleNoteUpdate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Inline spin style */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; display: inline-block; }
      `}</style>
    </div>
  )
}
