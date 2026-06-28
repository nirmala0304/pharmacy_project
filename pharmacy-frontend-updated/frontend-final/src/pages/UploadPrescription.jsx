import { useEffect, useState, useCallback } from 'react'
import api from '../api/axiosConfig'

const BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8080'

const STATUS_CFG = {
  PENDING:  { bg: 'var(--pc-amber-light)', color: '#92400e',              icon: 'bi-clock',           label: 'Pending' },
  APPROVED: { bg: 'var(--pc-green-light)', color: 'var(--pc-green-dark)', icon: 'bi-check-circle',    label: 'Approved' },
  REJECTED: { bg: 'var(--pc-red-light)',   color: 'var(--pc-red)',        icon: 'bi-x-circle',        label: 'Rejected' },
}

export default function UploadPrescription() {
  const [file, setFile]             = useState(null)
  const [preview, setPreview]       = useState(null)
  const [isPdf, setIsPdf]           = useState(false)
  const [form, setForm]             = useState({ doctorName: '', patientName: '', notes: '' })
  const [loading, setLoading]       = useState(false)
  const [success, setSuccess]       = useState('')
  const [error, setError]           = useState('')
  const [prescriptions, setPrescriptions] = useState([])
  const [dragging, setDragging]     = useState(false)
  const [viewModal, setViewModal]   = useState(null)
  const [imgError, setImgError]     = useState(false)

  useEffect(() => { fetchPrescriptions() }, [])
  const fetchPrescriptions = () => {
    api.get('/prescriptions/my').then(res => setPrescriptions(res.data)).catch(() => {})
  }

  const processFile = (selected) => {
    if (!selected) return
    const pdf = selected.type === 'application/pdf'
    setFile(selected); setIsPdf(pdf)
    setPreview(pdf ? null : URL.createObjectURL(selected))
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped && (dropped.type.startsWith('image/') || dropped.type === 'application/pdf')) processFile(dropped)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return setError('Please select a prescription file.')
    setLoading(true); setError(''); setSuccess('')
    const formData = new FormData()
    formData.append('file', file)
    Object.entries(form).forEach(([k, v]) => formData.append(k, v))
    try {
      await api.post('/prescriptions', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      setSuccess('Prescription uploaded! Awaiting pharmacist approval.')
      setFile(null); setPreview(null); setIsPdf(false)
      setForm({ doctorName: '', patientName: '', notes: '' })
      fetchPrescriptions()
    } catch { setError('Upload failed. Please try again.') }
    finally { setLoading(false) }
  }

  const getPrescriptionUrl = (p) => {
    const path = p.imagePath || ''; if (!path) return null
    return path.startsWith('http') ? path : `${BASE_URL}${path}`
  }
  const isPdfFile = (p) => (p.imagePath || '').toLowerCase().endsWith('.pdf')
  const openModal = (p) => {
    const url = getPrescriptionUrl(p); if (!url) return
    setImgError(false); setViewModal({ url, isPdf: isPdfFile(p), name: `Prescription #${p.id}` })
  }

  return (
    <div style={{ background: 'var(--surface-1)', minHeight: '80vh', paddingBottom: '3rem' }}>
      {/* Page header */}
      <div style={{ background: 'var(--surface-0)', borderBottom: '1px solid var(--border)', padding: '1.5rem 0' }}>
        <div className="container">
          <div className="d-flex align-items-center gap-3">
            <div style={{ width: 48, height: 48, background: 'var(--pc-green-light)', borderRadius: 'var(--r-md)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className="bi bi-file-earmark-medical" style={{ fontSize: '1.4rem', color: 'var(--pc-green)' }} />
            </div>
            <div>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, color: 'var(--text-1)', marginBottom: '0.1rem' }}>
                My Prescriptions
              </h2>
              <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', margin: 0 }}>Upload and manage your prescription history</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">
        <div className="row g-4">
          {/* Upload Form */}
          <div className="col-md-5">
            <div className="card" style={{ position: 'sticky', top: '80px' }}>
              <div className="card-header d-flex align-items-center gap-2">
                <i className="bi bi-cloud-upload" style={{ color: 'var(--pc-green)' }} />
                Upload New Prescription
              </div>
              <div className="card-body p-4">
                {error   && <div className="alert alert-danger d-flex align-items-center gap-2 mb-3"><i className="bi bi-exclamation-circle-fill flex-shrink-0" /><span>{error}</span></div>}
                {success && <div className="alert alert-success d-flex align-items-center gap-2 mb-3"><i className="bi bi-check-circle-fill flex-shrink-0" /><span>{success}</span></div>}

                <form onSubmit={handleSubmit}>
                  {/* Drop zone */}
                  <div
                    className="upload-zone mb-3"
                    style={dragging ? { borderColor: 'var(--pc-green)', background: 'var(--pc-green-light)' } : file ? { borderColor: 'var(--pc-green-mid)' } : {}}
                    onClick={() => document.getElementById('prescFile').click()}
                    onDragOver={e => { e.preventDefault(); setDragging(true) }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                  >
                    {preview ? (
                      <img src={preview} alt="Preview" style={{ maxHeight: 160, borderRadius: 'var(--r-md)', objectFit: 'contain' }} />
                    ) : file && isPdf ? (
                      <div className="text-center">
                        <i className="bi bi-file-earmark-pdf" style={{ fontSize: '2.5rem', color: 'var(--pc-red)', display: 'block', marginBottom: '0.5rem' }} />
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-2)', fontWeight: 600 }}>{file.name}</span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="upload-icon"><i className="bi bi-cloud-upload" /></div>
                        <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-2)', fontSize: '0.9rem' }}>Drag & drop or click to upload</p>
                        <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: 'var(--text-4)' }}>JPG, PNG or PDF · max 10MB</p>
                      </div>
                    )}
                    <input id="prescFile" type="file" accept="image/*,.pdf" className="d-none"
                      onChange={e => processFile(e.target.files[0])} />
                  </div>

                  {file && (
                    <div className="d-flex align-items-center justify-content-between mb-3 px-3 py-2 rounded-3"
                      style={{ background: 'var(--pc-green-light)', border: '1px solid var(--pc-green-mid)' }}>
                      <span style={{ fontSize: '0.82rem', color: 'var(--pc-green-dark)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '0.5rem' }}>
                        <i className="bi bi-paperclip me-1" />{file.name}
                      </span>
                      <button type="button" className="btn btn-sm rounded-pill" style={{ flexShrink: 0, background: 'var(--pc-red-light)', color: 'var(--pc-red)', border: 'none', padding: '0.15rem 0.5rem' }}
                        onClick={() => { setFile(null); setPreview(null); setIsPdf(false) }}>
                        <i className="bi bi-x" />
                      </button>
                    </div>
                  )}

                  {[
                    { key: 'doctorName',  label: "Doctor's Name",     placeholder: 'Dr. John Smith' },
                    { key: 'patientName', label: 'Patient Name',      placeholder: 'Patient full name' },
                  ].map(f => (
                    <div className="mb-3" key={f.key}>
                      <label className="form-label">{f.label}</label>
                      <input type="text" className="form-control" placeholder={f.placeholder}
                        value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
                    </div>
                  ))}
                  <div className="mb-4">
                    <label className="form-label">Additional Notes <span style={{ color: 'var(--text-4)', fontWeight: 400 }}>(optional)</span></label>
                    <textarea className="form-control" rows={3} placeholder="Any additional info..."
                      value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                  </div>

                  <button type="submit" className="btn btn-primary w-100 rounded-pill" disabled={loading}>
                    {loading
                      ? <><span className="spinner-border spinner-border-sm me-2" />Uploading...</>
                      : <><i className="bi bi-upload me-2" />Upload Prescription</>}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Prescription History */}
          <div className="col-md-7">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: 'var(--text-1)', margin: 0 }}>
                Prescription History
              </h5>
              <span style={{ background: 'var(--pc-green-light)', color: 'var(--pc-green-dark)', padding: '0.25em 0.75em',
                borderRadius: '50rem', fontSize: '0.78rem', fontWeight: 700 }}>
                {prescriptions.length} total
              </span>
            </div>

            {prescriptions.length === 0 ? (
              <div className="card text-center p-5">
                <i className="bi bi-file-earmark-x" style={{ fontSize: '3rem', color: 'var(--text-4)', marginBottom: '1rem' }} />
                <h6 style={{ color: 'var(--text-1)', fontWeight: 700 }}>No prescriptions yet</h6>
                <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', margin: 0 }}>Upload your first prescription using the form.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {prescriptions.map(p => {
                  const cfg = STATUS_CFG[p.status] || STATUS_CFG.PENDING
                  return (
                    <div className="card" key={p.id}>
                      <div className="card-body p-4">
                        <div className="d-flex gap-3 align-items-start">
                          {/* Thumbnail */}
                          <div onClick={() => openModal(p)}
                            style={{ width: 64, height: 64, borderRadius: 'var(--r-md)', overflow: 'hidden',
                              background: 'var(--surface-2)', cursor: 'pointer', flexShrink: 0,
                              display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                            {isPdfFile(p) ? (
                              <i className="bi bi-file-earmark-pdf" style={{ fontSize: '1.5rem', color: 'var(--pc-red)' }} />
                            ) : (
                              <img src={getPrescriptionUrl(p)} alt="Rx" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={e => { e.target.style.display = 'none' }} />
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-grow-1 min-w-0">
                            <div className="d-flex align-items-start justify-content-between gap-2 flex-wrap">
                              <strong style={{ color: 'var(--text-1)', fontSize: '0.9rem' }}>Prescription #{p.id}</strong>
                              <span style={{ background: cfg.bg, color: cfg.color, padding: '0.2em 0.65em',
                                borderRadius: 'var(--r-sm)', fontSize: '0.72rem', fontWeight: 700, flexShrink: 0,
                                display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                <i className={`bi ${cfg.icon}`} />{cfg.label}
                              </span>
                            </div>
                            {[
                              { icon: 'bi-person-badge',  val: p.doctorName },
                              { icon: 'bi-person',         val: p.patientName },
                              { icon: 'bi-calendar3',      val: p.uploadedAt && new Date(p.uploadedAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) },
                            ].filter(r => r.val).map((r, i) => (
                              <div key={i} className="d-flex align-items-center gap-1 mt-1">
                                <i className={`bi ${r.icon}`} style={{ color: 'var(--text-4)', fontSize: '0.75rem' }} />
                                <span style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>{r.val}</span>
                              </div>
                            ))}
                            {p.rejectionReason && (
                              <p style={{ color: 'var(--pc-red)', fontSize: '0.78rem', marginTop: '0.35rem', marginBottom: 0 }}>
                                <i className="bi bi-exclamation-circle me-1" />Reason: {p.rejectionReason}
                              </p>
                            )}

                            <div className="d-flex gap-2 mt-3 flex-wrap">
                              <button className="btn btn-sm btn-outline-primary rounded-pill px-3" onClick={() => openModal(p)}>
                                <i className="bi bi-eye me-1" />View
                              </button>
                              {getPrescriptionUrl(p) && (
                                <a href={getPrescriptionUrl(p)} target="_blank" rel="noopener noreferrer"
                                  className="btn btn-sm btn-outline-secondary rounded-pill px-3">
                                  <i className="bi bi-download me-1" />Save
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Modal */}
      {viewModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1055,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={() => setViewModal(null)}>
          <div style={{ background: 'var(--surface-0)', borderRadius: 'var(--r-xl)', boxShadow: 'var(--shadow-xl)',
            width: '100%', maxWidth: 640, maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
            onClick={e => e.stopPropagation()}>
            <div className="d-flex align-items-center justify-content-between p-4" style={{ borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
              <span style={{ fontWeight: 700, color: 'var(--text-1)', fontSize: '0.95rem' }}>{viewModal.name}</span>
              <button onClick={() => setViewModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: '1.1rem' }}>
                <i className="bi bi-x-lg" />
              </button>
            </div>
            <div style={{ overflowY: 'auto', padding: '1.5rem', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-1)' }}>
              {viewModal.isPdf ? (
                <object data={viewModal.url} type="application/pdf" width="100%" style={{ minHeight: '55vh', borderRadius: 'var(--r-md)' }}>
                  <div className="text-center py-5">
                    <i className="bi bi-file-earmark-pdf" style={{ fontSize: '3rem', color: 'var(--pc-red)' }} />
                    <p style={{ color: 'var(--text-2)', margin: '1rem 0' }}>PDF cannot be displayed inline.</p>
                    <a href={viewModal.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary rounded-pill px-4">
                      <i className="bi bi-box-arrow-up-right me-2" />Open PDF
                    </a>
                  </div>
                </object>
              ) : imgError ? (
                <div className="text-center py-5">
                  <i className="bi bi-image-alt" style={{ fontSize: '3rem', color: 'var(--text-4)' }} />
                  <p style={{ color: 'var(--text-2)', margin: '1rem 0' }}>Image could not be loaded.</p>
                  <a href={viewModal.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary rounded-pill px-4">
                    Open Directly
                  </a>
                </div>
              ) : (
                <img src={viewModal.url} alt="Prescription" onError={() => setImgError(true)}
                  style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: 'var(--r-md)', objectFit: 'contain' }} />
              )}
            </div>
            <div className="d-flex gap-2 p-4" style={{ borderTop: '1px solid var(--border)', flexShrink: 0 }}>
              <a href={viewModal.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm rounded-pill px-3">
                <i className="bi bi-box-arrow-up-right me-1" />Open in New Tab
              </a>
              <button className="btn btn-outline-secondary btn-sm rounded-pill px-3" onClick={() => setViewModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
