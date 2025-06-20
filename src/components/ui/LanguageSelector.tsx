import React, { useCallback } from 'react'
import { motion } from 'framer-motion'

interface LanguageSelectorProps {
  language: 'it' | 'de'
  onLanguageChange: (language: 'it' | 'de') => void
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  language,
  onLanguageChange
}) => {
  const languages = [
    { code: 'it' as const, label: 'IT', flag: '🇮🇹' },
    { code: 'de' as const, label: 'DE', flag: '🇩🇪' }
  ]

  const currentLanguage = languages.find(lang => lang.code === language)
  const otherLanguage = languages.find(lang => lang.code !== language)

  // 🎯 SWITCH DIRETTO - Cambia lingua al click
  const handleLanguageSwitch = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const newLanguage = language === 'it' ? 'de' : 'it'
    onLanguageChange(newLanguage)
    
    // Haptic feedback leggero
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(25)
      } catch (e) {
        // Silent fail
      }
    }
  }, [language, onLanguageChange])

  return (
    <div className="language-selector-hero">
      <motion.button
        onClick={handleLanguageSwitch}
        className="language-selector-hero-button"
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        title={`Switch to ${otherLanguage?.label}`}
        aria-label={`Cambia lingua a ${otherLanguage?.label}`}
      >
        {/* Bandiera corrente */}
        <motion.span 
          className="text-lg"
          key={`current-flag-${language}`}
          initial={{ scale: 0.9, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {currentLanguage?.flag}
        </motion.span>
        
        {/* Label corrente */}
        <motion.span 
          className="font-semibold text-sm"
          key={`current-label-${language}`}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.05 }}
        >
          {currentLanguage?.label}
        </motion.span>

        {/* Indicator per switch */}
        <motion.div
          className="language-switch-indicator"
          animate={{ rotate: [0, 180, 360] }}
          transition={{ 
            duration: 0.5,
            ease: "easeInOut",
            times: [0, 0.5, 1]
          }}
          key={`indicator-${language}`}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </motion.div>
      </motion.button>
    </div>
  )
}

export default LanguageSelector
