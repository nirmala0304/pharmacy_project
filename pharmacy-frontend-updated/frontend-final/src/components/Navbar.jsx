import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'
import { useTranslation } from '../hooks/useTranslation'

export default function Navbar() {
  const { user, logout, isPharmacist } = useAuth()
  const { cartCount } = useCart()
  const { darkMode, toggleDarkMode } = useTheme()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => { setMenuOpen(false); setDropdownOpen(false) }, [location])

  const handleLogout = () => { logout(); navigate('/login'); setShowLogoutModal(false) }
  const closeAll = () => { setMenuOpen(false); setDropdownOpen(false) }
  const isActive = (path) => {
    // Exact match for /medicines to avoid highlighting on /medicines/inquiry or /medicines/:id
    if (path === '/medicines') return location.pathname === '/medicines'
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <>
      <nav className="navbar navbar-expand-xl sticky-top" id="mainNavbar">
        <div className="container-fluid px-3 px-md-4 px-xl-5">
          {/* Brand */}
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/" onClick={closeAll}>
            <span className="navbar-brand-icon"><i className="bi bi-capsule" /></span>
            PharmaCare
          </Link>

          {/* Mobile right icons */}
          <div className="d-flex align-items-center gap-2 d-xl-none">
            <button className="btn-icon" onClick={toggleDarkMode}>
              <i className={`bi ${darkMode ? 'bi-sun-fill' : 'bi-moon-fill'}`}
                style={{ color: darkMode ? 'var(--pc-amber)' : 'var(--text-3)' }} />
            </button>
            {user && !isPharmacist() && (
              <Link to="/cart" className="btn-icon position-relative" onClick={closeAll}>
                <i className="bi bi-cart3" style={{ color: 'var(--text-2)' }} />
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                    style={{ background: 'var(--pc-red)', fontSize: '0.58rem', padding: '0.28em 0.45em' }}>
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            <button className="btn-icon" onClick={() => setMenuOpen(p => !p)} aria-label="Toggle menu">
              <i className={`bi ${menuOpen ? 'bi-x-lg' : 'bi-list'}`} style={{ fontSize: '1.1rem', color: 'var(--text-2)' }} />
            </button>
          </div>

          {/* Nav links */}
          <div className={`navbar-collapse ${menuOpen ? 'show' : 'collapse'}`}>
            <ul className="navbar-nav mx-auto mt-2 mt-xl-0 gap-xl-3" style={{ whiteSpace: 'nowrap' }}>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/medicines') ? 'active' : ''}`} to="/medicines" onClick={closeAll}>
                  <i className="bi bi-grid-3x3-gap" />Medicines
                </Link>
              </li>

              {/* Medicine Inquiry — visible to all */}
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/medicines/inquiry') ? 'active' : ''}`} to="/medicines/inquiry" onClick={closeAll}>
                  <i className="bi bi-capsule" />Availability
                </Link>
              </li>

              {user && !isPharmacist() && (
                <>
                  <li className="nav-item">
                    <Link className={`nav-link ${isActive('/upload-prescription') ? 'active' : ''}`} to="/upload-prescription" onClick={closeAll}>
                      <i className="bi bi-file-earmark-medical" />Prescriptions
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link ${isActive('/orders') ? 'active' : ''}`} to="/orders" onClick={closeAll}>
                      <i className="bi bi-bag" />My Orders
                    </Link>
                  </li>
                </>
              )}

              {isPharmacist() && (
                <>
                  <li className="nav-item">
                    <Link className={`nav-link ${isActive('/pharmacist') && !isActive('/pharmacist/inquiries') ? 'active' : ''}`} to="/pharmacist" onClick={closeAll}>
                      <i className="bi bi-speedometer2" />Dashboard
                    </Link>
                  </li>
                  <li className="nav-item position-relative">
                    <Link className={`nav-link ${isActive('/pharmacist/inquiries') ? 'active' : ''}`} to="/pharmacist/inquiries" onClick={closeAll}>
                      <i className="bi bi-inbox" />Inquiries
                      {/* live dot — always show for pharmacist */}
                      <span style={{ width: 7, height: 7, background: 'var(--pc-red)', borderRadius: '50%', display: 'inline-block', marginLeft: '0.3rem', verticalAlign: 'middle' }} />
                    </Link>
                  </li>
                </>
              )}

              {/* About Us — always visible */}
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/about') ? 'active' : ''}`} to="/about" onClick={closeAll}>
                  <i className="bi bi-info-circle" />About Us
                </Link>
              </li>

              {/* Contact — always visible */}
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/contact') ? 'active' : ''}`} to="/contact" onClick={closeAll}>
                  <i className="bi bi-headset" />Contact
                </Link>
              </li>
            </ul>

            <ul className="navbar-nav align-items-lg-center gap-1">
              {/* Dark mode toggle (desktop) */}
              <li className="nav-item d-none d-xl-block">
                <button className="btn-icon" onClick={toggleDarkMode} title={darkMode ? 'Light mode' : 'Dark mode'}>
                  <i className={`bi ${darkMode ? 'bi-sun-fill' : 'bi-moon-stars-fill'}`}
                    style={{ color: darkMode ? 'var(--pc-amber)' : 'var(--text-3)' }} />
                </button>
              </li>

              {user ? (
                <>
                  {/* Cart (desktop) */}
                  {!isPharmacist() && (
                    <li className="nav-item d-none d-xl-block">
                      <Link className="btn-icon position-relative" to="/cart" onClick={closeAll} style={{ textDecoration: 'none' }}>
                        <i className="bi bi-cart3" style={{ color: 'var(--text-2)' }} />
                        {cartCount > 0 && (
                          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                            style={{ background: 'var(--pc-red)', fontSize: '0.58rem', padding: '0.28em 0.45em' }}>
                            {cartCount}
                          </span>
                        )}
                      </Link>
                    </li>
                  )}

                  {/* User dropdown */}
                  <li className="nav-item d-none d-xl-block position-relative" ref={dropdownRef}>
                    <button
                      className="d-flex align-items-center gap-2 px-3 py-2 rounded-3 border-0"
                      style={{ background: dropdownOpen ? 'var(--surface-2)' : 'transparent', cursor: 'pointer', transition: 'background var(--dur-fast)', color: 'var(--text-1)' }}
                      onClick={() => setDropdownOpen(p => !p)}>
                      <span className="navbar-avatar">{user.name?.charAt(0).toUpperCase()}</span>
                      <span className="d-none d-xl-inline fw-semibold" style={{ fontSize: '0.875rem', color: 'var(--text-1)' }}>{user.name}</span>
                      <i className={`bi bi-chevron-${dropdownOpen ? 'up' : 'down'}`} style={{ fontSize: '0.7rem', color: 'var(--text-3)' }} />
                    </button>

                    {dropdownOpen && (
                      <ul className="dropdown-menu show" style={{ position: 'absolute', right: 0, top: 'calc(100% + 6px)', zIndex: 1050 }}>
                        <li className="px-3 py-2">
                          <div className="fw-bold" style={{ fontSize: '0.9rem', color: 'var(--text-1)' }}>{user.name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>{user.email}</div>
                          <span className="badge mt-1 rounded-pill" style={{ background: 'var(--pc-green-light)', color: 'var(--pc-green-dark)', fontSize: '0.68rem' }}>
                            {user.role}
                          </span>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><Link className="dropdown-item" to="/profile" onClick={closeAll}><i className="bi bi-person-circle me-2" style={{ color: 'var(--pc-green)' }} />My Profile</Link></li>
                        {isPharmacist() && (
                          <li><Link className="dropdown-item" to="/pharmacist/inquiries" onClick={closeAll}><i className="bi bi-inbox me-2" style={{ color: 'var(--pc-teal)' }} />Customer Inquiries</Link></li>
                        )}
                        <li><Link className="dropdown-item" to="/contact" onClick={closeAll}><i className="bi bi-headset me-2" style={{ color: 'var(--text-3)' }} />Contact Support</Link></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                          <button className="dropdown-item" style={{ color: 'var(--pc-red)' }}
                            onClick={() => { closeAll(); setShowLogoutModal(true) }}>
                            <i className="bi bi-box-arrow-right me-2" />Sign Out
                          </button>
                        </li>
                      </ul>
                    )}
                  </li>

                  {/* Mobile user section */}
                  <li className="nav-item d-xl-none mt-2 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                    <div className="d-flex align-items-center gap-2 px-1 mb-2">
                      <span className="navbar-avatar">{user.name?.charAt(0).toUpperCase()}</span>
                      <div>
                        <div className="fw-semibold" style={{ fontSize: '0.875rem', color: 'var(--text-1)' }}>{user.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>{user.role}</div>
                      </div>
                    </div>
                    <Link className="nav-link" to="/profile" onClick={closeAll}><i className="bi bi-person-circle" />My Profile</Link>
                    <Link className="nav-link" to="/contact" onClick={closeAll}><i className="bi bi-headset" />Contact Support</Link>
                    <button className="nav-link w-100 text-start border-0 bg-transparent" style={{ color: 'var(--pc-red)' }}
                      onClick={() => { closeAll(); setShowLogoutModal(true) }}>
                      <i className="bi bi-box-arrow-right me-1" />Sign Out
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login" onClick={closeAll}><i className="bi bi-box-arrow-in-right" />Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="btn btn-primary btn-sm ms-1 rounded-pill px-3" to="/register" onClick={closeAll} style={{ textDecoration: 'none' }}>
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Logout modal */}
      {showLogoutModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.4)', position: 'fixed', inset: 0, zIndex: 1055 }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 400 }}>
            <div className="modal-content">
              <div className="modal-body text-center p-4">
                <div className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-3"
                  style={{ width: 60, height: 60, background: 'var(--pc-red-light)' }}>
                  <i className="bi bi-box-arrow-right" style={{ fontSize: '1.6rem', color: 'var(--pc-red)' }} />
                </div>
                <h5 className="fw-bold mb-1" style={{ fontFamily: 'Sora, sans-serif', color: 'var(--text-1)' }}>Confirm Logout</h5>
                <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>Are you sure you want to sign out from PharmaCare?</p>
                <div className="d-flex gap-2 justify-content-center mt-3">
                  <button className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setShowLogoutModal(false)}>Cancel</button>
                  <button className="btn rounded-pill px-4" style={{ background: 'var(--pc-red)', color: '#fff' }} onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2" />Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
