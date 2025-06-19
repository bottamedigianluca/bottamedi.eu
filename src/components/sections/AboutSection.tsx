import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import OptimizedImage from '../ui/OptimizedImage'

// Declare tracking functions for TypeScript
declare global {
  interface Window {
    trackStoriaTradizione: (elemento: string, interesse: string) => void;
    trackQualitaProdotti: (aspetto: string, valutazione: string) => void;
    trackTempoSezione: (sezione: string, secondi: number) => void;
    trackNavigazione: (sezione: string, azione: string, dettaglio: string) => void;
    updateCurrentSection: (sectionName: string) => void;
    gtag: (...args: any[]) => void;
  }
}

interface AboutSectionProps {
  language: 'it' | 'de'
  inView: boolean
}

const translations = {
  it: {
    title: 'La Nostra Storia',
    subtitle: 'Tre Generazioni di Eccellenza nel Settore Ortofrutticolo',
    timeline: [
      {
        year: '1974',
        title: 'Le Fondamenta',
        description: 'Nonno Lorenzo pose le prime pietre di quello che sarebbe diventato un punto di riferimento nel settore ortofrutticolo trentino. Con dedizione assoluta e visione imprenditoriale, fondò un\'attività basata su principi saldi: qualità inarrivabile, fiducia reciproca e servizio autentico.',
        image: '/images/melinda_golden.webp'
      },
      {
        year: '2013',
        title: 'L\'Evoluzione',
        description: 'Pierluigi trasformò la passione familiare in una realtà strutturata e moderna. Consolidando rapporti esclusivi con i migliori produttori locali e ampliando la rete di fornitura, elevò gli standard qualitativi e pose le basi per servire anche il settore professionale.',
        image: '/images/pomodori_cuore_bue.webp'
      },
      {
        year: 'OGGI',
        title: 'Il Futuro',
        description: 'Lorenzo, Pierluigi con i figli e l\'intera famiglia Bottamedi continuano la tradizione con rinnovato slancio. Unendo l\'esperienza di tre generazioni all\'innovazione moderna, serviamo ogni giorno famiglie, ristoranti d\'eccellenza e istituti del territorio, sempre fedeli ai nostri valori fondanti.',
        image: '/images/kiwi-cuore.webp'
      }
    ],
    values: {
      title: 'I Nostri Valori',
      items: [
        {
          icon: '🌱',
          title: 'Freschezza',
          description: 'Selezione quotidiana alle prime ore per garantire prodotti al massimo della qualità',
          number: '50',
          label: 'Anni di esperienza'
        },
        {
          icon: '⭐',
          title: 'Eccellenza',
          description: 'Standard elevati certificati da tre generazioni di competenza nel settore',
          number: '150+',
          label: 'Varietà selezionate'
        },
        {
          icon: '❤️',
          title: 'Passione',
          description: 'L\'amore per il nostro lavoro si riflette nella cura di ogni singolo prodotto',
          number: '50+',
          label: 'Partner commerciali'
        },
        {
          icon: '🏔️',
          title: 'Territorio',
          description: 'Valorizzazione dei sapori autentici del Trentino Alto Adige e delle sue tradizioni',
          number: '6',
          label: 'Giorni di servizio'
        }
      ]
    }
  },
  de: {
    title: 'Unsere Geschichte',
    subtitle: 'Drei Generationen Exzellenz im Obst- und Gemüsesektor',
    timeline: [
      {
        year: '1974',
        title: 'Die Grundlagen',
        description: 'Großvater Lorenzo legte die ersten Steine dessen, was zu einem Bezugspunkt im Südtiroler Obst- und Gemüsesektor werden sollte. Mit absoluter Hingabe und unternehmerischer Weitsicht gründete er ein Unternehmen basierend auf soliden Prinzipien: unerreichbare Qualität, gegenseitiges Vertrauen und authentischen Service.',
        image: '/images/melinda_golden.webp'
      },
      {
        year: '2013',
        title: 'Die Entwicklung',
        description: 'Pierluigi verwandelte die Familienleidenschaft in eine strukturierte und moderne Realität. Durch die Festigung exklusiver Beziehungen zu den besten lokalen Produzenten und die Erweiterung des Liefernetzwerks hob er die Qualitätsstandards an und schuf die Grundlagen für die Belieferung auch des professionellen Sektors.',
        image: '/images/pomodori_cuore_bue.webp'
      },
      {
        year: 'HEUTE',
        title: 'Die Zukunft',
        description: 'Lorenzo, Pierluigi mit den Söhnen und die gesamte Familie Bottamedi setzen die Tradition mit erneuertem Schwung fort. Durch die Verbindung der Erfahrung von drei Generationen mit moderner Innovation bedienen wir täglich Familien, Exzellenz-Restaurants und Institutionen des Gebiets, immer treu unseren Grundwerten.',
        image: '/images/kiwi-cuore.webp'
      }
    ],
    values: {
      title: 'Unsere Werte',
      items: [
        {
          icon: '🌱',
          title: 'Frische',
          description: 'Tägliche Auswahl in den frühen Morgenstunden für Produkte höchster Qualität',
          number: '50',
          label: 'Jahre Erfahrung'
        },
        {
          icon: '⭐',
          title: 'Exzellenz',
          description: 'Hohe Standards zertifiziert durch drei Generationen Kompetenz im Sektor',
          number: '150+',
          label: 'Ausgewählte Sorten'
        },
        {
          icon: '❤️',
          title: 'Leidenschaft',
          description: 'Die Liebe zu unserer Arbeit spiegelt sich in der Pflege jedes einzelnen Produkts wider',
          number: '50+',
          label: 'Geschäftspartner'
        },
        {
          icon: '🏔️',
          title: 'Territorium',
          description: 'Förderung der authentischen Aromen Südtirols und seiner Traditionen',
          number: '6',
          label: 'Servicetage'
        }
      ]
    }
  }
}

const useOptimizedCountUp = (endValue: number, inView: boolean, delay: number = 0) => {
  const [count, setCount] = useState(0)
  const shouldReduceMotion = useReducedMotion()
  
  React.useEffect(() => {
    if (!inView) return

    const startAnimation = () => {
      if (shouldReduceMotion) {
        setCount(endValue)
        return
      }

      let startTime: number
      const duration = 2000 + delay
      
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / duration, 1)
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        const currentValue = easeOutQuart * endValue
        
        setCount(Math.floor(currentValue))

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setCount(endValue)
        }
      }

      requestAnimationFrame(animate)
    }

    const timeoutId = setTimeout(startAnimation, delay)
    return () => clearTimeout(timeoutId)
  }, [inView, endValue, delay, shouldReduceMotion])

  return count
}

const TimelineItem: React.FC<{
  item: any
  index: number
  isEven: boolean
}> = React.memo(({ item, index, isEven }) => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
    rootMargin: '50px'
  })
  
  const shouldReduceMotion = useReducedMotion()

  // 🎯 TRACKING INTERESSE TIMELINE
  useEffect(() => {
    if (inView && typeof window !== 'undefined') {
      const periodoMap: Record<string, string> = {
        '1974': 'fondazione_lorenzo',
        '2013': 'evoluzione_pierluigi', 
        'OGGI': 'futuro_famiglia',
        'HEUTE': 'futuro_famiglia'
      }
      
      const elementoStoria = periodoMap[item.year] || 'periodo_sconosciuto'
      
      // Track storia e tradizione
      window.trackStoriaTradizione?.(elementoStoria, 'visualizzazione_timeline')
      
      // Track qualità percepita nel tempo
      if (item.year === '1974') {
        window.trackQualitaProdotti?.('tradizione_familiare', 'interesse_origini')
      } else if (item.year === '2013') {
        window.trackQualitaProdotti?.('evoluzione_professionale', 'interesse_crescita')
      } else if (item.year === 'OGGI' || item.year === 'HEUTE') {
        window.trackQualitaProdotti?.('innovazione_moderna', 'interesse_futuro')
      }

      // Analytics dettagliate timeline
      if (window.gtag) {
        window.gtag('event', 'timeline_visualizzata', {
          event_category: 'Storia e Tradizione',
          event_label: `timeline_${item.year}`,
          custom_parameter_1: elementoStoria,
          custom_parameter_2: `posizione_${index + 1}`,
          custom_parameter_3: 'interesse_storia_aziendale',
          value: 5
        })
      }
    }
  }, [inView, item.year, index])

  const itemVariants = useMemo(() => ({
    hidden: { 
      opacity: 0, 
      x: shouldReduceMotion ? 0 : (isEven ? -60 : 60),
      y: shouldReduceMotion ? 20 : 0
    },
    visible: { 
      opacity: 1, 
      x: 0, 
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.3 : 0.6,
        delay: shouldReduceMotion ? 0 : index * 0.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }), [index, isEven, shouldReduceMotion])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={itemVariants}
      className={`flex flex-col lg:flex-row items-center gap-8 ${
        isEven ? 'lg:flex-row-reverse' : ''
      }`}
    >
      <div className="flex-1 space-y-4">
        <div className="relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ 
              duration: shouldReduceMotion ? 0.2 : 0.5, 
              delay: shouldReduceMotion ? 0 : index * 0.2 + 0.3 
            }}
            className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl text-white font-bold text-lg shadow-lg"
          >
            {item.year}
          </motion.div>
        </div>
        
        <motion.h3
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ 
            duration: shouldReduceMotion ? 0.2 : 0.6, 
            delay: shouldReduceMotion ? 0 : index * 0.2 + 0.4 
          }}
          className="text-2xl lg:text-3xl font-bold text-neutral-900"
        >
          {item.title}
        </motion.h3>
        
        <motion.p
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ 
            duration: shouldReduceMotion ? 0.2 : 0.6, 
            delay: shouldReduceMotion ? 0 : index * 0.2 + 0.5 
          }}
          className="text-base text-neutral-600 leading-relaxed"
        >
          {item.description}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.8 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ 
          duration: shouldReduceMotion ? 0.2 : 0.6, 
          delay: shouldReduceMotion ? 0 : index * 0.2 + 0.2 
        }}
        className="flex-1 relative group max-w-md"
      >
        <div className="relative overflow-hidden rounded-2xl shadow-xl">
          <OptimizedImage
            src={item.image}
            alt={item.title}
            className="w-full h-64 lg:h-72 transition-transform duration-500 group-hover:scale-105"
            priority={index === 0}
            placeholder="blur"
            aspectRatio="4/3"
            objectFit="cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </motion.div>
    </motion.div>
  )
})

TimelineItem.displayName = 'TimelineItem'

const ValueCard: React.FC<{
  item: any
  index: number
}> = React.memo(({ item, index }) => {
  const [ref, inView] = useInView({ 
    threshold: 0.2, 
    triggerOnce: true,
    rootMargin: '50px'
  })
  
  const count = useOptimizedCountUp(
    parseInt(item.number.replace('+', '')),
    inView,
    index * 200
  )
  
  const shouldReduceMotion = useReducedMotion()

  // 🎯 TRACKING VALORI AZIENDALI
  useEffect(() => {
    if (inView && typeof window !== 'undefined') {
      const valoriMap: Record<string, string> = {
        'Freschezza': 'freschezza_quotidiana',
        'Frische': 'freschezza_quotidiana',
        'Eccellenza': 'standard_elevati',
        'Exzellenz': 'standard_elevati',
        'Passione': 'passione_familiare',
        'Leidenschaft': 'passione_familiare',
        'Territorio': 'valorizzazione_territorio',
        'Territorium': 'valorizzazione_territorio'
      }
      
      const valoreSpecifico = valoriMap[item.title] || 'valore_generico'
      
      // Track qualità prodotti attraverso valori
      window.trackQualitaProdotti?.(valoreSpecifico, 'visualizzazione_valore')
      
      // Track storia e tradizione per valori legati alla famiglia
      if (['passione_familiare', 'freschezza_quotidiana'].includes(valoreSpecifico)) {
        window.trackStoriaTradizione?.(valoreSpecifico, 'comprensione_valori')
      }

      // Analytics dettagliate valori
      if (window.gtag) {
        window.gtag('event', 'valore_aziendale_visualizzato', {
          event_category: 'Valori e Qualità',
          event_label: `valore_${valoreSpecifico}`,
          custom_parameter_1: valoreSpecifico,
          custom_parameter_2: `numero_${item.number}`,
          custom_parameter_3: 'comprensione_brand',
          value: 3
        })
      }
    }
  }, [inView, item.title, item.number])

  const cardVariants = useMemo(() => ({
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 30,
      scale: shouldReduceMotion ? 1 : 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.5,
        delay: shouldReduceMotion ? 0 : index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }), [index, shouldReduceMotion])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={cardVariants}
      whileHover={shouldReduceMotion ? {} : { y: -5, scale: 1.02 }}
      className="relative group"
      style={{ willChange: 'transform' }}
    >
      <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-neutral-100 h-full">
        <div className="text-center mb-4">
          <motion.div
            whileHover={shouldReduceMotion ? {} : { scale: 1.1, rotate: 5 }}
            className="text-4xl mb-3"
          >
            {item.icon}
          </motion.div>
          
          <div className="mb-2">
            <motion.span 
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 block"
              key={count}
              initial={{ scale: shouldReduceMotion ? 1 : 1.2, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: shouldReduceMotion ? 0.1 : 0.3 }}
            >
              {count}{item.number.includes('+') ? '+' : ''}
            </motion.span>
            <p className="text-xs sm:text-sm text-neutral-500 font-medium">
              {item.label}
            </p>
          </div>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-bold text-neutral-900 mb-2">
            {item.title}
          </h3>
          <p className="text-neutral-600 text-sm leading-relaxed">
            {item.description}
          </p>
        </div>
        
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
        />
      </div>
    </motion.div>
  )
})

ValueCard.displayName = 'ValueCard'

const AboutSection: React.FC<AboutSectionProps> = ({ language, inView }) => {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -30])
  const shouldReduceMotion = useReducedMotion()
  const [sectionStartTime] = useState(Date.now())
  
  const t = useMemo(() => translations[language], [language])

  // 🎯 TRACKING SEZIONE ABOUT
  useEffect(() => {
    if (inView && typeof window !== 'undefined') {
      // Aggiorna sezione corrente
      window.updateCurrentSection?.('about')
      
      // Track storia e tradizione - interesse generale
      window.trackStoriaTradizione?.('sezione_storia_visualizzata', 'interesse_iniziale')
      
      // Track qualità - comprensione brand
      window.trackQualitaProdotti?.('presentazione_aziendale', 'prima_conoscenza')

      // Analytics ingresso sezione
      if (window.gtag) {
        window.gtag('event', 'sezione_about_visualizzata', {
          event_category: 'Navigazione Sezioni',
          event_label: 'ingresso_storia',
          custom_parameter_1: 'about',
          custom_parameter_2: 'comprensione_brand',
          custom_parameter_3: 'interesse_storia_aziendale',
          value: 8
        })
      }
    }

    // Cleanup: track tempo nella sezione
    return () => {
      if (inView && typeof window !== 'undefined') {
        const timeInSection = Math.round((Date.now() - sectionStartTime) / 1000)
        if (timeInSection > 5) {
          window.trackTempoSezione?.('about', timeInSection)
          
          // Se ha passato molto tempo, è molto interessato alla storia
          if (timeInSection > 30) {
            window.trackStoriaTradizione?.('lettura_approfondita_storia', 'interesse_molto_alto')
          }
        }
      }
    }
  }, [inView, sectionStartTime])

  const headerVariants = useMemo(() => ({
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }), [shouldReduceMotion])

  const subtitleVariants = useMemo(() => ({
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.6,
        delay: shouldReduceMotion ? 0 : 0.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }), [shouldReduceMotion])

  const valuesHeaderVariants = useMemo(() => ({
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.6,
        delay: shouldReduceMotion ? 0 : 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }), [shouldReduceMotion])

  return (
    <section id="about" className="py-16 lg:py-24 bg-gradient-to-br from-neutral-50 to-white relative overflow-hidden">
      {!shouldReduceMotion && (
        <>
          <motion.div
            style={{ y }}
            className="absolute top-1/4 left-0 w-48 h-48 bg-green-200/20 rounded-full blur-3xl"
          />
          <motion.div
            style={{ y }}
            className="absolute bottom-1/4 right-0 w-56 h-56 bg-green-300/20 rounded-full blur-3xl"
          />
        </>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={headerVariants}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-3xl lg:text-5xl font-bold text-neutral-900 mb-4"
            style={{
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {t.title}
          </motion.h2>
          <motion.p
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={subtitleVariants}
            className="text-lg text-neutral-600 max-w-2xl mx-auto"
          >
            {t.subtitle}
          </motion.p>
        </motion.div>

        <div className="space-y-20 mb-20">
          {t.timeline.map((item, index) => (
            <TimelineItem
              key={`timeline-${index}`}
              item={item}
              index={index}
              isEven={index % 2 === 0}
            />
          ))}
        </div>

        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={valuesHeaderVariants}
          className="text-center mb-12"
        >
          <h3 className="text-2xl lg:text-4xl font-bold text-neutral-900 mb-6">
            {t.values.title}
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.values.items.map((item, index) => (
            <ValueCard key={`value-${index}`} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default React.memo(AboutSection)
