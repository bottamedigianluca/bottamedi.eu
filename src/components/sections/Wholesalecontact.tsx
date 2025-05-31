import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

interface WholesaleContactProps {
  language: 'it' | 'de'
}

const translations = {
  it: {
    title: 'Richiedi il Listino Ingrosso',
    subtitle: 'Partnership HORECA per la tua attività',
    description: 'Unisciti a oltre 50 ristoranti, hotel e pizzerie che si affidano alla qualità Bottamedi. Ricevi il nostro listino prezzi aggiornato e scopri le condizioni dedicate ai professionali del settore.',
    benefits: [
      {
        icon: '📋',
        title: 'Listino Personalizzato',
        desc: 'Prezzi dedicati in base ai volumi'
      },
      {
        icon: '🚚',
        title: 'Consegne Programmate',
        desc: 'Servizio 6 giorni su 7 in orari concordati'
      },
      {
        icon: '🎯',
        title: 'Selezione Premium',
        desc: 'Prodotti selezionati per il settore HORECA'
      },
      {
        icon: '🤝',
        title: 'Partnership Duratura',
        desc: 'Rapporto di fiducia e consulenza continua'
      }
    ],
    form: {
      businessName: 'Nome dell\'attività *',
      businessNamePlaceholder: 'es. Ristorante Da Mario',
      contactPerson: 'Referente *',
      contactPersonPlaceholder: 'Nome e cognome',
      phone: 'Telefono *', 
      phonePlaceholder: '+39 333 123456',
      email: 'Email *',
      emailPlaceholder: 'tua@email.it',
      businessType: 'Tipo di attività *',
      businessTypeOptions: [
        'Seleziona il tipo di attività',
        'Ristorante',
        'Pizzeria', 
        'Hotel',
        'Bar/Caffetteria',
        'Catering',
        'Mensa aziendale',
        'Negozio alimentari',
        'Altro'
      ],
      location: 'Località',
      locationPlaceholder: 'Città/Comune',
      message: 'Note aggiuntive',
      messagePlaceholder: 'Raccontaci le tue esigenze specifiche...',
      privacy: 'Accetto il trattamento dei dati personali secondo la privacy policy',
      submit: 'Richiedi Listino Ingrosso',
      sending: 'Invio in corso...',
      success: 'Richiesta inviata con successo!',
      successMessage: 'Ti contatteremo entro 24 ore per fornirti il listino personalizzato.',
      error: 'Errore nell\'invio. Riprova o contattaci direttamente.'
    }
  },
  de: {
    title: 'Großhandels-Preisliste anfordern',
    subtitle: 'HORECA-Partnerschaft für Ihr Unternehmen',
    description: 'Schließen Sie sich über 50 Restaurants, Hotels und Pizzerien an, die auf die Qualität von Bottamedi vertrauen. Erhalten Sie unsere aktuelle Preisliste und entdecken Sie die speziellen Konditionen für Fachleute.',
    benefits: [
      {
        icon: '📋',
        title: 'Personalisierte Preisliste',
        desc: 'Dedizierte Preise basierend auf Volumen'
      },
      {
        icon: '🚚',
        title: 'Geplante Lieferungen',
        desc: 'Service 6 Tage die Woche zu vereinbarten Zeiten'
      },
      {
        icon: '🎯',
        title: 'Premium-Auswahl',
        desc: 'Für HORECA-Sektor ausgewählte Produkte'
      },
      {
        icon: '🤝',
        title: 'Dauerhafte Partnerschaft',
        desc: 'Vertrauensverhältnis und kontinuierliche Beratung'
      }
    ],
    form: {
      businessName: 'Unternehmensname *',
      businessNamePlaceholder: 'z.B. Restaurant Da Mario',
      contactPerson: 'Ansprechpartner *',
      contactPersonPlaceholder: 'Vor- und Nachname',
      phone: 'Telefon *',
      phonePlaceholder: '+39 333 123456',
      email: 'E-Mail *',
      emailPlaceholder: 'ihre@email.de',
      businessType: 'Unternehmenstyp *',
      businessTypeOptions: [
        'Unternehmenstyp wählen',
        'Restaurant',
        'Pizzeria',
        'Hotel',
        'Bar/Café',
        'Catering',
        'Betriebsmensa',
        'Lebensmittelgeschäft',
        'Andere'
      ],
      location: 'Standort',
      locationPlaceholder: 'Stadt/Gemeinde',
      message: 'Zusätzliche Notizen',
      messagePlaceholder: 'Erzählen Sie uns von Ihren spezifischen Bedürfnissen...',
      privacy: 'Ich akzeptiere die Verarbeitung personenbezogener Daten gemäß Datenschutzrichtlinie',
      submit: 'Großhandels-Preisliste anfordern',
      sending: 'Wird gesendet...',
      success: 'Anfrage erfolgreich gesendet!',
      successMessage: 'Wir werden Sie innerhalb von 24 Stunden kontaktieren, um Ihnen die personalisierte Preisliste zu liefern.',
      error: 'Fehler beim Senden. Versuchen Sie es erneut oder kontaktieren Sie uns direkt.'
    }
  }
}

const WholesaleContact: React.FC<WholesaleContactProps> = ({ language }) => {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true })
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    phone: '',
    email: '',
    businessType: '',
    location: '',
    message: ''
  })
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const t = translations[language]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')

    try {
      // Costruisci l'email
      const emailSubject = encodeURIComponent('Richiesta Listino Ingrosso HORECA - Bottamedi')
      const emailBody = encodeURIComponent(`
Nuova richiesta listino ingrosso da bottamedi.eu

DATI AZIENDA:
Nome attività: ${formData.businessName}
Tipo attività: ${formData.businessType}
Località: ${formData.location}

REFERENTE:
Nome: ${formData.contactPerson}
Telefono: ${formData.phone}
Email: ${formData.email}

NOTE AGGIUNTIVE:
${formData.message}

---
Richiesta inviata automaticamente dal sito bottamedi.eu
      `)

      // Apri client email dell'utente
      window.location.href = `mailto:bottamedipierluigi@virgilio.it?subject=${emailSubject}&body=${emailBody}`
      
      // Simula invio per UX
      setTimeout(() => {
        setStatus('success')
        // Reset form dopo 3 secondi
        setTimeout(() => {
          setStatus('idle')
          setFormData({
            businessName: '',
            contactPerson: '',
            phone: '',
            email: '',
            businessType: '',
            location: '',
            message: ''
          })
          setPrivacyAccepted(false)
        }, 3000)
      }, 1000)

    } catch (error) {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const isFormValid = formData.businessName && 
                     formData.contactPerson && 
                     formData.phone && 
                     formData.email && 
                     formData.businessType &&
                     privacyAccepted

  return (
    <section id="wholesale" className="py-24 bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-green-200 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <span>🏢</span>
              <span>Servizio HORECA</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6"
            >
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                {t.title}
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
            >
              {t.subtitle}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-gray-600 max-w-4xl mx-auto leading-relaxed"
            >
              {t.description}
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="space-y-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Perché scegliere Bottamedi per il tuo business:
              </h3>
              
              <div className="space-y-6">
                {t.benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    className="flex items-start space-x-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="text-3xl">{benefit.icon}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{benefit.title}</h4>
                      <p className="text-gray-600 text-sm">{benefit.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1 }}
                className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-2xl border border-green-200"
              >
                <h4 className="font-semibold text-gray-900 mb-3">Contatti diretti:</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <span>📞</span>
                    <span>+39 351 577 6198</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>📧</span>
                    <span>bottamedipierluigi@virgilio.it</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>📍</span>
                    <span>Via de Gasperi 47, Mezzolombardo (TN)</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <AnimatePresence mode="wait">
                  {status === 'success' ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="text-center py-8"
                    >
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">✅</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.form.success}</h3>
                      <p className="text-gray-600">{t.form.successMessage}</p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          Compila il modulo
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Ti contatteremo entro 24 ore con il listino personalizzato
                        </p>
                      </div>

                      {/* Business Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.form.businessName}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.businessName}
                          onChange={(e) => handleInputChange('businessName', e.target.value)}
                          placeholder={t.form.businessNamePlaceholder}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>

                      {/* Contact Person */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.form.contactPerson}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.contactPerson}
                          onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                          placeholder={t.form.contactPersonPlaceholder}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>

                      {/* Phone & Email Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t.form.phone}
                          </label>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder={t.form.phonePlaceholder}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t.form.email}
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder={t.form.emailPlaceholder}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>

                      {/* Business Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.form.businessType}
                        </label>
                        <select
                          required
                          value={formData.businessType}
                          onChange={(e) => handleInputChange('businessType', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                        >
                          {t.form.businessTypeOptions.map((option, index) => (
                            <option key={index} value={index === 0 ? '' : option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Location */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.form.location}
                        </label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          placeholder={t.form.locationPlaceholder}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.form.message}
                        </label>
                        <textarea
                          rows={4}
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          placeholder={t.form.messagePlaceholder}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        />
                      </div>

                      {/* Privacy */}
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          id="privacy"
                          checked={privacyAccepted}
                          onChange={(e) => setPrivacyAccepted(e.target.checked)}
                          className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="privacy" className="text-sm text-gray-600 leading-relaxed">
                          {t.form.privacy}
                        </label>
                      </div>

                      {/* Submit Button */}
                      <motion.button
                        type="submit"
                        disabled={!isFormValid || status === 'sending'}
                        whileHover={isFormValid ? { scale: 1.02, y: -2 } : {}}
                        whileTap={isFormValid ? { scale: 0.98 } : {}}
                        className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                          isFormValid && status !== 'sending'
                            ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg hover:shadow-xl'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {status === 'sending' ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>{t.form.sending}</span>
                          </div>
                        ) : (
                          <>
                            <span>{t.form.submit}</span>
                            <span className="ml-2">📧</span>
                          </>
                        )}
                      </motion.button>

                      {/* Error Message */}
                      {status === 'error' && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-center text-red-600 text-sm bg-red-50 p-3 rounded-xl"
                        >
                          {t.form.error}
                        </motion.div>
                      )}
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default WholesaleContact