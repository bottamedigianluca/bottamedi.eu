import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MobileDockProps {
  language: 'it' | 'de'
}

const translations = {
  it: {
    // Tasti principali
    menu: 'Menu',
    call: 'Chiama',
    sections: 'Sezioni',
    
    // Menu sezioni
    menuTitle: 'Naviga nel Sito',
    home: 'Home',
    storia: 'La Nostra Storia',
    banchetto: 'Al Banchetto',
    banchettoDesc: 'Esperienza diretta con prodotti freschi',
    servizi: 'Servizi',
    serviziDesc: 'Dettaglio e Ingrosso HORECA',
    prodotti: 'I Nostri Prodotti',
    prodottiDesc: 'Frutta, verdura e specialità locali',
    listino: 'Richiedi Listino',
    listinoDesc: 'Partnership HORECA professionali',
    contatti: 'Contatti',
    contattiDesc: 'Come raggiungerci',
    
    // Menu chiamate
    callTitle: 'Contattaci Subito',
    callBanchetto: 'Banchetto Dettaglio',
    callBanchettoDesc: 'Via Cavalleggeri Udine',
    callBanchettoPhone: '351 577 6198',
    callIngrosso: 'Ingrosso HORECA',
    callIngrossoDesc: 'Via de Gasperi 47',
    callIngrossoPhone: '0461 602534',
    whatsapp: 'WhatsApp',
    directions: 'Indicazioni'
  },
  de: {
    // Tasti principali
    menu: 'Menü',
    call: 'Anrufen',
    sections: 'Bereiche',
    
    // Menu sezioni
    menuTitle: 'Website Navigation',
    home: 'Startseite',
    storia: 'Unsere Geschichte',
    banchetto: 'Marktstand',
    banchettoDesc: 'Direkter Kontakt mit frischen Produkten',
    servizi: 'Dienstleistungen',
    serviziDesc: 'Einzelhandel und HORECA Großhandel',
    prodotti: 'Unsere Produkte',
    prodottiDesc: 'Obst, Gemüse und lokale Spezialitäten',
    listino: 'Preisliste Anfordern',
    listinoDesc: 'Professionelle HORECA Partnerschaft',
    contatti: 'Kontakt',
    contattiDesc: 'Wie Sie uns erreichen',
    
    // Menu chiamate
    callTitle: 'Kontaktieren Sie uns sofort',
    callBanchetto: 'Marktstand Einzelhandel',
    callBanchettoDesc: 'Via Cavalleggeri Udine',
    callBanchettoPhone: '351 577 6198',
    callIngrosso: 'HORECA Großhandel',
    callIngrossoDesc: 'Via de Gasperi 47',
    callIngrossoPhone: '0461 602534',
    whatsapp: 'WhatsApp',
    directions: 'Wegbeschreibung'
  }
}

const MobileDock: React.FC<MobileDockProps> = ({ language }) => {
  const [isVisible, setIsVisible] = useState(true)
  const [activeMenu, setActiveMenu] = useState<'none' | 'sections' | 'call'>('none')
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  
  const t = translations[language]

  // CRITICAL: Detect mobile correttamente
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024 // lg breakpoint
      setIsMobile(mobile)
      console.log(`📱 Mobile Dock: ${mobile ? 'MOBILE' : 'DESKTOP'} (width: ${window.innerWidth}px)`)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto-hide su scroll (solo se necessario)
  useEffect(() => {
    if (!isMobile) return

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Nascondi solo se scroll veloce verso il basso
      if (currentScrollY > lastScrollY + 100 && currentScrollY > 300) {
        setIsVisible(false)
        setActiveMenu('none')
      } else if (currentScrollY < lastScrollY - 50) {
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    const throttledScroll = throttle(handleScroll, 150)
    window.addEventListener('scroll', throttledScroll, { passive: true })
    
    return () => window.removeEventListener('scroll', throttledScroll)
  }, [lastScrollY, isMobile])

  // Throttle helper
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
      
      // Chiudi menu dopo navigazione
      setActiveMenu('none')
      
      // Haptic feedback
      if ('vibrate' in navigator) {
        try {
          navigator.vibrate(25)
        } catch (e) {
          console.log('Haptic non disponibile')
        }
      }
    }
  }, [])

  const handleCall = useCallback((phone: string) => {
    window.open(`tel:${phone.replace(/\s/g, '')}`, '_self')
    setActiveMenu('none')
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([30, 20, 30])
      } catch (e) {
        console.log('Haptic non disponibile')
      }
    }
  }, [])

  const handleWhatsApp = useCallback((type: 'banchetto' | 'ingrosso') => {
    const messages = {
      banchetto: `Ciao! Sono interessato ai vostri prodotti al banchetto di Via Cavalleggeri Udine`,
      ingrosso: `Buongiorno, vorrei informazioni sui vostri servizi HORECA per la mia attività`
    }
    
    const message = encodeURIComponent(messages[type])
    window.open(`https://wa.me/393515776198?text=${message}`, '_blank')
    setActiveMenu('none')
  }, [])

  const handleDirections = useCallback((type: 'banchetto' | 'ingrosso') => {
    const urls = {
      banchetto: 'https://www.google.com/maps/search/?api=1&query=Banchetto+Frutta+e+Verdura+Bottamedi+Via+Cavalleggeri+Udine+Mezzolombardo+TN',
      ingrosso: 'https://maps.app.goo.gl/TFV4cgnEvcFjBHfD6'
    }
    
    window.open(urls[type], '_blank')
    setActiveMenu('none')
  }, [])

  const toggleMenu = useCallback((menu: 'sections' | 'call') => {
    setActiveMenu(prev => prev === menu ? 'none' : menu)
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(25)
      } catch (e) {
        console.log('Haptic non disponibile')
      }
    }
  }, [])

  // NON RENDERIZZARE SU DESKTOP
  if (!isMobile) {
    return null
  }

  const sectionsData = [
    { id: 'hero', label: t.home, icon: '🏠', section: 'hero' },
    { id: 'about', label: t.storia, icon: '🌱', section: 'about' },
    { 
      id: 'dettaglio', 
      label: t.banchetto, 
      icon: '🛒', 
      section: 'dettaglio',
      desc: t.banchettoDesc
    },
    { 
      id: 'services', 
      label: t.servizi, 
      icon: '🚛', 
      section: 'services',
      desc: t.serviziDesc
    },
    { 
      id: 'products', 
      label: t.prodotti, 
      icon: '🍎', 
      section: 'products',
      desc: t.prodottiDesc
    },
    { 
      id: 'wholesale', 
      label: t.listino, 
      icon: '📋', 
      section: 'wholesale',
      desc: t.listinoDesc
    },
    { 
      id: 'contact', 
      label: t.contatti, 
      icon: '📞', 
      section: 'contact',
      desc: t.contattiDesc
    }
  ]

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {activeMenu !== 'none' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998]"
            onClick={() => setActiveMenu('none')}
          />
        )}
      </AnimatePresence>

      {/* Menu Popup - Sezioni */}
      <AnimatePresence>
        {activeMenu === 'sections' && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed bottom-20 left-4 right-4 z-[9999] bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-[70vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">{t.menuTitle}</h3>
                <button
                  onClick={() => setActiveMenu('none')}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Sezioni */}
            <div className="p-2">
              {sectionsData.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => scrollToSection(item.section)}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
                >
                  <div className="text-2xl">{item.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm">{item.label}</h4>
                    {item.desc && (
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    )}
                  </div>
                  <div className="text-gray-400">›</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu Popup - Chiamate */}
      <AnimatePresence>
        {activeMenu === 'call' && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed bottom-20 left-4 right-4 z-[9999] bg-white rounded-2xl shadow-2xl border border-gray-200"
          >
            {/* Header */}
            <div className="border-b border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">{t.callTitle}</h3>
                <button
                  onClick={() => setActiveMenu('none')}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Opzioni Chiamata */}
            <div className="p-4 space-y-4">
              
              {/* Banchetto Dettaglio */}
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-lg">
                    🛒
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{t.callBanchetto}</h4>
                    <p className="text-sm text-gray-600">{t.callBanchettoDesc}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleCall(t.callBanchettoPhone)}
                    className="bg-green-500 text-white px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center space-x-1"
                  >
                    <span>📞</span>
                    <span>{t.callBanchettoPhone}</span>
                  </button>
                  
                  <button
                    onClick={() => handleWhatsApp('banchetto')}
                    className="bg-green-600 text-white px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center space-x-1"
                  >
                    <span>💬</span>
                    <span>{t.whatsapp}</span>
                  </button>
                  
                  <button
                    onClick={() => handleDirections('banchetto')}
                    className="bg-blue-500 text-white px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center space-x-1"
                  >
                    <span>🗺️</span>
                    <span>{t.directions}</span>
                  </button>
                </div>
              </div>

              {/* Ingrosso HORECA */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg">
                    🚛
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{t.callIngrosso}</h4>
                    <p className="text-sm text-gray-600">{t.callIngrossoDesc}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleCall(t.callIngrossoPhone)}
                    className="bg-blue-500 text-white px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center space-x-1"
                  >
                    <span>📞</span>
                    <span>{t.callIngrossoPhone}</span>
                  </button>
                  
                  <button
                    onClick={() => handleWhatsApp('ingrosso')}
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center space-x-1"
                  >
                    <span>💬</span>
                    <span>{t.whatsapp}</span>
                  </button>
                  
                  <button
                    onClick={() => handleDirections('ingrosso')}
                    className="bg-blue-500 text-white px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center space-x-1"
                  >
                    <span>🗺️</span>
                    <span>{t.directions}</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Dock */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ 
              type: 'spring', 
              damping: 20, 
              stiffness: 200,
              duration: 0.3 
            }}
            className="fixed bottom-0 left-0 right-0 z-[9999] pointer-events-none"
            style={{
              position: 'fixed !important' as any,
              bottom: '0 !important' as any,
              zIndex: 9999
            }}
          >
            {/* Safe area background per iPhone */}
            <div className="bg-white/95 backdrop-blur-md border-t border-gray-200 pb-safe">
              <div className="pointer-events-auto">
                
                {/* 3 Tasti Principali */}
                <div className="flex items-center justify-around px-6 py-3">
                  
                  {/* Tasto Sezioni */}
                  <motion.button
                    onClick={() => toggleMenu('sections')}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      flex flex-col items-center justify-center
                      min-w-[80px] py-2 px-4 rounded-xl transition-all duration-200
                      ${activeMenu === 'sections'
                        ? 'bg-green-500 text-white shadow-lg' 
                        : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                      }
                    `}
                    style={{
                      minHeight: '48px',
                      minWidth: '48px'
                    }}
                  >
                    <motion.div
                      animate={activeMenu === 'sections' ? { scale: 1.1, rotate: 180 } : { scale: 1, rotate: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-xl mb-1"
                    >
                      📋
                    </motion.div>
                    
                    <span className={`
                      text-xs font-medium leading-none
                      ${activeMenu === 'sections' ? 'text-white' : 'text-gray-700'}
                    `}>
                      {t.sections}
                    </span>
                  </motion.button>

                  {/* Tasto Home/Scroll to Top */}
                  <motion.button
                    onClick={() => scrollToSection('hero')}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center justify-center min-w-[80px] py-2 px-4 rounded-xl transition-all duration-200 text-gray-700 hover:text-green-600 hover:bg-green-50"
                    style={{
                      minHeight: '48px',
                      minWidth: '48px'
                    }}
                  >
                    <div className="text-xl mb-1">🏠</div>
                    <span className="text-xs font-medium leading-none text-gray-700">
                      {t.home}
                    </span>
                  </motion.button>

                  {/* Tasto Chiamate */}
                  <motion.button
                    onClick={() => toggleMenu('call')}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      flex flex-col items-center justify-center
                      min-w-[80px] py-2 px-4 rounded-xl transition-all duration-200
                      ${activeMenu === 'call'
                        ? 'bg-blue-500 text-white shadow-lg' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                      }
                    `}
                    style={{
                      minHeight: '48px',
                      minWidth: '48px'
                    }}
                  >
                    <motion.div
                      animate={activeMenu === 'call' ? { scale: 1.1, rotate: 15 } : { scale: 1, rotate: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-xl mb-1"
                    >
                      📞
                    </motion.div>
                    
                    <span className={`
                      text-xs font-medium leading-none
                      ${activeMenu === 'call' ? 'text-white' : 'text-gray-700'}
                    `}>
                      {t.call}
                    </span>
                  </motion.button>
                </div>
                
                {/* Home indicator per iPhone */}
                <div className="h-1 w-32 bg-gray-300 rounded-full mx-auto mb-1 opacity-30" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default MobileDock
