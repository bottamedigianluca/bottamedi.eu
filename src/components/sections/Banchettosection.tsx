import React, { useState } from 'react'
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

// 🖼️ COMPONENTE GALLERY ITEM OTTIMIZZATO (INTEGRATO)
const GalleryItem: React.FC<{
  item: any
  index: number
}> = ({ item, index }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: '100px' // Carica prima che entri nella viewport
  })

  const handleImageLoad = () => {
    setIsLoaded(true)
  }

  const handleImageError = () => {
    setHasError(true)
    setIsLoaded(true)
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={inView ? { 
        opacity: 1, 
        y: 0, 
        scale: 1
      } : {}}
      transition={{
        duration: 0.6,
        delay: Math.min(index * 0.1, 0.8), // Max delay 0.8s
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
    >
      {/* 📷 IMAGE CONTAINER */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-green-50 to-green-100">
        
        {/* 🔄 LOADING PLACEHOLDER */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-3">
              <motion.div 
                className="w-8 h-8 border-3 border-green-200 border-t-green-500 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span className="text-green-600 text-sm font-medium">Caricamento...</span>
            </div>
          </div>
        )}

        {/* ❌ ERROR PLACEHOLDER */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <p className="text-sm">Immagine non disponibile</p>
            </div>
          </div>
        )}

        {/* 🖼️ ACTUAL IMAGE */}
        {!hasError && (
          <motion.img
            src={inView ? item.src : ''}
            alt={item.description}
            className="w-full h-full object-cover"
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ 
              opacity: isLoaded ? 1 : 0,
              scale: isLoaded ? 1 : 1.1
            }}
            transition={{ 
              duration: 0.8,
              ease: "easeOut"
            }}
            whileHover={{ scale: 1.05 }}
            style={{
              willChange: 'transform, opacity'
            }}
          />
        )}
        
        {/* 🌈 GRADIENT OVERLAY */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
          initial={{ opacity: 0.7 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* 📝 TITLE OVERLAY */}
        <div className="absolute bottom-4 left-4 right-4">
          <motion.h3 
            className="text-white font-bold text-lg mb-1 drop-shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {item.title}
          </motion.h3>
        </div>
      </div>

      {/* ✨ HOVER EFFECTS */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        initial={false}
      />

      {/* 📱 MOBILE TOUCH FEEDBACK */}
      <motion.div
        className="absolute inset-0 bg-white/10 opacity-0 pointer-events-none"
        whileTap={{ opacity: 0.3 }}
        transition={{ duration: 0.1 }}
      />
    </motion.div>
  )
}

const BanchettoSection: React.FC<BanchettoSectionProps> = ({ language, inView }) => {
  const t = translations[language]

  const scrollToContact = () => {
    const element = document.getElementById('contact')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="dettaglio" className="py-24 lg:py-32 bg-gradient-to-br from-green-50 to-white relative overflow-hidden">
      {/* 🎨 Background Elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-green-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-green-300/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 🏪 HERO IMAGE */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="/images/banchetto.webp"
              alt="Il Banchetto Bottamedi a Mezzolombardo ricco di frutta e verdura fresca"
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
        </motion.div>

        {/* 📝 HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
            {t.title}
          </h2>
          <p className="text-xl text-green-600 font-semibold mb-4">
            {t.subtitle}
          </p>
          <p className="text-lg text-neutral-600 max-w-4xl mx-auto leading-relaxed">
            {t.description}
          </p>
        </motion.div>

        {/* 🖼️ GALLERY OTTIMIZZATA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
          {t.gallery.map((item, index) => (
            <GalleryItem key={index} item={item} index={index} />
          ))}
        </div>

        {/* 🎯 CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <motion.button
            onClick={scrollToContact}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {t.cta}
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default BanchettoSection