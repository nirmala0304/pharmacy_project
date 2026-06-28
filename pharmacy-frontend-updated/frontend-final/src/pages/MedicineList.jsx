import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../api/axiosConfig'
import MedicineCard from '../components/MedicineCard'

export default function MedicineList() {
  const [medicines, setMedicines] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [inputValue, setInputValue] = useState(searchParams.get('search') || '')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const search = searchParams.get('search') || ''
  const categoryId = searchParams.get('categoryId') || ''

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data)).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (search) params.search = search
    if (categoryId) params.categoryId = categoryId
    api.get('/medicines', { params })
      .then(res => setMedicines(res.data))
      .catch(() => setMedicines([]))
      .finally(() => setLoading(false))
  }, [search, categoryId])

  useEffect(() => {
    if (inputValue.trim().length < 2) { setSuggestions([]); setShowSuggestions(false); return }
    const timer = setTimeout(() => {
      api.get('/medicines', { params: { search: inputValue.trim() } })
        .then(res => { setSuggestions(res.data.slice(0, 6)); setShowSuggestions(true) })
        .catch(() => setSuggestions([]))
    }, 300)
    return () => clearTimeout(timer)
  }, [inputValue])

  const handleSearch = (e) => {
    e.preventDefault()
    const val = inputValue.trim()
    setShowSuggestions(false)
    setSearchParams(val ? { search: val } : categoryId ? { categoryId } : {})
  }
  const handleClear = () => {
    setInputValue(''); setSuggestions([]); setShowSuggestions(false)
    setSearchParams(categoryId ? { categoryId } : {})
  }
  const handleSuggestionClick = (med) => {
    setInputValue(med.name); setShowSuggestions(false)
    setSearchParams({ search: med.name })
  }

  return (
    <div style={{ background: 'var(--surface-1)', minHeight: '80vh' }}>
      {/* Page header */}
      <div style={{ background: 'var(--surface-0)', borderBottom: '1px solid var(--border)', padding: '2rem 0' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, color: 'var(--text-1)', marginBottom: '0.25rem' }}>
            Medicine Catalog
          </h2>
          <p style={{ color: 'var(--text-3)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Browse thousands of verified medicines across categories
          </p>

          {/* Search bar */}
          <div className="position-relative" style={{ maxWidth: 640 }}>
            <form onSubmit={handleSearch}>
              <div className="input-group" style={{ boxShadow: 'var(--shadow-sm)' }}>
                <span className="input-group-text" style={{ background: 'var(--surface-0)', borderRight: 'none', paddingLeft: '1rem' }}>
                  <i className="bi bi-search" style={{ color: 'var(--text-3)' }}></i>
                </span>
                <input name="search" type="text" className="form-control form-control-lg"
                  style={{ borderLeft: 'none', borderRight: 'none', paddingLeft: 0 }}
                  placeholder="Search medicines, brands, or descriptions..."
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  autoComplete="off" />
                {(inputValue || search || categoryId) && (
                  <button type="button" className="input-group-text" style={{ cursor: 'pointer', borderLeft: 'none', borderRight: 'none', background: 'var(--surface-0)' }}
                    onClick={handleClear}>
                    <i className="bi bi-x-lg" style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}></i>
                  </button>
                )}
                <button type="submit" className="btn btn-primary px-4" style={{ borderRadius: '0 var(--r-md) var(--r-md) 0' }}>
                  Search
                </button>
              </div>
            </form>

            {/* Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="position-absolute w-100 search-suggestions-dropdown" style={{ top: 'calc(100% + 6px)', left: 0, zIndex: 1040 }}>
                {suggestions.map(med => (
                  <button key={med.id} type="button"
                    className="d-flex align-items-center gap-3 w-100 px-4 py-2 border-0 text-start suggestion-item"
                    style={{ background: 'transparent' }}
                    onMouseDown={() => handleSuggestionClick(med)}>
                    <div className="flex-shrink-0 rounded-2 d-flex align-items-center justify-content-center"
                      style={{ width: 34, height: 34, background: 'var(--pc-green-light)' }}>
                      <i className="bi bi-capsule" style={{ color: 'var(--pc-green)', fontSize: '0.85rem' }}></i>
                    </div>
                    <div className="flex-grow-1 min-w-0">
                      <div className="fw-semibold text-truncate" style={{ fontSize: '0.875rem', color: 'var(--text-1)' }}>{med.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{med.brand} · {med.categoryName}</div>
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--pc-green)', fontSize: '0.875rem', flexShrink: 0 }}>
                      ₹{med.price}
                    </span>
                  </button>
                ))}
                <div className="px-4 py-2" style={{ borderTop: '1px solid var(--border)' }}>
                  <small style={{ color: 'var(--text-4)' }}>Press Enter to see all results</small>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container py-4">
        <div className="row g-4">
          {/* Sidebar */}
          <div className="col-md-3">
            <div className="card" style={{ position: 'sticky', top: '80px' }}>
              <div className="card-header d-flex align-items-center gap-2">
                <i className="bi bi-funnel" style={{ color: 'var(--pc-green)' }}></i>
                Categories
              </div>
              <div className="list-group list-group-flush" style={{ borderRadius: '0 0 var(--r-lg) var(--r-lg)', overflow: 'hidden' }}>
                <button
                  className={`list-group-item list-group-item-action d-flex align-items-center gap-2 ${!categoryId ? 'active' : ''}`}
                  onClick={() => setSearchParams(search ? { search } : {})}>
                  <i className="bi bi-grid-3x3-gap" style={{ fontSize: '0.85rem' }}></i>
                  All Categories
                </button>
                {categories.map(cat => (
                  <button key={cat.id}
                    className={`list-group-item list-group-item-action d-flex align-items-center gap-2 ${categoryId === String(cat.id) ? 'active' : ''}`}
                    onClick={() => setSearchParams(search ? { search, categoryId: cat.id } : { categoryId: cat.id })}>
                    <i className="bi bi-tag" style={{ fontSize: '0.8rem' }}></i>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main grid */}
          <div className="col-md-9">
            {/* Active filters */}
            {(search || categoryId) && (
              <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
                <span style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>Filters:</span>
                {search && (
                  <span className="badge d-flex align-items-center gap-1 px-3 py-2"
                    style={{ background: 'var(--pc-green-light)', color: 'var(--pc-green-dark)', fontSize: '0.78rem', borderRadius: 'var(--r-md)' }}>
                    <i className="bi bi-search" />"{search}"
                    <button type="button" className="btn-close ms-1" style={{ fontSize: '0.5rem', filter: 'none' }}
                      onClick={() => { setInputValue(''); setSearchParams(categoryId ? { categoryId } : {}) }} />
                  </span>
                )}
                {categoryId && (
                  <span className="badge d-flex align-items-center gap-1 px-3 py-2"
                    style={{ background: 'var(--pc-teal-light)', color: 'var(--pc-teal)', fontSize: '0.78rem', borderRadius: 'var(--r-md)' }}>
                    <i className="bi bi-tag" />{categories.find(c => String(c.id) === categoryId)?.name || categoryId}
                    <button type="button" className="btn-close ms-1" style={{ fontSize: '0.5rem' }}
                      onClick={() => setSearchParams(search ? { search } : {})} />
                  </span>
                )}
                <button className="btn btn-sm" style={{ color: 'var(--pc-red)', background: 'transparent', padding: '0.2rem 0.4rem', fontSize: '0.8rem' }}
                  onClick={handleClear}>Clear all</button>
              </div>
            )}

            {loading ? (
              <div className="row g-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="col-md-4 col-sm-6">
                    <div className="skeleton" style={{ height: 280, borderRadius: 'var(--r-xl)' }} />
                  </div>
                ))}
              </div>
            ) : medicines.length === 0 ? (
              <div className="text-center py-5">
                <div style={{ width: 80, height: 80, background: 'var(--surface-2)', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                  <i className="bi bi-search" style={{ fontSize: '2rem', color: 'var(--text-4)' }}></i>
                </div>
                <h5 className="fw-bold" style={{ color: 'var(--text-1)' }}>No medicines found</h5>
                <p style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>Try a different search term or category.</p>
                <button className="btn btn-outline-primary rounded-pill px-4" onClick={handleClear}>
                  <i className="bi bi-arrow-counterclockwise me-2"></i>Clear & Browse All
                </button>
              </div>
            ) : (
              <>
                <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  <strong style={{ color: 'var(--text-1)' }}>{medicines.length}</strong> medicine(s) found
                </p>
                <div className="row g-3">
                  {medicines.map(med => (
                    <div className="col-md-4 col-sm-6 col-12" key={med.id}>
                      <MedicineCard medicine={med} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
