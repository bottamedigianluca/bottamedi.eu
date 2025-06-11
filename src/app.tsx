import React, { useState, useEffect, useCallback, useMemo, Suspense, lazy, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Critical components - load immediately
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HeroSection from './components/sections/HeroSection'

// Non-critical components - lazy load
const MobileDock = lazy(() => import('./components/layout/MobileDock'))
const AboutSection = lazy(() => import('./components/sections/AboutSection'))
const BanchettoSection = lazy(() => import('./components/sections/Banchettosection'))
const ServicesSection = lazy(() => import('./components/sections/ServicesSection'))
const ProductsSection = lazy(() => import('./components/sections/ProductsSection'))
const WholesaleContact = lazy(() => import('./components/sections/Wholesalecontact'))
const ContactSection = lazy(() => import('./components/sections/ContactSection'))
const LegalDocuments = lazy(() => import('./components/legal/LegalDocuments'))
const CookieBanner = lazy(() => import('./components/legal/CookieBanner'))

// Types
type Language = 'it' | 'de'

interface SectionVisibility {
  [key: string]: boolean
}

// Optimized loading fallback
const SectionSkeleton = memo(() => (
  <div className="w-full h-64 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
    <div className="text-gray-400 text-sm">Caricamento...</div>
  </div>
))

SectionSkeleton.displayName = 'SectionSkeleton'

// Image loading optimization component
const OptimizedImage = memo(({ src, alt, className, ...props }: any) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(false)

  const handleLoad = useCallback(() => {
    setIsLoaded(true)
  }, [])

  const handleError = useCallback(() => {
    setError(true)
    // Retry loading after 1 second
    setTimeout(() => {
      setError(false)
      setIsLoaded(false)
    }, 1000)
  }, [])

  if (error) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-xs">Caricamento...</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onLoad={handleLoad}
      onError={handleError}
      loading="lazy"
      decoding="async"
      style={{
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }}
      {...props}
    />
  )
})

OptimizedImage.displayName = 'OptimizedImage'

function App() {
  // State Management
  const [language, setLanguage] = useState<Language>('it')
  const [currentSection, setCurrentSection] = useState('hero')
  const [sectionsInView, setSectionsInView] = useState<SectionVisibility>({
    hero: true,
    about: false,
    dettaglio: false,
    services: false,
    products: false,
    wholesale: false,
    contact: false
  })
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hideInFooter, setHideInFooter] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Optimized mobile detection - FIXED LOGIC
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth
      const userAgent = navigator.userAgent
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
      const isMobileWidth = width <= 768
      
      const shouldBeMobile = isMobileWidth || isMobileUA
      
      console.log('Mobile detection:', { width, isMobileUA, isMobileWidth, shouldBeMobile })
      
      setIsMobile(shouldBeMobile)
      
      // Force DOM updates immediately
      document.body.classList.toggle('mobile-device', shouldBeMobile)
      document.body.classList.toggle('desktop-device', !shouldBeMobile)
      
      // Force mobile dock visibility check
      if (shouldBeMobile) {
        const mobileDockElements = document.querySelectorAll('[class*="mobile"], [class*="Mobile"], .mobile-dock')
        mobileDockElements.forEach(el => {
          (el as HTMLElement).style.display = 'block'
          ;(el as HTMLElement).style.visibility = 'visible'
        })
        
        const headers = document.querySelectorAll('header')
        headers.forEach(el => {
          (el as HTMLElement).style.display = 'none'
        })
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile, { passive: true })
    window.addEventListener('orientationchange', checkMobile, { passive: true })
    
    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('orientationchange', checkMobile)
    }
  }, [])

  // Initial load detection
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Language detection - optimized
  useEffect(() => {
    const savedLanguage = localStorage.getItem('bottamedi-language') as Language
    const browserLanguage = navigator.language.toLowerCase()
    
    if (savedLanguage && (savedLanguage === 'it' || savedLanguage === 'de')) {
      setLanguage(savedLanguage)
    } else if (browserLanguage.includes('de') || browserLanguage.includes('at') || browserLanguage.includes('ch')) {
      setLanguage('de')
    } else {
      setLanguage('it')
    }
  }, [])

  // Language change handler
  const handleLanguageChange = useCallback((newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem('bottamedi-language', newLanguage)
    
    // Non-blocking analytics
    if (typeof window !== 'undefined' && window.gtag) {
      setTimeout(() => {
        window.gtag('event', 'language_change', {
          event_category: 'user_interaction',
          event_label: newLanguage,
          value: 1
        })
      }, 0)
    }
  }, [])

  // Optimized Intersection Observer with better mobile handling
  useEffect(() => {
    if (!isLoaded) return

    const observerOptions = {
      threshold: isMobile ? [0, 0.1, 0.25] : [0, 0.3, 0.5],
      rootMargin: isMobile ? '-20px 0px -20px 0px' : '-80px 0px -80px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      const updates: SectionVisibility = {}
      let newCurrentSection = currentSection
      
      entries.forEach((entry) => {
        const sectionId = entry.target.id
        updates[sectionId] = entry.isIntersecting
        
        if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
          newCurrentSection = sectionId
        }
      })
      
      // Batch updates
      setSectionsInView(prev => ({ ...prev, ...updates }))
      if (newCurrentSection !== currentSection) {
        setCurrentSection(newCurrentSection)
      }
    }, observerOptions)

    const sections = ['hero', 'about', 'dettaglio', 'services', 'products', 'wholesale', 'contact']
    
    // Wait for DOM to be ready
    requestAnimationFrame(() => {
      sections.forEach(id => {
        const element = document.getElementById(id)
        if (element) {
          observer.observe(element)
        }
      })
    })

    return () => observer.disconnect()
  }, [isMobile, currentSection, isLoaded])

  // Optimized footer detection
  useEffect(() => {
    if (!isLoaded) return

    let timeoutId: NodeJS.Timeout

    const handleFooterDetection = () => {
      clearTimeout(timeoutId)
      setIsScrolling(true)

      timeoutId = setTimeout(() => {
        setIsScrolling(false)
        
        const footer = document.querySelector('footer')
        const legalDocs = document.getElementById('legal-documents')
        
        if (footer) {
          const footerRect = footer.getBoundingClientRect()
          const windowHeight = window.innerHeight
          const footerVisible = footerRect.top < windowHeight + 100
          
          setHideInFooter(footerVisible)
        }
      }, 100)
    }

    window.addEventListener('scroll', handleFooterDetection, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleFooterDetection)
      clearTimeout(timeoutId)
    }
  }, [isLoaded])

  // Menu handlers
  const handleToggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev)
  }, [])

  // Outside click handler
  useEffect(() => {
    if (!isMenuOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.mobile-menu')) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside, { passive: true })
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isMenuOpen])

  // Scroll prevention
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isMenuOpen])

  // Viewport fix for mobile
  useEffect(() => {
    if (!isMobile) return

    const setVH = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }

    setVH()
    window.addEventListener('resize', setVH, { passive: true })
    return () => window.removeEventListener('resize', setVH)
  }, [isMobile])

  // SEO optimization - delayed
  useEffect(() => {
    setTimeout(() => {
      document.documentElement.lang = language
      document.title = language === 'it' 
        ? 'Bottamedi - Frutta e Verdura Fresca | Mezzolombardo, Trentino'
        : 'Bottamedi - Frisches Obst und Gemüse | Mezzolombardo, Südtirol'

      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        const description = language === 'it'
          ? 'Bottamedi: 50 anni di tradizione familiare nella vendita di frutta e verdura fresca a Mezzolombardo. Servizio dettaglio e ingrosso HORECA.'
          : 'Bottamedi: 50 Jahre Familientradition im Verkauf von frischem Obst und Gemüse in Mezzolombardo. Einzelhandel und HORECA-Großhandel.'
        metaDescription.setAttribute('content', description)
      }

      let viewportMeta = document.querySelector('meta[name="viewport"]')
      if (!viewportMeta) {
        viewportMeta = document.createElement('meta')
        viewportMeta.setAttribute('name', 'viewport')
        document.head.appendChild(viewportMeta)
      }
      viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0')
    }, 500)
  }, [language])

  // Memoized structured data
  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Bottamedi Frutta e Verdura",
    "description": language === 'it' 
      ? "Vendita di frutta e verdura fresca, servizio dettaglio e ingrosso HORECA a Mezzolombardo"
      : "Verkauf von frischem Obst und Gemüse, Einzelhandel und HORECA-Großhandel in Mezzolombardo",
    "url": "https://www.bottamedi.eu",
    "telephone": "+39 0461 602534",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Via A. de Gasperi, 47",
      "addressLocality": "Mezzolombardo",
      "addressRegion": "TN",
      "postalCode": "38017",
      "addressCountry": "IT"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "46.2147",
      "longitude": "11.1094"
    },
    "openingHours": "Mo-Sa 07:00-19:30",
    "priceRange": "€",
    "servedCuisine": language === 'it' ? "Frutta e Verdura Fresca" : "Frisches Obst und Gemüse",
    "founder": {
      "@type": "Person",
      "name": "Lorenzo Bottamedi"
    },
    "foundingDate": "1974",
    "sameAs": [
      "https://www.facebook.com/profile.php?id=100063456281899",
      "https://instagram.com/banchetto.bottamedi"
    ]
  }), [language])

  return (
    <div className="App">
      {/* Critical CSS first */}
      <style jsx global>{`
        /* Critical performance optimizations */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        html, body {
          scroll-behavior: smooth;
        }
        
        /* Force mobile dock visibility - AGGRESSIVE APPROACH */
        @media (max-width: 768px) {
          header {
            display: none !important;
            visibility: hidden !important;
          }
          
          /* Target all possible mobile dock class variations */
          [class*="mobile" i],
          [class*="dock" i],
          [class*="Mobile" i],
          [class*="Dock" i],
          .mobile-dock,
          .MobileDock,
          div[class*="mobile"],
          div[class*="Mobile"] {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            z-index: 999 !important;
            pointer-events: auto !important;
          }
        }
        
        @media (min-width: 769px) {
          header {
            display: block !important;
            visibility: visible !important;
          }
          
          [class*="mobile" i],
          [class*="dock" i],
          [class*="Mobile" i],
          [class*="Dock" i],
          .mobile-dock,
          .MobileDock {
            display: none !important;
          }
        }
        
        /* Performance optimizations */
        img {
          content-visibility: auto;
          max-width: 100%;
          height: auto;
        }
        
        section {
          contain: layout style;
        }
        
        /* Mobile specific */
        .mobile-device header {
          display: none !important;
        }
        
        .mobile-device [class*="mobile" i],
        .mobile-device [class*="Mobile" i] {
          display: block !important;
          visibility: visible !important;
        }
        
        .desktop-device [class*="mobile" i],
        .desktop-device [class*="Mobile" i] {
          display: none !important;
        }
        
        /* Loading optimizations */
        .animate-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 0.4; }
        }
      `}</style>

      {/* Header - always rendered but hidden on mobile via CSS */}
      <Header 
        language={language} 
        onLanguageChange={handleLanguageChange}
        isMenuOpen={isMenuOpen}
        onToggleMenu={handleToggleMenu}
      />

      {/* Main Content */}
      <main role="main">
        {/* Hero - Critical, no lazy loading */}
        <HeroSection 
          language={language} 
          inView={sectionsInView.hero} 
        />

        {/* Other sections - Lazy loaded with better fallbacks */}
        <Suspense fallback={<SectionSkeleton />}>
          <AboutSection 
            language={language} 
            inView={sectionsInView.about} 
          />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <BanchettoSection 
            language={language} 
            inView={sectionsInView.dettaglio} 
          />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <ServicesSection 
            language={language} 
            inView={sectionsInView.services} 
          />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <ProductsSection 
            language={language} 
            inView={sectionsInView.products} 
          />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <WholesaleContact 
            language={language} 
            inView={sectionsInView.wholesale} 
          />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <ContactSection 
            language={language} 
            inView={sectionsInView.contact} 
          />
        </Suspense>
      </main>

      {/* Footer - Critical */}
      <Footer language={language} />
      
      {/* Non-critical components */}
      <Suspense fallback={null}>
        <LegalDocuments language={language} />
      </Suspense>

      {/* Mobile Dock - ALWAYS RENDERED, hidden via CSS */}
      <Suspense fallback={null}>
        <MobileDock 
          language={language} 
          hideInFooter={hideInFooter || isScrolling}
        />
      </Suspense>

      <Suspense fallback={null}>
        <CookieBanner language={language} />
      </Suspense>

      {/* Loading indicator */}
      <AnimatePresence>
        {isScrolling && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-blue-500 z-50"
            style={{
              background: 'linear-gradient(90deg, #10b981 0%, #3b82f6 100%)',
              height: '2px'
            }}
          />
        )}
      </AnimatePresence>

      {/* Structured Data - Non-blocking */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-2 left-2 bg-black/80 text-white text-xs p-2 rounded font-mono z-50 max-w-xs">
          <div>Mobile: {isMobile ? 'YES' : 'NO'}</div>
          <div>Width: {typeof window !== 'undefined' ? window.innerWidth : 'Unknown'}</div>
          <div>UA Mobile: {typeof navigator !== 'undefined' ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'YES' : 'NO' : 'Unknown'}</div>
          <div>Body Classes: {typeof document !== 'undefined' ? document.body.className : 'Unknown'}</div>
          <div>Current: {currentSection}</div>
        </div>
      )}
    </div>
  )
}

export default App
