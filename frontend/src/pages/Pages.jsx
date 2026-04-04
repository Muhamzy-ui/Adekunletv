import { useState, useMemo, useRef, useEffect } from 'react'
import { Link, useSearchParams, useParams, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { 
  FiFilter, FiX, FiSearch, FiGrid, FiList, FiStar, FiShoppingCart,
  FiArrowLeft, FiMessageCircle, FiTruck, FiShield,
  FiLogOut, FiPackage, FiShoppingBag, FiFileText, FiPlus, FiEdit2, FiTrash2, FiUpload,
  FiUser, FiMail, FiMapPin, FiPhone, FiCalendar, FiCreditCard
} from 'react-icons/fi'
import { JERSEYS as STATIC_JERSEYS, CLUBS as STATIC_CLUBS, CATEGORIES as STATIC_CATEGORIES, formatPrice, getStockStatus } from '../utils/data'
import { useCart } from '../context/CartContext'
import api from '../utils/api'
import toast from 'react-hot-toast'

const SideLabel = ({ children }) => (
  <p style={{
    fontSize: 11, fontFamily: 'var(--font-display)', fontWeight: 700, 
    letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted)',
    marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8
  }}>
    {children}
    <span style={{flex:1, height:1, background:'var(--border)', opacity:0.5}}/>
  </p>
)

const getImageUrl = (url) => {
  if (!url) return null
  if (url.startsWith('http')) return url
  // Handle relative paths from backend
  const base = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
  return `${base.replace(/\/$/, '')}${url.startsWith('/') ? url : '/' + url}`
}

function ShopJerseyCard({ jersey }) {
  const { addItem } = useCart()
  const [size, setSize] = useState('')
  const stock = getStockStatus(jersey.sizes)
  const avail = Object.entries(jersey.sizes || {}).filter(([,v])=>v>0).map(([s])=>s)
  const hasOld = !!jersey.old_price

  // Fix image source: favor primary_image, then images[0].image, then images[0]
  const imageSrc = getImageUrl(jersey.primary_image || (jersey.images?.[0]?.image) || (typeof jersey.images?.[0] === 'string' ? jersey.images[0] : null))

  return (
    <div style={{background:'var(--dark2)',border:'1px solid var(--border)',borderRadius:8,overflow:'hidden',display:'flex',flexDirection:'column',transition:'all 0.3s'}}
      onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(232,0,30,0.4)';e.currentTarget.style.transform='translateY(-6px)';e.currentTarget.style.boxShadow='0 20px 50px rgba(0,0,0,0.6)'}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none'}}>
      {/* Image */}
      <Link to={`/shop/${jersey.slug}`} style={{height:240,background:'var(--dark3)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',flexDirection:'column',gap:8,textDecoration:'none',overflow:'hidden'}}>
        {imageSrc
          ? <img src={imageSrc} alt={jersey.title} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
          : <>
              <svg viewBox="0 0 120 130" style={{width:90,filter:'drop-shadow(0 4px 16px rgba(232,0,30,0.2))'}}>
                <path d="M20 35 L8 55 L28 60 L28 120 L92 120 L92 60 L112 55 L100 35 L80 28 Q60 15 40 28 Z"
                  fill={(typeof jersey.club === 'object' ? jersey.club.name : (jersey.club_name || jersey.club))==='Nigeria'?'#008751':(typeof jersey.club === 'object' ? jersey.club.name : (jersey.club_name || jersey.club))?.includes('United')||(typeof jersey.club === 'object' ? jersey.club.name : (jersey.club_name || jersey.club))==='Liverpool'||(typeof jersey.club === 'object' ? jersey.club.name : (jersey.club_name || jersey.club))==='Arsenal'?'#C8102E':(typeof jersey.club === 'object' ? jersey.club.name : (jersey.club_name || jersey.club))==='Chelsea'||(typeof jersey.club === 'object' ? jersey.club.name : (jersey.club_name || jersey.club))==='Man City'?'#034694':'#333'}
                  stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                <path d="M42 28 Q60 40 78 28 Q72 18 60 16 Q48 18 42 28 Z" fill="rgba(0,0,0,0.4)"/>
              </svg>
              <span style={{fontSize:9,color:'rgba(255,255,255,0.25)',fontFamily:'var(--font-display)',letterSpacing:'2px',textTransform:'uppercase'}}>{typeof jersey.club === 'object' ? jersey.club.name : (jersey.club_name || jersey.club)}</span>
            </>
        }
        <div style={{position:'absolute',top:10,left:10,display:'flex',gap:6,flexDirection:'column'}}>
          {jersey.badge==='New'   && <span className="badge badge-red">New</span>}
          {jersey.badge==='Hot'   && <span className="badge badge-gold">Hot</span>}
          {jersey.badge==='Retro' && <span className="badge" style={{background:'#333',color:'white',border:'1px solid #555'}}>Retro</span>}
          {jersey.badge==='Sale'  && <span className="badge badge-gold">Sale</span>}
        </div>
      </Link>
      {/* Body */}
      <div style={{padding:16,flex:1,display:'flex',flexDirection:'column'}}>
        <span style={{fontSize:9,color:'var(--red)',fontFamily:'var(--font-display)',letterSpacing:'2px',textTransform:'uppercase',marginBottom:4}}>{typeof jersey.club === 'object' ? jersey.club.name : (jersey.club_name || jersey.club)}</span>
        <Link to={`/shop/${jersey.slug}`} style={{fontFamily:'var(--font-display)',fontSize:16,fontWeight:800,color:'var(--white)',textDecoration:'none',textTransform:'uppercase',letterSpacing:'0.5px',lineHeight:1.2,marginBottom:8,transition:'color 0.2s',display:'block'}}
          onMouseEnter={e=>e.target.style.color='var(--red)'}
          onMouseLeave={e=>e.target.style.color='var(--white)'}>
          {jersey.title}
        </Link>
        <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:10}}>
          <div style={{display:'flex',gap:2,color:'var(--gold)'}}>
            {[...Array(5)].map((_,i)=><FiStar key={i} size={10} fill={i<Math.floor(jersey.rating)?'currentColor':'none'}/>)}
          </div>
          <span style={{fontSize:10,color:'var(--muted)'}}>({jersey.review_count || 0})</span>
          <span className={stock.cls} style={{fontSize:10,marginLeft:'auto'}}>{stock.label}</span>
        </div>
        {/* Sizes */}
        <div style={{display:'flex',gap:5,marginBottom:14,flexWrap:'wrap'}}>
          {['XS','S','M','L','XL','XXL'].map(sz=>(
            <button key={sz}
              onClick={()=>setSize(sz)}
              className={`size-btn ${size===sz?'active':''} ${!avail.includes(sz)?'disabled':''}`}
              style={{minWidth:32,height:30,fontSize:10,pointerEvents:avail.includes(sz)?'auto':'none'}}>
              {sz}
            </button>
          ))}
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:8,marginTop:'auto',paddingTop:12,borderTop:'1px solid var(--border)'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            {hasOld && <div className="price-old">{formatPrice(jersey.old_price)}</div>}
            <div className="price" style={{fontSize:20,color:hasOld?'var(--red)':'var(--white)'}}>{formatPrice(jersey.price)}</div>
          </div>
          <div style={{display:'flex',gap:8}}>
            <Link
              to={`/shop/${jersey.slug}`}
              className="btn btn-outline btn-sm"
              style={{flex:1,justifyContent:'center',fontSize:10,padding:'8px 0'}}>
              Details
            </Link>
            <button
              onClick={()=>{
                if(!size){toast.error('Pick a size first!');return}
                addItem(jersey,size)
                toast.success(`Added to cart!`)
              }}
              className="btn btn-red btn-sm"
              style={{flex:1,background:size?'var(--red)':'var(--dark3)',color:'white',border:`1px solid ${size?'var(--red)':'var(--border)'}`,fontSize:10,padding:'8px 0'}}>
              <FiShoppingCart size={12}/> {size?'Add':'Select'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Shop() {
  const [params] = useSearchParams()
  const [jerseys, setJerseys] = useState([])
  const [clubs, setClubs] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(params.get('search')||'')
  const [club, setClub] = useState(params.get('club')||'All')
  const [cat, setCat] = useState(params.get('category')||'All')
  const [sort, setSort] = useState('newest')
  const [minP, setMinP] = useState('')
  const [maxP, setMaxP] = useState('')
  const [showFilter, setShowFilter] = useState(false)

  // Sync state with Search Params when they change (e.g. Navigating from Navbar)
  useEffect(() => {
    setSearch(params.get('search') || '')
    setClub(params.get('club') || 'All')
    setCat(params.get('category') || 'All')
  }, [params])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resJ, resC, resCat] = await Promise.all([
          api.get('/api/jerseys/'),
          api.get('/api/jerseys/clubs/'),
          api.get('/api/jerseys/categories/')
        ])
        setJerseys(resJ.data.results || resJ.data)
        setClubs(resC.data)
        setCategories(resCat.data)
      } catch (err) {
        console.error('Failed to fetch shop data', err)
        setJerseys(STATIC_JERSEYS)
        setClubs(STATIC_CLUBS)
        setCategories(STATIC_CATEGORIES)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filtered = useMemo(()=>{
    let j = [...jerseys]
     if(search) j=j.filter(x=>{
       const cName = (x.club && typeof x.club === 'object') ? (x.club.name || '') : (x.club || '');
       return x.title?.toLowerCase().includes(search.toLowerCase())||cName.toLowerCase().includes(search.toLowerCase())
     })
     if(club!=='All') j=j.filter(x=>{
       const clubObj = (x.club && typeof x.club === 'object') ? x.club : { name: x.club_name || x.club || '', slug: x.club_slug || '' };
       const target = club.toLowerCase()
       return clubObj.name?.toLowerCase() === target || clubObj.slug?.toLowerCase() === target
     })
     if(cat!=='All') j=j.filter(x=>{
       const catObj = (x.category && typeof x.category === 'object') ? x.category : { name: x.category_name || x.category || '', slug: x.category_slug || '' };
       const target = cat.toLowerCase()
       return catObj.name?.toLowerCase() === target || catObj.slug?.toLowerCase() === target
     })
    if(minP) j=j.filter(x=>x.price>=Number(minP))
    if(maxP) j=j.filter(x=>x.price<=Number(maxP))
    if(sort==='price_asc') j.sort((a,b)=>a.price-b.price)
    if(sort==='price_desc') j.sort((a,b)=>b.price-a.price)
    if(sort==='popular') j.sort((a,b)=>b.reviews-a.reviews)
    return j
  },[search,club,cat,sort,minP,maxP])

  if (loading) return (
    <div style={{ height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <div className="loader" />
      <p style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '2px', color: 'var(--muted)', textTransform: 'uppercase' }}>Loading Store...</p>
    </div>
  )

  return (
    <div style={{minHeight:'100vh'}}>
      <div className="page-hero">
        <div className="container">
          <p className="section-eyebrow">All Jerseys</p>
          <h1 className="section-title">The Full Collection</h1>
          <p className="section-sub">{jerseys.length || 0}+ original jerseys. All clubs. All sizes. Nationwide delivery.</p>
        </div>
      </div>

      {/* MOBILE FILTER TOGGLE */}
      <div className="container" style={{ display: 'none', padding: '20px 16px 0' }} id="mobile-filter-bar">
        <button 
          onClick={() => setShowFilter(true)}
          style={{ width: '100%', padding: '12px', background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: 'var(--font-display)', fontSize: 13, textTransform: 'uppercase' }}
        >
          <FiFilter size={16} /> Filter & Sort
        </button>
      </div>

      <div className="container shop-layout" style={{padding:'40px clamp(16px,4vw,60px) 100px'}}>
        
        {/* SIDEBAR FILTER (Desktop) */}
        <aside className="shop-sidebar" style={{
          width: 260, flexShrink: 0,
          background: 'var(--dark2)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: 24,
          position: 'sticky',
          top: 100, // stick below navbar
          display: 'flex', flexDirection: 'column', gap: 24
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, textTransform: 'uppercase', margin: 0 }}>Filters</h3>
            <button onClick={()=>{setClub('All');setCat('All');setMinP('');setMaxP('');setSearch('')}} style={{ background: 'transparent', border: 'none', color: 'var(--red)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontWeight: 700 }}>Clear</button>
          </div>

          <div>
            <SideLabel>Categories</SideLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['All', ...categories.map(c=>c.name)].map(c => (
                <label key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer', color: cat === c ? 'var(--white)' : 'var(--muted)', transition: 'color 0.2s' }}>
                  <input type="radio" name="cat" value={c} checked={cat === c} onChange={e=>setCat(e.target.value)} style={{ accentColor: 'var(--red)' }} />
                  {c}
                </label>
              ))}
            </div>
          </div>

          <div style={{ width: '100%', height: 1, background: 'var(--border)' }} />

          <div>
            <SideLabel>Clubs</SideLabel>
            <select value={club} onChange={e=>setClub(e.target.value)} className="form-select" style={{ padding: '8px 12px', fontSize: 13 }}>
              <option value="All">All Clubs</option>
              {clubs.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>

          <div style={{ width: '100%', height: 1, background: 'var(--border)' }} />

          <div>
            <SideLabel>Price Range (NGN)</SideLabel>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="number" value={minP} onChange={e=>setMinP(e.target.value)} placeholder="Min" className="form-input" style={{ padding: '8px', fontSize: 13 }}/>
              <span style={{ color: 'var(--muted)' }}>-</span>
              <input type="number" value={maxP} onChange={e=>setMaxP(e.target.value)} placeholder="Max" className="form-input" style={{ padding: '8px', fontSize: 13 }}/>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT DIV */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Toolbar */}
          <div style={{display:'flex',gap:12,marginBottom:24,flexWrap:'wrap',alignItems:'center', justifyContent: 'space-between'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 16, flex: 1}}>
              <div style={{flex:1,minWidth:200,position:'relative', maxWidth: 400}}>
                <FiSearch size={15} style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--muted)',pointerEvents:'none'}}/>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search jerseys, clubs..." style={{width:'100%',background:'var(--dark2)',border:'1px solid var(--border)',borderRadius:4,padding:'11px 12px 11px 38px',color:'var(--white)',fontFamily:'var(--font-body)',fontSize:14,outline:'none'}}
                  onFocus={e=>e.target.style.borderColor='var(--red)'}
                  onBlur={e=>e.target.style.borderColor='var(--border)'}/>
              </div>
            </div>
            
            <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
              <span style={{fontSize:13,color:'var(--muted)'}}><span style={{color:'var(--red)',fontWeight:600}}>{filtered.length}</span> jerseys</span>
              <select value={sort} onChange={e=>setSort(e.target.value)} className="form-select" style={{width:180, padding: '10px 14px', fontSize: 13}}>
                <option value="newest">Newest First</option>
                <option value="price_asc">{'Price: Low \u2192 High'}</option>
                <option value="price_desc">{'Price: High \u2192 Low'}</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          {filtered.length===0
            ? <div style={{textAlign:'center',padding:'80px 20px', background: 'var(--dark2)', borderRadius: 12, border: '1px dashed var(--border)'}}>
                <div style={{fontSize:64,marginBottom:16}}>ðŸ”</div>
                <h3 style={{fontFamily:'var(--font-display)',fontSize:24,textTransform:'uppercase',marginBottom:12}}>No Jerseys Found</h3>
                <p style={{color:'var(--muted)',marginBottom:24, fontSize: 14}}>Try changing your filters or search term.</p>
                <button onClick={()=>{setClub('All');setCat('All');setMinP('');setMaxP('');setSearch('')}} className="btn btn-red btn-sm">Clear Filters</button>
              </div>
            : <div className="grid-4">
                {filtered.map(j=><ShopJerseyCard key={j.id} jersey={j}/>)}
              </div>
          }
        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      {showFilter && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'flex-end' }}>
           <div style={{ width: '85%', maxWidth: 320, background: 'var(--dark2)', height: '100%', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 24, overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, textTransform: 'uppercase', margin: 0 }}>Filters</h3>
                <button onClick={() => setShowFilter(false)} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--white)', padding: 8, borderRadius: '50%' }}><FiX size={20}/></button>
              </div>

              <div>
                <SideLabel>Categories</SideLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {['All', ...categories.map(c=>c.name)].map(c => (
                    <label key={c} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: cat === c ? 'var(--white)' : 'var(--muted)' }}>
                      <input type="radio" name="cat-mob" value={c} checked={cat === c} onChange={e=>{setCat(e.target.value); setShowFilter(false)}} style={{ accentColor: 'var(--red)', width: 18, height: 18 }} />
                      {c}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ width: '100%', height: 1, background: 'var(--border)' }} />

              <div>
                <SideLabel>Clubs</SideLabel>
                <select value={club} onChange={e=>{setClub(e.target.value); setShowFilter(false)}} className="form-select" style={{ width: '100%', padding: '12px' }}>
                  <option value="All">All Clubs</option>
                  {clubs.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div style={{ width: '100%', height: 1, background: 'var(--border)' }} />

              <div>
                <SideLabel>Sort By</SideLabel>
                <select value={sort} onChange={e=>{setSort(e.target.value); setShowFilter(false)}} className="form-select" style={{ width: '100%', padding: '12px' }}>
                  <option value="newest">Newest First</option>
                  <option value="price_asc">{'Price: Low \u2192 High'}</option>
                  <option value="price_desc">{'Price: High \u2192 Low'}</option>
                </select>
              </div>

              <button className="btn btn-red" onClick={() => setShowFilter(false)} style={{ marginTop: 'auto', width: '100%', justifyContent: 'center' }}>See Results</button>
           </div>
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          #mobile-filter-bar { display: block !important; }
          .shop-sidebar { display: none !important; }
        }
      `}</style>
    </div>
  )
}

// Ã¢â€â‚¬Ã¢â€â‚¬ JERSEY DETAIL PAGE Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

export function JerseyDetail() {
  const { slug } = useParams()
  const { addItem } = useCart()
  const [jersey, setJersey] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    api.get(`/api/jerseys/${slug}/`)
      .then(res => setJersey(res.data))
      .catch(err => {
        console.error('Jersey not found', err)
        const fallback = STATIC_JERSEYS.find(j => j.slug === slug)
        setJersey(fallback)
      })
      .finally(() => setLoading(false))
  }, [slug])

  if(loading) return <div style={{height:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}><div className="loader"/></div>
  if(!jersey) return <Navigate to="/shop" replace/>

  const stock = getStockStatus(jersey.sizes)
  const hasOld = !!jersey.old_price
  const waLink = `https://wa.me/2348000000000?text=${encodeURIComponent(`Hello! I want to order the ${jersey.title}${selectedSize?' in size '+selectedSize:''}. Please confirm availability.`)}`
  const related = (STATIC_JERSEYS || []).filter(j => (typeof j.club === 'object' ? j.club.name : j.club) === (typeof jersey.club === 'object' ? jersey.club.name : jersey.club) && j.id !== jersey.id).slice(0, 4)

  return (
    <div style={{minHeight:'100vh',paddingTop:80}}>
      <div className="container" style={{padding:'40px clamp(16px,4vw,60px) 100px'}}>
        <Link to="/shop" style={{display:'inline-flex',alignItems:'center',gap:8,color:'var(--muted)',textDecoration:'none',fontSize:13,marginBottom:36,fontFamily:'var(--font-body)',transition:'color .2s'}}
          onMouseEnter={e=>e.target.style.color='var(--red)'}
          onMouseLeave={e=>e.target.style.color='var(--muted)'}>
          <FiArrowLeft/> Back to Shop
        </Link>

        <div className="detail-grid">
          {/* Images */}
          <div>
            <div style={{height:480,background:'var(--dark2)',border:'1px solid var(--border)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:12,position:'relative',overflow:'hidden'}}>
              { (jersey.images?.[activeImg]?.image || jersey.images?.[activeImg]?.url || (typeof jersey.images?.[activeImg] === 'string' ? jersey.images?.[activeImg] : null) || jersey.primary_image)
                ? <img src={getImageUrl(jersey.images?.[activeImg]?.image || jersey.images?.[activeImg]?.url || (typeof jersey.images?.[activeImg] === 'string' ? jersey.images[activeImg] : jersey.primary_image))} alt={jersey.title} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                : <svg viewBox="0 0 200 220" style={{width:'55%',filter:'drop-shadow(0 16px 40px rgba(232,0,30,0.3))'}}>
                    <path d="M30 55 L10 90 L40 98 L40 200 L160 200 L160 98 L190 90 L170 55 L135 44 Q100 25 65 44 Z"
                      fill={(typeof jersey.club === 'object' ? jersey.club.name : (jersey.club_name || jersey.club)) === 'Nigeria' ? '#008751' : (typeof jersey.club === 'object' ? jersey.club.name : (jersey.club_name || jersey.club))?.includes('United') || (typeof jersey.club === 'object' ? jersey.club.name : (jersey.club_name || jersey.club)) === 'Liverpool' ? '#C8102E' : (typeof jersey.club === 'object' ? jersey.club.name : (jersey.club_name || jersey.club)) === 'Chelsea' ? '#034694' : '#444'}
                      stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
                    <path d="M68 44 Q100 65 132 44 Q122 28 100 24 Q78 28 68 44 Z" fill="rgba(0,0,0,0.5)"/>
                    {(typeof jersey.club === 'object' ? jersey.club.name : (jersey.club_name || jersey.club)) === 'Nigeria' && <rect x="55" y="44" width="90" height="156" fill="white" opacity="0.08"/>}
                    <text x="100" y="130" textAnchor="middle" fontSize="24" fontWeight="900" fontFamily="Barlow Condensed" fill="rgba(255,255,255,0.2)" letterSpacing="2">{(typeof jersey.club === 'object' ? jersey.club.name : (jersey.club_name || jersey.club))?.split(' ').map(w=>w[0]).join('').slice(0,3)}</text>
                  </svg>
              }
              {hasOld && <div style={{position:'absolute',top:16,right:16}}><span className="badge badge-gold">SALE -{Math.round((1-jersey.price/jersey.old_price)*100)}%</span></div>}
            </div>
            {/* Thumbnails */}
            <div style={{display:'flex',gap:10,overflowX:'auto',paddingBottom:5}}>
              { (jersey.images && jersey.images.length > 0 ? jersey.images : [jersey.primary_image]).map((img, i)=>(
                <div key={i} onClick={()=>setActiveImg(i)} style={{flexShrink:0,width:80,height:80,background:'var(--dark2)',border:`1px solid ${activeImg===i?'var(--red)':'var(--border)'}`,borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',overflow:'hidden',transition:'border-color .2s'}}>
                    { (img?.image || img?.url || (typeof img === 'string' ? img : null)) 
                      ? <img src={getImageUrl(img?.image || img?.url || img)} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                      : '👕'
                    }
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div style={{position:'sticky',top:100}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <span style={{fontSize:11,fontFamily:'var(--font-display)',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'var(--red)'}}>{typeof jersey.club === 'object' ? jersey.club.name : jersey.club}</span>
              <span className={stock.cls}>{stock.label}</span>
            </div>
            <h1 style={{fontFamily:'var(--font-display)',fontSize:'clamp(24px,3vw,36px)',fontWeight:900,textTransform:'uppercase',lineHeight:1.05,marginBottom:16}}>{jersey.title}</h1>

            {/* Rating */}
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
              <div style={{display:'flex',gap:2,color:'var(--gold)'}}>
                {[...Array(5)].map((_,i)=><FiStar key={i} size={14} fill={i<Math.floor(jersey.rating)?'currentColor':'none'}/>)}
              </div>
              <span style={{fontSize:13,color:'var(--muted)'}}>{jersey.rating}/5 . {jersey.reviews} reviews</span>
            </div>

            {/* Live Viewing */}
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:24,padding:'4px 12px',background:'var(--dark3)',border:'1px solid var(--border)',borderRadius:20,width:'fit-content'}}>
              <div className="pulse-red" style={{width:8,height:8,borderRadius:'50%',background:'var(--red)'}}/>
              <span style={{fontSize:11,color:'var(--muted)',fontWeight:500,letterSpacing:'0.5px'}}>
                <strong style={{color:'var(--off-white)'}}>{Math.floor(Math.random()*12)+8} people</strong> are viewing this jersey right now
              </span>
            </div>

            {/* Price */}
            <div style={{background:'var(--dark2)',border:'1px solid var(--border-red)',borderRadius:8,padding:'16px 20px',marginBottom:24}}>
              {hasOld && <div className="price-old" style={{marginBottom:4}}>{formatPrice(jersey.old_price)}</div>}
              <div className="price" style={{fontSize:40,color:hasOld?'var(--red)':'var(--white)'}}>{formatPrice(jersey.price)}</div>
              {hasOld && <div style={{fontSize:12,color:'var(--green-stock)',marginTop:4}}>You save {formatPrice(jersey.old_price-jersey.price)}!</div>}
            </div>

            {/* Category */}
            <div style={{marginBottom:20}}>
              <p style={{fontSize:11,fontFamily:'var(--font-display)',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>Category</p>
              <span className="badge" style={{background:'var(--dark3)',color:'var(--white)',border:'1px solid var(--border)',borderRadius:4}}>{typeof jersey.category === 'object' ? jersey.category.name : jersey.category}</span>
            </div>

            {/* Size selector */}
            <div style={{marginBottom:24}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                <p style={{fontSize:11,fontFamily:'var(--font-display)',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'var(--muted)'}}>Select Size</p>
                {selectedSize && <span style={{fontSize:12,color:'var(--green-stock)',fontWeight:600}}>âœ“ {selectedSize} selected</span>}
              </div>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                {Object.entries(jersey.sizes).map(([sz,stock])=>(
                  <button key={sz} onClick={()=>stock>0&&setSelectedSize(sz)}
                    className={`size-btn ${selectedSize===sz?'active':''} ${stock===0?'disabled':''}`}>
                    {sz}
                    {stock>0&&stock<=3&&<span style={{position:'absolute',top:-6,right:-6,background:'var(--gold)',color:'var(--black)',fontSize:8,fontWeight:700,borderRadius:'50%',width:16,height:16,display:'flex',alignItems:'center',justifyContent:'center'}}>{stock}</span>}
                  </button>
                ))}
              </div>
              <p style={{fontSize:11,color:'var(--muted)',marginTop:8}}>Numbers in corner = remaining stock for that size</p>
            </div>

            {/* Qty */}
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:24}}>
              <p style={{fontSize:11,fontFamily:'var(--font-display)',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'var(--muted)'}}>Qty:</p>
              <div style={{display:'flex',alignItems:'center',border:'1px solid var(--border)',borderRadius:4,overflow:'hidden'}}>
                <button onClick={()=>qty>1&&setQty(p=>p-1)} style={{width:36,height:36,background:'var(--dark3)',border:'none',color:'var(--white)',cursor:'pointer',fontSize:18,display:'flex',alignItems:'center',justifyContent:'center'}}>-</button>
                <span style={{width:40,textAlign:'center',fontFamily:'var(--font-display)',fontSize:16,fontWeight:700}}>{qty}</span>
                <button onClick={()=>setQty(p=>p+1)} style={{width:36,height:36,background:'var(--dark3)',border:'none',color:'var(--white)',cursor:'pointer',fontSize:18,display:'flex',alignItems:'center',justifyContent:'center'}}>+</button>
              </div>
            </div>

            {/* CTAs */}
            <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:24}}>
              <button
                onClick={()=>{
                  if(!selectedSize){toast.error('Please select a size!');return}
                  for(let i=0;i<qty;i++) addItem(jersey,selectedSize)
                  toast.success(`${jersey.title} (${selectedSize} x${qty}) added to cart!`)
                }}
                className="btn btn-red btn-lg" style={{justifyContent:'center',width:'100%'}}>
                <FiShoppingCart size={18}/> Add to Cart
              </button>
              <a href={waLink} target="_blank" rel="noopener noreferrer"
                className="btn btn-outline btn-lg" style={{justifyContent:'center',width:'100%'}}>
                <FiMessageCircle size={18}/> Order via WhatsApp
              </a>
            </div>

            {/* Trust badges */}
            <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
              {[
                {icon:<FiTruck size={14}/>,text:'24-48hr Nationwide Delivery'},
                {icon:<FiShield size={14}/>,text:'100% Original Quality'},
              ].map(({icon,text})=>(
                <div key={text} style={{display:'flex',alignItems:'center',gap:8,background:'var(--dark2)',border:'1px solid var(--border)',borderRadius:4,padding:'8px 12px',flex:1}}>
                  <span style={{color:'var(--red)'}}>{icon}</span>
                  <span style={{fontSize:11,color:'var(--muted)'}}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{marginTop:60,background:'var(--dark2)',border:'1px solid var(--border)',borderRadius:10,padding:'clamp(24px,4vw,40px)'}}>
          <h2 style={{fontFamily:'var(--font-display)',fontSize:24,textTransform:'uppercase',marginBottom:16}}>About This Jersey</h2>
          <p style={{fontSize:15,color:'var(--muted)',lineHeight:1.8,fontWeight:300}}>{jersey.description}</p>
          {jersey.features && (
            <div style={{marginTop:20,display:'flex',flexWrap:'wrap',gap:8}}>
              {jersey.features?.map(f=>(
                <span key={f} style={{fontSize:12,color:'var(--muted)',background:'var(--dark3)',border:'1px solid var(--border)',borderRadius:3,padding:'4px 10px'}}>âœ“ {f}</span>
              ))}
            </div>
          )}
        </div>

        {/* Related */}
        {related.length>0 && (
          <div style={{marginTop:60}}>
            <p className="section-eyebrow">More from {typeof jersey.club === 'object' ? jersey.club.name : jersey.club}</p>
            <h2 className="section-title" style={{marginBottom:32}}>You May Also Like</h2>
            <div className="responsive-grid" style={{gap:24}}>
              {related.map(j=><ShopJerseyCard key={j.id} jersey={j}/>)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Ã¢â€â‚¬Ã¢â€â‚¬ CART PAGE Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
export function Cart() {
  const { items, removeItem, updateQty, total, count } = useCart()

  if(count===0) return (
    <div style={{minHeight:'100vh',paddingTop:120,textAlign:'center'}}>
      <div className="container">
        <div style={{fontSize:80,marginBottom:20}}></div>
        <h2 style={{fontFamily:'var(--font-display)',fontSize:36,textTransform:'uppercase',marginBottom:12}}>Your Cart is Empty</h2>
        <p style={{color:'var(--muted)',marginBottom:32}}>Browse our collection and find your jersey</p>
        <Link to="/shop" className="btn btn-red btn-lg">Shop Now</Link>
      </div>
    </div>
  )

  return (
    <div style={{minHeight:'100vh',paddingTop:80}}>
      <div className="page-hero">
        <div className="container">
          <h1 className="section-title">Your Cart</h1>
          <p className="section-sub">{count} item{count!==1?'s':''} ready to order</p>
        </div>
      </div>
      <div className="container" style={{padding:'40px clamp(16px,4vw,60px) 100px'}}>
        <div className="checkout-grid">
          {/* Items */}
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            {items.map(item=>(
              <div key={`${item.id}-${item.size}`} className="cart-item-row" style={{background:'var(--dark2)',border:'1px solid var(--border)',borderRadius:10,padding:20,display:'flex',gap:20,alignItems:'center',position:'relative'}}>
                {/* Photo */}
                <div style={{width:80,height:80,background:'var(--dark3)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:32,flexShrink:0,border:'1px solid var(--border)',overflow:'hidden'}}>
                    {(item.primary_image || item.images?.[0]?.image || (typeof item.images?.[0] === 'string' ? item.images[0] : null)) 
                      ? <img src={getImageUrl(item.primary_image || item.images?.[0]?.image || item.images[0])} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                      : '👕'
                    }
                </div>
                
                {/* Details */}
                <div style={{flex:1, minWidth:0}}>
                  <p style={{fontSize:10,color:'var(--red)',fontFamily:'var(--font-display)',letterSpacing:'2px',textTransform:'uppercase',marginBottom:4}}>{typeof item.club === 'object' ? item.club.name : item.club}</p>
                  <p style={{fontFamily:'var(--font-display)',fontSize:17,fontWeight:800,color:'var(--white)',textTransform:'uppercase',lineHeight:1.1,marginBottom:6,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.title}</p>
                  <p style={{fontSize:12,color:'var(--muted)'}}>Size: <strong style={{color:'var(--white)'}}>{item.size}</strong></p>
                  
                  {/* Controls below Title on Mobile */}
                  <div className="cart-mobile-controls" style={{marginTop:12,display:'none',alignItems:'center',gap:16}}>
                    <div style={{display:'flex',alignItems:'center',gap:12}}>
                      <button onClick={()=>updateQty(item.id,item.size,item.qty-1)} style={{width:32,height:32,background:'var(--dark3)',border:'1px solid var(--border)',color:'var(--white)',cursor:'pointer',borderRadius:6,fontSize:18,display:'flex',alignItems:'center',justifyContent:'center'}}>-</button>
                      <span style={{fontFamily:'var(--font-display)',fontSize:18,fontWeight:700,minWidth:24,textAlign:'center'}}>{item.qty}</span>
                      <button onClick={()=>updateQty(item.id,item.size,item.qty+1)} style={{width:32,height:32,background:'var(--dark3)',border:'1px solid var(--border)',color:'var(--white)',cursor:'pointer',borderRadius:6,fontSize:18,display:'flex',alignItems:'center',justifyContent:'center'}}>+</button>
                    </div>
                  </div>
                </div>

                {/* Desktop Controls (hidden on mobile) */}
                <div className="cart-desktop-controls" style={{display:'flex',alignItems:'center',gap:10}}>
                  <button onClick={()=>updateQty(item.id,item.size,item.qty-1)} style={{width:28,height:28,background:'var(--dark3)',border:'1px solid var(--border)',color:'var(--white)',cursor:'pointer',borderRadius:4,fontSize:16}}>-</button>
                  <span style={{fontFamily:'var(--font-display)',fontSize:16,fontWeight:700,minWidth:20,textAlign:'center'}}>{item.qty}</span>
                  <button onClick={()=>updateQty(item.id,item.size,item.qty+1)} style={{width:28,height:28,background:'var(--dark3)',border:'1px solid var(--border)',color:'var(--white)',cursor:'pointer',borderRadius:4,fontSize:16}}>+</button>
                </div>

                {/* Price & Delete */}
                <div style={{textAlign:'right',display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4}}>
                  <button onClick={()=>removeItem(item.id,item.size)} style={{position:'absolute',top:12,right:12,background:'rgba(0,0,0,0.2)',border:'1px solid var(--border)',color:'var(--muted)',cursor:'pointer',fontSize:14,width:24,height:24,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',transition:'all .2s'}}
                    onMouseEnter={e=>e.target.style.color='var(--red)'} 
                    onMouseLeave={e=>e.target.style.color='var(--muted)'}>x</button>
                  <div className="price" style={{fontSize:20}}>{formatPrice(item.price*item.qty)}</div>
                  <div className="unit-price" style={{fontSize:11,color:'var(--muted)'}}>{formatPrice(item.price)} each</div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{position:'sticky',top:100,background:'var(--dark2)',border:'1px solid var(--border-red)',borderRadius:10,overflow:'hidden'}}>
            <div className="summary-header" style={{background:'var(--red)',padding:'16px 24px'}}>
              <h3 style={{fontFamily:'var(--font-display)',fontSize:20,textTransform:'uppercase',color:'white',letterSpacing:'2px',margin:0}}>Order Summary</h3>
            </div>
            <div style={{padding:24}}>
              <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:20}}>
                {[
                  {label:`Subtotal (${count} items)`,val:formatPrice(total)},
                  {label:'Delivery',val:total>=30000?'FREE':'NGN2,500'},
                  {label:'Total',val:formatPrice(total+(total>=30000?0:2500)),big:true},
                ].map(({label,val,big})=>(
                  <div key={label} style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingBottom:12,borderBottom:big?'none':'1px solid var(--border)'}}>
                    <span style={{fontSize:big?15:13,color:big?'var(--white)':'var(--muted)',fontWeight:big?700:400}}>{label}</span>
                    <span style={{fontFamily:big?'var(--font-price)':'var(--font-body)',fontSize:big?26:14,color:big?'var(--red)':'var(--white)'}}>{val}</span>
                  </div>
                ))}
              </div>
              {total<30000 && <p style={{fontSize:12,color:'var(--gold)',marginBottom:16,background:'rgba(255,184,0,0.08)',border:'1px solid rgba(255,184,0,0.2)',borderRadius:4,padding:'8px 12px'}}>
                 Add {formatPrice(30000-total)} more for FREE delivery!
              </p>}
              <Link to="/checkout" className="btn btn-red" style={{width:'100%',justifyContent:'center',marginBottom:12}}>
                Proceed to Checkout
              </Link>
              <a href={`https://wa.me/2348000000000?text=${encodeURIComponent('Hello! I want to order:\n'+items.map(i=>`- ${i.title} (${i.size}) x${i.qty} = ${formatPrice(i.price*i.qty)}`).join('\n')+`\n\nTotal: ${formatPrice(total)}`)}`}
                target="_blank" rel="noopener noreferrer"
                className="btn btn-outline" style={{width:'100%',justifyContent:'center'}}>
                Order via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Ã¢â€â‚¬Ã¢â€â‚¬ CHECKOUT PAGE Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
export function Checkout() {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState({name:'',phone:'',email:'',address:'',city:'',state:''})
  const [loading, setLoading] = useState(false)
  const set = (k,v)=>setForm(p=>({...p,[k]:v}))
  const delivery = total>=30000 ? 0 : 2500
  const grandTotal = total + delivery

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const orderData = {
        customer_name: form.name,
        customer_phone: form.phone,
        customer_email: form.email,
        address: form.address,
        city: form.city,
        state: form.state,
        payment_method: 'Paystack', // Default or from radio
        items: items.map(it => ({
          jersey: it.id,
          size: it.size,
          quantity: it.qty,
          price: it.price
        }))
      }
      const res = await api.post('/api/orders/create/', orderData)
      if (res.data.paystack_url) {
        window.location.href = res.data.paystack_url
      } else {
        clearCart()
        navigate('/order-success')
      }
    } catch (err) {
      toast.error('Failed to create order. Please check your network.')
    } finally {
      setLoading(false)
    }
  }

  if(items.length===0) return <Navigate to="/cart" replace/>

  return (
    <div style={{minHeight:'100vh',paddingTop:80}}>
      <div className="page-hero">
        <div className="container">
          <h1 className="section-title">Checkout</h1>
          <p className="section-sub">Fill your details and complete your order</p>
        </div>
      </div>
      <div className="container" style={{padding:'40px clamp(16px,4vw,60px) 100px'}}>
        <form onSubmit={handleSubmit}>
          <div className="checkout-grid">
            <div>
              <h3 style={{fontFamily:'var(--font-display)',fontSize:22,textTransform:'uppercase',marginBottom:24,paddingBottom:16,borderBottom:'1px solid var(--border)'}}>Delivery Details</h3>
              <div className="grid-2">
                <div style={{gridColumn:'1/-1'}}>
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Your full name" required/>
                </div>
                <div className="col-mobile-1">
                  <label className="form-label">Phone / WhatsApp *</label>
                  <input className="form-input" value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="+234 800 000 0000" required/>
                </div>
                <div className="col-mobile-1">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="you@email.com"/>
                </div>
                <div style={{gridColumn:'1/-1'}}>
                  <label className="form-label">Delivery Address *</label>
                  <input className="form-input" value={form.address} onChange={e=>set('address',e.target.value)} placeholder="Full delivery address" required/>
                </div>
                <div className="col-mobile-1">
                  <label className="form-label">City *</label>
                  <input className="form-input" value={form.city} onChange={e=>set('city',e.target.value)} placeholder="City" required/>
                </div>
                <div className="col-mobile-1">
                  <label className="form-label">State *</label>
                  <select className="form-select" value={form.state} onChange={e=>set('state',e.target.value)} required>
                    <option value="">Select state</option>
                    {[
                      'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 
                      'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT - Abuja', 'Gombe', 
                      'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 
                      'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 
                      'Taraba', 'Yobe', 'Zamfara'
                    ].map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div style={{marginTop:32,background:'var(--dark2)',border:'1px solid var(--border)',borderRadius:8,padding:20}}>
                <h4 style={{fontFamily:'var(--font-display)',fontSize:16,textTransform:'uppercase',marginBottom:16,letterSpacing:'2px'}}>Payment Method</h4>
                {['Paystack (Card/Transfer/USSD)', 'Pay on Delivery'].map((m, i) => (
                  <label key={m} style={{display:'flex',alignItems:'center',gap:12,marginBottom:12,cursor:'pointer'}}>
                    <input type="radio" name="payment" defaultChecked={i===0} style={{accentColor:'var(--red)'}}/>
                    <span style={{fontSize:14,color:'var(--off-white)'}}>{m}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Order summary */}
            <div style={{position:'sticky',top:100,background:'var(--dark2)',border:'1px solid var(--border-red)',borderRadius:10,overflow:'hidden'}}>
              <div style={{background:'var(--red)',padding:'16px 24px'}}>
                <h3 style={{fontFamily:'var(--font-display)',fontSize:18,textTransform:'uppercase',color:'white',letterSpacing:'2px'}}>Your Order</h3>
              </div>
              <div style={{padding:24}}>
                <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:20,paddingBottom:16,borderBottom:'1px solid var(--border)'}}>
                  {items.map(item=>(
                    <div key={`${item.id}-${item.size}`} style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <div>
                        <p style={{fontSize:13,fontWeight:600,color:'var(--off-white)'}}>{item.title.split(' ').slice(0,3).join(' ')}</p>
                        <p style={{fontSize:11,color:'var(--muted)'}}>Size {item.size} x{item.qty}</p>
                      </div>
                      <span style={{fontFamily:'var(--font-price)',fontSize:16,color:'var(--white)'}}>{formatPrice(item.price*item.qty)}</span>
                    </div>
                  ))}
                </div>
                {[
                  {label:'Subtotal',val:formatPrice(total)},
                  {label:'Delivery',val:delivery===0?'FREE':formatPrice(delivery)},
                ].map(({label,val})=>(
                  <div key={label} style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                    <span style={{fontSize:13,color:'var(--muted)'}}>{label}</span>
                    <span style={{fontSize:13,color:val==='FREE'?'var(--green-stock)':'var(--white)'}}>{val}</span>
                  </div>
                ))}
                <div style={{display:'flex',justifyContent:'space-between',marginTop:16,paddingTop:16,borderTop:'1px solid var(--border)'}}>
                  <span style={{fontSize:15,fontWeight:700}}>Total</span>
                  <span style={{fontFamily:'var(--font-price)',fontSize:28,color:'var(--red)'}}>{formatPrice(grandTotal)}</span>
                </div>
                <button type="submit" disabled={loading} className="btn btn-red" style={{width:'100%',justifyContent:'center',marginTop:20,fontSize:15}}>
                  {loading
                    ? <><div style={{width:16,height:16,borderRadius:'50%',border:'2px solid rgba(255,255,255,0.4)',borderTopColor:'white',animation:'spin .7s linear infinite'}}/> Processing...</>
                    : 'Complete Order'
                  }
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

// Ã¢â€â‚¬Ã¢â€â‚¬ ORDER SUCCESS Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
export function OrderSuccess() {
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <div style={{textAlign:'center',maxWidth:520}}>
        <div style={{fontSize:80,marginBottom:20,animation:'fadeInUp .6s ease'}}></div>
        <h1 style={{fontFamily:'var(--font-display)',fontSize:'clamp(36px,6vw,64px)',textTransform:'uppercase',lineHeight:1,marginBottom:16,color:'var(--white)'}}>
          Order Confirmed!
        </h1>
        <p style={{fontSize:16,color:'var(--muted)',lineHeight:1.7,marginBottom:12}}>
          Thank you! We have received your order. Our team will contact you on WhatsApp to confirm your delivery details within 30 minutes.
        </p>
        <p style={{fontSize:14,color:'var(--red)',fontWeight:600,marginBottom:32}}>
          Delivery in 24-48 hours nationwide.
        </p>
        <div style={{display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap'}}>
          <a href="https://wa.me/2348000000000" target="_blank" rel="noopener noreferrer" className="btn btn-red btn-lg">
            Track on WhatsApp
          </a>
          <Link to="/shop" className="btn btn-outline btn-lg">Continue Shopping</Link>
        </div>
      </div>
    </div>
  )
}

// Ã¢â€â‚¬Ã¢â€â‚¬ ABOUT PAGE Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
export function About() {
  return (
    <div style={{minHeight:'100vh'}}>
      <div className="page-hero">
        <div className="container">
          <p className="section-eyebrow">The Story</p>
          <h1 className="section-title">About<br/><span className="red-gradient">Adekunle TV</span></h1>
          <p className="section-sub">Nigeria's most trusted voice for football and jerseys Ã¢â‚¬â€ talking the beautiful game in Yoruba for 600,000 fans.</p>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <div className="responsive-grid" style={{gap:80,alignItems:'center'}}>
            <div style={{background:'var(--dark2)',border:'1px solid var(--border-red)',borderRadius:16,minHeight:400,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16,padding:32,position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:'linear-gradient(90deg,transparent,var(--red),transparent)'}}/>
              <div style={{width:120,height:120,borderRadius:'50%',background:'linear-gradient(135deg,var(--red-dark),var(--red))',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-display)',fontSize:52,fontWeight:900,color:'white',boxShadow:'0 0 60px rgba(232,0,30,0.4)'}}>A</div>
              <h2 style={{fontFamily:'var(--font-display)',fontSize:28,textTransform:'uppercase',marginBottom:4}}>Adekunle</h2>
              <p style={{fontSize:12,color:'var(--red)',fontFamily:'var(--font-display)',letterSpacing:'3px',textTransform:'uppercase'}}>Adekunle TV</p>
              <div style={{display:'flex',justifyContent:'space-around',width:'100%',paddingTop:20,borderTop:'1px solid var(--border)'}}>
                {[{n:'608K+',l:'TikTok'},{n:'67.2M',l:'Likes'},{n:'3.2K+',l:'Customers'}].map(s=>(
                  <div key={s.l} style={{textAlign:'center'}}>
                    <p style={{fontFamily:'var(--font-display)',fontSize:22,fontWeight:900,color:'var(--red)',lineHeight:1}}>{s.n}</p>
                    <p style={{fontSize:10,color:'var(--muted)',fontFamily:'var(--font-display)',letterSpacing:'2px',textTransform:'uppercase'}}>{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="section-eyebrow">Our Story</p>
              <h2 className="section-title" style={{fontSize:'clamp(28px,4vw,48px)'}}>
                Football in Yoruba.<br/>
                <span className="red-gradient">Jerseys for Everyone.</span>
              </h2>
              <div style={{height:2,width:60,background:'var(--red)',margin:'20px 0'}}/>
              {[
                "Adekunle TV started with a simple idea Ã¢â‚¬â€ talk about football the way Nigerians actually talk about it. In Yoruba. With passion, humour and zero filter.",
                "With 608,000 followers and 67 million likes on TikTok, Adekunle TV has become the go-to destination for football fans across Nigeria who want real analysis in their own language.",
                "The jersey store was born from the same energy. Our followers kept asking Ã¢â‚¬â€ 'where do you get your jerseys?' So we built a proper store. Original quality. Affordable prices. Delivered to your door anywhere in Nigeria.",
              ].map((p,i)=>(
                <p key={i} style={{fontSize:15,color:'var(--muted)',lineHeight:1.8,marginBottom:16,fontWeight:300}}>{p}</p>
              ))}
              <a href="https://tiktok.com/@adekunle_tv5" target="_blank" rel="noopener noreferrer" className="btn btn-red" style={{marginTop:16}}>
                Follow on TikTok
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Ã¢â€â‚¬Ã¢â€â‚¬ CONTACT PAGE Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
export function Contact() {
  const [form,setForm]=useState({name:'',phone:'',message:''})
  const [sent,setSent]=useState(false)
  const set=(k,v)=>setForm(p=>({...p,[k]:v}))
  return (
    <div style={{minHeight:'100vh'}}>
      <div className="page-hero">
        <div className="container">
          <p className="section-eyebrow">Get in Touch</p>
          <h1 className="section-title">Contact Us</h1>
          <p className="section-sub">We typically respond within 30 minutes on WhatsApp.</p>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <div className="responsive-grid" style={{gap:60,alignItems:'start'}}>
            <div>
              <p className="section-eyebrow">Reach Us</p>
              <h2 className="section-title" style={{fontSize:'clamp(28px,4vw,48px)',marginBottom:36}}>
                We're Here<br/><span className="red-gradient">For You</span>
              </h2>
              {[
                {icon:'Ã°Å¸â€™Â¬',label:'WhatsApp',val:'Chat with us now Ã¢â‚¬â€ fastest response',href:'https://wa.me/2348000000000'},
                {icon:'Ã°Å¸â€œÂ±',label:'TikTok',val:'@adekunle_tv5 Ã¢â‚¬â€ DM us anytime',href:'https://tiktok.com/@adekunle_tv5'},
                {icon:'Ã°Å¸â€œÂ§',label:'Email',val:'adekunletv@gmail.com',href:'mailto:adekunletv@gmail.com'},
              ].map(({icon,label,val,href})=>(
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{display:'flex',gap:16,marginBottom:24,textDecoration:'none'}}>
                  <div style={{width:48,height:48,borderRadius:6,background:'var(--red-subtle)',border:'1px solid var(--border-red)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>{icon}</div>
                  <div>
                    <p style={{fontSize:10,fontFamily:'var(--font-display)',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'var(--red)',marginBottom:3}}>{label}</p>
                    <p style={{fontSize:13,color:'var(--muted)',fontWeight:300}}>{val}</p>
                  </div>
                </a>
              ))}
            </div>
            <div style={{background:'var(--dark2)',border:'1px solid var(--border)',borderRadius:12,overflow:'hidden'}}>
              <div style={{height:3,background:'linear-gradient(90deg,var(--red-dark),var(--red),var(--red-light))'}}/>
              <div style={{padding:'clamp(24px,4vw,40px)'}}>
                {sent ? (
                  <div style={{textAlign:'center',padding:'40px 0'}}>
                    <div style={{fontSize:56,marginBottom:16}}>Ã¢Å“â€¦</div>
                    <h3 style={{fontFamily:'var(--font-display)',fontSize:24,textTransform:'uppercase',marginBottom:12}}>Message Sent!</h3>
                    <p style={{color:'var(--muted)',fontWeight:300}}>We'll reply on WhatsApp within 30 minutes.</p>
                  </div>
                ) : (
                  <form onSubmit={e=>{e.preventDefault();setSent(true)}} style={{display:'flex',flexDirection:'column',gap:16}}>
                    <div><label className="form-label">Name *</label><input className="form-input" value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Your name" required/></div>
                    <div><label className="form-label">Phone / WhatsApp *</label><input className="form-input" value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="+234..." required/></div>
                    <div><label className="form-label">Message *</label><textarea className="form-textarea" value={form.message} onChange={e=>set('message',e.target.value)} placeholder="What jersey do you want? Or ask any question..." required/></div>
                    <button type="submit" className="btn btn-red" style={{justifyContent:'center'}}>Send Message</button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Ã¢â€â‚¬Ã¢â€â‚¬ BLOGS PAGE Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
const BLOG_POSTS = [
  {
    id: 1, slug: 'how-to-spot-original-jersey',
    title: 'How to Spot an Original Jersey vs Fake',
    excerpt: 'With fakes flooding the market, here\'s your ultimate guide to identifying authentic football jerseys before you buy.',
    category: 'Buying Guide', date: 'March 28, 2025', readTime: '4 min read',
    emoji: 'Ã°Å¸â€Â', color: '#E8001E',
    img: 'https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 2, slug: 'top-5-nigeria-jerseys-ever',
    title: 'Top 5 Nigeria Super Eagles Jerseys of All Time',
    excerpt: 'From the iconic 1994 World Cup kit to the 2018 banger that broke the internet Ã¢â‚¬â€ we rank Nigeria\'s best jerseys ever.',
    category: 'Nigeria Football', date: 'March 20, 2025', readTime: '5 min read',
    emoji: 'ðŸ‡³ðŸ‡¬', color: '#008751',
    img: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 3, slug: 'manchester-united-2025-kit-review',
    title: 'Manchester United 2025/26 Kit Ã¢â‚¬â€ Full Review',
    excerpt: 'Adidas and Man United dropped a banger. We got our hands on it before anyone else. Here\'s our full honest review.',
    category: 'Kit Review', date: 'March 14, 2025', readTime: '6 min read',
    emoji: 'Ã°Å¸â€Â´', color: '#E8001E',
    img: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 4, slug: 'jersey-care-tips',
    title: '5 Ways to Keep Your Jersey Looking Fresh',
    excerpt: 'Your jersey is an investment. Here\'s how to wash, store and maintain it so it lasts for years without cracking prints.',
    category: 'Care Tips', date: 'March 8, 2025', readTime: '3 min read',
    emoji: 'Ã°Å¸Â§Âº', color: '#6CABDD',
    img: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 5, slug: 'best-jerseys-for-gifts',
    title: 'Best Football Jerseys to Give as Gifts in Nigeria',
    excerpt: 'Looking for the perfect gift for a football fan? Here are the top jerseys that will make them scream with excitement.',
    category: 'Gift Guide', date: 'March 1, 2025', readTime: '4 min read',
    emoji: 'Ã°Å¸Å½Â', color: '#FFD700',
    img: 'https://images.unsplash.com/photo-1540747913346-19212a4cf655?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 6, slug: 'barcelona-kit-history',
    title: 'Barcelona\'s Most Iconic Kits Through the Decades',
    excerpt: 'From Johan Cruyff\'s era to the modern Pedri era Ã¢â‚¬â€ Barca have always had style. We break down the best kits in their history.',
    category: 'Kit History', date: 'Feb 22, 2025', readTime: '7 min read',
    emoji: 'Ã°Å¸â€ÂµÃ°Å¸â€Â´', color: '#A50044',
    img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80'
  },
]

export function Blogs() {
  const [active, setActive] = useState('All')
  const cats = ['All', ...new Set(BLOG_POSTS.map(b => b.category))]
  const filtered = active === 'All' ? BLOG_POSTS : BLOG_POSTS.filter(b => b.category === active)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', position: 'relative', overflow: 'hidden' }}>
      {/* Animated gradient background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 70% 50% at 20% 20%, rgba(232,0,30,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 60% 60% at 80% 80%, rgba(232,0,30,0.04) 0%, transparent 60%)
        `,
        animation: 'bgPulse 8s ease-in-out infinite alternate'
      }}/>

      {/* Page Hero */}
      <div className="page-hero" style={{ position: 'relative', zIndex: 1 }}>
        <div className="container">
          <p className="section-eyebrow">Knowledge Hub</p>
          <h1 className="section-title">Adekunle TV Blog</h1>
          <p className="section-sub">Jersey reviews, football analysis, buying guides and more.</p>
        </div>
      </div>

      {/* Category filter pills */}
      <div style={{ position: 'relative', zIndex: 1, padding: '0 clamp(16px,4vw,60px)', marginBottom: 40 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', maxWidth: 1280, margin: '0 auto' }}>
          {cats.map(c => (
            <button key={c} onClick={() => setActive(c)} style={{
              padding: '8px 20px', borderRadius: 100,
              background: active === c ? 'var(--red)' : 'var(--dark2)',
              border: `1px solid ${active === c ? 'var(--red)' : 'var(--border)'}`,
              color: active === c ? 'white' : 'var(--muted)',
              fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer',
              transition: 'all 0.25s'
            }}>{c}</button>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      <div style={{ position: 'relative', zIndex: 1, padding: '0 clamp(16px,4vw,60px) 100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 28, maxWidth: 1280, margin: '0 auto' }}>
          {filtered.map(post => (
            <article key={post.id} style={{
              background: 'var(--dark2)', border: '1px solid var(--border)',
              borderRadius: 16, overflow: 'hidden', transition: 'all 0.35s',
              display: 'flex', flexDirection: 'column'
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.borderColor = 'rgba(232,0,30,0.4)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.5)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              {/* Thumbnail */}
              <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                <img src={post.img} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }}/>
                <span style={{
                  position: 'absolute', top: 12, left: 12,
                  background: post.color, color: 'white',
                  fontFamily: 'var(--font-display)', fontSize: 9, fontWeight: 800,
                  letterSpacing: '2px', textTransform: 'uppercase',
                  padding: '4px 10px', borderRadius: 100
                }}>{typeof post.category === 'object' ? post.category.name : post.category}</span>
              </div>
              {/* Content */}
              <div style={{ padding: '20px 24px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--muted)', marginBottom: 12 }}>
                  <span>{post.date}</span>
                  <span>-</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 style={{
                  fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800,
                  color: 'var(--white)', textTransform: 'uppercase', lineHeight: 1.3,
                  margin: '0 0 10px'
                }}>{post.title}</h2>
                <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.7, flex: 1, marginBottom: 20 }}>{post.excerpt}</p>
                <a href={`/blogs/${post.slug}`} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  color: 'var(--red)', fontFamily: 'var(--font-display)',
                  fontSize: 12, fontWeight: 800, letterSpacing: '1px',
                  textTransform: 'uppercase', textDecoration: 'none',
                  transition: 'gap 0.2s'
                }}
                  onMouseEnter={e => e.currentTarget.style.gap = '10px'}
                  onMouseLeave={e => e.currentTarget.style.gap = '6px'}
                >Read More &rarr;</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

// Ã¢â€â‚¬Ã¢â€â‚¬ GALLERY PAGE Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
const GALLERY_ITEMS = [
  { id:1,  title:'Man United Home 2025', tag:'Match Kit', img:'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&auto=format&fit=crop&q=80' },
  { id:2,  title:'Chelsea Third Kit', tag:'Premium', img:'https://images.unsplash.com/photo-1518605368461-1ee7c5101a1d?w=600&auto=format&fit=crop&q=80' },
  { id:3,  title:'Nigeria 1994 Retro', tag:'Retro Classic', img:'https://images.unsplash.com/photo-1543351611-58f69d7c1781?w=600&auto=format&fit=crop&q=80' },
  { id:4,  title:'Barcelona Home Kit', tag:'La Liga', img:'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=600&auto=format&fit=crop&q=80' },
  { id:5,  title:'Real Madrid Away', tag:'Champions', img:'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80' },
  { id:6,  title:'PSG 2024 Edition', tag:'Ligue 1', img:'https://images.unsplash.com/photo-1431324155629-1a6eda11caec?w=600&auto=format&fit=crop&q=80' },
  { id:7,  title:'Arsenal Gunners Kit', tag:'Premier League', img:'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=600&auto=format&fit=crop&q=80' },
  { id:8,  title:'Liverpool Home 2025', tag:'Anfield', img:'https://images.unsplash.com/photo-1516567727049-e1d4b7d1b5e5?w=600&auto=format&fit=crop&q=80' },
  { id:9,  title:'Bayern Munich Reds', tag:'Bundesliga', img:'https://images.unsplash.com/photo-1599586120429-48281b6f0ece?w=600&auto=format&fit=crop&q=80' },
  { id:10, title:'Man City Sky Blues', tag:'Premier League', img:'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=600&auto=format&fit=crop&q=80' },
  { id:11, title:'Nigeria WC 2018', tag:'World Cup', img:'https://images.unsplash.com/photo-1518153832742-990a426f43e4?w=600&auto=format&fit=crop&q=80' },
  { id:12, title:'Store Collection', tag:'In Stock', img:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80' },
]

export function Gallery() {
  const [selected, setSelected] = useState(null)
  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', position: 'relative', overflow: 'hidden' }}>
      {/* Animated background blobs */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', width: 600, height: 600, top: -200, right: -100,
          background: 'radial-gradient(circle, rgba(232,0,30,0.07) 0%, transparent 70%)',
          animation: 'float 10s ease-in-out infinite'
        }}/>
        <div style={{
          position: 'absolute', width: 400, height: 400, bottom: 100, left: -100,
          background: 'radial-gradient(circle, rgba(232,0,30,0.05) 0%, transparent 70%)',
          animation: 'float 13s ease-in-out infinite reverse'
        }}/>
      </div>

      {/* Hero */}
      <div className="page-hero" style={{ position: 'relative', zIndex: 1 }}>
        <div className="container">
          <p className="section-eyebrow">Our Collection</p>
          <h1 className="section-title">Jersey Gallery</h1>
          <p className="section-sub">Browse our premium jersey collection Ã¢â‚¬â€ click any image to zoom in.</p>
        </div>
      </div>

      {/* Masonry-style Grid */}
      <div style={{ position: 'relative', zIndex: 1, padding: '0 clamp(16px,4vw,60px) 100px' }}>
        <div style={{
          columns: 'auto 280px', gap: 16, maxWidth: 1280, margin: '0 auto'
        }}>
          {GALLERY_ITEMS.map((item, i) => (
            <div key={item.id} onClick={() => setSelected(item)}
              style={{
                breakInside: 'avoid', marginBottom: 16, cursor: 'pointer',
                borderRadius: 12, overflow: 'hidden', position: 'relative',
                border: '1px solid var(--border)',
                transition: 'all 0.3s',
                animation: `fadeInUp 0.6s ease ${i * 0.05}s both`
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(232,0,30,0.5)'; e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.6)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <img src={item.img} alt={item.title} style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)',
                opacity: 0, transition: 'opacity 0.3s',
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                padding: '16px'
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0}
              >
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 800, color: 'white', textTransform: 'uppercase' }}>{item.title}</span>
                <span style={{ fontSize: 10, color: 'var(--red)', fontFamily: 'var(--font-display)', letterSpacing: '2px', textTransform: 'uppercase' }}>{item.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.93)', backdropFilter: 'blur(8px)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: 700, width: '100%', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(232,0,30,0.3)', background: 'var(--dark2)', animation: 'fadeInUp 0.3s ease' }}>
            <img src={selected.img} alt={selected.title} style={{ width: '100%', maxHeight: '65vh', objectFit: 'cover' }} />
            <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, textTransform: 'uppercase', color: 'var(--white)', margin: '0 0 4px' }}>{selected.title}</h3>
                <span style={{ fontSize: 11, color: 'var(--red)', fontFamily: 'var(--font-display)', letterSpacing: '2px', textTransform: 'uppercase' }}>{selected.tag}</span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <Link to="/shop" style={{ padding: '10px 20px', background: 'var(--red)', color: 'white', borderRadius: 6, fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', textDecoration: 'none' }}>Order Now</Link>
                <button onClick={() => setSelected(null)} style={{ padding: '10px 16px', background: 'var(--dark3)', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer' }}>x Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Ã¢â€â‚¬Ã¢â€â‚¬ CLUBS PAGE Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
export function Clubs() {
  const [clubs, setClubs] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await api.get('/api/jerseys/clubs/')
        setClubs(res.data)
      } catch (err) {
        toast.error('Failed to load clubs')
        setClubs(STATIC_CLUBS)
      } finally {
        setLoading(false)
      }
    }
    fetchClubs()
  }, [])

  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="loader" /></div>

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', padding: '100px 0 60px' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <p className="section-eyebrow">Your Favourite Teams</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(40px, 8vw, 72px)', textTransform: 'uppercase', color: 'var(--white)', letterSpacing: '-1px', marginBottom: 20 }}>
            Browse by <span className="red-gradient">Club</span>
          </h1>
          <p style={{ color: 'var(--muted)', maxWidth: 600, margin: '0 auto', fontSize: 16 }}>
            Select your club to see all available official kits, training gear, and retro classics.
          </p>
        </div>

        <div className="grid-3" style={{ gap: 24 }}>
          {clubs.map(club => (
            <Link key={club.id} to={`/shop?club=${encodeURIComponent(club.name)}`}
              className="premium-hover"
              style={{
                background: 'var(--dark2)',
                border: '1px solid var(--border)',
                borderRadius: 16,
                padding: '40px 24px',
                textAlign: 'center',
                textDecoration: 'none',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 16,
                transition: 'all 0.4s var(--ease)',
              }}
            >
              <div style={{
                position: 'relative', width: 100, height: 100, marginBottom: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.03)', borderRadius: '50%', padding: 20
              }}>
                <img
                  src={club.jersey || club.icon || `/clubs/${club.slug}.svg`}
                  alt={club.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.5))',
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <div style={{ display: 'none', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}></div>
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 20, fontWeight: 800,
                color: 'var(--white)', textTransform: 'uppercase',
                letterSpacing: '1px', lineHeight: 1.2,
              }}>{club.name}</div>
              <div style={{
                fontSize: 12, color: 'var(--muted)',
                fontFamily: 'var(--font-display)', letterSpacing: '2px',
                textTransform: 'uppercase'
              }}>{club.country}</div>
              <div style={{
                marginTop: 12, fontSize: 11, color: 'var(--red)',
                fontFamily: 'var(--font-display)', fontWeight: 800,
                letterSpacing: '2px', textTransform: 'uppercase'
              }}>View Collection &rarr;</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

// Ã¢â€â‚¬Ã¢â€â‚¬ LOGIN PAGE Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
export function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/api/auth/token/', form)
      localStorage.setItem('atv_access', res.data.access)
      localStorage.setItem('atv_refresh', res.data.refresh)
      toast.success('Welcome back, Admin!')
      navigate('/admin')
    } catch (err) {
      toast.error('Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex', alignItems: 'center', justifySelf: 'center', padding: 20, position: 'relative', overflow: 'hidden', width: '100%' }}>
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(232,0,30,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 60, height: 60, background: 'var(--red)', clipPath: 'polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 900, color: 'white', boxShadow: '0 8px 32px rgba(232,0,30,0.4)' }}>ATV</div>
            <div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, letterSpacing: '3px', color: 'var(--white)', textTransform: 'uppercase' }}>Adekunle TV Jerseys</p>
              <p style={{ fontSize: 11, color: 'var(--red)', fontFamily: 'var(--font-display)', letterSpacing: '2px', textTransform: 'uppercase' }}>Admin Portal</p>
            </div>
          </Link>
        </div>
        <div style={{ background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}>
          <div style={{ height: 3, background: 'var(--red)' }} />
          <div style={{ padding: 36 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, textTransform: 'uppercase', marginBottom: 6 }}>Sign In</h2>
            <p style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 300, marginBottom: 28 }}>Access your store management dashboard</p>
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div><label className="form-label">Username</label><input className="form-input" value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} placeholder="admin" required autoFocus /></div>
              <div><label className="form-label">Password</label><input className="form-input" type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="--------" required /></div>
              <button type="submit" disabled={loading} className="btn btn-red" style={{ justifyContent: 'center', marginTop: 8, width: '100%' }}>
                {loading ? <><div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin .7s linear infinite' }} /> Signing in...</> : <>Sign In &rarr;</>}
              </button>
            </form>
          </div>
        </div>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--muted)' }}><Link to="/" style={{ color: 'var(--red)', textDecoration: 'none' }}>Ã¢â€ Â Back to store</Link></p>
      </div>
    </div>
  )
}

// Ã¢â€â‚¬Ã¢â€â‚¬ ADMIN DASHBOARD Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

function AdminNav({ onLogout, lightMode, toggleLight }) {
    const NAV=[
    {to:'/admin',label:'Dashboard',icon:<FiGrid/>},
    {to:'/admin/jerseys',label:'Jerseys',icon:<FiShoppingBag/>},
    {to:'/admin/orders',label:'Orders',icon:<FiPackage/>},
    {to:'/admin/tiktok',label:'TikTok',icon:<FiMessageCircle/>},
    {to:'/admin/blog',label:'Blog',icon:<FiFileText/>}
  ]
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setMobileOpen(false), [pathname])

  const sidebarContent = (
    <>
      <div style={{padding:'24px 20px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:12}}>
        <div style={{width:40,height:40,background:'var(--red)',clipPath:'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-display)',fontSize:14,fontWeight:900,color:'white',flexShrink:0,boxShadow:'0 4px 16px rgba(232,0,30,0.4)'}}>ATV</div>
        <div>
          <p style={{fontSize:12,fontWeight:700,letterSpacing:'2px',color:'var(--white)',fontFamily:'var(--font-display)',textTransform:'uppercase',lineHeight:1.2}}>Adekunle TV</p>
          <p style={{fontSize:9,color:'var(--red)',letterSpacing:'3px',textTransform:'uppercase',fontFamily:'var(--font-display)',marginTop:2}}>Admin Panel</p>
        </div>
      </div>
      <nav style={{flex:1,padding:'16px 12px'}}>
        {NAV.map(({label,icon,to})=>{
          const isActive = pathname === to
          return (
            <Link key={label} to={to} style={{display:'flex',alignItems:'center',gap:12,padding:'11px 14px',borderRadius:8,marginBottom:4,color: isActive ? 'var(--white)' : 'var(--muted)',cursor:'pointer',fontFamily:'var(--font-body)',fontSize:13,fontWeight: isActive ? 700 : 400,transition:'all .2s',textDecoration:'none',background: isActive ? 'rgba(232,0,30,0.15)' : 'transparent',borderLeft: isActive ? '3px solid var(--red)' : '3px solid transparent'}}
              onMouseEnter={e=>{if(!isActive){e.currentTarget.style.background='rgba(255,255,255,0.05)';e.currentTarget.style.color='var(--white)'}}}
              onMouseLeave={e=>{if(!isActive){e.currentTarget.style.background='transparent';e.currentTarget.style.color='var(--muted)'}}}>
              <span style={{fontSize:17,flexShrink:0}}>{icon}</span>
              <span>{label}</span>
              {isActive && <div style={{marginLeft:'auto',width:6,height:6,borderRadius:'50%',background:'var(--red)'}}/>}
            </Link>
          )
        })}
      </nav>
      <div style={{padding:'16px 12px',borderTop:'1px solid var(--border)'}}>
        <div style={{background:'rgba(232,0,30,0.08)',border:'1px solid rgba(232,0,30,0.2)',borderRadius:10,padding:'12px 14px',marginBottom:12}}>
          <p style={{fontSize:10,color:'var(--muted)',marginBottom:2,textTransform:'uppercase',letterSpacing:'1px'}}>Logged in as</p>
          <p style={{fontSize:13,fontWeight:700,color:'var(--white)'}}>Admin</p>
        </div>
        <button
          onClick={toggleLight}
          style={{display:'flex',alignItems:'center',gap:8,background: lightMode ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)',border:'1px solid var(--border)',color:'var(--muted)',cursor:'pointer',fontSize:12,fontFamily:'var(--font-body)',padding:'9px 14px',width:'100%',borderRadius:8,transition:'all .2s',marginBottom:8}}
          onMouseEnter={e=>{e.currentTarget.style.color=lightMode?'#111':'var(--white)'}}
          onMouseLeave={e=>{e.currentTarget.style.color='var(--muted)'}}>
          {lightMode ? 'Ã°Å¸Å’â„¢ Dark Mode' : 'Ã¢Ëœâ‚¬Ã¯Â¸Â Light Mode'}
        </button>
        <button onClick={onLogout} style={{display:'flex',alignItems:'center',gap:10,background:'none',border:'1px solid var(--border)',color:'var(--muted)',cursor:'pointer',fontSize:13,fontFamily:'var(--font-body)',padding:'10px 14px',width:'100%',borderRadius:8,transition:'all .2s'}}
          onMouseEnter={e=>{e.currentTarget.style.color='var(--red)';e.currentTarget.style.borderColor='rgba(232,0,30,0.4)'}}
          onMouseLeave={e=>{e.currentTarget.style.color='var(--muted)';e.currentTarget.style.borderColor='var(--border)'}}>
          <FiLogOut size={15}/> Sign Out
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="admin-sidebar-desktop" style={{width:240,flexShrink:0,background:'var(--dark)',borderRight:'1px solid var(--border)',display:'flex',flexDirection:'column',position:'sticky',top:0,height:'100vh'}}>
        {sidebarContent}
      </aside>

      {/* Mobile Top Bar */}
      <div className="admin-topbar-mobile" style={{display:'none',position:'fixed',top:0,left:0,right:0,height:56,background:'var(--black)',backdropFilter:'blur(20px)',borderBottom:'1px solid var(--border)',zIndex:200,alignItems:'center',padding:'0 16px',gap:12}}>
        <button onClick={()=>setMobileOpen(true)} style={{background:'none',border:'1px solid var(--border)',color:'var(--white)',width:38,height:38,borderRadius:8,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:30,height:30,background:'var(--red)',clipPath:'polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-display)',fontSize:11,fontWeight:900,color:'white'}}>ATV</div>
          <span style={{fontFamily:'var(--font-display)',fontSize:13,fontWeight:700,letterSpacing:'2px',color:'var(--white)',textTransform:'uppercase'}}>Admin</span>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div style={{position:'fixed',inset:0,zIndex:300,display:'flex'}} onClick={()=>setMobileOpen(false)}>
          <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.4)',backdropFilter:'blur(2px)'}}/>
          <aside onClick={e=>e.stopPropagation()} style={{width:220,background:'var(--dark)',borderRight:'1px solid var(--border)',display:'flex',flexDirection:'column',height:'100%',position:'relative',zIndex:1,animation:'slideInRight .3s cubic-bezier(0.16,1,0.3,1)'}}>
            <button onClick={()=>setMobileOpen(false)} style={{position:'absolute',top:16,right:16,background:'none',border:'none',color:'var(--muted)',cursor:'pointer',padding:4}}><FiX size={20}/></button>
            {sidebarContent}
          </aside>
        </div>
      )}
      <style>{`
        @media (max-width: 900px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-topbar-mobile { display: flex !important; }
          .admin-main-content { padding-top: 56px !important; }
        }
        @keyframes slideInRight { from { transform: translateX(-100%); } to { transform: translateX(0); } }
      `}</style>
    </>
  )
}

export function AdminDashboard() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  
  // Light Mode
  const [lightMode, setLightMode] = useState(() => localStorage.getItem('admin_theme') === 'light')
  const toggleLight = () => setLightMode(m => {
    const next = !m
    localStorage.setItem('admin_theme', next ? 'light' : 'dark')
    return next
  })

  // Jerseys State
  const [jerseys, setJerseys] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [images, setImages] = useState([])
  const imgRef = useRef(null)
  const [form, setForm] = useState({ title: '', club: '', category: '', price: '', badge: '', is_featured: false })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  // Orders State
  const [orders, setOrders] = useState([])
  
  // TikTok State
  const [tiktok, setTiktok] = useState([])
  const [showTiktokAdd, setShowTiktokAdd] = useState(false)
  const [tiktokForm, setTiktokForm] = useState({ title: '', url: '', thumbnail: null })
  
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [resJ, resO, resT] = await Promise.all([
          api.get('/api/jerseys/'),
          api.get('/api/orders/admin/'),
          api.get('/api/brand/tiktok/').catch(() => ({ data: [] }))
        ])
        
        const jData = resJ.data?.results || resJ.data || []
        const oData = resO.data?.results || resO.data || []
        const tData = resT.data?.results || resT.data || []
        
        setJerseys(Array.isArray(jData) ? jData : [])
        setOrders(Array.isArray(oData) ? oData : [])
        setTiktok(Array.isArray(tData) ? tData : [])
      } catch (err) {
        console.error('Admin data fetch error:', err)
        toast.error('Failed to load admin data')
        setJerseys([])
        setOrders([])
        setTiktok([])
      } finally {
        setLoading(false)
      }
    }
    fetchAdminData()
  }, [])

  const saveTiktok = async () => {
    if(!tiktokForm.title || !tiktokForm.url) return
    const formData = new FormData()
    formData.append('title', tiktokForm.title)
    formData.append('url', tiktokForm.url)
    if(tiktokForm.thumbnail) formData.append('thumbnail', tiktokForm.thumbnail)
    
    try {
      const res = await api.post('/api/brand/tiktok/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setTiktok(p => [res.data, ...p])
      setShowTiktokAdd(false)
      setTiktokForm({ title: '', url: '', thumbnail: null })
      toast.success('TikTok video added!')
    } catch (err) {
      toast.error('Failed to add TikTok video')
    }
  }

  const deleteTiktok = async (id) => {
    if(!window.confirm('Delete this video?')) return
    try {
      await api.delete(`/api/brand/tiktok/${id}/`)
      setTiktok(p => p.filter(v => v.id !== id))
      toast.success('Deleted')
    } catch (err) {
      toast.error('Failed to delete')
    }
  }

  const deleteJersey = async (id) => {
    if(!window.confirm('Are you sure you want to delete this jersey?')) return
    try {
      await api.delete(`/api/jerseys/${id}/`)
      setJerseys(p => p.filter(j => j.id !== id))
      toast.success('Jersey deleted')
    } catch (err) {
      toast.error('Failed to delete jersey')
    }
  }

  const STATS = [
    { label: 'Total Jerseys', val: jerseys.length, icon: '', color: 'rgba(232,0,30,0.12)', border: 'rgba(232,0,30,0.3)' },
    { label: 'Total Orders', val: orders.length, icon: 'Ã°Å¸â€œÂ¦', color: 'rgba(255,184,0,0.12)', border: 'rgba(255,184,0,0.3)' },
    { label: 'Revenue', val: formatPrice(orders.filter(o=>o.payment_status).reduce((a,b)=>a+Number(b.total),0)), icon: 'Ã°Å¸â€™Â°', color: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)' },
    { label: 'Pending', val: orders.filter(o=>o.status==='Pending').length, icon: 'Ã¢ÂÂ³', color: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.3)' },
  ]

  const handleImgUpload=(e)=>{
    const files=Array.from(e.target.files)
    // Store both raw File object for API and URL for preview
    setImages(prev=>[...prev,...files.map(f=>({file:f, url:URL.createObjectURL(f), name:f.name}))])
  }

  const saveJersey = async () => {
    if(!form.title || !form.price) {
      toast.error('Title and Price are required')
      return
    }
    
    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('price', form.price)
      formData.append('badge', form.badge || '')
      formData.append('is_featured', form.is_featured)
      formData.append('is_new', true)
      formData.append('description', 'Official high-quality jersey. Nationwide delivery.')
      
      // Map Club and Category names to IDs
      const clubObj = clubs.find(c => c.name === form.club)
      const catObj = categories.find(c => c.name === form.category)
      
      if (clubObj) formData.append('club_id', clubObj.id)
      if (catObj) formData.append('category_id', catObj.id)

      // Add all files
      images.forEach(img => {
        if (img.file) formData.append('images', img.file)
      })

      const res = await api.post('/api/jerseys/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setJerseys(p => [res.data, ...p])
      setShowAdd(false)
      setForm({title:'', club:'', category:'', price:'', badge:'', is_featured:false})
      setImages([])
      toast.success('Jersey added to server successfully!')
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.detail || 'Failed to save to server')
    }
  }

  const isTikTok = pathname === '/admin/tiktok'
  const isJerseys = pathname === '/admin/jerseys'
  const isOrders = pathname === '/admin/orders'
  const isOverview = pathname === '/admin'

  return (
    <div style={{display:'flex',minHeight:'100vh',background: lightMode ? '#f0f2f5' : 'var(--black)'}}>
      {lightMode && (
        <style>{`
          .admin-light {
            --black: #f0f2f5;
            --dark: #ffffff;
            --dark2: #f7f8fa;
            --dark3: #eef0f4;
            --dark4: #e4e6eb;
            --white: #0d0d0d;
            --off-white: #1a1a1a;
            --muted: #555e70;
            --border: rgba(0,0,0,0.1);
            --border-red: rgba(232,0,30,0.3);
          }
          .admin-light .form-input, .admin-light .form-select {
            background: #ffffff !important;
            border-color: rgba(0,0,0,0.15) !important;
            color: #0d0d0d !important;
          }
          .admin-light .form-label { color: #333 !important; }
          .admin-light .btn-outline { color: #333 !important; border-color: rgba(0,0,0,0.2) !important; }
          .admin-light table th { color: #666 !important; }
          .admin-light table tr:hover td { background: rgba(232,0,30,0.04) !important; }
        `}</style>
      )}
      <div className={lightMode ? 'admin-light' : ''} style={{display:'contents'}}>
      <AdminNav onLogout={()=>navigate('/login')} lightMode={lightMode} toggleLight={toggleLight}/>
      <main className="admin-main-content" style={{flex:1,overflowY:'auto',minWidth:0,background: lightMode ? '#f0f2f5' : 'var(--black)'}}>
        <div style={{padding:'24px 28px',borderBottom:`1px solid ${lightMode ? 'rgba(0,0,0,0.1)' : 'var(--border)'}`,background: lightMode ? '#ffffff' : 'var(--dark)',display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,flexWrap:'wrap'}}>
          <div>
            <p style={{fontSize:10,color:'var(--red)',fontFamily:'var(--font-display)',fontWeight:700,letterSpacing:'3px',textTransform:'uppercase',marginBottom:4}}>
              {isTikTok ? 'Content' : isJerseys ? 'Inventory' : isOrders ? 'Sales' : 'Overview'}
            </p>
            <h1 style={{fontFamily:'var(--font-display)',fontSize:'clamp(20px,3vw,28px)',textTransform:'uppercase',letterSpacing:'2px',lineHeight:1,color: lightMode ? '#0d0d0d' : 'var(--white)'}}>
              {isTikTok ? 'TikTok Management' : isJerseys ? 'Jersey Management' : isOrders ? 'Order Management' : 'Dashboard'}
            </h1>
          </div>
          <div style={{display:'flex',gap:10,alignItems:'center'}}>
            {isJerseys && <button className="btn btn-red btn-sm" onClick={()=>setShowAdd(true)} style={{display:'flex',alignItems:'center',gap:8,whiteSpace:'nowrap'}}><FiPlus size={15}/> Add Jersey</button>}
            {isTikTok && <button className="btn btn-red btn-sm" onClick={()=>setShowTiktokAdd(true)} style={{display:'flex',alignItems:'center',gap:8,whiteSpace:'nowrap'}}><FiPlus size={15}/> Add Video</button>}
          </div>
        </div>
        
        <div style={{padding:'clamp(16px,3vw,32px) clamp(16px,4vw,36px)'}}>
          {isOverview && (
            <>
              {/* Stats */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:16,marginBottom:32}}>
                {STATS.map(s=>(
                  <div key={s.label} style={{background:s.color,border:`1px solid ${s.border}`,borderRadius:12,padding:'20px 22px',transition:'all .3s',cursor:'default'}}
                    onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 12px 36px rgba(0,0,0,0.5)'}}
                    onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16}}>
                      <div style={{fontSize:28}}>{s.icon}</div>
                      <div style={{width:8,height:8,borderRadius:'50%',background:s.border}}/>
                    </div>
                    <p style={{fontSize:11,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'1.5px',marginBottom:6,fontWeight:600}}>{s.label}</p>
                    <p style={{fontSize:'clamp(20px,2.5vw,26px)',fontWeight:900,color:'var(--white)',fontFamily:'var(--font-display)',letterSpacing:'1px'}}>{s.val}</p>
                  </div>
                ))}
              </div>
              
              {/* Recent Orders Preview */}
              <div style={{background:'var(--dark2)',border:'1px solid var(--border)',borderRadius:12,overflow:'hidden'}}>
                <div style={{padding:20,borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                   <h3 style={{margin:0,fontSize:16,textTransform:'uppercase',fontFamily:'var(--font-display)'}}>Recent Orders</h3>
                   <Link to="/admin/orders" style={{fontSize:12,color:'var(--red)',textDecoration:'none'}}>View All &rarr;</Link>
                </div>
                <div style={{padding:15}}>
                   {orders.slice(0,5).map(o => (
                     <Link to={`/admin/orders/${o.id}`} key={o.id} style={{display:'flex',justifyContent:'space-between',padding:'12px',borderBottom:'1px solid var(--border)',textDecoration:'none',color:'inherit'}}>
                        <div>
                          <p style={{fontWeight:600,fontSize:14}}>{o.first_name} {o.last_name}</p>
                          <p style={{fontSize:11,color:'var(--muted)'}}>{o.email}</p>
                        </div>
                        <div style={{textAlign:'right'}}>
                          <p style={{fontWeight:700,color:'var(--white)'}}>{formatPrice(o.total)}</p>
                          <p style={{fontSize:10,color:'var(--gold)'}}>{o.status}</p>
                        </div>
                     </Link>
                   ))}
                </div>
              </div>
            </>
          )}

          {isTikTok && (
            <div className="grid-responsive" style={{gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))',gap:24}}>
              {tiktok.map(v => (
                <div key={v.id} style={{background:'var(--dark2)',border:'1px solid var(--border)',borderRadius:12,overflow:'hidden'}}>
                  <div style={{aspectRatio:'16/9',background:'var(--dark3)',position:'relative'}}>
                    {v.thumbnail ? <img src={v.thumbnail} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',color:'var(--muted)'}}>No Preview</div>}
                    <button onClick={()=>deleteTiktok(v.id)} style={{position:'absolute',top:10,right:10,background:'rgba(232,0,30,0.8)',border:'none',color:'white',padding:8,borderRadius:6,cursor:'pointer'}}><FiTrash2 size={14}/></button>
                  </div>
                  <div style={{padding:16}}>
                    <p style={{fontWeight:700,fontSize:14,marginBottom:4}}>{v.title}</p>
                    <a href={v.url} target="_blank" rel="noreferrer" style={{fontSize:12,color:'var(--red)',textDecoration:'none'}}>{v.url.slice(0,35)}...</a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isOrders && (
            <div style={{background:'var(--dark2)',border:'1px solid var(--border)',borderRadius:12,overflow:'hidden'}}>
              {orders.length === 0 && <p style={{padding:40,textAlign:'center',color:'var(--muted)',fontSize:14}}>No orders yet.</p>}
              {orders.map(o => (
                <Link to={`/admin/orders/${o.id}`} key={o.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'16px 20px',borderBottom:'1px solid var(--border)',textDecoration:'none',color:'inherit',flexWrap:'wrap',gap:12,transition:'background .2s'}}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(232,0,30,0.04)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <div style={{display:'flex',gap:14,alignItems:'center'}}>
                    <div style={{width:42,height:42,background:'rgba(232,0,30,0.1)',borderRadius:8,border:'1px solid rgba(232,0,30,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0}}>Ã°Å¸â€œÂ¦</div>
                    <div>
                      <p style={{fontWeight:700,fontSize:14,color:'var(--white)'}}>{o.first_name} {o.last_name}</p>
                      <p style={{fontSize:11,color:'var(--muted)',marginTop:2}}>{o.email} {o.city ? `- ${o.city}` : ''}</p>
                    </div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <p style={{fontWeight:900,fontSize:16,color:'var(--white)',fontFamily:'var(--font-display)'}}>{formatPrice(o.total)}</p>
                    <span style={{display:'inline-block',marginTop:4,fontSize:9,fontWeight:700,color:o.status==='Completed'?'#4ade80':'var(--gold)',textTransform:'uppercase',letterSpacing:'1px',background:o.status==='Completed'?'rgba(74,222,128,0.1)':'rgba(255,184,0,0.1)',border:`1px solid ${o.status==='Completed'?'rgba(74,222,128,0.3)':'rgba(255,184,0,0.3)'}`,padding:'3px 8px',borderRadius:20}}>{o.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          {isJerseys && (
            <>
              {/* Card Grid */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:18,marginBottom:32}}>
                {jerseys.map(j => (
                  <div key={j.id} style={{background:'var(--dark2)',border:'1px solid var(--border)',borderRadius:12,overflow:'hidden',transition:'all .3s'}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(232,0,30,0.4)';e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 16px 40px rgba(0,0,0,0.5)'}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none'}}>
                    <div style={{height:160,background:'var(--dark3)',position:'relative',overflow:'hidden'}}>
                      {j.images?.[0]
                        ? <img src={j.images[0].image || j.images[0].url || j.images[0]} style={{width:'100%',height:'100%',objectFit:'cover'}} alt={j.title}/>
                        : <div style={{height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:40,opacity:.3}}>👕</div>}
                      <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(0,0,0,0.6) 0%,transparent 60%)',pointerEvents:'none'}}/>
                      {j.badge && <span style={{position:'absolute',top:10,left:10,background:j.badge==='New'?'var(--red)':j.badge==='Sale'?'var(--gold)':j.badge==='Hot'?'#FF8C00':'#555',color:j.badge==='Sale'?'black':'white',fontSize:9,fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',padding:'3px 8px',borderRadius:20}}>{j.badge}</span>}
                      <div style={{position:'absolute',top:10,right:10,display:'flex',gap:5}}>
                        <button style={{background:'rgba(0,0,0,0.7)',backdropFilter:'blur(4px)',border:'1px solid rgba(255,255,255,0.1)',color:'var(--gold)',padding:'5px 7px',borderRadius:6,cursor:'pointer',display:'flex'}}><FiEdit2 size={12}/></button>
                        <button onClick={()=>deleteJersey(j.id)} style={{background:'rgba(232,0,30,0.8)',border:'none',color:'white',padding:'5px 7px',borderRadius:6,cursor:'pointer',display:'flex'}}><FiTrash2 size={12}/></button>
                      </div>
                    </div>
                    <div style={{padding:'12px 14px'}}>
                      <p style={{fontSize:9,color:'var(--red)',textTransform:'uppercase',letterSpacing:'2px',marginBottom:4,fontWeight:700}}>{typeof j.club==='object'?j.club.name:j.club}</p>
                      <p style={{fontWeight:700,fontSize:13,color:'var(--white)',lineHeight:1.3,marginBottom:8}}>{j.title}</p>
                      <p style={{fontSize:15,color:'var(--red)',fontWeight:900,fontFamily:'var(--font-display)'}}>{formatPrice(j.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Table (desktop) */}
              <div style={{background:'var(--dark2)',border:'1px solid var(--border)',borderRadius:12,overflow:'hidden'}}>
                <div style={{padding:'16px 22px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <h3 style={{fontFamily:'var(--font-display)',fontSize:16,textTransform:'uppercase',letterSpacing:'2px',margin:0}}>All Jerseys</h3>
                  <span style={{fontSize:12,color:'var(--muted)'}}>{jerseys.length} total</span>
                </div>
                <div style={{overflowX:'auto'}}>
                  <table style={{width:'100%',borderCollapse:'collapse',minWidth:600}}>
                    <thead>
                      <tr style={{background:'var(--dark3)'}}>
                        {['Jersey','Club','Category','Price','Badge','Actions'].map(h=>(
                          <th key={h} style={{padding:'12px 16px',textAlign:'left',fontSize:9,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'var(--muted)',borderBottom:'1px solid var(--border)',whiteSpace:'nowrap'}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {jerseys.map(j=>(
                        <tr key={j.id} style={{borderBottom:'1px solid var(--border)',transition:'background .2s'}}
                          onMouseEnter={e=>e.currentTarget.style.background='rgba(232,0,30,0.03)'}
                          onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                          <td style={{padding:'12px 16px'}}>
                            <div style={{display:'flex',alignItems:'center',gap:10}}>
                              <div style={{width:44,height:44,borderRadius:6,background:'var(--dark3)',flexShrink:0,overflow:'hidden',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>
                                {j.images?.[0]?<img src={j.images[0].image||j.images[0].url||j.images[0]} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:'👕'}
                              </div>
                              <p style={{fontSize:12,fontWeight:600,color:'var(--off-white)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',maxWidth:160}}>{j.title}</p>
                            </div>
                          </td>
                          <td style={{padding:'12px 16px',fontSize:11,color:'var(--muted)',whiteSpace:'nowrap'}}>{j.club_name||(typeof j.club==='object'?j.club.name:j.club)}</td>
                          <td style={{padding:'12px 16px',fontSize:11,color:'var(--muted)',whiteSpace:'nowrap'}}>{j.category_name||(typeof j.category==='object'?j.category.name:j.category)}</td>
                          <td style={{padding:'12px 16px',fontFamily:'var(--font-display)',fontSize:14,color:'var(--red)',whiteSpace:'nowrap'}}>{formatPrice(j.price)}</td>
                          <td style={{padding:'12px 16px'}}>
                            {j.badge&&<span style={{fontSize:9,fontWeight:700,color:j.badge==='Sale'?'black':'white',background:j.badge==='New'?'var(--red)':j.badge==='Sale'?'var(--gold)':j.badge==='Hot'?'#FF8C00':'#444',padding:'3px 8px',borderRadius:20}}>{j.badge}</span>}
                          </td>
                          <td style={{padding:'12px 16px'}}>
                            <div style={{display:'flex',gap:6}}>
                              <button style={{display:'flex',alignItems:'center',gap:4,fontSize:11,color:'var(--gold)',background:'rgba(255,184,0,0.08)',border:'1px solid rgba(255,184,0,0.2)',borderRadius:4,padding:'4px 8px',cursor:'pointer',whiteSpace:'nowrap'}}><FiEdit2 size={10}/> Edit</button>
                              <button onClick={()=>deleteJersey(j.id)} style={{display:'flex',alignItems:'center',gap:4,fontSize:11,color:'#f87171',background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:4,padding:'4px 8px',cursor:'pointer',whiteSpace:'nowrap'}}><FiTrash2 size={10}/> Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* TikTok Add Modal */}
        {showTiktokAdd && (
          <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}}>
             <div style={{background:'var(--dark)',border:'1px solid var(--border)',borderRadius:16,width:'100%',maxWidth:450,overflow:'hidden'}}>
               <div style={{padding:24,borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                 <h3 style={{margin:0,textTransform:'uppercase',fontFamily:'var(--font-display)'}}>Add TikTok Video</h3>
                 <FiX size={20} style={{cursor:'pointer'}} onClick={()=>setShowTiktokAdd(false)}/>
               </div>
               <div style={{padding:24,display:'flex',flexDirection:'column',gap:16}}>
                 <div><label className="form-label">Video Title</label><input className="form-input" value={tiktokForm.title} onChange={e=>setTiktokForm(p=>({...p,title:e.target.value}))} placeholder="e.g. Man United Review"/></div>
                 <div><label className="form-label">TikTok Link</label><input className="form-input" value={tiktokForm.url} onChange={e=>setTiktokForm(p=>({...p,url:e.target.value}))} placeholder="https://tiktok.com/@..."/></div>
                 <div>
                   <label className="form-label">Thumbnail Image</label>
                   <input type="file" onChange={e=>setTiktokForm(p=>({...p,thumbnail:e.target.files[0]}))} style={{display:'none'}} id="tk-img"/>
                   <label htmlFor="tk-img" style={{display:'block',padding:12,border:'2px dashed var(--border)',borderRadius:8,textAlign:'center',cursor:'pointer',fontSize:13,color:'var(--muted)'}}>
                     {tiktokForm.thumbnail ? tiktokForm.thumbnail.name : 'Click to upload thumbnail'}
                   </label>
                 </div>
                 <button onClick={saveTiktok} className="btn btn-red" style={{marginTop:8,justifyContent:'center'}}>Save Video &rarr;</button>
               </div>
             </div>
          </div>
        )}

      </main>

      {/* Add Jersey Modal */}
      {showAdd && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',backdropFilter:'blur(6px)',zIndex:300,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
          <div style={{background:'var(--dark2)',border:'1px solid var(--border-red)',borderRadius:16,width:'100%',maxWidth:720,maxHeight:'90vh',overflowY:'auto',animation:'fadeInUp .3s ease'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'22px 28px',borderBottom:'1px solid var(--border)',position:'sticky',top:0,background:'var(--dark2)',zIndex:1}}>
              <h2 style={{fontFamily:'var(--font-display)',fontSize:22,textTransform:'uppercase',letterSpacing:'2px'}}>Add New Jersey</h2>
              <button onClick={()=>setShowAdd(false)} style={{background:'none',border:'1px solid var(--border)',color:'var(--muted)',width:34,height:34,borderRadius:'50%',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>x</button>
            </div>
            <div style={{padding:28,display:'flex',flexDirection:'column',gap:20}}>
              {/* Image uploader */}
              <div>
                <label className="form-label">Photos</label>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(100px,1fr))',gap:10,marginBottom:8}}>
                  {images.map((img,i)=>(
                    <div key={i} style={{height:90,borderRadius:8,overflow:'hidden',border:'1px solid var(--border)',position:'relative'}}>
                      <img src={img.url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                      <button onClick={()=>setImages(p=>p.filter((_,j)=>j!==i))} style={{position:'absolute',top:4,right:4,width:20,height:20,borderRadius:'50%',background:'rgba(239,68,68,0.9)',border:'none',color:'white',cursor:'pointer',fontSize:12}}>x</button>
                    </div>
                  ))}
                  <div onClick={()=>imgRef.current.click()} style={{height:90,borderRadius:8,border:'2px dashed var(--border)',background:'var(--dark3)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:4,cursor:'pointer',transition:'all .25s'}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--red)';e.currentTarget.style.background='rgba(232,0,30,0.05)'}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.background='var(--dark3)'}}>
                    <FiUpload size={18} color="var(--muted)"/>
                    <span style={{fontSize:10,color:'var(--muted)'}}>Add Photo</span>
                  </div>
                </div>
                <input ref={imgRef} type="file" multiple accept="image/*" style={{display:'none'}} onChange={handleImgUpload}/>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                <div style={{gridColumn:'1/-1'}}><label className="form-label">Jersey Title *</label><input className="form-input" value={form.title} onChange={e=>set('title',e.target.value)} placeholder="e.g. Manchester United Home 2025/26"/></div>
                <div><label className="form-label">Club *</label><select className="form-select" value={form.club} onChange={e=>set('club',e.target.value)}><option value="">Select Club</option>{STATIC_CLUBS.map(c=><option key={c.id}>{c.name}</option>)}</select></div>
                <div><label className="form-label">Category</label><select className="form-select" value={form.category} onChange={e=>set('category',e.target.value)}>{STATIC_CATEGORIES.map(c=><option key={c.id}>{c.name}</option>)}</select></div>
                <div><label className="form-label">Price (NGN) *</label><input className="form-input" type="number" value={form.price} onChange={e=>set('price',e.target.value)} placeholder="e.g. 15000"/></div>
                <div><label className="form-label">Badge</label><select className="form-select" value={form.badge} onChange={e=>set('badge',e.target.value)}><option value="">No Badge</option><option>New</option><option>Hot</option><option>Retro</option><option>Sale</option></select></div>
              </div>

              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <button onClick={()=>set('is_featured',!form.is_featured)} style={{width:44,height:24,borderRadius:12,border:'none',cursor:'pointer',background:form.is_featured?'var(--red)':'var(--dark4)',position:'relative',transition:'background .25s'}}>
                  <div style={{position:'absolute',top:3,left:form.is_featured?'calc(100% - 21px)':3,width:18,height:18,borderRadius:'50%',background:'white',transition:'left .25s'}}/>
                </button>
                <span style={{fontSize:13,color:form.is_featured?'var(--red)':'var(--muted)'}}>Feature on homepage</span>
              </div>
            </div>
            <div style={{padding:'18px 28px',borderTop:'1px solid var(--border)',display:'flex',gap:12,justifyContent:'flex-end',position:'sticky',bottom:0,background:'var(--dark2)'}}>
              <button onClick={()=>setShowAdd(false)} className="btn btn-outline btn-sm">Cancel</button>
              <button onClick={saveJersey} className="btn btn-red btn-sm"><FiPlus size={14}/> Add Jersey</button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

// Ã¢â€â‚¬Ã¢â€â‚¬ ADMIN ORDER DETAIL Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
export function AdminOrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/api/orders/admin/${id}/`)
        setOrder(res.data)
      } catch (err) {
        toast.error('Failed to load order details')
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [id])

  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="loader" /></div>
  if (!order) return <Navigate to="/admin" replace />

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--black)' }}>
      <AdminNav onLogout={() => navigate('/login')} />
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '32px 36px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={() => navigate('/admin')} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--muted)', width: 34, height: 34, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiArrowLeft /></button>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, textTransform: 'uppercase', letterSpacing: '2px' }}>Order Detail</h1>
          </div>
          <span className="badge" style={{ background: order.status === 'Completed' ? 'var(--green-stock)' : 'var(--gold)', color: order.status === 'Completed' ? 'white' : 'black' }}>{order.status}</span>
        </div>

        <div style={{ padding: '32px 36px' }}>
          <div className="responsive-grid" style={{ gap: 24, alignItems: 'start' }}>
            {/* Customer Info */}
            <div style={{ background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, textTransform: 'uppercase', marginBottom: 20, color: 'var(--red)' }}>Customer Information</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div><p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase' }}>Full Name</p><p style={{ fontSize: 15, fontWeight: 600 }}>{order.customer_name}</p></div>
                <div><p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase' }}>Phone / WhatsApp</p><p style={{ fontSize: 15, fontWeight: 600 }}>{order.customer_phone}</p></div>
                <div><p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase' }}>Email</p><p style={{ fontSize: 15, fontWeight: 600 }}>{order.customer_email || 'N/A'}</p></div>
                <div><p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase' }}>Delivery Address</p><p style={{ fontSize: 14, lineHeight: 1.5 }}>{order.address}, {order.city}, {order.state} State</p></div>
                <div><p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase' }}>Payment Method</p><p style={{ fontSize: 14 }}>{order.payment_method}</p></div>
              </div>
            </div>

            {/* Order Items */}
            <div style={{ background: 'var(--dark2)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, textTransform: 'uppercase', padding: '24px 24px 0', marginBottom: 20 }}>Order Items</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--dark3)' }}>
                    {['Item', 'Size', 'Qty', 'Price', 'Subtotal'].map(h => (
                      <th key={h} style={{ padding: '12px 18px', textAlign: 'left', fontSize: 10, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 4, background: 'var(--dark3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}></div>
                          <p style={{ fontSize: 13, fontWeight: 600 }}>{item.jersey_title || `Jersey #${item.jersey}`}</p>
                        </div>
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: 13 }}>{item.size}</td>
                      <td style={{ padding: '14px 18px', fontSize: 13 }}>x{item.quantity}</td>
                      <td style={{ padding: '14px 18px', fontSize: 13 }}>{formatPrice(item.price)}</td>
                      <td style={{ padding: '14px 18px', fontFamily: 'var(--font-price)', fontSize: 16, color: 'var(--white)' }}>{formatPrice(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ padding: 24, borderTop: '2px solid var(--border)', background: 'var(--dark3)', textAlign: 'right' }}>
                <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase' }}>Total Amount</p>
                <p style={{ fontFamily: 'var(--font-price)', fontSize: 32, color: 'var(--red)' }}>{formatPrice(order.total)}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


