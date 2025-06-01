import React, { Suspense, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { haptic, triggerHapticOnScroll, triggerHapticOnSectionChange } from './utils/haptics'

// 🍎 HAPTIC IMPORTS
import { haptic, triggerHapticOnScroll, triggerHapticOnSectionChange } from './utils/haptics'

// Lazy load components for better performance
const Header = React.lazy(() => import('./components/layout/Header'))
const HeroSection = React.lazy(() => import('./components/sections/HeroSection'))
const AboutSection = React.lazy(() => import('./components/sections/AboutSection'))
const BanchettoSection = React.lazy(() => import('./components/sections/Banchettosection'))
const ServicesSection = React.lazy(() => import('./components/sections/ServicesSection'))
const ProductsSection = React.lazy(() => import('./components/sections/ProductsSection'))
const ContactSection = React.lazy(() => import('./components/sections/ContactSection'))
const Footer = React.lazy(() => import('./components/layout/Footer'))
const MobileDock = React.lazy(() => import('./components/layout/MobileDock'))

// Performance optimized loading component
const SectionLoader = () => (
  <div className="h-96 flex items-center justify-center">
    <div className="relative">
      <div className="w-8 h-8 border-2 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
    </div>
  </div>
)

// 🍎 GLOBAL HAPTIC INTEGRATION COMPONENT
const GlobalHapticIntegration: React.FC = () => {
  useEffect(() => {
    // 🎯 GLOBAL CLICK HAPTICS
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      // Button haptics
      if (target.tagName === 'BUTTON' && !target.hasAttribute('data-no-haptic')) {
        haptic.trigger('button')
      }
      
      // Link haptics
      if (target.tagName === 'A' && !target.hasAttribute('data-no-haptic')) {
        haptic.trigger('tap')
      }
      
      // Card/clickable haptics
      if (target.closest('[data-clickable]')) {
        haptic.trigger('selection')
      }
    }

    // 📱 MOBILE TOUCH HAPTICS
    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement
      
      if (window.innerWidth < 768) {
        if (target.tagName === 'BUTTON' || target.tagName === 'A') {
          target.style.transform = 'scale(0.98)'
          target.style.transition = 'transform 0.1s ease'
        }
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const target = e.target as HTMLElement
      
      if (window.innerWidth < 768) {
        if (target.tagName === 'BUTTON' || target.tagName === 'A') {
          setTimeout(() => {
            target.style.transform = 'scale(1)'
          }, 100)
        }
      }
    }

    // 🔄 FORM HAPTICS
    const handleFormSubmit = () => {
      haptic.trigger('success')
    }

    const handleInputFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        haptic.trigger('tap')
      }
    }

    // 📱 MOBILE SCROLL HAPTICS
    const cleanupScroll = triggerHapticOnScroll()

    // 🎯 SECTION INTERSECTION HAPTICS
    const cleanupSections = triggerHapticOnSectionChange(['hero', 'about', 'dettaglio', 'services', 'products', 'contact'])

    // Add event listeners
    document.addEventListener('click', handleGlobalClick)
    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })
    document.addEventListener('submit', handleFormSubmit)
    document.addEventListener('focusin', handleInputFocus)

    // Cleanup
    return () => {
      document.removeEventListener('click', handleGlobalClick)
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
      document.removeEventListener('submit', handleFormSubmit)
      document.removeEventListener('focusin', handleInputFocus)
      cleanupScroll()
      cleanupSections()
    }
  }, [])

  return null
}

// 🍎 PREMIUM GLOBAL STYLES
const PremiumGlobalStyles: React.FC = () => {
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      /* 🍎 PREMIUM INTERACTIONS */
      button, .button {
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        user-select: none;
      }

      button:active, .button:active {
        transform: scale(0.98) !important;
      }

      a {
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
      }

      a:active {
        transform: scale(0.98) !important;
      }

      /* 📱 MOBILE OPTIMIZATION */
      @media (max-width: 767px) {
        * {
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          user-select: none;
        }

        input, textarea, [contenteditable] {
          -webkit-user-select: text;
          user-select: text;
        }

        html {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        
        body {
          overscroll-behavior: contain;
        }
      }

      /* 🎨 PREMIUM CARDS */
      [data-clickable] {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
      }

      [data-clickable]:hover {
        transform: translateY(-2px) !important;
      }

      [data-clickable]:active {
        transform: translateY(0) scale(0.98) !important;
      }

      /* 🌟 PREMIUM FOCUS */
      button:focus, a:focus, input:focus, textarea:focus {
        outline: 2px solid rgba(34, 197, 94, 0.5) !important;
        outline-offset: 2px !important;
      }

      /* 🍎 APPLE FONTS */
      .apple-font {
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif !important;
      }

      /* 🌈 GLASS MORPHISM */
      .glass {
        background: rgba(255, 255, 255, 0.25) !important;
        backdrop-filter: blur(10px) !important;
        -webkit-backdrop-filter: blur(10px) !important;
        border: 1px solid rgba(255, 255, 255, 0.18) !important;
      }

      /* 📱 MOBILE DOCK ENSURES IT'S ALWAYS VISIBLE */
      #mobile-dock-container {
        position: fixed !important;
        z-index: 999999 !important;
        pointer-events: auto !important;
      }
    `
    
    document.head.appendChild(style)
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }
  }, [])

  return null
}

// Global state for language and theme
interface AppState {
  language: 'it' | 'de'
  isMenuOpen: boolean
  currentSection: string
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    language: 'it',
    isMenuOpen: false,
    currentSection: 'hero'
  })

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Intersection observer per le sezioni
  const [heroRef, heroInView] = useInView({ threshold: 0.1 })
  const [aboutRef, aboutInView] = useInView({ threshold: 0.1 })
  const [dettaglioRef, dettaglioInView] = useInView({ threshold: 0.1 })
  const [servicesRef, servicesInView] = useInView({ threshold: 0.1 })
  const [productsRef, productsInView] = useInView({ threshold: 0.1 })
  const [contactRef, contactInView] = useInView({ threshold: 0.1 })

  // Language persistence
  useEffect(() => {
    const savedLanguage = localStorage.getItem('bottamedi-language') as 'it' | 'de'
    if (savedLanguage) {
      setState(prev => ({ ...prev, language: savedLanguage }))
    }
  }, [])

  // Detect current section
  useEffect(() => {
    if (heroInView) setState(prev => ({ ...prev, currentSection: 'hero' }))
    else if (aboutInView) setState(prev => ({ ...prev, currentSection: 'about' }))
    else if (dettaglioInView) setState(prev => ({ ...prev, currentSection: 'dettaglio' }))
    else if (servicesInView) setState(prev => ({ ...prev, currentSection: 'services' }))
    else if (productsInView) setState(prev => ({ ...prev, currentSection: 'products' }))
    else if (contactInView) setState(prev => ({ ...prev, currentSection: 'contact' }))
  }, [heroInView, aboutInView, dettaglioInView, servicesInView, productsInView, contactInView])

  const updateLanguage = (language: 'it' | 'de') => {
    setState(prev => ({ ...prev, language }))
    localStorage.setItem('bottamedi-language', language)
    document.documentElement.lang = language
    
    // 🍎 HAPTIC ON LANGUAGE CHANGE
    haptic.trigger('toggle')
  }

  const toggleMenu = () => {
    setState(prev => ({ ...prev, isMenuOpen: !prev.isMenuOpen }))
    
    // 🍎 HAPTIC ON MENU TOGGLE
    haptic.trigger('button')
  }

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  }

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4
  }

  return (
    <>
      {/* 🍎 HAPTIC & STYLES INTEGRATION */}
      <GlobalHapticIntegration />
      <PremiumGlobalStyles />

      <Helmet>
        <title>Bottamedi Frutta e Verdura | Eccellenza Trentina dal 1974</title>
        <meta name="description" content="Scopri 50 anni di tradizione familiare nell'ortofrutta. Freschezza quotidiana e qualità superiore per retail e HORECA a Mezzolombardo, Trentino." />
        <meta name="keywords" content="frutta verdura, mezzolombardo, trentino, ingrosso ortofrutta, HORECA, freschezza, qualità" />
        <link rel="canonical" href="https://www.bottamedi.eu" />
      </Helmet>

      {/* Progress bar ottimizzato */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600 transform-gpu z-50"
        style={{ scaleX, transformOrigin: '0%' }}
      />

      {/* Background mesh gradient semplificato */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-5xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-5xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="relative min-h-screen bg-white"
      >
        {/* Header */}
        <Suspense fallback={<div className="h-20 bg-white/80 backdrop-blur-md" />}>
          <Header
            language={state.language}
            onLanguageChange={updateLanguage}
            isMenuOpen={state.isMenuOpen}
            onToggleMenu={toggleMenu}
          />
        </Suspense>

        {/* Main content */}
        <main className="relative">
          {/* Hero Section */}
          <div ref={heroRef}>
            <Suspense fallback={<SectionLoader />}>
              <HeroSection language={state.language} inView={heroInView} />
            </Suspense>
          </div>

          {/* About Section */}
          <div ref={aboutRef}>
            <Suspense fallback={<SectionLoader />}>
              <AboutSection language={state.language} inView={aboutInView} />
            </Suspense>
          </div>

          {/* Banchetto Section */}
          <div ref={dettaglioRef}>
            <Suspense fallback={<SectionLoader />}>
              <BanchettoSection language={state.language} inView={dettaglioInView} />
            </Suspense>
          </div>

          {/* Services Section */}
          <div ref={servicesRef}>
            <Suspense fallback={<SectionLoader />}>
              <ServicesSection language={state.language} inView={servicesInView} />
            </Suspense>
          </div>

          {/* Products Section */}
          <div ref={productsRef}>
            <Suspense fallback={<SectionLoader />}>
              <ProductsSection language={state.language} inView={productsInView} />
            </Suspense>
          </div>

          {/* Contact Section */}
          <div ref={contactRef}>
            <Suspense fallback={<SectionLoader />}>
              <ContactSection language={state.language} inView={contactInView} />
            </Suspense>
          </div>
        </main>

        {/* Footer */}
        <Suspense fallback={<div className="h-64 bg-neutral-900" />}>
          <Footer language={state.language} />
        </Suspense>

        {/* Mobile menu overlay */}
        <AnimatePresence>
          {state.isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={toggleMenu}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* 📱 MOBILE DOCK - INDIPENDENTE DAL LAYOUT PRINCIPALE */}
      <Suspense fallback={null}>
        <MobileDock language={state.language} />
      </Suspense>
    </>
  )
}

export default App
