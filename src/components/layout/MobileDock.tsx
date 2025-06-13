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

// 🎨 ICONE SVG CON DESIGN MODERNO
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

// 🚀 HOOK OTTIMIZZATO PER SCROLL DETECTION
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

  // 🎯 VARIANTI ANIMATE FLUIDE
  const popupVariants = {
    hidden: { 
      y: 60, 
      opacity: 0, 
      scale: 0.95
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8,
        duration: 0.4
      }
    },
    exit: {
      y: 40,
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.25,
        ease: "easeInOut"
      }
    }
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  }

  const dockVariants = {
    hidden: { 
      y: 120, 
      opacity: 0, 
      scale: 0.8
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 250,
        damping: 25,
        mass: 0.9,
        duration: 0.6
      }
    },
    exit: {
      y: 100,
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    })
  }

  return (
    <div className="lg:hidden pointer-events-none">
      {/* 🌟 BACKDROP CON SUPERCERCHI */}
      <AnimatePresence>
        {activeMenu !== 'none' && (
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
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

      {/* 📱 MENU POPUP CON SUPERCERCHI */}
      <AnimatePresence>
        {activeMenu === 'menu' && isVisible && (
          <motion.div
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-32 left-4 right-4 z-[1000] pointer-events-auto"
            style={{ willChange: 'transform, opacity' }}
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

              {/* Header con gradiente dinamico */}
              <motion.div 
                className="relative px-6 py-4 border-b border-white/30"
                style={{
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(34,197,94,0.1) 100%)'
                }}
                animate={{
                  background: [
                    'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(34,197,94,0.1) 100%)',
                    'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(59,130,246,0.1) 100%)',
                    'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(34,197,94,0.1) 100%)'
                  ]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <motion.div 
                      className="relative w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg overflow-hidden"
                      animate={{
                        background: [
                          'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
                          'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                          'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)'
                        ]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {/* Supercerchio nell'icona */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        style={{
                          background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%)'
                        }}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      <MenuIcon />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{t.menu}</h3>
                      <p className="text-sm text-gray-600">Naviga il sito</p>
                    </div>
                  </div>
                                      <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeAllMenus}
                    className="relative w-10 h-10 flex items-center justify-center rounded-2xl bg-white/90 shadow-md text-gray-600 hover:text-red-500 transition-colors overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: 'radial-gradient(circle at center, rgba(239,68,68,0.1) 0%, transparent 70%)'
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                    <CloseIcon />
                  </motion.button>
                </div>
              </motion.div>
              
              {/* Contact Cards con supercerchi */}
              <div className="relative p-6 space-y-4">
                <motion.div
                  variants={itemVariants}
                  custom={0}
                  initial="hidden"
                  animate="visible"
                  className="relative p-4 rounded-2xl border border-green-200 overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(16,185,129,0.05) 0%, rgba(5,150,105,0.1) 100%)'
                  }}
                >
                  {/* Supercerchio per banchetto */}
                  <motion.div
                    className="absolute w-16 h-16 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)',
                      top: '-20%',
                      right: '-10%'
                    }}
                    animate={{
                      scale: [1, 1.3, 1],
                      rotate: [0, 360, 0]
                    }}
                    transition={{
                      duration: 12,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  
                  <div className="relative flex items-start space-x-4 mb-3">
                    <motion.div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg shadow-lg overflow-hidden"
                      animate={{
                        background: [
                          'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                          'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        ]
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        style={{
                          background: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4) 0%, transparent 60%)'
                        }}
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.4, 0.7, 0.4]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      🛒
                    </motion.div>
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
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCall(t.contacts.banchettoPhone)}
                    className="relative w-full flex items-center justify-center p-3 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all overflow-hidden"
                    animate={{
                      background: [
                        'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                        'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      ]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)'
                      }}
                      animate={{
                        scale: [0, 2, 0],
                        opacity: [0, 0.5, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <PhoneIcon />
                    <span className="ml-2">Chiama {t.contacts.banchettoPhone}</span>
                  </motion.button>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  custom={1}
                  initial="hidden"
                  animate="visible"
                  className="relative p-4 rounded-2xl border border-blue-200 overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.05) 0%, rgba(37,99,235,0.1) 100%)'
                  }}
                >
                  {/* Supercerchio per ingrosso */}
                  <motion.div
                    className="absolute w-14 h-14 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)',
                      bottom: '-10%',
                      left: '-5%'
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      x: [0, 10, 0],
                      y: [0, -10, 0]
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  <div className="relative flex items-start space-x-4 mb-3">
                    <motion.div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg shadow-lg overflow-hidden"
                      animate={{
                        background: [
                          'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                          'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
                          'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                        ]
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        style={{
                          background: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4) 0%, transparent 60%)'
                        }}
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.4, 0.7, 0.4]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      🚛
                    </motion.div>
                    <div className="flex-1">
                      <h4 className="font-bold text-blue-900 mb-1">{t.contacts.ingrosso}</h4>
                      <p className="text-blue-700 text-sm">{t.contacts.ingrossoAddress}</p>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCall(t.contacts.ingrossoPhone)}
                    className="relative w-full flex items-center justify-center p-3 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all overflow-hidden"
                    animate={{
                      background: [
                        'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
                        'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                      ]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)'
                      }}
                      animate={{
                        scale: [0, 2, 0],
                        opacity: [0, 0.5, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <PhoneIcon />
                    <span className="ml-2">Chiama {t.contacts.ingrossoPhone}</span>
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🗺️ DIRECTIONS POPUP CON SUPERCERCHI */}
      <AnimatePresence>
        {activeMenu === 'directions' && isVisible && (
          <motion.div
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-32 left-4 right-4 z-[1000] pointer-events-auto"
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="relative overflow-hidden bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50">
              {/* Supercerchi per directions */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <motion.div
                  className="absolute w-32 h-32 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(147,51,234,0.12) 0%, transparent 70%)',
                    top: '-15%',
                    left: '-10%'
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <motion.div
                  className="absolute w-24 h-24 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)',
                    bottom: '-10%',
                    right: '-10%'
                  }}
                  animate={{
                    scale: [1, 1.4, 1],
                    x: [0, -20, 0],
                    y: [0, 20, 0]
                  }}
                  transition={{
                    duration: 14,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>

              {/* Header */}
              <motion.div 
                className="relative px-6 py-4 border-b border-white/30"
                animate={{
                  background: [
                    'linear-gradient(135deg, rgba(147,51,234,0.1) 0%, rgba(236,72,153,0.1) 100%)',
                    'linear-gradient(135deg, rgba(236,72,153,0.1) 0%, rgba(147,51,234,0.1) 100%)',
                    'linear-gradient(135deg, rgba(147,51,234,0.1) 0%, rgba(236,72,153,0.1) 100%)'
                  ]
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <motion.div 
                      className="relative w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg overflow-hidden"
                      animate={{
                        background: [
                          'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
                          'linear-gradient(135deg, #ec4899 0%, #9333ea 100%)',
                          'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)'
                        ]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        style={{
                          background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%)'
                        }}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      <MapIcon />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{t.directions}</h3>
                      <p className="text-sm text-gray-600">Come raggiungerci</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeAllMenus}
                    className="relative w-10 h-10 flex items-center justify-center rounded-2xl bg-white/90 shadow-md text-gray-600 hover:text-red-500 transition-colors overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: 'radial-gradient(circle at center, rgba(239,68,68,0.1) 0%, transparent 70%)'
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                    <CloseIcon />
                  </motion.button>
                </div>
              </motion.div>
              
              {/* Location Cards */}
              <div className="relative p-6 space-y-4">
                <motion.button
                  variants={itemVariants}
                  custom={0}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDirections('banchetto')}
                  className="relative w-full p-4 rounded-2xl border border-green-200 text-left overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(16,185,129,0.05) 0%, rgba(5,150,105,0.1) 100%)'
                  }}
                >
                  {/* Supercerchio location 1 */}
                  <motion.div
                    className="absolute w-20 h-20 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
                      top: '-25%',
                      right: '-15%'
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, -360, 0]
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  
                  <div className="relative flex items-center space-x-4">
                    <motion.div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg overflow-hidden"
                      animate={{
                        background: [
                          'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                          'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        ]
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        style={{
                          background: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.4) 0%, transparent 60%)'
                        }}
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.4, 0.7, 0.4]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      <MapIcon />
                    </motion.div>
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
                  variants={itemVariants}
                  custom={1}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDirections('ingrosso')}
                  className="relative w-full p-4 rounded-2xl border border-blue-200 text-left overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.05) 0%, rgba(37,99,235,0.1) 100%)'
                  }}
                >
                  {/* Supercerchio location 2 */}
                  <motion.div
                    className="absolute w-18 h-18 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
                      bottom: '-20%',
                      left: '-10%'
                    }}
                    animate={{
                      scale: [1, 1.3, 1],
                      x: [0, 15, 0],
                      y: [0, -15, 0]
                    }}
                    transition={{
                      duration: 16,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  <div className="relative flex items-center space-x-4">
                    <motion.div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg overflow-hidden"
                      animate={{
                        background: [
                          'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                          'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
                          'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                        ]
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        style={{
                          background: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.4) 0%, transparent 60%)'
                        }}
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.4, 0.7, 0.4]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      <MapIcon />
                    </motion.div>
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

      {/* 🚀 DOCK PRINCIPALE CON SUPERCERCHI E COLORI DINAMICI */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            variants={dockVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-0 left-0 right-0 z-[1001] pointer-events-none"
            style={{
              paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
              paddingLeft: 'env(safe-area-inset-left)',
              paddingRight: 'env(safe-area-inset-right)',
              willChange: 'transform, opacity'
            }}
          >
            <div className="flex justify-center px-4">
              <motion.div 
                className="relative pointer-events-auto rounded-3xl p-3 shadow-2xl border border-white/30 overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.08) 100%)',
                  backdropFilter: 'blur(25px)'
                }}
                animate={{
                  background: [
                    'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.08) 100%)',
                    'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(34,197,94,0.1) 100%)',
                    'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.08) 100%)'
                  ]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
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
                      rotateY: 10,
                      transition: { duration: 0.2, type: 'spring', stiffness: 400 }
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleMenu('menu')}
                    className={`
                      relative w-16 h-16 rounded-2xl flex flex-col items-center justify-center
                      transition-all duration-300 overflow-hidden
                      ${activeMenu === 'menu' ? 'text-white shadow-2xl' : 'bg-white/90 text-gray-700 shadow-lg hover:shadow-xl'}
                    `}
                    style={{ willChange: 'transform' }}
                    animate={activeMenu === 'menu' ? {
                      background: [
                        'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
                        'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                        'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)'
                      ]
                    } : {}}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
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
                      className="mb-1"
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
                      rotateY: -10,
                      transition: { duration: 0.2, type: 'spring', stiffness: 400 }
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleMenu('call')}
                    className={`
                      relative w-16 h-16 rounded-2xl flex flex-col items-center justify-center
                      transition-all duration-300 overflow-hidden
                      ${activeMenu === 'call' ? 'text-white shadow-2xl' : 'bg-white/90 text-gray-700 shadow-lg hover:shadow-xl'}
                    `}
                    style={{ willChange: 'transform' }}
                    animate={activeMenu === 'call' ? {
                      background: [
                        'linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)',
                        'linear-gradient(135deg, #dc2626 0%, #f59e0b 100%)',
                        'linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)'
                      ]
                    } : {}}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
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
                      className="mb-1"
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
                      rotateY: 10,
                      transition: { duration: 0.2, type: 'spring', stiffness: 400 }
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleMenu('directions')}
                    className={`
                      relative w-16 h-16 rounded-2xl flex flex-col items-center justify-center
                      transition-all duration-300 overflow-hidden
                      ${activeMenu === 'directions' ? 'text-white shadow-2xl' : 'bg-white/90 text-gray-700 shadow-lg hover:shadow-xl'}
                    `}
                    style={{ willChange: 'transform' }}
                    animate={activeMenu === 'directions' ? {
                      background: [
                        'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
                        'linear-gradient(135deg, #ec4899 0%, #9333ea 100%)',
                        'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)'
                      ]
                    } : {}}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
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
                      className="mb-1"
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
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PremiumMobileDock>
                </div>
              </motion.div>
              
              {/* Menu Items con supercerchi */}
              <div className="relative p-6">
                <div className="grid grid-cols-2 gap-3">
                  {t.sections.map((item, index) => (
                    <motion.button
                      key={item.id}
                      custom={index}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => scrollToSection(item.id)}
                      className={`
                        relative flex items-center p-4 rounded-2xl transition-all duration-300 min-h-[60px] overflow-hidden
                        ${currentSection === item.id 
                          ? 'text-white shadow-xl' 
                          : 'bg-white/70 text-gray-700 hover:bg-white/90 shadow-md hover:shadow-lg'
                        }
                      `}
                      style={{
                        background: currentSection === item.id 
                          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                          : undefined
                      }}
                      animate={currentSection === item.id ? {
                        background: [
                          'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                          'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        ]
                      } : {}}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
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

      {/* 📞 CALL POPUP CON SUPERCERCHI */}
      <AnimatePresence>
        {activeMenu === 'call' && isVisible && (
          <motion.div
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-32 left-4 right-4 z-[1000] pointer-events-auto"
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="relative overflow-hidden bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50">
              {/* Supercerchi per call */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <motion.div
                  className="absolute w-28 h-28 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)',
                    top: '-5%',
                    right: '-5%'
                  }}
                  animate={{
                    scale: [1, 1.4, 1],
                    rotate: [0, -180, -360]
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <motion.div
                  className="absolute w-20 h-20 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(220,38,38,0.2) 0%, transparent 70%)',
                    bottom: '10%',
                    left: '10%'
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 15, 0],
                    y: [0, -15, 0]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>

              {/* Header con gradiente dinamico */}
              <motion.div 
                className="relative px-6 py-4 border-b border-white/30"
                animate={{
                  background: [
                    'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(220,38,38,0.1) 100%)',
                    'linear-gradient(135deg, rgba(220,38,38,0.1) 0%, rgba(245,158,11,0.1) 100%)',
                    'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(220,38,38,0.1) 100%)'
                  ]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <motion.div 
                      className="relative w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg overflow-hidden"
                      animate={{
                        background: [
                          'linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)',
                          'linear-gradient(135deg, #dc2626 0%, #f59e0b 100%)',
                          'linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)'
                        ]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        style={{
                          background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%)'
                        }}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      <PhoneIcon />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{t.call}</h3>
                      <p className="text-sm text-gray-600">Contattaci direttamente</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeAllMenus}
                    className="relative w-10 h-10 flex items-center justify-center rounded-2xl bg-white/90 shadow-md text-gray-600 hover:text-red-500 transition-colors overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: 'radial-gradient(circle at center, rgba(239,68,68,0.1) 0%, transparent 70%)'
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                    <CloseIcon />
                  </motion.button
