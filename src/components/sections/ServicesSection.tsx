import React, { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import OptimizedImage from '../ui/OptimizedImage'

interface ServicesSectionProps {
  language: 'it' | 'de'
  inView?: boolean
}

const translations = {
  it: {
    title: 'I Nostri Servizi',
    subtitle: 'Due modalità per portare l\'eccellenza Bottamedi sulla tua tavola',
    whatWeOffer: 'I nostri punti di forza:',
    services: [
      {
        id: 'dettaglio',
        title: 'Il Nostro Banchetto',
        shortDesc: 'Esperienza diretta con prodotti di qualità superiore',
        description: 'Nel cuore di Mezzolombardo, il nostro colorato banchetto rappresenta molto più di un semplice punto vendita. È il luogo dove la tradizione familiare incontra l\'eccellenza quotidiana, dove ogni prodotto racconta una storia di qualità.',
        longDescription: 'Ogni alba segna l\'inizio di una nuova giornata di selezione meticolosa. Il nostro team, forte di tre generazioni di esperienza, sceglie personalmente frutta e verdura freschissima, creando un caleidoscopio di sapori che rappresenta il meglio del territorio trentino e delle migliori produzioni italiane. Qui non trovi solo prodotti freschi, ma anche la competenza e i consigli di chi conosce ogni sfumatura del settore ortofrutticolo.',
        features: [
          { icon: '🌅', title: 'Selezione Alba', desc: 'Controllo qualità e scelta prodotti alle prime ore del mattino' },
          { icon: '🎨', title: 'Varietà Premium', desc: 'Oltre 150 tipologie di frutta e verdura sempre disponibili' },
          { icon: '👨‍👩‍👧‍👦', title: 'Esperienza Generazionale', desc: 'Consigli e saperi tramandati da tre generazioni di specialisti' },
          { icon: '🏔️', title: 'Prodotti del Territorio', desc: 'Eccellenze locali del Trentino Alto Adige accuratamente selezionate' },
          { icon: '💝', title: 'Attenzione Personalizzata', desc: 'Servizio dedicato e consulenza individuale per ogni cliente' },
          { icon: '🕰️', title: 'Disponibilità Estesa', desc: 'Aperti 6 giorni su 7 con orari pensati per la tua comodità' }
        ],
        icon: '🛒',
        color: 'from-green-500 to-green-600',
        bgColor: 'bg-green-50',
        textColor: 'text-green-600',
        image: '/images/banchetto.webp',
        stats: [
          { label: 'Anni di tradizione', value: '50' },
          { label: 'Varietà disponibili', value: '150+' },
          { label: 'Clienti fedeli', value: '500+' }
        ]
      },
      {
        id: 'services',
        title: 'Divisione Ingrosso HORECA',
        shortDesc: 'Partner strategico per la ristorazione di qualità',
        description: 'La nostra divisione ingrosso rappresenta l\'anima pulsante dell\'attività Bottamedi: forniamo quotidianamente ristoranti d\'eccellenza, hotel di prestigio, pizzerie gourmet e attività commerciali con la medesima passione e rigore qualitativo che contraddistingue il nostro banchetto.',
        longDescription: 'Non siamo semplici fornitori, ma veri partner strategici che comprendono e anticipano le esigenze del settore professionale. La nostra consolidata esperienza ci permette di servire con successo anche realtà istituzionali del territorio, garantendo sempre standard qualitativi superiori. Ogni alba il nostro team specializzato seleziona i prodotti migliori, applicando protocolli di qualità sviluppati in decenni di esperienza nel settore HORECA.',
        features: [
          { icon: '🚚', title: 'Logistica Affidabile', desc: 'Consegne puntuali 6 giorni su 7 con orari concordati e rispettati' },
          { icon: '🔍', title: 'Controllo Qualità Totale', desc: 'Selezione rigorosa e verifica su ogni singolo prodotto fornito' },
          { icon: '📋', title: 'Condizioni Dedicate', desc: 'Listini personalizzati e condizioni commerciali studiate per ogni cliente' },
          { icon: '🤝', title: 'Relazioni Durature', desc: 'Partnership consolidate basate su fiducia reciproca e professionalità' },
          { icon: '📱', title: 'Ordinazioni Semplificate', desc: 'Sistema di ordini efficiente e comunicazione diretta sempre disponibile' },
          { icon: '🎯', title: 'Consulenza Stagionale', desc: 'Supporto esperto su disponibilità, stagionalità e tendenze di mercato' }
        ],
        icon: '🚛',
        color: 'from-blue-500 to-blue-600',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600',
        image: '/images/albicocche_ingrosso_magazzino.webp',
        stats: [
          { label: 'Partner commerciali', value: '50+' },
          { label: 'Consegne settimanali', value: '300+' },
          { label: 'Anni nel settore HORECA', value: '30+' }
        ]
      }
    ]
  },
  de: {
    title: 'Unsere Dienstleistungen',
    subtitle: 'Zwei Modalitäten, um Bottamedi-Exzellenz auf Ihren Tisch zu bringen',
    whatWeOffer: 'Unsere Stärken:',
    services: [
      {
        id: 'dettaglio',
        title: 'Unser Marktstand',
        shortDesc: 'Direkter Kontakt mit Produkten höchster Qualität',
        description: 'Im Herzen von Mezzolombardo repräsentiert unser bunter Marktstand viel mehr als nur einen Verkaufspunkt. Es ist der Ort, wo Familientradition auf tägliche Exzellenz trifft, wo jedes Produkt eine Geschichte der Qualität erzählt.',
        longDescription: 'Jede Morgendämmerung markiert den Beginn eines neuen Tages sorgfältiger Auswahl. Unser Team, gestärkt durch drei Generationen Erfahrung, wählt persönlich frischestes Obst und Gemüse aus und schafft ein Kaleidoskop von Geschmäckern, das das Beste des Südtiroler Gebiets und der besten italienischen Produktionen repräsentiert. Hier finden Sie nicht nur frische Produkte, sondern auch die Kompetenz und Beratung von denen, die jede Nuance des Obst- und Gemüsesektors kennen.',
        features: [
          { icon: '🌅', title: 'Morgendämmerung-Auswahl', desc: 'Qualitätskontrolle und Produktauswahl in den frühen Morgenstunden' },
          { icon: '🎨', title: 'Premium-Vielfalt', desc: 'Über 150 Sorten Obst und Gemüse immer verfügbar' },
          { icon: '👨‍👩‍👧‍👦', title: 'Generationenerfahrung', desc: 'Tipps und Wissen von drei Generationen Spezialisten weitergegeben' },
          { icon: '🏔️', title: 'Regionale Produkte', desc: 'Sorgfältig ausgewählte lokale Exzellenzen aus Südtirol' },
          { icon: '💝', title: 'Persönliche Betreuung', desc: 'Dedizierter Service und individuelle Beratung für jeden Kunden' },
          { icon: '🕰️', title: 'Erweiterte Verfügbarkeit', desc: '6 Tage die Woche geöffnet mit für Ihre Bequemlichkeit gedachten Zeiten' }
        ],
        icon: '🛒',
        color: 'from-green-500 to-green-600',
        bgColor: 'bg-green-50',
        textColor: 'text-green-600',
        image: '/images/banchetto.webp',
        stats: [
          { label: 'Jahre Tradition', value: '50' },
          { label: 'Verfügbare Sorten', value: '150+' },
          { label: 'Treue Kunden', value: '500+' }
        ]
      },
      {
        id: 'services',
        title: 'HORECA Großhandelsabteilung',
        shortDesc: 'Strategischer Partner für Qualitätsgastronomie',
        description: 'Unsere Großhandelsabteilung repräsentiert die pulsierende Seele der Bottamedi-Aktivität: Wir beliefern täglich Exzellenz-Restaurants, Prestige-Hotels, Gourmet-Pizzerien und Handelsbetriebe mit derselben Leidenschaft und Qualitätsstrenge, die unseren Marktstand auszeichnet.',
        longDescription: 'Wir sind nicht einfache Lieferanten, sondern echte strategische Partner, die die Bedürfnisse des professionellen Sektors verstehen und antizipieren. Unsere konsolidierte Erfahrung ermöglicht es uns, auch institutionelle Realitäten des Gebiets erfolgreich zu bedienen und dabei immer höhere Qualitätsstandards zu garantieren. Jeden Morgen wählt unser spezialisiertes Team die besten Produkte aus und wendet Qualitätsprotokolle an, die in Jahrzehnten der Erfahrung im HORECA-Sektor entwickelt wurden.',
        features: [
          { icon: '🚚', title: 'Zuverlässige Logistik', desc: 'Pünktliche Lieferungen 6 Tage die Woche zu vereinbarten und eingehaltenen Zeiten' },
          { icon: '🔍', title: 'Totale Qualitätskontrolle', desc: 'Strenge Auswahl und Überprüfung jedes einzelnen gelieferten Produkts' },
          { icon: '📋', title: 'Dedizierte Konditionen', desc: 'Personalisierte Preislisten und für jeden Kunden studierte Handelsbedingungen' },
          { icon: '🤝', title: 'Dauerhafte Beziehungen', desc: 'Konsolidierte Partnerschaften basierend auf gegenseitigem Vertrauen und Professionalität' },
          { icon: '📱', title: 'Vereinfachte Bestellungen', desc: 'Effizientes Bestellsystem und direkte Kommunikation immer verfügbar' },
          { icon: '🎯', title: 'Saisonale Beratung', desc: 'Expertenunterstützung zu Verfügbarkeit, Saisonalität und Markttrends' }
        ],
        icon: '🚛',
        color: 'from-blue-500 to-blue-600',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600',
        image: '/images/albicocche_ingrosso_magazzino.webp',
        stats: [
          { label: 'Geschäftspartner', value: '50+' },
          { label: 'Wöchentliche Lieferungen', value: '300+' },
          { label: 'Jahre im HORECA-Sektor', value: '30+' }
        ]
      }
    ]
  }
}

// Animation variants ottimizzati
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

const ServiceCard: React.FC<{
  service: any
  index: number
  isActive: boolean
  onClick: () => void
}> = React.memo(({ service, index, isActive, onClick }) => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  })
  const shouldReduceMotion = useReducedMotion()

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
        whileHover={shouldReduceMotion ? {} : optimizedVariants.cardHover}
        whileTap={{ scale: 0.99 }}
        className={`
          relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-200
          ${isActive 
            ? 'ring-2 ring-offset-1 ring-blue-400 shadow-xl' 
            : 'shadow-lg hover:shadow-xl'
          }
        `}
        style={{ willChange: 'transform' }}
      >
        <div className="relative h-64 overflow-hidden">
          <OptimizedImage
            src={service.image}
            alt={service.title}
            className="w-full h-full"
            priority={index === 0}
            placeholder="blur"
            aspectRatio="16/9"
            objectFit="cover"
            style={{ willChange: 'transform, opacity' }}
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${service.color} opacity-70`} />
        </div>

        <div className="absolute inset-0 flex flex-col justify-end p-5 lg:p-6 text-white">
          <div className="text-3xl lg:text-4xl mb-3 drop-shadow-lg">{service.icon}</div>
          <h3 className="text-lg lg:text-xl xl:text-2xl font-bold mb-2 drop-shadow-lg leading-tight">
            {service.title}
          </h3>
          <p className="text-white/90 mb-3 text-sm lg:text-base drop-shadow leading-relaxed">
            {service.shortDesc}
          </p>
          
          <div className="flex space-x-4 text-xs lg:text-sm">
            {service.stats.slice(0, 2).map((stat: any, i: number) => (
              <div key={i} className="text-center">
                <div className="font-bold text-base lg:text-lg drop-shadow">{stat.value}</div>
                <div className="text-white/80 drop-shadow text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

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
  const shouldReduceMotion = useReducedMotion()

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
      <div className="relative h-56 overflow-hidden">
        <OptimizedImage
          src={service.image}
          alt={service.title}
          className="w-full h-full"
          priority={index === 0}
          placeholder="blur"
          aspectRatio="16/9"
          objectFit="cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${service.color} opacity-70`} />
        
        <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
          <div className="text-3xl mb-2">{service.icon}</div>
          <h3 className="text-xl font-bold mb-1">{service.title}</h3>
          <p className="text-white/90 text-sm">{service.shortDesc}</p>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-5">
          <p className="text-gray-700 leading-relaxed mb-3 text-sm">
            {service.description}
          </p>
          <p className="text-gray-600 leading-relaxed text-xs">
            {service.longDescription}
          </p>
        </div>

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

const ServicesSection: React.FC<ServicesSectionProps> = ({ language, inView = true }) => {
  const [activeService, setActiveService] = useState(0)
  const shouldReduceMotion = useReducedMotion()
  
  const t = useMemo(() => translations[language], [language])

  const handleServiceClick = useCallback((index: number) => {
    setActiveService(index)
  }, [])

  // UTILIZZO SOLO MEDIA QUERY CSS - Nessuna logica mobile che interferisce!
  const isDesktop = window.matchMedia('(min-width: 1024px)').matches

  return (
    <section id="services" className="py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-green-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-200 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
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

        {/* Layout Responsive con CSS - NO JavaScript mobile logic */}
        <div className="block lg:hidden">
          {/* Mobile Layout */}
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

        <div className="hidden lg:grid lg:grid-cols-2 gap-10 items-start">
          {/* Desktop Layout */}
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

                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed mb-3 text-sm lg:text-base">
                    {t.services[activeService].description}
                  </p>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {t.services[activeService].longDescription}
                  </p>
                </div>

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
      </div>
    </section>
  )
}

export default ServicesSection
