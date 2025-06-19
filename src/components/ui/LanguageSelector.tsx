import React from 'react'
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

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-2">
        <div className="flex space-x-1">
          {languages.map((lang) => (
            <motion.button
              key={lang.code}
              onClick={() => onLanguageChange(lang.code)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200
                ${language === lang.code
                  ? 'bg-green-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LanguageSelector
