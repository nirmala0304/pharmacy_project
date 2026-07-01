import { useEffect, useState } from 'react'
import api from '../api/axiosConfig'
import ExpiryAlert from '../components/ExpiryAlert'

const BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8080'

const STATUS_CFG = {
  PENDING:    { color: 'var(--text-3)',   bg: 'var(--surface-2)',      icon: 'bi-hourglass' },
  CONFIRMED:  { color: 'var(--pc-blue)',  bg: 'var(--pc-blue-light)',  icon: 'bi-check-circle' },
  PROCESSING: { color: 'var(--pc-teal)',  bg: 'var(--pc-teal-light)',  icon: 'bi-gear' },
  SHIPPED:    { color: 'var(--pc-amber)', bg: 'var(--pc-amber-light)', icon: 'bi-truck' },
  DELIVERED:  { color: 'var(--pc-green)', bg: 'var(--pc-green-light)', icon: 'bi-check-circle-fill' },
  CANCELLED:  { color: 'var(--pc-red)',   bg: 'var(--pc-red-light)',   icon: 'bi-x-circle' },
}
const STATUS_OPTIONS = ['PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED']

function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.PENDING
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'0.35rem',
      background: cfg.bg, color: cfg.color, padding:'0.28em 0.7em',
      borderRadius:'var(--r-md)', fontSize:'0.75rem', fontWeight:700 }}>
      <i className={`bi ${cfg.icon}`} />{status}
    </span>
  )
}

function MedicineFormFields({ form, setForm, categories }) {
  const fields = [
    { key:'name',               label:'Medicine Name *',       type:'text',   col:'col-md-6', required:true },
    { key:'brand',              label:'Brand',                 type:'text',   col:'col-md-6' },
    { key:'price',              label:'Price (₹) *',           type:'number', col:'col-md-4', extra:{step:'0.01'}, required:true },
    { key:'discountPercentage', label:'Discount (%)',          type:'number', col:'col-md-4', extra:{step:'0.01', min:0, max:100} },
    { key:'discountPrice',      label:'Discounted Price (₹)',  type:'number', col:'col-md-4', extra:{step:'0.01', min:0} },
    { key:'dosage',             label:'Dosage',                type:'text',   col:'col-md-4' },
    { key:'stockQuantity',      label:'Stock Qty',             type:'number', col:'col-md-4', extra:{min:0} },
    { key:'minStockLevel',      label:'Min Stock Level',       type:'number', col:'col-md-4', extra:{min:0} },
    { key:'expiryDate',         label:'Expiry Date',           type:'date',   col:'col-md-4' },
  ]
  return (
    <div className="row g-3">
      {fields.map(f => (
        <div className={f.col} key={f.key}>
          <label className="form-label">{f.label}</label>
          <input type={f.type} className="form-control" value={form[f.key]} required={!!f.required}
            {...(f.extra||{})}
            onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
        </div>
      ))}
      <div className="col-md-4">
        <label className="form-label">Category</label>
        <select className="form-select" value={form.categoryId}
          onChange={e => setForm({ ...form, categoryId: e.target.value })}>
          <option value="">-- Select --</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="col-12">
        <label className="form-label">Description</label>
        <textarea className="form-control" rows={2} value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })} />
      </div>
      <div className="col-12">
        <div className="form-check">
          <input className="form-check-input" type="checkbox" id="rxCheck"
            checked={form.requiresPrescription}
            onChange={e => setForm({ ...form, requiresPrescription: e.target.checked })} />
          <label className="form-check-label" htmlFor="rxCheck" style={{ fontSize:'0.875rem', color:'var(--text-2)' }}>
            Requires Prescription
          </label>
        </div>
      </div>
    </div>
  )
}

function Modal({ title, icon, iconColor, iconBg, onClose, children, size = '' }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:1055, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div style={{ background:'var(--surface-0)', borderRadius:'var(--r-xl)', boxShadow:'var(--shadow-xl)',
        width:'100%', maxWidth: size==='lg' ? 680 : 440, maxHeight:'90vh', display:'flex', flexDirection:'column' }}>
        <div className="d-flex align-items-center justify-content-between p-4" style={{ borderBottom:'1px solid var(--border)', flexShrink:0 }}>
          <div className="d-flex align-items-center gap-3">
            {icon && (
              <div style={{ width:38, height:38, borderRadius:'var(--r-sm)', background: iconBg||'var(--surface-2)',
                display:'flex', alignItems:'center', justifyContent:'center' }}>
                <i className={`bi ${icon}`} style={{ color: iconColor||'var(--pc-green)', fontSize:'1rem' }} />
              </div>
            )}
            <h5 style={{ fontFamily:'Sora, sans-serif', fontWeight:700, color:'var(--text-1)', margin:0, fontSize:'1rem' }}>{title}</h5>
          </div>
          <button onClick={onClose} style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--text-3)', fontSize:'1.1rem' }}>
            <i className="bi bi-x-lg" />
          </button>
        </div>
        <div style={{ overflowY:'auto', padding:'1.5rem' }}>{children}</div>
      </div>
    </div>
  )
}

export default function PharmacistDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [alerts, setAlerts] = useState(null)
  const [prescriptions, setPrescriptions] = useState([])
  const [orders, setOrders] = useState([])
  const [medicines, setMedicines] = useState([])
  const [categories, setCategories] = useState([])
  const [restock, setRestock] = useState({ medicineId:'', quantity:'', notes:'' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [editMedicine, setEditMedicine] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteError, setDeleteError] = useState('')
  const [editForm, setEditForm] = useState({})
  const [editLoading, setEditLoading] = useState(false)
  const [editMsg, setEditMsg] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [addForm, setAddForm] = useState({ name:'', brand:'', description:'', price:'', discountPercentage:'', discountPrice:'', dosage:'',
    stockQuantity:'', minStockLevel:'', expiryDate:'', requiresPrescription:false, categoryId:'' })
  const [addLoading, setAddLoading] = useState(false)
  const [addMsg, setAddMsg] = useState('')
  const [imageUploadTarget, setImageUploadTarget] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imageUploadLoading, setImageUploadLoading] = useState(false)
  const [imageUploadMsg, setImageUploadMsg] = useState('')
  // Coupon management state
  const [coupons, setCoupons] = useState([])
  const [couponForm, setCouponForm] = useState({ code:'', discountType:'PERCENTAGE', discountValue:'', minOrderAmount:'', maxDiscountAmount:'', expiryDate:'', description:'' })
  const [couponMsg, setCouponMsg] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [showCouponAdd, setShowCouponAdd] = useState(false)
  // Reject prescription modal state (replaces prompt())
  const [rejectTarget, setRejectTarget] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [rejectError, setRejectError] = useState('')
  const [rejectLoading, setRejectLoading] = useState(false)
  // Order/Rx action feedback
  const [actionMsg, setActionMsg] = useState('')

  const showAction = (text) => { setActionMsg(text); setTimeout(() => setActionMsg(''), 3000) }

  useEffect(() => { fetchAll() }, [])
  const fetchAll = () => {
    api.get('/pharmacist/inventory/alerts').then(r => setAlerts(r.data)).catch(() => {})
    api.get('/prescriptions/pending').then(r => setPrescriptions(r.data)).catch(() => {})
    api.get('/orders').then(r => setOrders(r.data)).catch(() => {})
    api.get('/medicines').then(r => setMedicines(r.data)).catch(() => {})
    api.get('/categories').then(r => setCategories(r.data)).catch(() => {})
    api.get('/admin/coupons').then(r => setCoupons(r.data)).catch(() => {})
  }

  // Bug fix: add try/catch + user feedback (was silently swallowing errors)
  const approvePrescription = async id => {
    try {
      await api.put(`/prescriptions/${id}/approve`)
      showAction('Prescription approved.')
      fetchAll()
    } catch {
      showAction('Failed to approve prescription.')
    }
  }

  // Bug fix: replaced browser prompt() with modal-based rejection flow
  const openRejectModal = (p) => { setRejectTarget(p); setRejectReason(''); setRejectError('') }
  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) { setRejectError('Please enter a rejection reason.'); return }
    setRejectLoading(true)
    try {
      await api.put(`/prescriptions/${rejectTarget.id}/reject`, { reason: rejectReason.trim() })
      showAction('Prescription rejected.')
      setRejectTarget(null)
      fetchAll()
    } catch {
      setRejectError('Failed to reject. Please try again.')
    } finally {
      setRejectLoading(false)
    }
  }

  // Bug fix: add try/catch + user feedback (was silently swallowing errors)
  const updateOrderStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status })
      showAction(`Order #${id} updated to ${status}.`)
      fetchAll()
    } catch {
      showAction(`Failed to update Order #${id}.`)
    }
  }

  const handleRestock = async e => {
    e.preventDefault(); setLoading(true)
    try { await api.post('/pharmacist/inventory/restock', restock); setMsg('Restock successful!'); setRestock({ medicineId:'', quantity:'', notes:'' }); fetchAll() }
    catch { setMsg('Restock failed.') }
    finally { setLoading(false); setTimeout(() => setMsg(''), 3000) }
  }
  const openEdit = m => { setEditMedicine(m); setEditForm({ name:m.name||'', brand:m.brand||'', description:m.description||'', price:m.price||'', discountPercentage:m.discountPercentage||'', discountPrice:m.discountPrice||'', dosage:m.dosage||'', stockQuantity:m.stockQuantity||'', minStockLevel:m.minStockLevel||'', expiryDate:m.expiryDate||'', requiresPrescription:m.requiresPrescription||false, categoryId:m.categoryId||'' }); setEditMsg('') }
  const handleEditSave = async e => {
    e.preventDefault(); setEditLoading(true)
    try { await api.put(`/medicines/${editMedicine.id}`, editForm); setEditMsg('Updated!'); fetchAll(); setTimeout(() => { setEditMedicine(null); setEditMsg('') }, 1200) }
    catch { setEditMsg('Update failed.') }
    finally { setEditLoading(false) }
  }

  // Bug fix: replaced alert() with inline modal error state
  const handleDelete = async () => {
    setDeleteError('')
    try { await api.delete(`/medicines/${deleteTarget.id}`); setDeleteTarget(null); fetchAll() }
    catch { setDeleteError('Delete failed. This medicine may be linked to existing orders.') }
  }

  const handleAddMedicine = async e => {
    e.preventDefault(); setAddLoading(true)
    try {
      await api.post('/medicines', addForm); setAddMsg('Added!')
      setAddForm({ name:'', brand:'', description:'', price:'', discountPercentage:'', discountPrice:'', dosage:'', stockQuantity:'', minStockLevel:'', expiryDate:'', requiresPrescription:false, categoryId:'' })
      fetchAll(); setTimeout(() => { setShowAddForm(false); setAddMsg('') }, 1200)
    } catch { setAddMsg('Failed to add medicine.') }
    finally { setAddLoading(false) }
  }

  const handleImageUpload = async e => {
    e.preventDefault();
    if (!imageFile) { setImageUploadMsg('Please select a file.'); return; }
    setImageUploadLoading(true);
    const formData = new FormData();
    formData.append('file', imageFile);
    try {
      await api.post(`/medicines/${imageUploadTarget.id}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImageUploadMsg('Image uploaded successfully!');
      fetchAll();
      setTimeout(() => { setImageUploadTarget(null); setImageUploadMsg(''); setImageFile(null); }, 1200);
    } catch {
      setImageUploadMsg('Failed to upload image.');
    } finally {
      setImageUploadLoading(false);
    }
  }

  const tabs = [
    { key:'overview',      icon:'bi-speedometer2',      label:'Overview' },
    { key:'prescriptions', icon:'bi-file-earmark-medical', label:'Prescriptions', badge: prescriptions.length },
    { key:'orders',        icon:'bi-bag',               label:'Orders' },
    { key:'inventory',     icon:'bi-boxes',             label:'Inventory' },
    { key:'categories',    icon:'bi-tags',              label:'Categories' },
    { key:'coupons',       icon:'bi-ticket-perforated', label:'Coupons' },
    { key:'alerts',        icon:'bi-bell',              label:'Alerts' },
  ]

  const statCards = [
    { label:'Pending Rx',       value:prescriptions.length,         icon:'bi-file-earmark-medical', color:'var(--pc-amber)', bg:'var(--pc-amber-light)' },
    { label:'Total Orders',     value:orders.length,                icon:'bi-bag',                  color:'var(--pc-blue)',  bg:'var(--pc-blue-light)'  },
    { label:'Total Medicines',  value:medicines.length,             icon:'bi-capsule',              color:'var(--pc-teal)',  bg:'var(--pc-teal-light)'  },
    { label:'Low Stock Alerts', value:alerts?.lowStockCount || 0,   icon:'bi-exclamation-triangle', color:'var(--pc-red)',   bg:'var(--pc-red-light)'   },
  ]

  return (
    <div style={{ background:'var(--surface-1)', minHeight:'90vh' }}>
      <div className="container-fluid py-4 px-3 px-md-4">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <div>
            <h2 style={{ fontFamily:'Sora, sans-serif', fontWeight:800, color:'var(--text-1)', marginBottom:'0.15rem' }}>
              Pharmacist Dashboard
            </h2>
            <p style={{ color:'var(--text-3)', fontSize:'0.875rem', margin:0 }}>
              Manage prescriptions, orders, and inventory
            </p>
          </div>
        </div>

        {/* Tab nav */}
        <div className="dashboard-tabs mb-4">
          {tabs.map(t => (
            <button key={t.key} className={`dashboard-tab-btn ${activeTab === t.key ? 'active' : ''}`}
              onClick={() => setActiveTab(t.key)}>
              <i className={`bi ${t.icon}`} />
              {t.label}
              {t.badge > 0 && (
                <span style={{ background:'var(--pc-red)', color:'#fff', borderRadius:9999,
                  fontSize:'0.65rem', padding:'0.15em 0.5em', fontWeight:700, marginLeft:2 }}>
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Global action feedback toast */}
        {actionMsg && (
          <div style={{ position:'fixed', bottom:'1.5rem', right:'1.5rem', zIndex:2000,
            background:'var(--surface-0)', border:'1px solid var(--border)',
            borderRadius:'var(--r-lg)', padding:'0.75rem 1.25rem',
            boxShadow:'var(--shadow-lg)', display:'flex', alignItems:'center', gap:'0.6rem',
            fontSize:'0.875rem', color:'var(--text-1)', maxWidth:320 }}>
            <i className="bi bi-info-circle-fill" style={{ color:'var(--pc-green)', flexShrink:0 }} />
            {actionMsg}
          </div>
        )}

        {/* ── OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div>
            <div className="row g-3 mb-4">
              {statCards.map(s => (
                <div className="col-md-3 col-6" key={s.label}>
                  <div className="dashboard-stat-card">
                    <div className="dashboard-stat-icon" style={{ background: s.bg }}>
                      <i className={`bi ${s.icon}`} style={{ color: s.color }} />
                    </div>
                    <div>
                      <p className="dashboard-stat-label">{s.label}</p>
                      <p className="dashboard-stat-value">{s.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="row g-3">
              <div className="col-md-7">
                <div className="card h-100">
                  <div className="card-header fw-bold">Recent Orders</div>
                  <div className="list-group list-group-flush" style={{ borderRadius:'0 0 var(--r-lg) var(--r-lg)', overflow:'hidden' }}>
                    {orders.slice(0,5).map(o => (
                      <div key={o.id} className="list-group-item d-flex align-items-center justify-content-between gap-2">
                        <div>
                          <div className="fw-semibold" style={{ fontSize:'0.875rem', color:'var(--text-1)' }}>Order #{o.id}</div>
                          <small style={{ color:'var(--text-3)' }}>{o.userName} · ₹{o.totalAmount?.toFixed(2)}</small>
                        </div>
                        <StatusBadge status={o.status} />
                      </div>
                    ))}
                    {orders.length === 0 && (
                      <div className="list-group-item text-center py-4" style={{ color:'var(--text-3)' }}>No orders yet</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-5">
                <ExpiryAlert alerts={alerts} />
              </div>
            </div>
          </div>
        )}

        {/* ── PRESCRIPTIONS ── */}
        {activeTab === 'prescriptions' && (
          <div>
            <h4 style={{ fontFamily:'Sora, sans-serif', fontWeight:700, color:'var(--text-1)', marginBottom:'1.5rem' }}>
              Pending Prescriptions
            </h4>
            {prescriptions.length === 0 ? (
              <div className="text-center py-5">
                <div style={{ width:72, height:72, background:'var(--pc-green-light)', borderRadius:'50%',
                  display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem' }}>
                  <i className="bi bi-check-circle-fill" style={{ fontSize:'2rem', color:'var(--pc-green)' }} />
                </div>
                <h6 style={{ color:'var(--text-1)', fontWeight:700 }}>All caught up!</h6>
                <p style={{ color:'var(--text-3)', fontSize:'0.875rem' }}>No pending prescriptions to review.</p>
              </div>
            ) : (
              <div className="row g-3">
                {prescriptions.map(p => (
                  <div className="col-md-6 col-lg-4" key={p.id}>
                    <div className="card h-100">
                      <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <span style={{ fontFamily:'Sora, sans-serif', fontWeight:700, color:'var(--text-1)' }}>Rx #{p.id}</span>
                          <span style={{ background:'var(--pc-amber-light)', color:'#92400e', padding:'0.25em 0.65em',
                            borderRadius:'var(--r-sm)', fontSize:'0.72rem', fontWeight:700 }}>PENDING</span>
                        </div>
                        {[
                          { icon:'bi-person',             val: p.userName },
                          { icon:'bi-person-badge',       val: p.doctorName },
                          { icon:'bi-person-lines-fill',  val: p.patientName },
                          { icon:'bi-calendar3',          val: p.uploadedAt && new Date(p.uploadedAt).toLocaleDateString('en-IN') },
                        ].filter(r=>r.val).map((r,i) => (
                          <div key={i} className="d-flex align-items-center gap-2 mb-1">
                            <i className={`bi ${r.icon}`} style={{ color:'var(--text-4)', fontSize:'0.8rem', flexShrink:0 }} />
                            <span style={{ fontSize:'0.82rem', color:'var(--text-2)' }}>{r.val}</span>
                          </div>
                        ))}
                        {p.notes && <p style={{ fontSize:'0.82rem', color:'var(--text-3)', marginTop:'0.5rem', marginBottom:'0.75rem' }}>{p.notes}</p>}
                        <a href={p.imagePath?.startsWith('http') ? p.imagePath : `${BASE_URL}${p.imagePath}`}
                          target="_blank" rel="noopener noreferrer"
                          className="btn btn-outline-secondary btn-sm w-100 mb-3 rounded-pill">
                          <i className="bi bi-eye me-1" />View Image
                        </a>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm flex-fill rounded-pill"
                            style={{ background:'var(--pc-green-light)', color:'var(--pc-green-dark)', border:'1.5px solid var(--pc-green-mid)' }}
                            onClick={() => approvePrescription(p.id)}>
                            <i className="bi bi-check-circle me-1" />Approve
                          </button>
                          <button className="btn btn-sm flex-fill rounded-pill"
                            style={{ background:'var(--pc-red-light)', color:'var(--pc-red)', border:'1.5px solid rgba(239,68,68,0.2)' }}
                            onClick={() => openRejectModal(p)}>
                            <i className="bi bi-x-circle me-1" />Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ORDERS ── */}
        {activeTab === 'orders' && (
          <div>
            <h4 style={{ fontFamily:'Sora, sans-serif', fontWeight:700, color:'var(--text-1)', marginBottom:'1.5rem' }}>Manage Orders</h4>
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table mb-0">
                    <thead>
                      <tr>
                        <th>Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Date</th><th>Status</th><th>Update</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(o => (
                        <tr key={o.id}>
                          <td><strong style={{ color:'var(--text-1)' }}>#{o.id}</strong><br/>
                            <small style={{ color:'var(--text-4)', fontSize:'0.72rem' }}>{o.trackingNumber}</small></td>
                          <td><span style={{ fontSize:'0.875rem', color:'var(--text-1)' }}>{o.userName}</span><br/>
                            <small style={{ color:'var(--text-3)' }}>{o.userEmail}</small></td>
                          <td style={{ color:'var(--text-2)' }}>{o.items?.length||0}</td>
                          <td><strong style={{ color:'var(--pc-green)' }}>₹{o.totalAmount?.toFixed(2)}</strong></td>
                          <td style={{ color:'var(--text-3)', fontSize:'0.82rem' }}>
                            {new Date(o.placedAt).toLocaleDateString('en-IN')}
                          </td>
                          <td><StatusBadge status={o.status} /></td>
                          <td>
                            <select className="form-select form-select-sm" style={{ minWidth:130 }}
                              value={o.status} onChange={e => updateOrderStatus(o.id, e.target.value)}>
                              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {orders.length === 0 && (
                    <div className="text-center py-4" style={{ color:'var(--text-3)' }}>No orders found</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── INVENTORY ── */}
        {activeTab === 'inventory' && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
              <h4 style={{ fontFamily:'Sora, sans-serif', fontWeight:700, color:'var(--text-1)', margin:0 }}>Inventory Management</h4>
              <button className="btn btn-primary btn-sm rounded-pill px-3"
                onClick={() => { setShowAddForm(true); setAddMsg('') }}>
                <i className="bi bi-plus-circle me-1" />Add Medicine
              </button>
            </div>
            <div className="row g-4">
              <div className="col-md-4">
                <div className="card">
                  <div className="card-header">Restock Medicine</div>
                  <div className="card-body p-4">
                    {msg && <div className={`alert ${msg.includes('success') ? 'alert-success' : 'alert-danger'} py-2 mb-3`}>{msg}</div>}
                    <form onSubmit={handleRestock}>
                      <div className="mb-3">
                        <label className="form-label">Medicine</label>
                        <select className="form-select" required value={restock.medicineId}
                          onChange={e => setRestock({ ...restock, medicineId: e.target.value })}>
                          <option value="">-- Select --</option>
                          {medicines.map(m => <option key={m.id} value={m.id}>{m.name} (Stock: {m.stockQuantity})</option>)}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Quantity to Add</label>
                        <input type="number" className="form-control" min="1" required value={restock.quantity}
                          onChange={e => setRestock({ ...restock, quantity: e.target.value })} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Notes (optional)</label>
                        <input type="text" className="form-control" placeholder="Batch, supplier…" value={restock.notes}
                          onChange={e => setRestock({ ...restock, notes: e.target.value })} />
                      </div>
                      <button type="submit" className="btn btn-primary w-100 rounded-pill" disabled={loading}>
                        {loading ? 'Processing…' : <><i className="bi bi-arrow-up-circle me-2" />Restock</>}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <div className="card">
                  <div className="card-header fw-bold">Stock Overview</div>
                  <div className="table-responsive">
                    <table className="table mb-0">
                      <thead>
                        <tr><th>Medicine</th><th>Brand</th><th>Price</th><th>Discount</th><th>Stock</th><th>Min Level</th><th>Expiry</th><th>Actions</th></tr>
                      </thead>
                      <tbody>
                        {medicines.map(m => (
                          <tr key={m.id}>
                            <td><span style={{ fontWeight:600, color:'var(--text-1)' }}>{m.name}</span></td>
                            <td style={{ color:'var(--text-3)', fontSize:'0.82rem' }}>{m.brand}</td>
                            <td>
                              {m.discountPrice && parseFloat(m.discountPrice) > 0 ? (
                                <><span style={{ fontWeight:600, color:'var(--pc-green)', textDecoration:'line-through', fontSize:'0.8rem' }}>₹{m.price}</span></>
                              ) : (
                                <span style={{ fontWeight:600, color:'var(--pc-green)' }}>₹{m.price}</span>
                              )}
                            </td>
                            <td>
                              {m.discountPrice && parseFloat(m.discountPrice) > 0 ? (
                                <div>
                                  <span style={{ fontWeight:700, color:'var(--pc-green)' }}>₹{parseFloat(m.discountPrice).toFixed(2)}</span>
                                  {m.discountPercentage > 0 && <span style={{ marginLeft:'4px', fontSize:'0.7rem', background:'var(--pc-amber-light)', color:'#92400e', borderRadius:'4px', padding:'1px 5px', fontWeight:700 }}>{parseFloat(m.discountPercentage).toFixed(0)}% OFF</span>}
                                </div>
                              ) : (
                                <span style={{ color:'var(--text-4)', fontSize:'0.82rem' }}>—</span>
                              )}
                            </td>
                            <td>
                              <span style={{
                                background: m.stockQuantity <= (m.minStockLevel||0) ? 'var(--pc-red-light)' : 'var(--pc-green-light)',
                                color: m.stockQuantity <= (m.minStockLevel||0) ? 'var(--pc-red)' : 'var(--pc-green-dark)',
                                padding:'0.2em 0.6em', borderRadius:'var(--r-sm)', fontSize:'0.78rem', fontWeight:700
                              }}>{m.stockQuantity}</span>
                            </td>
                            <td style={{ color:'var(--text-3)', fontSize:'0.82rem' }}>{m.minStockLevel}</td>
                            <td style={{ color:'var(--text-3)', fontSize:'0.82rem' }}>{m.expiryDate}</td>
                            <td>
                              <div className="d-flex gap-1">
                                <button className="btn btn-sm" title="Edit"
                                  style={{ background:'var(--pc-blue-light)', color:'var(--pc-blue)', border:'none', borderRadius:'var(--r-sm)', padding:'0.25rem 0.5rem' }}
                                  onClick={() => openEdit(m)}>
                                  <i className="bi bi-pencil" />
                                </button>
                                <button className="btn btn-sm" title="Upload Image"
                                  style={{ background:'var(--pc-teal-light)', color:'var(--pc-teal)', border:'none', borderRadius:'var(--r-sm)', padding:'0.25rem 0.5rem' }}
                                  onClick={() => { setImageUploadTarget(m); setImageUploadMsg(''); setImageFile(null); }}>
                                  <i className="bi bi-image" />
                                </button>
                                <button className="btn btn-sm" title="Delete"
                                  style={{ background:'var(--pc-red-light)', color:'var(--pc-red)', border:'none', borderRadius:'var(--r-sm)', padding:'0.25rem 0.5rem' }}
                                  onClick={() => setDeleteTarget(m)}>
                                  <i className="bi bi-trash" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── CATEGORIES ── */}
        {activeTab === 'categories' && (
          <div>
            <h4 style={{ fontFamily:'Sora, sans-serif', fontWeight:700, color:'var(--text-1)', marginBottom:'1.5rem' }}>Categories</h4>
            <div className="row g-3">
              {categories.map(c => (
                <div className="col-md-4 col-sm-6" key={c.id}>
                  <div className="card p-3">
                    <div className="d-flex align-items-center gap-3">
                      <div style={{ width:44, height:44, background:'var(--pc-green-light)', borderRadius:'var(--r-md)',
                        display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <i className="bi bi-tag" style={{ color:'var(--pc-green)', fontSize:'1.1rem' }} />
                      </div>
                      <div>
                        <div style={{ fontWeight:700, color:'var(--text-1)', fontSize:'0.9rem' }}>{c.name}</div>
                        <div style={{ color:'var(--text-3)', fontSize:'0.78rem' }}>{c.description}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {categories.length === 0 && (
                <div className="col-12 text-center py-5" style={{ color:'var(--text-3)' }}>No categories yet</div>
              )}
            </div>
          </div>
        )}

        {/* ── COUPONS ── */}
        {activeTab === 'coupons' && (
          <div>
            <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
              <h4 style={{ fontFamily:'Sora, sans-serif', fontWeight:700, color:'var(--text-1)', margin:0 }}>
                <i className="bi bi-ticket-perforated me-2" style={{ color:'var(--pc-purple)' }} />Coupon Management
              </h4>
              <button className="btn btn-primary rounded-pill px-4" onClick={() => { setShowCouponAdd(!showCouponAdd); setCouponMsg('') }}>
                <i className={`bi ${showCouponAdd ? 'bi-x-lg' : 'bi-plus-lg'} me-2`} />{showCouponAdd ? 'Cancel' : 'Add Coupon'}
              </button>
            </div>

            {/* Add coupon form */}
            {showCouponAdd && (
              <div className="card mb-4" style={{ border:'1.5px dashed var(--pc-purple)', background:'rgba(124,58,237,0.04)' }}>
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-3" style={{ color:'var(--text-1)' }}>New Coupon</h6>
                  {couponMsg && <div className={`alert ${couponMsg.includes('✓') ? 'alert-success' : 'alert-danger'} mb-3`}>{couponMsg}</div>}
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label">Coupon Code *</label>
                      <input type="text" className="form-control" placeholder="e.g. SAVE20"
                        value={couponForm.code} onChange={e => setCouponForm({...couponForm, code: e.target.value.toUpperCase()})} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Discount Type *</label>
                      <select className="form-select" value={couponForm.discountType}
                        onChange={e => setCouponForm({...couponForm, discountType: e.target.value})}>
                        <option value="PERCENTAGE">Percentage (%)</option>
                        <option value="FIXED">Fixed Amount (₹)</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Discount Value *</label>
                      <input type="number" className="form-control" step="0.01" min="0"
                        placeholder={couponForm.discountType === 'PERCENTAGE' ? 'e.g. 20 (= 20%)' : 'e.g. 50 (= ₹50)'}
                        value={couponForm.discountValue} onChange={e => setCouponForm({...couponForm, discountValue: e.target.value})} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Min Order Amount (₹)</label>
                      <input type="number" className="form-control" step="0.01" min="0" placeholder="0 = no minimum"
                        value={couponForm.minOrderAmount} onChange={e => setCouponForm({...couponForm, minOrderAmount: e.target.value})} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Max Discount (₹) <small className="text-muted">— % type only</small></label>
                      <input type="number" className="form-control" step="0.01" min="0" placeholder="Leave blank = no cap"
                        value={couponForm.maxDiscountAmount} onChange={e => setCouponForm({...couponForm, maxDiscountAmount: e.target.value})} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Expiry Date</label>
                      <input type="date" className="form-control"
                        value={couponForm.expiryDate} onChange={e => setCouponForm({...couponForm, expiryDate: e.target.value})} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Description</label>
                      <input type="text" className="form-control" placeholder="e.g. 20% OFF on orders above ₹300"
                        value={couponForm.description} onChange={e => setCouponForm({...couponForm, description: e.target.value})} />
                    </div>
                  </div>
                  <div className="d-flex gap-2 justify-content-end mt-3">
                    <button className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setShowCouponAdd(false)}>Cancel</button>
                    <button className="btn btn-primary rounded-pill px-4" disabled={couponLoading}
                      onClick={async () => {
                        if (!couponForm.code || !couponForm.discountValue) { setCouponMsg('Code and discount value are required.'); return }
                        setCouponLoading(true); setCouponMsg('')
                        try {
                          await api.post('/admin/coupons', {
                            code: couponForm.code,
                            discountType: couponForm.discountType,
                            discountValue: couponForm.discountValue,
                            minOrderAmount: couponForm.minOrderAmount || '0',
                            maxDiscountAmount: couponForm.maxDiscountAmount || null,
                            expiryDate: couponForm.expiryDate || null,
                            description: couponForm.description
                          })
                          setCouponMsg('✓ Coupon created!')
                          setCouponForm({ code:'', discountType:'PERCENTAGE', discountValue:'', minOrderAmount:'', maxDiscountAmount:'', expiryDate:'', description:'' })
                          fetchAll()
                          setTimeout(() => setShowCouponAdd(false), 1200)
                        } catch(e) {
                          setCouponMsg(e?.response?.data?.message || 'Failed to create coupon.')
                        } finally { setCouponLoading(false) }
                      }}>
                      {couponLoading ? <span className="spinner-border spinner-border-sm me-2" /> : <i className="bi bi-check2 me-2" />}
                      Create Coupon
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Coupon cards */}
            {coupons.length === 0 ? (
              <div className="text-center py-5" style={{ color:'var(--text-3)' }}>
                <i className="bi bi-ticket-perforated" style={{ fontSize:'2.5rem', opacity:0.4 }} />
                <p className="mt-2 mb-1">No coupons yet.</p>
                <small>Run <code>setup_discount_coupon.sql</code> to seed sample coupons, or add one above.</small>
              </div>
            ) : (
              <div className="row g-3">
                {coupons.map(c => (
                  <div className="col-md-6 col-lg-4" key={c.id}>
                    <div className="card h-100" style={{ border:`1.5px solid ${c.active ? 'var(--pc-green-mid)' : 'var(--border)'}`, opacity: c.active ? 1 : 0.6 }}>
                      <div className="card-body p-4">
                        <div className="d-flex align-items-start justify-content-between mb-2">
                          <div>
                            <span className="fw-bold" style={{ fontFamily:'Sora,sans-serif', fontSize:'1.05rem', color:'var(--text-1)', letterSpacing:'0.05em' }}>{c.code}</span>
                            <span className={`badge ms-2 ${c.active ? 'bg-success' : 'bg-secondary'}`} style={{ fontSize:'0.65rem' }}>{c.active ? 'Active' : 'Inactive'}</span>
                          </div>
                          <div className="d-flex gap-1">
                            <button className="btn btn-sm" title={c.active ? 'Deactivate' : 'Activate'}
                              style={{ background: c.active ? 'var(--pc-amber-light)' : 'var(--pc-green-light)', color: c.active ? '#92400e' : 'var(--pc-green)', border:'none', padding:'0.2rem 0.5rem', borderRadius:'var(--r-sm)' }}
                              onClick={async () => { await api.patch(`/admin/coupons/${c.id}/toggle`); fetchAll() }}>
                              <i className={`bi ${c.active ? 'bi-pause-fill' : 'bi-play-fill'}`} />
                            </button>
                            <button className="btn btn-sm" title="Delete"
                              style={{ background:'var(--pc-red-light)', color:'var(--pc-red)', border:'none', padding:'0.2rem 0.5rem', borderRadius:'var(--r-sm)' }}
                              onClick={async () => { if(window.confirm(`Delete coupon "${c.code}"?`)) { await api.delete(`/admin/coupons/${c.id}`); fetchAll() } }}>
                              <i className="bi bi-trash" />
                            </button>
                          </div>
                        </div>

                        <div className="mb-2">
                          <span style={{ fontSize:'1.5rem', fontWeight:800, color:'var(--pc-green)', fontFamily:'Sora,sans-serif' }}>
                            {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                          </span>
                        </div>

                        <div style={{ fontSize:'0.78rem', color:'var(--text-3)' }} className="d-flex flex-column gap-1">
                          {c.minOrderAmount > 0 && <span><i className="bi bi-cart-check me-1" />Min order: ₹{c.minOrderAmount}</span>}
                          {c.maxDiscountAmount && <span><i className="bi bi-arrow-up-circle me-1" />Max discount: ₹{c.maxDiscountAmount}</span>}
                          {c.expiryDate && <span><i className="bi bi-calendar-x me-1" />Expires: {c.expiryDate}</span>}
                          {c.description && <span className="mt-1" style={{ color:'var(--text-2)' }}><i className="bi bi-info-circle me-1" />{c.description}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ALERTS ── */}
        {activeTab === 'alerts' && (
          <div>
            <h4 style={{ fontFamily:'Sora, sans-serif', fontWeight:700, color:'var(--text-1)', marginBottom:'1.5rem' }}>
              Inventory Alerts
            </h4>
            <ExpiryAlert alerts={alerts} />
          </div>
        )}
      </div>

      {/* ── Edit Modal ── */}
      {editMedicine && (
        <Modal title="Edit Medicine" icon="bi-pencil-square" iconColor="var(--pc-blue)" iconBg="var(--pc-blue-light)"
          onClose={() => setEditMedicine(null)} size="lg">
          {editMsg && <div className={`alert ${editMsg.includes('Updated') ? 'alert-success' : 'alert-danger'} mb-3`}>{editMsg}</div>}
          <form onSubmit={handleEditSave}>
            <MedicineFormFields form={editForm} setForm={setEditForm} categories={categories} />
            <div className="d-flex gap-2 justify-content-end mt-4">
              <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setEditMedicine(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary rounded-pill px-4" disabled={editLoading}>
                {editLoading ? <><span className="spinner-border spinner-border-sm me-2" />Saving…</> : <><i className="bi bi-check2 me-1" />Save Changes</>}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Image Upload Modal ── */}
      {imageUploadTarget && (
        <Modal title="Upload Medicine Image" icon="bi-image" iconColor="var(--pc-teal)" iconBg="var(--pc-teal-light)"
          onClose={() => setImageUploadTarget(null)}>
          {imageUploadMsg && <div className={`alert ${imageUploadMsg.includes('successfully') ? 'alert-success' : 'alert-danger'} mb-3`}>{imageUploadMsg}</div>}
          <form onSubmit={handleImageUpload}>
            <div className="mb-3">
              <label className="form-label">Select Image File (JPG, PNG, WEBP)</label>
              <input type="file" className="form-control" accept=".jpg,.jpeg,.png,.webp"
                onChange={e => setImageFile(e.target.files[0])} required />
            </div>
            <div className="d-flex gap-2 justify-content-end mt-4">
              <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setImageUploadTarget(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary rounded-pill px-4" disabled={imageUploadLoading}>
                {imageUploadLoading ? <><span className="spinner-border spinner-border-sm me-2" />Uploading…</> : <><i className="bi bi-upload me-1" />Upload Image</>}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Delete Confirm ── */}
      {deleteTarget && (
        <Modal title="Delete Medicine" icon="bi-trash" iconColor="var(--pc-red)" iconBg="var(--pc-red-light)"
          onClose={() => { setDeleteTarget(null); setDeleteError('') }}>
          <div className="text-center pb-2">
            {deleteError && (
              <div className="alert alert-danger d-flex align-items-center gap-2 mb-3 text-start">
                <i className="bi bi-exclamation-circle-fill flex-shrink-0" />
                <span style={{ fontSize:'0.875rem' }}>{deleteError}</span>
              </div>
            )}
            <p style={{ color:'var(--text-2)', marginBottom:'1.5rem' }}>
              Are you sure you want to delete <strong style={{ color:'var(--text-1)' }}>{deleteTarget.name}</strong>? This cannot be undone.
            </p>
            <div className="d-flex gap-2 justify-content-center">
              <button className="btn btn-outline-secondary rounded-pill px-4" onClick={() => { setDeleteTarget(null); setDeleteError('') }}>Cancel</button>
              <button className="btn rounded-pill px-4" style={{ background:'var(--pc-red)', color:'#fff' }} onClick={handleDelete}>
                <i className="bi bi-trash me-2" />Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Reject Prescription Modal (replaces browser prompt) ── */}
      {rejectTarget && (
        <Modal title="Reject Prescription" icon="bi-x-circle" iconColor="var(--pc-red)" iconBg="var(--pc-red-light)"
          onClose={() => setRejectTarget(null)}>
          <p style={{ color:'var(--text-2)', marginBottom:'1rem', fontSize:'0.9rem' }}>
            Rejecting Rx <strong>#{rejectTarget.id}</strong> for <strong>{rejectTarget.patientName || rejectTarget.userName}</strong>.
            Please provide a reason — the patient will be notified.
          </p>
          {rejectError && (
            <div className="alert alert-danger d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-exclamation-circle-fill flex-shrink-0" />
              <span style={{ fontSize:'0.875rem' }}>{rejectError}</span>
            </div>
          )}
          <div className="mb-4">
            <label className="form-label fw-semibold" style={{ fontSize:'0.875rem' }}>Rejection Reason *</label>
            <textarea className="form-control" rows={3} placeholder="e.g. Prescription is expired, illegible, or missing doctor's signature…"
              value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
          </div>
          <div className="d-flex gap-2 justify-content-end">
            <button className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setRejectTarget(null)}>Cancel</button>
            <button className="btn rounded-pill px-4" style={{ background:'var(--pc-red)', color:'#fff' }}
              onClick={handleRejectConfirm} disabled={rejectLoading}>
              {rejectLoading
                ? <><span className="spinner-border spinner-border-sm me-2" />Rejecting…</>
                : <><i className="bi bi-x-circle me-2" />Confirm Reject</>}
            </button>
          </div>
        </Modal>
      )}

      {/* ── Add Medicine Modal ── */}
      {showAddForm && (
        <Modal title="Add New Medicine" icon="bi-plus-circle" iconColor="var(--pc-green)" iconBg="var(--pc-green-light)"
          onClose={() => setShowAddForm(false)} size="lg">
          {addMsg && <div className={`alert ${addMsg.includes('Added') ? 'alert-success' : 'alert-danger'} mb-3`}>{addMsg}</div>}
          <form onSubmit={handleAddMedicine}>
            <MedicineFormFields form={addForm} setForm={setAddForm} categories={categories} />
            <div className="d-flex gap-2 justify-content-end mt-4">
              <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setShowAddForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary rounded-pill px-4" disabled={addLoading}>
                {addLoading ? <><span className="spinner-border spinner-border-sm me-2" />Adding…</> : <><i className="bi bi-plus-circle me-1" />Add Medicine</>}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
