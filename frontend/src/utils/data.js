export const CLUBS = [
  { id:1, name:'Manchester United', slug:'man-united', country:'England', color:'#E8001E', emoji:'🔴', icon:'/clubs/man-united.svg', jersey:'/jerseys/man-united-front.png' },
  { id:2, name:'Chelsea',           slug:'chelsea',    country:'England', color:'#034694', emoji:'🔵', icon:'/clubs/chelsea.svg', jersey:'/jerseys/chelsea.png' },
  { id:3, name:'Arsenal',           slug:'arsenal',    country:'England', color:'#EF0107', emoji:'🔴', icon:'/jerseys/arsenal-badge.png', jersey:null },
  { id:4, name:'Barcelona',         slug:'barcelona',  country:'Spain',   color:'#A50044', emoji:'🔵🔴', icon:'/clubs/barcelona.svg', jersey:'/jerseys/barcelona.png' },
  { id:5, name:'Real Madrid',       slug:'real-madrid',country:'Spain',   color:'#FEBE10', emoji:'⚪', icon:'/jerseys/real-madrid-badge.png', jersey:null },
  { id:6, name:'Liverpool',         slug:'liverpool',  country:'England', color:'#C8102E', emoji:'🔴', icon:'/jerseys/liverpool-badge.png', jersey:null },
  { id:7, name:'Nigeria',           slug:'nigeria',    country:'Nigeria', color:'#008751', emoji:'🇳🇬', icon:'/jerseys/nigeria-badge.png', jersey:null },
  { id:8, name:'PSG',               slug:'psg',        country:'France',  color:'#004170', emoji:'🔵🔴', icon:'/jerseys/psg-badge.png', jersey:null },
  { id:9, name:'Bayern Munich',     slug:'bayern',     country:'Germany', color:'#DC052D', emoji:'🔴', icon:'/jerseys/bayern-badge.png', jersey:null },
  { id:10, name:'Man City',         slug:'man-city',   country:'England', color:'#6CABDD', emoji:'🔵', icon:'/jerseys/man-city-badge.png', jersey:null },
]

export const CATEGORIES = [
  { id:1, name:'Home Kits',        slug:'home',     desc:'Official home jerseys' },
  { id:2, name:'Away Kits',        slug:'away',     desc:'Away & third kits' },
  { id:3, name:'Retro Classics',   slug:'retro',    desc:'Vintage & throwback' },
  { id:4, name:'National Teams',   slug:'national', desc:'Country jerseys' },
  { id:5, name:'Special Edition',  slug:'special',  desc:'Limited & collector' },
]

export const JERSEYS = [
  {
    id:1, slug:'man-united-home-2025',
    title:'Manchester United Home 2025/26',
    club:'Manchester United', category:'Home Kits',
    price:15000, old_price:null,
    sizes:{ XS:5, S:8, M:0, L:6, XL:4, XXL:2 },
    badge:'New', is_featured:true, is_new:true,
    images:['/jerseys/man-united-front.png', '/jerseys/man-united-back.png'], rating:4.8, reviews:124,
    description:'Official 2025/26 Manchester United home kit. Premium quality fabric. Nike Dri-FIT technology. Same as what the players wear on match day.',
  },
  {
    id:2, slug:'nigeria-afcon-2025',
    title:'Nigeria Super Eagles AFCON 2025',
    club:'Nigeria', category:'National Teams',
    price:12000, old_price:16000,
    sizes:{ XS:3, S:6, M:10, L:8, XL:5, XXL:1 },
    badge:'Hot', is_featured:true, is_new:true,
    images:['https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80'], rating:4.9, reviews:89,
    description:'Wear the pride of Nigeria. Official Super Eagles jersey for AFCON 2025. Green and white perfection. Limited stock available.',
  },
  {
    id:3, slug:'chelsea-home-2025',
    title:'Chelsea FC Home Kit 2025/26',
    club:'Chelsea', category:'Home Kits',
    price:14000, old_price:null,
    sizes:{ XS:2, S:5, M:7, L:9, XL:6, XXL:3 },
    badge:'New', is_featured:true, is_new:true,
    images:['/jerseys/chelsea.png'], rating:4.7, reviews:67,
    description:'Chelsea FC official home kit 2025/26. Iconic blue. Puma quality. Fast delivery nationwide.',
  },
  {
    id:4, slug:'barcelona-home-2025',
    title:'FC Barcelona Home 2025/26',
    club:'Barcelona', category:'Home Kits',
    price:14500, old_price:null,
    sizes:{ XS:0, S:4, M:8, L:10, XL:7, XXL:2 },
    badge:'New', is_featured:false, is_new:true,
    images:['/jerseys/barcelona.png'], rating:4.8, reviews:92,
    description:'FC Barcelona 2025/26 home jersey. Classic blaugrana stripes. Nike Dri-FIT. Perfect for fans.',
  },
  {
    id:5, slug:'nigeria-retro-1994',
    title:"Nigeria Retro Jersey 1994 World Cup",
    club:'Nigeria', category:'Retro Classics',
    price:18000, old_price:22000,
    sizes:{ XS:1, S:3, M:5, L:4, XL:2, XXL:0 },
    badge:'Retro', is_featured:true, is_new:false,
    images:['https://images.unsplash.com/photo-1621570070324-41ebb217521e?w=800&auto=format&fit=crop&q=80'], rating:5.0, reviews:156,
    description:"The legendary Nigeria 1994 World Cup jersey. The one Kai Cenat made famous. One of the most beautiful football jerseys ever made. Very limited stock.",
  },
  {
    id:6, slug:'real-madrid-home-2025',
    title:'Real Madrid Home 2025/26',
    club:'Real Madrid', category:'Home Kits',
    price:15500, old_price:null,
    sizes:{ XS:4, S:6, M:9, L:11, XL:8, XXL:3 },
    badge:null, is_featured:false, is_new:true,
    images:['/jerseys/real-madrid-badge.png'], rating:4.6, reviews:78,
    description:'Real Madrid official home kit 2025/26. Pure white. Adidas quality. Champions of Europe.',
  },
  {
    id:7, slug:'arsenal-away-2025',
    title:'Arsenal Away Kit 2025/26',
    club:'Arsenal', category:'Away Kits',
    price:13500, old_price:null,
    sizes:{ XS:3, S:7, M:8, L:6, XL:4, XXL:1 },
    badge:'New', is_featured:false, is_new:true,
    images:['/jerseys/arsenal-badge.png'], rating:4.7, reviews:55,
    description:'Arsenal 2025/26 away kit. Clean and elegant. Adidas quality. Perfect for Gunners fans.',
  },
  {
    id:8, slug:'psg-home-2025',
    title:'PSG Home Jersey 2025/26',
    club:'PSG', category:'Home Kits',
    price:14000, old_price:null,
    sizes:{ XS:2, S:5, M:7, L:8, XL:5, XXL:2 },
    badge:null, is_featured:false, is_new:true,
    images:['/jerseys/psg-badge.png'], rating:4.5, reviews:43,
    description:'Paris Saint-Germain 2025/26 home kit. Navy blue prestige. Nike quality. Paris in your wardrobe.',
  },
  {
    id:9, slug:'liverpool-home-2025',
    title:'Liverpool FC Home 2025/26',
    club:'Liverpool', category:'Home Kits',
    price:14500, old_price:18000,
    sizes:{ XS:3, S:6, M:9, L:7, XL:4, XXL:2 },
    badge:'Sale', is_featured:true, is_new:false,
    images:['/jerseys/liverpool-badge.png'], rating:4.8, reviews:110,
    description:'Liverpool FC official home kit 2025/26. You will never walk alone. Classic red. Nike quality.',
  },
  {
    id:10, slug:'man-united-away-2025',
    title:'Manchester United Away 2025/26',
    club:'Manchester United', category:'Away Kits',
    price:15000, old_price:null,
    sizes:{ XS:2, S:4, M:6, L:8, XL:5, XXL:1 },
    badge:'New', is_featured:false, is_new:true,
    images:['/jerseys/man-united-front.png'], rating:4.7, reviews:62,
    description:'Manchester United 2025/26 away kit. Fresh colourway. Nike Dri-FIT. Available now.',
  },
  {
    id:11, slug:'nigeria-retro-1996',
    title:"Nigeria Super Eagles 1996 Olympics",
    club:'Nigeria', category:'Retro Classics',
    price:20000, old_price:25000,
    sizes:{ XS:1, S:2, M:4, L:3, XL:1, XXL:0 },
    badge:'Retro', is_featured:true, is_new:false,
    images:['/jerseys/nigeria-badge.png'], rating:5.0, reviews:201,
    description:"The Olympic gold medal jersey. Nigeria beat Argentina in Atlanta 1996. One of the greatest moments in African football history. Collector's item.",
  },
  {
    id:12, slug:'man-city-home-2025',
    title:'Manchester City Home 2025/26',
    club:'Man City', category:'Home Kits',
    price:14000, old_price:null,
    sizes:{ XS:3, S:5, M:8, L:10, XL:6, XXL:2 },
    badge:null, is_featured:false, is_new:true,
    images:['/jerseys/man-city-badge.png'], rating:4.6, reviews:48,
    description:'Manchester City 2025/26 home kit. Sky blue prestige. Puma quality. The champions.',
  },
]

export const TESTIMONIALS = [
  { id:1, name:'Chukwuemeka O.', city:'Lagos', rating:5, text:'Ordered Man United jersey on Monday, received Tuesday. Quality is mad 🔥 This is the real plug for jerseys in Nigeria.', jersey:'Manchester United Home 2025' },
  { id:2, name:'Biodun A.', city:'Ibadan', rating:5, text:'Adekunle TV jersey store is too good. I ordered the Nigeria retro 1994 and people have been stopping me on the street to ask where I got it.', jersey:'Nigeria Retro 1994' },
  { id:3, name:'Tunde F.', city:'Abuja', rating:5, text:'Been buying jerseys from random people online and always getting fake. This one is original quality. Will never buy from anywhere else.', jersey:'Barcelona Home 2025' },
  { id:4, name:'Yetunde M.', city:'Port Harcourt', rating:5, text:'Fast delivery to PH. Packaged perfectly. The Chelsea jersey fits exactly as expected. My Adekunle TV jersey store forever 💚', jersey:'Chelsea Home 2025' },
]

export const STATS = {
  jerseys_sold: '5,000+',
  clubs: '50+',
  happy_customers: '3,200+',
  nationwide: '36 States',
}

export const formatPrice = (amount) =>
  `₦${Number(amount).toLocaleString('en-NG')}`

export const getStockStatus = (sizes) => {
  const total = Object.values(sizes).reduce((a, b) => a + b, 0)
  if (total === 0) return { label: 'Out of Stock', cls: 'out-stock' }
  if (total <= 5)  return { label: `Only ${total} left!`, cls: 'low-stock' }
  return { label: 'In Stock', cls: 'in-stock' }
}