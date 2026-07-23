import { type RefObject, useEffect } from 'react'

type ParallaxElement = HTMLElement | null

export function useHeroParallax(
  containerRef: RefObject<HTMLElement | null>,
  backgroundRef: RefObject<ParallaxElement>,
  symbolRef: RefObject<ParallaxElement>,
) {
  useEffect(() => {
    const container = containerRef.current
    const background = backgroundRef.current
    const symbol = symbolRef.current
    if (!container || !background || !symbol) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mobile = window.matchMedia('(max-width: 760px), (pointer: coarse)')

    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let animationFrame = 0
    let running = false

    const render = () => {
      if (!running) return

      currentX += (targetX - currentX) * .075
      currentY += (targetY - currentY) * .075
      background.style.transform = `translate3d(${currentX.toFixed(3)}px, ${currentY.toFixed(3)}px, 0)`
      symbol.style.transform = `translate3d(${(-currentX * .375).toFixed(3)}px, ${(-currentY * .375).toFixed(3)}px, 0)`
      animationFrame = window.requestAnimationFrame(render)
    }

    const start = () => {
      if (running || document.hidden || reducedMotion.matches || mobile.matches) return
      running = true
      animationFrame = window.requestAnimationFrame(render)
    }

    const stop = (reset = false) => {
      running = false
      window.cancelAnimationFrame(animationFrame)
      if (!reset) return
      targetX = 0
      targetY = 0
      currentX = 0
      currentY = 0
      background.style.transform = ''
      symbol.style.transform = ''
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (mobile.matches || reducedMotion.matches) return
      const bounds = container.getBoundingClientRect()
      const normalizedX = ((event.clientX - bounds.left) / bounds.width - .5) * 2
      const normalizedY = ((event.clientY - bounds.top) / bounds.height - .5) * 2
      targetX = Math.max(-8, Math.min(8, normalizedX * 8))
      targetY = Math.max(-8, Math.min(8, normalizedY * 5))
    }

    const handlePointerLeave = () => {
      targetX = 0
      targetY = 0
    }

    const handleVisibility = () => {
      container.classList.toggle('is-animation-paused', document.hidden)
      if (document.hidden) stop()
      else start()
    }

    const handlePreferenceChange = () => {
      if (reducedMotion.matches || mobile.matches) stop(true)
      else start()
    }

    container.addEventListener('pointermove', handlePointerMove)
    container.addEventListener('pointerleave', handlePointerLeave)
    document.addEventListener('visibilitychange', handleVisibility)
    reducedMotion.addEventListener('change', handlePreferenceChange)
    mobile.addEventListener('change', handlePreferenceChange)
    container.classList.toggle('is-animation-paused', document.hidden)
    start()

    return () => {
      stop(true)
      container.classList.remove('is-animation-paused')
      container.removeEventListener('pointermove', handlePointerMove)
      container.removeEventListener('pointerleave', handlePointerLeave)
      document.removeEventListener('visibilitychange', handleVisibility)
      reducedMotion.removeEventListener('change', handlePreferenceChange)
      mobile.removeEventListener('change', handlePreferenceChange)
    }
  }, [backgroundRef, containerRef, symbolRef])
}
