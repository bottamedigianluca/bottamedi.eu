import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'

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

// 🎨 ICONE SVG PULITE
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
  const [isVisible, setIsVisible] = useState(true)
  const [currentSection, setCurrentSection] = useState('hero')

  useEffect(() => {
    let animationFrame: number
    
    const handleScroll = () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
      
      animationFrame = requestAnimationFrame(() => {
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
      })
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [])

  useEffect(() => {
    // Show dock in all sections except hero and when hideInFooter is true
    const shouldHide = hideInFooter
    setIsVisible(!shouldHide)
  }, [hideInFooter])

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

  // 🎯 VARIANTI ANIMATE STABILI
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        duration: 0.15,
        ease: "easeIn"
      }
    }
  }

  const popupVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  }

  const dockVariants = {
    hidden: { 
      y: 100, 
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
        duration: 0.4
      }
    },
    exit: {
      y: 100,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  }

  return (
    <LayoutGroup>
      <div className="lg:hidden pointer-events-none">
        {/* 🌅 BACKDROP */}
        <AnimatePresence>
          {activeMenu !== 'none' && (
            <motion.div
              key="backdrop"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-[999] pointer-events-auto"
              onClick={closeAllMenus}
              style={{ 
                background: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)'
              }}
            />
          )}
        </AnimatePresence>

        {/* 📱 MENU POPUP */}
        <AnimatePresence mode="wait">
          {activeMenu === 'menu' && isVisible && (
            <motion.div
              key="menu-popup"
              variants={popupVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed bottom-32 left-4 right-4 z-[1000] pointer-events-auto"
              style={{ willChange: 'transform, opacity' }}
            >
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-green-50 border-b border-gray-100">
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
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={closeAllMenus}
                      className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white shadow-md text-gray-600 hover:text-red-500 transition-colors duration-200"
                    >
                      <CloseIcon />
                    </motion.button>
                  </div>
                </div>
                
                {/* Menu Items */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-3">
                    {t.sections.map((item) => (
                      <motion.button
                        key={item.id}
                        layoutId={`menu-item-${item.id}`}
                        onClick={() => scrollToSection(item.id)}
                        className={`
                          flex items-center p-4 rounded-2xl transition-all duration-200 min-h-[60px]
                          ${currentSection === item.id 
                            ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg' 
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 shadow-sm hover:shadow-md'
                          }
                        `}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-xl">{item.icon}</div>
                          <span className="text-sm font-semibold">{item.label}</span>
                        </div>
                        
                        {currentSection === item.id && (
                          <motion.div
                            layoutId="active-indicator"
                            className="absolute right-3 w-2 h-2 bg-white rounded-full"
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
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
        <AnimatePresence mode="wait">
          {activeMenu === 'call' && isVisible && (
            <motion.div
              key="call-popup"
              variants={popupVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed bottom-32 left-4 right-4 z-[1000] pointer-events-auto"
              style={{ willChange: 'transform, opacity' }}
            >
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-100">
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
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={closeAllMenus}
                      className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white shadow-md text-gray-600 hover:text-red-500 transition-colors duration-200"
                    >
                      <CloseIcon />
                    </motion.button>
                  </div>
                </div>
                
                {/* Contact Cards */}
                <div className="p-6">
                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
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
                        className="w-full flex items-center justify-center p-3 bg-green-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <PhoneIcon />
                        <span className="ml-2">Chiama {t.contacts.banchettoPhone}</span>
                      </motion.button>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
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
                        className="w-full flex items-center justify-center p-3 bg-blue-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <PhoneIcon />
                        <span className="ml-2">Chiama {t.contacts.ingrossoPhone}</span>
                      </motion.button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🗺️ DIRECTIONS POPUP */}
        <AnimatePresence mode="wait">
          {activeMenu === 'directions' && isVisible && (
            <motion.div
              key="directions-popup"
              variants={popupVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed bottom-32 left-4 right-4 z-[1000] pointer-events-auto"
              style={{ willChange: 'transform, opacity' }}
            >
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
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
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={closeAllMenus}
                      className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white shadow-md text-gray-600 hover:text-red-500 transition-colors duration-200"
                    >
                      <CloseIcon />
                    </motion.button>
                  </div>
                </div>
                
                {/* Location Cards */}
                <div className="p-6">
                  <div className="space-y-4">
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleDirections('banchetto')}
                      className="w-full p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 text-left transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                          <MapIcon />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-green-900 mb-1">{t.contacts.banchetto}</h4>
                          <p className="text-green-700 text-sm leading-relaxed">{t.contacts.banchettoAddress}</p>
                          <div className="flex items-center text-green-500 text-sm mt-2 font-semibold">
                            <span>📍 Apri in Google Maps</span>
                          </div>
                        </div>
                      </div>
                    </motion.button>

                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y:
