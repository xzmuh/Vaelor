import { useState, type CSSProperties } from 'react'

const regions = [
  {
    id: 'auren',
    index: '01',
    name: 'Coração de Auren',
    shortName: 'Auren',
    chapter: 'A Superfície',
    coordinates: '42° 19′ N · 07° 44′ E',
    description: 'Estradas, mercados e jardins atravessam ruínas anteriores aos mapas. Auren cresceu onde o mundo ainda parece inteiro, mesmo carregando as cicatrizes do Cisma.',
    detail: 'Cidades vivas · Rotas antigas · Jardins suspensos',
    desktop: '/worlds/auren-1920.webp',
    mobile: '/worlds/auren-mobile.webp',
    color: '#e8c783',
  },
  {
    id: 'nival',
    index: '02',
    name: 'Coroa de Nival',
    shortName: 'Nival',
    chapter: 'O Norte Silencioso',
    coordinates: '68° 07′ N · 18° 31′ E',
    description: 'Ao pé da montanha, a cidade mantém acesa a última rota até o domínio congelado. O inverno preserva seus palácios e também aquilo que deveria ter sido esquecido.',
    detail: 'Gelo eterno · Arquivos reais · Afinidade Nival',
    desktop: '/worlds/nival-1920.webp',
    mobile: '/worlds/nival-mobile.webp',
    color: '#b9ddf6',
  },
  {
    id: 'hanamori',
    index: '03',
    name: 'Hanamori',
    shortName: 'Hanamori',
    chapter: 'Os Jardins do Leste',
    coordinates: '31° 28′ N · 135° 09′ E',
    description: 'Casas e plantações florescem sobre uma planície cercada por penhascos. Entre trilhas cobertas de pétalas, caminhos invisíveis conduzem a regiões fora do Atlas.',
    detail: 'Bosques floridos · Vilas remotas · Caminhos ocultos',
    desktop: '/worlds/hanamori-1920.webp',
    mobile: '/worlds/hanamori-mobile.webp',
    color: '#edb5c9',
  },
] as const

export function WorldsReferencePage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = regions[activeIndex]

  const move = (direction: -1 | 1) => {
    setActiveIndex((current) => (current + direction + regions.length) % regions.length)
  }

  return (
    <main
      className="world-atlas"
      data-region={active.id}
      style={{ '--world-accent': active.color } as CSSProperties}
    >
      <picture className="world-atlas__media" key={active.id}>
        <source media="(max-width:760px)" srcSet={active.mobile} />
        <img src={active.desktop} alt={`Paisagem de ${active.name}`} />
      </picture>

      <div className="world-atlas__veil" />
      <div className="world-atlas__grain" aria-hidden="true" />
      <div className="world-atlas__line" aria-hidden="true" />

      <aside className="world-atlas__chapter" aria-hidden="true">
        <span>ATLAS VIVO</span>
        <i />
        <b>{active.index}</b>
      </aside>

      <section className="world-atlas__copy" aria-live="polite">
        <p>{active.chapter}</p>
        <h1>{active.name}</h1>
        <div className="world-atlas__rule"><i /><span>{active.coordinates}</span></div>
        <p className="world-atlas__description">{active.description}</p>
        <span className="world-atlas__detail">{active.detail}</span>
      </section>

      <nav className="world-atlas__regions" aria-label="Escolher região">
        {regions.map((region, index) => (
          <button
            key={region.id}
            type="button"
            className={index === activeIndex ? 'is-active' : ''}
            onClick={() => setActiveIndex(index)}
            aria-current={index === activeIndex ? 'true' : undefined}
          >
            <small>{region.index}</small>
            <span>{region.shortName}</span>
            <i aria-hidden="true" />
          </button>
        ))}
      </nav>

      <div className="world-atlas__controls">
        <button type="button" onClick={() => move(-1)} aria-label="Região anterior">
          <i aria-hidden="true" />
        </button>
        <span><b>{active.index}</b> / 03</span>
        <button type="button" onClick={() => move(1)} aria-label="Próxima região">
          <i aria-hidden="true" />
        </button>
      </div>
    </main>
  )
}
