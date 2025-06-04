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
            const isInHero = sectionId === 'hero'
            const isNearFooter = window.scrollY + window.innerHeight > document.body.scrollHeight - 100
            setIsVisible(!isInHero && !isNearFooter)
            break
          }
        } else {
          // Se una sezione non viene trovata, assicurati che la dock non appaia in modo anomalo
          // Questo potrebbe accadere se gli ID in App.tsx non sono corretti o la sezione non è renderizzata
           if (sectionId === 'hero' && scrollPosition < (document.getElementById('about')?.offsetTop || Infinity)) {
             setIsVisible(false); // Nascondi se siamo sopra la prima sezione effettiva
           }
        }
      }
       // Fallback nel caso nessuna sezione sia trovata (improbabile se gli ID sono corretti)
      const heroElement = document.getElementById('hero');
      if (heroElement && scrollPosition < heroElement.offsetTop + heroElement.offsetHeight) {
           if (currentSection !== 'hero') setCurrentSection('hero');
           setIsVisible(false);
      }
    }

    const handleScroll = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(detectSection, 10)
    }

    detectSection() // Chiamata iniziale
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timeoutId)
    }
  }, [currentSection]) // Aggiunto currentSection per rieseguire se cambia per altre ragioni

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
    setActiveMenu(prev => {
      const newState = prev === menu ? 'none' : menu
      setTimeout(() => {
        if (document.activeElement && document.activeElement instanceof HTMLElement) {
          document.activeElement.blur()
        }
      }, 100)
      return newState
    })
  }, [])

  const closeAllMenus = useCallback(() => {
    setActiveMenu('none')
    if (document.activeElement && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }, [])

  const variants = useMemo(() => ({
    dock: {
      hidden: { y: 100, opacity: 0, scale: 0.95 },
      visible: { 
        y: 0, 
        opacity: 1, 
        scale: 1,
        transition: {
          type: 'spring',
          damping: 30,
          stiffness: 400,
          duration: shouldReduceMotion ? 0.1 : undefined
        }
      }
    },
    popup: {
      hidden: { y: 20, opacity: 0, scale: 0.95 },
      visible: { 
        y: 0, 
        opacity: 1, 
        scale: 1,
        transition: {
          type: 'spring',
          damping: 25,
          stiffness: 500,
          duration: shouldReduceMotion ? 0.1 : undefined
        }
      }
    },
    button: {
      idle: { scale: 1, y: 0 },
      hover: { scale: 1.05, y: -2 },
      tap: { scale: 0.95, y: 0 }
    }
  }), [shouldReduceMotion])

  if (!isMobile) return null // Modificato: Nascondi sempre se non è mobile, la visibilità da scroll è gestita da AnimatePresence

  return (
    <>
      <AnimatePresence>
        {activeMenu !== 'none' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9997]"
            onClick={closeAllMenus}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeMenu === 'menu' && isVisible && ( // Aggiunto isVisible qui
          <motion.div
            variants={variants.popup}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed bottom-20 left-3 right-3 z-[9999]" // Assicurati che questa posizione sia sopra il dock
          >
            <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100/50 flex items-center justify-between bg-gradient-to-r from-gray-50/50 to-transparent">
                <span className="text-base font-bold text-gray-900">{t.menu}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeAllMenus}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100/80 text-gray-600 text-sm hover:bg-gray-200/80 transition-colors"
                >
                  ✕
                </motion.button>
              </div>
              <div className="p-4 grid grid-cols-3 gap-3">
                {t.sections.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: shouldReduceMotion ? 0 : index * 0.03, duration: shouldReduceMotion ? 0.1 : 0.3 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => scrollToSection(item.id)}
                    onBlur={() => {}}
                    className={`
                      flex flex-col items-center p-4 rounded-2xl transition-all duration-300 text-center
                      focus:outline-none focus:ring-0
                      ${currentSection === item.id 
                        ? 'bg-gradient-to-b from-green-50 to-green-100 text-green-700 shadow-lg border border-green-200' 
                        : 'hover:bg-gray-50 text-gray-700 hover:shadow-md'
                      }
                    `}
                  >
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <span className="text-sm font-semibold leading-tight">{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeMenu === 'call' && isVisible && ( // Aggiunto isVisible qui
          <motion.div
            variants={variants.popup}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed bottom-20 left-3 right-3 z-[9999]"
          >
            <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100/50 flex items-center justify-between bg-gradient-to-r from-blue-50/50 to-transparent">
                <span className="text-base font-bold text-gray-900">{t.call}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeAllMenus}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100/80 text-gray-600 text-sm hover:bg-gray-200/80 transition-colors"
                >
                  ✕
                </motion.button>
              </div>
              <div className="p-4 space-y-3">
                <motion.div /* Banchetto */ > 
                    {/* ... contenuto ... */}
                </motion.div>
                <motion.div /* Ingrosso */ >
                    {/* ... contenuto ... */}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeMenu === 'directions' && isVisible && ( // Aggiunto isVisible qui
          <motion.div
            variants={variants.popup}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed bottom-20 left-3 right-3 z-[9999]"
          >
             <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100/50 flex items-center justify-between bg-gradient-to-r from-purple-50/50 to-transparent">
                <span className="text-base font-bold text-gray-900">{t.directions}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeAllMenus}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100/80 text-gray-600 text-sm hover:bg-gray-200/80 transition-colors"
                >
                  ✕
                </motion.button>
              </div>
              <div className="p-4 space-y-3">
                <motion.button /* Banchetto */ >
                    {/* ... contenuto ... */}
                </motion.button>
                <motion.button /* Ingrosso */ >
                    {/* ... contenuto ... */}
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
            key="main-dock" // Aggiunta key per AnimatePresence
            variants={variants.dock}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[9998] pointer-events-none" 
            // z-index leggermente inferiore ai popup se i popup devono stare sopra
            // LA RIGA SOPRA è CRUCIALE PER IL CENTRAGGIO E POSIZIONAMENTO
          >
            <div className="pointer-events-auto"> {/* Questo abilita i click sui figli */}
              <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 px-6 py-3">
                <div className="flex items-center justify-center space-x-6">
                  <motion.button
                    variants={variants.button}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => toggleMenu('menu')}
                    className={` /* ... classi ... */ `}
                  >
                    <motion.div animate={activeMenu === 'menu' ? { rotate: 90 } : { rotate: 0 }} className="text-xl font-bold">☰</motion.div>
                    <span className="text-xs font-semibold mt-1">{t.menu}</span>
                  </motion.button>

                  <motion.button
                    variants={variants.button}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => toggleMenu('call')}
                     className={` /* ... classi ... */ `}
                  >
                    <motion.div animate={activeMenu === 'call' ? { scale: 1.2, rotate: 5 } : { scale: 1, rotate: 0 }} className="text-xl">📞</motion.div>
                    <span className="text-xs font-semibold mt-1">{t.call}</span>
                  </motion.button>

                  <motion.button
                    variants={variants.button}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => toggleMenu('directions')}
                    className={` /* ... classi ... */ `}
                  >
                    <motion.div animate={activeMenu === 'directions' ? { scale: 1.2, rotate: -5 } : { scale: 1, rotate: 0 }} className="text-xl">🗺️</motion.div>
                    <span className="text-xs font-semibold mt-1">{t.directions}</span>
                  </motion.button>
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
