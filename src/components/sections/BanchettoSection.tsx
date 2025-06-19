import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import OptimizedImage from '../ui/OptimizedImage'

// 🎯 TRACKING GLOBALE
declare global {
  interface Window {
    updateCurrentSection: (sectionName: string) => void;
    trackQualitaProdotti: (aspetto: string, valutazione: string) => void;
    trackTempoSezione: (sezione: string, secondi: number) => void;
    gtag: (...args: any[]) => void;
  }
}

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

// 🎬 HERO IMAGE OTTIMIZZATA PER ENTERPRISE
const HeroImage: React.FC<{ inView: boolean; language: string }> = React.memo(({ inView, language }) => {
  const shouldReduceMotion = useReducedMotion()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const { scrollY } = useScroll()
  
  // Parallax molto leggero per performance
  const y = useTransform(scrollY, [0, 500], [0, shouldReduceMotion ? 0 : 20])

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true)
    
    // Track successful load
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'banchetto_hero_image_loaded', {
        event_category: 'Performance',
        event_label: 'hero_image_success',
        value: 1
      })
    }
  }, [])

  const handleImageError = useCallback(() => {
    setImageError(true)
    console.warn('🚨 Errore caricamento hero image banchetto')
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: shouldReduceMotion ? 0.2 : 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="mb-12 lg:mb-14"
      style={{ y }}
    >
      <div className="relative h-64 sm:h-80 lg:h-96 rounded-3xl overflow-hidden shadow-2xl">
        {/* Loading placeholder */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-green-200 via-green-100 to-green-200">
            <div className="absolute inset-0">
              <div className="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-60 animate-pulse"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-green-600">
                <div className="w-12 h-12 mx-auto mb-3 bg-green-300 rounded-xl animate-pulse"></div>
                <p className="text-sm font-medium">Caricamento...</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Error fallback */}
        {imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
            <div className="text-center text-green-700">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-300 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">🛒</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Il Nostro Banchetto</h3>
              <p className="text-sm">
                {language === 'it' 
                  ? 'Frutta e verdura fresca ogni giorno' 
                  : 'Frisches Obst und Gemüse jeden Tag'
                }
              </p>
            </div>
          </div>
        )}
        
        {/* Main image */}
        <OptimizedImage
          src="/images/banchetto.webp"
          alt="Il Banchetto Bottamedi a Mezzolombardo ricco di frutta e verdura fresca"
          className={`w-full h-full transition-all duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          priority={true}
          placeholder="empty"
          aspectRatio="16/9"
          objectFit="cover"
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ 
            willChange: 'opacity',
            backfaceVisibility: 'hidden'
          }}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        
        {/* Badge indicator */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={imageLoaded ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg"
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-green-600">APERTO</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
})

HeroImage.displayName = 'HeroImage'

// 🖼️ COMPONENTE IMMAGINE GALLERY ENTERPRISE
const GalleryImage: React.FC<{
  item: any
  index: number
  priority?: boolean
  inView: boolean
}> = React.memo(({ item, index, priority = false, inView }) => {
  const shouldReduceMotion = useReducedMotion()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  
  // Intersection observer per lazy loading intelligente
  const [imageRef, imageInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: priority ? '300px' : '150px'
  })

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true)
  }, [])

  const handleImageError = useCallback(() => {
    setImageError(true)
    console.warn(`🚨 Errore caricamento immagine gallery: ${item.src}`)
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
        delay: shouldReduceMotion ? 0 : Math.min(index * 0.03, 0.15),
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }), [index, shouldReduceMotion])

  // Error fallback ottimizzato
  if (imageError) {
    return (
      <motion.div
        ref={imageRef}
        initial="hidden"
        animate={inView && imageInView ? "visible" : "hidden"}
        variants={itemVariants}
        className="group relative bg-gradient-to-br from-green-50 to-green-100 rounded-2xl overflow-hidden shadow-md h-48 md:h-56 border border-green-200"
      >
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="text-center text-green-600">
            <div className="w-8 h-8 mx-auto mb-2 bg-green-200 rounded-lg flex items-center justify-center">
              <span className="text-sm">🖼️</span>
            </div>
            <p className="text-xs font-medium mb-1">{item.title}</p>
            <p className="text-xs opacity-75">{item.description}</p>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      ref={imageRef}
      initial="hidden"
      animate={inView && imageInView ? "visible" : "hidden"}
      variants={itemVariants}
      whileHover={shouldReduceMotion ? {} : { 
        y: -2, 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
      style={{ 
        willChange: 'transform',
        touchAction: 'manipulation'
      }}
    >
      <div className="relative h-48 md:h-56 overflow-hidden">
        {/* Loading placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-60 animate-pulse" />
          </div>
        )}
        
        {/* Main image */}
        <OptimizedImage
          src={item.src}
          alt={item.description}
          className={`w-full h-full transition-all duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          priority={priority}
          placeholder="empty"
          aspectRatio="16/9"
          objectFit="cover"
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ 
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden'
          }}
        />
        
        {/* Hover overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"
          style={{ willChange: 'opacity' }}
        />

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <motion.h3 
            className="text-white font-semibold text-sm sm:text-base mb-1 drop-shadow-lg leading-tight"
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 5 }}
            animate={imageInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: shouldReduceMotion ? 0 : 0.2, duration: shouldReduceMotion ? 0.1 : 0.3 }}
          >
            {item.title}
          </motion.h3>
          
          <motion.p
            className="hidden sm:block text-white/90 text-xs leading-relaxed drop-shadow"
            initial={{ opacity: 0 }}
            animate={imageInView ? { opacity: 1 } : {}}
            transition={{ delay: shouldReduceMotion ? 0 : 0.3, duration: shouldReduceMotion ? 0.1 : 0.3 }}
          >
            {item.description}
          </motion.p>
        </div>
      </div>

      {/* Priority loading indicator */}
      {priority && !imageLoaded && !imageError && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg" />
      )}

      {/* Hover effect */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-600/0 group-hover:from-green-500/5 group-hover:to-green-600/5 transition-all duration-300 pointer-events-none"
        style={{ willChange: 'opacity' }}
      />
    </motion.div>
  )
})

GalleryImage.displayName = 'GalleryImage'

// 📱 COMPONENTE PRINCIPALE OTTIMIZZATO
const BanchettoSection: React.FC<BanchettoSectionProps> = ({ language, inView }) => {
  const t = useMemo(() => translations[language], [language])
  const shouldReduceMotion = useReducedMotion()
  const [sectionStartTime] = useState(Date.now())

  // 🎯 TRACKING ENTERPRISE
  useEffect(() => {
    if (inView && typeof window !== 'undefined') {
      // Aggiorna sezione corrente
      window.updateCurrentSection?.('dettaglio')
      
      // Track qualità prodotti
      window.trackQualitaProdotti?.('presentazione_banchetto', 'visualizzazione_sezione')
      
      // Analytics enterprise
      if (window.gtag) {
        window.gtag('event', 'banchetto_section_viewed', {
          event_category: 'Section Engagement',
          event_label: 'banchetto_dettaglio',
          custom_parameter_1: 'sezione_centrale',
          custom_parameter_2: 'visualizzazione_prodotti',
          value: 5
        })
      }
    }

    // Cleanup: track tempo permanenza
    return () => {
      if (inView && typeof window !== 'undefined') {
        const timeInSection = Math.round((Date.now() - sectionStartTime) / 1000)
        if (timeInSection > 3) {
          window.trackTempoSezione?.('dettaglio', timeInSection)
        }
      }
    }
  }, [inView, sectionStartTime])

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

    // Haptic feedback
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(25)
      } catch (e) {
        // Silent fail
      }
    }

    // Track CTA click
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'cta_orari_contatti_click', {
        event_category: 'CTA Clicks',
        event_label: 'from_banchetto_section',
        value: 10
      })
    }
  }, [])

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.02,
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
      style={{
        willChange: 'auto',
        contain: 'layout style',
        backfaceVisibility: 'hidden'
      }}
    >
      {/* Background ottimizzato */}
      {!shouldReduceMotion && (
        <>
          <div className="absolute top-1/4 left-0 w-64 sm:w-80 h-64 sm:h-80 bg-green-200/10 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-1/4 right-0 w-64 sm:w-80 h-64 sm:h-80 bg-green-300/10 rounded-full blur-3xl opacity-60" />
        </>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero Image */}
        <HeroImage inView={inView} language={language} />

        {/* Header */}
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

        {/* Gallery ottimizzata */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-12 lg:mb-14"
        >
          {t.gallery.map((item, index) => (
            <GalleryImage 
              key={`gallery-${index}`} 
              item={item} 
              index={index}
              priority={priorityImages.has(index)}
              inView={inView}
            />
          ))}
        </motion.div>

        {/* CTA finale */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={ctaVariants}
          className="text-center px-4"
        >
          <motion.button
            onClick={scrollToContact}
            whileHover={shouldReduceMotion ? {} : { 
              scale: 1.02, 
              y: -2,
              boxShadow: "0 10px 25px rgba(34, 197, 94, 0.3)"
            }}
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
