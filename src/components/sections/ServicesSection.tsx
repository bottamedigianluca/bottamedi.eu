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

// 🎭 ANIMAZIONI ULTRA OTTIMIZZATE PER PERFORMANCE
const optimizedVariants = {
  cardHover: {
    y: -3,
    scale: 1.01,
    transition: { 
      duration: 0.2, 
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  detailsPanel: {
    hidden: { 
      opacity: 0, 
      x: 20,
      filter: 'blur(2px)'
    },
    visible: { 
      opacity: 1, 
      x: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      filter: 'blur(2px)',
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  },
  feature: {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  },
  stat: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  }
}

// 🎨 COMPONENTE SERVICE CARD OTTIMIZZATO
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

  const [imageLoaded, setImageLoaded] = useState(false)

  const cardVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }), [index])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={cardVariants}
      className="relative"
    >
      <motion.div
        onClick={onClick}
        whileHover={!isMobile ? optimizedVariants.cardHover : undefined}
        whileTap={{ scale: 0.99 }}
        className={`
          relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-200
          ${isActive 
            ? 'ring-2 ring-offset-1 ring-blue-400 shadow-xl' 
            : 'shadow-lg hover:shadow-xl'
          }
          ${isMobile ? 'mb-6' : ''}
        `}
        style={{ willChange: 'transform' }}
      >
        {/* Image Container OTTIMIZZATO */}
        <div className={`relative overflow-hidden ${isMobile ? 'h-56' : 'h-64'}`}>
          {/* Loading placeholder */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
          )}
          
          <motion.img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ 
              opacity: imageLoaded ? 1 : 0,
              scale: imageLoaded ? 1 : 1.05
            }}
            transition={{ duration: 0.4 }}
            style={{ willChange: 'transform, opacity' }}
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${service.color} opacity-70`} />
        </div>

        {/* Content Overlay OTTIMIZZATO */}
        <div className="absolute inset-0 flex flex-col justify-end p-5 lg:p-6 text-white">
          <div className="text-3xl lg:text-4xl mb-3 drop-shadow-lg">{service.icon}</div>
          <h3 className="text-lg lg:text-xl xl:text-2xl font-bold mb-2 drop-shadow-lg leading-tight">
            {service.title}
          </h3>
          <p className="text-white/90 mb-3 text-sm lg:text-base drop-shadow leading-relaxed">
            {service.shortDesc}
          </p>
          
          {/* Stats Preview OTTIMIZZATO */}
          <div className="flex space-x-4 text-xs lg:text-sm">
            {service.stats.slice(0, 2).map((stat: any, i: number) => (
              <div key={i} className="text-center">
                <div className="font-bold text-base lg:text-lg drop-shadow">{stat.value}</div>
                <div className="text-white/80 drop-shadow text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Indicator OTTIMIZZATO */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg"
            >
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
})

ServiceCard.displayName = 'ServiceCard'

// 📱 COMPONENTE MOBILE CARD COMPLETO OTTIMIZZATO
const MobileServiceCard: React.FC<{
  service: any
  index: number
  language: string
  t: any
}> = React.memo(({ service, index, language, t }) => {
  const [ref, inView] = useInView({
    threshold: 0.15,
    triggerOnce: true
  })

  const [imageLoaded, setImageLoaded] = useState(false)

  const cardVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 30, scale: 0.97 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }), [index])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={cardVariants}
      className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6"
    >
      {/* Mobile Image OTTIMIZZATA */}
      <div className="relative h-56 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
        )}
        
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover"
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          style={{ 
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${service.color} opacity-70`} />
        
        <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
          <div className="text-3xl mb-2">{service.icon}</div>
          <h3 className="text-xl font-bold mb-1">{service.title}</h3>
          <p className="text-white/90 text-sm">{service.shortDesc}</p>
        </div>
      </div>

      {/* Mobile Content OTTIMIZZATO */}
      <div className="p-5">
        {/* Description */}
        <div className="mb-5">
          <p className="text-gray-700 leading-relaxed mb-3 text-sm">
            {service.description}
          </p>
          <p className="text-gray-600 leading-relaxed text-xs">
            {service.longDescription}
          </p>
        </div>

        {/* Features OTTIMIZZATE */}
        <div className="mb-5">
          <h4 className="text-base font-semibold text-gray-900 mb-3">{t.whatWeOffer}</h4>
          <div className="space-y-2">
            {service.features.map((feature: any, featureIndex: number) => (
              <motion.div
                key={featureIndex}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={optimizedVariants.feature}
                transition={{ delay: 0.2 + featureIndex * 0.05 }}
                className={`flex items-start space-x-3 p-3 rounded-lg ${service.bgColor} border border-gray-50`}
              >
                <div className="text-lg flex-shrink-0">{feature.icon}</div>
                <div>
                  <h5 className={`font-medium ${service.textColor} mb-1 text-sm`}>{feature.title}</h5>
                  <p className="text-gray-600 text-xs leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats OTTIMIZZATE */}
        <div className="grid grid-cols-3 gap-3">
          {service.stats.map((stat: any, statIndex: number) => (
            <motion.div
              key={statIndex}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={optimizedVariants.stat}
              transition={{ delay: 0.4 + statIndex * 0.05 }}
              className="text-center p-3 bg-gray-50 rounded-lg"
            >
              <div className={`text-xl font-bold bg-gradient-to-r ${service.color} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-600 mt-1 leading-tight">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
})

MobileServiceCard.displayName = 'MobileServiceCard'

// 🖥️ COMPONENTE PRINCIPALE OTTIMIZZATO
const ServicesSection: React.FC<ServicesSectionProps> = ({ language, inView = true }) => {
  const [activeService, setActiveService] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  
  const t = useMemo(() => translations[language], [language])

  // Detect mobile OTTIMIZZATO
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    
    let timeoutId: NodeJS.Timeout
    const debouncedResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(checkMobile, 100)
    }
    
    window.addEventListener('resize', debouncedResize)
    return () => {
      window.removeEventListener('resize', debouncedResize)
      clearTimeout(timeoutId)
    }
  }, [])

  const handleServiceClick = useCallback((index: number) => {
    setActiveService(index)
  }, [])

  return (
    <section id="services" className="py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements OTTIMIZZATI */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-green-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-200 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header OTTIMIZZATO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {t.title}
            </span>
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Content */}
        {isMobile ? (
          /* Mobile Layout OTTIMIZZATO */
          <div>
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
          /* Desktop Layout OTTIMIZZATO */
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Service Cards */}
            <div className="space-y-5">
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

            {/* Details Panel ULTRA OTTIMIZZATO */}
            <div className="sticky top-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeService}
                  variants={optimizedVariants.detailsPanel}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-white rounded-2xl shadow-xl p-6 xl:p-8 border border-gray-100"
                  style={{ willChange: 'transform, opacity' }}
                >
                  {/* Header */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${t.services[activeService].color} flex items-center justify-center text-2xl shadow-lg`}>
                      {t.services[activeService].icon}
                    </div>
                    <div>
                      <h3 className="text-xl xl:text-2xl font-bold text-gray-900">
                        {t.services[activeService].title}
                      </h3>
                      <p className="text-gray-600 text-sm">{t.services[activeService].shortDesc}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <p className="text-gray-700 leading-relaxed mb-3 text-sm lg:text-base">
                      {t.services[activeService].description}
                    </p>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {t.services[activeService].longDescription}
                    </p>
                  </div>

                  {/* Features OTTIMIZZATE */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">{t.whatWeOffer}</h4>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                      {t.services[activeService].features.map((feature: any, index: number) => (
                        <motion.div
                          key={index}
                          initial="hidden"
                          animate="visible"
                          variants={optimizedVariants.feature}
                          transition={{ delay: index * 0.03 }}
                          className={`flex items-start space-x-3 p-3 rounded-xl ${t.services[activeService].bgColor} border border-gray-100 hover:shadow-sm transition-shadow duration-150`}
                        >
                          <div className="text-xl flex-shrink-0">{feature.icon}</div>
                          <div>
                            <h5 className={`font-medium ${t.services[activeService].textColor} mb-1 text-sm`}>
                              {feature.title}
                            </h5>
                            <p className="text-gray-600 text-xs leading-relaxed">{feature.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Stats OTTIMIZZATE */}
                  <div className="grid grid-cols-3 gap-4">
                    {t.services[activeService].stats.map((stat: any, index: number) => (
                      <motion.div
                        key={index}
                        initial="hidden"
                        animate="visible"
                        variants={optimizedVariants.stat}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        className="text-center p-3 bg-gray-50 rounded-xl"
                      >
                        <div className={`text-2xl font-bold bg-gradient-to-r ${t.services[activeService].color} bg-clip-text text-transparent`}>
                          {stat.value}
                        </div>
                        <div className="text-xs text-gray-600 mt-1 leading-tight">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ServicesSection
