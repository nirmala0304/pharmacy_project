import { Link } from 'react-router-dom'

const TEAM = [
  {
    name: 'Dr. Priya Sharma',
    role: 'Chief Pharmacist',
    desc: '15 years in clinical pharmacy. Ensures every prescription is verified with the highest safety standards.',
    avatar: 'PS',
    color: '#10b981',
    icon: 'bi-shield-check',
  },
  {
    name: 'Rajesh Kumar',
    role: 'Head of Operations',
    desc: 'Logistics expert keeping thousands of orders on track daily across the country.',
    avatar: 'RK',
    color: '#0ea5e9',
    icon: 'bi-truck',
  },
  {
    name: 'Ananya Menon',
    role: 'Patient Care Specialist',
    desc: 'Dedicated to personalized patient support, guiding customers through every step of their health journey.',
    avatar: 'AM',
    color: '#8b5cf6',
    icon: 'bi-heart-pulse',
  },
  {
    name: 'Vikram Nair',
    role: 'Tech Lead',
    desc: 'Built the secure, HIPAA-compliant platform that powers PharmaCare\'s digital pharmacy experience.',
    avatar: 'VN',
    color: '#f59e0b',
    icon: 'bi-cpu',
  },
]

const MILESTONES = [
  { year: '2019', title: 'Founded', desc: 'PharmaCare launched as a small neighbourhood pharmacy in Tamil Nadu.' },
  { year: '2020', title: 'Digital Expansion', desc: 'Launched our first online ordering system during the pandemic to keep patients safe.' },
  { year: '2022', title: 'Pan-India Delivery', desc: 'Scaled operations to deliver across 500+ cities with 24-hour express service.' },
  { year: '2024', title: '50K+ Medicines', desc: 'Expanded to the largest catalogue of verified medicines with 200+ trusted brands.' },
  { year: '2025', title: 'Smart Platform', desc: 'Launched the full digital platform with prescription management, real-time tracking and 24/7 pharmacist chat.' },
]

const VALUES = [
  { icon: 'bi-shield-heart', title: 'Patient Safety First', desc: 'Every decision we make starts with one question: is it safe for the patient? We never cut corners on quality verification.', color: '#10b981', bg: 'var(--pc-green-light)' },
  { icon: 'bi-eye', title: 'Full Transparency', desc: 'Clear pricing, honest medicine information, and open communication with your doctors and pharmacists — no surprises.', color: '#0ea5e9', bg: 'var(--pc-blue-light)' },
  { icon: 'bi-people', title: 'Community Care', desc: 'We partner with local clinics and NGOs to make quality medicines accessible to underserved communities across India.', color: '#8b5cf6', bg: 'rgba(124,58,237,0.1)' },
  { icon: 'bi-lightning-charge', title: 'Continuous Innovation', desc: 'From AI-assisted prescription checks to real-time delivery tracking, we leverage technology to improve patient outcomes.', color: '#f59e0b', bg: 'var(--pc-amber-light)' },
]

const STATS = [
  { value: '50K+', label: 'Medicines', icon: 'bi-capsule', color: '#10b981' },
  { value: '200+', label: 'Trusted Brands', icon: 'bi-award', color: '#0ea5e9' },
  { value: '1M+', label: 'Orders Delivered', icon: 'bi-box-seam', color: '#8b5cf6' },
  { value: '4.9★', label: 'Customer Rating', icon: 'bi-star-fill', color: '#f59e0b' },
  { value: '500+', label: 'Cities Served', icon: 'bi-geo-alt', color: '#ef4444' },
  { value: '24/7', label: 'Pharmacist Support', icon: 'bi-headset', color: '#0ea5e9' },
]

export default function AboutUs() {
  return (
    <div>
      {/* ── HERO ── */}
      <section
        className="position-relative overflow-hidden text-white"
        style={{
          background: 'linear-gradient(135deg, #0f2820 0%, #1a3d2e 40%, #1e5c42 80%, #143326 100%)',
          padding: '100px 0 80px',
        }}
      >
        {/* Ambient orbs */}
        <div style={{ position:'absolute', top:'-80px', right:'-80px', width:'400px', height:'400px', borderRadius:'50%', background:'rgba(16,185,129,0.12)', filter:'blur(60px)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-60px', left:'-60px', width:'300px', height:'300px', borderRadius:'50%', background:'rgba(14,165,233,0.1)', filter:'blur(50px)', pointerEvents:'none' }} />

        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              {/* Eyebrow */}
              <span
                className="badge rounded-pill px-3 py-2 mb-4 d-inline-flex align-items-center gap-2"
                style={{ background:'rgba(16,185,129,0.2)', color:'#6ee7b7', fontSize:'0.78rem', letterSpacing:'1px' }}
              >
                <i className="bi bi-capsule" /> ABOUT PHARMACARE
              </span>

              <h1
                className="fw-bold mb-4"
                style={{ fontFamily:'Sora, sans-serif', fontSize:'clamp(2rem, 5vw, 3.2rem)', lineHeight:1.15, color:'#fff' }}
              >
                Healthcare You Can{' '}
                <span style={{ color:'#6ee7b7' }}>Trust,</span>
                <br />Delivered with Care
              </h1>

              <p style={{ color:'rgba(255,255,255,0.75)', fontSize:'1.1rem', lineHeight:1.8, maxWidth:'520px', marginBottom:'2rem' }}>
                PharmaCare started with a simple belief — every person deserves access to safe, affordable medicines and real pharmacist guidance, without leaving home.
              </p>

              <div className="d-flex gap-3 flex-wrap">
                <Link to="/medicines" className="btn btn-light rounded-pill px-4 py-2 fw-semibold" style={{ color:'#1a3d2e' }}>
                  <i className="bi bi-capsule me-2" />Browse Medicines
                </Link>
                <Link to="/contact" className="btn rounded-pill px-4 py-2 fw-semibold" style={{ border:'1.5px solid rgba(255,255,255,0.35)', color:'#fff', background:'transparent' }}>
                  <i className="bi bi-headset me-2" />Contact Us
                </Link>
              </div>
            </div>

            {/* Stats grid */}
            <div className="col-lg-6">
              <div className="row g-3">
                {STATS.map((s) => (
                  <div className="col-6 col-sm-4" key={s.label}>
                    <div
                      className="rounded-4 p-3 text-center h-100"
                      style={{ background:'rgba(255,255,255,0.07)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.12)' }}
                    >
                      <div className="mb-2">
                        <i className={`bi ${s.icon}`} style={{ fontSize:'1.4rem', color: s.color }} />
                      </div>
                      <div className="fw-bold mb-0" style={{ fontSize:'1.5rem', fontFamily:'Sora, sans-serif', color:'#fff' }}>{s.value}</div>
                      <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.6)' }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR STORY ── */}
      <section className="py-5" style={{ background: 'var(--surface-0)' }}>
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-5">
              {/* Decorative visual */}
              <div className="position-relative" style={{ height: 380 }}>
                {/* Big circle */}
                <div className="rounded-circle position-absolute" style={{ width:300, height:300, background:'linear-gradient(135deg, var(--pc-green-light), var(--pc-teal-light))', top:0, left:0 }} />
                {/* Stacked cards */}
                <div className="rounded-4 shadow p-4 position-absolute" style={{ background:'var(--surface-1)', border:'1px solid var(--border)', top:20, left:20, width:220, zIndex:2 }}>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width:42, height:42, background:'var(--pc-green-light)', color:'var(--pc-green)' }}>
                      <i className="bi bi-shield-check fs-5" />
                    </div>
                    <div>
                      <div className="fw-bold" style={{ fontSize:'0.9rem', color:'var(--text-1)' }}>Licensed Pharmacy</div>
                      <div style={{ fontSize:'0.75rem', color:'var(--text-4)' }}>Govt. Registered</div>
                    </div>
                  </div>
                  <div style={{ fontSize:'0.8rem', color:'var(--text-3)', lineHeight:1.5 }}>
                    Fully certified and regulated by the Drugs Controller General of India.
                  </div>
                </div>
                <div className="rounded-4 shadow p-4 position-absolute" style={{ background:'var(--surface-1)', border:'1px solid var(--border)', bottom:0, right:0, width:210, zIndex:2 }}>
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width:42, height:42, background:'rgba(14,165,233,0.1)', color:'#0ea5e9' }}>
                      <i className="bi bi-clock-history fs-5" />
                    </div>
                    <div>
                      <div className="fw-bold" style={{ fontSize:'0.9rem', color:'var(--text-1)' }}>Since 2019</div>
                      <div style={{ fontSize:'0.75rem', color:'var(--text-4)' }}>6 years of care</div>
                    </div>
                  </div>
                  <div style={{ fontSize:'0.8rem', color:'var(--text-3)', lineHeight:1.5 }}>
                    Serving families across India with trust and transparency.
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <span className="badge rounded-pill px-3 py-2 mb-3 d-inline-block" style={{ background:'var(--pc-green-light)', color:'var(--pc-green)', fontSize:'0.78rem' }}>
                Our Story
              </span>
              <h2 className="fw-bold mb-4" style={{ fontFamily:'Sora, sans-serif', fontSize:'2.2rem', color:'var(--text-1)', lineHeight:1.25 }}>
                Born from a need to make healthcare simple
              </h2>
              <p style={{ color:'var(--text-2)', lineHeight:1.85, marginBottom:'1.25rem' }}>
                PharmaCare was founded in 2019 by a group of licensed pharmacists in Tamil Nadu who saw a gap — patients were struggling to get the right medicines quickly and safely, especially in smaller towns. Long queues, stock shortages, and confusing prescription requirements were turning healthcare into a burden.
              </p>
              <p style={{ color:'var(--text-2)', lineHeight:1.85, marginBottom:'1.5rem' }}>
                We built PharmaCare to remove every friction point between a patient and their medicine. Our platform combines the expertise of certified pharmacists with modern technology to give you verified medicines, fast delivery, and real guidance — all from your phone or computer.
              </p>
              <div className="d-flex flex-wrap gap-4">
                {[
                  { icon:'bi-patch-check-fill', text:'Licensed & Govt Regulated', color:'var(--pc-green)' },
                  { icon:'bi-lock-fill', text:'HIPAA-Compliant Storage', color:'#0ea5e9' },
                  { icon:'bi-award-fill', text:'ISO 9001 Certified', color:'#8b5cf6' },
                ].map(b => (
                  <div key={b.text} className="d-flex align-items-center gap-2">
                    <i className={`bi ${b.icon}`} style={{ color:b.color, fontSize:'1.1rem' }} />
                    <span style={{ fontSize:'0.875rem', fontWeight:600, color:'var(--text-1)' }}>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR VALUES ── */}
      <section className="py-5" style={{ background:'var(--surface-1)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge rounded-pill px-3 py-2 mb-3 d-inline-block" style={{ background:'rgba(139,92,246,0.12)', color:'#8b5cf6', fontSize:'0.78rem' }}>
              What We Stand For
            </span>
            <h2 className="fw-bold mb-3" style={{ fontFamily:'Sora, sans-serif', fontSize:'2rem', color:'var(--text-1)' }}>
              Our Core Values
            </h2>
            <p className="mx-auto" style={{ color:'var(--text-3)', maxWidth:560 }}>
              These aren't just words on a wall. Every feature we build, every hire we make, and every delivery we dispatch is guided by these four principles.
            </p>
          </div>

          <div className="row g-4">
            {VALUES.map((v, i) => (
              <div className="col-md-6 col-lg-3" key={v.title}>
                <div
                  className="h-100 rounded-4 p-4"
                  style={{ background:'var(--surface-0)', border:'1px solid var(--border)', transition:'box-shadow 0.2s, transform 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow='0 8px 32px rgba(0,0,0,0.08)'; e.currentTarget.style.transform='translateY(-4px)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow=''; e.currentTarget.style.transform='' }}
                >
                  <div className="rounded-3 d-inline-flex align-items-center justify-content-center mb-3" style={{ width:52, height:52, background:v.bg }}>
                    <i className={`bi ${v.icon}`} style={{ fontSize:'1.4rem', color:v.color }} />
                  </div>
                  <h6 className="fw-bold mb-2" style={{ color:'var(--text-1)', fontFamily:'Sora, sans-serif' }}>{v.title}</h6>
                  <p className="mb-0" style={{ color:'var(--text-3)', fontSize:'0.875rem', lineHeight:1.65 }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MILESTONES ── */}
      <section className="py-5" style={{ background:'var(--surface-0)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge rounded-pill px-3 py-2 mb-3 d-inline-block" style={{ background:'var(--pc-teal-light)', color:'var(--pc-teal)', fontSize:'0.78rem' }}>
              Our Journey
            </span>
            <h2 className="fw-bold mb-3" style={{ fontFamily:'Sora, sans-serif', fontSize:'2rem', color:'var(--text-1)' }}>
              From Neighbourhood Pharmacy to National Platform
            </h2>
          </div>

          <div className="position-relative">
            {/* Vertical line */}
            <div
              className="d-none d-md-block position-absolute"
              style={{ left:'50%', top:0, bottom:0, width:'2px', background:'linear-gradient(to bottom, var(--pc-green), var(--pc-teal))', transform:'translateX(-50%)', opacity:0.25 }}
            />

            <div className="d-flex flex-column gap-4">
              {MILESTONES.map((m, i) => {
                const isLeft = i % 2 === 0
                return (
                  <div className="row align-items-center g-0" key={m.year}>
                    {/* Left side */}
                    <div className={`col-md-5 ${isLeft ? 'text-md-end pe-md-5' : 'order-md-last ps-md-5'}`}>
                      {isLeft ? (
                        <div className="rounded-4 p-4" style={{ background:'var(--surface-1)', border:'1px solid var(--border)', display:'inline-block', textAlign:'left', maxWidth:340 }}>
                          <div className="fw-bold mb-1" style={{ color:'var(--text-1)', fontFamily:'Sora, sans-serif', fontSize:'1.05rem' }}>{m.title}</div>
                          <p className="mb-0" style={{ color:'var(--text-3)', fontSize:'0.875rem', lineHeight:1.65 }}>{m.desc}</p>
                        </div>
                      ) : (
                        <div className="fw-bold" style={{ fontFamily:'Sora, sans-serif', fontSize:'2rem', color:'var(--pc-green)', opacity:0.8 }}>{m.year}</div>
                      )}
                    </div>

                    {/* Centre dot */}
                    <div className="col-md-2 d-none d-md-flex justify-content-center">
                      <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white" style={{ width:48, height:48, background:'linear-gradient(135deg, var(--pc-green), var(--pc-teal))', fontSize:'0.8rem', fontFamily:'Sora, sans-serif', zIndex:1, flexShrink:0 }}>
                        {m.year.slice(2)}
                      </div>
                    </div>

                    {/* Right side */}
                    <div className={`col-md-5 ${isLeft ? 'ps-md-5' : 'text-md-end pe-md-5 order-md-first'}`}>
                      {!isLeft ? (
                        <div className="rounded-4 p-4" style={{ background:'var(--surface-1)', border:'1px solid var(--border)', display:'inline-block', textAlign:'left', maxWidth:340 }}>
                          <div className="fw-bold mb-1" style={{ color:'var(--text-1)', fontFamily:'Sora, sans-serif', fontSize:'1.05rem' }}>{m.title}</div>
                          <p className="mb-0" style={{ color:'var(--text-3)', fontSize:'0.875rem', lineHeight:1.65 }}>{m.desc}</p>
                        </div>
                      ) : (
                        <div className="fw-bold" style={{ fontFamily:'Sora, sans-serif', fontSize:'2rem', color:'var(--pc-green)', opacity:0.8 }}>{m.year}</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-5" style={{ background:'var(--surface-1)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge rounded-pill px-3 py-2 mb-3 d-inline-block" style={{ background:'var(--pc-blue-light)', color:'var(--pc-blue)', fontSize:'0.78rem' }}>
              The People Behind PharmaCare
            </span>
            <h2 className="fw-bold mb-3" style={{ fontFamily:'Sora, sans-serif', fontSize:'2rem', color:'var(--text-1)' }}>
              Meet Our Team
            </h2>
            <p className="mx-auto" style={{ color:'var(--text-3)', maxWidth:520 }}>
              A dedicated group of healthcare professionals, technologists, and operations experts working together for your health.
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            {TEAM.map((member) => (
              <div className="col-sm-6 col-lg-3" key={member.name}>
                <div
                  className="h-100 rounded-4 p-4 text-center"
                  style={{ background:'var(--surface-0)', border:'1px solid var(--border)', transition:'box-shadow 0.25s, transform 0.25s' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow='0 12px 40px rgba(0,0,0,0.1)'; e.currentTarget.style.transform='translateY(-5px)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow=''; e.currentTarget.style.transform='' }}
                >
                  {/* Avatar */}
                  <div
                    className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center fw-bold text-white"
                    style={{ width:72, height:72, background:`linear-gradient(135deg, ${member.color}, ${member.color}aa)`, fontSize:'1.2rem', fontFamily:'Sora, sans-serif', letterSpacing:1 }}
                  >
                    {member.avatar}
                  </div>
                  {/* Role badge */}
                  <div className="mb-2">
                    <span className="badge rounded-pill px-3 py-1" style={{ background:`${member.color}18`, color:member.color, fontSize:'0.72rem' }}>
                      <i className={`bi ${member.icon} me-1`} />{member.role}
                    </span>
                  </div>
                  <h6 className="fw-bold mb-2" style={{ color:'var(--text-1)', fontFamily:'Sora, sans-serif' }}>{member.name}</h6>
                  <p className="mb-0" style={{ color:'var(--text-3)', fontSize:'0.82rem', lineHeight:1.65 }}>{member.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS ── */}
      <section className="py-5" style={{ background:'var(--surface-0)' }}>
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-2" style={{ fontFamily:'Sora, sans-serif', fontSize:'1.75rem', color:'var(--text-1)' }}>Certifications & Compliance</h2>
            <p style={{ color:'var(--text-3)', fontSize:'0.9rem' }}>We meet the highest standards in pharmacy regulation and data privacy.</p>
          </div>
          <div className="row g-3 justify-content-center">
            {[
              { icon:'bi-shield-fill-check', label:'DCGI Licensed', sub:'Drug Controller General of India', color:'#10b981' },
              { icon:'bi-lock-fill', label:'HIPAA Compliant', sub:'Patient data fully encrypted', color:'#0ea5e9' },
              { icon:'bi-award-fill', label:'ISO 9001:2015', sub:'Quality Management Certified', color:'#8b5cf6' },
              { icon:'bi-patch-check-fill', label:'WHO-GMP', sub:'Good Manufacturing Practices', color:'#f59e0b' },
            ].map(cert => (
              <div className="col-6 col-md-3" key={cert.label}>
                <div
                  className="rounded-4 p-4 text-center"
                  style={{ background:'var(--surface-1)', border:'1px solid var(--border)' }}
                >
                  <i className={`bi ${cert.icon}`} style={{ fontSize:'2rem', color:cert.color, display:'block', marginBottom:'0.75rem' }} />
                  <div className="fw-bold" style={{ fontSize:'0.9rem', color:'var(--text-1)' }}>{cert.label}</div>
                  <div style={{ fontSize:'0.75rem', color:'var(--text-4)', marginTop:'0.25rem' }}>{cert.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-5" style={{ background:'var(--surface-1)' }}>
        <div className="container">
          <div
            className="rounded-5 text-white text-center p-5 position-relative overflow-hidden"
            style={{ background:'linear-gradient(135deg, #0f2820 0%, #1e5c42 60%, #1a3d2e 100%)' }}
          >
            <div style={{ position:'absolute', top:'-60px', right:'-60px', width:'300px', height:'300px', borderRadius:'50%', background:'rgba(16,185,129,0.12)', filter:'blur(50px)' }} />
            <div style={{ position:'absolute', bottom:'-50px', left:'-50px', width:'250px', height:'250px', borderRadius:'50%', background:'rgba(14,165,233,0.1)', filter:'blur(40px)' }} />

            <div className="position-relative" style={{ zIndex:1 }}>
              <span className="badge rounded-pill px-3 py-2 mb-3 d-inline-block" style={{ background:'rgba(16,185,129,0.25)', color:'#6ee7b7', fontSize:'0.78rem' }}>
                Ready to Start?
              </span>
              <h2 className="fw-bold mb-3" style={{ fontFamily:'Sora, sans-serif', fontSize:'2.2rem' }}>
                Your health is our purpose
              </h2>
              <p className="mx-auto mb-4" style={{ color:'rgba(255,255,255,0.75)', maxWidth:500, fontSize:'1.05rem', lineHeight:1.75 }}>
                Join over a million families who trust PharmaCare for safe, fast, and affordable medicine delivery.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link to="/medicines" className="btn btn-light fw-semibold rounded-pill px-4 py-2" style={{ color:'#1a3d2e' }}>
                  <i className="bi bi-capsule me-2" />Browse Medicines
                </Link>
                <Link to="/upload-prescription" className="btn rounded-pill px-4 py-2 fw-semibold" style={{ border:'1.5px solid rgba(255,255,255,0.4)', color:'#fff', background:'transparent' }}>
                  <i className="bi bi-file-earmark-medical me-2" />Upload Prescription
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
