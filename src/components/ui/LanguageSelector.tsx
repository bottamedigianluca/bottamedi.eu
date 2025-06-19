import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LanguageSelectorProps {
  language: 'it' | 'de'
  onLanguageChange: (language: 'it' | 'de') => void
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  language,
  onLanguageChange
}) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const languages = [
    { code: 'it' as const, label: 'IT', flag: '🇮🇹', name: 'Italiano' },
    { code: 'de' as const, label: 'DE', flag: '🇩🇪', name: 'Deutsch' }
  ]

  const currentLanguage = languages.find(lang => lang.code === language)

  // 🎯 SWITCH RAPIDO - Cambia lingua direttamente
  const handleQuickSwitch = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const newLanguage = language === 'it' ? 'de' : 'it'
    onLanguageChange(newLanguage)
    setIsOpen(false)
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(25)
      } catch (e) {
        // Silently fail
      }
    }
  }, [language, onLanguageChange])

  const toggleOpen = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(prev => !prev)
  }, [])

  // Chiudi quando si clicca fuori
  const handleBackdropClick = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <>
      {/* Backdrop invisibile per mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
            onClick={handleBackdropClick}
          />
        )}
      </AnimatePresence>

      <div className="language-selector">
        
        {/* MOBILE: Switch rapido con glass effect */}
        <div className="block md:hidden">
          <motion.button
            onClick={handleQuickSwitch}
            className="language-selector-button"
            whileTap={{ scale: 0.95 }}
            style={{ 
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation'
            }}
          >
            <motion.span 
              className="text-lg"
              key={language} // Force re-render per animazione flag
              initial={{ scale: 0.8, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {currentLanguage?.flag}
            </motion.span>
            <motion.span 
              className="font-semibold text-gray-800 text-sm"
              key={`${language}-label`}
              initial={{ x: -5, opacity: 0.7 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.05 }}
            >
              {currentLanguage?.label}
            </motion.span>
            
            {/* Switch indicator */}
            <motion.div
              className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 ml-1"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.span 
                className="text-xs text-white/80"
                animate={{ rotate: 180 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                key={language}
              >
                ⇄
              </motion.span>
            </motion.div>
          </motion.button>
        </div>

        {/* DESKTOP: Menu dropdown con hover */}
        <div className="hidden md:block">
          <motion.div
            className="relative"
            onHoverStart={() => setIsOpen(true)}
            onHoverEnd={() => setIsOpen(false)}
          >
            {/* Current language button */}
            <motion.button
              onClick={handleQuickSwitch}
              className="language-selector-button"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              animate={{
                opacity: isOpen ? 0.8 : 1,
                y: isOpen ? -2 : 0
              }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-lg">{currentLanguage?.flag}</span>
              <span className="font-semibold text-gray-800 text-sm">
                {currentLanguage?.label}
              </span>
            </motion.button>

            {/* Dropdown menu */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ 
                    opacity: 0, 
                    y: -10, 
                    scale: 0.95,
                    filter: 'blur(5px)'
                  }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    filter: 'blur(0px)'
                  }}
                  exit={{ 
                    opacity: 0, 
                    y: -10, 
                    scale: 0.95,
                    filter: 'blur(5px)'
                  }}
                  transition={{ 
                    duration: 0.25, 
                    ease: [0.25, 0.46, 0.45, 0.94] 
                  }}
                  className="language-selector-dropdown"
                >
                  {languages.map((lang) => (
                    <motion.button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code)
                        setIsOpen(false)
                      }}
                      className={`language-selector-option ${
                        lang.code === language ? 'opacity-50' : ''
                      }`}
                      disabled={lang.code === language}
                      whileHover={lang.code !== language ? { 
                        x: 2, 
                        backgroundColor: 'rgba(34, 197, 94, 0.1)' 
                      } : {}}
                      whileTap={lang.code !== language ? { scale: 0.98 } : {}}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        duration: 0.2, 
                        delay: lang.code === 'it' ? 0 : 0.05 
                      }}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="font-medium">{lang.label}</span>
                      <span className="text-xs text-gray-500">{lang.name}</span>
                    </motion.button>
