import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

interface PrivacySettingsProps {
  language: 'it' | 'de'
  className?: string
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({ language, className = '' }) => {
  const [showModal, setShowModal] = useState(false)
  const [currentConsent, setCurrentConsent] = useState<any>(null)

  const translations = {
    it: {
      manage: 'Gestisci Cookie',
      reset: 'Reimposta Preferenze',
      modalTitle: 'Impostazioni Privacy e Cookie',
      modalDescription: 'Gestisci le tue preferenze sui cookie e la privacy',
      currentSettings: 'Impostazioni Attuali:',
      analytics: 'Cookie Analytics',
      marketing: 'Cookie Marketing',
      necessary: 'Cookie Tecnici',
      enabled: 'Abilitati',
      disabled: 'Disabilitati',
      always: 'Sempre attivi',
      lastUpdated: 'Ultimo aggiornamento:',
      resetConfirm: 'Vuoi reimpostare tutte le preferenze sui cookie?',
      resetWarning: 'Questo mostrerà di nuovo il banner dei cookie.',
      resetAction: 'Reimposta',
      cancel: 'Annulla',
      close: 'Chiudi',
      viewDocuments: 'Visualizza Documenti Legali'
    },
    de: {
      manage: 'Cookies Verwalten',
      reset: 'Einstellungen Zurücksetzen',
      modalTitle: 'Datenschutz- und Cookie-Einstellungen',
      modalDescription: 'Verwalten Sie Ihre Cookie- und Datenschutzeinstellungen',
      currentSettings: 'Aktuelle Einstellungen:',
      analytics: 'Analytics-Cookies',
      marketing: 'Marketing-Cookies',
      necessary: 'Technische Cookies',
      enabled: 'Aktiviert',
      disabled: 'Deaktiviert',
      always: 'Immer aktiv',
      lastUpdated: 'Letzte Aktualisierung:',
      resetConfirm: 'Möchten Sie alle Cookie-Einstellungen zurücksetzen?',
      resetWarning: 'Dies wird das Cookie-Banner erneut anzeigen.',
      resetAction: 'Zurücksetzen',
      cancel: 'Abbrechen',
      close: 'Schließen',
      viewDocuments: 'Rechtsdokumente Anzeigen'
    }
  }

  const t = translations[language]

  React.useEffect(() => {
    const consent = localStorage.getItem('bottamedi-cookie-consent')
    if (consent) {
      try {
        setCurrentConsent(JSON.parse(consent))
      } catch (e) {
        console.warn('Invalid cookie consent data')
      }
    }
  }, [])

  const openCookieSettings = useCallback(() => {
    // Tracciamento apertura impostazioni cookie
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'cookie_settings_open', {
        event_category: 'privacy',
        event_label: 'footer_link'
      })
    }
    
    setShowModal(true)
  }, [])

  const resetCookieSettings = useCallback(() => {
    // Tracciamento reset impostazioni
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'cookie_settings_reset', {
        event_category: 'privacy',
        event_label: 'user_action'
      })
    }
    
    // Reset cookie consent to show banner again
    localStorage.removeItem('bottamedi-cookie-consent')
    setShowModal(false)
    
    // Reload to show banner
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }, [])

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(language === 'it' ? 'it-IT' : 'de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const scrollToLegalDocs = useCallback(() => {
    // Track legal docs navigation
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'legal_docs_navigation', {
        event_category: 'privacy',
        event_label: 'from_privacy_settings'
      })
    }
    
    // Scroll to legal documents (assumes they're at the bottom of the page)
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    })
    
    setShowModal(false)
  }, [])

  return (
    <>
      <div className={`flex flex-col sm:flex-row gap-2 text-sm ${className}`}>
        <button
          onClick={openCookieSettings}
          className="text-gray-400 hover:text-gray-600 transition-colors underline flex items-center space-x-1"
        >
          <span>🍪</span>
          <span>{t.manage}</span>
        </button>
        
        <span className="hidden sm:inline text-gray-400">•</span>
        
        <button
          onClick={scrollToLegalDocs}
          className="text-gray-400 hover:text-gray-600 transition-colors underline flex items-center space-x-1"
        >
          <span>📄</span>
          <span>{t.viewDocuments}</span>
        </button>
      </div>

      {/* Privacy Settings Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{t.modalTitle}</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <p className="text-gray-600 mb-6 text-sm">{t.modalDescription}</p>

                {/* Current Settings */}
                {currentConsent && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">{t.currentSettings}</h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">🔧</span>
                          <span className="text-sm font-medium">{t.necessary}</span>
                        </div>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                          {t.always}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">📊</span>
                          <span className="text-sm font-medium">{t.analytics}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          currentConsent.analytics 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {currentConsent.analytics ? t.enabled : t.disabled}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">🎯</span>
                          <span className="text-sm font-medium">{t.marketing}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          currentConsent.marketing 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {currentConsent.marketing ? t.enabled : t.disabled}
                        </span>
                      </div>
                    </div>

                    {currentConsent.timestamp && (
                      <p className="text-xs text-gray-500 mt-3">
                        {t.lastUpdated} {formatDate(currentConsent.timestamp)}
                      </p>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={resetCookieSettings}
                    className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>🔄</span>
                    <span>{t.reset}</span>
                  </button>

                  <div className="text-xs text-gray-500 text-center">
                    {t.resetWarning}
                  </div>

                  <button
                    onClick={scrollToLegalDocs}
                    className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>📄</span>
                    <span>{t.viewDocuments}</span>
                  </button>

                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full py-2 px-4 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {t.close}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default React.memo(PrivacySettings)