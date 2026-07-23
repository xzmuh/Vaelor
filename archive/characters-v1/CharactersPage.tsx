import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'

type IconName = 'nival' | 'cruor' | 'arcane' | 'spark'
type Form = 'man' | 'fem'

type Character = {
  id: string
  name: string
  affinity: string
  category: string
  description: string
  quote: string
  color: string
  icon: IconName
  hasForms?: boolean
}

const characters: Character[] = [
  {
    id: 'fuyuka', name: 'Fuyuka', affinity: 'Nival', category: 'Silêncio glacial', icon: 'nival', color: '#8edcff',
    description: 'Frieza, disciplina e elegância. Sua presença carrega a precisão de um inverno que não precisa anunciar sua chegada.',
    quote: 'O frio não silencia o mundo. Apenas revela o que sempre esteve escondido.',
  },
  {
    id: 'akane', name: 'Akane', affinity: 'Cruor', category: 'Pulso carmesim', icon: 'cruor', color: '#ef6578',
    description: 'Beleza e inquietação caminham juntas. Akane manifesta a natureza orgânica de Cruor com presença melancólica.',
    quote: 'Toda vida deixa um eco. Alguns apenas aprendem a escutá-lo.',
  },
  {
    id: 'miyari', name: 'Miyari', affinity: 'Não catalogada', category: 'Arquivo em formação', icon: 'arcane', color: '#b78cff',
    description: 'Uma presença enigmática entre os primeiros rostos de Vaelor. Sua verdadeira relação com as energias do mundo ainda não foi registrada.',
    quote: 'Alguns mistérios preferem sorrir antes de oferecer uma resposta.',
  },
  {
    id: 'protagonist', name: 'Vaelor', affinity: 'Faísca', category: 'Aquele que enxergou', icon: 'spark', color: '#ffe184', hasForms: true,
    description: 'Nasceu comum. Quando todos viram apenas o vazio, percebeu uma anomalia invisível e tocou algo que não pertence a nenhuma Afinidade conhecida.',
    quote: 'A pergunta não é qual poder recebeu, mas por que somente ele conseguiu enxergar.',
  },
]

function ElementIcon({ name }: { name: IconName }) {
  if (name === 'nival') return <svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="26" strokeDasharray="2 5" /><path d="M32 8v48M11 20l42 24M53 20 11 44M27 13l5 6 5-6M27 51l5-6 5 6M14 24l8 1-3-8M50 40l-8-1 3 8M50 24l-8 1 3-8M14 40l8-1-3 8" /><path d="m32 25 7 4v7l-7 4-7-4v-7Z" /></svg>
  if (name === 'cruor') return <svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="26" strokeDasharray="2 5" /><path d="M32 10C25 22 18 29 18 39a14 14 0 0 0 28 0c0-10-7-17-14-29Z" /><path d="M25 41c1 4 4 6 8 6M32 18v22M26 30l6 6 6-6" /></svg>
  if (name === 'arcane') return <svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="26" strokeDasharray="2 5" /><circle cx="32" cy="32" r="7" /><ellipse cx="32" cy="32" rx="22" ry="9" transform="rotate(35 32 32)" /><ellipse cx="32" cy="32" rx="22" ry="9" transform="rotate(-35 32 32)" /><path d="m32 25 4 7-4 7-4-7Z" /></svg>
  return <svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="26" strokeDasharray="2 5" /><path d="m32 7 5 19 18 6-18 6-5 19-6-19-18-6 18-6Z" /><path d="m32 22 10 10-10 10-10-10Z" /><circle cx="32" cy="32" r="3" /></svg>
}

export function CharactersPage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [form, setForm] = useState<Form>('man')
  const pageRef = useRef<HTMLElement>(null)
  const active = characters[activeIndex]
  const assetId = active.hasForms ? `vaelor-${form}` : active.id
  const displayName = active.hasForms && form === 'fem' ? 'Vaelora' : active.name

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline()
        .fromTo('.character-stage__background', { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 1.05, ease: 'power2.out' })
        .fromTo('.character-stage__art', { opacity: 0, x: 70, scale: 1.035 }, { opacity: 1, x: 0, scale: 1, duration: .9, ease: 'power3.out' }, 0)
        .fromTo('.character-copy > *', { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: .58, stagger: .055, ease: 'power3.out' }, .16)
        .fromTo('.element-emblem', { opacity: 0, rotate: -25, scale: .75 }, { opacity: .16, rotate: 0, scale: 1, duration: .9, ease: 'power3.out' }, .08)
    }, pageRef)
    return () => ctx.revert()
  }, [activeIndex, form])

  const transitionTo = (callback: () => void) => {
    gsap.to('.character-stage__art,.character-copy > *,.element-emblem', { opacity: 0, duration: .26, onComplete: callback })
  }
  const select = (index: number) => {
    if (index === activeIndex) return
    transitionTo(() => { setActiveIndex(index); if (!characters[index].hasForms) setForm('man') })
  }
  const changeForm = (next: Form) => {
    if (next === form) return
    transitionTo(() => setForm(next))
  }
  const step = (direction: number) => select((activeIndex + direction + characters.length) % characters.length)

  return (
    <main className={`characters-page character--${active.id} form--${form}`} ref={pageRef} style={{ '--character-color': active.color } as React.CSSProperties}>
      <div className="character-stage" key={assetId}>
        <picture className="character-stage__background">
          <source media="(max-width: 760px)" srcSet={`/chars/background-${active.id}-mobile.webp`} />
          <img src={`/chars/background-${active.id}.webp`} alt="" aria-hidden="true" />
        </picture>
        <div className="character-stage__geometry" aria-hidden="true"><i /><i /><i /></div>
        <div className="character-stage__world" />
        <div className="character-stage__wash" />
        <div className="element-emblem"><ElementIcon name={active.icon} /></div>
        <img className="character-stage__art" src={`/chars/${assetId}-fullbody-v2.webp`} alt={`Arte completa de ${displayName}`} />
        <div className="character-stage__energy" />
        <div className="character-stage__sparkles" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ '--spark': index } as React.CSSProperties} />)}</div>
      </div>

      <aside className="affinity-rail" aria-label="Afinidades do elenco">
        <span>Elenco inicial</span>
        {characters.map((character, index) => (
          <button key={character.id} className={index === activeIndex ? 'is-active' : ''} onClick={() => select(index)}>
            <i style={{ color: character.color }}><ElementIcon name={character.icon} /></i>
            <span>{character.affinity}</span>
          </button>
        ))}
        <div className="affinity-rail__line" />
      </aside>

      <section className="character-copy" aria-live="polite">
        <p className="character-copy__eyebrow">{active.category}</p>
        <h1>{displayName}</h1>
        <div className="character-copy__affinity"><i><ElementIcon name={active.icon} /></i><b>{active.affinity}</b><span /></div>
        <p className="character-copy__description">{active.description}</p>
        {active.hasForms && (
          <div className="form-switcher" aria-label="Escolher protagonista">
            <span>Forma</span>
            <button className={form === 'man' ? 'is-active' : ''} onClick={() => changeForm('man')}><img src="/chars/vaelor-man-portrait.webp" alt="" /><b>Vaelor</b></button>
            <button className={form === 'fem' ? 'is-active' : ''} onClick={() => changeForm('fem')}><img src="/chars/vaelor-fem-portrait.webp" alt="" /><b>Vaelora</b></button>
          </div>
        )}
        <blockquote>“{active.quote}”</blockquote>
      </section>

      <div className="character-picker" aria-label="Selecionar personagem">
        <button className="character-picker__arrow" onClick={() => step(-1)} aria-label="Personagem anterior">‹</button>
        <div className="character-picker__items">
          {characters.map((character, index) => {
            const portrait = character.hasForms ? `vaelor-${form}` : character.id
            return <button key={character.id} className={index === activeIndex ? 'is-active' : ''} onClick={() => select(index)} aria-label={`Ver ${character.name}`}>
              <span className="character-picker__portrait"><img src={`/chars/${portrait}-portrait.webp?v=3`} alt="" /><i style={{ color: character.color }}><ElementIcon name={character.icon} /></i></span>
              <strong>{character.hasForms ? 'Protagonista' : character.name}</strong>
            </button>
          })}
        </div>
        <button className="character-picker__arrow" onClick={() => step(1)} aria-label="Próximo personagem">›</button>
      </div>

      <div className="character-pagination"><b>0{activeIndex + 1}</b><span />0{characters.length}</div>
    </main>
  )
}
