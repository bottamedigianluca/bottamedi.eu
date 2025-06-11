import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Layout Components
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import MobileDock from './components/layout/MobileDock'

// Section Components
import HeroSection from './components/sections/HeroSection'
import AboutSection from './components/sections/AboutSection'
import BanchettoSection from './components/sections/Banchettosection'
import ServicesSection from './components/sections/ServicesSection'
import ProductsSection from './components/sections/ProductsSection'
import WholesaleContact from './components/sections/Wholesalecontact'
import ContactSection from './components/sections/ContactSection'

// Legal Components
import LegalDocuments from './components/legal/LegalDocuments'
import CookieBanner from './components/legal/CookieBanner'

// Types
type Language = 'it' | 'de'

interface SectionVisibility {
  [key: string]: boolean
}

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

  // Mobile detection - improved
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 768
      setIsMobile(isMobileDevice)
      
      // Force update of CSS classes for mobile detection
      if (isMobileDevice) {
        document.body.classList.add('mobile-device')
        document.body.classList.remove('desktop-device')
      } else {
        document.body.classList.add('desktop-device')
        document.body.classList.remove('mobile-device')
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    window.addEventListener('orientationchange', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('orientationchange', checkMobile)
    }
  }, [])

  // Language detection from browser/localStorage
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
    
    // Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'language_change', {
        event_category: 'user_interaction',
        event_label: newLanguage,
        value: 1
      })
    }
  }, [])

  // Section detection with Intersection Observer - OPTIMIZED FOR MOBILE
  useEffect(() => {
    const observerOptions = {
      // More sensitive threshold for mobile
      threshold: isMobile ? 0.1 : 0.3,
      // Adjusted root margin for mobile browsers
      rootMargin: isMobile ? '-50px 0px -50px 0px' : '-80px 0px -80px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      const updates: SectionVisibility = {}
      
      entries.forEach((entry) => {
        const sectionId = entry.target.id
        updates[sectionId] = entry.isIntersecting
        
        // Update current section for active navigation
        if (entry.isIntersecting) {
          setCurrentSection(sectionId)
        }
      })
      
      setSectionsInView(prev => ({ ...prev, ...updates }))
    }, observerOptions)

    // Observe all sections with retry mechanism
    const sections = ['hero', 'about', 'dettaglio', 'services', 'products', 'wholesale', 'contact']
    
    // Use setTimeout to ensure DOM is ready
    const observeTimeout = setTimeout(() => {
      sections.forEach(id => {
        const element = document.getElementById(id)
        if (element) {
          observer.observe(element)
        } else {
          console.warn(`Section with id "${id}" not found`)
        }
      })
    }, 100)

    return () => {
      clearTimeout(observeTimeout)
      observer.disconnect()
    }
  }, [isMobile]) // Re-run when mobile state changes

  // Footer detection for mobile dock
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleFooterDetection = () => {
      clearTimeout(timeoutId)
      setIsScrolling(true)

      timeoutId = setTimeout(() => {
        setIsScrolling(false)
        
        const footer = document.querySelector('footer')
        const legalDocs = document.getElementById('legal-documents')
        
        if (footer && legalDocs) {
          const footerRect = footer.getBoundingClientRect()
          const legalRect = legalDocs.getBoundingClientRect()
          const windowHeight = window.innerHeight
          
          // Hide dock when footer or legal docs are visible
          const footerVisible = footerRect.top < windowHeight
          const legalVisible = legalRect.top < windowHeight
          
          setHideInFooter(footerVisible || legalVisible)
        }
      }, 150)
    }

    window.addEventListener('scroll', handleFooterDetection, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleFooterDetection)
      clearTimeout(timeoutId)
    }
  }, [])

  // Menu toggle handler
  const handleToggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev)
  }, [])

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && !(event.target as Element).closest('.mobile-menu')) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isMenuOpen])

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  // Performance optimization: Debounced scroll handler
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Trigger any scroll-related updates here if needed
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Mobile viewport fix - simplified to avoid hero issues
  useEffect(() => {
    const setVH = () => {
      // Only set if really needed and don't override existing height styles
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }

    // Only apply on mobile and don't force it
    if (window.innerWidth <= 768) {
      setVH()
      window.addEventListener('resize', setVH)
      window.addEventListener('orientationchange', setVH)
    }

    return () => {
      window.removeEventListener('resize', setVH)
      window.removeEventListener('orientationchange', setVH)
    }
  }, [])

  // SEO and Analytics
  useEffect(() => {
    // Set page language for SEO
    document.documentElement.lang = language
    
    // Update page title based on language
    const titles = {
      it: 'Bottamedi - Frutta e Verdura Fresca | Mezzolombardo, Trentino',
      de: 'Bottamedi - Frisches Obst und Gemüse | Mezzolombardo, Südtirol'
    }
    document.title = titles[language]

    // Update meta description
    const descriptions = {
      it: 'Bottamedi: 50 anni di tradizione familiare nella vendita di frutta e verdura fresca a Mezzolombardo. Servizio dettaglio e ingrosso HORECA.',
      de: 'Bottamedi: 50 Jahre Familientradition im Verkauf von frischem Obst und Gemüse in Mezzolombardo. Einzelhandel und HORECA-Großhandel.'
    }
    
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', descriptions[language])
    }

    // Ensure viewport meta tag is correct for mobile - minimal approach
    let viewportMeta = document.querySelector('meta[name="viewport"]')
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta')
      viewportMeta.setAttribute('name', 'viewport')
      document.head.appendChild(viewportMeta)
    }
    // Use standard viewport settings without forcing scale
    viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0')

    // Analytics page view
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: titles[language],
        page_language: language
      })
    }
  }, [language])

  return (
    <div className="App">
      {/* Header */}
      <Header 
        language={language} 
        onLanguageChange={handleLanguageChange}
        isMenuOpen={isMenuOpen}
        onToggleMenu={handleToggleMenu}
      />

      {/* Main Content with improved mobile styling - without z-index conflicts */}
      <main role="main">
        {/* Hero Section */}
        <HeroSection 
          language={language} 
          inView={sectionsInView.hero} 
        />

        {/* About Section */}
        <AboutSection 
          language={language} 
          inView={sectionsInView.about} 
        />

        {/* Banchetto Section - Use normal inView logic */}
        <BanchettoSection 
          language={language} 
          inView={sectionsInView.dettaglio} 
        />

        {/* Services Section */}
        <ServicesSection 
          language={language} 
          inView={sectionsInView.services} 
        />

        {/* Products Section */}
        <ProductsSection 
          language={language} 
          inView={sectionsInView.products} 
        />

        {/* Wholesale Contact Section */}
        <WholesaleContact 
          language={language} 
          inView={sectionsInView.wholesale} 
        />

        {/* Contact Section */}
        <ContactSection 
          language={language} 
          inView={sectionsInView.contact} 
        />
      </main>

      {/* Footer */}
      <Footer language={language} />
      
      {/* Legal Documents Section */}
      <LegalDocuments language={language} />

      {/* Mobile Dock */}
      <MobileDock 
        language={language} 
        hideInFooter={hideInFooter || isScrolling}
      />

      {/* Cookie Banner */}
      <CookieBanner language={language} />

      {/* Loading States for Better UX */}
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

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
          })
        }}
      />

      {/* Mobile debugging info - enhanced */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-2 left-2 bg-black/80 text-white text-xs p-2 rounded font-mono z-50">
          <div>Section: {currentSection}</div>
          <div>Language: {language}</div>
          <div>Mobile: {isMobile ? 'Yes' : 'No'}</div>
          <div>Viewport: {typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'Unknown'}</div>
          <div>Body Classes: {typeof document !== 'undefined' ? document.body.className : 'Unknown'}</div>
          <div>Scrolling: {isScrolling ? 'Yes' : 'No'}</div>
        </div>
      )}

      {/* Improved mobile CSS fix with proper responsive behavior */}
      <style jsx global>{`
        /* Essential mobile fixes */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Force proper header/mobile dock visibility */
        @media (max-width: 768px) {
          /* Hide desktop header on mobile */
          header {
            display: none !important;
          }
          
          /* Ensure mobile dock is visible */
          .mobile-dock,
          [class*="mobile-dock"],
          [class*="MobileDock"] {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            z-index: 50 !important;
          }
        }
        
        @media (min-width: 769px) {
          /* Show desktop header */
          header {
            display: block !important;
            position: relative !important;
            z-index: 50 !important;
          }
          
          /* Hide mobile dock on desktop */
          .mobile-dock,
          [class*="mobile-dock"],
          [class*="MobileDock"] {
            display: none !important;
          }
        }
        
        /* Ensure sections don't interfere */
        section {
          position: relative;
          z-index: 1;
        }
        
        /* Body classes for additional control */
        .mobile-device header {
          display: none !important;
        }
        
        .desktop-device .mobile-dock,
        .desktop-device [class*="mobile-dock"],
        .desktop-device [class*="MobileDock"] {
          display: none !important;
        }
      `}</style>
    </div>
  )
}

export default App
