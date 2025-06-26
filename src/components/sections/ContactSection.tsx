import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    trackAzioneContatto: (tipoContatto: string, fonte: string, destinazione: string) => void;
    trackLocalizzazione: (azione: string, luogo: string, risultato: string) => void;
    trackRichiestaInformazioni: (tipo: string, argomento: string, modalita: string) => void;
    trackTempoSezione: (sezione: string, secondi: number) => void;
    updateCurrentSection: (sectionName: string) => void;
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
    // 🎯 TRACKING ANALYTICS COMPLETO
    if (typeof window !== 'undefined') {
      const tipoDestinazione = isIngrosso ? 'ingrosso' : 'banchetto'
      const luogo = isIngrosso ? 'via_de_gasperi' : 'via_cavalleggeri'
      
      // Track azione contatto
      window.trackAzioneContatto?.('mappa', 'sezione_contatti', tipoDestinazione)
      
      // Track localizzazione
      window.trackLocalizzazione?.('visualizza_mappa', luogo, 'navigazione_avviata')
      
      // Track richiesta informazioni
      window.trackRichiestaInformazioni?.(tipoDestinazione, 'direzioni_sede', 'mappa')
      
      // Analytics legacy per compatibilità
      if (window.gtag) {
        window.gtag('event', 'mappa_aperta', {
          event_category: 'Navigazione e Contatti',
          event_label: `mappa_${tipoDestinazione}`,
          custom_parameter_1: luogo,
          custom_parameter_2: 'click_da_card_contatti',
          custom_parameter_3: 'interesse_localizzazione',
          value: 8
        })
      }
    }
    
    const mapUrl = isIngrosso 
      ? 'https://maps.app.goo.gl/TFV4cgnEvcFjBHfD6'
      : 'https://www.google.com/maps/search/?api=1&query=Banchetto+Frutta+e+Verdura+Bottamedi+Via+Cavalleggeri+Udine+Mezzolombardo+TN'
    
    window.open(mapUrl, '_blank')
  }, [isIngrosso])

  const callPhone = useCallback(() => {
    // 🎯 TRACKING ANALYTICS COMPLETO
    if (typeof window !== 'undefined') {
      const tipoDestinazione = isIngrosso ? 'ingrosso' : 'banchetto'
      const numeroTelefono = contact.phone.replace(/\s/g, '')
      
      // Track azione contatto
      window.trackAzioneContatto?.('telefono', 'sezione_contatti', tipoDestinazione)
      
      // Track richiesta informazioni
      window.trackRichiestaInformazioni?.(tipoDestinazione, 'contatto_diretto', 'telefono')
      
      // Analytics legacy
      if (window.gtag) {
        window.gtag('event', 'chiamata_telefonica', {
          event_category: 'Conversioni Importanti',
          event_label: `chiamata_${tipoDestinazione}`,
          custom_parameter_1: numeroTelefono,
          custom_parameter_2: 'click_da_card_contatti',
          custom_parameter_3: 'conversione_diretta',
          value: 25
        })
      }
    }
    
    window.open(`tel:${contact.phone.replace(/\s/g, '')}`, '_self')
  }, [contact.phone, isIngrosso])

  const sendWhatsApp = useCallback(() => {
    // 🎯 TRACKING ANALYTICS COMPLETO
    if (typeof window !== 'undefined') {
      const tipoDestinazione = isIngrosso ? 'ingrosso' : 'banchetto'
      
      // Track azione contatto
      window.trackAzioneContatto?.('whatsapp', 'sezione_contatti', tipoDestinazione)
      
      // Track richiesta informazioni
      window.trackRichiestaInformazioni?.(tipoDestinazione, 'chat_whatsapp', 'whatsapp')
      
      // Analytics legacy
      if (window.gtag) {
        window.gtag('event', 'whatsapp_avviato', {
          event_category: 'Conversioni Social',
          event_label: `whatsapp_${tipoDestinazione}`,
          custom_parameter_1: '393515776198',
          custom_parameter_2: 'click_da_card_contatti',
          custom_parameter_3: 'preferenza_chat',
          value: 20
        })
      }
    }
    
    const message = encodeURIComponent(`Ciao! Sono interessato ai vostri servizi di ${contact.title}`)
    window.open(`https://wa.me/393515776198?text=${message}`, '_blank')
  }, [contact.title, isIngrosso])

  const sendEmail = useCallback(() => {
    // 🎯 TRACKING ANALYTICS COMPLETO
    if (typeof window !== 'undefined') {
      const tipoDestinazione = isIngrosso ? 'ingrosso' : 'banchetto'
      
      // Track azione contatto
      window.trackAzioneContatto?.('email', 'sezione_contatti', tipoDestinazione)
      
      // Track richiesta informazioni
      window.trackRichiestaInformazioni?.(tipoDestinazione, 'email_formale', 'email')
      
      // Analytics legacy
      if (window.gtag) {
        window.gtag('event', 'email_avviata', {
          event_category: 'Conversioni Email',
          event_label: `email_${tipoDestinazione}`,
          custom_parameter_1: contact.email,
          custom_parameter_2: 'click_da_card_contatti',
          custom_parameter_3: 'preferenza_email',
          value: 15
        })
      }
    }
    
    window.open(`mailto:${contact.email}`, '_blank')
  }, [contact.email, isIngrosso])

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.2 : 0.4, delay: shouldReduceMotion ? 0 : index * 0.1 }}
      whileHover={shouldReduceMotion ? {} : { y: -2, scale: 1.01 }}
      className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 min-h-[500px] flex flex-col"
    >
      {/* Header con icona e titolo */}
      <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-100">
        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl shadow-lg`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {contact.title}
          </h3>
          <p className="text-sm text-gray-500">
            {isIngrosso ? 'Servizio professionale' : 'Vendita al dettaglio'}
          </p>
        </div>
      </div>

      {/* Informazioni di contatto */}
      <div className="flex-1 mb-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-gray-700 leading-relaxed">
              {contact.address}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <button 
              onClick={callPhone}
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              {contact.phone}
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <button 
              onClick={sendEmail}
              className="text-gray-700 hover:text-green-600 transition-colors break-all"
            >
              {contact.email}
            </button>
          </div>

          {contact.hours && (
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-700 font-medium">
                {contact.hours}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Azioni rapide */}
      <div className="mt-auto pt-6 border-t border-gray-100">
        <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
          {quickActions.title}
        </h4>
        
        <div className="space-y-3">
          {/* Bottone principale - Chiama */}
          <motion.button
            onClick={callPhone}
            whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r ${gradient}`}
            style={{ 
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation'
            }}
          >
            <span className="text-xl">📞</span>
            <span>{quickActions.call}</span>
          </motion.button>

          {/* Bottoni secondari affiancati */}
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              onClick={sendWhatsApp}
              whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 shadow-md hover:shadow-lg transition-all duration-300"
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              }}
            >
              <span className="text-lg">💬</span>
              <span className="text-sm">{quickActions.whatsapp}</span>
            </motion.button>

            <motion.button
              onClick={openMap}
              whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 shadow-md hover:shadow-lg transition-all duration-300"
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              }}
            >
              <span className="text-lg">🗺️</span>
              <span className="text-sm">{quickActions.directions}</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Hover Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        initial={false}
      />
    </motion.div>
  )
})

ContactCard.displayName = 'ContactCard'

const ContactSection: React.FC<ContactSectionProps> = ({ language, inView }) => {
  const shouldReduceMotion = useReducedMotion()
  const [sectionStartTime] = useState(Date.now())
  
  // 🎯 TRACKING SEZIONE E TEMPO PERMANENZA
  useEffect(() => {
    if (inView && typeof window !== 'undefined') {
      // Aggiorna sezione corrente
      window.updateCurrentSection?.('contact')
      
      // Analytics ingresso sezione
      if (window.gtag) {
        window.gtag('event', 'sezione_contatti_visualizzata', {
          event_category: 'Navigazione Sezioni',
          event_label: 'ingresso_contatti',
          custom_parameter_1: 'contact',
          custom_parameter_2: 'sezione_finale',
          custom_parameter_3: 'possibili_conversioni',
          value: 5
        })
      }
    }

    // Cleanup: track tempo nella sezione
    return () => {
      if (inView && typeof window !== 'undefined') {
        const timeInSection = Math.round((Date.now() - sectionStartTime) / 1000)
        if (timeInSection > 3) {
          window.trackTempoSezione?.('contact', timeInSection)
        }
      }
    }
  }, [inView, sectionStartTime])
  
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

  // 🎯 TRACKING MAP CLICKS
  const handleMapClick = useCallback((tipo: 'banchetto' | 'ingrosso') => {
    if (typeof window !== 'undefined') {
      const luogo = tipo === 'banchetto' ? 'via_cavalleggeri' : 'via_de_gasperi'
      
      // Track localizzazione
      window.trackLocalizzazione?.('click_mappa_sezione', luogo, 'navigazione_avviata')
      
      // Track azione contatto
      window.trackAzioneContatto?.('mappa', 'sezione_contatti_mappa', tipo)
      
      // Analytics legacy
      if (window.gtag) {
        window.gtag('event', 'mappa_cliccata_sezione', {
          event_category: 'Interazioni Mappa',
          event_label: `mappa_${tipo}_da_sezione`,
          custom_parameter_1: luogo,
          custom_parameter_2: 'sezione_contatti',
          custom_parameter_3: 'interesse_ubicazione',
          value: 10
        })
      }
    }

    const url = tipo === 'ingrosso' 
      ? 'https://maps.app.goo.gl/TFV4cgnEvcFjBHfD6'
      : 'https://www.google.com/maps/search/?api=1&query=Banchetto+Frutta+e+Verdura+Bottamedi+Via+Cavalleggeri+Udine+Mezzolombardo+TN'
    
    window.open(url, '_blank')
  }, [])

  return (
    <section id="contact" className="py-20 lg:py-24 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
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
            className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4"
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
            className="text-lg lg:text-xl text-gray-600 mb-3"
          >
            {t.subtitle}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: shouldReduceMotion ? 0.2 : 0.4, delay: shouldReduceMotion ? 0 : 0.2 }}
            className="text-base text-gray-500 max-w-2xl mx-auto"
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
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{t.whyChoose}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {t.whyChooseItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: shouldReduceMotion ? 0.2 : 0.3, delay: shouldReduceMotion ? 0 : 0.4 + index * 0.05 }}
                className="flex items-center space-x-2 text-sm text-gray-700"
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
                <h4 className="font-bold text-gray-900 mb-2 text-lg">{t.highlight.title}</h4>
                <p className="text-gray-700 text-sm leading-relaxed italic">{t.highlight.text}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Contact Cards - GRID CORRETTA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
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
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
              {t.mapSection.title}
            </h3>
            <p className="text-lg lg:text-xl text-gray-600">
              {t.mapSection.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Banchetto Map */}
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
              className="relative group cursor-pointer"
              onClick={() => handleMapClick('banchetto')}
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl mb-3 mx-auto">
                        📍
                      </div>
                      <h4 className="text-lg font-bold text-gray-900">
                        {language === 'it' ? 'Banchetto' : 'Marktstand'}
                      </h4>
                      <p className="text-gray-600 text-sm">Via Cavalleggeri Udine</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* HORECA Map */}
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
              className="relative group cursor-pointer"
              onClick={() => handleMapClick('ingrosso')}
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl mb-3 mx-auto">
                        📍
                      </div>
                      <h4 className="text-lg font-bold text-gray-900">
                        {language === 'it' ? 'Ingrosso HORECA' : 'Großhandel HORECA'}
                      </h4>
                      <p className="text-gray-600 text-sm">Via A. de Gasperi, 47</p>
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
