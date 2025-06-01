import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

interface AboutSectionProps {
  language: 'it' | 'de'
  inView: boolean
}

const translations = {
  it: {
    title: 'La Nostra Storia',
    subtitle: 'Tre Generazioni di Passione',
    timeline: [
      {
        year: '1974',
        title: 'Le Radici',
        description: 'Tutto iniziò con nonno Lorenzo, che con dedizione e amore, fondò la nostra attività basata su qualità e fiducia.',
        image: '/images/melinda_golden.webp'
      },
      {
        year: '2013',
        title: 'La Crescita',
        description: 'Pierluigi continuò ad espandere l\'attività, consolidando rapporti con fornitori e produttori locali e trasformando la passione in un servizio strutturato.',
        image: '/images/pomodori_cuore_bue.webp'
      },
      {
        year: 'OGGI',
        title: 'Il Futuro',
        description: 'Lorenzo, Pierluigi con i figli e il resto della famiglia continuano la tradizione, unendo esperienza e innovazione per il futuro dell\'ortofrutta del Trentino Alto Adige.',
        image: '/images/kiwi-cuore.webp'
      }
    ],
    values: {
      title: 'I Nostri Valori',
      items: [
        {
          icon: '🌱',
          title: 'Freschezza',
          description: 'Selezioniamo quotidianamente solo i prodotti migliori',
          number: '50',
          label: 'Anni di esperienza'
        },
        {
          icon: '⭐',
          title: 'Qualità',
          description: 'Standard elevati garantiti da tre generazioni di esperienza',
          number: '150+',
          label: 'Prodotti selezionati'
        },
        {
          icon: '❤️',
          title: 'Passione',
          description: 'L\'amore per il nostro lavoro si riflette in ogni prodotto',
          number: '50+',
          label: 'Ristoranti serviti'
        },
        {
          icon: '🏔️',
          title: 'Territorio',
          description: 'Valorizzamo i sapori autentici del Trentino Alto Adige',
          number: '6',
          label: 'Giorni a settimana'
        }
      ]
    }
  },
  de: {
    title: 'Unsere Geschichte',
    subtitle: 'Zwei Generationen Leidenschaft',
    timeline: [
      {
        year: '1974',
        title: 'Die Wurzeln',
        description: 'Alles begann mit Großvater Luigi, der mit Hingabe und Liebe für das Südtiroler Land unser Geschäft auf Qualität und Vertrauen gründete.',
        image: '/images/melinda_golden.webp'
      },
      {
        year: '1990',
        title: 'Das Wachstum',
        description: 'Vater Giovanni erweiterte das Geschäft, festigte Beziehungen zu lokalen Produzenten und verwandelte Leidenschaft in strukturierten Service.',
        image: '/images/pomodori_cuore_bue.webp'
      },
      {
        year: 'Heute',
        title: 'Die Zukunft',
        description: 'Pierluigi und die Familie Bottamedi setzen die Tradition fort und verbinden Erfahrung mit Innovation für die Zukunft der Südtiroler Obst- und Gemüsebranche.',
        image: '/images/kiwi-cuore.webp'
      }
    ],
    values: {
      title: 'Unsere Werte',
      items: [
        {
          icon: '🌱',
          title: 'Frische',
          description: 'Wir wählen täglich nur die besten Produkte aus',
          number: '50',
          label: 'Jahre Erfahrung'
        },
        {
          icon: '⭐',
          title: 'Qualität',
          description: 'Hohe Standards garantiert durch drei Generationen Erfahrung',
          number: '150+',
          label: 'Ausgewählte Produkte'
        },
        {
          icon: '❤️',
          title: 'Leidenschaft',
          description: 'Die Liebe zu unserer Arbeit spiegelt sich in jedem Produkt wider',
          number: '50+',
          label: 'Bediente Restaurants'
        },
        {
          icon: '🏔️',
          title: 'Territorium',
          description: 'Wir schätzen die authentischen Aromen Südtirols',
          number: '6',
          label: 'Tage pro Woche'
        }
      ]
    }
  }
}

const TimelineItem: React.FC<{
  item: any
  index: number
  isEven: boolean
}> = ({ item, index, isEven }) => {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -60 : 60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className={`flex flex-col lg:flex-row items-center gap-8 ${
        isEven ? 'lg:flex-row-reverse' : ''
      }`}
    >
      {/* Content */}
      <div className="flex-1 space-y-4">
        <div className="relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
            className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl text-white font-bold text-lg shadow-lg"
          >
            {item.year}
          </motion.div>
        </div>
        
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
          className="text-2xl lg:text-3xl font-bold text-neutral-900"
        >
          {item.title}
        </motion.h3>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: index * 0.2 + 0.5 }}
          className="text-base text-neutral-600 leading-relaxed"
        >
          {item.description}
        </motion.p>
      </div>

      {/* Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, delay: index * 0.2 + 0.2 }}
        className="flex-1 relative group max-w-md"
      >
        <div className="relative overflow-hidden rounded-2xl shadow-xl">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-64 lg:h-72 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </motion.div>
    </motion.div>
  )
}

// Hook personalizzato per il counter animato
const useCountUp = (endValue: number, startValue: number = 0, duration: number = 2000) => {
  const [count, setCount] = React.useState(startValue)
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true })

  React.useEffect(() => {
    if (!inView) return

    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      // Easing function per un'animazione più fluida
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = startValue + (endValue - startValue) * easeOutQuart
      
      setCount(Math.floor(currentValue))

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(endValue)
      }
    }

    requestAnimationFrame(animate)
  }, [inView, endValue, startValue, duration])

  return { ref, count }
}

const ValueCard: React.FC<{
  item: any
  index: number
}> = ({ item, index }) => {
  const { ref, count } = useCountUp(
    parseInt(item.number.replace('+', '')),
    0,
    2000 + index * 200
  )

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative group"
    >
      <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-neutral-100 h-full">
        {/* Icon e Counter */}
        <div className="text-center mb-4">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="text-4xl mb-3"
          >
            {item.icon}
          </motion.div>
          
          {/* Counter animato - dimensioni responsive */}
          <div className="mb-2">
            <motion.span 
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-600 block"
              key={count}
              initial={{ scale: 1.2, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {count}{item.number.includes('+') ? '+' : ''}
            </motion.span>
            <p className="text-xs sm:text-sm text-neutral-500 font-medium">
              {item.label}
            </p>
          </div>
        </div>
        
        {/* Title e Description */}
        <div className="text-center">
          <h3 className="text-lg font-bold text-neutral-900 mb-2">
            {item.title}
          </h3>
          <p className="text-neutral-600 text-sm leading-relaxed">
            {item.description}
          </p>
        </div>
        
        {/* Hover effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
        />
      </div>
    </motion.div>
  )
}

const AboutSection: React.FC<AboutSectionProps> = ({ language, inView }) => {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -30])
  
  const t = translations[language]

  return (
    <section id="about" className="py-16 lg:py-24 bg-gradient-to-br from-neutral-50 to-white relative overflow-hidden">
      {/* Background decorations - Ottimizzate */}
      <motion.div
        style={{ y }}
        className="absolute top-1/4 left-0 w-48 h-48 bg-brand-200/20 rounded-full blur-3xl"
      />
      <motion.div
        style={{ y }}
        className="absolute bottom-1/4 right-0 w-56 h-56 bg-accent-200/20 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
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
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-neutral-600 max-w-2xl mx-auto"
          >
            {t.subtitle}
          </motion.p>
        </motion.div>

        {/* Timeline */}
        <div className="space-y-20 mb-20">
          {t.timeline.map((item, index) => (
            <TimelineItem
              key={index}
              item={item}
              index={index}
              isEven={index % 2 === 0}
            />
          ))}
        </div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-12"
        >
          <h3 className="text-2xl lg:text-4xl font-bold text-neutral-900 mb-6">
            {t.values.title}
          </h3>
        </motion.div>

        {/* Values Cards - Grid responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.values.items.map((item, index) => (
            <ValueCard key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default AboutSection