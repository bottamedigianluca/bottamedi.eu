import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
            const isInHero = sectionId === 'hero'
            const isNearFooter = window.scrollY + window.innerHeight > document.body.scrollHeight - 200
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

const PremiumMobileDock: React.FC<MobileDockProps> = ({ language }) => {
  const [activeMenu, setActiveMenu] = useState<'none' | 'menu' | 'call' | 'directions'>('none')
  const [isMobile, setIsMobile] = useState(false)
  const { isVisible, currentSection } = useScrollDetection()
  const t = translations[language]

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (!mobile) {
        setActiveMenu('none')
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile, { passive: true })
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - offset
      window.scrollTo({
        top: Math.max(0, elementPosition),
        behavior: 'smooth'
      })
      setActiveMenu('none')
    }
  }, [])

  const handleCall = useCallback((phone: string) => {
    window.open(`tel:${phone.replace(/\s/g, '')}`, '_self')
    setActiveMenu('none')
  }, [])

  const handleWhatsApp = useCallback(() => {
    const message = encodeURIComponent(
      language === 'it' 
        ? 'Ciao! Sono interessato ai vostri prodotti.' 
        : 'Hallo! Ich interessiere mich für Ihre Produkte.'
    )
    window.open(`https://wa.me/393515776198?text=${message}`, '_blank')
    setActiveMenu('none')
  }, [language])

  const handleDirections = useCallback((type: 'banchetto' | 'ingrosso') => {
    const urls = {
      banchetto: 'https://www.google.com/maps/search/?api=1&query=Banchetto+Frutta+e+Verdura+Bottamedi+Via+Cavalleggeri+Udine+Mezzolombardo+TN',
      ingrosso: 'https://maps.app.goo.gl/TFV4cgnEvcFjBHfD6'
    }
    window.open(urls[type], '_blank')
    setActiveMenu('none')
  }, [])

  const toggleMenu = useCallback((menu: 'menu' | 'call' | 'directions') => {
    setActiveMenu(prev => prev === menu ? 'none' : menu)
  }, [])

  const closeAllMenus = useCallback(() => {
    setActiveMenu('none')
  }, [])

  if (!isMobile) return null

  return (
    <div className="lg:hidden">
      {/* Backdrop */}
      <AnimatePresence>
        {activeMenu !== 'none' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[999]"
            onClick={closeAllMenus}
          />
        )}
      </AnimatePresence>

      {/* Menu Popup */}
      <AnimatePresence>
        {activeMenu === 'menu' && isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className="fixed bottom-24 left-4 right-4 z-[1000]"
          >
            <div 
              className="relative bg-white rounded-3xl overflow-hidden shadow-2xl"
              style={{
                background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                transform: 'perspective(1000px) rotateX(2deg)'
              }}
            >
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-transparent">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">{t.menu}</span>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeAllMenus}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-lg text-gray-600 hover:text-red-500 transition-colors"
                  >
                    ✕
                  </motion.button>
                </div>
              </div>
              
              <div className="p-6 grid grid-cols-3 gap-4">
                {t.sections.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex flex-col items-center p-4 rounded-2xl transition-all duration-300 ${
                      currentSection === item.id 
                        ? 'bg-green-50 text-green-700 shadow-lg border-2 border-green-200' 
                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                    }`}
                  >
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <span className="text-sm font-semibold leading-tight text-center">{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call Popup */}
      <AnimatePresence>
        {activeMenu === 'call' && isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className="fixed bottom-24 left-4 right-4 z-[1000]"
          >
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-transparent">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">{t.call}</span>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeAllMenus}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-lg text-gray-600 hover:text-red-500 transition-colors"
                  >
                    ✕
                  </motion.button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCall(t.contacts.banchettoPhone)}
                  className="w-full p-4 rounded-2xl text-left bg-green-50 hover:bg-green-100 transition-all duration-300 shadow-md"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
                      🛒
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-900">{t.contacts.banchetto}</h3>
                      <p className="text-green-700 font-mono">{t.contacts.banchettoPhone}</p>
                      <p className="text-green-600 text-sm">{t.contacts.banchettoAddress}</p>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCall(t.contacts.ingrossoPhone)}
                  className="w-full p-4 rounded-2xl text-left bg-blue-50 hover:bg-blue-100 transition-all duration-300 shadow-md"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
                      🚛
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900">{t.contacts.ingrosso}</h3>
                      <p className="text-blue-700 font-mono">{t.contacts.ingrossoPhone}</p>
                      <p className="text-blue-600 text-sm">{t.contacts.ingrossoAddress}</p>
                    </div>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Directions Popup */}
      <AnimatePresence>
        {activeMenu === 'directions' && isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className="fixed bottom-24 left-4 right-4 z-[1000]"
          >
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-transparent">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">{t.directions}</span>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeAllMenus}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-lg text-gray-600 hover:text-red-500 transition-colors"
                  >
                    ✕
                  </motion.button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDirections('banchetto')}
                  className="w-full p-4 rounded-2xl text-left bg-green-50 hover:bg-green-100 transition-all duration-300 shadow-md"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
                      🗺️
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-900">{t.contacts.banchetto}</h3>
                      <p className="text-green-600 text-sm">{t.contacts.banchettoAddress}</p>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDirections('ingrosso')}
                  className="w-full p-4 rounded-2xl text-left bg-blue-50 hover:bg-blue-100 transition-all duration-300 shadow-md"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
                      🗺️
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900">{t.contacts.ingrosso}</h3>
                      <p className="text-blue-600 text-sm">{t.contacts.ingrossoAddress}</p>
                    </div>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DOCK PRINCIPALE - Design 3D Innovativo */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[1001]"
          >
            <div 
              className="relative px-2 py-2 bg-white/20 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.25), rgba(255,255,255,0.1))',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 25px 45px -12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                transform: 'perspective(800px) rotateX(5deg)'
              }}
            >
              <div className="flex items-center space-x-2">
                {/* Menu Button */}
                <motion.button
                  whileHover={{ scale: 1.1, y: -3, rotateY: 10 }}
                  whileTap={{ scale: 0.95, y: 0 }}
                  onClick={() => toggleMenu('menu')}
                  className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${
                    activeMenu === 'menu' ? 'bg-green-100 text-green-600 shadow-lg' : 'bg-white/90 text-gray-700 shadow-md hover:shadow-lg'
                  }`}
                  style={{
                    transform: 'perspective(400px) translateZ(2px)',
                    boxShadow: activeMenu === 'menu' 
                      ? '0 8px 20px -6px rgba(34,197,94,0.4), inset 0 1px 0 rgba(255,255,255,0.3)'
                      : '0 4px 12px -3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)'
                  }}
                >
                  <motion.div 
                    animate={activeMenu === 'menu' ? { rotate: 180, scale: 1.1 } : { rotate: 0, scale: 1 }}
                    className="text-lg font-bold mb-1"
                  >
                    ☰
                  </motion.div>
                  <span className="text-xs font-semibold">{t.menu}</span>
                </motion.button>

                {/* Call Button */}
                <motion.button
                  whileHover={{ scale: 1.1, y: -3, rotateY: -10 }}
                  whileTap={{ scale: 0.95, y: 0 }}
                  onClick={() => toggleMenu('call')}
                  className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${
                    activeMenu === 'call' ? 'bg-blue-100 text-blue-600 shadow-lg' : 'bg-white/90 text-gray-700 shadow-md hover:shadow-lg'
                  }`}
                  style={{
                    transform: 'perspective(400px) translateZ(2px)',
                    boxShadow: activeMenu === 'call' 
                      ? '0 8px 20px -6px rgba(59,130,246,0.4), inset 0 1px 0 rgba(255,255,255,0.3)'
                      : '0 4px 12px -3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)'
                  }}
                >
                  <motion.div 
                    animate={activeMenu === 'call' ? { rotate: 5, scale: 1.1 } : { rotate: 0, scale: 1 }}
                    className="text-lg mb-1"
                  >
                    📞
                  </motion.div>
                  <span className="text-xs font-semibold">{t.call}</span>
                </motion.button>

                {/* Directions Button */}
                <motion.button
                  whileHover={{ scale: 1.1, y: -3, rotateY: 10 }}
                  whileTap={{ scale: 0.95, y: 0 }}
                  onClick={() => toggleMenu('directions')}
                  className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${
                    activeMenu === 'directions' ? 'bg-purple-100 text-purple-600 shadow-lg' : 'bg-white/90 text-gray-700 shadow-md hover:shadow-lg'
                  }`}
                  style={{
                    transform: 'perspective(400px) translateZ(2px)',
                    boxShadow: activeMenu === 'directions' 
                      ? '0 8px 20px -6px rgba(147,51,234,0.4), inset 0 1px 0 rgba(255,255,255,0.3)'
                      : '0 4px 12px -3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)'
                  }}
                >
                  <motion.div 
                    animate={activeMenu === 'directions' ? { rotate: -5, scale: 1.1 } : { rotate: 0, scale: 1 }}
                    className="text-lg mb-1"
                  >
                    🗺️
                  </motion.div>
                  <span className="text-xs font-semibold">{t.directions}</span>
                </motion.button>

                {/* WhatsApp Button */}
                <motion.button
                  whileHover={{ scale: 1.1, y: -3, rotateY: -10 }}
                  whileTap={{ scale: 0.95, y: 0 }}
                  onClick={handleWhatsApp}
                  className="relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 bg-green-100 text-green-600 shadow-lg"
                  style={{
                    transform: 'perspective(400px) translateZ(2px)',
                    boxShadow: '0 8px 20px -6px rgba(34,197,94,0.4), inset 0 1px 0 rgba(255,255,255,0.3)'
                  }}
                >
                  <motion.div 
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className="text-lg mb-1"
                  >
                    💬
                  </motion.div>
                  <span className="text-xs font-semibold">{t.whatsapp}</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PremiumMobileDock
