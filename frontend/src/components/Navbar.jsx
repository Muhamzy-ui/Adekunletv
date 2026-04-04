import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { FiShoppingCart, FiMenu, FiX, FiSearch, FiSun, FiMoon } from 'react-icons/fi'
import { useCart } from '../context/CartContext'

const NAV = [
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/blogs', label: 'Blogs' },
  { to: '/gallery', label: 'Gallery' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [theme, setTheme] = useState('dark')
  const { count } = useCart()
  const { pathname } = useLocation()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    if (theme === 'light') document.body.classList.add('light-mode')
    else document.body.classList.remove('light-mode')
  }, [theme])

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 150 }}>
      {/* Ticker tape */}
      <div style={{
        background: 'var(--red)', overflow: 'hidden',
        height: 32, display: 'flex', alignItems: 'center',
      }}>
        <div style={{
          display: 'flex', gap: 0, whiteSpace: 'nowrap',
          animation: 'ticker 25s linear infinite',
          fontFamily: 'var(--font-display)',
          fontSize: 11, fontWeight: 700, letterSpacing: '3px',
          color: 'white', textTransform: 'uppercase',
        }}>
          {Array(6).fill(null).map((_, i) => (
            <span key={i} style={{ padding: '0 40px' }}>
              🏆 Free Delivery on Orders Above &nbsp;\u20A630,000 &nbsp;•&nbsp;
              ⚽ Original Quality Jerseys &nbsp;•&nbsp;
              🇳🇬 Nationwide Delivery in 24–48hrs &nbsp;•&nbsp;
              💳 Pay with Card, Transfer or USSD
            </span>
          ))}
        </div>
      </div>

      <nav style={{
        background: scrolled ? 'rgba(8,8,8,0.97)' : 'var(--black)',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'rgba(232,0,30,0.2)' : 'var(--border)'}`,
        transition: 'all 0.4s var(--ease)',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.8)' : 'none',
      }}>
        <div className="container nav-container" style={{
          display: 'flex', alignItems: 'center',
          height: 68, gap: 32,
        }}>

          {/* Logo */}
          <Link to="/" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            textDecoration: 'none', flexShrink: 0,
          }}>
            <div className="nav-logo-box" style={{
              width: 40, height: 40,
              background: 'var(--red)',
              clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontSize: 14, fontWeight: 900, color: 'white',
              letterSpacing: '1px',
            }}>ATV</div>
            <div className="brand-text-group">
              <div className="nav-logo-text" style={{
                fontFamily: 'var(--font-display)',
                fontSize: 18, fontWeight: 900, letterSpacing: '2px',
                color: 'var(--white)', lineHeight: 1, textTransform: 'uppercase',
              }}>Adekunle TV</div>
              <div className="nav-logo-sub" style={{
                fontFamily: 'var(--font-display)',
                fontSize: 10, color: 'var(--red)',
                letterSpacing: '3px', textTransform: 'uppercase',
              }}>Jerseys</div>
            </div>
          </Link>

        {/* Desktop Nav */}
          <ul style={{
            display: 'flex', gap: 4, listStyle: 'none',
            flex: 1, alignItems: 'center',
          }}>
            {NAV.map(({ to, label }) => (
              <li key={label}>
                <NavLink 
                  to={to} 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  style={({ isActive }) => ({
                    fontFamily: 'var(--font-display)',
                    fontSize: 13, fontWeight: 700,
                    letterSpacing: '2px', textTransform: 'uppercase',
                    color: isActive ? 'var(--white)' : 'var(--muted)',
                    textDecoration: 'none',
                    padding: '8px 14px',
                    display: 'block',
                    paddingBottom: 6,
                  })}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Theme + Cart + Hamburger Group */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.5vw, 12px)', flexShrink: 0 }}>
            <button
              onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              className="p-nav-btn theme-btn"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <FiSun size={17} /> : <FiMoon size={17} />}
            </button>

            <div className="nav-search" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <FiSearch size={16} style={{
                position: 'absolute', left: 12,
                color: 'var(--muted)', pointerEvents: 'none',
              }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search jerseys..."
                style={{
                  background: 'var(--dark2)',
                  border: '1px solid var(--border)',
                  borderRadius: 4,
                  padding: '8px 12px 8px 36px',
                  color: 'var(--white)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 13, width: 180, outline: 'none',
                  transition: 'border-color 0.2s, width 0.3s',
                }}
                onFocus={e => { e.target.style.borderColor = 'var(--red)'; e.target.style.width = '220px' }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.width = '180px' }}
              />
            </div>

            <Link to="/cart" className="p-nav-btn cart-btn">
              <FiShoppingCart size={17} />
              {count > 0 && (
                <>
                  <span style={{ color: 'var(--red)', fontWeight: 800 }}>{count}</span>
                  <span className="cart-text" style={{ color: 'var(--muted)', fontSize: 11, marginLeft: 2 }}>
                    items
                  </span>
                </>
              )}
              {count === 0 && <span className="cart-text" style={{ color: 'var(--muted)', fontSize: 11, marginLeft: 2 }}>Cart</span>}
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(p => !p)}
              className="p-nav-btn hamburger"
            >
              {open ? <FiX size={19} /> : <FiMenu size={19} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 140,
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(8px)',
        opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity 0.4s ease',
      }} onClick={() => setOpen(false)}>

        {/* Animated Slide-in Sidebar */}
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: 'absolute', top: 0, bottom: 0, right: 0,
            width: '70%', maxWidth: 280,
            background: 'var(--black)',
            backdropFilter: 'blur(32px) saturate(180%)',
            borderLeft: '1px solid var(--border)',
            padding: '100px 30px 40px',
            transform: open ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'flex', flexDirection: 'column',
            boxShadow: '-20px 0 50px rgba(0,0,0,0.25)',
          }}
        >
          {/* Header area in Sidebar */}
          <div style={{ position: 'absolute', top: 30, left: 40, right: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, background: 'var(--red)', clipPath: 'polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 900, color: 'white' }}>ATV</div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 900, color: 'var(--white)', letterSpacing: '1px', textTransform: 'uppercase' }}>Adekunle TV</span>
             </div>
             <button
               onClick={() => setOpen(false)}
               style={{ background: 'var(--dark3)', border: '1px solid var(--border)', color: 'var(--white)', padding: 10, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
             >
               <FiX size={20} />
             </button>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {NAV.map(({ to, label }) => (
              <Link 
                key={label} 
                to={to} 
                className="underline-hover"
                onClick={() => setOpen(false)} 
                style={{
                  display: 'inline-block', padding: '12px 0',
                  fontFamily: 'var(--font-display)',
                  fontSize: 28, fontWeight: 800,
                  letterSpacing: '1px', textTransform: 'uppercase',
                  color: 'var(--white)', textDecoration: 'none',
                  width: 'fit-content'
                }}
              >{label}</Link>
            ))}
          </nav>

          <div style={{ marginTop: 'auto' }}>
            <Link to="/cart" className="btn btn-red btn-lg" onClick={() => setOpen(false)} style={{ width: '100%', justifyContent: 'center' }}>
              <FiShoppingCart size={20} /> View Cart ({count})
            </Link>
            <p style={{ marginTop: 24, fontSize: 11, color: 'var(--muted)', textAlign: 'center', letterSpacing: '2px', textTransform: 'uppercase' }}>
              Nigeria's #1 Jersey Dealer
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hamburger { display: flex !important; }
          nav ul { display: none !important; }
          nav .nav-search { display: none !important; }
          .nav-logo-box { width: 34px !important; height: 34px !important; font-size: 11px !important; }
          .nav-logo-text { font-size: 14px !important; letter-spacing: 1px !important; }
          .nav-logo-sub { font-size: 7px !important; letter-spacing: 1.5px !important; margin-top: -1px !important; }
          .nav-container { height: 68px !important; justify-content: space-between !important; padding: 0 16px !important; gap: 0 !important; }
          .cart-text { display: none !important; }
          .p-nav-btn { height: 36px !important; padding: 0 10px !important; border-radius: 6px !important; }
        }
      `}</style>
    </div>
  )
}