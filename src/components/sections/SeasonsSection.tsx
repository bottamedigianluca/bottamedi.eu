import React, { useRef, useState, lazy, Suspense } from 'react'
import { motion, useScroll, useMotionValueEvent, useReducedMotion } from 'framer-motion'

// Il bundle 3D arriva dopo: la pagina si vede subito, la scena si aggiunge.
// E' la strategia dei siti che passano i Core Web Vitals con scene ricche.
const SeasonsScene = lazy(() => import('../scene/SeasonsScene'))

interface SeasonsSectionProps {
  language: 'it' | 'de'
  inView?: boolean
}

const copy = {
  it: {
    kicker: 'Il banco cambia',
    title: 'Quello che è giusto adesso',
    lead: 'Non vendiamo fragole a dicembre. Il banco segue le stagioni, e le stagioni decidono cosa vale la pena comprare.',
    seasons: [
      { name: 'Primavera', months: 'marzo — maggio', text: 'Asparagi di Zambana, fragole di montagna, le prime insalate. Il banco si riempie di verde dopo l’inverno.' },
      { name: 'Estate',    months: 'giugno — agosto', text: 'Pesche, albicocche, angurie, pomodori cuore di bue. È la stagione in cui si parte più presto e si torna con più cassette.' },
      { name: 'Autunno',   months: 'settembre — novembre', text: 'Mele Melinda dalla montagna, uva, zucche, funghi. Il Trentino dà il meglio proprio adesso.' },
      { name: 'Inverno',   months: 'dicembre — febbraio', text: 'Agrumi dal sud, radicchio, cavoli, frutta secca. Meno colori sul banco, ma scelti uno per uno.' },
    ],
  },
  de: {
    kicker: 'Der Stand wechselt',
    title: 'Was gerade richtig ist',
    lead: 'Wir verkaufen keine Erdbeeren im Dezember. Der Stand folgt den Jahreszeiten, und die Jahreszeiten entscheiden, was sich zu kaufen lohnt.',
    seasons: [
      { name: 'Frühling', months: 'März — Mai', text: 'Spargel aus Zambana, Bergerdbeeren, die ersten Salate. Nach dem Winter wird der Stand wieder grün.' },
      { name: 'Sommer',   months: 'Juni — August', text: 'Pfirsiche, Aprikosen, Wassermelonen, Ochsenherz-Tomaten. Die Saison, in der wir am frühesten losfahren.' },
      { name: 'Herbst',   months: 'September — November', text: 'Melinda-Äpfel aus den Bergen, Trauben, Kürbisse, Pilze. Das Trentino zeigt jetzt sein Bestes.' },
      { name: 'Winter',   months: 'Dezember — Februar', text: 'Zitrusfrüchte aus dem Süden, Radicchio, Kohl, Trockenobst. Weniger Farben, dafür einzeln ausgewählt.' },
    ],
  },
}

const SeasonsSection: React.FC<SeasonsSectionProps> = ({ language }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [sceneReady, setSceneReady] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const t = copy[language]

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  // lo scroll sceglie la stagione: quattro "stanze" attraversate, non una lista
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const i = Math.min(t.seasons.length - 1, Math.floor(v * t.seasons.length))
    setIndex((prev) => (prev === i ? prev : i))
  })

  // carica il 3D solo quando la sezione si avvicina davvero
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSceneReady(true); io.disconnect() } },
      { rootMargin: '200px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const current = t.seasons[index]

  return (
    <section id="seasons" ref={ref} className="relative bg-terra-50 bg-paper" style={{ height: '380vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* la scena vive dietro al testo, non al posto suo */}
        {sceneReady && !shouldReduceMotion && (
          <Suspense fallback={null}>
            <SeasonsScene seasonIndex={index} className="absolute inset-0" />
          </Suspense>
        )}

        <div className="relative h-full container mx-auto px-6 lg:px-8 flex flex-col justify-center pointer-events-none">
          <div className="max-w-xl">
            <p className="font-sans text-sm tracking-[0.2em] uppercase text-orto-600 mb-4">{t.kicker}</p>
            <h2 className="font-display text-4xl lg:text-6xl leading-[1.05] text-terra-900 mb-5">{t.title}</h2>
            <p className="font-sans text-base lg:text-lg text-terra-700 mb-12 max-w-md">{t.lead}</p>

            <motion.div
              key={current.name}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-baseline gap-4 mb-3">
                <h3 className="font-display text-3xl lg:text-4xl text-terra-900">{current.name}</h3>
                <span className="font-sans text-sm text-terra-500">{current.months}</span>
              </div>
              <p className="font-sans text-base lg:text-lg text-terra-700 max-w-md leading-relaxed">{current.text}</p>
            </motion.div>

            {/* indicatore di avanzamento: dice sempre dove sei */}
            <div className="flex gap-2 mt-10" role="presentation">
              {t.seasons.map((s, i) => (
                <div key={s.name} className="h-0.5 w-12 rounded-full overflow-hidden bg-terra-200">
                  <motion.div
                    className="h-full bg-orto-600"
                    initial={false}
                    animate={{ scaleX: i <= index ? 1 : 0 }}
                    style={{ originX: 0 }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default React.memo(SeasonsSection)
