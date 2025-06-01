import React, { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

interface ServicesSectionProps {
  language: 'it' | 'de'
  inView?: boolean
}

const translations = {
  it: {
    title: 'I Nostri Servizi',
    subtitle: 'Due modi per portare la qualità Bottamedi sulla tua tavola',
    whatWeOffer: 'Cosa ti offriamo:',
    services: [
      {
        id: 'dettaglio',
        title: 'Il Nostro Banchetto',
        shortDesc: 'Esperienza diretta con i prodotti migliori',
        description: 'Nel cuore di Mezzolombardo, il nostro colorato banchetto è molto più di un semplice punto vendita. È il luogo dove la passione di famiglia incontra la qualità quotidiana.',
        longDescription: 'Ogni mattina alle prime luci dell\'alba, selezioniamo personalmente frutta e verdura freschissima, creando un arcobaleno di sapori e colori che racconta la storia della nostra terra. Qui trovi non solo prodotti freschi, ma anche consigli personalizzati tramandati da tre generazioni.',
        features: [
          { icon: '🌅', title: 'Freschezza Mattutina', desc: 'Selezione quotidiana alle prime ore del giorno' },
          { icon: '🎨', title: 'Varietà Colorata', desc: 'Oltre 100 tipologie di frutta e verdura sempre disponibili' },
          { icon: '👨‍👩‍👧‍👦', title: 'Tradizione Familiare', desc: 'Consigli e ricette tramandati da tre generazioni' },
          { icon: '🏔️', title: 'Prodotti del Territorio', desc: 'Specialità locali del Trentino Alto Adige selezionate' },
          { icon: '💝', title: 'Servizio Personalizzato', desc: 'Attenzione individuale per ogni cliente' },
          { icon: '🕰️', title: 'Orari Flessibili', desc: 'Aperti 6 giorni su 7 per la tua comodità' }
        ],
        icon: '🛒',
        color: 'from-green-500 to-green-600',
        bgColor: 'bg-green-50',
        textColor: 'text-green-600',
        image: '/images/banchetto.webp',
        stats: [
          { label: 'Anni di tradizione', value: '50' },
          { label: 'Varietà disponibili', value: '100+' },
          { label: 'Clienti fedeli', value: '500+' }
        ]
      },
      {
        id: 'services',
        title: 'Servizio Ingrosso HORECA',
        shortDesc: 'Partner di fiducia per la tua attività',
        description: 'Il cuore pulsante della nostra attività: forniamo ogni giorno ristoranti, hotel, pizzerie e negozi con la stessa passione e qualità che mettiamo al nostro banchetto.',
        longDescription: 'Non siamo solo fornitori, siamo partner che comprendono le esigenze del tuo business. Ogni alba iniziamo il nostro lavoro selezionando i prodotti migliori per i nostri clienti HORECA. La nostra esperienza ci permette di anticipare le tue esigenze stagionali e proporti sempre il meglio del mercato.',
        features: [
          { icon: '🚚', title: 'Consegne Puntuali', desc: 'Servizio di consegna 6 giorni su 7 in orari concordati' },
          { icon: '🔍', title: 'Selezione Rigorosa', desc: 'Controllo qualità su ogni singolo prodotto' },
          { icon: '📋', title: 'Listini Personalizzati', desc: 'Prezzi competitivi adattati alle tue esigenze' },
          { icon: '🤝', title: 'Partnership Duratura', desc: 'Rapporti di fiducia costruiti negli anni' },
          { icon: '📱', title: 'Ordinazioni Semplici', desc: 'Sistema di ordini rapido e affidabile' },
          { icon: '🎯', title: 'Prodotti Stagionali', desc: 'Consulenza su disponibilità e stagionalità' }
        ],
        icon: '🚛',
        color: 'from-blue-500 to-blue-600',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600',
        image: '/images/albicocche_ingrosso_magazzino.webp',
        stats: [
          { label: 'Ristoranti partner', value: '50+' },
          { label: 'Consegne settimanali', value: '300+' },
          { label: 'Anni di esperienza', value: '30+' }
        ]
      }
    ]
  },
  de: {
    title: 'Unsere Dienstleistungen',
    subtitle: 'Zwei Wege, um Bottamedi-Qualität auf Ihren Tisch zu bringen',
    whatWeOffer: 'Was wir Ihnen bieten:',
    services: [
      {
        id: 'dettaglio',
        title: 'Unser Marktstand',
        shortDesc: 'Direkter Kontakt mit den besten Produkten',
        description: 'Im Herzen von Mezzolombardo ist unser bunter Marktstand viel mehr als nur ein Verkaufspunkt. Es ist der Ort, wo Familienleidenschaft auf tägliche Qualität trifft.',
        longDescription: 'Jeden Morgen bei den ersten Lichtstrahlen wählen wir persönlich frischestes Obst und Gemüse aus und schaffen einen Regenbogen von Geschmäckern und Farben, der die Geschichte unseres Landes erzählt.',
        features: [
          { icon: '🌅', title: 'Morgenfrische', desc: 'Tägliche Auswahl in den frühen Morgenstunden' },
          { icon: '🎨', title: 'Bunte Vielfalt', desc: 'Über 100 Sorten Obst und Gemüse immer verfügbar' },
          { icon: '👨‍👩‍👧‍👦', title: 'Familientradition', desc: 'Tipps und Rezepte aus drei Generationen' },
          { icon: '🏔️', title: 'Regionale Produkte', desc: 'Ausgewählte lokale Spezialitäten aus Südtirol' },
          { icon: '💝', title: 'Persönlicher Service', desc: 'Individuelle Betreuung für jeden Kunden' },
          { icon: '🕰️', title: 'Flexible Zeiten', desc: '6 Tage die Woche für Ihre Bequemlichkeit geöffnet' }
        ],
        icon: '🛒',
        color: 'from-green-500 to-green-600',
        bgColor: 'bg-green-50',
        textColor: 'text-green-600',
        image: '/images/banchetto.webp',
        stats: [
          { label: 'Jahre Tradition', value: '50' },
          { label: 'Verfügbare Sorten', value: '100+' },
          { label: 'Treue Kunden', value: '500+' }
        ]
      },
      {
        id: 'services',
        title: 'HORECA Großhandel',
        shortDesc: 'Vertrauenspartner für Ihr Unternehmen',
        description: 'Das pulsierende Herz unserer Tätigkeit: Wir beliefern täglich Restaurants, Hotels, Pizzerien und Geschäfte mit derselben Leidenschaft und Qualität.',
        longDescription: 'Wir sind nicht nur Lieferanten, sondern Partner, die die Bedürfnisse Ihres Unternehmens verstehen. Jeden Morgen beginnen wir unsere Arbeit mit der Auswahl der besten Produkte für unsere HORECA-Kunden.',
        features: [
          { icon: '🚚', title: 'Pünktliche Lieferungen', desc: 'Lieferservice 6 Tage die Woche zu vereinbarten Zeiten' },
          { icon: '🔍', title: 'Strenge Auswahl', desc: 'Qualitätskontrolle für jedes einzelne Produkt' },
          { icon: '📋', title: 'Persönliche Preislisten', desc: 'Wettbewerbsfähige Preise angepasst an Ihre Bedürfnisse' },
          { icon: '🤝', title: 'Dauerhafte Partnerschaft', desc: 'Vertrauensbeziehungen über Jahre aufgebaut' },
          { icon: '📱', title: 'Einfache Bestellungen', desc: 'Schnelles und zuverlässiges Bestellsystem' },
          { icon: '🎯', title: 'Saisonale Produkte', desc: 'Beratung zu Verfügbarkeit und Saisonalität' }
        ],
        icon: '🚛',
        color: 'from-blue-500 to-blue-600',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600',
        image: '/images/albicocche_ingrosso_magazzino.webp',
        stats: [
          { label: 'Restaurant-Partner', value: '50+' },
          { label: 'Wöchentliche Lieferungen', value: '300+' },
          { label: 'Jahre Erfahrung', value: '30+' }
        ]
      }
    ]
  }
}

// Animazioni perfezionate
const smoothVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },
  card: {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  },
  cardHover: {
    y: -5,
    scale: 1.02,
    transition: { 
      duration: 0.3, 
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  image: {
    hover: { 
      scale: 1.05, 
      transition: { 
        duration: 0.4, 
        ease: "easeOut" 
      } 
    }
  },
  detailsPanel: {
    hidden: { opacity: 0, x: 30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    exit: { 
      opacity: 0, 
      x: -30,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  },
  feature: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }
}

// Componente ServiceCard ottimizzato
const ServiceCard: React.FC<{
  service: any
  index: number
  isActive: boolean
  onClick: () => void
  isMobile?: boolean
}> = React.memo(({ service, index, isActive, onClick, isMobile = false }) => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={smoothVariants.card}
      transition={{ delay: index * 0.15 }}
      className="relative"
    >
      <motion.div
        onClick={onClick}
        whileHover={!isMobile ? smoothVariants.cardHover : undefined}
        whileTap={{ scale: 0.98 }}
        className={`
          relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-300
          ${isActive 
            ? 'ring-4 ring-offset-2 ring-blue-300 shadow-2xl' 
            : 'shadow-lg hover:shadow-xl'
          }
          ${isMobile ? 'mb-8' : ''}
        `}
      >
        {/* Image Container */}
        <div className={`relative overflow-hidden ${isMobile ? 'h-64' : 'h-80'}`}>
          <motion.img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover"
            variants={smoothVariants.image}
            loading="lazy"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${service.color} opacity-75`} />
          
          {/* Overlay Pattern */}
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8 text-white">
          <div className="text-4xl lg:text-5xl mb-4 drop-shadow-lg">{service.icon}</div>
          <h3 className="text-xl lg:text-2xl xl:text-3xl font-bold mb-2 drop-shadow-lg">
            {service.title}
          </h3>
          <p className="text-white/90 mb-4 text-sm lg:text-base drop-shadow">
            {service.shortDesc}
          </p>
          
          {/* Stats Preview */}
          <div className="flex space-x-4 text-xs lg:text-sm">
            {service.stats.slice(0, 2).map((stat: any, i: number) => (
              <div key={i} className="text-center">
                <div className="font-bold text-lg drop-shadow">{stat.value}</div>
                <div className="text-white/80 drop-shadow">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Indicator */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg"
            >
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
})

// Componente Mobile Card completo
const MobileServiceCard: React.FC<{
  service: any
  index: number
  language: string
  t: any
}> = ({ service, index, language, t }) => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={smoothVariants.card}
      transition={{ delay: index * 0.2 }}
      className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8"
    >
      {/* Mobile Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${service.color} opacity-75`} />
        
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
          <div className="text-4xl mb-3">{service.icon}</div>
          <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
          <p className="text-white/90">{service.shortDesc}</p>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="p-6">
        {/* Description */}
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed mb-4">
            {service.description}
          </p>
          <p className="text-gray-600 leading-relaxed text-sm">
            {service.longDescription}
          </p>
        </div>

        {/* Features */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">{t.whatWeOffer}</h4>
          <div className="space-y-3">
            {service.features.map((feature: any, featureIndex: number) => (
              <motion.div
                key={featureIndex}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={smoothVariants.feature}
                transition={{ delay: 0.3 + featureIndex * 0.1 }}
                className={`flex items-start space-x-3 p-3 rounded-xl ${service.bgColor} border border-gray-100`}
              >
                <div className="text-xl flex-shrink-0">{feature.icon}</div>
                <div>
                  <h5 className={`font-semibold ${service.textColor} mb-1`}>{feature.title}</h5>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {service.stats.map((stat: any, statIndex: number) => (
            <motion.div
              key={statIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5 + statIndex * 0.1 }}
              className="text-center p-3 bg-gray-50 rounded-xl"
            >
              <div className={`text-2xl font-bold bg-gradient-to-r ${service.color} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-600 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// Componente principale
const ServicesSection: React.FC<ServicesSectionProps> = ({ language, inView = true }) => {
  const [activeService, setActiveService] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  
  const t = useMemo(() => translations[language], [language])

  // Detect mobile
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleServiceClick = useCallback((index: number) => {
    setActiveService(index)
  }, [])

  return (
    <section id="services" className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-green-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-200 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-20"
        >
          <h2 className="text-3xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {t.title}
            </span>
          </h2>
          <p className="text-lg lg:text-xl xl:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Content */}
        {isMobile ? (
          /* Mobile Layout - Cards complete */
          <div className="space-y-0">
            {t.services.map((service, index) => (
              <MobileServiceCard
                key={service.id}
                service={service}
                index={index}
                language={language}
                t={t}
              />
            ))}
          </div>
        ) : (
          /* Desktop Layout */
          <motion.div
            variants={smoothVariants.container}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="grid lg:grid-cols-2 gap-12 items-start"
          >
            {/* Service Cards */}
            <div className="space-y-6">
              {t.services.map((service, index) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  index={index}
                  isActive={activeService === index}
                  onClick={() => handleServiceClick(index)}
                />
              ))}
            </div>

            {/* Details Panel */}
            <div className="sticky top-24">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeService}
                  variants={smoothVariants.detailsPanel}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-white rounded-3xl shadow-2xl p-8 xl:p-10 border border-gray-100"
                >
                  {/* Header */}
                  <div className="flex items-center space-x-4 mb-8">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${t.services[activeService].color} flex items-center justify-center text-3xl shadow-lg`}>
                      {t.services[activeService].icon}
                    </div>
                    <div>
                      <h3 className="text-2xl xl:text-3xl font-bold text-gray-900">
                        {t.services[activeService].title}
                      </h3>
                      <p className="text-gray-600">{t.services[activeService].shortDesc}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-8">
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                      {t.services[activeService].description}
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      {t.services[activeService].longDescription}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="mb-8">
                    <h4 className="text-xl font-semibold text-gray-900 mb-6">{t.whatWeOffer}</h4>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      {t.services[activeService].features.map((feature: any, index: number) => (
                        <motion.div
                          key={index}
                          initial="hidden"
                          animate="visible"
                          variants={smoothVariants.feature}
                          transition={{ delay: index * 0.05 }}
                          className={`flex items-start space-x-3 p-4 rounded-2xl ${t.services[activeService].bgColor} border border-gray-100 hover:shadow-md transition-shadow duration-200`}
                        >
                          <div className="text-2xl flex-shrink-0">{feature.icon}</div>
                          <div>
                            <h5 className={`font-semibold ${t.services[activeService].textColor} mb-1`}>
                              {feature.title}
                            </h5>
                            <p className="text-gray-600 text-sm">{feature.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-6">
                    {t.services[activeService].stats.map((stat: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="text-center p-4 bg-gray-50 rounded-2xl"
                      >
                        <div className={`text-3xl font-bold bg-gradient-to-r ${t.services[activeService].color} bg-clip-text text-transparent`}>
                          {stat.value}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default ServicesSection