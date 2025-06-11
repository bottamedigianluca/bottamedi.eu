import React, { Suspense, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

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
const CookieBanner = React.lazy(() => import('./components/legal/CookieBanner'))
const LegalDocuments = React.lazy(() => import('./components/legal/LegalDocuments'))
const BreadcrumbNavigation = React.lazy(() => import('./components/navigation/BreadcrumbNavigation'))

// Import hooks for optimization
import { useBreadcrumb } from './components/navigation/BreadcrumbNavigation'

const SectionLoader = () => (
  <div className="h-96 flex items-center justify-center">
    <div className="relative">
      <div className="w-8 h-8 border-2 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
    </div>
  </div>
)

const GlobalHapticIntegration: React.FC = () => {
  useEffect(() => {
    let userInteracted = false;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    console.log(`🍎 Device: ${isIOS ? 'iOS' : 'Other'}, Haptic API: ${'vibrate' in navigator}`);

    const triggerHaptic = (pattern: number[]) => {
      if (!('vibrate' in navigator)) {
        return false;
      }

      if (isIOS && !userInteracted) {
        console.log('🍎 iOS: Haptic bloccato - serve interazione utente prima');
        return false;
      }

      try {
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

    const markUserInteraction = () => {
      if (!userInteracted) {
        userInteracted = true;
        console.log('🎯 User interaction detected, haptics enabled');
        
        if (isIOS) {
          setTimeout(() => {
            triggerHaptic([25]);
          }, 100);
        }
      }
    };

    const handleGlobalClick = (e: MouseEvent) => {
      markUserInteraction(); 
      
      const target = e.target as HTMLElement;
      
      if (target.tagName === 'BUTTON' && !target.hasAttribute('data-no-haptic')) {
        triggerHaptic([25]);
      }
      
      if (target.tagName === 'A' && !target.hasAttribute('data-no-haptic')) {
        triggerHaptic([15]);
      }
      
      if (target.closest('[data-clickable]')) {
        triggerHaptic([20]);
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      markUserInteraction();
      
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

    setTimeout(() => {
      if ('vibrate' in navigator) {
        console.log('🎯 Haptic System initialized!');
        if (isIOS) {
          console.log('🍎 iOS detected: haptics will activate after user interaction');
        } else {
          triggerHaptic([20, 15, 25]);
          console.log('🎯 Haptic test completed!');
        }
      } else {
        console.warn('⚠️ Haptic Feedback NOT supported on this device');
      }
    }, 1000);

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

const PremiumGlobalStyles: React.FC = () => {
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
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
      @media (max-width: 767px) {
        * {
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          user-select: none;
          touch-action: manipulation;
        }
        input, textarea, [contenteditable] {
          -webkit-user-select: text;
          user-select: text;
          touch-action: auto;
        }
        button, a, [role="button"] {
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }
        html {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          -webkit-text-size-adjust: 100%;
        }
        body {
          overscroll-behavior: contain;
          padding-bottom: env(safe-area-inset-bottom, 0);
        }
      }
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
      button:focus, a:focus, input:focus, textarea:focus {
        outline: 2px solid rgba(34, 197, 94, 0.5) !important;
        outline-offset: 2px !important;
      }
      .apple-font {
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif !important;
      }
      .glass {
        background: rgba(255, 255, 255, 0.25) !important;
        backdrop-filter: blur(10px) !important;
        -webkit-backdrop-filter: blur(10px) !important;
        border: 1px solid rgba(255, 255, 255, 0.18) !important;
      }
      .mobile-dock-container {
        position: fixed !important;
        left: 0 !important;
        right: 0 !important;
        pointer-events: none !important;
        display: block !important;
      }
      @media (min-width: 1024px) {
        .mobile-dock-container {
          display: none !important;
        }
      }
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

interface AppState {
  language: 'it' | 'de'
  isMenuOpen: boolean
  currentSection: string
  showLegalDocs: boolean
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    language: 'it',
    isMenuOpen: false,
    currentSection: 'hero',
    showLegalDocs: false
  })

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  const [heroRef, heroInView] = useInView({ threshold: 0.1 })
  const [aboutRef, aboutInView] = useInView({ threshold: 0.1 })
  const [dettaglioRef, dettaglioInView] = useInView({ threshold: 0.1 })
  const [servicesRef, servicesInView] = useInView({ threshold: 0.1 })
  const [productsRef, productsInView] = useInView({ threshold: 0.1 })
  const [wholesaleRef, wholesaleInView] = useInView({ threshold: 0.1 })
  const [contactRef, contactInView] = useInView({ threshold: 0.1 })
  const [footerRef, footerInView] = useInView({ threshold: 0.3 })

  // Breadcrumb visibility hook
  const showBreadcrumb = useBreadcrumb(state.currentSection)

  useEffect(() => {
    const savedLanguage = localStorage.getItem('bottamedi-language') as 'it' | 'de'
    if (savedLanguage) {
      setState(prev => ({ ...prev, language: savedLanguage }))
    }
  }, [])

  useEffect(() => {
    if (heroInView) setState(prev => ({ ...prev, currentSection: 'hero' }))
    else if (aboutInView) setState(prev => ({ ...prev, currentSection: 'about' }))
    else if (dettaglioInView) setState(prev => ({ ...prev, currentSection: 'dettaglio' }))
    else if (servicesInView) setState(prev => ({ ...prev, currentSection: 'services' }))
    else if (productsInView) setState(prev => ({ ...prev, currentSection: 'products' }))
    else if (wholesaleInView) setState(prev => ({ ...prev, currentSection: 'wholesale' }))
    else if (contactInView) setState(prev => ({ ...prev, currentSection: 'contact' }))
  }, [heroInView, aboutInView, dettaglioInView, servicesInView, productsInView, wholesaleInView, contactInView])

  // Track section views
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag && state.currentSection) {
      window.gtag('event', 'section_view', {
        event_category: 'engagement',
        event_label: state.currentSection,
        custom_parameter_section: state.currentSection
      })
    }
  }, [state.currentSection])

  const updateLanguage = (language: 'it' | 'de') => {
    setState(prev => ({ ...prev, language }))
    localStorage.setItem('bottamedi-language', language)
    document.documentElement.lang = language
    
    // Track language change
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'language_change', {
        event_category: 'user_preference',
        event_label: language,
        value: 1
      })
    }
    
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([25])
      } catch (e) {
        console.log('Haptic non disponibile')
      }
    }
  }

  const toggleMenu = () => {
    setState(prev => ({ ...prev, isMenuOpen: !prev.isMenuOpen }))
    
    // Track menu interactions
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'menu_toggle', {
        event_category: 'navigation',
        event_label: state.isMenuOpen ? 'close' : 'open'
      })
    }
    
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([25])
      } catch (e) {
        console.log('Haptic non disponibile')
      }
    }
  }

  const toggleLegalDocs = () => {
    setState(prev => ({ ...prev, showLegalDocs: !prev.showLegalDocs }))
    
    // Track legal docs access
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'legal_docs_toggle', {
        event_category: 'privacy',
        event_label: state.showLegalDocs ? 'close' : 'open'
      })
    }
  }

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
      <GlobalHapticIntegration />
      <PremiumGlobalStyles />
      <Helmet>
        <title>Bottamedi Frutta e Verdura | Eccellenza Trentina dal 1974</title>
        <meta name="description" content="Scopri 50 anni di tradizione familiare nell'ortofrutta. Freschezza quotidiana e qualità superiore per retail e HORECA a Mezzolombardo, Trentino." />
        <meta name="keywords" content="frutta verdura, mezzolombardo, trentino, ingrosso ortofrutta, HORECA, freschezza, qualità" />
        <link rel="canonical" href="https://www.bottamedi.eu" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Helmet>

      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600 transform-gpu z-50"
        style={{ scaleX, transformOrigin: '0%' }}
      />

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
        <Suspense fallback={<div className="h-20 bg-white/80 backdrop-blur-md" />}>
          <Header
            language={state.language}
            onLanguageChange={updateLanguage}
            isMenuOpen={state.isMenuOpen}
            onToggleMenu={toggleMenu}
          />
        </Suspense>

        {/* Breadcrumb Navigation */}
        <AnimatePresence>
          {showBreadcrumb && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="fixed top-20 left-0 right-0 z-40"
            >
              <Suspense fallback={null}>
                <BreadcrumbNavigation
                  language={state.language}
                  currentSection={state.currentSection}
                  items={[]} // Auto-generated based on currentSection
                />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="relative">
          <div ref={heroRef} id="hero">
            <Suspense fallback={<SectionLoader />}>
              <HeroSection language={state.language} inView={heroInView} />
            </Suspense>
          </div>
          <div ref={aboutRef} id="about">
            <Suspense fallback={<SectionLoader />}>
              <AboutSection language={state.language} inView={aboutInView} />
            </Suspense>
          </div>
          <div ref={dettaglioRef} id="dettaglio">
            <Suspense fallback={<SectionLoader />}>
              <BanchettoSection language={state.language} inView={dettaglioInView} />
            </Suspense>
          </div>
          <div ref={servicesRef} id="services">
            <Suspense fallback={<SectionLoader />}>
              <ServicesSection language={state.language} inView={servicesInView} />
            </Suspense>
          </div>
          <div ref={productsRef} id="products">
            <Suspense fallback={<SectionLoader />}>
              <ProductsSection language={state.language} inView={productsInView} />
            </Suspense>
          </div>
          <div ref={wholesaleRef} id="wholesale">
            <Suspense fallback={<SectionLoader />}>
              <WholesaleContact language={state.language} inView={wholesaleInView} />
            </Suspense>
          </div>
          <div ref={contactRef} id="contact">
            <Suspense fallback={<SectionLoader />}>
              <ContactSection language={state.language} inView={contactInView} />
            </Suspense>
          </div>
        </main>

        <div ref={footerRef}>
          <Suspense fallback={<div className="h-64 bg-neutral-900" />}>
            <Footer 
              language={state.language} 
              onLegalDocsToggle={toggleLegalDocs}
            />
          </Suspense>
        </div>

        {/* Legal Documents Section - NEW INTEGRATION */}
        <AnimatePresence>
          {state.showLegalDocs && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              id="legal-documents"
            >
              <Suspense fallback={<div className="h-64 bg-gray-50" />}>
                <LegalDocuments language={state.language} />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Always visible Legal Documents section (as per your request) */}
        <div id="legal-documents-static">
          <Suspense fallback={<div className="h-64 bg-gray-50" />}>
            <LegalDocuments language={state.language} />
          </Suspense>
        </div>

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

      <div className="mobile-dock-container lg:hidden">
        <Suspense fallback={null}>
          <MobileDock 
            language={state.language} 
            hideInFooter={footerInView}
          />
        </Suspense>
      </div>

      {/* Cookie Banner */}
      <Suspense fallback={null}>
        <CookieBanner language={state.language} />
      </Suspense>
    </>
  )
}

export default App
