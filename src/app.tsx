import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

// Import diretti senza lazy loading
import Header from './components/layout/Header'
import HeroSection from './components/sections/HeroSection'
import AboutSection from './components/sections/AboutSection'
import BanchettoSection from './components/sections/Banchettosection'
import ServicesSection from './components/sections/ServicesSection'
import ProductsSection from './components/sections/ProductsSection'
import WholesaleContact from './components/sections/Wholesalecontact'
import ContactSection from './components/sections/ContactSection'
import Footer from './components/layout/Footer'
import MobileDock from './components/layout/MobileDock'
import CookieBanner from './components/legal/CookieBanner'
import LegalDocuments from './components/legal/LegalDocuments'

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
        <Header
          language={state.language}
          onLanguageChange={updateLanguage}
          isMenuOpen={state.isMenuOpen}
          onToggleMenu={toggleMenu}
        />

        <main className="relative">
          <div ref={heroRef} id="hero">
            <HeroSection language={state.language} inView={heroInView} />
          </div>
          <div ref={aboutRef} id="about">
            <AboutSection language={state.language} inView={aboutInView} />
          </div>
          <div ref={dettaglioRef} id="dettaglio">
            <BanchettoSection language={state.language} inView={dettaglioInView} />
          </div>
          <div ref={servicesRef} id="services">
            <ServicesSection language={state.language} inView={servicesInView} />
          </div>
          <div ref={productsRef} id="products">
            <ProductsSection language={state.language} inView={productsInView} />
          </div>
          <div ref={wholesaleRef} id="wholesale">
            <WholesaleContact language={state.language} inView={wholesaleInView} />
          </div>
          <div ref={contactRef} id="contact">
            <ContactSection language={state.language} inView={contactInView} />
          </div>
        </main>

        <div ref={footerRef}>
          <Footer language={state.language} />
        </div>

        {/* Legal Documents Section */}
        <div id="legal-documents">
          <LegalDocuments language={state.language} />
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
        <MobileDock 
          language={state.language} 
          hideInFooter={footerInView}
        />
      </div>

      {/* Cookie Banner */}
      <CookieBanner language={state.language} />
    </>
  )
}

export default App
