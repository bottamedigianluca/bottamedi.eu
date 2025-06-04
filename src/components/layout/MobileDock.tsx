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
      { id: 'about', label: 'Storia' },
      { id: 'dettaglio', label: 'Banchetto' },
      { id: 'services', label: 'Servizi' },
      { id: 'products', label: 'Prodotti' },
      { id: 'wholesale', label: 'Listino' },
      { id: 'contact', label: 'Contatti' }
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
      { id: 'about', label: 'Geschichte' },
      { id: 'dettaglio', label: 'Marktstand' },
      { id: 'services', label: 'Service' },
      { id: 'products', label: 'Produkte' },
      { id: 'wholesale', label: 'Preisliste' },
      { id: 'contact', label: 'Kontakt' }
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

// Icone SVG personalizzate
const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
    <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const MapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.097"/>
  </svg>
)

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
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
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - offset
      window.scrollTo({
        top: Math.max(0, elementPosition),
        behavior: 'smooth'
      })
      setActiveMenu('none')
      
      // Haptic feedback
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

  const handleWhatsApp = useCallback(() => {
    const message = encodeURIComponent(
      language === 'it' 
        ? 'Ciao! Sono interessato ai vostri prodotti.' 
        : 'Hallo! Ich interessiere mich für Ihre Produkte.'
    )
    window.open(`https://wa.me/393515776198?text=${message}`, '_blank')
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] pointer-events-auto"
            onClick={closeAllMenus}
          />
        )}
      </AnimatePresence>

      {/* Menu Popup */}
      <AnimatePresence>
        {activeMenu === 'menu' && isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9, rotateX: -15 }}
            animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ y: 100, opacity: 0, scale: 0.9, rotateX: -15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className="fixed bottom-24 left-4 right-4 z-[1000] pointer-events-auto"
          >
            <div 
              className="relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: '24px',
                boxShadow: '0 20px 40px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.8)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              {/* Header */}
              <div 
                className="px-6 py-4 border-b border-white/20"
                style={{
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(34,197,94,0.1) 100%)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <MenuIcon />
                    </div>
                    <span className="text-lg font-bold text-gray-900">{t.menu}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeAllMenus}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/80 backdrop-blur-sm shadow-lg text-gray-600 hover:text-red-500 transition-colors border border-white/30"
                  >
                    <CloseIcon />
                  </motion.button>
                </div>
              </div>
              
              {/* Grid delle sezioni */}
              <div className="p-6 grid grid-cols-2 gap-4">
                {t.sections.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 20, rotateX: -10 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    whileHover={{ 
                      scale: 1.02, 
                      y: -3,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.98, y: 0 }}
                    onClick={() => scrollToSection(item.id)}
                    className={`
                      relative flex items-center justify-center p-4 rounded-2xl transition-all duration-300 min-h-[60px]
                      ${currentSection === item.id 
                        ? 'text-white' 
                        : 'text-gray-700 hover:text-gray-900'
                      }
                    `}
                    style={{
                      background: currentSection === item.id 
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(248,250,252,0.8) 100%)',
                      boxShadow: currentSection === item.id
                        ? '0 8px 25px -8px rgba(16,185,129,0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
                        : '0 4px 12px -4px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)',
                      border: currentSection === item.id 
                        ? '1px solid rgba(255,255,255,0.2)'
                        : '1px solid rgba(255,255,255,0.3)'
                    }}
                  >
                    <span className="text-sm font-semibold text-center leading-tight">
                      {item.label}
                    </span>
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
            className="fixed bottom-24 left-4 right-4 z-[1000] pointer-events-auto"
          >
            <div 
              className="relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: '24px',
                boxShadow: '0 20px 40px -12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.8)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              <div 
                className="px-6 py-4 border-b border-white/20"
                style={{
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(147,51,234,0.1) 100%)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
                      <PhoneIcon />
                    </div>
                    <span className="text-lg font-bold text-gray-900">{t.call}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeAllMenus}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/80 shadow-lg text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <CloseIcon />
                  </motion.button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCall(t.contacts.banchettoPhone)}
                  className="w-full p-4 rounded-2xl text-left transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(5,150,105,0.1) 100%)',
                    border: '1px solid rgba(16,185,129,0.2)',
                    boxShadow: '0 4px 12px -4px rgba(16,185,129,0.3)'
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg">
                      🛒
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-green-900 text-lg">{t.contacts.banchetto}</h3>
                      <p className="text-green-700 font-mono text-lg">{t.contacts.banchettoPhone}</p>
                      <p className="text-green-600 text-sm">{t.contacts.banchettoAddress}</p>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCall(t.contacts.ingrossoPhone)}
                  className="w-full p-4 rounded-2xl text-left transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(37,99,235,0.1) 100%)',
                    border: '1px solid rgba(59,130,246,0.2)',
                    boxShadow: '0 4px 12px -4px rgba(59,130,246,0.3)'
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg">
                      🚛
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-blue-900 text-lg">{t.contacts.ingrosso}</h3>
                      <p className="text-blue-700 font-mono text-lg">{t.contacts.ingrossoPhone}</p>
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
            className="fixed bottom-24 left-4 right-4 z-[1000] pointer-events-auto"
          >
            <div 
              className="relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: '24px',
                boxShadow: '0 20px 40px -12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.8)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              <div 
                className="px-6 py-4 border-b border-white/20"
                style={{
                  background: 'linear-gradient(135deg, rgba(147,51,234,0.1) 0%, rgba(168,85,247,0.1) 100%)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white">
                      <MapIcon />
                    </div>
                    <span className="text-lg font-bold text-gray-900">{t.directions}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeAllMenus}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/80 shadow-lg text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <CloseIcon />
                  </motion.button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDirections('banchetto')}
                  className="w-full p-4 rounded-2xl text-left transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(5,150,105,0.1) 100%)',
                    border: '1px solid rgba(16,185,129,0.2)',
                    boxShadow: '0 4px 12px -4px rgba(16,185,129,0.3)'
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                      <MapIcon />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-green-900 text-lg">{t.contacts.banchetto}</h3>
                      <p className="text-green-600">{t.contacts.banchettoAddress}</p>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDirections('ingrosso')}
                  className="w-full p-4 rounded-2xl text-left transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(37,99,235,0.1) 100%)',
                    border: '1px solid rgba(59,130,246,0.2)',
                    boxShadow: '0 4px 12px -4px rgba(59,130,246,0.3)'
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                      <MapIcon />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-blue-900 text-lg">{t.contacts.ingrosso}</h3>
                      <p className="text-blue-600">{t.contacts.ingrossoAddress}</p>
                    </div>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DOCK PRINCIPALE - Design rivoluzionario */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.8 }}
            transition={{ 
              type: 'spring', 
              damping: 20, 
              stiffness: 300,
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
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderRadius: '32px',
                  padding: '8px',
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                {/* Piano della dock con ombra profonda */}
                <div 
                  className="absolute inset-2 rounded-3xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 100%)',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                  }}
                />
                
                <div className="relative flex items-center space-x-3">
                  {/* Menu Button */}
                  <motion.button
                    whileHover={{ 
                      scale: 1.15, 
                      y: -8,
                      rotateY: 15,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ 
                      scale: 0.95, 
                      y: 0,
                      transition: { duration: 0.1 }
                    }}
                    onClick={() => toggleMenu('menu')}
                    className={`
                      relative flex flex-col items-center justify-center w-16 h-16 rounded-3xl
                      transition-all duration-300 group overflow-hidden
                      ${activeMenu === 'menu' ? 'text-white' : 'text-gray-700'}
                    `}
                    style={{
                      background: activeMenu === 'menu' 
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)',
                      boxShadow: activeMenu === 'menu'
                        ? '0 12px 30px -8px rgba(16,185,129,0.6), inset 0 1px 0 rgba(255,255,255,0.3), 0 0 0 1px rgba(255,255,255,0.1)'
                        : '0 8px 25px -8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.8), 0 0 0 1px rgba(255,255,255,0.2)',
                      transform: 'perspective(400px) translateZ(4px)'
                    }}
                  >
                    <motion.div 
                      animate={activeMenu === 'menu' ? { rotate: 180, scale: 1.1 } : { rotate: 0, scale: 1 }}
                      className="mb-1"
                    >
                      <MenuIcon />
                    </motion.div>
                    <span className="text-xs font-bold opacity-90">{t.menu}</span>
                    
                    {/* Glow effect quando attivo */}
                    {activeMenu === 'menu' && (
                      <motion.div
                        className="absolute inset-0 rounded-3xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                          background: 'linear-gradient(135deg, rgba(16,185,129,0.3) 0%, rgba(5,150,105,0.3) 100%)',
                          filter: 'blur(8px)',
                          transform: 'scale(1.2)'
                        }}
                      />
                    )}
                  </motion.button>

                  {/* Call Button */}
                  <motion.button
                    whileHover={{ 
                      scale: 1.15, 
                      y: -8,
                      rotateY: -15,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ 
                      scale: 0.95, 
                      y: 0,
                      transition: { duration: 0.1 }
                    }}
                    onClick={() => toggleMenu('call')}
                    className={`
                      relative flex flex-col items-center justify-center w-16 h-16 rounded-3xl
                      transition-all duration-300 group overflow-hidden
                      ${activeMenu === 'call' ? 'text-white' : 'text-gray-700'}
                    `}
                    style={{
                      background: activeMenu === 'call' 
                        ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                        : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)',
                      boxShadow: activeMenu === 'call'
                        ? '0 12px 30px -8px rgba(59,130,246,0.6), inset 0 1px 0 rgba(255,255,255,0.3), 0 0 0 1px rgba(255,255,255,0.1)'
                        : '0 8px 25px -8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.8), 0 0 0 1px rgba(255,255,255,0.2)',
                      transform: 'perspective(400px) translateZ(4px)'
                    }}
                  >
                    <motion.div 
                      animate={activeMenu === 'call' ? { rotate: 10, scale: 1.1 } : { rotate: 0, scale: 1 }}
                      className="mb-1"
                    >
                      <PhoneIcon />
                    </motion.div>
                    <span className="text-xs font-bold opacity-90">{t.call}</span>
                    
                    {activeMenu === 'call' && (
                      <motion.div
                        className="absolute inset-0 rounded-3xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                          background: 'linear-gradient(135deg, rgba(59,130,246,0.3) 0%, rgba(29,78,216,0.3) 100%)',
                          filter: 'blur(8px)',
                          transform: 'scale(1.2)'
                        }}
                      />
                    )}
                  </motion.button>

                  {/* Directions Button */}
                  <motion.button
                    whileHover={{ 
                      scale: 1.15, 
                      y: -8,
                      rotateY: 15,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ 
                      scale: 0.95, 
                      y: 0,
                      transition: { duration: 0.1 }
                    }}
                    onClick={() => toggleMenu('directions')}
                    className={`
                      relative flex flex-col items-center justify-center w-16 h-16 rounded-3xl
                      transition-all duration-300 group overflow-hidden
                      ${activeMenu === 'directions' ? 'text-white' : 'text-gray-700'}
                    `}
                    style={{
                      background: activeMenu === 'directions' 
                        ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
                        : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)',
                      boxShadow: activeMenu === 'directions'
                        ? '0 12px 30px -8px rgba(139,92,246,0.6), inset 0 1px 0 rgba(255,255,255,0.3), 0 0 0 1px rgba(255,255,255,0.1)'
                        : '0 8px 25px -8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.8), 0 0 0 1px rgba(255,255,255,0.2)',
                      transform: 'perspective(400px) translateZ(4px)'
                    }}
                  >
                    <motion.div 
                      animate={activeMenu === 'directions' ? { rotate: -10, scale: 1.1 } : { rotate: 0, scale: 1 }}
                      className="mb-1"
                    >
                      <MapIcon />
                    </motion.div>
                    <span className="text-xs font-bold opacity-90">{t.directions}</span>
                    
                    {activeMenu === 'directions' && (
                      <motion.div
                        className="absolute inset-0 rounded-3xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                          background: 'linear-gradient(135deg, rgba(139,92,246,0.3) 0%, rgba(124,58,237,0.3) 100%)',
                          filter: 'blur(8px)',
                          transform: 'scale(1.2)'
                        }}
                      />
                    )}
                  </motion.button>

                  {/* WhatsApp Button */}
                  <motion.button
                    whileHover={{ 
                      scale: 1.15, 
                      y: -8,
                      rotateY: -15,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ 
                      scale: 0.95, 
                      y: 0,
                      transition: { duration: 0.1 }
                    }}
                    onClick={handleWhatsApp}
                    className="relative flex flex-col items-center justify-center w-16 h-16 rounded-3xl
                      transition-all duration-300 group text-white overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)',
                      boxShadow: '0 12px 30px -8px rgba(37,211,102,0.6), inset 0 1px 0 rgba(255,255,255,0.3), 0 0 0 1px rgba(255,255,255,0.1)',
                      transform: 'perspective(400px) translateZ(4px)'
                    }}
                  >
                    <motion.div 
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      className="mb-1"
                    >
                      <WhatsAppIcon />
                    </motion.div>
                    <span className="text-xs font-bold opacity-90">{t.whatsapp}</span>
                    
                    {/* Sempre con glow per WhatsApp */}
                    <motion.div
                      className="absolute inset-0 rounded-3xl"
                      animate={{ 
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1.1, 1.3, 1.1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      style={{
                        background: 'linear-gradient(135deg, rgba(37,211,102,0.4) 0%, rgba(18,140,126,0.4) 100%)',
                        filter: 'blur(8px)'
                      }}
                    />
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
