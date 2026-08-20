import React, { useState, useRef, lazy, Suspense } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

const CurvedGallery = lazy(() => import('./scene/CurvedGallery'))

const SHOTS = [
  { src: '/images/banco_varieta_autunno-1600w.webp', label: 'Il banco', note: 'Mezzolombardo, ogni mattina dalle sette' },
  { src: '/images/bottamedi_mele_melinda_montagna_cassetta-1600w.webp', label: 'Melinda', note: 'Dalla montagna, in cassetta' },
  { src: '/images/angurie-1600w.webp', label: 'Angurie', note: 'Estate, quando pesano giuste' },
  { src: '/images/pomodori_cuore_bue-1600w.webp', label: 'Cuore di bue', note: 'Quelli che si aprono a fette spesse' },
  { src: '/images/arance_felici-1600w.webp', label: 'Agrumi', note: 'Da dicembre, dal sud' },
  { src: '/images/zucche_decorate_banco-1600w.webp', label: 'Zucche', note: 'Autunno sul banco' },
  { src: '/images/meloni_sattin_dettaglio-1600w.webp', label: 'Meloni', note: 'Scelti al mercato, uno a uno' },
  { src: '/images/albicocche_ingrosso_magazzino-1600w.webp', label: 'Magazzino', note: 'Via de Gasperi, prima delle consegne' },
]

/* Hero: le lettere si compongono, la notte diventa giorno mentre si scorre */
const Hero: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bg = useTransform(scrollYProgress, [0, 1], ['#171310', '#faf7f2'])
  const fg = useTransform(scrollYProgress, [0, 0.8], ['#faf7f2', '#171310'])
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const word = 'BOTTAMEDI'.split('')

  return (
    <motion.section ref={ref} style={{ backgroundColor: bg }} className="relative h-[160vh]">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <motion.div style={{ y }} className="px-6 lg:px-16">
          <motion.p
            style={{ color: fg }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="font-sans text-[11px] tracking-[0.45em] uppercase mb-8"
          >
            Mezzolombardo &middot; Trentino &middot; dal 1974
          </motion.p>

          <h1 className="font-display leading-[0.82] text-[clamp(3.2rem,15vw,15rem)]">
            {word.map((c, i) => (
              <motion.span
                key={i}
                style={{ color: fg }}
                className="inline-block"
                initial={reduce ? {} : { opacity: 0, y: '0.5em', rotateX: -55 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.15 + i * 0.055, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                {c}
              </motion.span>
            ))}
          </h1>

          <motion.p
            style={{ color: fg }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ delay: 1.1, duration: 0.9 }}
            className="font-sans mt-10 max-w-md text-base lg:text-lg leading-relaxed"
          >
            Si parte per il mercato di Verona alle due di notte.
            Il mercato apre pi&ugrave; tardi, ma chi arriva prima sceglie per primo.
          </motion.p>
        </motion.div>
      </div>
    </motion.section>
  )
}

/* Galleria: le foto disposte su un arco, ci si scorre dentro */
const Gallery: React.FC = () => {
  const [focus, setFocus] = useState(0)
  const [ready, setReady] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setReady(true)
          io.disconnect()
        }
      },
      { rootMargin: '300px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const shot = SHOTS[Math.min(focus, SHOTS.length - 1)]

  return (
    <section ref={ref} className="relative bg-terra-50 h-screen overflow-hidden">
      {ready && !reduce && (
        <Suspense fallback={null}>
          <div className="absolute inset-0">
            <CurvedGallery shots={SHOTS} onFocus={setFocus} />
          </div>
        </Suspense>
      )}

      {(!ready || reduce) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <img src={SHOTS[0].src} alt={SHOTS[0].label} className="h-2/3 object-cover rounded-card" />
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 p-6 lg:p-16 pointer-events-none">
        <motion.div
          key={shot.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-3xl lg:text-5xl text-terra-900">{shot.label}</h2>
          <p className="font-sans text-terra-600 mt-2">{shot.note}</p>
        </motion.div>
        <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-terra-400 mt-8">
          trascina o scorri
        </p>
      </div>
    </section>
  )
}

const STORY = [
  {
    year: '1974',
    title: 'Il banchetto',
    text: 'Lorenzo apre a Mezzolombardo. Frutta e verdura scelta a mano, cassetta per cassetta, e clienti che tornano perch&eacute; sanno cosa trovano.',
  },
  {
    year: '',
    title: 'La svolta',
    text: '&Egrave; Pierluigi a costruire l&rsquo;ingrosso: rapporti diretti con i produttori, consegne che non saltano un giorno, cucine che ordinano ogni settimana da vent&rsquo;anni. La parte pi&ugrave; grande dell&rsquo;azienda oggi porta la sua firma.',
  },
  {
    year: 'oggi',
    title: 'Ogni mattina',
    text: 'Si parte alle due, si torna in giornata. La merce arriva al banchetto e nei ristoranti lo stesso giorno in cui &egrave; stata scelta.',
  },
]

const Story: React.FC = () => (
  <section className="bg-terra-50 bg-paper py-32 lg:py-48">
    <div className="px-6 lg:px-16 max-w-5xl">
      <p className="font-sans text-[11px] tracking-[0.45em] uppercase text-orto-600 mb-16">
        Tre generazioni
      </p>
      {STORY.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="grid lg:grid-cols-[8rem_1fr] gap-6 lg:gap-12 py-12 border-t border-terra-200"
        >
          <span className="font-display text-2xl text-orto-600">{s.year}</span>
          <div>
            <h3 className="font-display text-3xl lg:text-5xl text-terra-900 mb-4">{s.title}</h3>
            <p
              className="font-sans text-lg text-terra-700 leading-relaxed max-w-2xl"
              dangerouslySetInnerHTML={{ __html: s.text }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  </section>
)

const Contact: React.FC = () => (
  <section className="bg-terra-900 text-terra-50 py-32 lg:py-48">
    <div className="px-6 lg:px-16 grid lg:grid-cols-2 gap-16">
      <div>
        <p className="font-sans text-[11px] tracking-[0.45em] uppercase text-orto-300 mb-6">
          Al banchetto
        </p>
        <h3 className="font-display text-4xl lg:text-6xl mb-6">Vieni a vedere</h3>
        <p className="font-sans text-terra-200 mb-2">Via Cavalleggeri Udine, Mezzolombardo</p>
        <p className="font-sans text-terra-200 mb-8">Lun &mdash; Sab, 7:00 &mdash; 19:30</p>
        <a
          href="tel:+393515776198"
          className="font-sans text-2xl lg:text-3xl text-orto-200 hover:text-orto-100 transition-colors"
        >
          351 577 6198
        </a>
      </div>
      <div>
        <p className="font-sans text-[11px] tracking-[0.45em] uppercase text-orto-300 mb-6">
          Ingrosso &middot; Ho.Re.Ca.
        </p>
        <h3 className="font-display text-4xl lg:text-6xl mb-6">Per la tua cucina</h3>
        <p className="font-sans text-terra-200 mb-2">Via Alcide de Gasperi 47, Mezzolombardo</p>
        <p className="font-sans text-terra-200 mb-8">Consegne in tutta la Piana Rotaliana</p>
        <a
          href="tel:+390461602534"
          className="font-sans text-2xl lg:text-3xl text-orto-200 hover:text-orto-100 transition-colors"
        >
          0461 602534
        </a>
      </div>
    </div>
  </section>
)

const Site: React.FC = () => (
  <main className="bg-terra-50">
    <Hero />
    <Gallery />
    <Story />
    <Contact />
  </main>
)

export default Site
