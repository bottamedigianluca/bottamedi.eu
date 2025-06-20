import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react'
import { useInView } from 'react-intersection-observer'
import { EnterpriseErrorBoundary, AppErrorBoundary, SectionErrorBoundary } from './components/common/ErrorBoundary'

// 🔥 IMPORT CORRETTI CON CASE SENSITIVITY FISSO
import HeroSection from './components/sections/HeroSection'
import AboutSection from './components/sections/AboutSection'
import BanchettoSection from './components/sections/BanchettoSection'
import ServicesSection from './components/sections/ServicesSection'
import ProductsSection from './components/sections/ProductsSection'
import WholesaleContact from './components/sections/WholesaleContact'
import ContactSection from './components/sections/ContactSection'
import Footer from './components/layout/Footer'
import LegalDocuments from './components/legal/LegalDocuments'
import MobileDock from './components/layout/MobileDock'
import LanguageSelector from './components/ui/LanguageSelector'

// 🎯 TRACKING GLOBALE ENTERPRISE
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
    performanceTracked?: boolean;
  }
}

// 🎬 LOADING FALLBACK OTTIMIZZATO
const SectionLoadingFallback: React.FC<{ sectionName: string }> = ({ sectionName }) => (
  <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 mx-4 my-8 rounded-2xl">
    <div className="text-center">
      <div className="relative mb-4">
        <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
        </div>
      </div>
      <p className="text-green-700 font-medium">
        Caricamento {sectionName}...
      </p>
    </div>
  </div>
)

// 🎯 SEZIONE WRAPPER CON ERROR BOUNDARY
interface SectionWrapperProps {
  children: React.ReactNode
  sectionName: string
  className?: string
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ 
  children, 
  sectionName, 
  className = '' 
}) => (
  <SectionErrorBoundary
    sectionName={sectionName}
    onError={(error, errorInfo) => {
      console.error(`❌ Errore in sezione ${sectionName}:`, error, errorInfo)
      
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'section_error', {
          event_category: 'Errors',
          event_label: `${sectionName}_error`,
          custom_parameter_1: error.message,
          custom_parameter_2: sectionName,
          value: 1
        })
      }
    }}
  >
    <section className={`section-container ${className}`}>
      <Suspense fallback={<SectionLoadingFallback sectionName={sectionName} />}>
        {children}
      </Suspense>
    </section>
  </SectionErrorBoundary>
)

// 🎯 HOOK CENTRALIZZATO PER MOBILE DOCK VISIBILITY - LOGICA ORIGINALE COMPLETA
const useMobileDockVisibility = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [currentSection, setCurrentSection] = useState('hero')
  const [isMobile, setIsMobile] = useState(false)

  // Refs per tracking avanzato
  const lastScrollY = useRef(0)
  const scrollTimeout = useRef<NodeJS.Timeout>()
  const inactivityTimeout = useRef<NodeJS.Timeout>()
  const scrollDirection = useRef<'up' | 'down'>('down')
  const isScrolling = useRef(false)

  // 📱 Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)

      if (!mobile) {
        setIsVisible(false) // Hide on desktop
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile, { passive: true })
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 📍 Section detection
  useEffect(() => {
    if (!isMobile) return

    let rafId: number

    const detectCurrentSection = () => {
      rafId = requestAnimationFrame(() => {
        const sections = ['hero', 'about', 'dettaglio', 'services', 'products', 'wholesale', 'contact']
        const scrollPosition = window.scrollY + window.innerHeight / 2
        let foundSection = 'hero'

        for (const sectionId of sections) {
          const element = document.getElementById(sectionId)
          if (element) {
            const rect = element.getBoundingClientRect()
            const elementTop = window.scrollY + rect.top
            const elementBottom = elementTop + rect.height
            
            if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
              foundSection = sectionId
              break
            }
          }
        }

        if (foundSection !== currentSection) {
          setCurrentSection(foundSection)
        }
      })
    }

    const handleScroll = () => detectCurrentSection()

    detectCurrentSection()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [isMobile, currentSection])

  // 🧠 LOGICA INTELLIGENTE DI VISIBILITÀ ORIGINALE
  useEffect(() => {
    if (!isMobile) {
      setIsVisible(false)
      return
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollDelta = currentScrollY - lastScrollY.current
      
      // Aggiorna direzione solo per movimenti significativi
      if (Math.abs(scrollDelta) > 5) {
        scrollDirection.current = scrollDelta > 0 ? 'down' : 'up'
        lastScrollY.current = currentScrollY
        isScrolling.current = true
      }

      // Clear timeout precedenti
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
      if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current)

      // 🚫 ZONE DI ESCLUSIONE SEMPLIFICATE
      const excludedSections = ['hero', 'contact']
      const isInExcludedSection = excludedSections.includes(currentSection)
      
      // Controllo documenti legali
      const legalElement = document.getElementById('legal-documents')
      const isLegalOpen = legalElement && 
                        !legalElement.classList.contains('hidden') &&
                        legalElement.getBoundingClientRect().height > 50

      // Se siamo in una zona esclusa o legal è aperto, nascondi
      if (isInExcludedSection || isLegalOpen) {
        setIsVisible(false)
        return
      }

      // 🎯 LOGICA INTELLIGENTE PRINCIPALE
      scrollTimeout.current = setTimeout(() => {
        isScrolling.current = false
        
        // Mostra immediatamente se si scrolla verso l'alto
        if (scrollDirection.current === 'up') {
          setIsVisible(true)
          return
        }

        // Se si scrolla verso il basso, aspetta inattività
        if (scrollDirection.current === 'down') {
          setIsVisible(false)
          
          // Timer di inattività più corto
          inactivityTimeout.current = setTimeout(() => {
            // Ricontrolla le condizioni
            const currentExcluded = excludedSections.includes(currentSection)
            const currentLegalOpen = legalElement && 
                                   !legalElement.classList.contains('hidden') &&
                                   legalElement.getBoundingClientRect().height > 50

            if (!currentExcluded && !currentLegalOpen && !isScrolling.current) {
              setIsVisible(true)
            }
          }, 800) // Ridotto a 800ms per reattività migliore
        }
      }, 50) // Debounce ridotto
    }

    // Inizializza immediatamente se in sezione valida
    const excludedSections = ['hero', 'contact']
    if (!excludedSections.includes(currentSection)) {
      const legalElement = document.getElementById('legal-documents')
      const isLegalOpen = legalElement && 
                        !legalElement.classList.contains('hidden') &&
                        legalElement.getBoundingClientRect().height > 50
      
      if (!isLegalOpen) {
        // Timer iniziale per apparizione
        inactivityTimeout.current = setTimeout(() => {
          setIsVisible(true)
        }, 500)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
      if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current)
    }
  }, [isMobile, currentSection])

  return {
    isVisible: isMobile && isVisible,
    currentSection,
    isMobile
  }
}

// 🎯 HOOK PER HERO SECTION DETECTION (per Language Selector)
const useHeroVisibility = () => {
  const [isHeroVisible, setIsHeroVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const heroElement = document.getElementById('hero')
      if (heroElement) {
        const rect = heroElement.getBoundingClientRect()
        const isVisible = rect.bottom > 100 // Mostra se hero è ancora visibile almeno per 100px
        setIsHeroVisible(isVisible)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return isHeroVisible
}

// 📱 COMPONENTE PRINCIPALE
const App: React.FC = () => {
  const [language, setLanguage] = useState<'it' | 'de'>('it')
  const [isInitialized, setIsInitialized] = useState(false)

  // 🎯 HOOKS CENTRALIZZATI
  const mobileDock = useMobileDockVisibility()
  const isHeroVisible = useHeroVisibility()

  // 🎯 INTERSECTION OBSERVERS OTTIMIZZATI
  const observerOptions = useMemo(() => ({
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
  }), [])

  const [heroRef, heroInView] = useInView(observerOptions)
  const [aboutRef, aboutInView] = useInView(observerOptions)
  const [banchettoRef, banchettoInView] = useInView(observerOptions)
  const [servicesRef, servicesInView] = useInView(observerOptions)
  const [productsRef, productsInView] = useInView(observerOptions)
  const [wholesaleRef, wholesaleInView] = useInView(observerOptions)
  const [contactRef, contactInView] = useInView(observerOptions)

  // 🚀 TRACKING SETUP ENTERPRISE
  useEffect(() => {
    if (typeof window === 'undefined') return

    const initializeTracking = () => {
      try {
        // 🎯 TRACKING NAVIGATION
        if (!window.trackNavigazione) {
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
        }

        // 🎯 TRACKING STORIA E TRADIZIONE
        if (!window.trackStoriaTradizione) {
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
        }

        // 🎯 TRACKING QUALITÀ PRODOTTI
        if (!window.trackQualitaProdotti) {
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
        }

        // 🎯 TRACKING AZIONI CONTATTO
        if (!window.trackAzioneContatto) {
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
        }

        // 🎯 TRACKING LOCALIZZAZIONE
        if (!window.trackLocalizzazione) {
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
        }

        // 🎯 TRACKING RICHIESTE INFORMAZIONI
        if (!window.trackRichiestaInformazioni) {
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
        }

        // 🎯 TRACKING PERFORMANCE
        if (!window.trackPerformanceSito) {
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
        }

        // 🎯 TRACKING TEMPO IN SEZIONE
        if (!window.trackTempoSezione) {
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
        }

        // 🎯 UPDATE CURRENT SECTION
        if (!window.updateCurrentSection) {
          window.updateCurrentSection = (sectionName) => {
            console.log(`📍 Sezione corrente: ${sectionName}`)
            
            // Aggiorna theme color dinamicamente
            const themeColorMeta = document.getElementById('theme-color-meta')
            const sectionColors: Record<string, string> = {
              'hero': '#22c55e',
              'about': '#16a34a', 
              'dettaglio': '#15803d',
              'services': '#166534',
              'products': '#14532d',
              'wholesale': '#052e16',
              'contact': '#1f2937'
            }
            
            if (themeColorMeta && sectionColors[sectionName]) {
              themeColorMeta.setAttribute('content', sectionColors[sectionName])
            }

            // Update page title dinamicamente
            const titleMap: Record<string, string> = {
              'hero': 'Bottamedi - Frutta e Verdura di Qualità dal 1974',
              'about': 'La Nostra Storia - Bottamedi',
              'dettaglio': 'Il Nostro Banchetto - Bottamedi',
              'services': 'I Nostri Servizi - Bottamedi',
              'products': 'I Nostri Prodotti - Bottamedi',
              'wholesale': 'Ingrosso HORECA - Bottamedi',
              'contact': 'Contatti - Bottamedi'
            }

            if (titleMap[sectionName] && sectionName !== 'hero') {
              document.title = titleMap[sectionName]
            }
          }
        }

        setIsInitialized(true)

      } catch (error) {
        console.error('❌ Errore inizializzazione tracking:', error)
        setIsInitialized(true)
      }
    }

    // 🚀 PERFORMANCE TRACKING AVANZATO
    if ('performance' in window && !window.performanceTracked) {
      window.performanceTracked = true
      
      window.addEventListener('load', () => {
        setTimeout(() => {
          try {
            const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
            if (timing) {
              const loadTime = timing.loadEventEnd - timing.loadEventStart
              window.trackPerformanceSito?.('page_load_time', loadTime, 3000)
            }

            // Largest Contentful Paint
            if ('getLCP' in window) {
              // @ts-ignore
              window.getLCP((lcp) => {
                window.trackPerformanceSito?.('largest_contentful_paint', lcp.value, 2500)
              })
            }

            // First Input Delay
            if ('getFID' in window) {
              // @ts-ignore
              window.getFID((fid) => {
                window.trackPerformanceSito?.('first_input_delay', fid.value, 100)
              })
            }

          } catch (error) {
            console.warn('Performance tracking error:', error)
          }
        }, 100)
      })
    }

    initializeTracking()
  }, [])

  // 🎯 LANGUAGE CHANGE HANDLER
  const handleLanguageChange = useCallback((newLanguage: 'it' | 'de') => {
    setLanguage(newLanguage)
    
    try {
      localStorage.setItem('bottamedi_language', newLanguage)
    } catch (error) {
      console.warn('Non è possibile salvare la lingua:', error)
    }
    
    if (typeof window !== 'undefined') {
      window.trackNavigazione?.('language_selector', 'cambio_lingua', newLanguage)
    }
  }, [])

  // 🎯 CARICA LINGUA SALVATA
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem('bottamedi_language') as 'it' | 'de'
      if (savedLanguage && ['it', 'de'].includes(savedLanguage)) {
        setLanguage(savedLanguage)
      }
    } catch (error) {
      console.warn('Non è possibile caricare la lingua salvata:', error)
    }
  }, [])

  // 🎯 SEZIONI MEMOIZZATE CON ERROR HANDLING
  const sections = useMemo(() => [
    { 
      name: 'hero',
      Component: HeroSection, 
      ref: heroRef, 
      inView: heroInView, 
      props: { language } 
    },
    { 
      name: 'about',
      Component: AboutSection, 
      ref: aboutRef, 
      inView: aboutInView, 
      props: { language } 
    },
    { 
      name: 'banchetto',
      Component: BanchettoSection, 
      ref: banchettoRef, 
      inView: banchettoInView, 
      props: { language } 
    },
    { 
      name: 'services',
      Component: ServicesSection, 
      ref: servicesRef, 
      inView: servicesInView, 
      props: { language } 
    },
    { 
      name: 'products',
      Component: ProductsSection, 
      ref: productsRef, 
      inView: productsInView, 
      props: { language } 
    },
    { 
      name: 'wholesale',
      Component: WholesaleContact, 
      ref: wholesaleRef, 
      inView: wholesaleInView, 
      props: { language } 
    },
    { 
      name: 'contact',
      Component: ContactSection, 
      ref: contactRef, 
      inView: contactInView, 
      props: { language } 
    }
  ], [
    language, 
    heroRef, heroInView, 
    aboutRef, aboutInView, 
    banchettoRef, banchettoInView,
    servicesRef, servicesInView, 
    productsRef, productsInView, 
    wholesaleRef, wholesaleInView,
    contactRef, contactInView
  ])

  // 🚫 LOADING STATE INIZIALE
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h2 className="text-xl font-bold text-green-900 mb-2">Bottamedi</h2>
          <p className="text-green-700">Caricamento in corso...</p>
        </div>
      </div>
    )
  }

  return (
    <AppErrorBoundary
      onError={(error, errorInfo) => {
        console.error('💥 CRASH APPLICAZIONE:', error, errorInfo)
        
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'app_crash_critical', {
            event_category: 'Critical Errors',
            event_label: 'app_level_crash',
            custom_parameter_1: error.message,
            custom_parameter_2: 'application_level',
            value: 100
          })
        }
      }}
    >
      <div className="min-h-screen bg-white overflow-x-hidden safe-component">
        {/* 🌐 Language Selector - SOLO QUANDO HERO è VISIBILE */}
        {isHeroVisible && (
          <LanguageSelector 
            language={language} 
            onLanguageChange={handleLanguageChange}
          />
        )}
        
        {/* 📱 Main Sections */}
        <main className="relative">
          {sections.map(({ name, Component, ref, inView, props }, index) => (
            <SectionWrapper key={`section-${name}-${index}`} sectionName={name}>
              <div ref={ref}>
                <Component {...props} inView={inView} />
              </div>
            </SectionWrapper>
          ))}
        </main>

        {/* 🦶 Footer */}
        <SectionWrapper sectionName="footer">
          <Footer language={language} />
        </SectionWrapper>

        {/* ⚖️ Legal Documents */}
        <SectionWrapper sectionName="legal">
          <LegalDocuments language={language} />
        </SectionWrapper>

        {/* 📱 Mobile Dock - LOGICA CENTRALIZZATA */}
        {mobileDock.isVisible && (
          <SectionWrapper sectionName="mobile-dock">
            <MobileDock language={language} />
          </SectionWrapper>
        )}
      </div>
    </AppErrorBoundary>
  )
}

export default App
