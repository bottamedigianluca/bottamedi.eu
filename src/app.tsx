import React, { useState, useEffect, useCallback, Suspense } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

// 🚀 IMPORT DIRETTI (no lazy) per componenti critici
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

// 📱 LAZY LOADING solo per componenti NON critici
const MobileDock = React.lazy(() => import('./components/layout/MobileDock'))
const CookieBanner = React.lazy(() => import('./components/legal/CookieBanner'))
const LegalDocuments = React.lazy(() => import('./components/legal/LegalDocuments'))

// 🎯 SEZIONI con lazy loading ROBUSTO
const HeroSection = React.lazy(() => 
  import('./components/sections/HeroSection')
    .catch(() => ({
      default: () => (
        <section className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-green-600 mb-4">BOTTAMEDI</h1>
            <p className="text-xl text-green-700">Frutta e Verdura dal 1974</p>
          </div>
        </section>
      )
    }))
)

const AboutSection = React.lazy(() => 
  import('./components/sections/AboutSection')
    .catch(() => ({
      default: () => (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">La Nostra Storia</h2>
            <p className="text-lg text-gray-600">50 anni di tradizione familiare</p>
          </div>
        </section>
      )
    }))
)

const BanchettoSection = React.lazy(() => 
  import('./components/sections/Banchettosection')
    .catch(() => ({
      default: () => (
        <section className="py-20 bg-green-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Al Banchetto</h2>
            <p className="text-lg text-gray-600">Freschezza quotidiana</p>
          </div>
        </section>
      )
    }))
)

const ServicesSection = React.lazy(() => 
  import('./components/sections/ServicesSection')
    .catch(() => ({
      default: () => (
        <section className="py-20 bg-blue-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">I Nostri Servizi</h2>
            <p className="text-lg text-gray-600">Dettaglio e HORECA</p>
          </div>
        </section>
      )
    }))
)

const ProductsSection = React.lazy(() => 
  import('./components/sections/ProductsSection')
    .catch(() => ({
      default: () => (
        <section className="py-20 bg-emerald-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">I Nostri Prodotti</h2>
            <p className="text-lg text-gray-600">Oltre 150 varietà</p>
          </div>
        </section>
      )
    }))
)

const WholesaleContact = React.lazy(() => 
  import('./components/sections/Wholesalecontact')
    .catch(() => ({
      default: () => (
        <section className="py-20 bg-orange-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Richiedi Listino</h2>
            <p className="text-lg text-gray-600">Servizio HORECA</p>
          </div>
        </section>
      )
    }))
)

const ContactSection = React.lazy(() => 
  import('./components/sections/ContactSection')
    .catch(() => ({
      default: () => (
        <section className="py-20 bg-purple-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Contattaci</h2>
            <p className="text-lg text-gray-600">Siamo qui per te</p>
          </div>
        </section>
      )
    }))
)

// 🎯 FALLBACK ottimizzato senza schermata bianca
const SectionFallback = ({ title }: { title: string }) => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="w-8 h-8 border-2 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto" />
      <p className="text-sm text-green-600 font-medium">Caricamento {title}...</p>
    </div>
  </div>
)

// 🎯 MAIN APP COMPONENT
const App: React.FC = () => {
  // 📊 STATE semplificato
  const [language, setLanguage] = useState<'it' | 'de'>('it')
  const [currentSection, setCurrentSection] = useState('hero')
  const [showLegalDocs, setShowLegalDocs] = useState(false)
  const [isReady, setIsReady] = useState(false)

  // 🚀 Progress bar
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  // 🎯 INTERSECTION OBSERVERS semplificati
  const [heroRef, heroInView] = useInView({ threshold: 0.3 })
  const [aboutRef, aboutInView] = useInView({ threshold: 0.2 })
  const [dettaglioRef, dettaglioInView] = useInView({ threshold: 0.2 })
  const [servicesRef, servicesInView] = useInView({ threshold: 0.2 })
  const [productsRef, productsInView] = useInView({ threshold: 0.2 })
  const [wholesaleRef, wholesaleInView] = useInView({ threshold: 0.2 })
  const [contactRef, contactInView] = useInView({ threshold: 0.2 })
  const [footerRef, footerInView] = useInView({ threshold: 0.3 })

  // 🎯 Detect current section
  useEffect(() => {
    let section = 'hero'
    if (contactInView) section = 'contact'
    else if (wholesaleInView) section = 'wholesale'
    else if (productsInView) section = 'products'
    else if (servicesInView) section = 'services'
    else if (dettaglioInView) section = 'dettaglio'
    else if (aboutInView) section = 'about'
    else if (heroInView) section = 'hero'

    if (section !== currentSection) {
      setCurrentSection(section)
    }
  }, [heroInView, aboutInView, dettaglioInView, servicesInView, productsInView, wholesaleInView, contactInView])

  // 🎯 Initialize app
  useEffect(() => {
    // Load saved language
    const savedLanguage = localStorage.getItem('bottamedi-language') as 'it' | 'de'
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }

    // Mark app as ready after a small delay
    const timer = setTimeout(() => setIsReady(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // 🎯 Mobile dock visibility (semplificato)
  const shouldShowDock = currentSection !== 'hero' && !footerInView && isReady

  // 🎯 Language handler
  const updateLanguage = useCallback((lang: 'it' | 'de') => {
    setLanguage(lang)
    localStorage.setItem('bottamedi-language', lang)
    document.documentElement.lang = lang
  }, [])

  // 🎯 Legal docs handler
  useEffect(() => {
    const handleLegalEvent = (event: CustomEvent) => {
      const { docType, language: eventLang } = event.detail
      if (eventLang === language) {
        setShowLegalDocs(true)
        setTimeout(() => {
          const element = document.getElementById('legal-documents')
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }, 200)
      }
    }

    window.addEventListener('openLegalDocument', handleLegalEvent as EventListener)
    return () => window.removeEventListener('openLegalDocument', handleLegalEvent as EventListener)
  }, [language])

  const closeLegalDocs = useCallback(() => {
    setShowLegalDocs(false)
    setTimeout(() => {
      const footer = document.querySelector('footer')
      if (footer) {
        footer.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }, [])

  // 🎯 Don't render until ready
  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-green-600 font-medium">Caricamento...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* 📊 SEO HEAD */}
      <Helmet>
        <title>Bottamedi Frutta e Verdura | Eccellenza Trentina dal 1974</title>
        <meta name="description" content="Scopri 50 anni di tradizione familiare nell'ortofrutta. Freschezza quotidiana e qualità superiore per retail e HORECA a Mezzolombardo, Trentino." />
        <link rel="canonical" href="https://www.bottamedi.eu" />
      </Helmet>

      {/* 📊 Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600 z-50"
        style={{ scaleX, transformOrigin: '0%' }}
      />

      {/* 🎯 MAIN CONTAINER */}
      <div className="relative min-h-screen bg-white">
        
        {/* 🎯 HEADER (no lazy) */}
        <Header
          language={language}
          onLanguageChange={updateLanguage}
          isMenuOpen={false}
          onToggleMenu={() => {}}
        />

        {/* 🎯 MAIN CONTENT */}
        <main className="relative">
          
          {/* HERO SECTION */}
          <div ref={heroRef} id="hero">
            <Suspense fallback={<SectionFallback title="Hero" />}>
              <HeroSection language={language} inView={heroInView} />
            </Suspense>
          </div>

          {/* ABOUT SECTION */}
          <div ref={aboutRef} id="about">
            <Suspense fallback={<SectionFallback title="Storia" />}>
              <AboutSection language={language} inView={aboutInView} />
            </Suspense>
          </div>

          {/* BANCHETTO SECTION */}
          <div ref={dettaglioRef} id="dettaglio">
            <Suspense fallback={<SectionFallback title="Banchetto" />}>
              <BanchettoSection language={language} inView={dettaglioInView} />
            </Suspense>
          </div>

          {/* SERVICES SECTION */}
          <div ref={servicesRef} id="services">
            <Suspense fallback={<SectionFallback title="Servizi" />}>
              <ServicesSection language={language} inView={servicesInView} />
            </Suspense>
          </div>

          {/* PRODUCTS SECTION */}
          <div ref={productsRef} id="products">
            <Suspense fallback={<SectionFallback title="Prodotti" />}>
              <ProductsSection language={language} inView={productsInView} />
            </Suspense>
          </div>

          {/* WHOLESALE SECTION */}
          <div ref={wholesaleRef} id="wholesale">
            <Suspense fallback={<SectionFallback title="Listino" />}>
              <WholesaleContact language={language} inView={wholesaleInView} />
            </Suspense>
          </div>

          {/* CONTACT SECTION */}
          <div ref={contactRef} id="contact">
            <Suspense fallback={<SectionFallback title="Contatti" />}>
              <ContactSection language={language} inView={contactInView} />
            </Suspense>
          </div>

        </main>

        {/* 🎯 FOOTER (no lazy) */}
        <div ref={footerRef}>
          <Footer language={language} />
        </div>

        {/* 🎯 LEGAL DOCUMENTS */}
        <AnimatePresence>
          {showLegalDocs && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
              id="legal-documents"
            >
              <Suspense fallback={<SectionFallback title="Documenti Legali" />}>
                <LegalDocuments language={language} />
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

      </div>

      {/* 🎯 MOBILE DOCK */}
      <AnimatePresence>
        {shouldShowDock && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 lg:hidden pointer-events-none"
          >
            <div className="pointer-events-auto">
              <Suspense fallback={null}>
                <MobileDock language={language} hideInFooter={false} />
              </Suspense>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🍪 COOKIE BANNER */}
      <Suspense fallback={null}>
        <CookieBanner language={language} />
      </Suspense>

    </>
  )
}

export default App
