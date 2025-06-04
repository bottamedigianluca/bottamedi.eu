import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

interface MobileDockProps {
  language: 'it' | 'de'
}

const translations = {
  it: {
    menu: 'Menu',
    call: 'Chiama',
    directions: 'Mappa',
    whatsapp: 'WhatsApp',
    close: 'Chiudi',
    sections: [
      { id: 'about', label: 'Storia', icon: '🌱' },
      { id: 'dettaglio', label: 'Banchetto', icon: '🛒' },
      { id: 'services', label: 'Servizi', icon: '🚛' },
      { id: 'products', label: 'Prodotti', icon: '🍎' },
      { id: 'wholesale', label: 'Listino', icon: '📋' },
      { id: 'contact', label: 'Contatti', icon: '📞' }
    ],
    contacts: {
      banchetto: 'Banchetto',
      ingrosso: 'Ingrosso',
      banchettoPhone: '351 577 6198',
      ingrossoPhone: '0461 602534',
      banchettoAddress: 'Via Cavalleggeri Udine',
      ingrossoAddress: 'Via de Gasperi, 47'
    }
  },
  de: {
    menu: 'Menü',
    call: 'Anrufen',
    directions: 'Karte',
    whatsapp: 'WhatsApp',
    close: 'Schließen',
    sections: [
      { id: 'about', label: 'Geschichte', icon: '🌱' },
      { id: 'dettaglio', label: 'Marktstand', icon: '🛒' },
      { id: 'services', label: 'Service', icon: '🚛' },
      { id: 'products', label: 'Produkte', icon: '🍎' },
      { id: 'wholesale', label: 'Preisliste', icon: '📋' },
      { id: 'contact', label: 'Kontakt', icon: '📞' }
    ],
    contacts: {
      banchetto: 'Marktstand',
      ingrosso: 'Großhandel',
      banchettoPhone: '351 577 6198',
      ingrossoPhone: '0461 602534',
      banchettoAddress: 'Via Cavalleggeri Udine',
      ingrossoAddress: 'Via de Gasperi, 47'
    }
  }
}

// 🎯 Hook ottimizzato per rilevare posizione
const useScrollDetection = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [currentSection, setCurrentSection] = useState('hero')

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    
    const detectSection = () => {
      const sections = ['hero', 'about', 'dettaglio', 'services', 'products', 'wholesale', 'contact']
      const scrollPosition = window.scrollY + window.innerHeight / 2

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setCurrentSection(sectionId)
            // Mostra solo se NON siamo nella hero e NON nel footer
            const isInHero = sectionId === 'hero'
            const isNearFooter = window.scrollY + window.innerHeight > document.body.scrollHeight - 100
            setIsVisible(!isInHero && !isNearFooter)
            break
          }
        }
      }
    }

    const handleScroll = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(detectSection, 10)
    }

    detectSection()
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timeoutId)
    }
  }, [])

  return { isVisible, currentSection }
}

// 🏆 COMPONENTE PREMIUM DOCK ULTRA-WIDE
const PremiumMobileDock: React.FC<MobileDockProps> = ({ language }) => {
  const [activeMenu, setActiveMenu] = useState<'none' | 'menu' | 'call' | 'directions'>('none')
  const [isMobile, setIsMobile] = useState(false)
  const { isVisible, currentSection } = useScrollDetection()
  const shouldReduceMotion = useReducedMotion()
  const t = translations[language]

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (!mobile) setActiveMenu('none')
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile, { passive: true })
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Scroll to section
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 80
      const elementPosition = element.offsetTop - offset
      window.scrollTo({
        top: Math.max(0, elementPosition),
        behavior: 'smooth'
      })
      setActiveMenu('none')
    }
  }, [])

  // Handle calls
  const handleCall = useCallback((phone: string) => {
    window.open(`tel:${phone.replace(/\s/g, '')}`, '_self')
    setActiveMenu('none')
  }, [])

  // Handle WhatsApp
  const handleWhatsApp = useCallback(() => {
    const message = encodeURIComponent(
      language === 'it' 
        ? 'Ciao! Sono interessato ai vostri prodotti.' 
        : 'Hallo! Ich interessiere mich für Ihre Produkte.'
    )
    window.open(`https://wa.me/393515776198?text=${message}`, '_blank')
    setActiveMenu('none')
  }, [language])

  // Handle directions
  const handleDirections = useCallback((type: 'banchetto' | 'ingrosso') => {
    const urls = {
      banchetto: 'https://www.google.com/maps/search/?api=1&query=Banchetto+Frutta+e+Verdura+Bottamedi+Via+Cavalleggeri+Udine+Mezzolombardo+TN',
      ingrosso: 'https://maps.app.goo.gl/TFV4cgnEvcFjBHfD6'
    }
    window.open(urls[type], '_blank')
    setActiveMenu('none')
  }, [])

  // Toggle menu con reset dello stato attivo
  const toggleMenu = useCallback((menu: 'menu' | 'call' | 'directions') => {
    setActiveMenu(prev => {
      const newState = prev === menu ? 'none' : menu
      // Reset focus dopo il cambio stato
      setTimeout(() => {
        if (document.activeElement && document.activeElement instanceof HTMLElement) {
          document.activeElement.blur()
        }
      }, 100)
      return newState
    })
  }, [])

  // Close all menus
  const closeAllMenus = useCallback(() => {
    setActiveMenu('none')
    // Reset focus
    if (document.activeElement && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }, [])

  // Memoized variants
  const variants = useMemo(() => ({
    dock: {
      hidden: { y: 100, opacity: 0, scale: 0.95 },
      visible: { 
        y: 0, 
        opacity: 1, 
        scale: 1,
        transition: {
          type: 'spring',
          damping: 30,
          stiffness: 400,
          duration: shouldReduceMotion ? 0.1 : undefined
        }
      }
    },
    popup: {
      hidden: { y: 20, opacity: 0, scale: 0.95 },
      visible: { 
        y: 0, 
        opacity: 1, 
        scale: 1,
        transition: {
          type: 'spring',
          damping: 25,
          stiffness: 500,
          duration: shouldReduceMotion ? 0.1 : undefined
        }
      }
    },
    button: {
      idle: { scale: 1, y: 0 },
      hover: { scale: 1.05, y: -2 },
      tap: { scale: 0.95, y: 0 }
    }
  }), [shouldReduceMotion])

  // Non renderizzare su desktop o quando non visibile
  if (!isMobile || !isVisible) return null

  return (
    <>
      {/* 🌫️ BACKDROP ELEGANTE */}
      <AnimatePresence>
        {activeMenu !== 'none' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9997]"
            onClick={closeAllMenus}
          />
        )}
      </AnimatePresence>

      {/* 📱 MENU SECTIONS POPUP */}
      <AnimatePresence>
        {activeMenu === 'menu' && (
          <motion.div
            variants={variants.popup}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed bottom-20 left-3 right-3 z-[9999]"
          >
            <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
              {/* Header elegante */}
              <div className="px-6 py-4 border-b border-gray-100/50 flex items-center justify-between bg-gradient-to-r from-gray-50/50 to-transparent">
                <span className="text-base font-bold text-gray-900">{t.menu}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeAllMenus}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100/80 text-gray-600 text-sm hover:bg-gray-200/80 transition-colors"
                >
                  ✕
                </motion.button>
              </div>

              {/* Grid sezioni */}
              <div className="p-4 grid grid-cols-3 gap-3">
                {t.sections.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: shouldReduceMotion ? 0 : index * 0.03, duration: shouldReduceMotion ? 0.1 : 0.3 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => scrollToSection(item.id)}
                    onBlur={() => {}} // Reset focus
                    className={`
                      flex flex-col items-center p-4 rounded-2xl transition-all duration-300 text-center
                      focus:outline-none focus:ring-0
                      ${currentSection === item.id 
                        ? 'bg-gradient-to-b from-green-50 to-green-100 text-green-700 shadow-lg border border-green-200' 
                        : 'hover:bg-gray-50 text-gray-700 hover:shadow-md'
                      }
                    `}
                  >
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <span className="text-sm font-semibold leading-tight">{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📞 CALL POPUP */}
      <AnimatePresence>
        {activeMenu === 'call' && (
          <motion.div
            variants={variants.popup}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed bottom-20 left-3 right-3 z-[9999]"
          >
            <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100/50 flex items-center justify-between bg-gradient-to-r from-blue-50/50 to-transparent">
                <span className="text-base font-bold text-gray-900">{t.call}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeAllMenus}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100/80 text-gray-600 text-sm hover:bg-gray-200/80 transition-colors"
                >
                  ✕
                </motion.button>
              </div>

              <div className="p-4 space-y-3">
                {/* Banchetto */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-4 border border-green-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-lg shadow-lg">🛒</div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{t.contacts.banchetto}</h4>
                        <p className="text-sm text-gray-600">{t.contacts.banchettoAddress}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCall(t.contacts.banchettoPhone)}
                      onBlur={() => {}}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 shadow-lg focus:outline-none focus:ring-0"
                    >
                      <span>📞</span>
                      <span>{t.contacts.banchettoPhone}</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleWhatsApp}
                      onBlur={() => {}}
                      className="bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-xl text-sm font-bold shadow-lg focus:outline-none focus:ring-0"
                    >
                      💬
                    </motion.button>
                  </div>
                </motion.div>

                {/* Ingrosso */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-lg shadow-lg">🚛</div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{t.contacts.ingrosso}</h4>
                        <p className="text-sm text-gray-600">{t.contacts.ingrossoAddress}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCall(t.contacts.ingrossoPhone)}
                      onBlur={() => {}}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 shadow-lg focus:outline-none focus:ring-0"
                    >
                      <span>📞</span>
                      <span>{t.contacts.ingrossoPhone}</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleWhatsApp}
                      onBlur={() => {}}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl text-sm font-bold shadow-lg focus:outline-none focus:ring-0"
                    >
                      💬
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🗺️ DIRECTIONS POPUP */}
      <AnimatePresence>
        {activeMenu === 'directions' && (
          <motion.div
            variants={variants.popup}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed bottom-20 left-3 right-3 z-[9999]"
          >
            <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100/50 flex items-center justify-between bg-gradient-to-r from-purple-50/50 to-transparent">
                <span className="text-base font-bold text-gray-900">{t.directions}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeAllMenus}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100/80 text-gray-600 text-sm hover:bg-gray-200/80 transition-colors"
                >
                  ✕
                </motion.button>
              </div>

              <div className="p-4 space-y-3">
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDirections('banchetto')}
                  onBlur={() => {}}
                  className="w-full bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-2xl p-4 border border-green-200 transition-all text-left focus:outline-none focus:ring-0"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg">🛒</div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900">{t.contacts.banchetto}</h4>
                      <p className="text-sm text-gray-600">{t.contacts.banchettoAddress}</p>
                      <p className="text-sm text-green-600 font-bold">Mezzolombardo (TN)</p>
                    </div>
                    <div className="text-green-500 text-xl">📍</div>
                  </div>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDirections('ingrosso')}
                  onBlur={() => {}}
                  className="w-full bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-2xl p-4 border border-blue-200 transition-all text-left focus:outline-none focus:ring-0"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg">🚛</div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900">{t.contacts.ingrosso}</h4>
                      <p className="text-sm text-gray-600">{t.contacts.ingrossoAddress}</p>
                      <p className="text-sm text-blue-600 font-bold">Mezzolombardo (TN)</p>
                    </div>
                    <div className="text-blue-500 text-xl">📍</div>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🏠 DOCK PRINCIPALE ULTRA-WIDE PREMIUM */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            variants={variants.dock}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[9999] pointer-events-none"
          >
            <div className="pointer-events-auto">
              {/* Dock Ultra-Wide Premium */}
              <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 px-6 py-3">
                <div className="flex items-center justify-center space-x-6">
                  
                  {/* MENU BUTTON */}
                  <motion.button
                    variants={variants.button}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => toggleMenu('menu')}
                    onBlur={() => {}}
                    className={`
                      flex flex-col items-center justify-center
                      w-16 h-16 rounded-2xl transition-all duration-300
                      focus:outline-none focus:ring-0
                      ${activeMenu === 'menu'
                        ? 'bg-gradient-to-b from-gray-800 to-gray-900 text-white shadow-xl scale-105' 
                        : 'bg-transparent text-gray-700 hover:bg-gray-100/80'
                      }
                    `}
                  >
                    <motion.div
                      animate={activeMenu === 'menu' ? { rotate: 90 } : { rotate: 0 }}
                      transition={{ duration: shouldReduceMotion ? 0.1 : 0.3 }}
                      className="text-xl font-bold"
                    >
                      ☰
                    </motion.div>
                    <span className="text-xs font-semibold mt-1">{t.menu}</span>
                  </motion.button>

                  {/* CALL BUTTON */}
                  <motion.button
                    variants={variants.button}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => toggleMenu('call')}
                    onBlur={() => {}}
                    className={`
                      flex flex-col items-center justify-center
                      w-16 h-16 rounded-2xl transition-all duration-300
                      focus:outline-none focus:ring-0
                      ${activeMenu === 'call'
                        ? 'bg-gradient-to-b from-green-500 to-green-600 text-white shadow-xl scale-105' 
                        : 'bg-transparent text-gray-700 hover:bg-gray-100/80'
                      }
                    `}
                  >
                    <motion.div
                      animate={activeMenu === 'call' ? { scale: 1.2, rotate: 5 } : { scale: 1, rotate: 0 }}
                      transition={{ duration: shouldReduceMotion ? 0.1 : 0.3 }}
                      className="text-xl"
                    >
                      📞
                    </motion.div>
                    <span className="text-xs font-semibold mt-1">{t.call}</span>
                  </motion.button>

                  {/* DIRECTIONS BUTTON */}
                  <motion.button
                    variants={variants.button}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => toggleMenu('directions')}
                    onBlur={() => {}}
                    className={`
                      flex flex-col items-center justify-center
                      w-16 h-16 rounded-2xl transition-all duration-300
                      focus:outline-none focus:ring-0
                      ${activeMenu === 'directions'
                        ? 'bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-xl scale-105' 
                        : 'bg-transparent text-gray-700 hover:bg-gray-100/80'
                      }
                    `}
                  >
                    <motion.div
                      animate={activeMenu === 'directions' ? { scale: 1.2, rotate: -5 } : { scale: 1, rotate: 0 }}
                      transition={{ duration: shouldReduceMotion ? 0.1 : 0.3 }}
                      className="text-xl"
                    >
                      🗺️
                    </motion.div>
                    <span className="text-xs font-semibold mt-1">{t.directions}</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default PremiumMobileDock
