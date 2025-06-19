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
  const otherLanguage = languages.find(lang => lang.code !== language)

  const handleLanguageChange = useCallback((newLanguage: 'it' | 'de') => {
    onLanguageChange(newLanguage)
    setIsOpen(false)
    
    // Haptic feedback su mobile
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(25)
      } catch (e) {
        // Silently fail if vibration not supported
      }
    }
  }, [onLanguageChange])

  const toggleOpen = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  // Chiudi quando si clicca fuori (solo se aperto)
  const handleBackdropClick = useCallback(() => {
    if (isOpen) {
      setIsOpen(false)
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop per mobile - chiude il menu quando si clicca fuori */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm md:hidden"
            onClick={handleBackdropClick}
          />
        )}
      </AnimatePresence>

      <div className="fixed top-4 right-4 z-50">
        <div className="relative">
          
          {/* MOBILE: Bottone che apre/chiude */}
          <div className="block md:hidden">
            <motion.button
              onClick={toggleOpen}
              className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/30 p-3 active:scale-95 transition-transform"
              whileTap={{ scale: 0.95 }}
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              }}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{currentLanguage?.flag}</span>
                <span className="font-medium text-gray-800 text-sm">
                  {currentLanguage?.label}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-gray-600 text-xs"
                >
                  ▼
                </motion.span>
              </div>
            </motion.button>

            {/* Menu dropdown mobile */}
            <AnimatePresence>
              {isOpen && otherLanguage && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full mt-2 left-0 right-0 min-w-[120px]"
                >
                  <motion.button
                    onClick={() => handleLanguageChange(otherLanguage.code)}
                    className="w-full bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-white/40 p-3 text-left active:scale-95 transition-all duration-200"
                    whileTap={{ scale: 0.95 }}
                    style={{ 
                      WebkitTapHighlightColor: 'transparent',
                      touchAction: 'manipulation'
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{otherLanguage.flag}</span>
                      <span className="font-medium text-gray-800 text-sm">
                        {otherLanguage.label}
                      </span>
                      <span className="text-xs text-gray-500">
                        {otherLanguage.name}
                      </span>
                    </div>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* DESKTOP: Hover behavior originale */}
          <motion.div
            className="hidden md:block relative"
            onHoverStart={() => setIsOpen(true)}
            onHoverEnd={() => setIsOpen(false)}
          >
            {/* Lingua corrente sempre visibile */}
            <motion.div
              className="bg-white/20 backdrop-blur-md rounded-xl shadow-lg border border-white/30 p-3 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                opacity: isOpen ? 0.7 : 1,
                y: isOpen ? -5 : 0
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{currentLanguage?.flag}</span>
                <span className="font-medium text-gray-800 text-sm">
                  {currentLanguage?.label}
                </span>
              </div>
            </motion.div>

            {/* Opzione per cambiare lingua - hover */}
            <AnimatePresence>
              {isOpen && otherLanguage && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute top-0 left-0 right-0"
                >
                  <motion.button
                    onClick={() => handleLanguageChange(otherLanguage.code)}
                    className="w-full bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-white/40 p-3 text-left hover:bg-white/95 transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{otherLanguage.flag}</span>
                      <span className="font-medium text-gray-800 text-sm">
                        {otherLanguage.label}
                      </span>
                    </div>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Indicatore hover sottile */}
            <motion.div
              className="absolute -bottom-1 left-1/2 w-2 h-2 bg-green-500 rounded-full opacity-0"
              animate={{
                opacity: isOpen ? 1 : 0,
                scale: isOpen ? 1 : 0.5
              }}
              style={{ x: '-50%' }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default LanguageSelector
