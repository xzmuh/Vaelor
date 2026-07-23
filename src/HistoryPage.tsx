import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const chapters = [
  {
    id: 'before',
    number: 'I',
    label: 'Antes da ruptura',
    title: 'O mundo acreditava que todo horizonte podia ser vencido.',
    text: 'Reinos, cidades e viajantes avançavam guiados pela exploração. O desconhecido era uma distância — nunca um limite.',
    image: '/worlds/auren-1920.webp',
    color: '#efcf91',
  },
  {
    id: 'schism',
    number: 'II',
    label: 'O Cisma',
    title: 'Então o céu se fechou. E a terra deixou de ter fundo.',
    text: 'O Cisma não apagou o mundo. Ele dividiu sua certeza. Acima das nuvens nasceram as Alturas; abaixo da superfície, as Fendas.',
    image: '/world-canvas/02-solo-fendas-v3-desktop.webp',
    color: '#b99aff',
  },
  {
    id: 'spark',
    number: 'III',
    label: 'A Faísca',
    title: 'Muitos viram o colapso. Apenas um enxergou a anomalia.',
    text: 'Ele nasceu comum. Quando tocou o fenômeno invisível, recebeu algo que não pertence a nenhuma Afinidade conhecida. A pergunta não é qual poder despertou — mas por que somente ele conseguiu vê-lo.',
    image: '/chars/background-protagonist.webp',
    color: '#ffe39a',
  },
] as const

export function HistoryPage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const pageRef = useRef<HTMLElement>(null)
  const active = chapters[activeIndex]

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const duration = reduceMotion ? 0 : 1
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .fromTo('.history-stage__scene', { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: duration * 1.4 })
        .fromTo(
          '.history-figure--female',
          { autoAlpha: 0, xPercent: 10 },
          { autoAlpha: 1, xPercent: 0, duration: duration * 1.2 },
          .12,
        )
        .fromTo(
          '.history-figure--male',
          { autoAlpha: 0, xPercent: -8 },
          { autoAlpha: 1, xPercent: 0, duration: duration * 1.2 },
          .18,
        )
        .fromTo('.history-copy > *', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, stagger: .08, duration: duration * .72 }, .25)
        .fromTo('.history-chapter', { autoAlpha: 0, y: 24, rotate: -1 }, { autoAlpha: 1, y: 0, rotate: 0, stagger: .1, duration: duration * .6 }, .45)
    }, pageRef)
    return () => context.revert()
  }, [activeIndex])

  const select = (index: number) => {
    if (index === activeIndex) return
    gsap.to('.history-stage__scene,.history-figure,.history-copy > *', {
      autoAlpha: 0,
      duration: .32,
      onComplete: () => setActiveIndex(index),
    })
  }

  return (
    <main className={`history-page history-page--${active.id}`} ref={pageRef} style={{ '--history-color': active.color } as React.CSSProperties}>
      <div className="history-stage" key={active.id}>
        <img className="history-stage__scene" src={active.image} alt="" />
        <div className="history-stage__map" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="history-stage__wash" />
        <div className="history-stage__rays" />
        <div className="history-figures" aria-label="Vaelora e Vaelor diante do mundo partido">
          <div className="history-figure history-figure--female">
            <img src="/chars/vaelor-fem-fullbody-v2.webp" alt="Vaelora" />
          </div>
          <div className="history-figure history-figure--male">
            <img src="/chars/vaelor-man-fullbody-v2.webp" alt="Vaelor" />
          </div>
        </div>
        <div className="history-stage__dust" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ '--dust': index } as React.CSSProperties} />)}</div>
      </div>

      <section className="history-copy" aria-live="polite">
        <div className="history-copy__sigil"><i /><span>{active.number}</span><i /></div>
        <p>{active.label} · Crônicas do mundo partido</p>
        <h1>{active.title}</h1>
        <div className="history-copy__line"><i /><b /></div>
        <p className="history-copy__text">{active.text}</p>
        <span className="history-copy__note">Fragmento preservado no Arquivo de Vaelor</span>
      </section>

      <nav className="history-chapters" aria-label="Capítulos da origem">
        {chapters.map((chapter, index) => (
          <button key={chapter.id} className={`history-chapter ${index === activeIndex ? 'is-active' : ''}`} onClick={() => select(index)}>
            <span className="history-chapter__tape" />
            <img src={chapter.image} alt="" loading={index === 0 ? 'eager' : 'lazy'} />
            <span className="history-chapter__veil" />
            <small>{chapter.number}</small>
            <strong>{chapter.label}</strong>
          </button>
        ))}
      </nav>

      <div className="history-progress" aria-hidden="true">
        <span>{String(activeIndex + 1).padStart(2, '0')}</span>
        <i><b style={{ width: `${((activeIndex + 1) / chapters.length) * 100}%` }} /></i>
        <span>03</span>
      </div>
    </main>
  )
}
