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
      ingrossoPhone: '0461 602534'
    }
  },
  de: {
    menu: 'Menü',
    call: 'Anrufen',
    directions: 'Karte',
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
      ingrossoPhone: '0461 602534'
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
            // Mostra solo se NON siamo nella hero
            setIsVisible(sectionId !== 'hero')
            break
          }
        }
      }
    }

    const handleScroll = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(detectSection, 10) // Throttle ridotto
    }

    detectSection() // Check iniziale
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timeoutId)
    }
  }, [])

  return { isVisible, currentSection }
}

// 🏆 COMPONENTE PRINCIPALE PREMIUM
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
      if (!mobile) setActiveMenu('none') // Chiudi menu su desktop
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
    const message = encodeURIComponent('Ciao! Sono interessato ai vostri prodotti.')
    window.open(`https://wa.me/393515776198?text=${message}`, '_blank')
    setActiveMenu('none')
  }, [])

  // Handle directions
  const handleDirections = useCallback((type: 'banchetto' | 'ingrosso') => {
    const urls = {
      banchetto: 'https://www.google.com/maps/search/?api=1&query=Banchetto+Frutta+e+Verdura+Bottamedi+Via+Cavalleggeri+Udine+Mezzolombardo+TN',
      ingrosso: 'https://maps.app.goo.gl/TFV4cgnEvcFjBHfD6'
    }
    window.open(urls[type], '_blank')
    setActiveMenu('none')
  }, [])

  // Toggle menu
  const toggleMenu = useCallback((menu: 'menu' | 'call' | 'directions') => {
    setActiveMenu(prev => prev === menu ? 'none' : menu)
  }, [])

  // Memoized variants
  const variants = useMemo(() => ({
    dock: {
      hidden: { y: 100, opacity: 0, scale: 0.9 },
      visible: { 
        y: 0, 
        opacity: 1, 
        scale: 1,
        transition: {
          type: 'spring',
          damping: 25,
          stiffness: 400,
          duration: shouldReduceMotion ? 0.1 : undefined
        }
      }
    },
    popup: {
      hidden: { y: 50, opacity: 0, scale: 0.95 },
      visible: { 
        y: 0, 
        opacity: 1, 
        scale: 1,
        transition: {
          type: 'spring',
          damping: 30,
          stiffness: 500,
          duration: shouldReduceMotion ? 0.1 : undefined
        }
      }
    }
  }), [shouldReduceMotion])

  // Non renderizzare su desktop o quando non visibile
  if (!isMobile || !isVisible) return null

  return (
    <>
      {/* 🌫️ BACKDROP MINIMAL */}
      <AnimatePresence>
        {activeMenu !== 'none' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.15 }}
            className="fixed inset-0 bg-black/10 backdrop-blur-sm z-[9997]"
            onClick={() => setActiveMenu('none')}
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
            className="fixed bottom-16 left-2 right-2 z-[9999]"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 overflow-hidden max-w-sm mx-auto">
              {/* Header minimo */}
              <div className="px-4 py-2 border-b border-gray-100/50 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">{t.menu}</span>
                <button
                  onClick={() => setActiveMenu('none')}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Grid compatto */}
              <div className="p-3 grid grid-cols-3 gap-2">
                {t.sections.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: shouldReduceMotion ? 0 : index * 0.02, duration: shouldReduceMotion ? 0.1 : 0.2 }}
                    onClick={() => scrollToSection(item.id)}
                    className={`
                      flex flex-col items-center p-2 rounded-lg transition-colors text-center
                      ${currentSection === item.id 
                        ? 'bg-green-50 text-green-600' 
                        : 'hover:bg-gray-50 text-gray-700'
                      }
                    `}
                  >
                    <div className="text-lg mb-1">{item.icon}</div>
                    <span className="text-xs font-medium leading-tight">{item.label}</span>
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
            className="fixed bottom-16 left-2 right-2 z-[9999]"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 overflow-hidden max-w-sm mx-auto">
              <div className="px-4 py-2 border-b border-gray-100/50 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">{t.call}</span>
                <button
                  onClick={() => setActiveMenu('none')}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="p-3 space-y-2">
                {/* Banchetto */}
                <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white text-sm">🛒</div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">{t.contacts.banchetto}</h4>
                        <p className="text-xs text-gray-600">Via Cavalleggeri Udine</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleCall(t.contacts.banchettoPhone)}
                      className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center space-x-1"
                    >
                      <span>📞</span>
                      <span>{t.contacts.banchettoPhone}</span>
                    </button>
                    <button
                      onClick={handleWhatsApp}
                      className="bg-green-600 text-white py-2 px-3 rounded-lg text-xs font-medium"
                    >
                      💬
                    </button>
                  </div>
                </div>

                {/* Ingrosso */}
                <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm">🚛</div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">{t.contacts.ingrosso}</h4>
                        <p className="text-xs text-gray-600">Via de Gasperi, 47</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleCall(t.contacts.ingrossoPhone)}
                      className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center space-x-1"
                    >
                      <span>📞</span>
                      <span>{t.contacts.ingrossoPhone}</span>
                    </button>
                    <button
                      onClick={handleWhatsApp}
                      className="bg-blue-600 text-white py-2 px-3 rounded-lg text-xs font-medium"
                    >
                      💬
                    </button>
                  </div>
                </div>
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
            className="fixed bottom-16 left-2 right-2 z-[9999]"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 overflow-hidden max-w-sm mx-auto">
              <div className="px-4 py-2 border-b border-gray-100/50 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">{t.directions}</span>
                <button
                  onClick={() => setActiveMenu('none')}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="p-3 space-y-2">
                <button
                  onClick={() => handleDirections('banchetto')}
                  className="w-full bg-green-50 hover:bg-green-100 rounded-xl p-3 border border-green-100 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white">🛒</div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900">{t.contacts.banchetto}</h4>
                      <p className="text-xs text-gray-600">Via Cavalleggeri Udine</p>
                      <p className="text-xs text-green-600 font-medium">Mezzolombardo (TN)</p>
                    </div>
                    <div className="text-gray-400">📍</div>
                  </div>
                </button>

                <button
                  onClick={() => handleDirections('ingrosso')}
                  className="w-full bg-blue-50 hover:bg-blue-100 rounded-xl p-3 border border-blue-100 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white">🚛</div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900">{t.contacts.ingrosso}</h4>
                      <p className="text-xs text-gray-600">Via de Gasperi, 47</p>
                      <p className="text-xs text-blue-600 font-medium">Mezzolombardo (TN)</p>
                    </div>
                    <div className="text-gray-400">📍</div>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🏠 DOCK PRINCIPALE PREMIUM */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            variants={variants.dock}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-[9999] pointer-events-none"
          >
            <div className="pointer-events-auto">
              {/* Dock sottile e premium */}
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 px-3 py-2">
                <div className="flex items-center space-x-1">
                  
                  {/* MENU */}
                  <button
                    onClick={() => toggleMenu('menu')}
                    className={`
                      flex flex-col items-center justify-center
                      w-12 h-12 rounded-xl transition-all duration-200
                      ${activeMenu === 'menu'
                        ? 'bg-gray-900 text-white scale-105' 
                        : 'bg-transparent text-gray-700 hover:bg-gray-100 active:scale-95'
                      }
                    `}
                  >
                    <motion.div
                      animate={activeMenu === 'menu' ? { rotate: 90 } : { rotate: 0 }}
                      transition={{ duration: shouldReduceMotion ? 0.1 : 0.2 }}
                      className="text-base"
                    >
                      ☰
                    </motion.div>
                  </button>

                  {/* CALL */}
                  <button
                    onClick={() => toggleMenu('call')}
                    className={`
                      flex flex-col items-center justify-center
                      w-12 h-12 rounded-xl transition-all duration-200
                      ${activeMenu === 'call'
                        ? 'bg-green-500 text-white scale-105' 
                        : 'bg-transparent text-gray-700 hover:bg-gray-100 active:scale-95'
                      }
                    `}
                  >
                    <motion.div
                      animate={activeMenu === 'call' ? { scale: 1.1 } : { scale: 1 }}
                      transition={{ duration: shouldReduceMotion ? 0.1 : 0.15 }}
                      className="text-base"
                    >
                      📞
                    </motion.div>
                  </button>

                  {/* DIRECTIONS */}
                  <button
                    onClick={() => toggleMenu('directions')}
                    className={`
                      flex flex-col items-center justify-center
                      w-12 h-12 rounded-xl transition-all duration-200
                      ${activeMenu === 'directions'
                        ? 'bg-blue-500 text-white scale-105' 
                        : 'bg-transparent text-gray-700 hover:bg-gray-100 active:scale-95'
                      }
                    `}
                  >
                    <motion.div
                      animate={activeMenu === 'directions' ? { scale: 1.1 } : { scale: 1 }}
                      transition={{ duration: shouldReduceMotion ? 0.1 : 0.15 }}
                      className="text-base"
                    >
                      🗺️
                    </motion.div>
                  </button>
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
