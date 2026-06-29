import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axiosConfig'
import { useTranslation } from '../hooks/useTranslation'
import MedicineCard from '../components/MedicineCard'

// Doctor image — uploaded by user, served from /public
const HERO_DOCTOR_IMG = '/hero-doctor-new.jpg'

const CATEGORY_ICONS = {
  default:'bi-grid', tablet:'bi-capsule', capsule:'bi-capsule-pill',
  syrup:'bi-cup-straw', injection:'bi-activity', cream:'bi-droplet-half',
  drops:'bi-droplet', vitamin:'bi-stars', antibiotic:'bi-shield-plus',
  pain:'bi-bandaid', heart:'bi-heart-pulse', diabetes:'bi-thermometer',
  skin:'bi-hand-thumbs-up', eye:'bi-eye', ear:'bi-ear',
}
function getCategoryIcon(name = '') {
  const lower = name.toLowerCase()
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (lower.includes(key)) return icon
  }
  return CATEGORY_ICONS.default
}

const CAT_PALETTES = [
  { bg: 'var(--pc-green-light)', color: 'var(--pc-green)', border: 'var(--pc-green-mid)' },
  { bg: 'var(--pc-teal-light)',  color: 'var(--pc-teal)',  border: 'rgba(23,181,160,0.3)' },
  { bg: 'var(--pc-blue-light)',  color: 'var(--pc-blue)',  border: 'rgba(37,99,235,0.2)'  },
  { bg: 'var(--pc-amber-light)', color: 'var(--pc-amber)', border: 'rgba(245,158,11,0.25)'},
  { bg: 'var(--pc-red-light)',   color: 'var(--pc-red)',   border: 'rgba(239,68,68,0.2)'  },
  { bg: 'rgba(124,58,237,0.1)',  color: 'var(--pc-purple)',border: 'rgba(124,58,237,0.2)' },
]

export default function Home() {
  const [featuredMedicines, setFeaturedMedicines] = useState([])
  const [categories, setCategories] = useState([])
  const [catLoading, setCatLoading] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    api.get('/medicines').then(res => setFeaturedMedicines(res.data.slice(0, 4))).catch(() => {})
    setCatLoading(true)
    api.get('/categories')
      .then(res => { setCategories(res.data || []); setCatLoading(false) })
      .catch(() => { setCategories([]); setCatLoading(false) })
  }, [])

  const features = [
    { icon: 'bi-shield-check',         title: 'Verified Medicines', desc: 'All medicines verified by licensed pharmacists',      color: 'var(--pc-green)',  bg: 'var(--pc-green-light)'  },
    { icon: 'bi-truck',                title: 'Fast Delivery',      desc: 'Delivered to your doorstep in 24–48 hours',           color: 'var(--pc-teal)',   bg: 'var(--pc-teal-light)'   },
    { icon: 'bi-file-earmark-medical', title: 'Rx Upload',          desc: 'Safely upload prescriptions for pharmacist review',   color: 'var(--pc-blue)',   bg: 'var(--pc-blue-light)'   },
    { icon: 'bi-headset',              title: '24/7 Support',       desc: 'Expert pharmacists available round the clock',        color: 'var(--pc-amber)',  bg: 'var(--pc-amber-light)'  },
    { icon: 'bi-telephone-inbound',    title: 'Medicine Inquiry',   desc: 'Call or request callback to check availability',      color: 'var(--pc-teal)',   bg: 'var(--pc-teal-light)'   },
    { icon: 'bi-shield-lock',          title: 'Secure Payments',    desc: '100% safe and encrypted payment gateways',            color: 'var(--pc-purple)', bg: 'rgba(124,58,237,0.1)'   },
  ]

  const stats = [
    { value: '50K+', label: 'Medicines' },
    { value: '200+', label: 'Brands' },
    { value: '24/7', label: 'Support' },
    { value: '4.9★', label: 'Rating' },
  ]

  return (
    <div>
      {/* ── HERO — New Animated Design ── */}
      <section className="hero-new">
        {/* Animated background */}
        <div className="hero-new-bg" />

        {/* Ambient orbs */}
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />

        {/* Floating particles */}
        <div className="hero-particle hero-particle-1" />
        <div className="hero-particle hero-particle-2" />
        <div className="hero-particle hero-particle-3" />
        <div className="hero-particle hero-particle-4" />

        {/* Decorative cross shapes */}
        <div className="hero-cross-wrap">
          <svg className="hero-cross hero-cross-1" width="120" height="120" viewBox="0 0 120 120" fill="none">
            <rect x="45" y="0" width="30" height="120" fill="white"/>
            <rect x="0" y="45" width="120" height="30" fill="white"/>
          </svg>
          <svg className="hero-cross hero-cross-2" width="80" height="80" viewBox="0 0 80 80" fill="none">
            <rect x="30" y="0" width="20" height="80" fill="white"/>
            <rect x="0" y="30" width="80" height="20" fill="white"/>
          </svg>
        </div>

        <div className="container position-relative" style={{ zIndex: 10 }}>
          <div className="row align-items-center" style={{ paddingTop: '0px', paddingBottom: '20px' }}>

            {/* ── LEFT: Text content ── */}
            <div className="col-lg-6 col-xl-5">

              {/* Icon badges */}
              <div className="hero-new-icon-row hero-animate-1">
                <span className="hero-new-circle-icon"><i className="bi bi-capsule" /></span>
                <span className="hero-new-circle-icon"><i className="bi bi-heart-fill text-danger" /></span>
                <span className="hero-new-circle-icon"><i className="bi bi-leaf" /></span>
              </div>

              {/* Headline */}
              <h1 className="hero-new-title hero-animate-2">
                Your <span className="hero-title-highlight">Health,</span><br />
                Our Priority
              </h1>

              <p className="hero-new-subtitle hero-animate-2">
                Access professional healthcare, expert advice, and timely prescriptions from our dedicated team. Seamless care, delivered with trust.
              </p>

              {/* CTA Buttons */}
              <div className="hero-new-cta-group hero-animate-3">
                <Link to="/upload-prescription" className="hero-new-btn-primary">
                  <span className="hero-btn-pulse-ring" />
                  <i className="bi bi-clipboard2-pulse me-2" />
                  Manage Your Prescriptions
                </Link>
                <Link to="/medicines/inquiry" className="hero-new-btn-outline">
                  <i className="bi bi-person-badge me-2" />
                  Talk to a Pharmacist
                </Link>
              </div>

              {/* Stats */}
              <div className="hero-new-stats hero-animate-3">
                {stats.map((s, i) => (
                  <div className="hero-new-stat" key={s.label}>
                    <span className="hero-new-stat-value">{s.value}</span>
                    <span className="hero-new-stat-label">{s.label}</span>
                  </div>
                ))}
              </div>

            </div>

            {/* ── RIGHT: Doctor image ── */}
            <div className="col-lg-6 col-xl-7 d-flex justify-content-center align-items-end hero-animate-fade">
              <div className="hero-img-area">

                {/* Glow ring */}
                <div className="hero-img-glow" />

                {/* Rotating border */}
                <div className="hero-img-ring" />

                {/* Floating cards */}
                <div className="hero-float-card hero-float-card-1">
                  <div className="hero-card-icon hero-card-icon-teal">
                    <i className="bi bi-check-circle-fill" />
                  </div>
                  <div>
                    <div className="hero-card-main">Prescription Ready</div>
                    <div className="hero-card-sub">Processed in 15 min</div>
                  </div>
                </div>

                <div className="hero-float-card hero-float-card-2">
                  <div className="hero-card-icon hero-card-icon-white">
                    <i className="bi bi-clock-fill" />
                  </div>
                  <div>
                    <div className="hero-card-main">24/7 Available</div>
                    <div className="hero-card-sub">Always here for you</div>
                  </div>
                </div>

                <div className="hero-float-card hero-float-card-3">
                  <div className="hero-card-icon hero-card-icon-teal">
                    <i className="bi bi-shield-check" />
                  </div>
                  <div>
                    <div className="hero-card-main">Expert Care</div>
                    <div className="hero-card-sub">Certified pharmacists</div>
                  </div>
                </div>

                {/* Doctor photo */}
                <div className="hero-doctor-wrap">
                  <img
                    src={HERO_DOCTOR_IMG}
                    alt="PharmaCare Pharmacist"
                    className="hero-doctor-img"
                  />
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── TRUSTED PARTNERS (Infinite Marquee) ── */}
      <section className="py-4 border-bottom" style={{ background: 'var(--surface-0)', overflow: 'hidden' }}>
        <div className="container text-center mb-3">
          <span className="text-uppercase fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '2px', color: 'var(--text-4)' }}>
            Trusted by top healthcare providers
          </span>
        </div>
        <div className="marquee-container position-relative">
          {/* Fading edges */}
          <div className="position-absolute top-0 bottom-0 start-0 z-1" style={{ width: '100px', background: 'linear-gradient(90deg, var(--surface-0) 0%, transparent 100%)' }} />
          <div className="position-absolute top-0 bottom-0 end-0 z-1" style={{ width: '100px', background: 'linear-gradient(270deg, var(--surface-0) 0%, transparent 100%)' }} />
          
          <div className="marquee-content d-flex align-items-center">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="d-flex align-items-center justify-content-around flex-shrink-0" style={{ width: '100%', minWidth: '800px' }}>
                <span className="fs-4 fw-bold text-muted opacity-50"><i className="bi bi-heart-pulse me-2"></i>MediCare+</span>
                <span className="fs-4 fw-bold text-muted opacity-50"><i className="bi bi-shield-plus me-2"></i>HealthFirst</span>
                <span className="fs-4 fw-bold text-muted opacity-50"><i className="bi bi-activity me-2"></i>Vitality</span>
                <span className="fs-4 fw-bold text-muted opacity-50"><i className="bi bi-bandaid me-2"></i>CureAll</span>
                <span className="fs-4 fw-bold text-muted opacity-50"><i className="bi bi-capsule me-2"></i>PharmaCorp</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-5" style={{ background: 'var(--surface-0)' }}>
        <div className="container">
          <div className="row g-3 g-md-4">
            {features.map((f, i) => (
              <div className={`col-6 col-md-3 reveal reveal-delay-${i % 4 + 1}`} key={f.title}>
                <div className="feature-icon-card p-4 h-100">
                  <div className="rounded-3 d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: 52, height: 52, background: f.bg }}>
                    <i className={`bi ${f.icon}`} style={{ fontSize: '1.35rem', color: f.color }} />
                  </div>
                  <h6 className="fw-bold mb-1">{f.title}</h6>
                  <p className="mb-0" style={{ color: 'var(--text-3)', fontSize: '0.82rem', lineHeight: 1.5 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-5" style={{ background: 'var(--surface-1)' }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4 reveal">
            <div>
              <h2 className="fw-bold mb-1" style={{ fontFamily: 'Sora, sans-serif', fontSize: '1.5rem' }}>Shop by Category</h2>
              <p className="mb-0" style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>Browse medicines by medical category</p>
            </div>
            <Link to="/medicines" className="btn btn-outline-primary btn-sm rounded-pill px-3">
              View All <i className="bi bi-arrow-right ms-1" />
            </Link>
          </div>

          {catLoading ? (
            <div className="row g-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="col-6 col-md-3">
                  <div className="category-card-skeleton rounded-4" style={{ height: 140 }} />
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-5" style={{ color: 'var(--text-3)' }}>
              <i className="bi bi-grid" style={{ fontSize: '2.5rem', opacity: 0.4 }} />
              <p className="mt-2 mb-0">No categories found.</p>
            </div>
          ) : (
            <div className="row g-3">
              {categories.map((cat, idx) => {
                const p = CAT_PALETTES[idx % CAT_PALETTES.length]
                const icon = getCategoryIcon(cat.name)
                return (
                  <div className="col-6 col-md-3" key={cat.id}>
                    <Link to={`/medicines?categoryId=${cat.id}`}
                      className="category-card text-decoration-none d-block text-center"
                      style={{ borderColor: p.border + ' !important' }}>
                      <div className="category-icon-wrap mx-auto mb-2 rounded-3 d-flex align-items-center justify-content-center"
                        style={{ width: 52, height: 52, background: p.bg }}>
                        <i className={`bi ${icon}`} style={{ fontSize: '1.4rem', color: p.color }} />
                      </div>
                      <h6 className="fw-bold mb-1" style={{ color: 'var(--text-1)', fontSize: '0.875rem' }}>{cat.name}</h6>
                      <p className="mb-0 text-truncate" style={{ color: 'var(--text-3)', fontSize: '0.75rem' }}>{cat.description}</p>
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── FEATURED MEDICINES ── */}
      {featuredMedicines.length > 0 && (
        <section className="py-5" style={{ background: 'var(--surface-0)' }}>
          <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
              <div>
                <h2 className="fw-bold mb-1" style={{ fontFamily: 'Sora, sans-serif', fontSize: '1.5rem' }}>Featured Medicines</h2>
                <p className="mb-0" style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>Handpicked by our pharmacists</p>
              </div>
              <Link to="/medicines" className="btn btn-outline-primary btn-sm rounded-pill px-3">
                View All <i className="bi bi-arrow-right ms-1" />
              </Link>
            </div>
            <div className="row g-3 g-md-4">
              {featuredMedicines.map(med => (
                <div className="col-6 col-md-3" key={med.id}>
                  <MedicineCard medicine={med} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── HOW IT WORKS ── */}
      <section className="py-5" style={{ background: 'var(--surface-1)' }}>
        <div className="container">
          <div className="text-center mb-5 reveal">
            <span className="badge px-3 py-2 rounded-pill mb-2" style={{ background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9' }}>Simple Process</span>
            <h2 className="fw-bold mb-3" style={{ fontFamily: 'Sora, sans-serif', fontSize: '2rem' }}>How PharmaCare Works</h2>
            <p className="mx-auto" style={{ color: 'var(--text-3)', maxWidth: '600px' }}>
              Get your medicines delivered to your doorstep in three simple and secure steps.
            </p>
          </div>
          
          <div className="row g-4 position-relative">
            <div className="d-none d-lg-block position-absolute" style={{ top: '50px', left: '15%', right: '15%', height: '2px', background: 'linear-gradient(90deg, rgba(14,165,233,0) 0%, rgba(14,165,233,0.3) 50%, rgba(14,165,233,0) 100%)', zIndex: 0 }} />

            {[
              { step: '01', title: 'Upload Prescription', desc: 'Take a picture of your valid prescription and upload it securely.', icon: 'bi-file-earmark-arrow-up', color: '#0ea5e9' },
              { step: '02', title: 'Pharmacist Review', desc: 'Our licensed pharmacists verify your prescription for safety.', icon: 'bi-clipboard2-check', color: '#8b5cf6' },
              { step: '03', title: 'Fast Delivery', desc: 'Medicines are dispatched and delivered to your home quickly.', icon: 'bi-box-seam', color: '#10b981' }
            ].map((item, i) => (
              <div className={`col-lg-4 reveal reveal-delay-${i + 1}`} key={item.step}>
                <div className="how-it-works-card h-100 p-4 rounded-4 text-center position-relative" style={{ background: 'var(--surface-0)', border: '1px solid var(--border)', zIndex: 1 }}>
                  <div className="step-number fw-bold" style={{ position: 'absolute', top: '-10px', right: '20px', fontSize: '3.5rem', color: 'var(--text-4)', opacity: 0.15, fontFamily: 'Sora, sans-serif' }}>
                    {item.step}
                  </div>
                  <div className="icon-wrap mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle" style={{ width: '80px', height: '80px', background: `${item.color}15`, color: item.color, fontSize: '2.2rem', boxShadow: `0 0 0 8px ${item.color}08` }}>
                    <i className={`bi ${item.icon}`} />
                  </div>
                  <h4 className="fw-bold mb-3" style={{ fontFamily: 'Sora, sans-serif', fontSize: '1.25rem' }}>{item.title}</h4>
                  <p className="mb-0" style={{ color: 'var(--text-3)', fontSize: '0.95rem' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-5" style={{ background: 'var(--surface-0)' }}>
        <div className="container">
          <div className="text-center mb-5 reveal">
            <h2 className="fw-bold mb-3" style={{ fontFamily: 'Sora, sans-serif', fontSize: '2rem' }}>What Our Customers Say</h2>
            <p className="mx-auto" style={{ color: 'var(--text-3)', maxWidth: '600px' }}>
              Trusted by thousands of families to deliver health and happiness safely to their homes.
            </p>
          </div>
          <div className="row g-4">
            {[
              { name: 'Sarah Jenkins', role: 'Verified Patient', text: 'PharmaCare has been a lifesaver. The pharmacist called me to clarify my prescription and the delivery was incredibly fast. Highly recommended!', rating: 5, avatar: 'SJ', color: '#10b981' },
              { name: 'Michael Chen', role: 'Regular Customer', text: 'The interface is so easy to use, and I love the dark mode! Being able to track my medicine delivery in real-time gives me so much peace of mind.', rating: 5, avatar: 'MC', color: '#0ea5e9' },
              { name: 'Emma Watson', role: 'Verified Patient', text: 'Excellent customer service. When a medicine was out of stock, they immediately found a safe alternative and consulted my doctor. Very professional.', rating: 5, avatar: 'EW', color: '#8b5cf6' }
            ].map((t, idx) => (
              <div className={`col-lg-4 col-md-6 reveal reveal-delay-${idx + 1}`} key={idx}>
                <div className="testimonial-card p-4 rounded-4 h-100 d-flex flex-column" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
                  <div className="d-flex text-warning mb-3">
                    {[...Array(t.rating)].map((_, i) => <i key={i} className="bi bi-star-fill me-1" />)}
                  </div>
                  <p className="mb-4 flex-grow-1" style={{ color: 'var(--text-2)', fontStyle: 'italic', lineHeight: '1.7' }}>"{t.text}"</p>
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3 shadow-sm" style={{ width: '45px', height: '45px', background: t.color }}>
                      {t.avatar}
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold">{t.name}</h6>
                      <small style={{ color: 'var(--text-4)' }}>{t.role}</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <section className="py-5 border-top" style={{ background: 'var(--surface-0)' }}>
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-5">
              <span className="badge px-3 py-2 rounded-pill mb-3" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>Got Questions?</span>
              <h2 className="fw-bold mb-4" style={{ fontFamily: 'Sora, sans-serif', fontSize: '2.5rem', lineHeight: '1.2' }}>
                Frequently Asked<br/>Questions
              </h2>
              <p className="mb-4" style={{ color: 'var(--text-3)', fontSize: '1.1rem' }}>
                Everything you need to know about our products, delivery, and prescription processes.
              </p>
              <div className="d-flex align-items-center gap-3 p-4 rounded-4 shadow-sm" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
                 <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 50, height: 50, background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9' }}>
                   <i className="bi bi-headset fs-4"></i>
                 </div>
                 <div>
                   <h6 className="fw-bold mb-1">Still need help?</h6>
                   <Link to="/contact" className="text-decoration-none fw-semibold" style={{ color: '#0ea5e9' }}>Contact our support team <i className="bi bi-arrow-right ms-1"></i></Link>
                 </div>
              </div>
            </div>
            
            <div className="col-lg-7">
              <div className="accordion custom-accordion" id="faqAccordion">
                {[
                  { q: "How long does delivery take?", a: "Most orders are delivered within 24 hours. For urgent prescriptions, we offer an express 2-hour delivery option in select areas." },
                  { q: "Are my prescriptions secure?", a: "Absolutely. We use bank-level encryption to store your medical records. Only our licensed pharmacists have access to your uploaded prescriptions." },
                  { q: "Do you accept insurance?", a: "Yes, we partner with most major health insurance providers. You can add your insurance details during checkout to instantly calculate your copay." },
                  { q: "What if a medicine is out of stock?", a: "If a medication is unavailable, our pharmacists will immediately contact your doctor to find a suitable, safe alternative or notify you when it's back in stock." }
                ].map((faq, idx) => (
                  <div className="accordion-item border-0 mb-3 rounded-4 shadow-sm overflow-hidden" key={idx} style={{ background: 'var(--surface-1)' }}>
                    <h2 className="accordion-header">
                      <button className={`accordion-button ${idx !== 0 ? 'collapsed' : ''} fw-bold`} type="button" data-bs-toggle="collapse" data-bs-target={`#faq${idx}`} style={{ background: 'var(--surface-1)', color: 'var(--text-1)', boxShadow: 'none', padding: '1.25rem 1.5rem', fontSize: '1.05rem' }}>
                        {faq.q}
                      </button>
                    </h2>
                    <div id={`faq${idx}`} className={`accordion-collapse collapse ${idx === 0 ? 'show' : ''}`} data-bs-parent="#faqAccordion">
                      <div className="accordion-body border-top" style={{ borderColor: 'var(--border) !important', color: 'var(--text-2)', padding: '1.25rem 1.5rem', lineHeight: '1.7' }}>
                        {faq.a}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DUAL CTA ── */}
      <section className="py-5" style={{ background: 'var(--surface-0)' }}>
        <div className="container">
          <div className="row g-4">
            {/* Prescription CTA */}
            <div className="col-md-6">
              <div className="h-100 rounded-4 p-5 text-white text-center" style={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)',
                boxShadow: '0 15px 35px -10px rgba(67, 56, 202, 0.5)',
                position: 'relative', overflow: 'hidden'
              }}>
                <div style={{ position:'absolute', top:-40, right:-40, width:160, height:160, borderRadius:'50%', background:'rgba(255,255,255,0.15)', filter:'blur(24px)' }} />
                <div className="mb-3 mx-auto d-flex align-items-center justify-content-center rounded-3"
                  style={{ width:56, height:56, background:'rgba(255,255,255,0.18)', backdropFilter:'blur(8px)', position:'relative', zIndex:1 }}>
                  <i className="bi bi-file-earmark-medical" style={{ fontSize:'1.5rem' }} />
                </div>
                <h4 className="fw-bold mb-2" style={{ fontFamily:'Sora, sans-serif', position:'relative', zIndex:1 }}>Have a Prescription?</h4>
                <p className="mb-4" style={{ opacity:0.85, fontSize:'0.9rem', position:'relative', zIndex:1 }}>
                  Upload and get your medicines delivered after pharmacist verification.
                </p>
                <Link to="/upload-prescription" className="btn btn-light rounded-pill px-4 fw-semibold" style={{ position:'relative', zIndex:1 }}>
                  <i className="bi bi-upload me-2" />Upload Prescription
                </Link>
              </div>
            </div>
            {/* Inquiry CTA */}
            <div className="col-md-6">
              <div className="h-100 rounded-4 p-5 text-white text-center" style={{
                background: 'linear-gradient(135deg, #082f49 0%, #0284c7 100%)',
                boxShadow: '0 15px 35px -10px rgba(2, 132, 199, 0.5)',
                position: 'relative', overflow: 'hidden'
              }}>
                <div style={{ position:'absolute', bottom:-40, left:-40, width:160, height:160, borderRadius:'50%', background:'rgba(255,255,255,0.15)', filter:'blur(24px)' }} />
                <div className="mb-3 mx-auto d-flex align-items-center justify-content-center rounded-3"
                  style={{ width:56, height:56, background:'rgba(255,255,255,0.18)', backdropFilter:'blur(8px)', position:'relative', zIndex:1 }}>
                  <i className="bi bi-telephone-inbound" style={{ fontSize:'1.5rem' }} />
                </div>
                <h4 className="fw-bold mb-2" style={{ fontFamily:'Sora, sans-serif', position:'relative', zIndex:1 }}>Check Medicine Availability</h4>
                <p className="mb-4" style={{ opacity:0.85, fontSize:'0.9rem', position:'relative', zIndex:1 }}>
                  Can't find your medicine? Request a pharmacist callback and we'll confirm stock in 15 min.
                </p>
                <div className="d-flex gap-2 justify-content-center flex-wrap" style={{ position:'relative', zIndex:1 }}>
                  <Link to="/medicines/inquiry" className="btn btn-light rounded-pill px-4 fw-semibold">
                    <i className="bi bi-capsule me-2" />Check Availability
                  </Link>
                  <Link to="/contact" className="btn btn-outline-light rounded-pill px-4 fw-semibold">
                    <i className="bi bi-headset me-2" />Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DOWNLOAD APP SECTION ── */}
      <section className="py-5" style={{ background: 'var(--surface-0)' }}>
        <div className="container">
          <div className="row align-items-center rounded-5 overflow-hidden position-relative shadow-lg" style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)' }}>
            {/* Background decorative elements */}
            <div style={{ position:'absolute', top:'-20%', right:'10%', width:'300px', height:'300px', borderRadius:'50%', background:'rgba(255,255,255,0.1)', filter:'blur(40px)' }} />
            <div style={{ position:'absolute', bottom:'-20%', left:'5%', width:'200px', height:'200px', borderRadius:'50%', background:'rgba(255,255,255,0.15)', filter:'blur(30px)' }} />
            
            <div className="col-lg-6 p-5 text-white position-relative z-1">
              <span className="badge bg-white text-primary mb-3 px-3 py-2 rounded-pill shadow-sm" style={{ color: '#0ea5e9' }}>Mobile App Coming Soon</span>
              <h2 className="fw-bold mb-3" style={{ fontFamily: 'Sora, sans-serif', fontSize: '2.5rem', lineHeight: '1.2' }}>
                Take PharmaCare<br />Everywhere You Go
              </h2>
              <p className="mb-4" style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                Manage your prescriptions, track deliveries in real-time, and get exclusive mobile-only discounts with our upcoming mobile app.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <button className="btn btn-dark rounded-pill px-4 py-2 d-flex align-items-center gap-2 border-0 shadow-sm" style={{ background: '#000' }}>
                  <i className="bi bi-apple fs-4"></i>
                  <div className="text-start" style={{ lineHeight: '1.1' }}>
                    <small className="d-block" style={{ fontSize: '0.65rem', opacity: 0.8 }}>Download on the</small>
                    <span className="fw-bold">App Store</span>
                  </div>
                </button>
                <button className="btn btn-dark rounded-pill px-4 py-2 d-flex align-items-center gap-2 border-0 shadow-sm" style={{ background: '#000' }}>
                  <i className="bi bi-google-play fs-4"></i>
                  <div className="text-start" style={{ lineHeight: '1.1' }}>
                    <small className="d-block" style={{ fontSize: '0.65rem', opacity: 0.8 }}>GET IT ON</small>
                    <span className="fw-bold">Google Play</span>
                  </div>
                </button>
              </div>
            </div>
            
            <div className="col-lg-6 text-center position-relative z-1 d-block pt-5 align-self-end">
              <div className="position-relative mx-auto" style={{ width: '280px', height: '360px', background: '#0f172a', borderRadius: '40px 40px 0 0', border: '10px solid #334155', borderBottom: 'none', boxShadow: '0 -20px 40px rgba(0,0,0,0.2)' }}>
                <div className="w-100 h-100 rounded-top-4 overflow-hidden position-relative" style={{ background: 'var(--surface-0)' }}>
                  {/* Mockup Screen Content */}
                  <div className="text-white p-3 pt-4 text-center pb-5" style={{ background: '#0ea5e9', borderRadius: '0 0 30px 30px' }}>
                    <h5 className="fw-bold mb-0">PharmaCare</h5>
                  </div>
                  <div className="p-3" style={{ marginTop: '-30px' }}>
                     <div className="bg-white rounded-3 shadow-sm p-3 mb-3 d-flex align-items-center gap-3">
                       <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}><i className="bi bi-check2 fs-5"></i></div>
                       <div className="text-start"><h6 className="mb-0 fw-bold text-dark">Order Shipped</h6><small className="text-muted">Arriving in 2 hrs</small></div>
                     </div>
                     <div className="bg-white rounded-3 shadow-sm p-3 d-flex align-items-center gap-3 opacity-75">
                       <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}><i className="bi bi-file-medical fs-5"></i></div>
                       <div className="text-start"><h6 className="mb-0 fw-bold text-dark">Rx Refill</h6><small className="text-muted">Due tomorrow</small></div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
