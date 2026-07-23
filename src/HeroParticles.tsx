import { useEffect, useRef } from 'react'

type Particle = {
  x: number
  y: number
  radius: number
  velocityX: number
  velocityY: number
  opacity: number
  life: number
  maxLife: number
  phase: number
}

const GOLD = '231, 201, 133'

function createParticle(width: number, height: number, anywhere = false): Particle {
  const maxLife = 5 + Math.random() * 8

  return {
    x: width * (.08 + Math.random() * .84),
    y: anywhere ? Math.random() * height : height * (.72 + Math.random() * .26),
    radius: .45 + Math.random() * 1.25,
    velocityX: -.045 + Math.random() * .09,
    velocityY: -.055 - Math.random() * .12,
    opacity: .16 + Math.random() * .42,
    life: anywhere ? Math.random() * maxLife : 0,
    maxLife,
    phase: Math.random() * Math.PI * 2,
  }
}

export function HeroParticles({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    if (!canvas || !host) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mobile = window.matchMedia('(max-width: 760px)')
    const context = canvas.getContext('2d')
    if (!context) return

    let width = 0
    let height = 0
    let particles: Particle[] = []
    let animationFrame = 0
    let previousTime = performance.now()
    let running = false

    const resize = () => {
      const bounds = host.getBoundingClientRect()
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.max(1, bounds.width)
      height = Math.max(1, bounds.height)
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

      const targetCount = mobile.matches ? 14 : reducedMotion.matches ? 18 : 34
      particles = Array.from({ length: targetCount }, () => createParticle(width, height, true))
    }

    const render = (time: number) => {
      if (!running) return

      const delta = Math.min((time - previousTime) / 16.667, 2.25)
      const motionScale = reducedMotion.matches ? .38 : 1
      previousTime = time
      context.clearRect(0, 0, width, height)

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index]
        particle.life += delta / 60
        particle.x += particle.velocityX * delta * motionScale
        particle.y += particle.velocityY * delta * motionScale
        particle.phase += .014 * delta * motionScale

        if (
          particle.life >= particle.maxLife ||
          particle.y < -12 ||
          particle.x < -12 ||
          particle.x > width + 12
        ) {
          particles[index] = createParticle(width, height)
          continue
        }

        const fadeIn = Math.min(1, particle.life / 1.2)
        const fadeOut = Math.min(1, (particle.maxLife - particle.life) / 1.8)
        const shimmer = .72 + Math.sin(particle.phase) * .28
        const alpha = particle.opacity * fadeIn * fadeOut * shimmer

        context.beginPath()
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        context.fillStyle = `rgba(${GOLD}, ${alpha})`
        context.fill()

        if (particle.radius > 1.15) {
          context.beginPath()
          context.arc(particle.x, particle.y, particle.radius * 3.4, 0, Math.PI * 2)
          context.fillStyle = `rgba(${GOLD}, ${alpha * .08})`
          context.fill()
        }
      }

      animationFrame = window.requestAnimationFrame(render)
    }

    const stop = () => {
      running = false
      window.cancelAnimationFrame(animationFrame)
    }

    const start = () => {
      if (running || document.hidden) return
      running = true
      previousTime = performance.now()
      animationFrame = window.requestAnimationFrame(render)
    }

    const handleVisibility = () => {
      if (document.hidden) stop()
      else start()
    }

    const handleMotionPreference = () => {
      resize()
      start()
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(host)
    document.addEventListener('visibilitychange', handleVisibility)
    reducedMotion.addEventListener('change', handleMotionPreference)
    mobile.addEventListener('change', resize)
    resize()
    start()

    return () => {
      stop()
      resizeObserver.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
      reducedMotion.removeEventListener('change', handleMotionPreference)
      mobile.removeEventListener('change', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className={`hero-particles ${className}`} aria-hidden="true" />
}
