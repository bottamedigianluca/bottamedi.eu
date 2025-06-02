import React, { useState, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

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
        description: 'Reiche Ausstellung von frischem saisonalem Obst, Gemüse und typischen Trentiner Produkten'
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
        title: 'Schätze des Trentino',
        description: 'Große Auswahl an Spezialitäten aus dem Trentino'
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

// 🖼️ COMPONENTE GALLERY ITEM ULTRA OTTIMIZZATO
const GalleryItem: React.FC<{
  item: any
  index: number
}> = React.memo(({ item, index }) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading')
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: '100px' // Carica prima su mobile
  })

  const handleImageLoad = useCallback(() => {
    setImageState('loaded')
  }, [])

  const handleImageError = useCallback(() => {
    setImageState('error')
  }, [])

  // Memoizza le varianti di animazione
  const itemVariants = useMemo(() => ({
    hidden: { 
      opacity: 0, 
      y: 20, 
      scale: 0.98 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.4,
        delay: Math.min(index * 0.05, 0.3),
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }), [index])

  const imageVariants = useMemo(() => ({
    loading: { 
      opacity: 0, 
      scale: 1.05,
      filter: 'blur(4px)'
    },
    loaded: { 
      opacity: 1, 
      scale: 1,
      filter: 'blur(0px)',
      transition: { 
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    hover: { 
      scale: 1.03,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      } 
    }
  }), [])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={itemVariants}
      whileHover={{ y: -3 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
      style={{ willChange: 'transform' }}
    >
      {/* 📷 IMAGE CONTAINER MOBILE OTTIMIZZATO */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-green-50 to-green-100">
        
        {/* 🔄 LOADING SKELETON MOBILE */}
        {imageState === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center bg-green-100">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 border-2 border-green-300 border-t-green-600 rounded-full animate-spin" />
              <div className="text-green-600 text-xs font-medium">Caricamento...</div>
            </div>
          </div>
        )}

        {/* ❌ ERROR PLACEHOLDER */}
        {imageState === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center text-gray-400">
              <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-xs">Immagine non disponibile</p>
            </div>
          </div>
        )}

        {/* 🖼️ IMMAGINE PRINCIPALE MOBILE FRIENDLY */}
        {imageState !== 'error' && (
          <motion.img
            src={inView ? item.src : ''}
            alt={item.description}
            className="w-full h-full object-cover"
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
            initial="loading"
            animate={imageState}
            whileHover="hover"
            variants={imageVariants}
            style={{
              willChange: 'transform, opacity, filter'
            }}
            // MOBILE OPTIMIZATIONS
            decoding="async"
            fetchPriority={index < 4 ? "high" : "low"}
          />
        )}
        
        {/* 🌈 GRADIENT OVERLAY OTTIMIZZATO */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"
          style={{ willChange: 'opacity' }}
        />

        {/* 📝 TITLE OVERLAY OTTIMIZZATO */}
        <div className="absolute bottom-3 left-3 right-3">
          <motion.h3 
            className="text-white font-semibold text-sm mb-1 drop-shadow-lg leading-tight"
            initial={{ opacity: 0, y: 5 }}
            animate={imageState === 'loaded' ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {item.title}
          </motion.h3>
        </div>
      </div>

      {/* ✨ HOVER EFFECTS OTTIMIZZATI */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ willChange: 'opacity' }}
      />
    </motion.div>
  )
})

// Imposta displayName per il debugging
GalleryItem.displayName = 'GalleryItem'

const BanchettoSection: React.FC<BanchettoSectionProps> = ({ language, inView }) => {
  const t = translations[language]

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
  }, [])

  // Memoizza le varianti per evitare ricrearle ad ogni render
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.1
      }
    }
  }), [])

  const headerVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }), [])

  return (
    <section id="dettaglio" className="py-20 lg:py-28 bg-gradient-to-br from-green-50 to-white relative overflow-hidden">
      {/* 🎨 Background Elements OTTIMIZZATI */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-green-200/15 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-green-300/15 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 🏪 HERO IMAGE OTTIMIZZATA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-14"
        >
          <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden shadow-xl">
            <img
              src="/images/banchetto.webp"
              alt="Il Banchetto Bottamedi a Mezzolombardo ricco di frutta e verdura fresca"
              className="w-full h-full object-cover"
              loading="eager"
              style={{ willChange: 'transform' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
        </motion.div>

        {/* 📝 HEADER OTTIMIZZATO */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={headerVariants}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-neutral-900 mb-5 leading-tight">
            {t.title}
          </h2>
          <p className="text-lg lg:text-xl text-green-600 font-semibold mb-3">
            {t.subtitle}
          </p>
          <p className="text-base lg:text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            {t.description}
          </p>
        </motion.div>

        {/* 🖼️ GALLERY ULTRA OTTIMIZZATA */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-14"
        >
          {t.gallery.map((item, index) => (
            <GalleryItem key={`${item.src}-${index}`} item={item} index={index} />
          ))}
        </motion.div>

        {/* 🎯 CTA OTTIMIZZATO */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center"
        >
          <motion.button
            onClick={scrollToContact}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 lg:px-8 lg:py-4 rounded-xl font-semibold text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            style={{ willChange: 'transform' }}
          >
            {t.cta}
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default BanchettoSection
