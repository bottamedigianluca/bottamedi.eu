import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

// 🚀 LAZY IMPORTS OTTIMIZZATI con error boundaries
const Header = React.lazy(() => 
  import('./components/layout/Header').then(module => ({ default: module.default }))
  .catch(() => import('./components/layout/Header'))
)

const HeroSection = React.lazy(() => 
  import('./components/sections/HeroSection').then(module => ({ default: module.default }))
  .catch(() => ({ default: () => <div className="h-screen bg-green-50 flex items-center justify-center">
    <h1 className="text-4xl font-bold text-green-600">BOTTAMEDI</h1>
  </div> }))
)

const AboutSection = React.lazy(() => 
  import('./components/sections/AboutSection').then(module => ({ default: module.default }))
  .catch(() => ({ default: () => <div className="h-96 bg-gray-50" /> }))
)

const BanchettoSection = React.lazy(() => 
  import('./components/sections/Banchettosection').then(module => ({ default: module.default }))
  .catch(() => ({ default: () => <div className="h-96 bg-green-50" /> }))
)

const ServicesSection = React.lazy(() => 
  import('./components/sections/ServicesSection').then(module => ({ default: module.default }))
  .catch(() => ({ default: () => <div className="h-96 bg-blue-50" /> }))
)

const ProductsSection = React.lazy(() => 
  import('./components/sections/ProductsSection').then(module => ({ default: module.default }))
  .catch(() => ({ default: () => <div className="h-96 bg-emerald-50" /> }))
)

const WholesaleContact = React.lazy(() => 
  import('./components/sections/Wholesalecontact').then(module => ({ default: module.default }))
  .catch(() => ({ default: () => <div className="h-96 bg-orange-50" /> }))
)

const ContactSection = React.lazy(() => 
  import('./components/sections/ContactSection').then(module => ({ default: module.default }))
  .catch(() => ({ default: () => <div className="h-96 bg-purple-50" /> }))
)

const Footer = React.lazy(() => 
  import('./components/layout/Footer').then(module => ({ default: module.default }))
  .catch(() => ({ default: () => <div className="h-64 bg-neutral-900" /> }))
)

const MobileDock = React.lazy(() => 
  import('./components/layout/MobileDock').then(module => ({ default: module.default }))
  .catch(() => ({ default: () => null }))
)

const CookieBanner = React.lazy(() => 
  import('./components/legal/CookieBanner').then(module => ({ default: module.default }))
  .catch(() => ({ default: () => null }))
)

const LegalDocuments = React.lazy(() => 
  import('./components/legal/LegalDocuments').then(module => ({ default: module.default }))
  .catch(() => ({ default: () => <div className="h-64 bg-gray-50" /> }))
)

// 🎯 PERFORMANCE: Fallback components ottimizzati
const ComponentLoader = ({ height = "h-96" }: { height?: string }) => (
  <div className={`${height} flex items-center justify-center`}>
    <div className="flex flex-col items-center space-y-3">
      <div className="w-8 h-8 border-2 border-green-200 border-t-green-600 rounded-full animate-spin" />
      <div className="text-sm text-green-600 font-medium">Caricamento...</div>
    </div>
  </div>
)

const HeaderLoader = () => (
  <div className="h-20 bg-white/90 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4">
    <div className="w-32 h-8 bg-gray-200 rounded animate-pulse" />
    <div className="flex space-x-4">
      <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
      <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
    </div>
  </div>
)

// 🎨 PERFORMANCE: Stili inline ottimizzati
const inlineStyles = `
  .mobile-dock-container {
    position: fixed !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    pointer-events: none !important;
    z-index: 1000 !important;
  }
  @media (min-width: 1024px) {
    .mobile-dock-container { display: none !important; }
  }
  .smooth-scroll {
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
  }
`

// 🎯 HOOK OTTIMIZZATO per sezioni in vista
const useOptimizedInView = (threshold = 0.1) => {
  return useInView({
    threshold,
    triggerOnce: false, // Manteniamo per il dock
    rootMargin: '50px'
  })
}

// 🎯 HOOK per visibilità mobile dock
const useMobileDockVisibility = (currentSection: string, isFooterInView: boolean) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isScrollingDown, setIsScrollingDown] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const isScrollingDown = currentScrollY > lastScrollY
      
      setIsScrollingDown(isScrollingDown)
      setLastScrollY(currentScrollY)

      // Logica visibilità dock
      const shouldShow = currentSection !== 'hero' && 
                        !isFooterInView && 
                        currentScrollY > 200 &&
                        !isScrollingDown

      setIsVisible(shouldShow)
    }

    const throttledScroll = () => {
      requestAnimationFrame(handleScroll)
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })
    return () => window.removeEventListener('scroll', throttledScroll)
  }, [currentSection, isFooterInView, lastScrollY])

  return isVisible
}

// 🎯 MAIN APP COMPONENT
const App: React.FC = () => {
  // 📊 STATE MANAGEMENT ottimizzato
  const [appState, setAppState] = useState({
    language: 'it' as 'it' | 'de',
    currentSection: 'hero',
    showLegalDocs: false,
    isMenuOpen: false,
    componentsLoaded: new Set<string>()
  })

  // 🚀 PERFORMANCE: Scroll progress ottimizzato
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // 🎯 INTERSECTION OBSERVERS ottimizzati
  const [heroRef, heroInView] = useOptimizedInView(0.3)
  const [aboutRef, aboutInView] = useOptimizedInView(0.2)
  const [dettaglioRef, dettaglioInView] = useOptimizedInView(0.2)
  const [servicesRef, servicesInView] = useOptimizedInView(0.2)
  const [productsRef, productsInView] = useOptimizedInView(0.2)
  const [wholesaleRef, wholesaleInView] = useOptimizedInView(0.2)
  const [contactRef, contactInView] = useOptimizedInView(0.2)
  const [footerRef, footerInView] = useOptimizedInView(0.5)

  // 🎯 MOBILE DOCK VISIBILITY
  const isDockVisible = useMobileDockVisibility(appState.currentSection, footerInView)

  // 🎯 MEMOIZED VALUES
  const sectionVisibility = useMemo(() => ({
    hero: heroInView,
    about: aboutInView,
    dettaglio: dettaglioInView,
    services: servicesInView,
    products: productsInView,
    wholesale: wholesaleInView,
    contact: contactInView,
    footer: footerInView
  }), [heroInView, aboutInView, dettaglioInView, servicesInView, productsInView, wholesaleInView, contactInView, footerInView])

  // 🎯 CURRENT SECTION DETECTION ottimizzato
  useEffect(() => {
    const currentSection = Object.entries(sectionVisibility)
      .reverse() // Check from bottom to top
      .find(([, isVisible]) => isVisible)?.[0] || 'hero'

    if (currentSection !== appState.currentSection) {
      setAppState(prev => ({ ...prev, currentSection }))
      
      // Analytics tracking ottimizzato
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'section_view', {
          event_category: 'navigation',
          event_label: currentSection,
          value: 1
        })
      }
    }
  }, [sectionVisibility, appState.currentSection])

  // 🎯 LANGUAGE MANAGEMENT
  useEffect(() => {
    const savedLanguage = localStorage.getItem('bottamedi-language') as 'it' | 'de'
    if (savedLanguage && savedLanguage !== appState.language) {
      setAppState(prev => ({ ...prev, language: savedLanguage }))
    }
  }, [])

  // 🎯 HANDLERS ottimizzati con useCallback
  const updateLanguage = useCallback((language: 'it' | 'de') => {
    setAppState(prev => ({ ...prev, language }))
    localStorage.setItem('bottamedi-language', language)
    document.documentElement.lang = language
    
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'language_change', {
        event_category: 'user_interaction',
        event_label: language,
        value: 1
      })
    }
  }, [])

  const toggleMenu = useCallback(() => {
    setAppState(prev => ({ 
      ...prev, 
      isMenuOpen: !prev.isMenuOpen 
    }))
  }, [])

  // 🎯 LEGAL DOCUMENTS HANDLER ottimizzato
  const handleLegalDocumentOpen = useCallback((event: CustomEvent) => {
    const { docType, language: eventLang } = event.detail
    
    if (eventLang === appState.language) {
      console.log('📋 Opening legal document:', docType)
      setAppState(prev => ({ ...prev, showLegalDocs: true }))
      
      // Smooth scroll to legal section
      setTimeout(() => {
        const element = document.getElementById('legal-documents')
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }, [appState.language])

  // Event listeners per documenti legali
  useEffect(() => {
    const handleEvent = (e: any) => handleLegalDocumentOpen(e)
    
    window.addEventListener('openLegalDocument', handleEvent)
    document.addEventListener('openLegalDocument', handleEvent)
    
    return () => {
      window.removeEventListener('openLegalDocument', handleEvent)
      document.removeEventListener('openLegalDocument', handleEvent)
    }
  }, [handleLegalDocumentOpen])

  const closeLegalDocs = useCallback(() => {
    setAppState(prev => ({ ...prev, showLegalDocs: false }))
    
    // Scroll back to footer
    setTimeout(() => {
      const footer = document.querySelector('footer')
      if (footer) {
        footer.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }, [])

  // 🎯 ANIMATION VARIANTS ottimizzate
  const pageVariants = useMemo(() => ({
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  }), [])

  const pageTransition = useMemo(() => ({
    type: 'tween' as const,
    ease: 'easeOut' as const,
    duration: 0.4
  }), [])

  // 🎯 RENDER
  return (
    <>
      {/* 🎨 INLINE STYLES */}
      <style>{inlineStyles}</style>

      {/* 📊 SEO HEAD */}
      <Helmet>
        <title>Bottamedi Frutta e Verdura | Eccellenza Trentina dal 1974</title>
        <meta name="description" content="Scopri 50 anni di tradizione familiare nell'ortofrutta. Freschezza quotidiana e qualità superiore per retail e HORECA a Mezzolombardo, Trentino." />
        <meta name="keywords" content="frutta verdura, mezzolombardo, trentino, ingrosso ortofrutta, HORECA, freschezza, qualità" />
        <link rel="canonical" href="https://www.bottamedi.eu" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
      </Helmet>

      {/* 📊 PROGRESS BAR */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600 transform-gpu z-50"
        style={{ scaleX, transformOrigin: '0%' }}
      />

      {/* 🎨 BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-5xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-5xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* 🎯 MAIN CONTAINER */}
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="relative min-h-screen bg-white smooth-scroll"
      >
        {/* 🎯 HEADER */}
        <Suspense fallback={<HeaderLoader />}>
          <Header
            language={appState.language}
            onLanguageChange={updateLanguage}
            isMenuOpen={appState.isMenuOpen}
            onToggleMenu={toggleMenu}
          />
        </Suspense>

        {/* 🎯 MAIN CONTENT */}
        <main className="relative">
          
          {/* HERO SECTION */}
          <div ref={heroRef} id="hero">
            <Suspense fallback={<ComponentLoader height="h-screen" />}>
              <HeroSection 
                language={appState.language} 
                inView={sectionVisibility.hero} 
              />
            </Suspense>
          </div>

          {/* ABOUT SECTION */}
          <div ref={aboutRef} id="about">
            <Suspense fallback={<ComponentLoader />}>
              <AboutSection 
                language={appState.language} 
                inView={sectionVisibility.about} 
              />
            </Suspense>
          </div>

          {/* BANCHETTO SECTION */}
          <div ref={dettaglioRef} id="dettaglio">
            <Suspense fallback={<ComponentLoader />}>
              <BanchettoSection 
                language={appState.language} 
                inView={sectionVisibility.dettaglio} 
              />
            </Suspense>
          </div>

          {/* SERVICES SECTION */}
          <div ref={servicesRef} id="services">
            <Suspense fallback={<ComponentLoader />}>
              <ServicesSection 
                language={appState.language} 
                inView={sectionVisibility.services} 
              />
            </Suspense>
          </div>

          {/* PRODUCTS SECTION */}
          <div ref={productsRef} id="products">
            <Suspense fallback={<ComponentLoader />}>
              <ProductsSection 
                language={appState.language} 
                inView={sectionVisibility.products} 
              />
            </Suspense>
          </div>

          {/* WHOLESALE SECTION */}
          <div ref={wholesaleRef} id="wholesale">
            <Suspense fallback={<ComponentLoader />}>
              <WholesaleContact 
                language={appState.language} 
                inView={sectionVisibility.wholesale} 
              />
            </Suspense>
          </div>

          {/* CONTACT SECTION */}
          <div ref={contactRef} id="contact">
            <Suspense fallback={<ComponentLoader />}>
              <ContactSection 
                language={appState.language} 
                inView={sectionVisibility.contact} 
              />
            </Suspense>
          </div>

        </main>

        {/* 🎯 FOOTER */}
        <div ref={footerRef}>
          <Suspense fallback={<ComponentLoader height="h-64" />}>
            <Footer language={appState.language} />
          </Suspense>
        </div>

        {/* 🎯 LEGAL DOCUMENTS SECTION */}
        <AnimatePresence>
          {appState.showLegalDocs && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
              id="legal-documents"
            >
              <Suspense fallback={<ComponentLoader height="h-64" />}>
                <LegalDocuments language={appState.language} />
              </Suspense>
              
              {/* Close button */}
              <div className="fixed bottom-4 right-4 z-50">
                <motion.button
                  onClick={closeLegalDocs}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-gray-600 hover:text-gray-900 p-3 rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🎯 MOBILE MENU OVERLAY */}
        <AnimatePresence>
          {appState.isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={toggleMenu}
            />
          )}
        </AnimatePresence>

      </motion.div>

      {/* 🎯 MOBILE DOCK - OTTIMIZZATO */}
      <div className="mobile-dock-container">
        <AnimatePresence>
          {isDockVisible && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ 
                type: 'spring', 
                damping: 25, 
                stiffness: 300,
                duration: 0.3
              }}
            >
              <Suspense fallback={null}>
                <MobileDock 
                  language={appState.language}
                  hideInFooter={false} // Gestito dal hook
                />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 🍪 COOKIE BANNER - LAZY */}
      <Suspense fallback={null}>
        <CookieBanner language={appState.language} />
      </Suspense>

    </>
  )
}

export default App
