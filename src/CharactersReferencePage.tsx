import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import gsap from 'gsap'
import { HeroParticles } from './HeroParticles'
import { useHeroParallax } from './useHeroParallax'

type CharacterId = 'fuyuka' | 'akane' | 'miyari' | 'vaelor'

type CharacterPreview = {
  id: CharacterId
  name: string
  portrait: string
  available: boolean
  video?: string
  mobileArt?: string
  quote?: string
  description?: [string, string]
  accent: string
}

const characters: CharacterPreview[] = [
  {
    id: 'fuyuka',
    name: 'Fuyuka',
    portrait: '/chars/fuyuka-portrait.webp',
    available: true,
    video: '/chars/fuyuka-animated.mp4',
    mobileArt: '/chars/fuyuka-fullbody-hq-sword.webp',
    quote: '“O inverno não anuncia sua chegada.”',
    description: [
      'Frieza, disciplina e elegância definem a presença de Fuyuka.',
      'Sua Afinidade Nival carrega a precisão silenciosa de um inverno eterno.',
    ],
    accent: '#b9ddf6',
  },
  {
    id: 'akane',
    name: 'Akane',
    portrait: '/chars/akane-portrait.webp',
    available: true,
    video: '/chars/Akane-animaated.mp4',
    mobileArt: '/chars/akane-fullbody-v2.webp',
    quote: '“Toda vida deixa um eco. Alguns apenas aprendem a escutá-lo.”',
    description: [
      'Beleza e inquietação caminham juntas.',
      'Akane manifesta a natureza orgânica de Cruor com presença melancólica.',
    ],
    accent: '#ef6578',
  },
  {
    id: 'miyari',
    name: 'Miyari',
    portrait: '/chars/miyari-portrait.webp',
    available: true,
    video: '/chars/Mai-animated.mp4',
    mobileArt: '/chars/miyari-fullbody-v2.webp',
    quote: '“Alguns mistérios preferem sorrir antes de oferecer uma resposta.”',
    description: [
      'Miyari conhece caminhos que não aparecem nos mapas do Atlas Vivo.',
      'Sua afinidade permanece fora dos registros conhecidos.',
    ],
    accent: '#b78cff',
  },
  {
    id: 'vaelor',
    name: 'Vaelor',
    portrait: '/chars/vaelor-man-portrait.webp',
    available: false,
    accent: '#ffe184',
  },
]

function CharacterCrest({ character }: { character: CharacterId }) {
  if (character === 'akane') {
    return (
      <svg className="resonator-page__crest" viewBox="0 0 128 128" aria-hidden="true">
        <path d="M64 9C48 36 34 50 34 72a30 30 0 0 0 60 0C94 50 80 36 64 9Z" />
        <path d="M64 31v57M49 56l15 14 15-14M48 87c7 8 25 8 32 0" />
        <circle cx="64" cy="71" r="7" />
      </svg>
    )
  }

  return (
    <svg className="resonator-page__crest" viewBox="0 0 128 128" aria-hidden="true">
      <path d="M64 5 75 30l25-10-10 25 26 11-26 11 10 25-25-10-11 26-11-26-25 10 10-25L12 56l26-11-10-25 25 10L64 5Z" />
      <path d="m64 29 9 18 20-3-14 14 14 14-20-3-9 19-9-19-20 3 14-14-14-14 20 3 9-18Z" />
      <circle cx="64" cy="58" r="9" />
    </svg>
  )
}

export function CharactersReferencePage({ onBack }: { onBack: () => void }) {
  const pageRef = useRef<HTMLElement>(null)
  const artMotionRef = useRef<HTMLDivElement>(null)
  const crestMotionRef = useRef<HTMLDivElement>(null)
  const hasEnteredRef = useRef(false)
  const transitioningRef = useRef(false)
  const videoRefs = useRef<Partial<Record<CharacterId, HTMLVideoElement>>>({})
  const [activeId, setActiveId] = useState<CharacterId>('fuyuka')
  const [artOnly, setArtOnly] = useState(false)
  const active = characters.find((character) => character.id === activeId) ?? characters[0]

  useHeroParallax(pageRef, artMotionRef, crestMotionRef)

  useLayoutEffect(() => {
    const page = pageRef.current
    if (!page) return

    const firstEntrance = !hasEnteredRef.current
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const duration = reduceMotion ? 0 : firstEntrance ? 1.1 : .55
    const art = page.querySelector('.resonator-page__art-canvas')
    const copy = page.querySelectorAll('.resonator-page__copy > *')
    const controls = page.querySelectorAll(
      '.resonator-page__selector button, .resonator-page__art-toggle',
    )
    const activeButton = page.querySelector('.resonator-page__selector button.is-active')
    const timeline = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        transitioningRef.current = false
      },
    })

    if (firstEntrance) {
      timeline.fromTo(
        art,
        {
          autoAlpha: 0,
          scale: reduceMotion ? 1 : 1.035,
        },
        { autoAlpha: 1, scale: 1, duration, clearProps: 'visibility' },
      )
    } else {
      gsap.set(art, { clearProps: 'opacity,visibility,transform' })
    }

    timeline.fromTo(
        copy,
        { x: reduceMotion ? 0 : firstEntrance ? -34 : -16, autoAlpha: firstEntrance ? 0 : .45 },
        { x: 0, autoAlpha: 1, duration: reduceMotion ? 0 : .48, stagger: .055 },
        firstEntrance ? .2 : .08,
      )

    if (firstEntrance) {
      timeline.fromTo(
        controls,
        { y: reduceMotion ? 0 : 18, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: reduceMotion ? 0 : .45,
          stagger: .04,
          clearProps: 'opacity,visibility,transform',
        },
        .45,
      )
    } else {
      gsap.set(controls, { clearProps: 'opacity,visibility,transform' })
    }

    if (!firstEntrance && activeButton) {
      timeline.fromTo(
        activeButton,
        { scale: reduceMotion ? 1 : .9 },
        { scale: 1, duration: reduceMotion ? 0 : .36, ease: 'back.out(1.6)' },
        .08,
      )
    }

    hasEnteredRef.current = true
    return () => {
      timeline.kill()
    }
  }, [activeId])

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (artOnly) setArtOnly(false)
      else onBack()
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [artOnly, onBack])

  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([id, video]) => {
      if (!video) return
      if (id === activeId) {
        void video.play().catch(() => undefined)
      } else {
        video.pause()
      }
    })
  }, [activeId])

  const selectCharacter = (character: CharacterPreview) => {
    if (!character.available || character.id === activeId || transitioningRef.current) return

    const page = pageRef.current
    if (!page) return

    transitioningRef.current = true
    setArtOnly(false)
    const swapCharacter = async () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const transition = page.querySelector('.resonator-page__media-transition')
      const outgoing = page.querySelectorAll(
        '.resonator-page__copy > *, .resonator-page__ornament',
      )

      await Promise.all([
        gsap.to(outgoing, {
          autoAlpha: .38,
          duration: reduceMotion ? 0 : .26,
          ease: 'power2.out',
        }),
        gsap.to(transition, {
          autoAlpha: .68,
          duration: reduceMotion ? 0 : .3,
          ease: 'power2.inOut',
        }),
      ])

      setActiveId(character.id)
      requestAnimationFrame(() => {
        gsap.to(transition, {
          autoAlpha: 0,
          duration: reduceMotion ? 0 : .55,
          delay: reduceMotion ? 0 : .06,
          ease: 'power2.out',
        })
      })
    }

    if (!character.video) {
      void swapCharacter()
      return
    }

    const preload = videoRefs.current[character.id]
    if (!preload || preload.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      void swapCharacter()
      return
    }

    let completed = false
    const finish = () => {
      if (completed) return
      completed = true
      preload.removeEventListener('canplay', finish)
      preload.removeEventListener('error', finish)
      void swapCharacter()
    }
    preload.addEventListener('canplay', finish, { once: true })
    preload.addEventListener('error', finish, { once: true })
    preload.load()
    window.setTimeout(finish, 1800)
  }

  return (
    <main
      className={`resonator-page ${artOnly ? 'is-art-only' : ''}`}
      data-character={active.id}
      ref={pageRef}
      style={{ '--resonator-accent': active.accent } as CSSProperties}
    >
      <div className="resonator-page__art-motion" ref={artMotionRef}>
        <div className="resonator-page__art-canvas">
          {characters.filter((character) => character.video).map((character) => (
            <video
              key={character.id}
              ref={(video) => {
                videoRefs.current[character.id] = video ?? undefined
              }}
              className={`resonator-page__art resonator-page__art--video ${character.id === active.id ? 'is-active' : ''}`}
              src={character.video}
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden={character.id !== active.id}
              aria-label={character.id === active.id ? `${active.name} em movimento` : undefined}
            />
          ))}
          {characters.filter((character) => character.mobileArt).map((character) => (
            <img
              key={`${character.id}-mobile`}
              className={`resonator-page__mobile-character ${character.id === active.id ? 'is-active' : ''}`}
              src={character.mobileArt}
              alt=""
              aria-hidden="true"
            />
          ))}
        </div>
        <div className="resonator-page__media-transition" aria-hidden="true" />
      </div>

      <div className="resonator-page__shade" aria-hidden="true" />
      <div className="resonator-page__sky-light" aria-hidden="true" />
      <div className="resonator-page__crest-light" aria-hidden="true" />
      <div className="resonator-page__mist resonator-page__mist--horizon" aria-hidden="true" />
      <div className="resonator-page__mist resonator-page__mist--foreground" aria-hidden="true" />
      <HeroParticles className="resonator-page__particles" />
      <div className="resonator-page__ornament" aria-hidden="true">
        <CharacterCrest character={active.id} />
      </div>

      <button className="resonator-page__back" onClick={onBack}>
        <span aria-hidden="true">←</span>
        <b>VOLTAR</b>
      </button>

      <section className="resonator-page__copy" aria-labelledby="resonator-name">
        <p className="resonator-page__quote">{active.quote}</p>
        <div className="resonator-page__identity">
          <div className="resonator-page__identity-symbol" ref={crestMotionRef}>
            <i className="resonator-page__crest-ring resonator-page__crest-ring--outer" />
            <i className="resonator-page__crest-ring resonator-page__crest-ring--inner" />
            <CharacterCrest character={active.id} />
          </div>
          <h1 id="resonator-name">{active.name}</h1>
        </div>
        <div className="resonator-page__description">
          {active.description?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </section>

      <nav className="resonator-page__selector" aria-label="Selecionar personagem">
        {characters.map((character) => {
          const selected = character.id === activeId
          return (
            <button
              key={character.id}
              className={[
                selected ? 'is-active' : '',
                !character.available ? 'is-upcoming' : '',
              ].filter(Boolean).join(' ')}
              disabled={!character.available}
              onClick={() => selectCharacter(character)}
              aria-current={selected ? 'true' : undefined}
              aria-label={
                selected
                  ? `Personagem atual: ${character.name}`
                  : character.available
                    ? `Selecionar ${character.name}`
                    : `${character.name}: banner em preparação`
              }
            >
              <span><img src={character.portrait} alt="" /></span>
              <small>{character.name}</small>
              {!character.available && <em>Em breve</em>}
            </button>
          )
        })}
      </nav>

      <button
        className="resonator-page__art-toggle"
        onClick={() => setArtOnly((value) => !value)}
        aria-label={artOnly ? 'Mostrar informações da personagem' : 'Visualizar somente a arte'}
        aria-pressed={artOnly}
      >
        <i /><i />
      </button>
    </main>
  )
}
