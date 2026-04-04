// ── Footer.jsx ───────────────────────────────────────────────
import { Link } from 'react-router-dom'
import { FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi'
import { SiTiktok } from 'react-icons/si'

export function Footer() {
  const LINKS = {
    Shop: ['/shop','Home Kits','/shop?category=away','Away Kits','/shop?category=retro','Retro Classics','/shop?category=national','National Teams'],
    Info: ['/about','About Us','/contact','Contact','/shop','All Jerseys'],
  }
  return (
    <footer style={{ background:'var(--dark)', borderTop:'3px solid var(--red)' }}>
      <div className="container" style={{ padding:'60px clamp(16px,4vw,60px) 40px' }}>
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <div style={{
                width:40,height:40,background:'var(--red)',
                clipPath:'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
                display:'flex',alignItems:'center',justifyContent:'center',
                fontFamily:'var(--font-display)',fontSize:14,fontWeight:900,color:'white',
              }}>ATV</div>
              <div>
                <div style={{fontFamily:'var(--font-display)',fontSize:16,fontWeight:900,letterSpacing:'2px',color:'var(--white)',textTransform:'uppercase'}}>Adekunle TV</div>
                <div style={{fontFamily:'var(--font-display)',fontSize:9,color:'var(--red)',letterSpacing:'3px',textTransform:'uppercase'}}>Jerseys</div>
              </div>
            </div>
            <p style={{ fontSize:13,color:'var(--muted)',lineHeight:1.8,marginBottom:20,fontWeight:300,maxWidth:260 }}>
              Nigeria's most trusted football jersey store. Original quality. Affordable prices.
              Nationwide delivery. <em style={{color:'var(--red)'}}>Let's talk football!</em>
            </p>
            <div style={{ display:'flex', gap:10 }}>
              {[
                { href:'https://tiktok.com/@adekunle_tv5', Icon:SiTiktok },
                { href:'https://instagram.com/adekunle_tv5', Icon:FiInstagram },
                { href:'https://twitter.com/adekunletv', Icon:FiTwitter },
                { href:'https://facebook.com/adekunletv', Icon:FiFacebook },
              ].map(({ href, Icon }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                  style={{
                    width:36,height:36,borderRadius:4,border:'1px solid var(--border)',
                    background:'var(--dark2)',display:'flex',alignItems:'center',justifyContent:'center',
                    color:'var(--muted)',textDecoration:'none',transition:'all 0.2s',
                  }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--red)';e.currentTarget.style.color='var(--red)'}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--muted)'}}>
                  <Icon size={15}/>
                </a>
              ))}
            </div>
          </div>

          {/* Cols */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 style={{fontFamily:'var(--font-display)',fontSize:11,fontWeight:700,letterSpacing:'3px',textTransform:'uppercase',color:'var(--white)',marginBottom:20}}>{title}</h4>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {Array.from({length:links.length/2},(_,i)=>(
                  <Link key={i} to={links[i*2]} className="underline-hover" style={{fontSize:13,color:'var(--muted)',textDecoration:'none',fontWeight:300, width: 'fit-content'}}>
                    {links[i*2+1]}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 style={{fontFamily:'var(--font-display)',fontSize:11,fontWeight:700,letterSpacing:'3px',textTransform:'uppercase',color:'var(--white)',marginBottom:20}}>Contact</h4>
            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              {[
                {icon:'💬',label:'WhatsApp',val:'Chat Now',href:'https://wa.me/2348000000000'},
                {icon:'📱',label:'TikTok',val:'@adekunle_tv5',href:'https://tiktok.com/@adekunle_tv5'},
                {icon:'📧',label:'Email',val:'adekunletv@gmail.com',href:'mailto:adekunletv@gmail.com'},
              ].map(c=>(
                <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" style={{display:'flex',flexDirection:'column',gap:2,textDecoration:'none'}}>
                  <span style={{fontSize:10,fontFamily:'var(--font-display)',letterSpacing:'2px',textTransform:'uppercase',color:'var(--red)'}}>{c.icon} {c.label}</span>
                  <span className="underline-hover" style={{fontSize:13,color:'var(--muted)',fontWeight:300, width: 'fit-content'}}>{c.val}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{borderTop:'1px solid var(--border)',paddingTop:24,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12}}>
          <p style={{fontSize:12,color:'var(--muted-dark)',fontWeight:300}}>© {new Date().getFullYear()} Adekunle TV Jerseys. All rights reserved.</p>
          <p style={{fontSize:12,color:'var(--muted-dark)',fontWeight:300}}>
            Built by <a href="#" style={{color:'var(--red)',textDecoration:'none'}}>M.B.O WebDev</a> · Django + React
          </p>
        </div>
      </div>
    </footer>
  )
}
export default Footer