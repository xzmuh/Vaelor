import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prologueLines, worldPillars, worldScenes } from './content'
import { CharactersPage } from './CharactersPage'
import Atropos from 'atropos/react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { A11y, Keyboard, Mousewheel, Navigation, Parallax } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/effect-creative'
import 'swiper/css/pagination'

gsap.registerPlugin(ScrollTrigger)

const AmbientParticles = lazy(() => import('./AmbientParticles'))

type PrologueState = 'closed' | 'opening' | 'ready'

function Mark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`mark ${compact ? 'mark--compact' : ''}`} aria-label="Vaelor">
      <span>VAEL</span>
      <span className="mark__sigil" aria-hidden="true"><i /><b /><i /></span>
      <span>R</span>
    </span>
  )
}

function Diamond({ className = '' }: { className?: string }) {
  return <span className={`diamond ${className}`} aria-hidden="true" />
}

export function App() {
  const appRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const heroImageRef = useRef<HTMLImageElement>(null)
  const worldRef = useRef<HTMLElement>(null)
  const prologueRef = useRef<HTMLDivElement>(null)
  const sceneOverlayRef = useRef<HTMLDivElement>(null)
  const sceneOriginRef = useRef<DOMRect | null>(null)
  const [imageReady, setImageReady] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [prologue, setPrologue] = useState<PrologueState>('closed')
  const [prologueStep, setPrologueStep] = useState(0)
  const [loreOpen, setLoreOpen] = useState(false)
  const [activeSceneId, setActiveSceneId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<'home' | 'characters'>(() => window.location.hash === '#personagens' ? 'characters' : 'home')

  useEffect(() => {
    const syncPage = () => setCurrentPage(window.location.hash === '#personagens' ? 'characters' : 'home')
    window.addEventListener('hashchange', syncPage)
    return () => window.removeEventListener('hashchange', syncPage)
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!imageReady) setShowLoader(true)
    }, 200)
    return () => window.clearTimeout(timer)
  }, [imageReady])

  useLayoutEffect(() => {
    if (!imageReady || !appRef.current) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const context = gsap.context(() => {
      gsap.set('.hero__reveal', { autoAlpha: 0, y: 22 })
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })
      intro
        .fromTo('.site-header', { yPercent: -105 }, { yPercent: 0, duration: reduceMotion ? 0 : 1.1 })
        .fromTo('.hero__image', { scale: reduceMotion ? 1 : 1.075, filter: 'brightness(.68)' }, { scale: 1.025, filter: 'brightness(1)', duration: reduceMotion ? 0 : 2.4 }, 0)
        .to('.hero__reveal', { autoAlpha: 1, y: 0, duration: reduceMotion ? 0 : .9, stagger: .13 }, .65)

      if (!reduceMotion) {
        gsap.to('.hero-layer--fog-a', { xPercent: 14, yPercent: -5, rotation: 4, duration: 18, repeat: -1, yoyo: true, ease: 'sine.inOut' })
        gsap.to('.hero-layer--fog-b', { xPercent: -11, yPercent: 4, rotation: -3, duration: 23, repeat: -1, yoyo: true, ease: 'sine.inOut' })
        gsap.to('.hero-layer--light', { scale: 1.14, opacity: .7, duration: 5.5, repeat: -1, yoyo: true, ease: 'sine.inOut' })
        gsap.to('.hero-layer--magic', { rotation: 360, duration: 42, repeat: -1, ease: 'none' })
        gsap.to('.hero__content', { yPercent: -16, autoAlpha: .25, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } })
        gsap.to('.hero__image', { yPercent: 7, scale: 1.08, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } })
        gsap.to('.world__backdrop img', {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: { trigger: '.world', start: 'top bottom', end: 'bottom top', scrub: 1 },
        })
        gsap.from('.world-card', {
          y: 70,
          autoAlpha: 0,
          stagger: .16,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.world__swiper', start: 'top 80%' },
        })
        gsap.from('.atlas__intro > *', {
          y: 42,
          autoAlpha: 0,
          stagger: .12,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.atlas', start: 'top 72%' },
        })
        gsap.from('.region-bands', {
          clipPath: 'inset(18% 8% 18% 8% round 50px)',
          scale: .94,
          autoAlpha: 0,
          duration: 1.35,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.region-bands', start: 'top 84%' },
        })
      }
    }, appRef)
    return () => context.revert()
  }, [imageReady])

  useEffect(() => {
    const hero = heroRef.current
    const image = heroImageRef.current
    if (!hero || !image || window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const xTo = gsap.quickTo(image, 'xPercent', { duration: 1.2, ease: 'power3.out' })
    const yTo = gsap.quickTo(image, 'yPercent', { duration: 1.2, ease: 'power3.out' })
    const layers = Array.from(hero.querySelectorAll<HTMLElement>('.hero-layer'))
    const move = (event: PointerEvent) => {
      const px = (event.clientX / window.innerWidth) - .5
      const py = (event.clientY / window.innerHeight) - .5
      xTo(px * -1.8)
      yTo(py * -1.25)
      layers.forEach((layer, index) => gsap.to(layer, { x: px * (10 + index * 7), y: py * (7 + index * 4), duration: 1.35, ease: 'power3.out', overwrite: 'auto' }))
    }
    hero.addEventListener('pointermove', move)
    return () => hero.removeEventListener('pointermove', move)
  }, [imageReady])

  useEffect(() => {
    if (prologue === 'closed') return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [prologue])

  useEffect(() => {
    if (!menuOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', closeOnEscape)
    const timeline = gsap.timeline()
    timeline
      .fromTo('.nav-atlas__panel', { clipPath: 'inset(0 0 100% 0 round 0 0 50px 50px)' }, { clipPath: 'inset(0 0 0% 0 round 0 0 50px 50px)', duration: .72, ease: 'power3.inOut' })
      .fromTo('.nav-atlas__panel > button', { x: -42, autoAlpha: 0 }, { x: 0, autoAlpha: 1, stagger: .065, duration: .55, ease: 'power3.out' }, '-=.28')
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
      timeline.kill()
    }
  }, [menuOpen])

  useLayoutEffect(() => {
    if (!activeSceneId || !sceneOverlayRef.current) return
    const overlay = sceneOverlayRef.current
    const origin = sceneOriginRef.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') closeScene() }
    window.addEventListener('keydown', closeOnEscape)
    const timeline = gsap.timeline()
    timeline.fromTo(overlay, {
      x: origin?.left ?? 0,
      y: origin?.top ?? 0,
      width: origin?.width ?? window.innerWidth,
      height: origin?.height ?? window.innerHeight,
      borderRadius: 0,
    }, {
      x: 0,
      y: 0,
      width: '100vw',
      height: '100dvh',
      borderRadius: 0,
      duration: .95,
      ease: 'power4.inOut',
    }).fromTo('.scene-player__chrome > *', { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: .08, duration: .55 }, '-=.28')
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
      timeline.kill()
    }
  }, [activeSceneId])

  const openScene = (sceneId: string, element: HTMLElement) => {
    sceneOriginRef.current = element.getBoundingClientRect()
    setActiveSceneId(sceneId)
  }

  const closeScene = () => {
    const overlay = sceneOverlayRef.current
    const origin = sceneOriginRef.current
    if (!overlay || !origin) { setActiveSceneId(null); return }
    gsap.to(overlay, {
      x: origin.left,
      y: origin.top,
      width: origin.width,
      height: origin.height,
      duration: .72,
      ease: 'power3.inOut',
      onComplete: () => setActiveSceneId(null),
    })
  }

  const openPrologue = useCallback(() => {
    setPrologue('opening')
    setPrologueStep(0)
    requestAnimationFrame(() => {
      const timeline = gsap.timeline({ onComplete: () => setPrologue('ready') })
      timeline
        .fromTo(prologueRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: .65 })
        .fromTo('.prologue__ornament', { scaleY: 0 }, { scaleY: 1, duration: .9, ease: 'power3.out' }, .15)
        .fromTo('.prologue__line', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .9 }, .35)
    })
  }, [])

  const advancePrologue = () => {
    if (prologueStep < prologueLines.length - 1) {
      const next = prologueStep + 1
      gsap.to('.prologue__line', {
        autoAlpha: 0,
        y: -16,
        duration: .35,
        onComplete: () => {
          setPrologueStep(next)
          requestAnimationFrame(() => gsap.fromTo('.prologue__line', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: .7 }))
        },
      })
      return
    }
    gsap.to(prologueRef.current, {
      autoAlpha: 0,
      duration: .7,
      onComplete: () => {
        setPrologue('closed')
        worldRef.current?.scrollIntoView({ behavior: 'smooth' })
      },
    })
  }

  const scrollTo = (id: string) => {
    setMenuOpen(false)
    if (currentPage !== 'home') {
      window.location.hash = ''
      setCurrentPage('home')
      window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 50)
      return
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const openCharacters = () => {
    setMenuOpen(false)
    window.location.hash = 'personagens'
    setCurrentPage('characters')
    window.scrollTo({ top: 0 })
  }

  return (
    <div className={`app ${imageReady || currentPage === 'characters' ? 'is-ready' : ''}`} ref={appRef}>
      {currentPage === 'home' && showLoader && !imageReady && (
        <div className="loader" role="status" aria-live="polite">
          <Mark compact />
          <div className="loader__symbol"><Diamond /><span /></div>
          <p>Despertando o mundo</p>
        </div>
      )}

      <header className="site-header">
        <button className="site-header__brand" onClick={() => scrollTo('inicio')} aria-label="Voltar ao início"><Mark /></button>
        <button className={`site-header__menu ${menuOpen ? 'is-open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="vaelor-menu">
          <span>{menuOpen ? 'Recolher' : 'Explorar'}</span><i /><i />
        </button>
        <div className="site-header__actions">
          <button aria-label="Idioma">◎</button>
          <button aria-label="Som ambiente">♬</button>
          <button className="site-header__cta" onClick={() => scrollTo('atlas')}>Abrir o Atlas <span>+</span></button>
        </div>
      </header>

      <div className={`nav-atlas ${menuOpen ? 'is-open' : ''}`} id="vaelor-menu" aria-hidden={!menuOpen}>
        <div className="nav-atlas__backdrop" />
        <nav className="nav-atlas__panel" aria-label="Navegação principal">
          <p className="nav-atlas__eyebrow">Índice do mundo · Arquivo 01</p>
          <button className={currentPage === 'home' ? 'is-active' : ''} onClick={() => scrollTo('inicio')}><small>#01</small><span>Início</span><em>O horizonte partido</em><i /></button>
          <button onClick={() => scrollTo('o-mundo')}><small>#02</small><span>O Mundo</span><em>Alturas, Superfície e Fendas</em><i /></button>
          <button className={currentPage === 'characters' ? 'is-active' : ''} onClick={openCharacters}><small>#03</small><span>Personagens</span><em>Aqueles que atravessam o Cisma</em><i /></button>
          <button onClick={() => scrollTo('atlas')}><small>#04</small><span>Atlas Vivo</span><em>Territórios cartografados</em><i /></button>
          <button className="is-locked" title="Em breve" disabled><small>#05</small><span>Arquivos</span><em>Memórias ainda seladas · Em breve</em><i /></button>
          <div className="nav-atlas__footer"><span>VAELOR / CRÔNICAS DO CISMA</span><span>Arraste o mundo para descobrir</span></div>
        </nav>
      </div>

      {currentPage === 'home' ? <main>
        <section className="hero relative select-none" id="inicio" ref={heroRef} aria-label="Vaelor">
          <div className="hero__media">
            <picture>
              <source type="image/avif" srcSet="/new-vaelor-1280.avif 1280w, /new-vaelor-2048.avif 2048w" sizes="100vw" />
              <source type="image/webp" srcSet="/new-vaelor-1280.webp 1280w, /new-vaelor-2048.webp 2048w" sizes="100vw" />
              <img ref={heroImageRef} className="hero__image" src="/new-vaelor-2048.webp" alt="Vaelor: um viajante observa uma cidade luminosa entre as Alturas e uma Fenda violeta" onLoad={() => setImageReady(true)} onError={() => setImageReady(true)} />
            </picture>
            <div className="hero__light" />
            <img className="hero-layer hero-layer--light" src="/fx/light.png" alt="" aria-hidden="true" />
            <img className="hero-layer hero-layer--fog hero-layer--fog-a" src="/fx/fog.png" alt="" aria-hidden="true" />
            <img className="hero-layer hero-layer--fog hero-layer--fog-b" src="/fx/fog.png" alt="" aria-hidden="true" />
            <img className="hero-layer hero-layer--magic" src="/fx/magic.png" alt="" aria-hidden="true" />
            <div className="hero__mist hero__mist--one" />
            <div className="hero__mist hero__mist--two" />
            <Suspense fallback={null}><AmbientParticles /></Suspense>
            <div className="particles" aria-hidden="true">{Array.from({ length: 20 }, (_, i) => <i key={i} style={{ '--i': i } as React.CSSProperties} />)}</div>
            <div className="hero__vignette" />
          </div>
          <div className="hero__content">
            <button className="play hero__reveal" onClick={() => setLoreOpen(true)} aria-label="Ouvir o chamado de Vaelor">
              <span className="play__rings" /><span className="play__triangle" />
            </button>
            <p className="hero__tagline hero__reveal">Vaelor aprendeu a viver entre o céu e o abismo.</p>
            <button className="ornament-button hero__reveal" onClick={openPrologue}><Diamond /><span>Conheça Vaelor</span><Diamond /></button>
            <button className="scroll-cue hero__reveal" onClick={() => scrollTo('o-mundo')} aria-label="Ir para O Mundo"><span>Explore</span><i /></button>
          </div>
        </section>

        <section className="world" id="o-mundo" ref={worldRef}>
          <div className="world__backdrop"><img src="/new-vaelor-1280.webp" alt="" aria-hidden="true" loading="lazy" /></div>
          <div className="world__veil" />
          <div className="world__content">
            <div className="section-heading">
              <span className="section-heading__index">I</span>
              <p>Crônicas do mundo partido</p>
              <h1>Entre duas<br /><em>impossibilidades</em></h1>
              <div className="section-heading__rule"><span /><Diamond /><span /></div>
              <p className="section-heading__intro">O Cisma não destruiu apenas territórios. Destruiu a certeza de que a realidade obedecia a regras compreensíveis.</p>
            </div>
            <div className="world__discovery group">
              <p className="world__gesture"><span>Arraste para atravessar</span><i /></p>
              <Swiper
                className="world__swiper"
                modules={[A11y, Keyboard, Mousewheel, Navigation, Parallax]}
                navigation
                keyboard={{ enabled: true }}
                mousewheel={{ forceToAxis: true }}
                parallax
                centeredSlides
                grabCursor
                slidesPerView={1.12}
                spaceBetween={18}
                breakpoints={{ 760: { slidesPerView: 2.05, spaceBetween: 26 }, 1180: { slidesPerView: 2.65, spaceBetween: 34 } }}
              >
                {worldPillars.map((pillar) => (
                  <SwiperSlide key={pillar.title}>
                    <Atropos className="world-atropos" activeOffset={28} shadow={false} highlight={false} rotateXMax={4} rotateYMax={5}>
                      <article className={`world-card world-card--${pillar.className}`}>
                        <span className="world-card__halo" data-atropos-offset="-3" />
                        <span className="world-card__number" data-atropos-offset="2">{pillar.index}</span>
                        <div className="world-card__body" data-atropos-offset="5">
                          <p>{pillar.eyebrow}</p>
                          <h2>{pillar.title}</h2>
                          <span className="world-card__line" />
                          <p className="world-card__copy">{pillar.copy}</p>
                          <span className="world-card__explore" aria-hidden="true">Explore o fragmento <span>↗</span></span>
                        </div>
                      </article>
                    </Atropos>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="world__closing"><Diamond /><p>O mundo voltou a perder o equilíbrio.</p><Diamond /></div>
          </div>
        </section>

        <section className="atlas atlas--bands" id="atlas" aria-label="Atlas vivo de Vaelor">
          <div className="atlas__intro">
            <p>Cartografia do Cisma · Volume I</p>
            <h2>Não observe o mundo.<br /><em>Atravesse-o.</em></h2>
          </div>
          <div className="region-bands">
            {worldScenes.map((scene) => (
              <button className="region-band" key={scene.id} style={{ '--scene-tone': scene.tone } as React.CSSProperties} onClick={(event) => openScene(scene.id, event.currentTarget)}>
                <picture><source media="(max-width:760px)" srcSet={`/scenes/${scene.id}-1080.webp?v=20260722-new`} /><img src={`/scenes/${scene.id}-1920.webp?v=20260722-new`} alt="" loading="lazy" /></picture>
                <span className="region-band__veil" />
                <span className="region-band__index">0{worldScenes.indexOf(scene) + 1}</span>
                <span className="region-band__title"><i /><strong>{scene.name}</strong><small>{scene.original}</small></span>
                <span className="region-band__action">Entrar <b>↗</b></span>
              </button>
            ))}
          </div>
          <p className="atlas__hint">Escolha um território para atravessar</p>
        </section>
      </main> : <CharactersPage />}

      {prologue !== 'closed' && (
        <div className="prologue" ref={prologueRef} role="dialog" aria-modal="true" aria-label="Prólogo de Vaelor">
          <div className="prologue__bg" />
          <button className="prologue__close" onClick={() => setPrologue('closed')} aria-label="Fechar prólogo">×</button>
          <span className="prologue__ornament prologue__ornament--left" /><span className="prologue__ornament prologue__ornament--right" />
          <div className="prologue__content">
            <p className="prologue__counter">Fragmento {String(prologueStep + 1).padStart(2, '0')} / 03</p>
            <p className="prologue__line">{prologueLines[prologueStep]}</p>
            <button className="prologue__advance" disabled={prologue === 'opening'} onClick={advancePrologue}>
              {prologueStep === prologueLines.length - 1 ? 'Entrar em Vaelor' : 'Continuar'} <span>→</span>
            </button>
          </div>
        </div>
      )}

      {loreOpen && (
        <div className="lore-modal" role="dialog" aria-modal="true" aria-label="O chamado de Vaelor" onClick={() => setLoreOpen(false)}>
          <div className="lore-modal__card" onClick={(event) => event.stopPropagation()}>
            <button onClick={() => setLoreOpen(false)} aria-label="Fechar">×</button>
            <Diamond />
            <p>Um sinal que ninguém mais consegue ver.</p>
            <h2>A Faísca</h2>
            <span>Não é Nival. Não é Cruor. Não é Voltis.</span>
            <small>O primeiro fragmento da jornada</small>
          </div>
        </div>
      )}

      {activeSceneId && (() => {
        const scene = worldScenes.find((item) => item.id === activeSceneId)!
        return <div className="scene-player" ref={sceneOverlayRef} role="dialog" aria-modal="true" aria-label={`Experiência de ${scene.name}`}>
          <picture className="scene-player__media"><source media="(max-width:760px)" srcSet={`/scenes/${scene.id}-1080.webp?v=20260722-new`} /><img src={`/scenes/${scene.id}-1920.webp?v=20260722-new`} alt={`Paisagem de ${scene.name}`} /></picture>
          <div className="scene-player__veil" />
          <div className="scene-player__chrome">
            <p>{scene.coordinates}</p><h2>{scene.name}</h2><span>{scene.copy}</span>
            <div className="scene-player__standby"><i /><small>Experiência em movimento</small><strong>Vídeo em breve</strong></div>
          </div>
          <button className="scene-player__close" onClick={closeScene} aria-label="Fechar território">×</button>
        </div>
      })()}
    </div>
  )
}
