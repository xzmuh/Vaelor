import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { CharactersReferencePage } from './CharactersReferencePage'
import { HistoryPage } from './HistoryPage'
import { HomeReferencePage } from './HomeReferencePage'
import { WorldsReferencePage } from './WorldsReferencePage'

type Page = 'home' | 'history' | 'worlds' | 'characters'

function pageFromHash(): Page {
  if (window.location.hash === '#personagens') return 'characters'
  if (window.location.hash === '#mundos') return 'worlds'
  if (window.location.hash === '#historia') return 'history'
  return 'home'
}

function Mark() {
  return (
    <span className="mark" aria-label="Vaelor">
      <span>VAEL</span>
      <span className="mark__sigil" aria-hidden="true"><i /><b /><i /></span>
      <span>R</span>
    </span>
  )
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState<Page>(pageFromHash)

  useEffect(() => {
    const syncPage = () => setCurrentPage(pageFromHash())
    window.addEventListener('hashchange', syncPage)
    return () => window.removeEventListener('hashchange', syncPage)
  }, [])

  useEffect(() => {
    if (!menuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)

    const timeline = gsap.timeline()
      .fromTo(
        '.nav-atlas__panel',
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: .62, ease: 'power3.inOut' },
      )
      .fromTo(
        '.nav-atlas__panel > button',
        { x: -32, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, stagger: .06, duration: .45, ease: 'power3.out' },
        '-=.24',
      )

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
      timeline.kill()
    }
  }, [menuOpen])

  const goTo = (page: Page) => {
    setMenuOpen(false)
    const hashes: Record<Page, string> = {
      home: '',
      worlds: 'mundos',
      characters: 'personagens',
      history: 'historia',
    }
    window.location.hash = hashes[page]
    setCurrentPage(page)
    window.scrollTo({ top: 0 })
  }

  const goHome = (section = 'inicio') => {
    setMenuOpen(false)
    if (currentPage !== 'home') {
      window.location.hash = ''
      setCurrentPage('home')
      window.setTimeout(() => document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' }), 50)
      return
    }
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className={`app app--${currentPage} is-ready`}>
      <header className="site-header">
        <button className="site-header__brand" onClick={() => goHome()} aria-label="Voltar ao início">
          <Mark />
        </button>

        <nav className="site-header__nav" aria-label="Navegação principal">
          <button className={currentPage === 'home' ? 'is-active' : ''} onClick={() => goHome()}>Início</button>
          <button className={currentPage === 'worlds' ? 'is-active' : ''} onClick={() => goTo('worlds')}>Regiões</button>
          <button className={currentPage === 'characters' ? 'is-active' : ''} onClick={() => goTo('characters')}>Personagens</button>
          <button className={currentPage === 'history' ? 'is-active' : ''} onClick={() => goTo('history')}>Crônicas</button>
        </nav>

        <button
          className={`site-header__menu ${menuOpen ? 'is-open' : ''}`}
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="vaelor-menu"
          aria-label={menuOpen ? 'Fechar navegação' : 'Abrir navegação'}
        >
          <span>{menuOpen ? 'Fechar' : 'Menu'}</span><i /><i />
        </button>

        <div className="site-header__actions">
          <button className="site-header__cta" onClick={() => goHome()}>Entrar em Vaelor</button>
        </div>
      </header>

      <div className={`nav-atlas ${menuOpen ? 'is-open' : ''}`} id="vaelor-menu" aria-hidden={!menuOpen}>
        <div className="nav-atlas__backdrop" />
        <nav className="nav-atlas__panel" aria-label="Navegação principal">
          <p className="nav-atlas__eyebrow">Índice do mundo · Arquivo 01</p>
          <button className={currentPage === 'home' ? 'is-active' : ''} onClick={() => goHome()}>
            <small>#01</small><span>Início</span><em>O horizonte partido</em><i />
          </button>
          <button className={currentPage === 'worlds' ? 'is-active' : ''} onClick={() => goTo('worlds')}>
            <small>#02</small><span>Regiões</span><em>Territórios do Atlas Vivo</em><i />
          </button>
          <button className={currentPage === 'characters' ? 'is-active' : ''} onClick={() => goTo('characters')}>
            <small>#03</small><span>Personagens</span><em>Aqueles que atravessam o Cisma</em><i />
          </button>
          <button className={currentPage === 'history' ? 'is-active' : ''} onClick={() => goTo('history')}>
            <small>#04</small><span>Crônicas</span><em>Fragmentos do mundo partido</em><i />
          </button>
          <div className="nav-atlas__footer">
            <span>VAELOR / CRÔNICAS DO CISMA</span>
            <span>Escolha um arquivo para continuar</span>
          </div>
        </nav>
      </div>

      {currentPage === 'home' && (
        <HomeReferencePage
          onOpenRegions={() => goTo('worlds')}
          onOpenCharacters={() => goTo('characters')}
        />
      )}
      {currentPage === 'worlds' && <WorldsReferencePage />}
      {currentPage === 'characters' && <CharactersReferencePage onBack={() => goHome()} />}
      {currentPage === 'history' && <HistoryPage />}
    </div>
  )
}
