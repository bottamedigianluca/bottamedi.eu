import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { HelmetProvider, Helmet } from 'react-helmet-async'

// Hooks ottimizzati
import { useLocalStorage } from './hooks/useLocalStorage'
import { useScrollInfo, useScrollDirection } from './hooks/useScrollDirection'
import { useIntersectionObserver } from './hooks/useIntersectionObserver'

// Layout Components
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import MobileDock from './components/layout/MobileDock'

// Legal Components
import CookieBanner from './components/legal/CookieBanner'
import LegalDocuments from './components/legal/LegalDocuments'

// Utility imports
import { getLanguageFromStorage, getBrowserLanguage, isMobile } from './utils/helpers'

// Lazy load delle sezioni per ottimizzazione
const HeroSection = lazy(() => import('./components/sections/HeroSection'))
const AboutSection = lazy(() => import('./components/sections/AboutSection'))
const BanchettoSection = lazy(() => import('./components/sections/Banchettosection'))
const ServicesSection = lazy(() => import('./components/sections/ServicesSection'))
const ProductsSection = lazy(() => import('./components/sections/ProductsSection'))
const WholesaleContact = lazy(() => import('./components/sections/Wholesalecontact'))
const ContactSection = lazy(() => import('./components/sections/ContactSection'))

// Costanti per ottimizzazione
const SECTIONS = [
  { id: 'hero', Component: HeroSection },
  { id: 'about', Component: AboutSection },
  { id: 'dettaglio', Component: BanchettoSection },
  { id: 'services', Component: ServicesSection },
  { id: 'products', Component: ProductsSection },
  { id: 'wholesale', Component: WholesaleContact },
  { id: 'contact', Component: ContactSection }
] as const

const MOBILE_DOCK_IDLE_TIME = 500
const SCROLL_DETECTION_DELAY = 16
const HEADER_FADE_SPEED = 150

// Mappa colori per status bar dinamica
const SECTION_COLORS = {
  hero: '#22c55e',
  about: '#16a34a',
  dettaglio: '#15803d',
  services: '#166534',
  products: '#14532d',
  wholesale: '#052e16',
  contact: '#1f2937'
} as const

// Loading Component ottimizzato
const OptimizedSectionLoader: React.FC<{ name: string }> = React.memo(({ name }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
    <div className="relative">
      <motion.div
        className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
      </motion.div>
    </div>
    <motion.p
      className="absolute bottom-4 text-green-700 font-medium text-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      aria-live="polite"
    >
      Caricamento {name}...
    </motion.p>
  </div>
))
OptimizedSectionLoader.displayName = 'OptimizedSectionLoader'

// Hook per mobile dock - VERSIONE FINALE CON FOOTER DETECTION
const useMobileDockVisibility = (sectionsInView: Record<string, boolean>) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isIdle, setIsIdle] = useState(false)
  const [lastScrollTime, setLastScrollTime] = useState(Date.now())
  
  const scrollDirection = useScrollDirection({ threshold: 3, throttleDelay: SCROLL_DETECTION_DELAY })
  const { scrollY, isScrolling } = useScrollInfo({ throttleDelay: SCROLL_DETECTION_DELAY })
  
  // Gestione idle timer
  useEffect(() => {
    if (isScrolling) {
      setLastScrollTime(Date.now())
      setIsIdle(false)
    }

    const idleTimer = setTimeout(() => {
      const now = Date.now()
      if (now - lastScrollTime > MOBILE_DOCK_IDLE_TIME && !isScrolling) {
        setIsIdle(true)
      }
    }, MOBILE_DOCK_IDLE_TIME)

    return () => clearTimeout(idleTimer)
  }, [isScrolling, lastScrollTime])

  // LOGICA FINALE: Nasconde in Hero, Contact E Footer
  useEffect(() => {
    // Controlla se siamo in hero (primi 150px della pagina)
    const isInHero = scrollY < 150
    
    // Controlla se siamo in contact (sezione contact visibile)
    const isInContact = sectionsInView.contact
    
    // NUOVO: Controlla se siamo nel footer
    const isInFooter = (() => {
      const footer = document.querySelector('footer')
      if (!footer) return false
      
      const footerRect = footer.getBoundingClientRect()
      const windowHeight = window.innerHeight
      
      // Se il footer è visibile nella viewport
      return footerRect.top < windowHeight && footerRect.bottom > 0
    })()
    
    // NASCONDE in hero, contact E footer
    if (isInHero || isInContact || isInFooter) {
      setIsVisible(false)
      return
    }

    // MOSTRA in TUTTE le altre sezioni quando:
    // - Scroll verso l'alto
    // - Utente è idle
    // - Non sta scrollando e siamo oltre hero
    const shouldShow = 
      scrollY > 150 && ( // Fuori da hero
        scrollDirection === 'up' || // Scroll inverso
        isIdle || // Idle
        !isScrolling // Fermo
      )

    setIsVisible(shouldShow)
  }, [scrollDirection, scrollY, isIdle, isScrolling, sectionsInView])

  return isVisible
}

// Hook per header mobile
const useMobileHeaderVisibility = (sectionsInView: Record<string, boolean>) => {
  const [isVisible, setIsVisible] = useState(true)
  const { scrollY } = useScrollInfo({ throttleDelay: SCROLL_DETECTION_DELAY })
  
  useEffect(() => {
    const isInHero = sectionsInView.hero || scrollY < 60
    setIsVisible(isInHero)
  }, [sectionsInView.hero, scrollY])

  return isVisible
}

// Hook per colore dinamico status bar
const useStatusBarColor = (sectionsInView: Record<string, boolean>) => {
  const [currentColor, setCurrentColor] = useState(SECTION_COLORS.hero)
  
  useEffect(() => {
    for (const section of SECTIONS) {
      if (sectionsInView[section.id]) {
        setCurrentColor(SECTION_COLORS[section.id as keyof typeof SECTION_COLORS])
        break
      }
    }
  }, [sectionsInView])

  return currentColor
}

// Hook per intersection observer delle sezioni
const useSectionsInView = () => {
  const [sectionsInView, setSectionsInView] = useState<Record<string, boolean>>({})

  const updateSectionInView = useCallback((sectionId: string, inView: boolean) => {
    setSectionsInView(prev => ({
      ...prev,
      [sectionId]: inView
    }))
  }, [])

  return { sectionsInView, updateSectionInView }
}

// Componente sezione ottimizzato
const OptimizedSection: React.FC<{
  section: typeof SECTIONS[number]
  language: 'it' | 'de'
  onInViewChange: (sectionId: string, inView: boolean) => void
  priority?: boolean
}> = React.memo(({ section, language, onInViewChange, priority = false }) => {
  const shouldReduceMotion = useReducedMotion()
  
  const { ref, inView } = useIntersectionObserver({
    threshold: 0.15,
    triggerOnce: false,
    rootMargin: priority ? '200px' : '100px'
  })

  useEffect(() => {
    onInViewChange(section.id, inView)
  }, [inView, section.id, onInViewChange])

  const sectionVariants = useMemo(() => ({
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 15 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.05 : 0.25,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }), [shouldReduceMotion])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={sectionVariants}
      style={{ willChange: inView ? 'transform, opacity' : 'auto' }}
    >
      <Suspense fallback={<OptimizedSectionLoader name={section.id} />}>
        <section.Component language={language} inView={inView} />
      </Suspense>
    </motion.div>
  )
})
OptimizedSection.displayName = 'OptimizedSection'

// Componente principale App
const App: React.FC = () => {
  // States principali
  const [language, setLanguage] = useLocalStorage<'it' | 'de'>('bottamedi-language', 'it')
  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const [isAppReady, setIsAppReady] = useState(false)
  
  // Hooks personalizzati
  const { sectionsInView, updateSectionInView } = useSectionsInView()
  const mobileDockVisible = useMobileDockVisibility(sectionsInView)
  const mobileHeaderVisible = useMobileHeaderVisibility(sectionsInView)
  const statusBarColor = useStatusBarColor(sectionsInView)
  const shouldReduceMotion = useReducedMotion()

  // Inizializzazione app
  useEffect(() => {
    const initializeApp = async () => {
      setIsMobileDevice(isMobile())
      
      if (!getLanguageFromStorage()) {
        const browserLang = getBrowserLanguage()
        setLanguage(browserLang)
      }

      setTimeout(() => {
        setIsAppReady(true)
      }, 50)
    }

    initializeApp()
  }, [setLanguage])

  // Handler per cambio lingua
  const handleLanguageChange = useCallback((newLanguage: 'it' | 'de') => {
    setLanguage(newLanguage)
    
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'language_change', {
        event_category: 'user_preference',
        event_label: newLanguage,
        value: 1
      })
    }
  }, [setLanguage])

  // SEO Meta tags dinamici
  const seoTitle = useMemo(() => 
    language === 'it' 
      ? '🍎 Bottamedi Frutta e Verdura Mezzolombardo | Ingrosso HORECA e Dettaglio | 50 anni di Qualità Trentino Alto Adige'
      : '🍎 Bottamedi Obst und Gemüse Mezzolombardo | HORECA Großhandel und Einzelhandel | 50 Jahre Qualität Südtirol'
  , [language])

  const seoDescription = useMemo(() => 
    language === 'it'
      ? '🍎 Bottamedi: 50 anni di tradizione familiare nella vendita di frutta e verdura fresca a Mezzolombardo. Banchetto dettaglio e servizio ingrosso HORECA per ristoranti nel Trentino Alto Adige. Qualità garantita dal 1974.'
      : '🍎 Bottamedi: 50 Jahre Familientradition im Verkauf von frischem Obst und Gemüse in Mezzolombardo. Einzelhandel Marktstand und HORECA Großhandelsservice für Restaurants in Südtirol. Qualität garantiert seit 1974.'
  , [language])

  // Animation variants per l'app
  const appVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0.05 : 0.2,
        ease: "easeOut",
        staggerChildren: shouldReduceMotion ? 0 : 0.05
      }
    }
  }), [shouldReduceMotion])

  // Loading screen
  if (!isAppReady) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center z-50">
        <div className="text-center">
          <motion.img
            src="/logo-bottamedi.webp"
            alt="Bottamedi Loading"
            className="w-20 h-20 mx-auto mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className="w-8 h-8 border-2 border-green-300 border-t-green-600 rounded-full animate-spin mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          />
        </div>
      </div>
    )
  }

  return (
    <HelmetProvider>
      <motion.div
        className="min-h-screen bg-white overflow-x-hidden"
        initial="hidden"
        animate="visible"
        variants={appVariants}
      >
        {/* SEO Meta Tags */}
        <Helmet>
          <html lang={language} />
          <title>{seoTitle}</title>
          <meta name="description" content={seoDescription} />
          <meta property="og:title" content={seoTitle} />
          <meta property="og:description" content={seoDescription} />
          <meta property="og:locale" content={language === 'it' ? 'it_IT' : 'de_IT'} />
          
          <meta name="theme-color" content={statusBarColor} />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          
          <link rel="preload" href="/logo-bottamedi.webp" as="image" />
          <link rel="preload" href="/images/banchetto.webp" as="image" />
          <link rel="preload" href="/videos/hero-video-verdure-rotanti.mp4" as="video" type="video/mp4" />
          
          <link rel="dns-prefetch" href="//fonts.googleapis.com" />
          <link rel="dns-prefetch" href="//www.google-analytics.com" />
          
          <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
          <meta name="format-detection" content="telephone=yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
        </Helmet>

        {/* Header - Desktop sempre, Mobile solo in Hero trasparente */}
        {!isMobileDevice ? (
          <Header
            language={language}
            onLanguageChange={handleLanguageChange}
            isMenuOpen={false}
            onToggleMenu={() => {}}
          />
        ) : (
          <AnimatePresence>
            {mobileHeaderVisible && (
              <motion.div
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -80, opacity: 0 }}
                transition={{
                  type: 'tween',
                  duration: shouldReduceMotion ? 0.05 : HEADER_FADE_SPEED / 1000,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className="relative z-40"
                style={{
                  background: 'transparent',
                  backdropFilter: 'none'
                }}
              >
                <Header
                  language={language}
                  onLanguageChange={handleLanguageChange}
                  isMenuOpen={false}
                  onToggleMenu={() => {}}
                  className="bg-transparent backdrop-blur-none mobile-header"
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Main Content */}
        <main className="relative">
          {SECTIONS.map((section, index) => (
            <OptimizedSection
              key={section.id}
              section={section}
              language={language}
              onInViewChange={updateSectionInView}
              priority={index < 2}
            />
          ))}
        </main>

        {/* Footer */}
        <Footer language={language} />

        {/* Legal Documents */}
        <LegalDocuments 
          language={language} 
          scrollBehavior="smooth"
        />

        {/* Mobile Dock - NASCOSTO in Hero, Contact E Footer */}
        {isMobileDevice && (
          <AnimatePresence>
            {mobileDockVisible && (
              <motion.div
                initial={{ y: 100, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 100, opacity: 0, scale: 0.9 }}
                transition={{ 
                  type: 'spring',
                  damping: 30,
                  stiffness: 400,
                  duration: shouldReduceMotion ? 0.05 : 0.15
                }}
                className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none"
                style={{
                  willChange: 'transform, opacity',
                  touchAction: 'none'
                }}
              >
                <MobileDock 
                  language={language} 
                  hideInFooter={false} // Non serve più, gestito dall'App
                  touchDelay={60}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Cookie Banner */}
        <CookieBanner language={language} />
      </motion.div>
    </HelmetProvider>
  )
}

export default React.memo(App)
