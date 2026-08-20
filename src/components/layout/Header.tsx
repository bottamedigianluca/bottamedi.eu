import React, { useState, useEffect } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'

interface HeaderProps {
  language: 'it' | 'de'
  onLanguageChange: (language: 'it' | 'de') => void
  isMenuOpen: boolean
  onToggleMenu: () => void
}

const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange
}) => {
  const [hidden, setHidden] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()

  // Ottimizzazione: uso useMotionValueEvent per performance
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0
    setIsScrolled(latest > 50)
    
    // Nascondi header solo se scroll significativo
    if (latest > previous && latest > 150) {
      setHidden(true)
    } else {
      setHidden(false)
    }
  })

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" }
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-neutral-200/50' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Grande a Sinistra - Doppio delle Dimensioni */}
          <motion.div
            onClick={() => scrollToSection('hero')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center cursor-pointer"
          >
            <img
              src="/logo-bottamedi.webp"
              alt="Bottamedi Logo"
              className="h-24 w-auto object-contain"
              style={{
                filter: isScrolled 
                  ? 'none' 
                  : 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))'
              }}
            />
          </motion.div>

          {/* Language Selector a Destra */}
          <div className="flex items-center space-x-4">
            {/* Bandiera Italia/Germania */}
            <motion.button
              onClick={() => onLanguageChange(language === 'it' ? 'de' : 'it')}
              className={`flex items-center space-x-3 px-4 py-2 rounded-xl transition-all duration-300 ${
                isScrolled 
                  ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700' 
                  : 'bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white/90'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl">
                {language === 'it' ? '🇮🇹' : '🇩🇪'}
              </span>
              <span className="font-medium text-sm">
                {language.toUpperCase()}
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header
