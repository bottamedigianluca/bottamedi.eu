import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

interface CookieBannerProps {
  language: 'it' | 'de'
}

const CookieBanner: React.FC<CookieBannerProps> = ({ language }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false
  })

  useEffect(() => {
    const consent = localStorage.getItem('bottamedi-cookie-consent')
    if (!consent) {
      // Mostra il banner dopo 2 secondi dal caricamento
      const timer = setTimeout(() => setIsVisible(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const translations = {
    it: {
      title: 'Utilizziamo i Cookie',
      description: 'Utilizziamo cookie tecnici e, previo consenso, cookie di profilazione per migliorare la tua esperienza di navigazione e offrirti contenuti personalizzati.',
      necessary: 'Cookie Tecnici (Necessari)',
      analytics: 'Cookie Analytics',
      marketing: 'Cookie di Marketing',
      acceptAll: 'Accetta Tutti',
      acceptSelected: 'Accetta Selezionati',
      reject: 'Rifiuta Non Necessari',
      settings: 'Impostazioni Cookie',
      moreInfo: 'Maggiori informazioni nella nostra',
      privacyPolicy: 'Privacy Policy',
      details: {
        necessary: 'Essenziali per il funzionamento del sito web',
        analytics: 'Ci aiutano a migliorare il sito (Google Analytics)',
        marketing: 'Per annunci personalizzati e remarketing'
      }
    },
    de: {
      title: 'Wir verwenden Cookies',
      description: 'Wir verwenden technische Cookies und nach Zustimmung Profiling-Cookies, um Ihr Navigationserlebnis zu verbessern und Ihnen personalisierte Inhalte anzubieten.',
      necessary: 'Technische Cookies (Notwendig)',
      analytics: 'Analytics-Cookies',
      marketing: 'Marketing-Cookies',
      acceptAll: 'Alle Akzeptieren',
      acceptSelected: 'Ausgewählte Akzeptieren',
      reject: 'Nicht Notwendige Ablehnen',
      settings: 'Cookie-Einstellungen',
      moreInfo: 'Weitere Informationen in unserer',
      privacyPolicy: 'Datenschutzerklärung',
      details: {
        necessary: 'Wesentlich für das Funktionieren der Website',
        analytics: 'Helfen uns, die Website zu verbessern (Google Analytics)',
        marketing: 'Für personalisierte Werbung und Remarketing'
      }
    }
  }

  const t = translations[language]

  const handleAcceptAll = useCallback(() => {
    const consent = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now()
    }
    localStorage.setItem('bottamedi-cookie-consent', JSON.stringify(consent))
    
    // Attiva Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted'
      })
      window.gtag('event', 'cookie_consent', {
        event_category: 'privacy',
        event_label: 'accept_all',
        value: 1
      })
    }
    
    setIsVisible(false)
  }, [])

  const handleAcceptSelected = useCallback(() => {
    const consent = {
      ...preferences,
      timestamp: Date.now()
    }
    localStorage.setItem('bottamedi-cookie-consent', JSON.stringify(consent))
    
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: preferences.analytics ? 'granted' : 'denied',
        ad_storage: preferences.marketing ? 'granted' : 'denied'
      })
      window.gtag('event', 'cookie_consent', {
        event_category: 'privacy',
        event_label: 'accept_selected',
        custom_parameters: {
          analytics: preferences.analytics,
          marketing: preferences.marketing
        }
      })
    }
    
    setIsVisible(false)
  }, [preferences])

  const handleReject = useCallback(() => {
    const consent = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now()
    }
    localStorage.setItem('bottamedi-cookie-consent', JSON.stringify(consent))
    
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied'
      })
      window.gtag('event', 'cookie_consent', {
        event_category: 'privacy',
        event_label: 'reject_optional',
        value: 1
      })
    }
    
    setIsVisible(false)
  }, [])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-2xl border-t border-gray-200"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">🍪</span>
                <h3 className="text-lg font-bold text-gray-900">{t.title}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                {t.description}
              </p>
              <p className="text-xs text-gray-500">
                {t.moreInfo} <button 
                  onClick={() => {
                    if (typeof window !== 'undefined' && window.gtag) {
                      window.gtag('event', 'privacy_policy_click', {
                        event_category: 'engagement',
                        event_label: 'cookie_banner'
                      })
                    }
                  }} 
                  className="text-green-600 underline hover:text-green-700 transition-colors"
                >
                  {t.privacyPolicy}
                </button>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 lg:flex-shrink-0">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                {t.settings}
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                {t.reject}
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-6 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md"
              >
                {t.acceptAll}
              </button>
            </div>
          </div>

          {/* Cookie Settings */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-900">{t.necessary}</label>
                      <input 
                        type="checkbox" 
                        checked={true} 
                        disabled 
                        className="rounded border-gray-300 text-green-600"
                      />
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{t.details.necessary}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-900">{t.analytics}</label>
                      <input 
                        type="checkbox" 
                        checked={preferences.analytics}
                        onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{t.details.analytics}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-900">{t.marketing}</label>
                      <input 
                        type="checkbox" 
                        checked={preferences.marketing}
                        onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{t.details.marketing}</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleAcceptSelected}
                    className="px-6 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md"
                  >
                    {t.acceptSelected}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default React.memo(CookieBanner)