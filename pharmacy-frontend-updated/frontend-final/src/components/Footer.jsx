import { Link } from 'react-router-dom'

const SOCIAL_LINKS = [
  { icon: 'bi-instagram', href: 'https://www.instagram.com/nimmy_dollz?igsh=MXV6ZWFvOXMzNnFrbA==', label: 'Instagram', color: '#E1306C' },
  { icon: 'bi-facebook',  href: 'https://www.facebook.com/kd.sanjai.92',                          label: 'Facebook',  color: '#1877F2' },
  { icon: 'bi-linkedin',  href: 'https://www.linkedin.com/in/nirmala-d-051b393ba',               label: 'LinkedIn',  color: '#0A66C2' },
  { icon: 'bi-twitter-x', href: 'https://x.com/Nimmy_dollz',                                     label: 'X (Twitter)', color: '#000' },
]

export default function Footer() {
  return (
    <footer className="footer-main py-5">
      <div className="container">
        <div className="row g-4">
          {/* Brand */}
          <div className="col-md-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span style={{ background:'linear-gradient(135deg, var(--pc-green), var(--pc-teal))', color:'#fff', width:34, height:34, borderRadius:8,
                display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:'1rem' }}>
                <i className="bi bi-capsule" />
              </span>
              <span className="footer-heading" style={{ fontSize:'1.1rem' }}>PharmaCare</span>
            </div>
            <p className="footer-text mb-3" style={{ fontSize:'0.875rem', lineHeight:1.65 }}>
              Your trusted online pharmacy. Quality medicines delivered to your doorstep. Licensed &amp; certified by health authorities.
            </p>

            {/* Real social links */}
            <div className="d-flex gap-2 flex-wrap">
              {SOCIAL_LINKS.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="footer-social-btn" title={s.label}
                  onMouseEnter={e => { e.currentTarget.style.background = s.color; e.currentTarget.style.borderColor = s.color; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = '' }}>
                  <i className={`bi ${s.icon}`} />
                </a>
              ))}
            </div>

            {/* Direct email */}
            <a href="mailto:nimmii0304@gmail.com"
              className="d-inline-flex align-items-center gap-2 mt-3 text-decoration-none"
              style={{ fontSize:'0.8rem', color:'var(--text-3)', transition:'color var(--dur-fast)' }}
              onMouseEnter={e => e.currentTarget.style.color='var(--pc-green)'}
              onMouseLeave={e => e.currentTarget.style.color='var(--text-3)'}>
              <i className="bi bi-envelope-fill" style={{ color:'var(--pc-green)', fontSize:'0.85rem' }} />
              nimmii0304@gmail.com
            </a>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-md-2">
            <h6 className="footer-heading mb-3">Quick Links</h6>
            <ul className="list-unstyled mb-0">
              {[
                { to:'/about',                icon:'bi-info-circle',          label:'About Us' },
                { to:'/medicines',            icon:'bi-capsule',              label:'Medicines' },
                { to:'/medicines/inquiry',    icon:'bi-search-heart',         label:'Check Availability' },
                { to:'/upload-prescription',  icon:'bi-file-earmark-medical', label:'Prescriptions' },
                { to:'/orders',               icon:'bi-bag',                  label:'My Orders' },
                { to:'/contact',              icon:'bi-headset',              label:'Contact Us' },
              ].map(link => (
                <li key={link.to} className="mb-2">
                  <Link to={link.to} className="footer-link d-flex align-items-center gap-2 text-decoration-none" style={{ fontSize:'0.875rem' }}>
                    <i className={`bi ${link.icon} footer-link-icon`} style={{ fontSize:'0.8rem' }} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="col-6 col-md-2">
            <h6 className="footer-heading mb-3">Support</h6>
            <ul className="list-unstyled mb-0">
              {[
                { to:'/contact',           label:'Help Center' },
                { to:'/medicines/inquiry', label:'Medicine Inquiry' },
                { to:'/orders',            label:'Track Order' },
                { to:'/contact',           label:'Returns Policy' },
                { to:'/contact',           label:'Pharmacist Chat' },
              ].map(s => (
                <li key={s.label} className="mb-2">
                  <Link to={s.to} className="footer-link text-decoration-none" style={{ fontSize:'0.875rem' }}>{s.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-md-4">
            <h6 className="footer-heading mb-3">Contact Us</h6>
            <ul className="list-unstyled mb-0">
              {[
                { icon:'bi-telephone-fill', href:'tel:1800742762',                                   content:'1800-PHARMA (24/7 toll-free)' },
                { icon:'bi-whatsapp',       href:'https://wa.me/919876543210',                       content:'WhatsApp Chat' },
                { icon:'bi-envelope-fill',  href:'mailto:nimmii0304@gmail.com',                     content:'nimmii0304@gmail.com' },
                { icon:'bi-instagram',      href:'https://www.instagram.com/nimmy_dollz?igsh=MXV6ZWFvOXMzNnFrbA==', content:'@nimmy_dollz' },
                { icon:'bi-geo-alt-fill',   href:'#',                                               content:'123 Health Street, Medical City' },
              ].map((item, i) => (
                <li key={i} className="d-flex align-items-start gap-2 mb-2">
                  <i className={`bi ${item.icon} footer-link-icon mt-1 flex-shrink-0`} style={{ fontSize:'0.8rem' }} />
                  <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="footer-link text-decoration-none" style={{ fontSize:'0.875rem', lineHeight:1.4 }}>
                    {item.content}
                  </a>
                </li>
              ))}
            </ul>
            <Link to="/contact" className="btn btn-sm mt-3 rounded-pill fw-semibold"
              style={{ background:'var(--pc-green-light)', color:'var(--pc-green-dark)', border:'1px solid var(--pc-green-mid)', fontSize:'0.78rem' }}>
              <i className="bi bi-headset me-2" />Get Support
            </Link>
          </div>
        </div>

        <hr className="footer-divider my-4" />

        {/* Bottom */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <p className="footer-text mb-0" style={{ fontSize:'0.82rem' }}>
            &copy; 2025 PharmaCare by Nirmala D. All rights reserved.
          </p>
          <div className="d-flex gap-3 flex-wrap">
            {['Privacy Policy','Terms of Service','Refund Policy'].map(l => (
              <Link key={l} to="/contact" className="footer-link text-decoration-none" style={{ fontSize:'0.82rem' }}>{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
