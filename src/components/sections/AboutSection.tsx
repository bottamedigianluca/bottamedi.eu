import React, { useState, useCallback, useMemo } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
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

// 🚀 PERFORMANCE: Lazy Image Component Ottimizzato
const LazyImage: React.FC<{
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
}> = React.memo(({ src, alt, className = '', style = {} }) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading')
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: '50px' // Preload quando vicino al viewport
  })

  const handleLoad = useCallback(() => {
    setImageState('loaded')
  }, [])

  const handleError = useCallback(() => {
    setImageState('error')
    console.warn(`Failed to load image: ${src}`)
  }, [src])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`} style={style}>
      {/* Skeleton loader */}
      {imageState === 'loading' && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
      )}
      
      {/* Error fallback */}
      {imageState === 'error' && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded-lg flex items-center justify-center">
              📷
            </div>
            <p className="text-xs">Immagine non disponibile</p>
          </div>
        </div>
      )}
      
      {/* Actual image - solo se in view */}
      {inView && imageState !== 'error' && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            imageState === 'loaded' ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          style={{ willChange: 'opacity' }}
        />
      )}
    </div>
  )
})

LazyImage.displayName = 'LazyImage'

// 🔢 PERFORMANCE: Counter Hook Ottimizzato
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
        const progress = Math.
