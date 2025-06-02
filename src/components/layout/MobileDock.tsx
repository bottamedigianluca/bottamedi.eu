import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MobileDockProps {
  language: 'it' | 'de'
}

const translations = {
  it: {
    // Menu principale
    menu: 'Menu',
    menuTitle: 'Naviga',
    sections: [
      { id: 'hero', label: 'Home', icon: '🏠', section: 'hero' },
      { id: 'about', label: 'La Nostra Storia', icon: '🌱', section: 'about' },
      { id: 'dettaglio', label: 'Al Banchetto', icon: '🛒', section: 'dettaglio' },
      { id: 'services', label: 'Servizi', icon: '🚛', section: 'services' },
      { id: 'products', label: 'Prodotti', icon: '🍎', section: 'products' },
      { id: 'wholesale', label: 'Listino HORECA', icon: '📋', section: 'wholesale' },
      { id: 'contact', label: 'Contatti', icon: '📞', section: 'contact' }
    ],
    
    // Chiamate
    call: 'Chiama',
    callTitle: 'Contattaci',
    banchetto: 'Banchetto',
    banchettoDesc: 'Dettaglio • Via Cavalleggeri Udine',
    banchettoPhone: '351 577 6198',
    ingrosso: 'Ingrosso',
    ingrossoDesc: 'HORECA • Via de Gasperi 47',
    ingrossoPhone: '0461 602534',
    whatsapp: 'WhatsApp',
    
    // Indicazioni
    directions: 'Mappe',
    directionsTitle: 'Indicazioni Stradali',
    getBanchetto: 'Vai al Banchetto',
    getIngrosso: 'Vai all\'Ingrosso'
  },
  de: {
    // Menu principale  
    menu: 'Menü',
    menuTitle: 'Navigation',
    sections: [
      { id: 'hero', label: 'Startseite', icon: '🏠', section: 'hero' },
      { id: 'about', label: 'Unsere Geschichte', icon: '🌱', section: 'about' },
      { id: 'dettaglio', label: 'Marktstand', icon: '🛒', section: 'dettaglio' },
      { id: 'services', label: 'Dienstleistungen', icon: '🚛', section: 'services' },
      { id: 'products', label: 'Produkte', icon: '🍎', section: 'products' },
      { id: 'wholesale', label: 'HORECA Preisliste', icon: '📋', section: 'wholesale' },
      { id: 'contact', label: 'Kontakt', icon: '📞', section: 'contact' }
    ],
    
    // Chiamate
    call: 'Anrufen',
    callTitle: 'Kontakt',
    banchetto: 'Marktstand',
    banchettoDesc: 'Einzelhandel • Via Cavalleggeri Udine',
    banchettoPhone: '351 577 6198',
    ingrosso: 'Großhandel',
    ingrossoDesc: 'HORECA • Via de Gasperi 47',
    ingrossoPhone: '0461 602534',
    whatsapp: 'WhatsApp',
    
    // Indicazioni
    directions: 'Karten',
    directionsTitle: 'Wegbeschreibung',
    getBanchetto: 'Zum Marktstand',
    getIngrosso: 'Zum Großhandel'
  }
}

const MobileDock: React.FC<MobileDockProps> = ({ language }) => {
  const [isVisible, setIsVisible] = useState(true)
  const [activeMenu, setActiveMenu] = useState<'none' | 'menu' | 'call' | 'directions'>('none')
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  
  const t = translations[language]

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto-hide intelligente
  useEffect(() => {
    if (!isMobile) return

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY + 150 && currentScrollY > 400) {
        setIsVisible(false)
        setActiveMenu('none')
      } else if (currentScrollY < lastScrollY - 100) {
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    const throttledScroll = throttle(handleScroll, 100)
    window.addEventListener('scroll', throttledScroll, { passive: true })
    
    return () => window.removeEventListener('scroll', throttledScroll)
  }, [lastScrollY, isMobile])

  const throttle = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout | null = null
    let lastExecTime = 0
    return (...args: any[]) => {
      const currentTime = Date.now()
      
      if (currentTime - lastExecTime > delay) {
        func(...args)
        lastExecTime = currentTime
      } else {
        if (timeoutId) clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          func(...args)
          lastExecTime = Date.now()
        }, delay - (currentTime - lastExecTime))
      }
    }
  }

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
      hapticFeedback()
    }
  }, [])

  const hapticFeedback = useCallback(() => {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(25)
      } catch (e) {
        console.log('Haptic non disponibile')
      }
    }
  }, [])

  const handleCall = useCallback((phone: string) => {
    window.open(`tel:${phone.replace(/\s/g, '')}`, '_self')
    setActiveMenu('none')
    hapticFeedback()
  }, [hapticFeedback])

  const handleWhatsApp = useCallback((type: 'banchetto' | 'ingrosso') => {
    const messages = {
      banchetto: `Ciao! Sono interessato ai vostri prodotti al banchetto`,
      ingrosso: `Buongiorno, vorrei informazioni sui servizi HORECA`
    }
    
    const message = encodeURIComponent(messages[type])
    window.open(`https://wa.me/393515776198?text=${message}`, '_blank')
    setActiveMenu('none')
    hapticFeedback()
  }, [hapticFeedback])

  const handleDirections = useCallback((type: 'banchetto' | 'ingrosso') => {
    const urls = {
      banchetto: 'https://www.google.com/maps/search/?api=1&query=Banchetto+Frutta+e+Verdura+Bottamedi+Via+Cavalleggeri+Udine+Mezzolombardo+TN',
      ingrosso: 'https://maps.app.goo.gl/TFV4cgnEvcFjBHfD6'
    }
    
    window.open(urls[type], '_blank')
    setActiveMenu('none')
    hapticFeedback()
  }, [hapticFeedback])

  const toggleMenu = useCallback((menu: 'menu' | 'call' | 'directions') => {
    setActiveMenu(prev => prev === menu ? 'none' : menu)
    hapticFeedback()
  }, [hapticFeedback])

  if (!isMobile) return null

  return (
    <>
      {/* 🌫️ BACKDROP APPLE-STYLE */}
      <AnimatePresence>
        {activeMenu !== 'none' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-md z-[9998]"
            onClick={() => setActiveMenu('none')}
          />
        )}
      </AnimatePresence>

      {/* 📱 MENU SECTIONS POPUP */}
      <AnimatePresence>
        {activeMenu === 'menu' && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className="fixed bottom-24 left-4 right-4 z-[9999]"
          >
            <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">{t.menuTitle}</h3>
                  <button
                    onClick={() => setActiveMenu('none')}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100/80 text-gray-600 hover:bg-gray-200/80 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Sections Grid */}
              <div className="p-4 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-2">
                  {t.sections.map((item, index) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => scrollToSection(item.section)}
                      className="flex flex-col items-center p-4 rounded-2xl bg-gray-50/80 hover:bg-gray-100/80 active:bg-gray-200/80 transition-all duration-200"
                    >
                      <div className="text-2xl mb-2">{item.icon}</div>
                      <span className="text-sm font-medium text-gray-900 text-center leading-tight">
                        {item.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📞 CALL POPUP */}
      <AnimatePresence>
        {activeMenu === 'call' && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className="fixed bottom-24 left-4 right-4 z-[9999]"
          >
            <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">{t.callTitle}</h3>
                  <button
                    onClick={() => setActiveMenu('none')}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100/80 text-gray-600 hover:bg-gray-200/80 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Call Options */}
              <div className="p-4 space-y-3">
                
                {/* Banchetto */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100/50">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-lg">🛒</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{t.banchetto}</h4>
                      <p className="text-sm text-gray-600">{t.banchettoDesc}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCall(t.banchettoPhone)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center space-x-2 shadow-md"
                    >
                      <span>📞</span>
                      <span>{t.banchettoPhone}</span>
                    </motion.button>
                    
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleWhatsApp('banchetto')}
                      className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-medium text-sm shadow-md"
                    >
                      💬
                    </motion.button>
                  </div>
                </div>

                {/* Ingrosso */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100/50">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-lg">🚛</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{t.ingrosso}</h4>
                      <p className="text-sm text-gray-600">{t.ingrossoDesc}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCall(t.ingrossoPhone)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center space-x-2 shadow-md"
                    >
                      <span>📞</span>
                      <span>{t.ingrossoPhone}</span>
                    </motion.button>
                    
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleWhatsApp('ingrosso')}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium text-sm shadow-md"
                    >
                      💬
                    </motion.button>
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
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className="fixed bottom-24 left-4 right-4 z-[9999]"
          >
            <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">{t.directionsTitle}</h3>
                  <button
                    onClick={() => setActiveMenu('none')}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100/80 text-gray-600 hover:bg-gray-200/80 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Directions Options */}
              <div className="p-4 space-y-3">
                
                {/* Banchetto */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDirections('banchetto')}
                  className="w-full bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-2xl p-4 border border-green-100/50 transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-xl">🛒</span>
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-semibold text-gray-900 mb-1">{t.getBanchetto}</h4>
                      <p className="text-sm text-gray-600">Via Cavalleggeri Udine</p>
                      <p className="text-xs text-green-600 font-medium">Mezzolombardo (TN)</p>
                    </div>
                    <div className="text-gray-400 text-xl">📍</div>
                  </div>
                </motion.button>

                {/* Ingrosso */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDirections('ingrosso')}
                  className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-2xl p-4 border border-blue-100/50 transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-xl">🚛</span>
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-semibold text-gray-900 mb-1">{t.getIngrosso}</h4>
                      <p className="text-sm text-gray-600">Via Alcide de Gasperi, 47</p>
                      <p className="text-xs text-blue-600 font-medium">Mezzolombardo (TN)</p>
                    </div>
                    <div className="text-gray-400 text-xl">📍</div>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🏠 MAIN DOCK - APPLE PREMIUM STYLE */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[9999] pointer-events-none"
          >
            {/* Apple-style background con blur e gradient */}
            <div className="relative">
              {/* Gradient glow effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/60 to-transparent backdrop-blur-xl" />
              
              {/* Main container */}
              <div className="relative px-6 py-4 pointer-events-auto">
                
                {/* Dock container premium */}
                <div className="mx-auto max-w-sm">
                  <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 p-2">
                    
                    {/* 3 Tasti Apple Style */}
                    <div className="flex items-center justify-around">
                      
                      {/* 📱 MENU TASTO */}
                      <motion.button
                        onClick={() => toggleMenu('menu')}
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.05 }}
                        className={`
                          flex flex-col items-center justify-center
                          w-16 h-16 rounded-2xl transition-all duration-300
                          ${activeMenu === 'menu'
                            ? 'bg-gray-900 text-white shadow-lg' 
                            : 'bg-gray-100/80 text-gray-700 hover:bg-gray-200/80'
                          }
                        `}
                      >
                        <motion.div
                          animate={activeMenu === 'menu' ? { rotate: 90 } : { rotate: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-xl mb-1"
                        >
                          ☰
                        </motion.div>
                        <span className="text-xs font-medium">{t.menu}</span>
                      </motion.button>

                      {/* 📞 CALL TASTO */}
                      <motion.button
                        onClick={() => toggleMenu('call')}
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.05 }}
                        className={`
                          flex flex-col items-center justify-center
                          w-16 h-16 rounded-2xl transition-all duration-300
                          ${activeMenu === 'call'
                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/25' 
                            : 'bg-gray-100/80 text-gray-700 hover:bg-gray-200/80'
                          }
                        `}
                      >
                        <motion.div
                          animate={activeMenu === 'call' ? { scale: 1.1, rotate: 15 } : { scale: 1, rotate: 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-xl mb-1"
                        >
                          📞
                        </motion.div>
                        <span className="text-xs font-medium">{t.call}</span>
                      </motion.button>

                      {/* 🗺️ DIRECTIONS TASTO */}
                      <motion.button
                        onClick={() => toggleMenu('directions')}
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.05 }}
                        className={`
                          flex flex-col items-center justify-center
                          w-16 h-16 rounded-2xl transition-all duration-300
                          ${activeMenu === 'directions'
                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                            : 'bg-gray-100/80 text-gray-700 hover:bg-gray-200/80'
                          }
                        `}
                      >
                        <motion.div
                          animate={activeMenu === 'directions' ? { scale: 1.1 } : { scale: 1 }}
                          transition={{ duration: 0.2 }}
                          className="text-xl mb-1"
                        >
                          🗺️
                        </motion.div>
                        <span className="text-xs font-medium">{t.directions}</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
                
                {/* Home indicator iPhone style */}
                <div className="flex justify-center mt-2">
                  <div className="w-32 h-1 bg-gray-300/60 rounded-full" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default MobileDock
