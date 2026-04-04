import { Link, useLocation } from 'react-router-dom'
import { FiHome, FiShoppingBag, FiImage, FiFileText } from 'react-icons/fi'

export default function BottomNav() {
  const { pathname } = useLocation()

  const tabs = [
    { to: '/', label: 'Home', icon: FiHome },
    { to: '/shop', label: 'Shop', icon: FiShoppingBag },
    { to: '/gallery', label: 'Gallery', icon: FiImage },
    { to: '/blogs', label: 'Blogs', icon: FiFileText },
  ]

  return (
    <nav className="bottom-nav">
      {tabs.map(({ to, label, icon: Icon }) => {
        const isActive = pathname === to || (to !== '/' && pathname.startsWith(to))
        return (
          <Link key={label} to={to} className={`bottom-nav-item ${isActive ? 'active' : ''}`}>
            <div className="icon-wrapper">
              <Icon size={20} />
            </div>
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
