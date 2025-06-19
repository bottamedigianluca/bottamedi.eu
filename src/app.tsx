import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useInView } from 'react-intersection-observer'
import HeroSection from './components/sections/HeroSection'
import AboutSection from './components/sections/AboutSection'
// 🔥 FIX CRITICO: Import corretto con nome file giusto
import BanchettoSection from './components/sections/BanchettoSection'
import ServicesSection from './components/sections/ServicesSection'
import ProductsSection from './components/sections/ProductsSection'
// 🔥 FIX CRITICO: Import corretto con nome file giusto
import WholesaleContact from './components/sections/WholesaleContact'
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

const App: React.FC = () => {
  const [language, setLanguage] = useState<'it' | 'de'>('it')

  // Section observers per tracking - SEMPLIFICATI E OTTIMIZZATI
  const [heroRef, heroInView] = useInView({ threshold: 0.3, rootMargin: '0px 0px -50px 0px' })
  const [aboutRef, aboutInView] = useInView({ threshold: 0.3, rootMargin: '0px 0px -50px 0px' })
  const [banchettoRef, banchettoInView] = useInView({ threshold: 0.3, rootMargin: '0px 0px -50px 0px' })
  const [servicesRef, servicesInView] = useInView({ threshold: 0.3, rootMargin: '0px 0px -50px 0px' })
  const [productsRef, productsInView] = useInView({ threshold: 0.3, rootMargin: '0px 0px -50px 0px' })
  const [wholesaleRef, wholesaleInView] = useInView({ threshold: 0.3, rootMargin: '0px 0px -50px 0px' })
  const [contactRef, contactInView] = useInView({ threshold: 0.3, rootMargin: '0px 0px -50px 0px' })

  // 🎯 TRACKING SETUP OTTIMIZZATO
  useEffect(() => {
    // Initialize tracking functions ONLY if not already defined
    if (typeof window !== 'undefined') {
      // Evita ridefinizione se già esistenti
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

      if (!window.updateCurrentSection) {
        window.updateCurrentSection = (sectionName) => {
          console.log(`📍 Sezione corrente: ${sectionName}`)
          
          // 🎯 AGGIORNA THEME COLOR DINAMICAMENTE
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
        }
      }

      // 🚀 Performance tracking avanzato
      if ('performance' in window && !window.performanceTracked) {
        window.performanceTracked = true // Evita duplicati
        
        window.addEventListener('load', () => {
          setTimeout(() => {
            const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
            if (timing) {
              const loadTime = timing.loadEventEnd - timing.loadEventStart
              window.trackPerformanceSito?.('page_load_time', loadTime, 3000)
            }
          }, 100)
        })
      }
    }
  }, [])

  const handleLanguageChange = useCallback((newLanguage: 'it' | 'de') => {
    setLanguage(newLanguage)
    
    // Track language change
    if (typeof window !== 'undefined') {
      window.trackNavigazione?.('language_selector', 'cambio_lingua', newLanguage)
    }
  }, [])

  // 🚀 Memoized sections for performance - OTTIMIZZATO
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
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* 🌐 Language Selector - SEMPRE VISIBILE */}
      <LanguageSelector 
        language={language} 
        onLanguageChange={handleLanguageChange}
      />
      
      {/* 📱 Main Sections */}
      <main className="relative">
        {sections.map(({ Component, ref, inView, props }, index) => (
          <section key={index} ref={ref} className="section-container">
            <Component {...props} inView={inView} />
          </section>
        ))}
      </main>

      {/* 🦶 Footer */}
      <Footer language={language} />

      {/* ⚖️ Legal Documents */}
      <LegalDocuments language={language} />

      {/* 📱 Mobile Dock - RIPRISTINATO E FUNZIONANTE */}
      <MobileDock language={language} />
    </div>
  )
}

// 🎯 EVITA CRASH CON ERROR BOUNDARY
class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App crashed:', error, errorInfo)
    
    // Track error
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'app_crash', {
        event_category: 'Error',
        event_label: error.message,
        value: 1
      })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Errore Temporaneo
            </h2>
            <p className="text-gray-600 mb-6">
              Si è verificato un problema. La pagina verrà ricaricata automaticamente.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Ricarica Pagina
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// 🎯 ESPORTA CON ERROR BOUNDARY
const AppWithErrorBoundary: React.FC = () => (
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>
)

export default AppWithErrorBoundary
