import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
  const openMap = useCallback(() => {
    // CORRETTO: Link diretto per l'ingrosso
    const mapUrl = isIngrosso 
      ? 'https://maps.app.goo.gl/TFV4cgnEvcFjBHfD6'
      : 'https://www.google.com/maps/search/?api=1&query=Banchetto+Frutta+e+Verdura+Bottamedi+Via+Cavalleggeri+Udine+Mezzolombardo+TN'
    
    window.open(mapUrl, '_blank')
  }, [isIngrosso])

  const callPhone = useCallback(() => {
    window.open(`tel:${contact.phone.replace(/\s/g, '')}`, '_self')
  }, [contact.phone])

  const sendWhatsApp = useCallback(() => {
    const message = encodeURIComponent(`Ciao! Sono interessato ai vostri servizi di ${contact.title}`)
    window.open(`https://wa.me/393515776198?text=${message}`, '_blank')
  }, [contact.title])

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative group"
    >
      <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-neutral-100 h-full">
        {/* Icon Header */}
        <div className="relative mb-6">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          <h3 className="text-2xl font-bold text-neutral-900">
            {contact.title}
          </h3>
        </div>

        {/* Contact Info */}
        <div className="space-y-4 mb-6">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-brand-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-neutral-600 leading-relaxed">
              {contact.address}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-brand-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="text-neutral-600 hover:text-brand-600 transition-colors">
              {contact.phone}
            </a>
          </div>

          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-brand-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <a href={`mailto:${contact.email}`} className="text-neutral-600 hover:text-brand-600 transition-colors">
              {contact.email}
            </a>
          </div>

          {contact.hours && (
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-brand-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-neutral-600">
                {contact.hours}
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-neutral-700 mb-3">{quickActions.title}</h4>
          
          <div className="grid grid-cols-1 gap-2">
            <motion.button
              onClick={callPhone}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-2 px-4 bg-gradient-to-r ${gradient} text-white rounded-lg font-medium text-sm transition-all duration-300 hover:shadow-md flex items-center justify-center space-x-2`}
            >
              <span>📞</span>
              <span>{quickActions.call}</span>
            </motion.button>

            <div className="grid grid-cols-2 gap-2">
              <motion.button
                onClick={sendWhatsApp}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="py-2 px-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center space-x-1"
              >
                <span>💬</span>
                <span>{quickActions.whatsapp}</span>
              </motion.button>

              <motion.button
                onClick={openMap}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center space-x-1"
              >
                <span>🗺️</span>
                <span>{quickActions.directions}</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Hover Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          initial={false}
        />
      </div>
    </motion.div>
  )
})

const ContactSection: React.FC<ContactSectionProps> = ({ language, inView }) => {
  const translations = {
    it: {
      title: 'Contattaci',
      subtitle: 'Siamo qui per te',
      description: 'Scegli come preferisci entrare in contatto con noi',
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
        call: 'Chiama Ora',
        whatsapp: 'WhatsApp',
        directions: 'Indicazioni'
      }
    },
    de: {
      title: 'Kontakt',
      subtitle: 'Wir sind für Sie da',
      description: 'Wählen Sie, wie Sie uns am liebsten kontaktieren möchten',
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
        call: 'Jetzt Anrufen',
        whatsapp: 'WhatsApp',
        directions: 'Wegbeschreibung'
      }
    }
  }

  const t = translations[language]

  return (
    <section id="contact" className="py-24 lg:py-32 bg-gradient-to-br from-white to-neutral-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-brand-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent-200/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.h2
            className="text-4xl lg:text-6xl font-bold text-neutral-900 mb-6"
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
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-neutral-600 mb-4"
          >
            {t.subtitle}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg text-neutral-500 max-w-3xl mx-auto"
          >
            {t.description}
          </motion.p>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          <ContactCard
            contact={t.contact.retail}
            icon="🛒"
            gradient="from-brand-500 to-brand-600"
            index={0}
            quickActions={t.quickActions}
            isIngrosso={false}
          />
          <ContactCard
            contact={t.contact.horeca}
            icon="🏨"
            gradient="from-accent-500 to-accent-600"
            index={1}
            quickActions={t.quickActions}
            isIngrosso={true}
          />
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-neutral-900 mb-4">
              Come Raggiungerci
            </h3>
            <p className="text-xl text-neutral-600">
              Vieni a trovarci nelle nostre sedi a Mezzolombardo
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Banchetto Map */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative group cursor-pointer"
              onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=Banchetto+Frutta+e+Verdura+Bottamedi+Via+Cavalleggeri+Udine+Mezzolombardo+TN', '_blank')}
            >
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                <div className="h-64 bg-gradient-to-br from-brand-100 to-brand-200 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-brand-500 rounded-full flex items-center justify-center text-white text-2xl mb-4 mx-auto">
                        📍
                      </div>
                      <h4 className="text-xl font-bold text-neutral-900">Banchetto</h4>
                      <p className="text-neutral-600">Via Cavalleggeri Udine</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* HORECA Map - CORRETTO con link diretto */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative group cursor-pointer"
              onClick={() => window.open('https://maps.app.goo.gl/TFV4cgnEvcFjBHfD6', '_blank')}
            >
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                <div className="h-64 bg-gradient-to-br from-accent-100 to-accent-200 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center text-white text-2xl mb-4 mx-auto">
                        📍
                      </div>
                      <h4 className="text-xl font-bold text-neutral-900">Ingrosso HORECA</h4>
                      <p className="text-neutral-600">Via A. de Gasperi, 47</p>
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

export default ContactSection