import React, { useState, useCallback, useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import OptimizedImage from '../ui/OptimizedImage'

interface BanchettoSectionProps {
  language: 'it' | 'de'
  inView: boolean
}

const translations = {
  it: {
    title: 'Al Banchetto: Colori, Sapori e Freschezza Quotidiana',
    subtitle: 'Vieni a trovarci in Via Cavalleggeri Udine a Mezzolombardo!',
    description: 'Lasciati tentare da un\'esplosione di colori, profumi e dalla migliore frutta e verdura freschissima, selezionata per te ogni giorno con la cura e la passione di famiglia che ci contraddistingue da generazioni.',
    cta: 'Orari e Contatti del Banchetto',
    gallery: [
      {
        src: '/images/banco_varieta_autunno.webp',
        title: 'Abbondanza di Stagione',
        description: 'Ricca esposizione di frutta fresca di stagione, verdure e prodotti tipici del Trentino'
      },
      {
        src: '/images/pomodori_cuore_bue.webp',
        title: 'Verdure dell\'Orto Locale',
        description: 'Pomodori cuore di bue rossi freschi e profumati'
      },
      {
        src: '/images/melinda_golden.webp',
        title: 'Golden Melinda',
        description: 'Mele Golden Melinda fresche e succose'
      },
      {
        src: '/images/angurie.webp',
        title: 'Dolcezza Estiva',
        description: 'Angurie fresche e succose, tagliate e intere'
      },
      {
        src: '/images/meloni_sattin_dettaglio.webp',
        title: 'Meloni Pregiati',
        description: 'Meloni Sattin Dolce Passione profumati e dolci'
      },
      {
        src: '/images/banco_frigo_disidratata_specialita.webp',
        title: 'Tesori del Trentino',
        description: 'Ampia selezione di specialità del Trentino'
      },
      {
        src: '/images/arance_felici.webp',
        title: 'Agrumi Selezionati',
        description: 'Arance fresche e succose La Favorita Felici'
      },
      {
        src: '/images/zucche_decorate_banco.webp',
        title: 'Ti Aspettiamo!',
        description: 'Atmosfera accogliente e stagionale al Banchetto'
      },
      {
        src: '/images/bottamedi_mele_pink_lady_confezione.webp',
        title: 'Mele Pink Lady',
        description: 'Confezione di Mele Pink Lady fresche e croccanti'
      },
      {
        src: '/images/bottamedi_ananas_fruitpoint_freschi.webp',
        title: 'Ananas Esotici di Qualità',
        description: 'Ananas freschi e maturi Fruitpoint'
      },
      {
        src: '/images/bottamedi_sacchetti_frutta_disidratata_mista.webp',
        title: 'Frutta Disidratata Mista',
        description: 'Sacchetti di frutta disidratata mista colorata e gustosa'
      },
      {
        src: '/images/bottamedi_mele_melinda_montagna_cassetta.webp',
        title: 'Mela di Montagna Melinda',
        description: 'Cassetta di Mele Melinda \'Mela di Montagna\' fresche'
      }
    ]
  },
  de: {
    title: 'Am Marktstand: Farben, Geschmäcker und tägliche Frische',
    subtitle: 'Besuchen Sie uns in der Via Cavalleggeri Udine in Mezzolombardo!',
    description: 'Lassen Sie sich von einer Explosion von Farben, Düften und dem besten frischen Obst und Gemüse verführen, das täglich mit der Sorgfalt und Leidenschaft der Familie ausgewählt wird, die uns seit Generationen auszeichnet.',
    cta: 'Öffnungszeiten und Kontakt zum Marktstand',
    gallery: [
      {
        src: '/images/banco_varieta_autunno.webp',
        title: 'Saisonale Fülle',
        description: 'Reiche Ausstellung von frischem saisonalem Obst, Gemüse und typischen Südtiroler Produkten'
      },
      {
        src: '/images/pomodori_cuore_bue.webp',
        title: 'Gemüse aus dem lokalen Garten',
        description: 'Rote frische und duftende Ochsenherz-Tomaten'
      },
      {
        src: '/images/melinda_golden.webp',
        title: 'Golden Melinda',
        description: 'Frische und saftige Golden Melinda Äpfel'
      },
      {
        src: '/images/angurie.webp',
        title: 'Sommerliche Süße',
        description: 'Frische und saftige Wassermelonen, geschnitten und ganz'
      },
      {
        src: '/images/meloni_sattin_dettaglio.webp',
        title: 'Edle Melonen',
        description: 'Duftende und süße Sattin Dolce Passione Melonen'
      },
      {
        src: '/images/banco_frigo_disidratata_specialita.webp',
        title: 'Schätze Südtirols',
        description: 'Große Auswahl an Spezialitäten aus Südtirol'
      },
      {
        src: '/images/arance_felici.webp',
        title: 'Ausgewählte Zitrusfrüchte',
        description: 'Frische und saftige Orangen La Favorita Felici'
      },
      {
        src: '/images/zucche_decorate_banco.webp',
        title: 'Wir erwarten Sie!',
        description: 'Einladende und saisonale Atmosphäre am Marktstand'
      },
      {
        src: '/images/bottamedi_mele_pink_lady_confezione.webp',
        title: 'Pink Lady Äpfel',
        description: 'Packung frischer und knackiger Pink Lady Äpfel'
      },
      {
        src: '/images/bottamedi_ananas_fruitpoint_freschi.webp',
        title: 'Exotische Qualitäts-Ananas',
        description: 'Frische und reife Fruitpoint Ananas'
      },
      {
        src: '/images/bottamedi_sacchetti_frutta_disidratata_mista.webp',
        title: 'Gemischte Trockenfrüchte',
        description: 'Beutel mit bunten und leckeren gemischten Trockenfrüchten'
      },
      {
        src: '/images/bottamedi_mele_melinda_montagna_cassetta.webp',
        title: 'Melinda Bergapfel',
        description: 'Kiste mit frischen Melinda \'Bergapfel\' Äpfeln'
      }
    ]
  }
}

// 🎯 MOBILE-FIRST IMAGE COMPONENT
const MobileOptimizedImage: React.FC<{
  item: any
  index: number
  priority?: boolean
}> = React.memo(({ item, index, priority = false }) => {
  const shouldReduceMotion = useReducedMotion()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  
  const [ref, inView] = useInView({
    threshold: 0.05, // Ridotto per mobile
    triggerOnce: true,
    rootMargin: priority ? '300px' : '150px' // Aumentato margine per mobile
  })

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true)
  }, [])

  const handleImageError = useCallback(() => {
    setImageError(true)
    console.warn(`Errore caricamento immagine: ${item.src}`)
  }, [item.src])

  const itemVariants = useMemo(() => ({
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 15, 
      scale: shouldReduceMotion ? 1 : 0.98 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.4,
        delay: shouldReduceMotion ? 0 : Math.min(index * 0.03, 0.15), // Ridotto delay
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }), [index, shouldReduceMotion])

  // Fallback per errori immagine
  if (imageError) {
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={itemVariants}
        className="group relative bg-gray-100 rounded-2xl overflow-hidden shadow-md h-48 md:h-56"
      >
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
          <div className="text-center text-gray-500">
            <div className="w-8 h-8 mx-auto mb-2 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-sm">🖼️</span>
            </div>
            <p className="text-xs font-medium">{item.title}</p>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={itemVariants}
      whileHover={shouldReduceMotion ? {} : { y: -2 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
      style={{ 
        willChange: 'transform',
        touchAction: 'manipulation' // Migliora il touch su mobile
      }}
    >
      <div className="relative h-48 md:h-56 overflow-hidden bg-gradient-to-br from-green-50 to-green-100">
        {/* Placeholder durante caricamento */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-60 animate-pulse" />
          </div>
        )}
        
        {/* Immagine principale */}
        <OptimizedImage
          src={item.src}
          alt={item.description}
          className={`w-full h-full transition-all duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          priority={priority}
          placeholder="skeleton"
          aspectRatio="16/9"
          objectFit="cover"
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ 
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden' // Performance mobile
          }}
        />
        
        {/* Overlay gradiente */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"
          style={{ willChange: 'opacity' }}
        />

        {/* Contenuto overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <motion.h3 
            className="text-white font-semibold text-sm sm:text-base mb-1 drop-shadow-lg leading-tight"
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 5 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: shouldReduceMotion ? 0 : 0.2, duration: shouldReduceMotion ? 0.1 : 0.3 }}
          >
            {item.title}
          </motion.h3>
          
          {/* Descrizione solo su tablet e desktop */}
          <motion.p
            className="hidden sm:block text-white/90 text-xs leading-relaxed drop-shadow"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: shouldReduceMotion ? 0 : 0.3, duration: shouldReduceMotion ? 0.1 : 0.3 }}
          >
            {item.description}
          </motion.p>
        </div>
      </div>

      {/* Indicatore caricamento */}
      {priority && !imageLoaded && !imageError && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg" />
      )}

      {/* Hover effect overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-600/0 group-hover:from-green-500/5 group-hover:to-green-600/5 transition-all duration-300 pointer-events-none"
        style={{ willChange: 'opacity' }}
      />
    </motion.div>
  )
})

MobileOptimizedImage.displayName = 'MobileOptimizedImage'

// 🎬 HERO IMAGE OTTIMIZZATA PER MOBILE
const HeroImage: React.FC<{ inView: boolean }> = React.memo(({ inView }) => {
  const shouldReduceMotion = useReducedMotion()
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: shouldReduceMotion ? 0.2 : 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="mb-12 lg:mb-14"
    >
      <div className="relative h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-xl">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-green-200 via-green-100 to-green-200 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-60" />
          </div>
        )}
        
        <OptimizedImage
          src="/images/banchetto.webp"
          alt="Il Banchetto Bottamedi a Mezzolombardo ricco di frutta e verdura fresca"
          className={`w-full h-full transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          priority={true}
          placeholder="skeleton"
          aspectRatio="16/9"
          objectFit="cover"
          onLoad={() => setImageLoaded(true)}
          style={{ 
            willChange: 'opacity',
            backfaceVisibility: 'hidden'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>
    </motion.div>
  )
})

HeroImage.displayName = 'HeroImage'

const BanchettoSection: React.FC<BanchettoSectionProps> = ({ language, inView }) => {
  const t = useMemo(() => translations[language], [language])
  const shouldReduceMotion = useReducedMotion()

  const scrollToContact = useCallback(() => {
    const element = document.getElementById('contact')
    if (element) {
      const offset = 80
      const elementPosition = element.offsetTop - offset
      window.scrollTo({
        top: Math.max(0, elementPosition),
        behavior: 'smooth'
      })
    }

    // Haptic feedback ottimizzato
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(25)
      } catch (e) {
        // Silently fail
      }
    }
  }, [])

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.02, // Ridotto stagger
        delayChildren: shouldReduceMotion ? 0 : 0.05
      }
    }
  }), [shouldReduceMotion])

  const headerVariants = useMemo(() => ({
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }), [shouldReduceMotion])

  const ctaVariants = useMemo(() => ({
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.5,
        delay: shouldReduceMotion ? 0 : 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }), [shouldReduceMotion])

  const priorityImages = useMemo(() => new Set([0, 1, 2, 3]), [])

  return (
    <section 
      id="dettaglio" 
      className="py-16 sm:py-20 lg:py-28 bg-gradient-to-br from-green-50 to-white relative overflow-hidden"
    >
      {/* Background ottimizzato */}
      {!shouldReduceMotion && (
        <>
          <div className="absolute top-1/4 left-0 w-64 sm:w-80 h-64 sm:h-80 bg-green-200/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-64 sm:w-80 h-64 sm:h-80 bg-green-300/10 rounded-full blur-3xl" />
        </>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <HeroImage inView={inView} />

        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={headerVariants}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-neutral-900 mb-4 sm:mb-5 leading-tight px-2">
            {t.title}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-green-600 font-semibold mb-2 sm:mb-3 px-2">
            {t.subtitle}
          </p>
          <p className="text-sm sm:text-base lg:text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed px-4">
            {t.description}
          </p>
        </motion.div>

        {/* Gallery con layout responsivo ottimizzato */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-12 lg:mb-14"
        >
          {t.gallery.map((item, index) => (
            <MobileOptimizedImage 
              key={`gallery-${index}`} 
              item={item} 
              index={index}
              priority={priorityImages.has(index)}
            />
          ))}
        </motion.div>

        {/* CTA ottimizzato per mobile */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={ctaVariants}
          className="text-center px-4"
        >
          <motion.button
            onClick={scrollToContact}
            whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-semibold text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-300 min-w-[240px] sm:min-w-[280px]"
            style={{ 
              willChange: 'transform',
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation'
            }}
          >
            <span className="flex items-center justify-center space-x-2">
              <span>🛒</span>
              <span>{t.cta}</span>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default React.memo(BanchettoSection)
