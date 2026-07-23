import sharp from 'sharp'

const icon = `
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#172733"/>
        <stop offset="1" stop-color="#071016"/>
      </linearGradient>
      <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f3e6bd"/>
        <stop offset="1" stop-color="#b89552"/>
      </linearGradient>
    </defs>
    <rect width="512" height="512" rx="112" fill="url(#bg)"/>
    <path d="M256 58 432 256 256 454 80 256Z" fill="none" stroke="#cfb270" stroke-width="15"/>
    <path d="M145 156 256 381 367 156 315 156 256 292 197 156Z" fill="url(#gold)"/>
    <circle cx="256" cy="256" r="19" fill="#f7edcf"/>
  </svg>
`

await Promise.all([
  sharp(Buffer.from(icon)).resize(64, 64).png().toFile('public/favicon.png'),
  sharp(Buffer.from(icon)).resize(180, 180).png().toFile('public/apple-touch-icon.png'),
])

