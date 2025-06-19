import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useInView } from 'react-intersection-observer'
import HeroSection from './components/sections/HeroSection'
import AboutSection from './components/sections/AboutSection'
import BanchettoSection from './components/sections/Banchettosection'
import ServicesSection from './components/sections/ServicesSection'
import ProductsSection from './components/sections/ProductsSection'
import WholesaleContact from './components/sections/Wholesalecontact'
import ContactSection from './components/sections/ContactSection'
import Footer from './components/layout/Footer'
import LegalDocuments from './components/legal/LegalDocuments'
import MobileDock from './components/layout/MobileDock'
import LanguageSelector from './components/ui/LanguageSelector'

// Declare global tracking functions for TypeScript
declare global {
  interface Window {
    trackNavigazione: (sezione: string, azione: string, dettaglio: string) => void;
    trackStoriaTradizione: (elemento: string, interesse: string) => void;
    trackQualitaProdotti: (aspetto: string, valutazione: string) => void;
    trackAzioneContatto: (tipoContatto: string, fonte: string, destinazione: string) => void;
    trackLocalizzazione: (azione: string, luogo: string, risultato: string) => void;
    trackRichiestaInformazioni: (tipo: string, argomento: string, modalita: string) => void;
    trackPerformanceSito: (metrica: string, valore: number, soglia: number) => void;
    trackTempoSezione: (sezione: string, secondi: number) => void;
    updateCurrentSection: (sectionName: string) => void;
    gtag: (...args: any[]) => void;
  }
}

// 🎯 INTELLIGENT MOBILE DOCK VISIBILITY HOOK
const useMobileDockVisibility = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down')
  const [isScrolling, setIsScrolling] = useState(false)
  const [currentSection, setCurrentSection] = useState('hero')
  
  // Section observers
  const [contactRef, contactInView] = useInView({
    threshold: 0.2,
    rootMargin: '-50px 0px 0px 0px'
  })

  const [heroRef, heroInView] = useInView({
    threshold: 0.7
  })

  // Scroll behavior logic
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout
    let inactivityTimeout: NodeJS.Timeout

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollDelta = currentScrollY - lastScrollY
      
      // Determina direzione scroll
      if (Math.abs(scrollDelta) > 5) { // Soglia minima per evitare micro-scroll
        const newDirection = scrollDelta > 0 ? 'down' : 'up'
        setScrollDirection(newDirection)
        setLastScrollY(currentScrollY)
      }

      // Indica che si sta scrollando
      setIsScrolling(true)
      
      // Clear del timeout di inattività
      if (inactivityTimeout) {
        clearTimeout(inactivityTimeout)
      }

      // Reset del timeout di scroll
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }

      // Dopo 150ms senza scroll, considera lo scroll terminato
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false)
        
        // Dopo 800ms di inattività, mostra la dock (se non in hero/contact)
        inactivityTimeout = setTimeout(() => {
          if (!heroInView && !contactInView) {
            setIsVisible(true)
          }
        }, 800)
      }, 150)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeout) clearTimeout(scrollTimeout)
      if (inactivityTimeout) clearTimeout(inactivityTimeout)
    }
  }, [lastScrollY, heroInView, contactInView])

  // Logica di visibilità basata su sezione e comportamento scroll
  useEffect(() => {
    if (heroInView) {
      setCurrentSection('hero')
      setIsVisible(false) // Sempre nascosta nella hero
    } else if (contactInView) {
      setCurrentSection('contact')
      setIsVisible(false) // Sempre nascosta nel contact/footer
    } else {
      setCurrentSection('middle')
      
      // Nelle sezioni intermedie, logica intelligente:
      if (isScrolling) {
        // Durante lo scroll: mostra solo se si scrolla verso l'alto
        setIsVisible(scrollDirection === 'up')
      }
      // Quando non si scrolla: la dock apparirà dopo 800ms (gestito sopra)
    }
  }, [heroInView, contactInView, scrollDirection, isScrolling])

  return { 
    isVisible, 
    contactRef, 
    heroRef, 
    currentSection,
    scrollDirection,
    isScrolling
  }
}

const App: React.FC = () => {
  const [language, setLanguage] = useState<'it' | 'de'>('it')
  const { isVisible: isDockVisible } = useMobileDockVisibility()

  // Section observers per tracking - SEMPLIFICATI
  const [heroRef, heroInView] = useInView({ threshold: 0.3 })
  const [aboutRef, aboutInView] = useInView({ threshold: 0.3 })
  const [banchettoRef, banchettoInView] = useInView({ threshold: 0.3 })
  const [servicesRef, servicesInView] = useInView({ threshold: 0.3 })
  const [productsRef, productsInView] = useInView({ threshold: 0.3 })
  const [wholesaleRef, wholesaleInView] = useInView({ threshold: 0.3 })
  const [contactRef, contactInView] = useInView({ threshold: 0.3 })

  // 🎯 TRACKING SETUP
  useEffect(() => {
    // Initialize tracking functions
    window.trackNavigazione = (sezione, azione, dettaglio) => {
      console.log(`📍 Navigazione: ${sezione} -> ${azione} (${dettaglio})`)
      if (window.gtag) {
        window.gtag('event', 'navigazione', {
          event_category: 'Navigation',
          event_label: sezione,
          custom_parameter_1: azione,
          custom_parameter_2: dettaglio,
          value: 1
        })
      }
    }

    window.trackStoriaTradizione = (elemento, interesse) => {
      console.log(`📖 Storia/Tradizione: ${elemento} (${interesse})`)
      if (window.gtag) {
        window.gtag('event', 'storia_tradizione', {
          event_category: 'Brand Interest',
          event_label: elemento,
          custom_parameter_1: interesse,
          value: 1
        })
      }
    }

    window.trackQualitaProdotti = (aspetto, valutazione) => {
      console.log(`⭐ Qualità Prodotti: ${aspetto} (${valutazione})`)
      if (window.gtag) {
        window.gtag('event', 'qualita_prodotti', {
          event_category: 'Product Quality',
          event_label: aspetto,
          custom_parameter_1: valutazione,
          value: 1
        })
      }
    }

    window.trackAzioneContatto = (tipoContatto, fonte, destinazione) => {
      console.log(`📞 Azione Contatto: ${tipoContatto} da ${fonte} verso ${destinazione}`)
      if (window.gtag) {
        window.gtag('event', 'azione_contatto', {
          event_category: 'Contact Actions',
          event_label: tipoContatto,
          custom_parameter_1: fonte,
          custom_parameter_2: destinazione,
          value: 1
        })
      }
    }

    window.trackLocalizzazione = (azione, luogo, risultato) => {
      console.log(`🗺️ Localizzazione: ${azione} a ${luogo} (${risultato})`)
      if (window.gtag) {
        window.gtag('event', 'localizzazione', {
          event_category: 'Location Interest',
          event_label: azione,
          custom_parameter_1: luogo,
          custom_parameter_2: risultato,
          value: 1
        })
      }
    }

    window.trackRichiestaInformazioni = (tipo, argomento, modalita) => {
      console.log(`ℹ️ Richiesta Info: ${tipo} su ${argomento} via ${modalita}`)
      if (window.gtag) {
        window.gtag('event', 'richiesta_informazioni', {
          event_category: 'Information Requests',
          event_label: tipo,
          custom_parameter_1: argomento,
          custom_parameter_2: modalita,
          value: 1
        })
      }
    }

    window.trackPerformanceSito = (metrica, valore, soglia) => {
      console.log(`⚡ Performance: ${metrica} = ${valore}ms (soglia: ${soglia}ms)`)
      if (window.gtag) {
        window.gtag('event', 'performance_sito', {
          event_category: 'Site Performance',
          event_label: metrica,
          custom_parameter_1: valore.toString(),
          custom_parameter_2: valore > soglia ? 'slow' : 'fast',
          value: valore
        })
      }
    }

    window.trackTempoSezione = (sezione, secondi) => {
      console.log(`⏱️ Tempo in sezione ${sezione}: ${secondi}s`)
      if (window.gtag) {
        window.gtag('event', 'tempo_sezione', {
          event_category: 'Section Engagement',
          event_label: sezione,
          custom_parameter_1: secondi.toString(),
          custom_parameter_2: secondi > 10 ? 'engaged' : 'quick',
          value: secondi
        })
      }
    }

    window.updateCurrentSection = (sectionName) => {
      console.log(`📍 Sezione corrente: ${sectionName}`)
    }

    // Performance tracking
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
          if (timing) {
            const loadTime = timing.loadEventEnd - timing.loadEventStart
            window.trackPerformanceSito?.('page_load_time', loadTime, 3000)
          }
        }, 0)
      })
    }
  }, [])

  const handleLanguageChange = useCallback((newLanguage: 'it' | 'de') => {
    setLanguage(newLanguage)
    
    // Track language change
    if (typeof window !== 'undefined') {
      window.trackNavigazione?.('language_selector', 'cambio_lingua', newLanguage)
    }
  }, [])

  // Memoized sections for performance
  const sections = useMemo(() => [
    { Component: HeroSection, ref: heroRef, inView: heroInView, props: { language } },
    { Component: AboutSection, ref: aboutRef, inView: aboutInView, props: { language } },
    { Component: BanchettoSection, ref: banchettoRef, inView: banchettoInView, props: { language } },
    { Component: ServicesSection, ref: servicesRef, inView: servicesInView, props: { language } },
    { Component: ProductsSection, ref: productsRef, inView: productsInView, props: { language } },
    { Component: WholesaleContact, ref: wholesaleRef, inView: wholesaleInView, props: { language } },
    { Component: ContactSection, ref: contactRef, inView: contactInView, props: { language } }
  ], [
    language, heroRef, heroInView, aboutRef, aboutInView, banchettoRef, banchettoInView,
    servicesRef, servicesInView, productsRef, productsInView, wholesaleRef, wholesaleInView,
    contactRef, contactInView
  ])

  return (
    <div className="min-h-screen bg-white">
      {/* Language Selector */}
      <LanguageSelector 
        language={language} 
        onLanguageChange={handleLanguageChange}
      />
      
      {/* Main Sections */}
      <main>
        {sections.map(({ Component, ref, inView, props }, index) => (
          <div key={index} ref={ref}>
            <Component {...props} inView={inView} />
          </div>
        ))}
      </main>

      {/* Footer */}
      <Footer language={language} />

      {/* Legal Documents */}
      <LegalDocuments language={language} />

      {/* Mobile Dock - FIXED VISIBILITY LOGIC */}
      <MobileDock 
        language={language} 
        isVisible={isDockVisible} 
      />
    </div>
  )
}

export default App
