import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import BottomNav from './components/BottomNav'
import { Footer } from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'
import Home from './pages/Home'
import {
  Shop, JerseyDetail, Cart, Checkout, OrderSuccess,
  About, Contact, Login, AdminDashboard, AdminOrderDetail, Blogs, Gallery,
  Clubs
} from './pages/Pages'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

export default function App() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin') || pathname === '/login'
  return (
    <CartProvider>
      <ScrollTop />
      <Toaster position="top-right" toastOptions={{ style: { background: '#161616', color: '#F2F2F2', border: '1px solid rgba(232,0,30,0.3)', fontFamily: 'Barlow, sans-serif', fontSize: 14 } }} />
      {!isAdmin && <Navbar />}
      <div style={{ paddingTop: isAdmin ? 0 : 100 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/shop/:slug" element={<JerseyDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
      </div>
      {!isAdmin && <Footer />}
      {!isAdmin && <BottomNav />}
      {!isAdmin && <WhatsAppFloat />}
    </CartProvider>
  )
}