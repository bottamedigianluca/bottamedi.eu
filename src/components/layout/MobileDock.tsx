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
            // Mostra la dock solo se NON siamo nella hero section e NON siamo vicino al footer
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
  const shouldReduceMotion = useReducedMotion()
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
    <>
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
              className="relative bg-white rounded-3xl overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                boxShadow: `
                  0 25px 50px -12px rgba(0, 0, 0, 0.25),
                  0 0 0 1px rgba(255, 255, 255, 0.05),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1)
                `,
                transform: 'perspective(1000px) rotateX(2deg)'
              }}
            >
              {/* Header con effetto 3D */}
              <div 
                className="px-6 py-4 border-b border-gray-100"
                style={{
                  background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">{t.menu}</span>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeAllMenus}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-lg text-gray-600 hover:text-red-500 transition-colors"
                    style={{
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    ✕
                  </motion.button>
                </div>
              </div>
              
              {/* Grid delle sezioni con effetti 3D */}
              <div className="p-6 grid grid-cols-3 gap-4">
                {t.sections.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 20, rotateX: -15 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -5,
                      rotateX: 5,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.95, y: 0 }}
                    onClick={() => scrollToSection(item.id)}
                    className={`
                      relative flex flex-col items-center p-4 rounded-2xl transition-all duration-300
                      ${currentSection === item.id 
                        ? 'text-green-700' 
                        : 'text-gray-700'
                      }
                    `}
                    style={{
                      background: currentSection === item.id 
                        ? 'linear-gradient(145deg, #dcfce7 0%, #bbf7d0 100%)'
                        : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                      boxShadow: currentSection === item.id
                        ? `
                          0 8px 16px -4px rgba(34, 197, 94, 0.3),
                          0 0 0 1px rgba(34, 197, 94, 0.1),
                          inset 0 1px 0 rgba(255, 255, 255, 0.1)
                        `
                        : `
                          0 4px 8px -2px rgba(0, 0, 0, 0.1),
                          0 0 0 1px rgba(0, 0, 0, 0.05),
                          inset 0 1px 0 rgba(255, 255, 255, 0.1)
                        `,
                      transform: 'perspective(500px)'
                    }}
                  >
                    <div className="text-2xl mb-2 transform transition-transform duration-200">
                      {item.icon}
                    </div>
                    <span className="text-sm font-semibold leading-tight text-center">
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
            className="fixed bottom-24 left-4 right-4 z-[1000]"
          >
            <div 
              className="relative bg-white rounded-3xl overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                boxShadow: `
                  0 25px 50px -12px rgba(0, 0, 0, 0.25),
                  0 0 0 1px rgba(255, 255, 255, 0.05),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1)
                `,
                transform: 'perspective(1000px) rotateX(2deg)'
              }}
            >
              <div 
                className="px-6 py-4 border-b border-gray-100"
                style={{
                  background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
                }}
              >
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
                {/* Banchetto */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCall(t.contacts.banchettoPhone)}
                  className="w-full p-4 rounded-2xl text-left transition-all duration-300"
                  style={{
                    background: 'linear-gradient(145deg, #ecfdf5 0%, #d1fae5 100%)',
                    boxShadow: `
                      0 4px 8px -2px rgba(34, 197, 94, 0.2),
                      0 0 0 1px rgba(34, 197, 94, 0.1),
                      inset 0 1px 0 rgba(255, 255, 255, 0.1)
                    `
                  }}
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

                {/* Ingrosso */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCall(t.contacts.ingrossoPhone)}
                  className="w-full p-4 rounded-2xl text-left transition-all duration-300"
                  style={{
                    background: 'linear-gradient(145deg, #eff6ff 0%, #dbeafe 100%)',
                    boxShadow: `
                      0 4px 8px -2px rgba(59, 130, 246, 0.2),
                      0 0 0 1px rgba(59, 130, 246, 0.1),
                      inset 0 1px 0 rgba(255, 255, 255, 0.1)
                    `
                  }}
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
            <div 
              className="relative bg-white rounded-3xl overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                boxShadow: `
                  0 25px 50px -12px rgba(0, 0, 0, 0.25),
                  0 0 0 1px rgba(255, 255, 255, 0.05),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1)
                `,
                transform: 'perspective(1000px) rotateX(2deg)'
              }}
            >
              <div 
                className="px-6 py-4 border-b border-gray-100"
                style={{
                  background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)'
                }}
              >
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
                  className="w-full p-4 rounded-2xl text-left transition-all duration-300"
                  style={{
                    background: 'linear-gradient(145deg, #ecfdf5 0%, #d1fae5 100%)',
                    boxShadow: `
                      0 4px 8px -2px rgba(34, 197, 94, 0.2),
                      0 0 0 1px rgba(34, 197, 94, 0.1),
                      inset 0 1px 0 rgba(255, 255, 255, 0.1)
                    `
                  }}
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
                  className="w-full p-4 rounded-2xl text-left transition-all duration-300"
                  style={{
                    background: 'linear-gradient(145deg, #eff6ff 0%, #dbeafe 100%)',
                    boxShadow: `
                      0 4px 8px -2px rgba(59, 130, 246, 0.2),
                      0 0 0 1px rgba(59, 130, 246, 0.1),
                      inset 0 1px 0 rgba(255, 255, 255, 0.1)
                    `
                  }}
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
            transition={{ 
              type: 'spring', 
              damping: 20, 
              stiffness: 300,
              opacity: { duration: 0.2 }
            }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[1001]"
          >
            <div 
              className="relative px-2 py-2"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: '28px',
                boxShadow: `
                  0 32px 64px -12px rgba(0, 0, 0, 0.4),
                  0 0 0 1px rgba(255, 255, 255, 0.1),
                  inset 0 1px 0 rgba(255, 255, 255, 0.2),
                  inset 0 -1px 0 rgba(0, 0, 0, 0.1)
                `,
                transform: 'perspective(1000px) rotateX(8deg)',
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Piano della dock con ombra interna */}
              <div 
                className="absolute inset-2 rounded-3xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 100%)',
                  transform: 'translateZ(-2px)'
                }}
              />
              
              <div className="relative flex items-center space-x-1">
                {/* Pulsante Menu */}
                <motion.button
                  whileHover={{ 
                    scale: 1.1, 
                    y: -4,
                    rotateY: 10,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ 
                    scale: 0.95, 
                    y: 0,
                    transition: { duration: 0.1 }
                  }}
                  onClick={() => toggleMenu('menu')}
                  className={`
                    relative flex flex-col items-center justify-center w-16 h-16 rounded-2xl
                    transition-all duration-300 group
                    ${activeMenu === 'menu' ? 'text-green-600' : 'text-gray-700'}
                  `}
                  style={{
                    background: activeMenu === 'menu' 
                      ? 'linear-gradient(145deg, #f0fdf4 0%, #dcfce7 100%)'
                      : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                    boxShadow: activeMenu === 'menu'
                      ? `
                        0 8px 25px -8px rgba(34, 197, 94, 0.6),
                        0 0 0 1px rgba(34, 197, 94, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.3),
                        inset 0 -1px 0 rgba(34, 197, 94, 0.1)
                      `
                      : `
                        0 6px 20px -6px rgba(0, 0, 0, 0.3),
                        0 0 0 1px rgba(255, 255, 255, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.3),
                        inset 0 -1px 0 rgba(0, 0, 0, 0.1)
                      `,
                    transform: 'perspective(500px) translateZ(4px)',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <motion.div 
                    animate={activeMenu === 'call' ? { rotate: 5, scale: 1.1 } : { rotate: 0, scale: 1 }}
                    className="text-xl mb-1"
                  >
                    📞
                  </motion.div>
                  <span className="text-xs font-semibold">{t.call}</span>
                </motion.button>

                {/* Pulsante Directions */}
                <motion.button
                  whileHover={{ 
                    scale: 1.1, 
                    y: -4,
                    rotateY: 10,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ 
                    scale: 0.95, 
                    y: 0,
                    transition: { duration: 0.1 }
                  }}
                  onClick={() => toggleMenu('directions')}
                  className={`
                    relative flex flex-col items-center justify-center w-16 h-16 rounded-2xl
                    transition-all duration-300 group
                    ${activeMenu === 'directions' ? 'text-purple-600' : 'text-gray-700'}
                  `}
                  style={{
                    background: activeMenu === 'directions' 
                      ? 'linear-gradient(145deg, #faf5ff 0%, #f3e8ff 100%)'
                      : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                    boxShadow: activeMenu === 'directions'
                      ? `
                        0 8px 25px -8px rgba(147, 51, 234, 0.6),
                        0 0 0 1px rgba(147, 51, 234, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.3),
                        inset 0 -1px 0 rgba(147, 51, 234, 0.1)
                      `
                      : `
                        0 6px 20px -6px rgba(0, 0, 0, 0.3),
                        0 0 0 1px rgba(255, 255, 255, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.3),
                        inset 0 -1px 0 rgba(0, 0, 0, 0.1)
                      `,
                    transform: 'perspective(500px) translateZ(4px)',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <motion.div 
                    animate={activeMenu === 'directions' ? { rotate: -5, scale: 1.1 } : { rotate: 0, scale: 1 }}
                    className="text-xl mb-1"
                  >
                    🗺️
                  </motion.div>
                  <span className="text-xs font-semibold">{t.directions}</span>
                </motion.button>

                {/* Pulsante WhatsApp */}
                <motion.button
                  whileHover={{ 
                    scale: 1.1, 
                    y: -4,
                    rotateY: -10,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ 
                    scale: 0.95, 
                    y: 0,
                    transition: { duration: 0.1 }
                  }}
                  onClick={handleWhatsApp}
                  className="relative flex flex-col items-center justify-center w-16 h-16 rounded-2xl
                    transition-all duration-300 group text-green-600"
                  style={{
                    background: 'linear-gradient(145deg, #f0fdf4 0%, #dcfce7 100%)',
                    boxShadow: `
                      0 6px 20px -6px rgba(34, 197, 94, 0.4),
                      0 0 0 1px rgba(34, 197, 94, 0.2),
                      inset 0 1px 0 rgba(255, 255, 255, 0.3),
                      inset 0 -1px 0 rgba(34, 197, 94, 0.1)
                    `,
                    transform: 'perspective(500px) translateZ(4px)',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <motion.div 
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className="text-xl mb-1"
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
    </>
  )
}

export default PremiumMobileDock(4px)',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <motion.div 
                    animate={activeMenu === 'menu' ? { rotate: 180, scale: 1.1 } : { rotate: 0, scale: 1 }}
                    className="text-xl font-bold mb-1"
                  >
                    ☰
                  </motion.div>
                  <span className="text-xs font-semibold">{t.menu}</span>
                </motion.button>

                {/* Pulsante Call */}
                <motion.button
                  whileHover={{ 
                    scale: 1.1, 
                    y: -4,
                    rotateY: -10,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ 
                    scale: 0.95, 
                    y: 0,
                    transition: { duration: 0.1 }
                  }}
                  onClick={() => toggleMenu('call')}
                  className={`
                    relative flex flex-col items-center justify-center w-16 h-16 rounded-2xl
                    transition-all duration-300 group
                    ${activeMenu === 'call' ? 'text-blue-600' : 'text-gray-700'}
                  `}
                  style={{
                    background: activeMenu === 'call' 
                      ? 'linear-gradient(145deg, #eff6ff 0%, #dbeafe 100%)'
                      : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                    boxShadow: activeMenu === 'call'
                      ? `
                        0 8px 25px -8px rgba(59, 130, 246, 0.6),
                        0 0 0 1px rgba(59, 130, 246, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.3),
                        inset 0 -1px 0 rgba(59, 130, 246, 0.1)
                      `
                      : `
                        0 6px 20px -6px rgba(0, 0, 0, 0.3),
                        0 0 0 1px rgba(255, 255, 255, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.3),
                        inset 0 -1px 0 rgba(0, 0, 0, 0.1)
                      `,
                    transform: 'perspective(500px) translateZ
