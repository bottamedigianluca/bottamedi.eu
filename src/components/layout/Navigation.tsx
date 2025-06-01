import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface NavigationProps {
  language: 'it' | 'de'
  onLanguageChange: (lang: 'it' | 'de') => void
}

const translations = {
  it: {
    menu: {
      home: 'Home',
      market: 'Al Banchetto',
      wholesale: 'Ingrosso',
      about: 'Chi Siamo',
      contact: 'Contatti'
    },
    cta: 'Richiedi Listino',
    phone: '+39 351 577 6198'
  },
  de: {
    menu: {
      home: 'Home',
      market: 'Marktstand',
      wholesale: 'Großhandel',
      about: 'Über uns',
      contact: 'Kontakt'
    },
    cta: 'Preisliste anfordern',
    phone: '+39 351 577 6198'
  }
}

const Navigation: React.FC<NavigationProps> = ({ language, onLanguageChange }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  const t = translations[language]

  // Scroll detection ottimizzato
  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50)
          ticking = false
        })
        ticking = true
      }
    }

    // Intersection Observer per sezioni attive
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '-80px 0px -80px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }, observerOptions)

    // Osserva tutte le sezioni
    const sections = ['hero', 'market', 'wholesale', 'about']
    sections.forEach(id => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMobileMenuOpen(false)
    }
  }

  const menuItems = [
    { id: 'hero', label: t.menu.home, icon: '🏠' },
    { id: 'market', label: t.menu.market, icon: '🛒' },
    { id: 'wholesale', label: t.menu.wholesale, icon: '🏢' },
    { id: 'about', label: t.menu.about, icon: '🌱' }
  ]

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-green-100' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              onClick={() => scrollToSection('hero')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <img
                src="/logo-bottamedi.png"
                alt="Bottamedi Logo"
                className="h-10 w-auto"
              />
              <div className={`font-bold text-xl transition-colors ${
                isScrolled ? 'text-green-600' : 'text-white'
              }`}>
                BOTTAMEDI
              </div>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              {menuItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  whileHover={{ y: -2 }}
                  className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    activeSection === item.id
                      ? isScrolled 
                        ? 'text-green-600 bg-green-50' 
                        : 'text-white bg-white/20'
                      : isScrolled 
                        ? 'text-gray-700 hover:text-green-600 hover:bg-green-50' 
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeIndicator"
                      className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${
                        isScrolled ? 'bg-green-500' : 'bg-white'
                      }`}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Language & CTA */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Language Switcher */}
              <div className="flex items-center bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => onLanguageChange('it')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                    language === 'it' 
                      ? 'bg-white text-green-600' 
                      : isScrolled ? 'text-gray-600 hover:text-green-600' : 'text-white/70 hover:text-white'
                  }`}
                >
                  IT
                </button>
                <button
                  onClick={() => onLanguageChange('de')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                    language === 'de' 
                      ? 'bg-white text-green-600' 
                      : isScrolled ? 'text-gray-600 hover:text-green-600' : 'text-white/70 hover:text-white'
                  }`}
                >
                  DE
                </button>
              </div>

              {/* CTA Button */}
              <motion.button
                onClick={() => scrollToSection('wholesale')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {t.cta}
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
            >
              <div className="w-6 h-6 relative">
                <motion.span
                  animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                  className="absolute top-0 left-0 w-full h-0.5 bg-current rounded-full"
                />
                <motion.span
                  animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="absolute top-2.5 left-0 w-full h-0.5 bg-current rounded-full"
                />
                <motion.span
                  animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                  className="absolute top-5 left-0 w-full h-0.5 bg-current rounded-full"
                />
              </div>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute right-0 top-0 h-full w-80 max-w-sm bg-white shadow-2xl"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <img
                      src="/logo-bottamedi.png"
                      alt="Bottamedi Logo"
                      className="h-8 w-auto"
                    />
                    <span className="font-bold text-lg text-green-600">BOTTAMEDI</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    ✕
                  </button>
                </div>

                {/* Menu Items */}
                <div className="space-y-4 mb-8">
                  {menuItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 ${
                        activeSection === item.id
                          ? 'bg-green-50 text-green-600 border-2 border-green-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className="font-medium text-lg">{item.label}</span>
                      {activeSection === item.id && (
                        <motion.div
                          layoutId="mobileActiveIndicator"
                          className="ml-auto w-2 h-2 bg-green-500 rounded-full"
                        />
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Language Switcher */}
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-3">Lingua / Sprache</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onLanguageChange('it')}
                      className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
                        language === 'it' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      🇮🇹 Italiano
                    </button>
                    <button
                      onClick={() => onLanguageChange('de')}
                      className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
                        language === 'de' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      🇩🇪 Deutsch
                    </button>
                  </div>
                </div>

                {/* CTA Button */}
                <motion.button
                  onClick={() => scrollToSection('wholesale')}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg"
                >
                  {t.cta}
                </motion.button>

                {/* Contact Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 pt-6 border-t border-gray-200"
                >
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center space-x-3">
                      <span>📞</span>
                      <a href={`tel:${t.phone}`} className="hover:text-green-600">
                        {t.phone}
                      </a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span>📧</span>
                      <a href="mailto:bottamedipierluigi@virgilio.it" className="hover:text-green-600">
                        bottamedipierluigi@virgilio.it
                      </a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span>📍</span>
                      <span>Via Cavalleggeri Udine, Mezzolombardo</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navigation */}
      <div className="h-20" />
    </>
  )
}

export default Navigation