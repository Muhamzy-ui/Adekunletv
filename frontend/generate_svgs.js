const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'public', 'clubs');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const clubs = [
  { slug: 'man-united', color1: '#E8001E', color2: '#E8001E' },
  { slug: 'chelsea', color1: '#034694', color2: '#034694' },
  { slug: 'arsenal', color1: '#EF0107', color2: '#FFFFFF', sleeve: '#FFFFFF' },
  { slug: 'barcelona', color1: '#A50044', color2: '#004D98', stripe: true },
  { slug: 'real-madrid', color1: '#FFFFFF', color2: '#FFFFFF', stroke: '#ddd' },
  { slug: 'liverpool', color1: '#C8102E', color2: '#C8102E', stroke: '#8a0a1f' },
  { slug: 'nigeria', color1: '#008751', color2: '#008751', sleeve: '#00663d' },
  { slug: 'psg', color1: '#004170', color2: '#004170', stripeC: '#DA291C' },
  { slug: 'bayern', color1: '#DC052D', color2: '#DC052D', sleeve: '#fff' },
  { slug: 'man-city', color1: '#6CABDD', color2: '#6CABDD', sleeve: '#000033' }
];

clubs.forEach(c => {
  const sleeveColor = c.sleeve || c.color1;
  const stroke = c.stroke || 'rgba(0,0,0,0.1)';
  // A realistic rounded 3D looking jersey SVG
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 130">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.25"/>
      </linearGradient>
    </defs>
    <!-- Base Body -->
    <path d="M20 35 L8 55 L28 60 L28 120 Q60 125 92 120 L92 60 L112 55 L100 35 L80 28 Q60 15 40 28 Z" fill="${c.color1}" stroke="${stroke}" stroke-width="1.5"/>
    
    <!-- Stripes -->
    ${c.stripe ? `<path d="M44 28 L44 120 M76 28 L76 120" stroke="${c.color2}" stroke-width="16"/>` : ''}
    ${c.stripe ? `<path d="M28 32 L28 120 M92 32 L92 120" stroke="${c.color2}" stroke-width="16"/>` : ''}
    ${c.stripeC ? `<rect x="56" y="28" width="8" height="92" fill="${c.stripeC}"/>` : ''}
    
    <!-- Sleeves -->
    <path d="M20 35 L8 55 L28 60 Z" fill="${sleeveColor}" stroke="${stroke}" stroke-width="1"/>
    <path d="M100 35 L112 55 L92 60 Z" fill="${sleeveColor}" stroke="${stroke}" stroke-width="1"/>
    
    <!-- Collar inside -->
    <path d="M42 28 Q60 40 78 28 Q72 18 60 16 Q48 18 42 28 Z" fill="rgba(0,0,0,0.6)"/>
    
    <!-- Highlights -->
    <path d="M20 35 L8 55 L28 60 L28 120 Q60 125 92 120 L92 60 L112 55 L100 35 L80 28 Q60 15 40 28 Z" fill="url(#g)" pointer-events="none"/>
  </svg>`;
  fs.writeFileSync(path.join(dir, c.slug + '.svg'), svg);
});
console.log('✓ SVGs generated in /public/clubs/');
