import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  const { pathname } = useLocation()

  // Re-run reveal check whenever the route changes
  useEffect(() => {
    // Small delay so the new page's DOM is painted before we observe
    const timer = setTimeout(() => {
      const revealEls = document.querySelectorAll('.reveal')

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible')
              observer.unobserve(entry.target) // stop watching once visible
            }
          })
        },
        {
          threshold: 0.05,          // trigger when just 5% is visible
          rootMargin: '0px 0px -20px 0px'
        }
      )

      revealEls.forEach((el) => {
        // If the element is already in the viewport (e.g. browser restored
        // scroll position mid-page), make it visible immediately
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('is-visible')
        } else {
          // Reset in case it was visible on a previous visit to this page
          observer.observe(el)
        }
      })

      return () => observer.disconnect()
    }, 50)

    return () => clearTimeout(timer)
  }, [pathname])

  // Scroll-to-top button visibility
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      className={`scroll-to-top ${visible ? 'visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      title="Back to top"
    >
      <i className="bi bi-chevron-up" />
    </button>
  )
}
