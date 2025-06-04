import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

interface ContactSectionProps {
  language: 'it' | 'de'
  inView: boolean
}

const ContactCard: React.FC<{
  contact: any
  icon: string
  gradient: string
  index: number
  quickActions: any
  isIngrosso?: boolean
}> = React.memo(({ contact, icon, gradient, index, quickActions, isIngrosso = false }) => {
  const shouldReduceMotion = useReducedMotion()
  
  const openMap = useCallback(() => {
    // Tracciamento Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'contact_action', {
        event_category: 'engagement',
        event_label: `map_${isIngrosso ? 'horeca' : 'retail'}`,
        value: 1
      })
    }
    
    const mapUrl = isIngrosso 
      ? 'https://maps.app.goo.gl/TFV4cgnEvcFjBHfD6'
      : 'https://www.google.com/maps/search/?api=1&query=Banchetto+Frutta+e+Verdura+Bottamedi+Via+Cavalleggeri+Udine+Mezzolombardo+TN'
    
    window.open(mapUrl, '_blank')
  }, [isIngrosso])

  const callPhone = useCallback(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'contact_action', {
        event_category: 'engagement',
        event_label: `call_${isIngrosso ? 'horeca' : 'retail'}`,
        value: 1
      })
    }
    window.open(`tel:${contact.phone.replace(/\s/g, '')}`, '_self')
  }, [contact.phone, isIngrosso])

  const sendWhatsApp = useCallback(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'contact_action', {
        event_category: 'engagement',
        event_label: `whatsapp_${isIngrosso ? 'horeca' : 'retail'}`,
        value: 1
      })
    }
    const message = encodeURIComponent(`Ciao! Sono interessato ai vostri servizi di ${contact.title}`)
    window.open(`https://wa.me/393515776198?text=${message}`, '_blank')
  }, [contact.title, isIngrosso])

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.2 : 0.4, delay: shouldReduceMotion ? 0 : index * 0.1 }}
      whileHover={shouldReduceMotion ? {} : { y: -2, scale: 1.01 }}
      className="relative group"
    >
      <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-neutral-100 h-full">
        {/* Icon Header */}
        <div className="relative mb-6">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-xl mb-3 group-hover:scale-105 transition-transform duration-200`}>
            {icon}
          </div>
          <h3 className="text-lg font-bold text-neutral-900">
            {contact.title}
          </h3>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 mb-5">
          <div className="flex items-start space-x-3">
            <svg className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-neutral-600 leading-relaxed text-sm">
              {contact.address}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="text-neutral-600 hover:text-green-600 transition-colors text-sm">
              {contact.phone}
            </a>
          </div>

          <div className="flex items-center space-x-3">
            <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <a href={`mailto:${contact.email}`} className="text-neutral-600 hover:text-green-600 transition-colors text-sm">
              {contact.email}
            </a>
          </div>

          {contact.hours && (
            <div className="flex items-center space-x-3">
              <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-neutral-600 text-sm">
                {contact.hours}
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-neutral-700 mb-2">{quickActions.title}</h4>
          
          <div className="grid grid-cols-1 gap-2">
            <motion.button
              onClick={callPhone}
              whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`w-full py-2 px-3 bg-gradient-to-r ${gradient} text-white rounded-lg font-medium text-xs transition-all duration-200 hover:shadow-md flex items-center justify-center space-x-2`}
            >
              <span>📞</span>
              <span>{quickActions.call}</span>
            </motion.button>

            <div className="grid grid-cols-2 gap-2">
              <motion.button
                onClick={sendWhatsApp}
                whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="py-2 px-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-xs transition-all duration-200 flex items-center justify-center space-x-1"
              >
                <span>💬</span>
                <span>{quickActions.whatsapp}</span>
              </motion.button>

              <motion.button
                onClick={openMap}
                whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="py-2 px-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-xs transition-all duration-200 flex items-center justify-center space-x-1"
              >
                <span>🗺️</span>
                <span>{quickActions.directions}</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Hover Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          initial={false}
        />
      </div>
    </motion.div>
  )
})

ContactCard.displayName = 'ContactCard'

const ContactSection: React.FC<ContactSectionProps> = ({ language, inView }) => {
  const shouldReduceMotion = useReducedMotion()
  
  const translations = {
    it: {
      title: 'Contattaci',
      subtitle: 'Siamo qui per te',
      description: 'Scegli come preferisci entrare in contatto con noi. Rispondiamo sempre entro 24 ore.',
      whyChoose: 'Perché scegliere Bottamedi:',
      whyChooseItems: [
        '🏆 50 anni di esperienza e tradizione familiare',
        '🌱 Selezione quotidiana alle prime ore del mattino',
        '🚚 Servizio affidabile 6 giorni su 7',
        '❤️ Rapporto di fiducia con ogni cliente',
        '📱 Supporto e consulenza sempre disponibili'
      ],
      highlight: {
        title: "La Nostra Promessa",
        text: "Quando la valle è ancora avvolta nel silenzio dell'alba, noi siamo già al lavoro per selezionare con cura ogni frutto, ogni verdura. È la passione che tramanda da tre generazioni il sapore autentico della qualità.",
        icon: "🌅"
      },
      mapSection: {
        title: 'Come Raggiungerci',
        subtitle: 'Vieni a trovarci nelle nostre sedi a Mezzolombardo'
      },
      contact: {
        retail: {
          title: 'Banchetto (Dettaglio)',
          address: 'Via Cavalleggeri Udine, 38017 Mezzolombardo (TN)',
          phone: '351 577 6198',
          email: 'bottamedipierluigi@virgilio.it',
          hours: 'Lun-Sab: 07:00-19:30'
        },
        horeca: {
          title: 'Ingrosso HORECA',
          address: 'Via Alcide de Gasperi, 47, 38017 Mezzolombardo (TN)',
          phone: '0461 602534',
          email: 'bottamedipierluigi@virgilio.it'
        }
      },
      quickActions: {
        title: 'Azioni Rapide',
        call: 'Chiama',
        whatsapp: 'WhatsApp',
        directions: 'Mappa'
      }
    },
    de: {
      title: 'Kontakt',
      subtitle: 'Wir sind für Sie da',
      description: 'Wählen Sie, wie Sie uns am liebsten kontaktieren möchten. Wir antworten immer innerhalb von 24 Stunden.',
      whyChoose: 'Warum Bottamedi wählen:',
      whyChooseItems: [
        '🏆 50 Jahre Erfahrung und Familientradition',
        '🌱 Tägliche Auswahl in den frühen Morgenstunden',
        '🚚 Zuverlässiger Service 6 Tage die Woche',
        '❤️ Vertrauensverhältnis zu jedem Kunden',
        '📱 Support und Beratung immer verfügbar'
      ],
      highlight: {
        title: "Unser Versprechen",
        text: "Wenn das Tal noch im Schweigen der Morgendämmerung gehüllt ist, sind wir bereits bei der Arbeit, um sorgfältig jede Frucht, jedes Gemüse auszuwählen. Es ist die Leidenschaft, die seit drei Generationen den authentischen Geschmack der Qualität weitergibt.",
        icon: "🌅"
      },
      mapSection: {
        title: 'So Erreichen Sie Uns',
        subtitle: 'Besuchen Sie uns in unseren Standorten in Mezzolombardo'
      },
      contact: {
        retail: {
          title: 'Marktstand (Detail)',
          address: 'Via Cavalleggeri Udine, 38017 Mezzolombardo (TN)',
          phone: '351 577 6198',
          email: 'bottamedipierluigi@virgilio.it',
          hours: 'Mo-Sa: 07:00-19:30'
        },
        horeca: {
          title: 'Großhandel HORECA',
          address: 'Via Alcide de Gasperi, 47, 38017 Mezzolombardo (TN)',
          phone: '0461 602534',
          email: 'bottamedipierluigi@virgilio.it'
        }
      },
      quickActions: {
        title: 'Schnelle Aktionen',
        call: 'Anrufen',
        whatsapp: 'WhatsApp',
        directions: 'Karte'
      }
    }
  }

  const t = translations[language]

  return (
    <section id="contact" className="py-20 lg:py-24 bg-gradient-to-br from-white to-neutral-50 relative overflow-hidden">
      {/* Background Elements */}
      {!shouldReduceMotion && (
        <>
          <div className="absolute top-1/4 left-0 w-80 h-80 bg-green-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl" />
        </>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: shouldReduceMotion ? 0.2 : 0.4 }}
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
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: shouldReduceMotion ? 0.2 : 0.4, delay: shouldReduceMotion ? 0 : 0.1 }}
            className="text-lg lg:text-xl text-neutral-600 mb-3"
          >
            {t.subtitle}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: shouldReduceMotion ? 0.2 : 0.4, delay: shouldReduceMotion ? 0 : 0.2 }}
            className="text-base text-neutral-500 max-w-2xl mx-auto"
          >
            {t.description}
          </motion.p>
        </motion.div>

        {/* Why Choose Section */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: shouldReduceMotion ? 0.2 : 0.4, delay: shouldReduceMotion ? 0 : 0.3 }}
          className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 mb-12"
        >
          <h3 className="text-xl font-bold text-neutral-900 mb-4 text-center">{t.whyChoose}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {t.whyChooseItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: shouldReduceMotion ? 0.2 : 0.3, delay: shouldReduceMotion ? 0 : 0.4 + index * 0.05 }}
                className="flex items-center space-x-2 text-sm text-neutral-700"
              >
                <span>{item}</span>
              </motion.div>
            ))}
          </div>
          
          {/* Highlight Box */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: shouldReduceMotion ? 0.2 : 0.4, delay: shouldReduceMotion ? 0 : 0.7 }}
            className="mt-6 p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-200"
          >
            <div className="flex items-start space-x-4">
              <div className="text-3xl">{t.highlight.icon}</div>
              <div>
                <h4 className="font-bold text-neutral-900 mb-2 text-lg">{t.highlight.title}</h4>
                <p className="text-neutral-700 text-sm leading-relaxed italic">{t.highlight.text}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          <ContactCard
            contact={t.contact.retail}
            icon="🛒"
            gradient="from-green-500 to-green-600"
            index={0}
            quickActions={t.quickActions}
            isIngrosso={false}
          />
          <ContactCard
            contact={t.contact.horeca}
            icon="🏨"
            gradient="from-blue-500 to-blue-600"
            index={1}
            quickActions={t.quickActions}
            isIngrosso={true}
          />
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: shouldReduceMotion ? 0.2 : 0.5, delay: shouldReduceMotion ? 0 : 0.4 }}
          className="mt-16"
        >
          <div className="text-center mb-10">
            <h3 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-3">
              {t.mapSection.title}
            </h3>
            <p className="text-lg lg:text-xl text-neutral-600">
              {t.mapSection.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Banchetto Map */}
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
              className="relative group cursor-pointer"
              onClick={() => {
                // Tracciamento Google Analytics
                if (typeof window !== 'undefined' && window.gtag) {
                  window.gtag('event', 'map_click', {
                    event_category: 'engagement',
                    event_label: 'banchetto_dettaglio',
                    value: 1
                  })
                }
                window.open('https://www.google.com/maps/search/?api=1&query=Banchetto+Frutta+e+Verdura+Bottamedi+Via+Cavalleggeri+Udine+Mezzolombardo+TN', '_blank');
              }}
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl mb-3 mx-auto">
                        📍
                      </div>
                      <h4 className="text-lg font-bold text-neutral-900">
                        {language === 'it' ? 'Banchetto' : 'Marktstand'}
                      </h4>
                      <p className="text-neutral-600 text-sm">Via Cavalleggeri Udine</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* HORECA Map - CORRETTO con link diretto */}
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
              className="relative group cursor-pointer"
              onClick={() => {
                // Tracciamento Google Analytics
                if (typeof window !== 'undefined' && window.gtag) {
                  window.gtag('event', 'map_click', {
                    event_category: 'engagement',
                    event_label: 'ingrosso_horeca',
                    value: 1
                  })
                }
                window.open('https://maps.app.goo.gl/TFV4cgnEvcFjBHfD6', '_blank');
              }}
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl mb-3 mx-auto">
                        📍
                      </div>
                      <h4 className="text-lg font-bold text-neutral-900">
                        {language === 'it' ? 'Ingrosso HORECA' : 'Großhandel HORECA'}
                      </h4>
                      <p className="text-neutral-600 text-sm">Via A. de Gasperi, 47</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default React.memo(ContactSection)
