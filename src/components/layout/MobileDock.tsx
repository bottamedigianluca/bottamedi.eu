import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MobileDockProps {
  language: 'it' | 'de'
  hideInFooter?: boolean
}

const translations = {
  it: {
    menu: 'Menu',
    call: 'Chiama',
    directions: 'Mappa',
    close: 'Chiudi',
    sections: [
      { id: 'hero', label: 'Home', icon: '🏠' },
      { id: 'about', label: 'Storia', icon: '📖' },
      { id: 'dettaglio', label: 'Banchetto', icon: '🛒' },
      { id: 'services', label: 'Servizi', icon: '⚡' },
      { id: 'products', label: 'Prodotti', icon: '🍎' },
      { id: 'wholesale', label: 'Listino', icon: '📋' },
      { id: 'contact', label: 'Contatti', icon: '📞' }
    ],
    contacts: {
      banchetto: 'Banchetto',
      ingrosso: 'Ingrosso HORECA',
      banchettoPhone: '351 577 6198',
      ingrossoPhone: '0461 602534',
      banchettoAddress: 'Via Cavalleggeri Udine, 38017 Mezzolombardo (TN)',
      ingrossoAddress: 'Via A. de Gasperi, 47, 38017 Mezzolombardo (TN)',
      banchettoHours: 'Lun-Sab: 7:00-19:30'
    }
  },
  de: {
    menu: 'Menü',
    call: 'Anrufen',
    directions: 'Karte',
    close: 'Schließen',
    sections: [
      { id: 'hero', label: 'Home', icon: '🏠' },
      { id: 'about', label: 'Geschichte', icon: '📖' },
      { id: 'dettaglio', label: 'Marktstand', icon: '🛒' },
      { id: 'services', label: 'Service', icon: '⚡' },
      { id: 'products', label: 'Produkte', icon: '🍎' },
      { id: 'wholesale', label: 'Preisliste', icon: '📋' },
      { id: 'contact', label: 'Kontakt', icon: '📞' }
    ],
    contacts: {
      banchetto: 'Marktstand',
      ingrosso: 'Großhandel HORECA',
      banchettoPhone: '351 577 6198',
      ingrossoPhone: '0461 602534',
      banchettoAddress: 'Via Cavalleggeri Udine, 38017 Mezzolombardo (TN)',
      ingrossoAddress: 'Via A. de Gasperi, 47, 38017 Mezzolombardo (TN)',
      banchettoHours: 'Mo-Sa: 7:00-19:30'
    }
  }
}

// 🎨 ICONE SVG SEMPLICI
const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
    <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
)

const MapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12,6 12,12 16,14"/>
  </svg>
)

// 🚀 HOOK SCROLL DETECTION OTTIMIZZATO
const useScrollDetection = (hideInFooter: boolean) => {
  const [isVisible, setIsVisible] = useState(false)
  const [currentSection, setCurrentSection] = useState('hero')
  const [isScrolling, setIsScrolling] = useState(false)

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout
    let animationFrame: number
    
    const handleScroll = () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
      
      animationFrame = requestAnimationFrame(() => {
        setIsScrolling(true)
        
        const sections = ['hero', 'about', 'dettaglio', 'services', 'products', 'wholesale', 'contact']
        const scrollPosition = window.scrollY + window.innerHeight / 2

        for (const sectionId of sections) {
          const element = document.getElementById(sectionId)
          if (element) {
            const { offsetTop, offsetHeight } = element
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
              setCurrentSection(sectionId)
              break
            }
          }
        }
        
        clearTimeout(scrollTimeout)
        scrollTimeout = setTimeout(() => {
          setIsScrolling(false)
        }, 300)
      })
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [])

  useEffect(() => {
    const isInHero = currentSection === 'hero'
    const shouldHide = isInHero || hideInFooter || isScrolling
    setIsVisible(!shouldHide)
  }, [currentSection, hideInFooter, isScrolling])

  return { isVisible, currentSection }
}

const PremiumMobileDock: React.FC<MobileDockProps> = ({ language, hideInFooter = false }) => {
  const [activeMenu, setActiveMenu] = useState<'none' | 'menu' | 'call' | 'directions'>('none')
  const [isMobile, setIsMobile] = useState(false)
  const { isVisible, currentSection } = useScrollDetection(hideInFooter)
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
      const offset = sectionId === 'hero' ? 0 : 80
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - offset
      window.scrollTo({
        top: Math.max(0, elementPosition),
        behavior: 'smooth'
      })
      setActiveMenu('none')
      
      if ('vibrate' in navigator) {
        navigator.vibrate(25)
      }
    }
  }, [])

  const handleCall = useCallback((phone: string) => {
    window.open(`tel:${phone.replace(/\s/g, '')}`, '_self')
    setActiveMenu('none')
    
    if ('vibrate' in navigator) {
      navigator.vibrate(50)
    }
  }, [])

  const handleDirections = useCallback((type: 'banchetto' | 'ingrosso') => {
    const urls = {
      banchetto: 'https://www.google.com/maps/search/?api=1&query=Banchetto+Frutta+e+Verdura+Bottamedi+Via+Cavalleggeri+Udine+Mezzolombardo+TN',
      ingrosso: 'https://maps.app.goo.gl/TFV4cgnEvcFjBHfD6'
    }
    window.open(urls[type], '_blank')
    setActiveMenu('none')
    
    if ('vibrate' in navigator) {
      navigator.vibrate(30)
    }
  }, [])

  const toggleMenu = useCallback((menu: 'menu' | 'call' | 'directions') => {
    setActiveMenu(prev => prev === menu ? 'none' : menu)
    
    if ('vibrate' in navigator) {
      navigator.vibrate(25)
    }
  }, [])

  const closeAllMenus = useCallback(() => {
    setActiveMenu('none')
  }, [])

  if (!isMobile) return null

  return (
    <div className="lg:hidden pointer-events-none">
      {/* 🌟 BACKDROP CON SUPERCERCHI */}
      <AnimatePresence>
        {activeMenu !== 'none' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[999] pointer-events-auto overflow-hidden"
            onClick={closeAllMenus}
            style={{ 
              background: 'radial-gradient(circle at 30% 20%, rgba(59,130,246,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(34,197,94,0.15) 0%, transparent 50%), rgba(0,0,0,0.4)',
              backdropFilter: 'blur(8px)'
            }}
          >
            {/* Supercerchi animati */}
            <motion.div
              className="absolute w-96 h-96 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
                top: '10%',
                left: '20%'
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
                x: [0, 50, 0],
                y: [0, -30, 0]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute w-80 h-80 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(34,197,94,0.25) 0%, transparent 70%)',
                bottom: '20%',
                right: '15%'
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.5, 0.2],
                x: [0, -40, 0],
                y: [0, 20, 0]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            />
            <motion.div
              className="absolute w-64 h-64 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(147,51,234,0.2) 0%, transparent 70%)',
                top: '60%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.4, 0.7, 0.4],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📱 MENU POPUP */}
      <AnimatePresence>
        {activeMenu === 'menu' && isVisible && (
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.95 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.4
            }}
            className="fixed bottom-32 left-4 right-4 z-[1000] pointer-events-auto"
          >
            <div className="relative overflow-hidden bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50">
              {/* Supercerchi nel background */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <motion.div
                  className="absolute w-32 h-32 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
                    top: '-10%',
                    right: '-10%'
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <motion.div
                  className="absolute w-24 h-24 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)',
                    bottom: '-5%',
                    left: '-5%'
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    x: [0, 20, 0],
                    y: [0, -20, 0]
                  }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>

              {/* Header */}
              <div className="relative px-6 py-4 bg-gradient-to-r from-blue-50 to-green-50 border-b border-white/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <MenuIcon />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{t.menu}</h3>
                      <p className="text-sm text-gray-600">Naviga il sito</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeAllMenus}
                    className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/90 shadow-md text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <CloseIcon />
                  </motion.button>
                </div>
              </div>
              
              {/* Menu Items */}
              <div className="relative p-6">
                <div className="grid grid-cols-2 gap-3">
                  {t.sections.map((item, index) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: index * 0.05, 
                        duration: 0.3, 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 20 
                      }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => scrollToSection(item.id)}
                      className={`
                        relative flex items-center p-4 rounded-2xl transition-all duration-300 min-h-[60px] overflow-hidden
                        ${currentSection === item.id 
                          ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg' 
                          : 'bg-white/70 text-gray-700 hover:bg-white/90 shadow-md hover:shadow-lg'
                        }
                      `}
                    >
                      {/* Supercerchio per item attivo */}
                      {currentSection === item.id && (
                        <motion.div
                          className="absolute inset-0 rounded-2xl"
                          style={{
                            background: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.2) 0%, transparent 60%)'
                          }}
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.3, 0.6, 0.3]
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      )}
                      
                      <div className="relative flex items-center space-x-3">
                        <div className="text-xl">{item.icon}</div>
                        <span className="text-sm font-semibold">{item.label}</span>
                      </div>
                      
                      {currentSection === item.id && (
                        <motion.div
                          className="absolute right-3 w-2 h-2 bg-white rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1 }}
                        />
                      )}
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
        {activeMenu === 'call' && isVisible && (
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.95 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.4
            }}
            className="fixed bottom-32 left-4 right-4 z-[1000] pointer-events-auto"
          >
            <div className="relative overflow-hidden bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50">
              {/* Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-red-50 border-b border-white/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <PhoneIcon />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{t.call}</h3>
                      <p className="text-sm text-gray-600">Contattaci direttamente</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeAllMenus}
                    className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/90 shadow-md text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <CloseIcon />
                  </motion.button>
                </div>
              </div>
              
              {/* Contact Cards */}
              <div className="p-6 space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200"
                >
                  <div className="flex items-start space-x-4 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-lg shadow-lg">
                      🛒
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-green-900 mb-1">{t.contacts.banchetto}</h4>
                      <p className="text-green-700 text-sm mb-2">{t.contacts.banchettoAddress}</p>
                      <div className="flex items-center text-green-600 text-sm">
                        <ClockIcon />
                        <span className="ml-2">{t.contacts.banchettoHours}</span>
                      </div>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCall(t.contacts.banchettoPhone)}
                    className="w-full flex items-center justify-center p-3 bg-green-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
                  >
                    <PhoneIcon />
                    <span className="ml-2">Chiama {t.contacts.banchettoPhone}</span>
                  </motion.button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200"
                >
                  <div className="flex items-start space-x-4 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-lg shadow-lg">
                      🚛
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-blue-900 mb-1">{t.contacts.ingrosso}</h4>
                      <p className="text-blue-700 text-sm">{t.contacts.ingrossoAddress}</p>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCall(t.contacts.ingrossoPhone)}
                    className="w-full flex items-center justify-center p-3 bg-blue-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
                  >
                    <PhoneIcon />
                    <span className="ml-2">Chiama {t.contacts.ingrossoPhone}</span>
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🗺️ DIRECTIONS POPUP */}
      <AnimatePresence>
        {activeMenu === 'directions' && isVisible && (
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.95 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.4
            }}
            className="fixed bottom-32 left-4 right-4 z-[1000] pointer-events-auto"
          >
            <div className="relative overflow-hidden bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50">
              {/* Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-white/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <MapIcon />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{t.directions}</h3>
                      <p className="text-sm text-gray-600">Come raggiungerci</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeAllMenus}
                    className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/90 shadow-md text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <CloseIcon />
                  </motion.button>
                </div>
              </div>
              
              {/* Location Cards */}
              <div className="p-6 space-y-4">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDirections('ingrosso')}
                  className="w-full p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 text-left"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <MapIcon />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-blue-900 mb-1">{t.contacts.ingrosso}</h4>
                      <p className="text-blue-700 text-sm leading-relaxed">{t.contacts.ingrossoAddress}</p>
                      <div className="flex items-center text-blue-500 text-sm mt-2 font-semibold">
                        <span>📍 Apri in Google Maps</span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🚀 DOCK PRINCIPALE CON SUPERCERCHI */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 120, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.8 }}
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 25,
              mass: 0.9,
              duration: 0.6
            }}
            className="fixed bottom-0 left-0 right-0 z-[1001] pointer-events-none"
            style={{
              paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
              paddingLeft: 'env(safe-area-inset-left)',
              paddingRight: 'env(safe-area-inset-right)'
            }}
          >
            <div className="flex justify-center px-4">
              <div className="relative pointer-events-auto bg-white/20 backdrop-blur-xl rounded-3xl p-3 shadow-2xl border border-white/30 overflow-hidden">
                {/* Supercerchi nel dock */}
                <motion.div
                  className="absolute w-24 h-24 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
                    top: '-50%',
                    left: '10%'
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    x: [0, 30, 0],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute w-20 h-20 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)',
                    bottom: '-40%',
                    right: '15%'
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    x: [0, -20, 0],
                    opacity: [0.2, 0.5, 0.2]
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 3
                  }}
                />
                
                <div className="relative flex items-center space-x-3">
                  {/* Menu Button */}
                  <motion.button
                    whileHover={{ 
                      scale: 1.15, 
                      y: -4,
                      transition: { duration: 0.2, type: 'spring', stiffness: 400 }
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleMenu('menu')}
                    className={`
                      relative w-16 h-16 rounded-2xl flex flex-col items-center justify-center
                      transition-all duration-300 overflow-hidden
                      ${activeMenu === 'menu' 
                        ? 'bg-gradient-to-br from-blue-500 to-green-500 text-white shadow-2xl' 
                        : 'bg-white/90 text-gray-700 shadow-lg hover:shadow-xl'
                      }
                    `}
                  >
                    {/* Supercerchio nel button */}
                    {activeMenu === 'menu' && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        style={{
                          background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 70%)'
                        }}
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.3, 0.6, 0.3],
                          rotate: [0, 180, 360]
                        }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                    )}
                    <motion.div 
                      className="mb-1 relative z-10"
                      animate={activeMenu === 'menu' ? { rotate: [0, 180, 0] } : { rotate: 0 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <MenuIcon />
                    </motion.div>
                    <span className="text-xs font-bold relative z-10">{t.menu}</span>
                  </motion.button>

                  {/* Call Button */}
                  <motion.button
                    whileHover={{ 
                      scale: 1.15, 
                      y: -4,
                      transition: { duration: 0.2, type: 'spring', stiffness: 400 }
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleMenu('call')}
                    className={`
                      relative w-16 h-16 rounded-2xl flex flex-col items-center justify-center
                      transition-all duration-300 overflow-hidden
                      ${activeMenu === 'call' 
                        ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-2xl' 
                        : 'bg-white/90 text-gray-700 shadow-lg hover:shadow-xl'
                      }
                    `}
                  >
                    {/* Supercerchio nel call button */}
                    {activeMenu === 'call' && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        style={{
                          background: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.4) 0%, transparent 60%)'
                        }}
                        animate={{
                          scale: [0.8, 1.4, 0.8],
                          opacity: [0.2, 0.7, 0.2],
                          x: [0, 5, 0],
                          y: [0, -5, 0]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    )}
                    <motion.div 
                      className="mb-1 relative z-10"
                      animate={activeMenu === 'call' ? { 
                        rotate: [0, 8, -8, 0],
                        scale: [1, 1.1, 1]
                      } : { rotate: 0, scale: 1 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <PhoneIcon />
                    </motion.div>
                    <span className="text-xs font-bold relative z-10">{t.call}</span>
                  </motion.button>

                  {/* Directions Button */}
                  <motion.button
                    whileHover={{ 
                      scale: 1.15, 
                      y: -4,
                      transition: { duration: 0.2, type: 'spring', stiffness: 400 }
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleMenu('directions')}
                    className={`
                      relative w-16 h-16 rounded-2xl flex flex-col items-center justify-center
                      transition-all duration-300 overflow-hidden
                      ${activeMenu === 'directions' 
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-2xl' 
                        : 'bg-white/90 text-gray-700 shadow-lg hover:shadow-xl'
                      }
                    `}
                  >
                    {/* Supercerchio nel directions button */}
                    {activeMenu === 'directions' && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        style={{
                          background: 'radial-gradient(circle at 50% 20%, rgba(255,255,255,0.35) 0%, transparent 65%)'
                        }}
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.4, 0.8, 0.4],
                          rotate: [0, 90, 180, 270, 360]
                        }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                    )}
                    <motion.div 
                      className="mb-1 relative z-10"
                      animate={activeMenu === 'directions' ? { 
                        y: [0, -2, 0],
                        scale: [1, 1.1, 1]
                      } : { y: 0, scale: 1 }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <MapIcon />
                    </motion.div>
                    <span className="text-xs font-bold relative z-10">{t.directions}</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PremiumMobileDock
