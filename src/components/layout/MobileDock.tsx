import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MobileDockProps {
  language: 'it' | 'de'
}

const translations = {
  it: {
    banchetto: 'Banchetto',
    ingrosso: 'Ingrosso', 
    prodotti: 'Prodotti',
    contatti: 'Contatti',
    home: 'Home'
  },
  de: {
    banchetto: 'Marktstand',
    ingrosso: 'Großhandel',
    prodotti: 'Produkte', 
    contatti: 'Kontakt',
    home: 'Home'
  }
}

const MobileDock: React.FC<MobileDockProps> = ({ language }) => {
  const [isVisible, setIsVisible] = useState(true)
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
      if (currentScrollY > lastScrollY + 50 && currentScrollY > 200) {
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY - 20) {
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    const throttledScroll = throttle(handleScroll, 100)
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

  const getCurrentSection = useCallback(() => {
    const sections = ['hero', 'about', 'dettaglio', 'services', 'products', 'wholesale', 'contact']
    const scrollPosition = window.scrollY + 100

    for (const sectionId of sections) {
      const element = document.getElementById(sectionId)
      if (element) {
        const { offsetTop, offsetHeight } = element
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          return sectionId
        }
      }
    }
    return 'hero'
  }, [])

  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    if (!isMobile) return

    const updateActiveSection = () => {
      setActiveSection(getCurrentSection())
    }

    const throttledUpdate = throttle(updateActiveSection, 200)
    window.addEventListener('scroll', throttledUpdate, { passive: true })
    
    // Initial check
    updateActiveSection()
    
    return () => window.removeEventListener('scroll', throttledUpdate)
  }, [getCurrentSection, isMobile])

  // NON RENDERIZZARE SU DESKTOP
  if (!isMobile) {
    return null
  }

  const dockItems = [
    { id: 'hero', label: t.home, icon: '🏠', section: 'hero' },
    { id: 'dettaglio', label: t.banchetto, icon: '🛒', section: 'dettaglio' },
    { id: 'services', label: t.ingrosso, icon: '🚛', section: 'services' },
    { id: 'products', label: t.prodotti, icon: '🍎', section: 'products' },
    { id: 'contact', label: t.contatti, icon: '📞', section: 'contact' }
  ]

  return (
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
            // FORCE STYLES per garantire visibilità
            position: 'fixed !important' as any,
            bottom: '0 !important' as any,
            zIndex: 9999
          }}
        >
          {/* Safe area background per iPhone */}
          <div className="bg-white/80 backdrop-blur-md border-t border-gray-200 pb-safe">
            <div className="pointer-events-auto">
              
              {/* Dock Items */}
              <div className="flex items-center justify-around px-4 py-2">
                {dockItems.map((item, index) => {
                  const isActive = activeSection === item.section
                  
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => scrollToSection(item.section)}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        flex flex-col items-center justify-center
                        min-w-[60px] py-2 rounded-xl transition-all duration-200
                        ${isActive 
                          ? 'bg-green-500 text-white shadow-md' 
                          : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                        }
                      `}
                      style={{
                        // Force tap target size
                        minHeight: '44px',
                        minWidth: '44px'
                      }}
                    >
                      <motion.div
                        animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="text-lg mb-1"
                      >
                        {item.icon}
                      </motion.div>
                      
                      <span className={`
                        text-xs font-medium leading-none
                        ${isActive ? 'text-white' : 'text-gray-700'}
                      `}>
                        {item.label}
                      </span>
                      
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeDock"
                          className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"
                          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                        />
                      )}
                    </motion.button>
                  )
                })}
              </div>
              
              {/* Home indicator per iPhone */}
              <div className="h-1 w-32 bg-gray-300 rounded-full mx-auto mb-1 opacity-30" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MobileDock
