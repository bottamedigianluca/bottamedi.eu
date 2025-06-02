import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MobileDockProps {
  language: 'it' | 'de'
}

const translations = {
  it: {
    menu: 'Menu',
    menuTitle: 'Naviga',
    sections: [
      { id: 'about', label: 'La Nostra Storia', icon: '🌱', section: 'about' },
      { id: 'dettaglio', label: 'Al Banchetto', icon: '🛒', section: 'dettaglio' },
      { id: 'services', label: 'Servizi', icon: '🚛', section: 'services' },
      { id: 'products', label: 'Prodotti', icon: '🍎', section: 'products' },
      { id: 'wholesale', label: 'Listino HORECA', icon: '📋', section: 'wholesale' },
      { id: 'contact', label: 'Contatti', icon: '📞', section: 'contact' }
    ],
    call: 'Chiama',
    callTitle: 'Contattaci',
    banchetto: 'Banchetto',
    banchettoDesc: 'Dettaglio • Via Cavalleggeri Udine',
    banchettoPhone: '351 577 6198',
    ingrosso: 'Ingrosso',
    ingrossoDesc: 'HORECA • Via de Gasperi 47',
    ingrossoPhone: '0461 602534',
    directions: 'Mappe',
    directionsTitle: 'Indicazioni Stradali',
    getBanchetto: 'Vai al Banchetto',
    getIngrosso: 'Vai all\'Ingrosso'
  },
  de: {
    menu: 'Menü',
    menuTitle: 'Navigation',
    sections: [
      { id: 'about', label: 'Unsere Geschichte', icon: '🌱', section: 'about' },
      { id: 'dettaglio', label: 'Marktstand', icon: '🛒', section: 'dettaglio' },
      { id: 'services', label: 'Dienstleistungen', icon: '🚛', section: 'services' },
      { id: 'products', label: 'Produkte', icon: '🍎', section: 'products' },
      { id: 'wholesale', label: 'HORECA Preisliste', icon: '📋', section: 'wholesale' },
      { id: 'contact', label: 'Kontakt', icon: '📞', section: 'contact' }
    ],
    call: 'Anrufen',
    callTitle: 'Kontakt',
    banchetto: 'Marktstand',
    banchettoDesc: 'Einzelhandel • Via Cavalleggeri Udine',
    banchettoPhone: '351 577 6198',
    ingrosso: 'Großhandel',
    ingrossoDesc: 'HORECA • Via de Gasperi 47',
    ingrossoPhone: '0461 602534',
    directions: 'Karten',
    directionsTitle: 'Wegbeschreibung',
    getBanchetto: 'Zum Marktstand',
    getIngrosso: 'Zum Großhandel'
  }
}

const MobileDock: React.FC<MobileDockProps> = ({ language }) => {
  const [isVisible, setIsVisible] = useState(false) // Start hidden
  const [activeMenu, setActiveMenu] = useState<'none' | 'menu' | 'call' | 'directions'>('none')
  const [currentSection, setCurrentSection] = useState('hero')
  const [isMobile, setIsMobile] = useState(false)
  
  const t = translations[language]

  // 📱 Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 🎯 LOGIC: Rileva sezione corrente e mostra/nascondi dock
  useEffect(() => {
    if (!isMobile) return

    const detectCurrentSection = () => {
      const sections = ['hero', 'about', 'dettaglio', 'services', 'products', 'wholesale', 'contact']
      const scrollPosition = window.scrollY + window.innerHeight / 2

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setCurrentSection(sectionId)
            
            // 🚫 NASCONDI nella hero, MOSTRA nelle altre sezioni
            if (sectionId === 'hero') {
              setIsVisible(false)
              setActiveMenu('none') // Chiudi menu se aperti
            } else {
              setIsVisible(true)
            }
            break
          }
        }
      }
    }

    // Controlla immediatamente
    detectCurrentSection()

    // Throttled scroll listener
    let timeoutId: NodeJS.Timeout | null = null
    const handleScroll = () => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(detectCurrentSection, 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [isMobile])

  // 🎯 Scroll to section
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

  // 🎯 Haptic feedback
  const hapticFeedback = useCallback(() => {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(25)
      } catch (e) {
        console.log('Haptic non disponibile')
      }
    }
  }, [])

  // 📞 Handle call
  const handleCall = useCallback((phone: string) => {
    window.open(`tel:${phone.replace(/\s/g, '')}`, '_self')
    setActiveMenu('none')
    hapticFeedback()
  }, [hapticFeedback])

  // 💬 Handle WhatsApp
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

  // 🗺️ Handle directions
  const handleDirections = useCallback((type: 'banchetto' | 'ingrosso') => {
    const urls = {
      banchetto: 'https://www.google.com/maps/search/?api=1&query=Banchetto+Frutta+e+Verdura+Bottamedi+Via+Cavalleggeri+Udine+Mezzolombardo+TN',
      ingrosso: 'https://maps.app.goo.gl/TFV4cgnEvcFjBHfD6'
    }
    
    window.open(urls[type], '_blank')
    setActiveMenu('none')
    hapticFeedback()
  }, [hapticFeedback])

  // 🔄 Toggle menu
  const toggleMenu = useCallback((menu: 'menu' | 'call' | 'directions') => {
    setActiveMenu(prev => prev === menu ? 'none' : menu)
    hapticFeedback()
  }, [hapticFeedback])

  // 🚫 NON RENDERIZZARE SU DESKTOP
  if (!isMobile) return null

  return (
    <>
      {/* 🌫️ BACKDROP */}
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
            className="fixed bottom-20 left-3 right-3 z-[9999]"
          >
            <div className="bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
              {/* Header compatto */}
              <div className="px-4 py-3 border-b border-gray-100/50 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">{t.menuTitle}</h3>
                <button
                  onClick={() => setActiveMenu('none')}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Sections Grid compatta */}
              <div className="p-3">
                <div className="grid grid-cols-2 gap-2">
                  {t.sections.map((item, index) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => scrollToSection(item.section)}
                      className="flex flex-col items-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                    >
                      <div className="text-xl mb-1">{item.icon}</div>
                      <span className="text-xs font-medium text-gray-900 text-center leading-tight">
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
            className="fixed bottom-20 left-3 right-3 z-[9999]"
          >
            <div className="bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
              {/* Header compatto */}
              <div className="px-4 py-3 border-b border-gray-100/50 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">{t.callTitle}</h3>
                <button
                  onClick={() => setActiveMenu('none')}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Call Options compatte */}
              <div className="p-3 space-y-2">
                
                {/* Banchetto */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100/50">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                      <span className="text-white">🛒</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{t.banchetto}</h4>
                      <p className="text-xs text-gray-600">{t.banchettoDesc}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCall(t.banchettoPhone)}
                      className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center space-x-1"
                    >
                      <span>📞</span>
                      <span>{t.banchettoPhone}</span>
                    </motion.button>
                    
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleWhatsApp('banchetto')}
                      className="bg-green-600 text-white py-2 px-3 rounded-lg text-xs font-medium"
                    >
                      💬
                    </motion.button>
                  </div>
                </div>

                {/* Ingrosso */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100/50">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                      <span className="text-white">🚛</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{t.ingrosso}</h4>
                      <p className="text-xs text-gray-600">{t.ingrossoDesc}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCall(t.ingrossoPhone)}
                      className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center space-x-1"
                    >
                      <span>📞</span>
                      <span>{t.ingrossoPhone}</span>
                    </motion.button>
                    
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleWhatsApp('ingrosso')}
                      className="bg-blue-600 text-white py-2 px-3 rounded-lg text-xs font-medium"
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
            className="fixed bottom-20 left-3 right-3 z-[9999]"
          >
            <div className="bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
              {/* Header compatto */}
              <div className="px-4 py-3 border-b border-gray-100/50 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">{t.directionsTitle}</h3>
                <button
                  onClick={() => setActiveMenu('none')}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Directions Options compatte */}
              <div className="p-3 space-y-2">
                
                {/* Banchetto */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDirections('banchetto')}
                  className="w-full bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl p-3 border border-green-100/50 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                      <span className="text-white text-lg">🛒</span>
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-semibold text-gray-900 text-sm">{t.getBanchetto}</h4>
                      <p className="text-xs text-gray-600">Via Cavalleggeri Udine</p>
                      <p className="text-xs text-green-600 font-medium">Mezzolombardo (TN)</p>
                    </div>
                    <div className="text-gray-400">📍</div>
                  </div>
                </motion.button>

                {/* Ingrosso */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDirections('ingrosso')}
                  className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl p-3 border border-blue-100/50 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                      <span className="text-white text-lg">🚛</span>
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-semibold text-gray-900 text-sm">{t.getIngrosso}</h4>
                      <p className="text-xs text-gray-600">Via de Gasperi, 47</p>
                      <p className="text-xs text-blue-600 font-medium">Mezzolombardo (TN)</p>
                    </div>
                    <div className="text-gray-400">📍</div>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🏠 MAIN DOCK - COMPATTA E SENZA SPAZI */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[9999] pointer-events-none"
          >
            {/* Container senza padding extra */}
            <div className="px-4 pb-2 pt-2 pointer-events-auto">
              
              {/* Dock compatta */}
              <div className="mx-auto max-w-[280px]">
                <div className="bg-white/95 backdrop-blur-2xl rounded-2xl shadow-xl border border-white/30 px-3 py-2">
                  
                  {/* 3 Tasti compatti */}
                  <div className="flex items-center justify-around">
                    
                    {/* MENU */}
                    <motion.button
                      onClick={() => toggleMenu('menu')}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        flex flex-col items-center justify-center
                        w-14 h-14 rounded-xl transition-all duration-300
                        ${activeMenu === 'menu'
                          ? 'bg-gray-900 text-white' 
                          : 'bg-gray-100 text-gray-700 active:bg-gray-200'
                        }
                      `}
                    >
                      <motion.div
                        animate={activeMenu === 'menu' ? { rotate: 90 } : { rotate: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-lg mb-0.5"
                      >
                        ☰
                      </motion.div>
                      <span className="text-xs font-medium">{t.menu}</span>
                    </motion.button>

                    {/* CALL */}
                    <motion.button
                      onClick={() => toggleMenu('call')}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        flex flex-col items-center justify-center
                        w-14 h-14 rounded-xl transition-all duration-300
                        ${activeMenu === 'call'
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-100 text-gray-700 active:bg-gray-200'
                        }
                      `}
                    >
                      <motion.div
                        animate={activeMenu === 'call' ? { scale: 1.1 } : { scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="text-lg mb-0.5"
                      >
                        📞
                      </motion.div>
                      <span className="text-xs font-medium">{t.call}</span>
                    </motion.button>

                    {/* DIRECTIONS */}
                    <motion.button
                      onClick={() => toggleMenu('directions')}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        flex flex-col items-center justify-center
                        w-14 h-14 rounded-xl transition-all duration-300
                        ${activeMenu === 'directions'
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 text-gray-700 active:bg-gray-200'
                        }
                      `}
                    >
                      <motion.div
                        animate={activeMenu === 'directions' ? { scale: 1.1 } : { scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="text-lg mb-0.5"
                      >
                        🗺️
                      </motion.div>
                      <span className="text-xs font-medium">{t.directions}</span>
                    </motion.button>
                  </div>
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
