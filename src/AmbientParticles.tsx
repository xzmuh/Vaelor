import { useMemo } from 'react'
import Particles, { ParticlesProvider } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import type { Engine } from '@tsparticles/engine'

export function AmbientParticles() {
  const options = useMemo(() => ({
    fullScreen: { enable: false },
    fpsLimit: 45,
    detectRetina: true,
    particles: {
      number: { value: 32, density: { enable: true, width: 1600, height: 900 } },
      color: { value: ['#fff7d1', '#9fe8ff', '#ffffff'] },
      shape: { type: 'circle' },
      opacity: { value: { min: 0.12, max: 0.58 }, animation: { enable: true, speed: 0.45, sync: false } },
      size: { value: { min: 0.8, max: 3.2 } },
      move: { enable: true, speed: { min: 0.08, max: 0.32 }, direction: 'top' as const, random: true, straight: false, outModes: { default: 'out' as const } },
      links: { enable: false },
    },
    interactivity: {
      events: { onHover: { enable: true, mode: 'repulse' as const }, resize: { enable: true } },
      modes: { repulse: { distance: 75, duration: 0.6, factor: 0.35 } },
    },
  }), [])

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null
  const init = async (engine: Engine) => loadSlim(engine)
  return <ParticlesProvider init={init}><Particles id="vaelor-particles" className="ambient-particles" options={options} /></ParticlesProvider>
}

export default AmbientParticles
