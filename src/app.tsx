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

const MOBILE_DOCK_IDLE_TIME = 1000 // 1 secondo
const SCROLL_DETECTION_DELAY = 100 // millisecondo per throttle scroll

// Loading Component ottimizzato
const OptimizedSectionLoader: React.FC<{ name: string }> = React.memo(({ name }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
    <div className="relative">
      <motion.div
        className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
      </motion.div>
    </div>
    <motion.p
      className="absolute bottom-4 text-green-700 font-medium text-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      Caricamento {name}...
    </motion.p>
  </div>
))
OptimizedSectionLoader.displayName = 'OptimizedSectionLoader'

// Hook personalizzato per gestione mobile dock intelligente
const useMobileDockVisibility = (sectionsInView: Record<string, boolean>) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isIdle, setIsIdle] = useState(false)
  const [lastScrollTime, setLastScrollTime] = useState(Date.now())
  
  const scrollDirection = useScrollDirection({ threshold: 5, throttleDelay: SCROLL_DETECTION_DELAY })
  const { scrollY, isScrolling } = useScrollInfo({ throttleDelay: SCROLL_DETECTION_DELAY })
  
  // Gestione idle timer
  useEffect(() => {
    if (isScrolling) {
      setLastScrollTime(Date.now())
      setIsIdle(false)
    }

    const idleTimer = setTimeout(() => {
      const now = Date.now()
      if (now - lastScrollTime > 800 && !isScrolling) { // Ridotto a 800ms per essere più veloce
        setIsIdle(true)
      }
    }, 800)

    return () => clearTimeout(idleTimer)
  }, [isScrolling, lastScrollTime])

  // Logica intelligente di visibilità - NON in hero e footer
  useEffect(() => {
    const isInHero = sectionsInView.hero || scrollY < 50
    const isInFooter = sectionsInView.contact && scrollY > window.innerHeight * 4 // Footer detection migliorata
    
    // Nascondi in hero e footer
    if (isInHero || isInFooter) {
      setIsVisible(false)
      return
    }

    // Mostra in tutte le altre sezioni con logica più veloce
    const shouldShow = 
      scrollY > 50 && ( // Dopo hero
        scrollDirection === 'up' || // Scroll inverso
        isIdle || // Idle state
        (!isScrolling && scrollY > 100) // Quando fermo dopo un po' di scroll
      )

    setIsVisible(shouldShow)
  }, [scrollDirection, scrollY, isIdle, isScrolling, sectionsInView])

  return isVisible
}

// Hook per header mobile solo in hero
const useMobileHeaderVisibility = (sectionsInView: Record<string, boolean>) => {
  const [isVisible, setIsVisible] = useState(true)
  const { scrollY } = useScrollInfo({ throttleDelay: 50 })
  
  useEffect(() => {
    const isInHero = sectionsInView.hero || scrollY < 100
    setIsVisible(isInHero)
  }, [sectionsInView.hero, scrollY])

  return isVisible
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

// Componente sezione ottimizzato con lazy loading intelligente
const OptimizedSection: React.FC<{
  section: typeof SECTIONS[number]
  language: 'it' | 'de'
  onInViewChange: (sectionId: string, inView: boolean) => void
  priority?: boolean
}> = React.memo(({ section, language, onInViewChange, priority = false }) => {
  const shouldReduceMotion = useReducedMotion()
  
  const { ref, inView } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: false,
    rootMargin: priority ? '100px' : '50px'
  })

  useEffect(() => {
    onInViewChange(section.id, inView)
  }, [inView, section.id, onInViewChange])

  const sectionVariants = useMemo(() => ({
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.1 : 0.4,
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
      style={{ willChange: 'transform, opacity' }}
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
  const shouldReduceMotion = useReducedMotion()

  // Inizializzazione app
  useEffect(() => {
    const initializeApp = async () => {
      // Detect device type
      setIsMobileDevice(isMobile())
      
      // Detect language se non salvato
      if (!getLanguageFromStorage()) {
        const browserLang = getBrowserLanguage()
        setLanguage(browserLang)
      }

      // Mark app as ready
      setTimeout(() => {
        setIsAppReady(true)
      }, 100)
    }

    initializeApp()
  }, [setLanguage])

  // Handler per cambio lingua
  const handleLanguageChange = useCallback((newLanguage: 'it' | 'de') => {
    setLanguage(newLanguage)
    
    // Track language change
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'language_change', {
        event_category: 'user_preference',
        event_label: newLanguage,
        value: 1
      })
    }
  }, [setLanguage])

  // Gestione footer in mobile per nascondere dock
  const isInFooter = useMemo(() => {
    if (!isMobileDevice) return false
    // Footer detection più precisa
    const contactInView = sectionsInView.contact
    const isNearBottom = document.documentElement.scrollHeight - window.scrollY - window.innerHeight < 200
    return contactInView && isNearBottom
  }, [sectionsInView.contact, isMobileDevice])

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
        duration: shouldReduceMotion ? 0.1 : 0.3,
        ease: "easeOut",
        staggerChildren: shouldReduceMotion ? 0 : 0.1
      }
    }
  }), [shouldReduceMotion])

  // Loading screen mentre app si inizializza
  if (!isAppReady) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center z-50">
        <div className="text-center">
          <motion.img
            src="/logo-bottamedi.webp"
            alt="Bottamedi Loading"
            className="w-20 h-20 mx-auto mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.div
            className="w-8 h-8 border-2 border-green-300 border-t-green-600 rounded-full animate-spin mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
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
          
          {/* Preload critical resources */}
          <link rel="preload" href="/logo-bottamedi.webp" as="image" />
          <link rel="preload" href="/images/banchetto.webp" as="image" />
          <link rel="preload" href="/videos/hero-video-verdure-rotanti.mp4" as="video" type="video/mp4" />
          
          {/* Performance hints */}
          <link rel="dns-prefetch" href="//fonts.googleapis.com" />
          <link rel="dns-prefetch" href="//www.google-analytics.com" />
          
          {/* Viewport e mobile optimization */}
          <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no" />
          <meta name="format-detection" content="telephone=yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        </Helmet>

        {/* Header - Desktop sempre, Mobile solo in Hero */}
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
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{
                  type: 'spring',
                  damping: 30,
                  stiffness: 400,
                  duration: shouldReduceMotion ? 0.1 : 0.3
                }}
                className="relative z-40"
              >
                <Header
                  language={language}
                  onLanguageChange={handleLanguageChange}
                  isMenuOpen={false}
                  onToggleMenu={() => {}}
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
              priority={index < 2} // Prime 2 sezioni prioritarie
            />
          ))}
        </main>

        {/* Footer */}
        <Footer language={language} />

        {/* Legal Documents */}
        <LegalDocuments language={language} />

        {/* Mobile Dock - Solo Mobile con logica intelligente migliorata */}
        {isMobileDevice && (
          <AnimatePresence>
            {mobileDockVisible && (
              <motion.div
                initial={{ y: 100, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 100, opacity: 0, scale: 0.8 }}
                transition={{ 
                  type: 'spring',
                  damping: 25,
                  stiffness: 350, // Più veloce
                  duration: shouldReduceMotion ? 0.1 : 0.25 // Più veloce
                }}
                className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none"
              >
                <MobileDock language={language} hideInFooter={false} />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Cookie Banner - Solo se necessario */}
        <CookieBanner language={language} />

        {/* Performance Monitor (solo in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs z-50">
            <div>Sections in view: {Object.keys(sectionsInView).filter(k => sectionsInView[k]).length}</div>
            <div>Mobile dock: {mobileDockVisible ? 'visible' : 'hidden'}</div>
            <div>Device: {isMobileDevice ? 'mobile' : 'desktop'}</div>
            <div>Language: {language}</div>
          </div>
        )}
      </motion.div>
    </HelmetProvider>
  )
}

export default React.memo(App)
