import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { ReactLenis, useLenis } from 'lenis/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './tailwind.css'
import './styles.css'

function ScrollSync() {
  useLenis(() => ScrollTrigger.update())
  return null
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactLenis root options={{ lerp: 0.085, duration: 1.15, smoothWheel: true }}>
      <ScrollSync />
      <App />
    </ReactLenis>
  </StrictMode>,
)
