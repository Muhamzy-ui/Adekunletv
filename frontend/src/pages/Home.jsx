import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiTruck, FiShield, FiStar, FiPlay, FiZap, FiShoppingCart, FiChevronLeft, FiChevronRight, FiCheck } from 'react-icons/fi'
import { HiOutlineFire } from 'react-icons/hi'
import {
  JERSEYS as STATIC_JERSEYS, CLUBS as STATIC_CLUBS, TESTIMONIALS, STATS, formatPrice, getStockStatus
} from '../utils/data'
import { useCart } from '../context/CartContext'
import api from '../utils/api'
import toast from 'react-hot-toast'

const getImageUrl = (url) => {
  if (!url) return null
  if (url.startsWith('http')) return url
  const base = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
  return `${base.replace(/\/$/, '')}${url.startsWith('/') ? url : '/' + url}`
}

/* ── Jersey Card ─────────────────────────────── */
function JerseyCard({ jersey }) {
  const { addItem } = useCart()
  const [selectedSize, setSelectedSize] = useState('')
  const [hovered, setHovered] = useState(false)
  const stock = getStockStatus(jersey.sizes)
  const availSizes = Object.entries(jersey.sizes).filter(([, qty]) => qty > 0).map(([s]) => s)
  const hasOld = !!jersey.old_price
  const discount = hasOld ? Math.round((1 - jersey.price / jersey.old_price) * 100) : 0

  const handleCart = (e) => {
    e.preventDefault()
    if (!selectedSize) { toast.error('Please select a size first'); return }
    addItem(jersey, selectedSize)
    toast.success(`${jersey.title} (${selectedSize}) added to cart!`)
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--dark2)',
        border: `1px solid ${hovered ? 'rgba(232,0,30,0.4)' : 'var(--border)'}`,
        borderRadius: 8, overflow: 'hidden',
        transition: 'all 0.4s var(--ease)',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: hovered ? '0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(232,0,30,0.1)' : 'none',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Image area */}
      <Link to={`/shop/${jersey.slug}`} style={{
        height: 220, position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textDecoration: 'none',
      }}>
        { (jersey.primary_image || (jersey.images?.[0]?.image) || (typeof jersey.images?.[0] === 'string' ? jersey.images[0] : null)) ? (
          <img src={getImageUrl(jersey.primary_image || (jersey.images?.[0]?.image) || jersey.images[0])} alt={jersey.title}
            style={{ width:'100%', height:'100%', objectFit:'cover',
              transition: 'transform 0.6s var(--ease)',
              transform: hovered ? 'scale(1.08)' : 'scale(1)' }}
          />
        ) : (
          /* Jersey SVG Illustration */
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
            <svg viewBox="0 0 120 130" style={{ width:110, filter:`drop-shadow(0 8px 20px rgba(232,0,30,0.3))`, transition:'transform 0.5s', transform: hovered ? 'scale(1.08) translateY(-4px)' : 'scale(1)' }}>
              {/* Jersey body */}
              <path d="M20 35 L8 55 L28 60 L28 120 L92 120 L92 60 L112 55 L100 35 L80 28 Q60 15 40 28 Z"
                fill={(typeof jersey.club === 'object' ? jersey.club.name : jersey.club) === 'Nigeria' ? '#008751' :
                      ['Manchester United', 'Liverpool', 'Arsenal'].some(c => (typeof jersey.club === 'object' ? jersey.club.name : jersey.club)?.includes(c)) ? '#C8102E' :
                      ['Chelsea', 'Man City'].some(c => (typeof jersey.club === 'object' ? jersey.club.name : jersey.club)?.includes(c)) ? '#034694' :
                      (typeof jersey.club === 'object' ? jersey.club.name : jersey.club) === 'Barcelona' ? '#A50044' :
                      (typeof jersey.club === 'object' ? jersey.club.name : jersey.club) === 'Real Madrid' ? '#e8e8e8' :
                      (typeof jersey.club === 'object' ? jersey.club.name : jersey.club) === 'PSG' ? '#004170' :
                      (typeof jersey.club === 'object' ? jersey.club.name : jersey.club) === 'Bayern Munich' ? '#DC052D' : '#1a1a1a'}
                stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
              {/* Collar */}
              <path d="M42 28 Q60 40 78 28 Q72 18 60 16 Q48 18 42 28 Z"
                fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8"/>
              {/* Stripes for some clubs */}
              {((typeof jersey.club === 'object' ? jersey.club.name : jersey.club) === 'Barcelona') && (
                <>
                  <rect x="52" y="28" width="10" height="92" fill="rgba(0,70,200,0.6)"/>
                  <rect x="68" y="28" width="10" height="92" fill="rgba(0,70,200,0.6)"/>
                </>
              )}
              {/* Sleeve lines */}
              <line x1="28" y1="60" x2="8" y2="55" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              <line x1="92" y1="60" x2="112" y2="55" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              {/* Club initial */}
              <text x="60" y="80" textAnchor="middle" fontSize="18" fontWeight="900"
                fontFamily="Barlow Condensed, sans-serif" fill="rgba(255,255,255,0.25)" letterSpacing="2">
                {(typeof jersey.club === 'object' ? jersey.club.name : jersey.club)?.split(' ').map(w=>w[0]).join('').slice(0,3)}
              </text>
            </svg>
            <span style={{
              fontFamily:'var(--font-display)', fontSize:10,
              letterSpacing:'2px', textTransform:'uppercase',
              color:'rgba(255,255,255,0.2)',
            }}>{typeof jersey.club === 'object' ? jersey.club.name : jersey.club}</span>
          </div>
        )}

        {/* Badges */}
        <div style={{ position:'absolute', top:12, left:12, display:'flex', flexDirection:'column', gap:6 }}>
          {jersey.badge === 'New'   && <span className="badge badge-red">New</span>}
          {jersey.badge === 'Hot'   && <span className="badge" style={{background:'var(--gold)',color:'var(--black)'}}>🔥 Hot</span>}
          {jersey.badge === 'Retro' && <span className="badge" style={{background:'#333',color:'white',border:'1px solid #555'}}>Retro</span>}
          {jersey.badge === 'Sale'  && <span className="badge badge-gold">Sale -{discount}%</span>}
        </div>

        {/* Wishlist */}
        <button style={{
          position:'absolute', top:12, right:12,
          width:32, height:32, borderRadius:'50%',
          background:'rgba(0,0,0,0.7)', border:'1px solid var(--border)',
          color:'var(--muted)', cursor:'pointer', display:'flex',
          alignItems:'center', justifyContent:'center', fontSize:16,
          transition:'all 0.2s',
        }} onClick={e => e.preventDefault()}>♡</button>

        {/* Quick add overlay */}
        <div style={{
          position:'absolute', bottom:0, left:0, right:0,
          background:'linear-gradient(to top, rgba(0,0,0,0.95), transparent)',
          padding:'20px 14px 14px',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.3s var(--ease)',
        }}>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:8 }}>
            {['S','M','L','XL'].map(sz => (
              <button key={sz}
                onClick={e => { e.preventDefault(); e.stopPropagation(); setSelectedSize(sz) }}
                className={`size-btn ${selectedSize === sz ? 'active' : ''} ${!availSizes.includes(sz) ? 'disabled' : ''}`}
                style={{ minWidth:34, height:34, fontSize:11 }}
              >{sz}</button>
            ))}
          </div>
        </div>
      </Link>

      {/* Body */}
      <div style={{ padding:'16px', flex:1, display:'flex', flexDirection:'column', gap:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
          <span style={{
            fontFamily:'var(--font-display)', fontSize:10,
            fontWeight:700, letterSpacing:'2px', textTransform:'uppercase',
            color: (typeof jersey.club === 'object' ? jersey.club.name : jersey.club) === 'Nigeria' ? 'var(--green-stock)' : 'var(--red)',
          }}>{typeof jersey.club === 'object' ? jersey.club.name : jersey.club}</span>
          <span className={stock.cls} style={{ fontSize:10 }}>{stock.label}</span>
        </div>

        <Link to={`/shop/${jersey.slug}`} style={{
          fontFamily:'var(--font-display)', fontSize:17, fontWeight:800,
          color:'var(--white)', textDecoration:'none', lineHeight:1.2,
          marginBottom:10, textTransform:'uppercase', letterSpacing:'0.5px',
          transition:'color 0.2s',
          display:'block',
        }}
        onMouseEnter={e=>e.target.style.color='var(--red)'}
        onMouseLeave={e=>e.target.style.color='var(--white)'}>
          {jersey.title}
        </Link>

        {/* Rating */}
        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:12 }}>
          <div style={{ display:'flex', gap:2, color:'var(--gold)' }}>
            {[...Array(5)].map((_,i)=><FiStar key={i} size={11} fill={i < Math.floor(jersey.rating) ? 'currentColor':'none'}/>)}
          </div>
          <span style={{ fontSize:11, color:'var(--muted)' }}>({jersey.reviews})</span>
        </div>

        {/* Price + CTA */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'auto', paddingTop:12, borderTop:'1px solid var(--border)' }}>
          <div>
            {hasOld && <div className="price-old">{formatPrice(jersey.old_price)}</div>}
            <div className="price" style={{ fontSize:22, color: hasOld ? 'var(--red)' : 'var(--white)' }}>
              {formatPrice(jersey.price)}
            </div>
          </div>
          <button
            onClick={handleCart}
            className="btn btn-sm"
            style={{
              background: selectedSize ? 'var(--red)' : 'var(--dark3)',
              color: 'white',
              border: `1px solid ${selectedSize ? 'var(--red)' : 'var(--border)'}`,
              clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
              transition: 'all 0.3s',
              fontSize:11,
            }}
          >
            {selectedSize ? 'Add to Cart' : 'Select Size'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Home Page ───────────────────────────────── */
export default function Home() {
  const [tiktokVideos, setTiktokVideos] = useState([])
  const [loadingTiktok, setLoadingTiktok] = useState(true)

  useEffect(() => {
    const fetchTiktok = async () => {
      try {
        const res = await api.get('/api/brand/tiktok/')
        setTiktokVideos(res.data.results || res.data)
      } catch (err) {
        console.error('Failed to fetch TikTok videos', err)
      } finally {
        setLoadingTiktok(false)
      }
    }
    fetchTiktok()
  }, [])
  const [jerseys, setJerseys] = useState([])
  const [clubs, setClubs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [resJ, resC] = await Promise.all([
          api.get('/api/jerseys/featured/'),
          api.get('/api/jerseys/clubs/')
        ])
        setJerseys(resJ.data)
        setClubs(resC.data)
      } catch (err) {
        console.error('Failed to fetch home data', err)
        setJerseys(STATIC_JERSEYS)
        setClubs(STATIC_CLUBS)
      } finally {
        setLoading(false)
      }
    }
    fetchHomeData()
  }, [])

  const featured   = jerseys.filter(j => j.is_featured).slice(0, 4)
  const newArrival = jerseys.filter(j => j.badge === 'New').slice(0, 8)

  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="loader" /></div>

  return (
    <div style={{ background:'var(--black)' }}>

      {/* ══ ADEKUNLE FLIP CARD ══════════════════ */}
      <section style={{
        padding: '60px 20px',
        background: 'var(--black)',
        borderBottom: '1px solid rgba(232,0,30,0.1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 40,
        flexWrap: 'wrap'
      }}>
        {/* 3D Flip Card */}
        <style>{`
          .flip-card {
            width: 280px;
            height: 380px;
            perspective: 1000px;
            cursor: pointer;
            flex-shrink: 0;
          }
          .flip-card-inner {
            position: relative;
            width: 100%;
            height: 100%;
            transition: transform 0.8s cubic-bezier(0.455, 0.03, 0.515, 0.955);
            transform-style: preserve-3d;
          }
          .flip-card-inner.is-flipped {
            transform: rotateY(180deg);
          }
          @media (hover: hover) {
            .flip-card:hover .flip-card-inner {
              transform: rotateY(180deg);
            }
          }
          .flip-card-front, .flip-card-back {
            position: absolute;
            inset: 0;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            transform-style: preserve-3d;
            -webkit-transform-style: preserve-3d;
            border-radius: 20px;
            overflow: hidden;
          }
          .flip-card-front {
            transform: translateZ(1px);
            -webkit-transform: translateZ(1px);
          }
          .flip-card-back {
            transform: rotateY(180deg) translateZ(1px);
            -webkit-transform: rotateY(180deg) translateZ(1px);
          }
          @keyframes borderGlow {
            0%, 100% { box-shadow: 0 0 20px rgba(232,0,30,0.3), 0 0 60px rgba(232,0,30,0.1); }
            50%       { box-shadow: 0 0 40px rgba(232,0,30,0.6), 0 0 80px rgba(232,0,30,0.2); }
          }
          @keyframes rotateBg {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
          .flip-card-front {
            animation: borderGlow 3s ease-in-out infinite;
          }
          @media (max-width: 768px) {
            .tiktok-scroll-item {
              min-width: 180px !important;
            }
            .tiktok-video-thumbnail {
              height: 280px !important;
            }
          }
        `}</style>

        <div className="flip-card" onClick={(e) => {
          const inner = e.currentTarget.querySelector('.flip-card-inner');
          inner.classList.toggle('is-flipped');
        }}>
          <div className="flip-card-inner">
            {/* FRONT - Man United Jersey */}
            <div className="flip-card-front" style={{
              background: 'linear-gradient(160deg, #1a0000, #0d0000)',
              border: '1px solid rgba(232,0,30,0.3)',
            }}>
              {/* React Bit rotating background */}
              <div style={{
                position: 'absolute',
                top: '-50%', left: '-50%', width: '200%', height: '200%',
                background: 'conic-gradient(from 0deg, transparent 0%, rgba(232,0,30,0.2) 20%, transparent 40%, rgba(232,0,30,0.05) 60%, transparent 80%)',
                animation: 'rotateBg 10s linear infinite',
                pointerEvents: 'none', zIndex: 0
              }}/>
              <img
                src="/jerseys/man-united-front.png"
                alt="Manchester United Jersey"
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  position: 'relative', zIndex: 1,
                  transition: 'transform 0.4s ease',
                }}
              />
              {/* Hover hint text */}
              <div style={{
                position: 'absolute', bottom: 12, left: 0, right: 0,
                textAlign: 'center', zIndex: 2,
                fontFamily: 'var(--font-display)', fontSize: 10,
                letterSpacing: '2px', color: 'rgba(255,255,255,0.5)',
                textTransform: 'uppercase'
              }}>hover to flip ↻</div>
            </div>

            {/* BACK - Adekunle TV branded card */}
            <div className="flip-card-back" style={{
              background: 'linear-gradient(160deg, #1a0000, #0a0000)',
              border: '1px solid rgba(232,0,30,0.5)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              position: 'relative', overflow: 'hidden'
            }}>
              {/* Rotating glow */}
              <div style={{
                position: 'absolute',
                top: '-50%', left: '-50%', width: '200%', height: '200%',
                background: 'conic-gradient(from 0deg, transparent 0%, rgba(232,0,30,0.25) 25%, transparent 50%)',
                animation: 'rotateBg 8s linear infinite',
                pointerEvents: 'none'
              }}/>
              <img
                src="/jerseys/man-united-back.png"
                alt="Adekunle TV Jersey Back"
                style={{
                  width: '100%', height: '60%', objectFit: 'cover',
                  position: 'relative', zIndex: 1,
                  borderBottom: '1px solid rgba(232,0,30,0.3)'
                }}
              />
              <div style={{
                position: 'relative', zIndex: 1,
                padding: '20px', textAlign: 'center'
              }}>
                <p style={{
                  fontFamily: 'var(--font-display)', fontSize: 20,
                  fontWeight: 900, color: 'var(--white)',
                  textTransform: 'uppercase', letterSpacing: '2px',
                  margin: '0 0 6px', lineHeight: 1.1
                }}>Adekunle TV</p>
                <p style={{
                  color: 'var(--gold)', fontFamily: 'var(--font-display)',
                  fontSize: 13, fontWeight: 800, letterSpacing: '3px',
                  textTransform: 'uppercase', margin: 0
                }}>Olori Odo 001</p>
              </div>
            </div>
          </div>
        </div>

        {/* Text beside the card */}
        <div style={{ maxWidth: 360, zIndex: 1 }}>
          <p className="section-eyebrow">Meet the Founder</p>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,6vw,52px)',
            fontWeight: 900, color: 'var(--white)', margin: '0 0 12px',
            textTransform: 'uppercase', lineHeight: 1
          }}>Adekunle TV</h2>
          <p style={{
            color: 'var(--gold)', fontFamily: 'var(--font-display)',
            fontSize: 14, fontWeight: 800, letterSpacing: '4px',
            textTransform: 'uppercase', margin: '0 0 16px'
          }}>Olori Odo 001</p>
          <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.7, margin: '0 0 24px' }}>
            Nigeria's #1 jersey dealer. Bringing authentic, original-quality football jerseys straight to your doorstep. From Man United to Super Eagles — if it exists, we've got it.
          </p>
          <a href="/shop" className="btn btn-red" style={{ textDecoration: 'none' }}>
            <span>Shop Now</span>
          </a>
        </div>
      </section>

      {/* ══ HERO ══════════════════════════════ */}
      <section style={{
        minHeight: '94vh', position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center',
        background: 'var(--black)',
      }}>
        {/* Background pattern */}
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 79px, rgba(232,0,30,0.04) 80px),
            repeating-linear-gradient(90deg, transparent, transparent 79px, rgba(232,0,30,0.04) 80px)
          `,
        }}/>
        {/* Red glow */}
        <div style={{
          position:'absolute', right:'-10%', top:'20%',
          width:'60vh', height:'60vh', borderRadius:'50%',
          background:'radial-gradient(circle, rgba(232,0,30,0.12) 0%, transparent 70%)',
          pointerEvents:'none',
        }}/>
        {/* Giant background text */}
        <div style={{
          position:'absolute', right:'-20px', top:'50%',
          transform:'translateY(-50%)',
          fontFamily:'var(--font-display)', fontWeight:900, fontSize:'clamp(120px,18vw,280px)',
          color:'rgba(232,0,30,0.04)', lineHeight:1,
          userSelect:'none', pointerEvents:'none', letterSpacing:'-10px',
          textTransform:'uppercase',
        }}>JERSEYS</div>

        <div className="container" style={{ position:'relative', zIndex:2, paddingTop:40, paddingBottom:40 }}>
          <div className="hero-grid">

            {/* Left */}
            <div>
              <div className="section-eyebrow animate-in d1">
                Nigeria's #1 Jersey Store
              </div>

              <h1 style={{ marginBottom:0 }}>
                <div className="animate-in d2" style={{
                  fontFamily:'var(--font-display)', fontWeight:900,
                  fontSize:'clamp(52px, 8vw, 100px)',
                  textTransform:'uppercase', lineHeight:0.9,
                  color:'var(--white)', letterSpacing:'-2px',
                }}>YOUR CLUB.</div>
                <div className="animate-in d3" style={{
                  fontFamily:'var(--font-display)', fontWeight:900,
                  fontSize:'clamp(52px, 8vw, 100px)',
                  textTransform:'uppercase', lineHeight:0.9,
                  letterSpacing:'-2px',
                  background:'linear-gradient(135deg, var(--red-light), var(--red), var(--red-dark))',
                  WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                }}>YOUR JERSEY.</div>
                <div className="animate-in d4" style={{
                  fontFamily:'var(--font-display)', fontWeight:900,
                  fontSize:'clamp(52px, 8vw, 100px)',
                  textTransform:'uppercase', lineHeight:0.9,
                  color:'var(--white)', letterSpacing:'-2px',
                }}>DELIVERED.</div>
              </h1>

              <p className="animate-in d5" style={{
                fontSize:16, color:'var(--muted)', fontWeight:400,
                lineHeight:1.7, maxWidth:440, margin:'28px 0 36px',
              }}>
                Original & affordable football jerseys for all clubs.
                Trusted by 3,200+ football fans across Nigeria.
                Nationwide delivery in 24–48 hours.
              </p>

              <div className="animate-in d6" style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
                <Link to="/shop" className="btn btn-red btn-lg">
                  <span>Shop Now</span>
                  <FiArrowRight size={18}/>
                </Link>
                <Link to="/shop?category=national" className="btn btn-outline btn-lg">
                  Nigeria Jerseys 🇳🇬
                </Link>
              </div>

              {/* Trust row */}
              <div style={{
                display:'flex', gap:24, marginTop:48,
                paddingTop:32, borderTop:'1px solid var(--border)',
                flexWrap:'wrap',
              }}>
                {[
                  { icon:<FiTruck size={16}/>,   text:'24–48hr Delivery' },
                  { icon:<FiShield size={16}/>,  text:'100% Original' },
                  { icon:<FiStar size={16}/>,    text:'4.9/5 Rating' },
                ].map(({ icon, text }) => (
                  <div key={text} style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ color:'var(--red)' }}>{icon}</span>
                    <span style={{ fontSize:13, color:'var(--muted)', fontWeight:500 }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Featured jersey showcase */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, position:'relative' }}>
              {/* Big featured card */}
              <div style={{
                gridColumn:'1/-1',
                background:'var(--dark2)',
                border:'1px solid var(--border-red)',
                borderRadius:12, padding:28,
                display:'flex', alignItems:'center', gap:24,
                boxShadow:'0 0 60px rgba(232,0,30,0.15)',
                position:'relative', overflow:'hidden',
              }}>
                <div style={{
                  position:'absolute', top:0, left:0, right:0, height:2,
                  background:'linear-gradient(90deg, transparent, var(--red), transparent)',
                }}/>
                <div style={{
                  width:100, height:120, flexShrink:0,
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  <svg viewBox="0 0 120 130" style={{ width:90, filter:'drop-shadow(0 8px 30px rgba(232,0,30,0.5))' }}>
                    <path d="M20 35 L8 55 L28 60 L28 120 L92 120 L92 60 L112 55 L100 35 L80 28 Q60 15 40 28 Z"
                      fill="#C8102E" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
                    <path d="M42 28 Q60 40 78 28 Q72 18 60 16 Q48 18 42 28 Z" fill="rgba(0,0,0,0.4)"/>
                    <text x="60" y="82" textAnchor="middle" fontSize="14" fontWeight="900"
                      fontFamily="Barlow Condensed" fill="rgba(255,255,255,0.3)">MAN UTD</text>
                  </svg>
                </div>
                <div>
                  <span style={{ fontSize:10, color:'var(--red)', fontFamily:'var(--font-display)', letterSpacing:'3px', textTransform:'uppercase' }}>Featured</span>
                  <h3 style={{ fontSize:22, marginTop:4, marginBottom:6, textTransform:'uppercase' }}>
                    Man United<br/>Home 2025/26
                  </h3>
                  <div className="price" style={{ fontSize:28, color:'var(--red)' }}>₦15,000</div>
                  <Link to="/shop/man-united-home-2025" className="btn btn-red btn-sm" style={{ marginTop:12 }}>
                    Order Now
                  </Link>
                </div>
                <span className="badge badge-red" style={{ position:'absolute', top:16, right:16 }}>New Arrival</span>
              </div>

              {/* Mini cards */}
              {jerseys.slice(1, 4).map(j => {
                const img = j.primary_image || (j.images?.[0]?.image) || (typeof j.images?.[0] === 'string' ? j.images[0] : null);
                return (
                  <Link key={j.id} to={`/shop/${j.slug}`} style={{
                    background:'var(--dark2)', border:'1px solid var(--border)',
                    borderRadius:10, padding:16, textDecoration:'none',
                    transition:'all 0.3s',
                    display:'flex', flexDirection:'column'
                  }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(232,0,30,0.4)';e.currentTarget.style.transform='translateY(-4px)'}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform='translateY(0)'}}>
                    <div style={{height:80, background:'var(--dark3)', borderRadius:6, marginBottom:10, overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center'}}>
                      {img ? <img src={img} style={{width:'100%', height:'100%', objectFit:'cover'}}/> : '👕'}
                    </div>
                    <div style={{ fontSize:10, color:'var(--red)', fontFamily:'var(--font-display)', letterSpacing:'2px', marginBottom:4 }}>{j.club_name || (typeof j.club === 'object' ? j.club.name : j.club)}</div>
                    <div style={{ fontFamily:'var(--font-display)', fontSize:13, fontWeight:800, color:'var(--white)', textTransform:'uppercase', lineHeight:1.2, marginBottom:8 }}>{j.title.split(' ').slice(0,3).join(' ')}</div>
                    <div className="price" style={{ fontSize:18, color: j.old_price ? 'var(--red)' : 'var(--white)', marginTop:'auto' }}>{formatPrice(j.price)}</div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══ STATS BAR ════════════════════════ */}
      <div style={{
        background:'var(--red)',
        padding:'0',
      }}>
        <div className="container">
          <div className="grid-stats">
            {Object.entries(STATS).map(([key, val]) => (
              <div key={key} style={{
                padding:'24px 20px', textAlign:'center',
                borderRight:'1px solid rgba(255,255,255,0.15)',
              }}>
                <div style={{
                  fontFamily:'var(--font-display)', fontWeight:900,
                  fontSize:36, color:'white', lineHeight:1,
                }}>{val}</div>
                <div style={{
                  fontSize:11, color:'rgba(255,255,255,0.7)',
                  fontFamily:'var(--font-display)', letterSpacing:'2px',
                  textTransform:'uppercase', marginTop:4,
                }}>{key.replace(/_/g,' ')}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ CLUBS ════════════════════════════ */}
      <section className="section">
        <div className="container">
          <p className="section-eyebrow">Shop by Club</p>
          <h2 className="section-title" style={{ marginBottom:40 }}>
            Your Favourite Club.<br/>
            <span className="red-gradient">We Have the Jersey.</span>
          </h2>
          <div className="grid-3" style={{ marginTop: 40 }}>
            {clubs.slice(0, 3).map(club => (
              <Link key={club.id} to={`/shop?club=${encodeURIComponent(club.name)}`}
                className="premium-hover"
                style={{
                  background:'var(--dark2)',
                  border:'1px solid var(--border)',
                  borderRadius:12,
                  padding:'32px 20px',
                  textAlign:'center',
                  textDecoration:'none',
                  display:'flex', flexDirection:'column',
                  alignItems:'center', gap:10,
                }}
              >
                <div style={{ position:'relative', width: 80, height: 80, marginBottom:8, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <img
                    src={club.jersey || club.logo || club.icon}
                    alt={club.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))',
                    }}
                  />
                </div>
                <div style={{
                  fontFamily:'var(--font-display)',
                  fontSize:16, fontWeight:800,
                  color:'var(--white)', textTransform:'uppercase',
                  letterSpacing:'1px', lineHeight:1.2,
                }}>{club.name}</div>
                <div style={{
                  fontSize:11, color:'var(--muted)',
                  fontFamily:'var(--font-display)', letterSpacing:'1px',
                }}>{club.country}</div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/clubs" className="btn btn-outline">Explore All Clubs <FiArrowRight size={14}/></Link>
          </div>
        </div>
      </section>

      {/* ══ FEATURED JERSEYS ════════════════ */}
      <section className="section section-dark">
        <div className="container">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:40, flexWrap:'wrap', gap:16 }}>
            <div>
              <p className="section-eyebrow">Hand-Picked Selection</p>
              <h2 className="section-title">
                Featured<br/>
                <span className="red-gradient">Jerseys</span>
              </h2>
            </div>
            <Link to="/shop" className="btn btn-outline">View All <FiArrowRight size={14}/></Link>
          </div>
          <div className="grid-4">
            {featured.map(j => <JerseyCard key={j.id} jersey={j}/>)}
          </div>
        </div>
      </section>

      {/* ══ NIGERIA BANNER ══════════════════ */}
      <section style={{
        padding:'80px 0', position:'relative', overflow:'hidden',
        background:'linear-gradient(135deg, #004020 0%, #006030 50%, #004020 100%)',
        borderTop:'1px solid rgba(255,255,255,0.1)',
        borderBottom:'1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          backgroundImage:'repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 20px)',
        }}/>
        <div style={{
          position:'absolute', right:'-5%', top:'50%', transform:'translateY(-50%)',
          fontSize:'clamp(80px,15vw,200px)', opacity:0.08,
          fontFamily:'var(--font-display)', fontWeight:900,
          userSelect:'none', pointerEvents:'none',
        }}>🇳🇬</div>
        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <div className="grid-nigeria">
            <div>
              <p className="section-eyebrow" style={{ '--red':'#FFD700' }}>
                <span style={{ color:'#FFD700' }}>Nigeria Collection</span>
              </p>
              <h2 style={{
                fontFamily:'var(--font-display)', fontWeight:900,
                fontSize:'clamp(40px,6vw,80px)', textTransform:'uppercase',
                color:'white', lineHeight:0.95, marginBottom:20,
              }}>
                SUPER EAGLES<br/>
                <span style={{ color:'#FFD700' }}>JERSEY COLLECTION</span>
              </h2>
              <p style={{ fontSize:16, color:'rgba(255,255,255,0.7)', lineHeight:1.7, marginBottom:32 }}>
                From the iconic 1994 World Cup retro to the latest AFCON 2025 kit —
                wear the pride of Nigeria. Every Naira supports Nigerian football culture.
              </p>
              <Link to="/shop?club=Nigeria" className="btn btn-white btn-lg">
                Shop Nigeria Jerseys 🇳🇬
              </Link>
            </div>
            <div className="grid-nigeria-collection">
              {jerseys.filter(j => (typeof j.club === 'object' ? j.club.name : j.club) === 'Nigeria').slice(0, 3).map(j => (
                <Link key={j.id} to={`/shop/${j.slug}`} className="premium-hover" style={{
                  background:'rgba(255,255,255,0.08)',
                  border:'1px solid rgba(255,255,255,0.15)',
                  borderRadius:10, padding:20, textDecoration:'none',
                  display: 'flex', flexDirection: 'column'
                }}>
                  <div style={{ textAlign:'center', marginBottom:12, fontSize:48 }}>🇳🇬</div>
                  <div style={{ fontFamily:'var(--font-display)', fontSize:14, fontWeight:800, color:'white', textTransform:'uppercase', lineHeight:1.2, marginBottom:8 }}>{j.title}</div>
                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <div className="price" style={{ fontSize:18, color:'#FFD700' }}>{formatPrice(j.price)}</div>
                      {j.old_price && <span style={{ fontSize:11, color:'rgba(255,255,255,0.5)', textDecoration:'line-through' }}>{formatPrice(j.old_price)}</span>}
                    </div>
                    <span className="badge" style={{ background:'#FFD700', color:'#000', marginTop:10, display:'inline-flex' }}>{j.badge || 'Shop Now'}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ NEW ARRIVALS ════════════════════ */}
      <section className="section">
        <div className="container">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:40, flexWrap:'wrap', gap:16 }}>
            <div>
              <p className="section-eyebrow">Just Dropped</p>
              <h2 className="section-title">
                New<br/>
                <span className="red-gradient">Arrivals</span>
              </h2>
            </div>
            <Link to="/shop?filter=new" className="btn btn-outline">All New Arrivals <FiArrowRight size={14}/></Link>
          </div>
          <div className="grid-4">
            {newArrival.slice(0,8).map(j => <JerseyCard key={j.id} jersey={j}/>)}
          </div>
        </div>
      </section>

      {/* ══ TIKTOK SECTION ══════════════════ */}
      <section className="section section-dark">
        <div className="container">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:48, flexWrap:'wrap', gap:20 }}>
            <div>
              <p className="section-eyebrow">Follow the Journey</p>
              <h2 className="section-title">
                Watch Adekunle TV<br/>
                <span className="red-gradient">On TikTok</span>
              </h2>
            </div>
            <a href="https://tiktok.com/@adekunle_tv5" target="_blank" rel="noopener noreferrer"
              className="btn btn-outline">
              @adekunle_tv5 <FiArrowRight size={14}/>
            </a>
          </div>
          <div className="native-h-scroll">
            {tiktokVideos.length > 0 ? tiktokVideos.map((v,i)=>(
              <a key={v.id} href={v.url} target="_blank" rel="noopener noreferrer"
                className="tiktok-scroll-item premium-hover"
                style={{
                  background:'var(--dark2)', border:'1px solid var(--border)',
                  borderRadius:10, overflow:'hidden', textDecoration:'none',
                  display:'block', minWidth: 260
                }}>
                {/* Video thumbnail */}
                <div className="tiktok-video-thumbnail" style={{
                  aspectRatio:'9/14', background:`linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.6)), url(${v.thumbnail || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&auto=format&fit=crop&q=80'}) center/cover`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  position:'relative', flexDirection:'column', gap:8, height: 350
                }}>
                  <div style={{
                    width:52, height:52, borderRadius:'50%',
                    background:'rgba(232,0,30,0.9)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    transition:'transform 0.2s',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.4)'
                  }}>
                    <FiPlay size={22} fill="white" style={{marginLeft:3}}/>
                  </div>
                  <span style={{ fontSize:11, color:'var(--white)', fontWeight:600, textShadow:'0 2px 4px rgba(0,0,0,0.8)' }}>👁 {v.views}</span>
                  <span style={{
                    position:'absolute', top:10, left:10,
                    fontSize:9, color:'white',
                    background:'rgba(0,0,0,0.7)', padding:'2px 6px', borderRadius:2,
                    fontFamily:'var(--font-display)', letterSpacing:'1px',
                  }}>@adekunle_tv5</span>
                </div>
                <div style={{ padding:'12px 14px' }}>
                  <p style={{ fontSize:12, color:'var(--off-white)', lineHeight:1.5, marginBottom:8, height: 36, overflow: 'hidden' }}>{v.title}</p>
                  <div style={{ display:'flex', gap:12, fontSize:11, color:'var(--muted)' }}>
                    <span>❤️ {v.likes}</span>
                    <span>👁 {v.views}</span>
                  </div>
                </div>
              </a>
            )) : (
              <p style={{ color: 'var(--muted)', fontSize: 13 }}>No TikTok videos yet. Add some in the admin panel!</p>
            )}
          </div>

          {/* Watch on TikTok CTA */}
          <div style={{
            marginTop: 40, textAlign: 'center',
            padding: '32px 24px',
            background: 'linear-gradient(135deg, rgba(232,0,30,0.08), rgba(0,0,0,0))',
            border: '1px solid rgba(232,0,30,0.2)',
            borderRadius: 16,
          }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--muted)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12 }}>
              🎥 300K+ Views • Jersey Reviews • Behind the Scenes
            </p>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,4vw,36px)', color: 'var(--white)', textTransform: 'uppercase', margin: '0 0 20px', fontWeight: 900 }}>
              Watch Adekunle TV on TikTok
            </h3>
            <a
              href="https://www.tiktok.com/@adekunle_tv5"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-red btn-lg"
              style={{ textDecoration: 'none', display: 'inline-flex', gap: 10, alignItems: 'center' }}
            >
              <span style={{ fontSize: 18 }}>🎵</span>
              <span>@adekunle_tv5</span>
              <FiArrowRight size={16}/>
            </a>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ════════════════════ */}
      <section className="section">
        <div className="container">
          <p className="section-eyebrow">Real Buyers</p>
          <h2 className="section-title" style={{ marginBottom:48 }}>
            What Our Customers<br/>
            <span className="red-gradient">Are Saying</span>
          </h2>
          <div className="grid-testimonials">
            {TESTIMONIALS.slice(0,2).map(t => (
              <div key={t.id} style={{
                background:'var(--dark2)',
                border:'1px solid var(--border)',
                borderRadius:10, padding:24,
                transition:'all 0.3s',
              }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(232,0,30,0.35)';e.currentTarget.style.transform='translateY(-4px)'}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform='translateY(0)'}}>
                <div style={{ display:'flex', gap:2, color:'var(--gold)', marginBottom:16 }}>
                  {[...Array(t.rating)].map((_,i)=><FiStar key={i} size={14} fill="currentColor"/>)}
                </div>
                <p style={{ fontSize:14, color:'var(--off-white)', lineHeight:1.7, marginBottom:20, fontStyle:'italic' }}>
                  "{t.text}"
                </p>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <p style={{ fontSize:13, fontWeight:700, color:'var(--white)', fontFamily:'var(--font-display)', textTransform:'uppercase', letterSpacing:'1px' }}>{t.name}</p>
                    <p style={{ fontSize:11, color:'var(--muted)' }}>{t.city}</p>
                  </div>
                  <span style={{ fontSize:10, color:'var(--red)', fontFamily:'var(--font-display)', letterSpacing:'1px', background:'var(--red-subtle)', padding:'3px 8px', borderRadius:2 }}>{t.jersey.split(' ').slice(0,2).join(' ')}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/about" className="btn btn-outline">Read All Reviews <FiArrowRight size={14}/></Link>
          </div>
        </div>
      </section>

      {/* ══ CTA BANNER ══════════════════════ */}
      <section style={{
        padding:'80px 0', background:'var(--red)',
        position:'relative', overflow:'hidden',
      }}>
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          backgroundImage:'repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 1px, transparent 1px, transparent 20px)',
        }}/>
        <div style={{
          position:'absolute', right:'-80px', top:'-80px',
          width:400, height:400, borderRadius:'50%',
          background:'rgba(255,255,255,0.06)', pointerEvents:'none',
        }}/>
        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:40, flexWrap:'wrap' }}>
            <div>
              <h2 style={{
                fontFamily:'var(--font-display)', fontWeight:900,
                fontSize:'clamp(32px,5vw,64px)', color:'white',
                textTransform:'uppercase', lineHeight:0.95, marginBottom:12,
              }}>
                Can't Find Your<br/>Jersey?
              </h2>
              <p style={{ fontSize:16, color:'rgba(255,255,255,0.8)', lineHeight:1.6, maxWidth:480 }}>
                We source jerseys from all clubs and all eras. Tell us what you want — we will get it for you.
                Message Adekunle TV on WhatsApp now.
              </p>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:14, flexShrink:0 }}>
              <a href="https://wa.me/2348000000000?text=Hello%20Adekunle%20TV!%20I%20want%20to%20order%20a%20jersey."
                target="_blank" rel="noopener noreferrer"
                className="btn btn-white btn-lg">
                WhatsApp Us Now
              </a>
              <Link to="/shop" className="btn btn-outline btn-lg" style={{ borderColor:'rgba(255,255,255,0.5)', color:'white' }}>
                Browse Full Shop
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ NEWSLETTER ══════════════════════ */}
      <section className="section section-dark">
        <div className="container" style={{ maxWidth:700, textAlign:'center' }}>
          <p className="section-eyebrow" style={{ justifyContent:'center' }}>
            Stay Updated
          </p>
          <h2 className="section-title" style={{ marginBottom:14 }}>
            New Jerseys Drop<br/>
            <span className="red-gradient">Every Week</span>
          </h2>
          <p style={{ fontSize:15, color:'var(--muted)', marginBottom:32, lineHeight:1.7 }}>
            Join 5,000+ subscribers who get first access to new arrivals and exclusive deals before anyone else.
          </p>
          <NewsletterForm />
        </div>
      </section>

    </div>
  )
}

function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [done, setDone]   = useState(false)
  return done ? (
    <p style={{ color:'var(--green-stock)', fontSize:16, fontWeight:600 }}>
      ✅ You're in! Watch your inbox for new drops.
    </p>
  ) : (
    <form onSubmit={e=>{e.preventDefault();if(email)setDone(true)}}
      style={{ display:'flex', gap:12, maxWidth:480, margin:'0 auto', flexWrap:'wrap' }}>
      <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
        placeholder="Enter your email address"
        className="form-input" required
        style={{ flex:1, minWidth:220 }}/>
      <button type="submit" className="btn btn-red" style={{ flexShrink:0 }}>
        Subscribe
      </button>
    </form>
  )
}