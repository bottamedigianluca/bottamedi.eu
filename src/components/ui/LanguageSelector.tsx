import React, { useState } from 'react'
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

  const handleLanguageChange = (newLanguage: 'it' | 'de') => {
    onLanguageChange(newLanguage)
    setIsOpen(false)
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <motion.div
        className="relative"
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

        {/* Opzione per cambiare lingua - appare in dissolvenza */}
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
  )
}

export default LanguageSelector
