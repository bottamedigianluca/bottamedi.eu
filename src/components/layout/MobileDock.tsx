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
      banchetto: 'Banchetto Retail',
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
      banchetto: 'Marktstand Retail',
      ingrosso: 'Großhandel HORECA',
      banchettoPhone: '351 577 6198',
      ingrossoPhone: '0461 602534',
      banchettoAddress: 'Via Cavalleggeri Udine, 38017 Mezzolombardo (TN)',
      ingrossoAddress: 'Via A. de Gasperi, 47, 38017 Mezzolombardo (TN)',
      banchettoHours: 'Mo-Sa: 7:00-19:30'
    }
  }
}

// Icone SVG
const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7">
    <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
)

const MapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.097"/>
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

  const handleWhatsApp = useCallback((phone: string) => {
    const message = encodeURIComponent(
      language === 'it' 
        ? 'Ciao! Sono interessato ai vostri prodotti.' 
        : 'Hallo! Ich interessiere mich für Ihre Produkte.'
    )
    window.open(`https://wa.me/39${phone.replace(/\s/g, '')}?text=${message}`, '_blank')
    setActiveMenu('none')
    
    if ('vibrate' in navigator) {
      navigator.vibrate(25)
    }
  }, [language])

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
      {/* Backdrop */}
      <AnimatePresence>
        {activeMenu !== 'none' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] pointer-events-auto"
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
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="fixed bottom-24 left-4 right-4 z-[1000] pointer-events-auto"
          >
            <div 
              className="relative overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)',
                backdropFilter: 'blur(25px)',
                WebkitBackdropFilter: 'blur(25px)',
                borderRadius: '28px',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.2), inset 0 1px 0 rgba(255,255,255,0.9)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            >
              <div 
                className="px-6 py-5 border-b border-white/30"
                style={{
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(34,197,94,0.08) 100%)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-white"
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
                        boxShadow: '0 4px 12px -2px rgba(59,130,246,0.4)'
                      }}
                    >
                      <MenuIcon />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{t.menu}</h3>
                      <p className="text-sm text-gray-600">Naviga il sito</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeAllMenus}
                    className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg text-gray-600 hover:text-red-500 transition-colors border border-white/40"
                  >
                    <CloseIcon />
                  </motion.button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {t.sections.map((item, index) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04, duration: 0.3, type: 'spring' }}
                      whileHover={{ 
                        scale: 1.03, 
                        y: -2,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => scrollToSection(item.id)}
                      className={`
                        relative flex items-center p-4 rounded-2xl transition-all duration-300 min-h-[70px] group
                        ${currentSection === item.id 
                          ? 'text-white' 
                          : 'text-gray-700 hover:text-gray-900'
                        }
                      `}
                      style={{
                        background: currentSection === item.id 
                          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                          : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)',
                        boxShadow: currentSection === item.id
                          ? '0 8px 25px -8px rgba(16,185,129,0.5), inset 0 1px 0 rgba(255,255,255,0.3)'
                          : '0 4px 15px -4px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
                        border: currentSection === item.id 
                          ? '1px solid rgba(255,255,255,0.3)'
                          : '1px solid rgba(255,255,255,0.4)'
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{item.icon}</div>
                        <span className="text-sm font-bold leading-tight">
                          {item.label}
                        </span>
                      </div>
                      
                      {currentSection === item.id && (
                        <motion.div
                          className="absolute right-3 w-2 h-2 bg-white rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 }}
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

      {/* Call Popup */}
      <AnimatePresence>
        {activeMenu === 'call' && isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="fixed bottom-24 left-4 right-4 z-[1000] pointer-events-auto"
          >
            <div 
              className="relative overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)',
                backdropFilter: 'blur(25px)',
                WebkitBackdropFilter: 'blur(25px)',
                borderRadius: '28px',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.9)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            >
              <div 
                className="px-6 py-5 border-b border-white/30"
                style={{
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(147,51,234,0.08) 100%)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-white"
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)',
                        boxShadow: '0 4px 12px -2px rgba(59,130,246,0.4)'
                      }}
                    >
                      <PhoneIcon />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{t.call}</h3>
                      <p className="text-sm text-gray-600">Contattaci direttamente</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeAllMenus}
                    className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/90 shadow-lg text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <CloseIcon />
                  </motion.button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="relative p-5 rounded-3xl overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(5,150,105,0.1) 100%)',
                    border: '1px solid rgba(16,185,129,0.2)',
                    boxShadow: '0 8px 25px -8px rgba(16,185,129,0.2)'
                  }}
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg"
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      }}
                    >
                      🛒
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-green-900 text-lg mb-1">{t.contacts.banchetto}</h4>
                      <p className="text-green-600 text-sm mb-2">{t.contacts.banchettoAddress}</p>
                      <div className="flex items-center text-green-600 text-sm">
                        <ClockIcon />
                        <span className="ml-2">{t.contacts.banchettoHours}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCall(t.contacts.banchettoPhone)}
                      className="flex items-center justify-center p-3 rounded-xl bg-green-500 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                      <PhoneIcon />
                      <span className="ml-2 text-sm">Chiama</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleWhatsApp(t.contacts.banchettoPhone)}
                      className="flex items-center justify-center p-3 rounded-xl bg-green-600 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                      <WhatsAppIcon />
                      <span className="ml-2 text-sm">WhatsApp</span>
                    </motion.button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative p-5 rounded-3xl overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(37,99,235,0.1) 100%)',
                    border: '1px solid rgba(59,130,246,0.2)',
                    boxShadow: '0 8px 25px -8px rgba(59,130,246,0.2)'
                  }}
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg"
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                      }}
                    >
                      🚛
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-blue-900 text-lg mb-1">{t.contacts.ingrosso}</h4>
                      <p className="text-blue-600 text-sm">{t.contacts.ingrossoAddress}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCall(t.contacts.ingrossoPhone)}
                      className="flex items-center justify-center p-3 rounded-xl bg-blue-500 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                      <PhoneIcon />
                      <span className="ml-2 text-sm">Chiama</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleWhatsApp(t.contacts.ingrossoPhone)}
                      className="flex items-center justify-center p-3 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                      <WhatsAppIcon />
                      <span className="ml-2 text-sm">WhatsApp</span>
                    </motion.button>
                  </div>
                </motion.div>
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
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="fixed bottom-24 left-4 right-4 z-[1000] pointer-events-auto"
          >
            <div 
              className="relative overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)',
                backdropFilter: 'blur(25px)',
                WebkitBackdropFilter: 'blur(25px)',
                borderRadius: '28px',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.2), inset 0 1px 0 rgba(255,255,255,0.9)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            >
              <div 
                className="px-6 py-5 border-b border-white/30"
                style={{
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(34,197,94,0.08) 100%)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-white"
                      style={{
                        background: 'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)',
                        boxShadow: '0 4px 12px -2px rgba(147,51,234,0.4)'
                      }}
                    >
                      <MapIcon />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{t.directions}</h3>
                      <p className="text-sm text-gray-600">Come raggiungerci</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeAllMenus}
                    className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/90 shadow-lg text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <CloseIcon />
                  </motion.button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDirections('banchetto')}
                  className="w-full p-5 rounded-3xl text-left transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(5,150,105,0.1) 100%)',
                    border: '1px solid rgba(16,185,129,0.2)',
                    boxShadow: '0 8px 25px -8px rgba(16,185,129,0.2)'
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg"
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      }}
                    >
                      <MapIcon />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-green-900 text-lg mb-1">{t.contacts.banchetto}</h4>
                      <p className="text-green-600 text-sm leading-relaxed">{t.contacts.banchettoAddress}</p>
                      <div className="flex items-center text-green-500 text-sm mt-2 font-semibold">
                        <span>📍 Apri in Google Maps</span>
                      </div>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDirections('ingrosso')}
                  className="w-full p-5 rounded-3xl text-left transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(37,99,235,0.1) 100%)',
                    border: '1px solid rgba(59,130,246,0.2)',
                    boxShadow: '0 8px 25px -8px rgba(59,130,246,0.2)'
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg"
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                      }}
                    >
                      <MapIcon />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-blue-900 text-lg mb-1">{t.contacts.ingrosso}</h4>
                      <p className="text-blue-600 text-sm leading-relaxed">{t.contacts.ingrossoAddress}</p>
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

      {/* DOCK PRINCIPALE */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.8 }}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 350,
              opacity: { duration: 0.3 }
            }}
            className="fixed bottom-0 left-0 right-0 z-[1001] pointer-events-none"
            style={{
              paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
              paddingLeft: 'env(safe-area-inset-left)',
              paddingRight: 'env(safe-area-inset-right)'
            }}
          >
            <div className="flex justify-center px-4">
              <div 
                className="relative pointer-events-auto"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.08) 100%)',
                  backdropFilter: 'blur(25px)',
                  WebkitBackdropFilter: 'blur(25px)',
                  borderRadius: '32px',
                  padding: '12px',
                  boxShadow: '0 30px 60px -12px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.15), inset 0 1px 0 rgba(255,255,255,0.25)',
                  border: '1px solid rgba(255,255,255,0.15)'
                }}
              >
                <div 
                  className="absolute inset-3 rounded-3xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.04) 100%)',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                  }}
                />
                
                <div className="relative flex items-center space-x-4">
                  {/* Menu Button */}
                  <motion.button
                    whileHover={{ 
                      scale: 1.12, 
                      y: -6,
                      rotateY: 12,
                      transition: { duration: 0.2, type: 'spring', stiffness: 400 }
                    }}
                    whileTap={{ 
                      scale: 0.95, 
                      y: 0,
                      transition: { duration: 0.1 }
                    }}
                    onClick={() => toggleMenu('menu')}
                    className={`
                      relative flex flex-col items-center justify-center rounded-3xl
                      transition-all duration-300 group overflow-hidden
                      ${activeMenu === 'menu' ? 'text-white' : 'text-gray-700'}
                    `}
                    style={{
                      background: activeMenu === 'menu' 
                        ? 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)'
                        : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
                      boxShadow: activeMenu === 'menu'
                        ? '0 15px 35px -8px rgba(59,130,246,0.6), inset 0 1px 0 rgba(255,255,255,0.4), 0 0 0 1px rgba(255,255,255,0.15)'
                        : '0 10px 30px -8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.9), 0 0 0 1px rgba(255,255,255,0.25)',
                      transform: 'perspective(500px) translateZ(6px)',
                      width: '72px',
                      height: '72px'
                    }}
                  >
                    <motion.div 
                      animate={activeMenu === 'menu' ? { rotate: 180, scale: 1.1 } : { rotate: 0, scale: 1 }}
                      className="mb-1"
                    >
                      <MenuIcon />
                    </motion.div>
                    <span className="text-xs font-bold opacity-90">{t.menu}</span>
                    
                    <AnimatePresence>
                      {activeMenu === 'menu' && (
                        <motion.div
                          className="absolute inset-0 rounded-3xl"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1.2 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          style={{
                            background: 'linear-gradient(135deg, rgba(59,130,246,0.4) 0%, rgba(16,185,129,0.4) 100%)',
                            filter: 'blur(12px)',
                            zIndex: -1
                          }}
                        />
                      )}
                    </AnimatePresence>
                  </motion.button>

                  {/* Call Button */}
                  <motion.button
                    whileHover={{ 
                      scale: 1.12, 
                      y: -6,
                      rotateY: -12,
                      transition: { duration: 0.2, type: 'spring', stiffness: 400 }
                    }}
                    whileTap={{ 
                      scale: 0.95, 
                      y: 0,
                      transition: { duration: 0.1 }
                    }}
                    onClick={() => toggleMenu('call')}
                    className={`
                      relative flex flex-col items-center justify-center rounded-3xl
                      transition-all duration-300 group overflow-hidden
                      ${activeMenu === 'call' ? 'text-white' : 'text-gray-700'}
                    `}
                    style={{
                      background: activeMenu === 'call' 
                        ? 'linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)'
                        : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
                      boxShadow: activeMenu === 'call'
                        ? '0 15px 35px -8px rgba(245,158,11,0.6), inset 0 1px 0 rgba(255,255,255,0.4), 0 0 0 1px rgba(255,255,255,0.15)'
                        : '0 10px 30px -8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.9), 0 0 0 1px rgba(255,255,255,0.25)',
                      transform: 'perspective(500px) translateZ(6px)',
                      width: '72px',
                      height: '72px'
                    }}
                  >
                    <motion.div 
                      animate={activeMenu === 'call' ? { rotate: 8, scale: 1.1 } : { rotate: 0, scale: 1 }}
                      className="mb-1"
                    >
                      <PhoneIcon />
                    </motion.div>
                    <span className="text-xs font-bold opacity-90">{t.call}</span>
                    
                    <AnimatePresence>
                      {activeMenu === 'call' && (
                        <motion.div
                          className="absolute inset-0 rounded-3xl"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1.2 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          style={{
                            background: 'linear-gradient(135deg, rgba(245,158,11,0.4) 0%, rgba(220,38,38,0.4) 100%)',
                            filter: 'blur(12px)',
                            zIndex: -1
                          }}
                        />
                      )}
                    </AnimatePresence>
                  </motion.button>

                  {/* Directions Button */}
                  <motion.button
                    whileHover={{ 
                      scale: 1.12, 
                      y: -6,
                      rotateY: 12,
                      transition: { duration: 0.2, type: 'spring', stiffness: 400 }
                    }}
                    whileTap={{ 
                      scale: 0.95, 
                      y: 0,
                      transition: { duration: 0.1 }
                    }}
                    onClick={() => toggleMenu('directions')}
                    className={`
                      relative flex flex-col items-center justify-center rounded-3xl
                      transition-all duration-300 group overflow-hidden
                      ${activeMenu === 'directions' ? 'text-white' : 'text-gray-700'}
                    `}
                    style={{
                      background: activeMenu === 'directions' 
                        ? 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)'
                        : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
                      boxShadow: activeMenu === 'directions'
                        ? '0 15px 35px -8px rgba(139,92,246,0.6), inset 0 1px 0 rgba(255,255,255,0.4), 0 0 0 1px rgba(255,255,255,0.15)'
                        : '0 10px 30px -8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.9), 0 0 0 1px rgba(255,255,255,0.25)',
                      transform: 'perspective(500px) translateZ(6px)',
                      width: '72px',
                      height: '72px'
                    }}
                  >
                    <motion.div 
                      animate={activeMenu === 'directions' ? { rotate: -8, scale: 1.1 } : { rotate: 0, scale: 1 }}
                      className="mb-1"
                    >
                      <MapIcon />
                    </motion.div>
                    <span className="text-xs font-bold opacity-90">{t.directions}</span>
                    
                    <AnimatePresence>
                      {activeMenu === 'directions' && (
                        <motion.div
                          className="absolute inset-0 rounded-3xl"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1.2 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          style={{
                            background: 'linear-gradient(135deg, rgba(139,92,246,0.4) 0%, rgba(236,72,153,0.4) 100%)',
                            filter: 'blur(12px)',
                            zIndex: -1
                          }}
                        />
                      )}
                    </AnimatePresence>
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
