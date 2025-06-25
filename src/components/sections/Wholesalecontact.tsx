import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface WholesaleContactProps {
  language: 'it' | 'de'
  inView: boolean
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
    },
    whyChoose: 'Perché scegliere Bottamedi per il tuo business:',
    directContacts: 'Contatti diretti:'
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
    },
    whyChoose: 'Warum Bottamedi für Ihr Unternehmen wählen:',
    directContacts: 'Direkte Kontakte:'
  }
}

const WholesaleContact: React.FC<WholesaleContactProps> = ({ language, inView }) => {
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

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')

    try {
      const emailSubject = encodeURIComponent(`Richiesta Listino HORECA - ${formData.businessName}`)
      const emailBody = encodeURIComponent(`Buongiorno,

sono ${formData.contactPerson} di "${formData.businessName}" (${formData.businessType})${formData.location ? ` a ${formData.location}` : ''}.

Vorrei ricevere il vostro listino prezzi HORECA per valutare una collaborazione.

CONTATTI:
📱 ${formData.phone}
📧 ${formData.email}

${formData.message ? `NOTE: ${formData.message}` : ''}

Grazie,
${formData.contactPerson}`)

      const mailtoLink = `mailto:bottamedipierluigi@virgilio.it?subject=${emailSubject}&body=${emailBody}`
      window.open(mailtoLink, '_blank')
      
      setStatus('success')
      
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
      }, 2000)

    } catch (error) {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2000)
    }
  }, [formData])

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const resetButtonFocus = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget
    target.blur()
    setTimeout(() => {
      target.blur()
      target.classList.remove('active', 'focus', 'pressed')
    }, 150)
  }, [])

  const isFormValid = formData.businessName && 
                     formData.contactPerson && 
                     formData.phone && 
                     formData.email && 
                     formData.businessType &&
                     privacyAccepted

  return (
    <section id="wholesale" className="py-20 lg:py-24 bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-green-200 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span>🏢</span>
              <span>Servizio HORECA</span>
            </div>

            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                {t.title}
              </span>
            </h2>

            <p className="text-lg lg:text-xl text-gray-600 mb-3">
              {t.subtitle}
            </p>

            <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t.description}
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            
            {/* Left Column - Benefits & Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-5">
                {t.whyChoose}
              </h3>
              
              <div className="space-y-4">
                {t.benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="flex items-start space-x-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="text-2xl flex-shrink-0">{benefit.icon}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1 text-sm">{benefit.title}</h4>
                      <p className="text-gray-600 text-xs leading-relaxed">{benefit.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Contact Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.7 }}
                className="bg-gradient-to-br from-green-50 to-blue-50 p-5 rounded-xl border border-green-200"
              >
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">{t.directContacts}</h4>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center space-x-2">
                    <span>📞</span>
                    <a href="tel:+390461602534" className="hover:text-blue-600 transition-colors">
                      +39 0461 602534
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>📧</span>
                    <a href="mailto:bottamedipierluigi@virgilio.it" className="hover:text-blue-600 transition-colors break-all">
                      bottamedipierluigi@virgilio.it
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>📍</span>
                    <span>Via de Gasperi 47, Mezzolombardo (TN)</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">✅</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{t.form.success}</h3>
                    <p className="text-gray-600 text-sm">{t.form.successMessage}</p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 1 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    {/* Form Header */}
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        Compila il modulo
                      </h3>
                      <p className="text-gray-600 text-xs">
                        Ti contatteremo entro 24 ore con il listino personalizzato
                      </p>
                    </div>

                    {/* Business Name & Contact Person */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          {t.form.businessName}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.businessName}
                          onChange={(e) => handleInputChange('businessName', e.target.value)}
                          placeholder={t.form.businessNamePlaceholder}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          {t.form.contactPerson}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.contactPerson}
                          onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                          placeholder={t.form.contactPersonPlaceholder}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm outline-none"
                        />
                      </div>
                    </div>

                    {/* Phone & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          {t.form.phone}
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder={t.form.phonePlaceholder}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          {t.form.email}
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder={t.form.emailPlaceholder}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm outline-none"
                        />
                      </div>
                    </div>

                    {/* Business Type & Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          {t.form.businessType}
                        </label>
                        <select
                          required
                          value={formData.businessType}
                          onChange={(e) => handleInputChange('businessType', e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-sm outline-none"
                        >
                          {t.form.businessTypeOptions.map((option, index) => (
                            <option key={index} value={index === 0 ? '' : option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          {t.form.location}
                        </label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          placeholder={t.form.locationPlaceholder}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm outline-none"
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {t.form.message}
                      </label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder={t.form.messagePlaceholder}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm outline-none"
                      />
                    </div>

                    {/* Privacy Checkbox */}
                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        id="privacy"
                        checked={privacyAccepted}
                        onChange={(e) => setPrivacyAccepted(e.target.checked)}
                        className="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 outline-none"
                      />
                      <label htmlFor="privacy" className="text-xs text-gray-600 leading-relaxed">
                        {t.form.privacy}
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={!isFormValid || status === 'sending'}
                      onClick={resetButtonFocus}
                      className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 outline-none focus:outline-none touch-target ${
                        isFormValid && status !== 'sending'
                          ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      style={{ 
                        WebkitTapHighlightColor: 'transparent',
                        userSelect: 'none'
                      }}
                    >
                      {status === 'sending' ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>{t.form.sending}</span>
                        </div>
                      ) : (
                        <>
                          <span>{t.form.submit}</span>
                          <span className="ml-2">📧</span>
                        </>
                      )}
                    </button>

                    {/* Error Message */}
                    {status === 'error' && (
                      <div className="text-center text-red-600 text-xs bg-red-50 p-2 rounded-lg">
                        {t.form.error}
                      </div>
                    )}
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WholesaleContact
