type HomeReferencePageProps = {
  onOpenRegions: () => void
  onOpenCharacters: () => void
}

const regions = [
  {
    id: 'auren',
    index: '01',
    name: 'Coração de Auren',
    kicker: 'A Superfície',
    description: 'Cidades antigas florescem sob a sombra das Alturas, onde cada horizonte ainda promete uma descoberta.',
    image: '/worlds/auren-1920.webp',
  },
  {
    id: 'nival',
    index: '02',
    name: 'Coroa de Nival',
    kicker: 'O Norte Silencioso',
    description: 'Palácios de gelo guardam memórias que o inverno se recusou a apagar.',
    image: '/worlds/nival-1920.webp',
  },
  {
    id: 'hanamori',
    index: '03',
    name: 'Hanamori',
    kicker: 'Jardins do Leste',
    description: 'Entre flores e ruínas, caminhos invisíveis revelam a pulsação secreta do mundo.',
    image: '/worlds/hanamori-1920.webp',
  },
] as const

const characters = [
  { name: 'Fuyuka', affinity: 'Nival', image: '/chars/fuyuka-portrait.webp' },
  { name: 'Akane', affinity: 'Cruor', image: '/chars/akane-portrait.webp' },
  { name: 'Miyari', affinity: 'Voltis', image: '/chars/miyari-portrait.webp' },
] as const

export function HomeReferencePage({
  onOpenRegions,
  onOpenCharacters,
}: HomeReferencePageProps) {
  const scrollToWorld = () => {
    document.getElementById('mundo')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main className="gi-home">
      <section id="inicio" className="home-hero" aria-label="Vaelor">
        <picture className="home-hero__media">
          <source media="(max-width:760px)" srcSet="/world-canvas/01-alturas-superficie-v3-mobile.webp" />
          <img src="/new-vaelor-2048.webp" alt="Viajante contemplando Vaelor entre as Alturas e as Fendas" />
        </picture>

        <div className="home-hero__veil" />
        <div className="home-hero__aurora" aria-hidden="true" />
        <div className="home-hero__grain" aria-hidden="true" />

        <aside className="home-hero__chapter" aria-hidden="true">
          <span>PRÓLOGO</span>
          <i />
          <b>01</b>
        </aside>

        <div className="home-hero__content">
          <p className="home-eyebrow"><span /> Crônicas do mundo partido</p>
          <h1>Entre o céu<br />e o <em>abismo.</em></h1>
          <p className="home-hero__lead">
            Vaelor sobreviveu ao impossível. Agora, cada passo revela um mundo
            que tenta lembrar o que existia antes do Cisma.
          </p>
          <div className="home-hero__actions">
            <button className="home-button home-button--gold" type="button" onClick={onOpenRegions}>
              Explorar o mundo <span className="home-button__arrow" aria-hidden="true" />
            </button>
            <button className="home-button home-button--ghost" type="button" onClick={onOpenCharacters}>
              Conhecer personagens <span className="home-button__arrow" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="home-hero__coordinates" aria-hidden="true">
          <small>ARQUIVO 001</small>
          <span>42° 19′ N · 07° 44′ E</span>
        </div>

        <button className="home-hero__scroll" type="button" onClick={scrollToWorld}>
          <span>Descer ao mundo</span>
          <i />
        </button>
      </section>

      <section id="mundo" className="home-world">
        <header className="home-section-heading">
          <p className="home-eyebrow"><span /> Atlas vivo · Volume I</p>
          <div>
            <h2>Um mundo que não<br />deveria <em>existir.</em></h2>
            <p>
              O Cisma abriu o céu, rompeu a terra e transformou a realidade em
              território desconhecido. Entre esses extremos, a vida continuou.
            </p>
          </div>
        </header>

        <div className="home-world__axis" aria-hidden="true">
          <span>ALTURAS</span><i /><b>O CISMA</b><i /><span>FENDAS</span>
        </div>

        <div className="home-regions">
          {regions.map((region) => (
            <article className="home-region" key={region.id}>
              <img src={region.image} alt={`Paisagem de ${region.name}`} loading="lazy" />
              <div className="home-region__veil" />
              <span className="home-region__index">{region.index}</span>
              <div className="home-region__copy">
                <small>{region.kicker}</small>
                <h3>{region.name}</h3>
                <p>{region.description}</p>
                <button type="button" onClick={onOpenRegions} aria-label={`Explorar ${region.name}`}>
                  Abrir no Atlas <span className="home-button__arrow" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-cism" aria-label="O Cisma">
        <picture>
          <source media="(max-width:760px)" srcSet="/world-canvas/02-solo-fendas-v3-mobile.webp" />
          <img src="/world-canvas/02-solo-fendas-v3-desktop.webp" alt="" loading="lazy" />
        </picture>
        <div className="home-cism__veil" />
        <div className="home-cism__mark" aria-hidden="true"><i /><span>V</span><i /></div>
        <div className="home-cism__copy">
          <p>O acontecimento que dividiu uma era</p>
          <h2>O céu se fechou.<br />A terra perdeu o <em>fundo.</em></h2>
          <button className="home-button home-button--ghost" type="button" onClick={scrollToWorld}>
            Descobrir o Cisma <span className="home-button__arrow" aria-hidden="true" />
          </button>
        </div>
      </section>

      <section className="home-cast" aria-labelledby="home-cast-title">
        <div className="home-cast__backdrop" aria-hidden="true" />
        <header>
          <p className="home-eyebrow"><span /> Ecos que atravessam o mundo</p>
          <h2 id="home-cast-title">Aqueles que carregam<br />uma <em>Afinidade.</em></h2>
          <p>Três presenças. Três forças. Nenhuma resposta simples.</p>
        </header>

        <div className="home-cast__portraits">
          {characters.map((character, index) => (
            <button type="button" key={character.name} onClick={onOpenCharacters}>
              <span className="home-cast__number">0{index + 1}</span>
              <img src={character.image} alt={character.name} loading="lazy" />
              <span className="home-cast__identity">
                <small>{character.affinity}</small>
                <strong>{character.name}</strong>
              </span>
            </button>
          ))}
        </div>

        <button className="home-button home-button--gold" type="button" onClick={onOpenCharacters}>
          Encontrar todos <span className="home-button__arrow" aria-hidden="true" />
        </button>
      </section>

      <footer className="home-footer">
        <div>
          <strong>VAELOR</strong>
          <span>Crônicas do Cisma</span>
        </div>
        <p>O mundo voltou a perder o equilíbrio.</p>
        <small>© 2026 Vaelor · Todos os registros preservados</small>
      </footer>
    </main>
  )
}
