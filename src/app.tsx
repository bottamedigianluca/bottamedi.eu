import React, { Suspense, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

// Lazy load components for better performance
const Header = React.lazy(() => import('./components/layout/Header'))
const HeroSection = React.lazy(() => import('./components/sections/HeroSection'))
const AboutSection = React.lazy(() => import('./components/sections/AboutSection'))
const BanchettoSection = React.lazy(() => import('./components/sections/Banchettosection'))
const ServicesSection = React.lazy(() => import('./components/sections/ServicesSection'))
const ProductsSection = React.lazy(() => import('./components/sections/ProductsSection'))
const WholesaleContact = React.lazy(() => import('./components/sections/Wholesalecontact'))
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

// 🍎 HAPTIC FEEDBACK iOS-COMPATIBLE CORRETTO
const GlobalHapticIntegration: React.FC = () => {
  useEffect(() => {
    let userInteracted = false;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    console.log(`🍎 Device: ${isIOS ? 'iOS' : 'Other'}, Haptic API: ${'vibrate' in navigator}`);

    const triggerHaptic = (pattern: number[]) => {
      if (!('vibrate' in navigator)) {
        return false;
      }

      // iOS richiede interazione utente prima
      if (isIOS && !userInteracted) {
        console.log('🍎 iOS: Haptic bloccato - serve interazione utente prima');
        return false;
      }

      try {
        // iOS preferisce pattern semplici
        const finalPattern = isIOS ? [pattern[0] || 25] : pattern;
        const result = navigator.vibrate(finalPattern);
        
        if (result) {
          console.log(`🎯 Haptic success: ${finalPattern}`);
        } else {
          console.log(`🎯 Haptic failed: ${finalPattern}`);
        }
        
        return result;
      } catch (error) {
        console.warn('🎯 Haptic error:', error);
        return false;
      }
    }

    // Marca interazione utente
    const markUserInteraction = () => {
      if (!userInteracted) {
        userInteracted = true;
        console.log('🎯 User interaction detected, haptics enabled');
        
        // Test immediato su iOS dopo prima interazione
        if (isIOS) {
          setTimeout(() => {
            triggerHaptic([25]);
          }, 100);
        }
      }
    };

    // 🎯 GLOBAL HAPTICS OTTIMIZZATI
    const handleGlobalClick = (e: MouseEvent) => {
      markUserInteraction(); // CRITICAL per iOS
      
      const target = e.target as HTMLElement;
      
      if (target.tagName === 'BUTTON' && !target.hasAttribute('data-no-haptic')) {
        triggerHaptic([25]); // Semplificato per iOS
      }
      
      if (target.tagName === 'A' && !target.hasAttribute('data-no-haptic')) {
        triggerHaptic([15]);
      }
      
      if (target.closest('[data-clickable]')) {
        triggerHaptic([20]);
      }
    }

    // 📱 MOBILE TOUCH HAPTICS iOS-COMPATIBLE
    const handleTouchStart = (e: TouchEvent) => {
      markUserInteraction(); // CRITICAL per iOS
      
      const target = e.target as HTMLElement;
      
      if (window.innerWidth < 768) {
        if (target.tagName === 'BUTTON') {
          triggerHaptic([25]);
          target.style.transform = 'scale(0.98)';
          target.style.transition = 'transform 0.1s ease';
        } else if (target.tagName === 'A') {
          triggerHaptic([15]);
          target.style.transform = 'scale(0.98)';
          target.style.transition = 'transform 0.1s ease';
        }
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      
      if (window.innerWidth < 768) {
        if (target.tagName === 'BUTTON' || target.tagName === 'A') {
          setTimeout(() => {
            target.style.transform = 'scale(1)';
          }, 100);
        }
      }
    }

    // Form haptics
    const handleFormSubmit = () => {
      markUserInteraction();
      triggerHaptic([30, 15, 25]);
    }

    const handleInputFocus = (e: FocusEvent) => {
      markUserInteraction();
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        triggerHaptic([20]);
      }
    }

    // INIZIALIZZAZIONE RITARDATA per iOS
    setTimeout(() => {
      if ('vibrate' in navigator) {
        console.log('🎯 Haptic System initialized!');
        if (isIOS) {
          console.log('🍎 iOS detected: haptics will activate after user interaction');
        } else {
          // Test immediato solo su non-iOS
          triggerHaptic([20, 15, 25]);
          console.log('🎯 Haptic test completed!');
        }
      } else {
        console.warn('⚠️ Haptic Feedback NOT supported on this device');
      }
    }, 1000);

    // Event listeners con priorità per iOS
    const events = ['click', 'touchstart', 'touchend', 'mousedown', 'keydown'];
    events.forEach(event => {
      if (event === 'click') {
        document.addEventListener(event, handleGlobalClick);
      } else if (event === 'touchstart') {
        document.addEventListener(event, handleTouchStart, { passive: true });
      } else if (event === 'touchend') {
        document.addEventListener(event, handleTouchEnd, { passive: true });
      } else {
        document.addEventListener(event, markUserInteraction, { passive: true });
      }
    });

    document.addEventListener('submit', handleFormSubmit);
    document.addEventListener('focusin', handleInputFocus);

    // Cleanup
    return () => {
      document.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('submit', handleFormSubmit);
      document.removeEventListener('focusin', handleInputFocus);
      
      events.forEach(event => {
        if (!['click', 'touchstart', 'touchend'].includes(event)) {
          document.removeEventListener(event, markUserInteraction);
        }
      });
    }
  }, [])

  return null
}

// 🍎 PREMIUM GLOBAL STYLES OTTIMIZZATI
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

      /* 📱 MOBILE OPTIMIZATION - ELIMINA RITARDI 300MS */
      @media (max-width: 767px) {
        * {
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          user-select: none;
          /* ELIMINA RITARDO 300MS */
          touch-action: manipulation;
        }

        input, textarea, [contenteditable] {
          -webkit-user-select: text;
          user-select: text;
          touch-action: auto;
        }

        button, a, [role="button"] {
          /* ELIMINA COMPLETAMENTE IL RITARDO */
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }

        html {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          /* VIEWPORT OTTIMIZZATO */
          -webkit-text-size-adjust: 100%;
        }
        
        body {
          overscroll-behavior: contain;
          padding-bottom: env(safe-area-inset-bottom, 0);
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

      /* 📱 MOBILE DOCK GARANTITO - FORCE STYLES */
      .mobile-dock-container {
        position: fixed !important;
        bottom: 0 !important;
        left: 0 !important;
        right: 0 !important;
        z-index: 9999 !important;
        pointer-events: auto !important;
        display: block !important;
      }

      /* NASCONDE SU DESKTOP */
      @media (min-width: 1024px) {
        .mobile-dock-container {
          display: none !important;
        }
      }

      /* FORCE su mobile */
      @media (max-width: 1023px) {
        .mobile-dock-container {
          display: block !important;
        }
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

  // Intersection observer per TUTTE le sezioni incluso wholesale
  const [heroRef, heroInView] = useInView({ threshold: 0.1 })
  const [aboutRef, aboutInView] = useInView({ threshold: 0.1 })
  const [dettaglioRef, dettaglioInView] = useInView({ threshold: 0.1 })
  const [servicesRef, servicesInView] = useInView({ threshold: 0.1 })
  const [productsRef, productsInView] = useInView({ threshold: 0.1 })
  const [wholesaleRef, wholesaleInView] = useInView({ threshold: 0.1 })
  const [contactRef, contactInView] = useInView({ threshold: 0.1 })

  // Language persistence
  useEffect(() => {
    const savedLanguage = localStorage.getItem('bottamedi-language') as 'it' | 'de'
    if (savedLanguage) {
      setState(prev => ({ ...prev, language: savedLanguage }))
    }
  }, [])

  // Detect current section - AGGIUNTO WHOLESALE
  useEffect(() => {
    if (heroInView) setState(prev => ({ ...prev, currentSection: 'hero' }))
    else if (aboutInView) setState(prev => ({ ...prev, currentSection: 'about' }))
    else if (dettaglioInView) setState(prev => ({ ...prev, currentSection: 'dettaglio' }))
    else if (servicesInView) setState(prev => ({ ...prev, currentSection: 'services' }))
    else if (productsInView) setState(prev => ({ ...prev, currentSection: 'products' }))
    else if (wholesaleInView) setState(prev => ({ ...prev, currentSection: 'wholesale' }))
    else if (contactInView) setState(prev => ({ ...prev, currentSection: 'contact' }))
  }, [heroInView, aboutInView, dettaglioInView, servicesInView, productsInView, wholesaleInView, contactInView])

  const updateLanguage = (language: 'it' | 'de') => {
    setState(prev => ({ ...prev, language }))
    localStorage.setItem('bottamedi-language', language)
    document.documentElement.lang = language
    
    // 🍎 HAPTIC ON LANGUAGE CHANGE - iOS Compatible
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([25]) // Semplificato per iOS
      } catch (e) {
        console.log('Haptic non disponibile')
      }
    }
  }

  const toggleMenu = () => {
    setState(prev => ({ ...prev, isMenuOpen: !prev.isMenuOpen }))
    
    // 🍎 HAPTIC ON MENU TOGGLE - iOS Compatible
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([25]) // Semplificato per iOS
      } catch (e) {
        console.log('Haptic non disponibile')
      }
    }
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
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

          {/* AGGIUNTA: Wholesale Section - IMPORTANTE! */}
          <div ref={wholesaleRef}>
            <Suspense fallback={<SectionLoader />}>
              <WholesaleContact language={state.language} inView={wholesaleInView} />
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

      {/* 📱 MOBILE DOCK - CONTAINER GARANTITO CON FORCE STYLES */}
      <div className="mobile-dock-container lg:hidden">
        <Suspense fallback={null}>
          <MobileDock language={state.language} />
        </Suspense>
      </div>
    </>
  )
}

export default App
