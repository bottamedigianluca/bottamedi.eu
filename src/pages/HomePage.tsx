import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useScrollInfo, useScrollDirection } from '@/hooks/useScrollDirection'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileDock from '@/components/layout/MobileDock'

import CookieBanner from '@/components/legal/CookieBanner'
import LegalDocuments from '@/components/legal/LegalDocuments'

import SEO from '@/components/seo/SEO'
import { SITE } from '@/lib/siteConfig'
import { buildCanonical, buildPageTitle } from '@/lib/seo'
import {
  graph,
  organizationSchema,
  banchettoSchema,
  ingrossoSchema,
  websiteSchema,
  faqSchema,
  breadcrumbSchema,
} from '@/lib/jsonLd'

import { getLanguageFromStorage, getBrowserLanguage, isMobile } from '@/utils/helpers'

const HeroSection = lazy(() => import('@/components/sections/HeroSection'))
const AboutSection = lazy(() => import('@/components/sections/AboutSection'))
const BanchettoSection = lazy(() => import('@/components/sections/Banchettosection'))
const ServicesSection = lazy(() => import('@/components/sections/ServicesSection'))
const ProductsSection = lazy(() => import('@/components/sections/ProductsSection'))
const WholesaleContact = lazy(() => import('@/components/sections/Wholesalecontact'))
const ContactSection = lazy(() => import('@/components/sections/ContactSection'))

const SECTIONS = [
  { id: 'hero', Component: HeroSection },
  { id: 'about', Component: AboutSection },
  { id: 'dettaglio', Component: BanchettoSection },
  { id: 'services', Component: ServicesSection },
  { id: 'products', Component: ProductsSection },
  { id: 'wholesale', Component: WholesaleContact },
  { id: 'contact', Component: ContactSection },
] as const

const MOBILE_DOCK_IDLE_TIME = 500
const SCROLL_DETECTION_DELAY = 16
const HEADER_FADE_SPEED = 150

const SECTION_COLORS = {
  hero: '#22c55e',
  about: '#16a34a',
  dettaglio: '#15803d',
  services: '#166534',
  products: '#14532d',
  wholesale: '#052e16',
  contact: '#1f2937',
} as const

const OptimizedSectionLoader: React.FC<{ name: string }> = React.memo(({ name }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
    <div className="relative">
      <motion.div
        className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
      </motion.div>
    </div>
    <motion.p
      className="absolute bottom-4 text-green-700 font-medium text-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      aria-live="polite"
    >
      Caricamento {name}...
    </motion.p>
  </div>
))
OptimizedSectionLoader.displayName = 'OptimizedSectionLoader'

const useMobileDockVisibility = (sectionsInView: Record<string, boolean>) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isIdle, setIsIdle] = useState(false)
  const [lastScrollTime, setLastScrollTime] = useState(Date.now())

  const scrollDirection = useScrollDirection({ threshold: 3, throttleDelay: SCROLL_DETECTION_DELAY })
  const { scrollY, isScrolling } = useScrollInfo({ throttleDelay: SCROLL_DETECTION_DELAY })

  useEffect(() => {
    if (isScrolling) {
      setLastScrollTime(Date.now())
      setIsIdle(false)
    }
    const idleTimer = setTimeout(() => {
      const now = Date.now()
      if (now - lastScrollTime > MOBILE_DOCK_IDLE_TIME && !isScrolling) setIsIdle(true)
    }, MOBILE_DOCK_IDLE_TIME)
    return () => clearTimeout(idleTimer)
  }, [isScrolling, lastScrollTime])

  useEffect(() => {
    const isInHero = scrollY < 150
    const isInContact = Boolean(sectionsInView.contact)
    const isInFooter = (() => {
      if (typeof document === 'undefined') return false
      const footer = document.querySelector('footer')
      if (!footer) return false
      const footerRect = footer.getBoundingClientRect()
      const windowHeight = window.innerHeight
      return footerRect.top < windowHeight && footerRect.bottom > 0
    })()
    if (isInHero || isInContact || isInFooter) {
      setIsVisible(false)
      return
    }
    const shouldShow = scrollY > 150 && (scrollDirection === 'up' || isIdle || !isScrolling)
    setIsVisible(shouldShow)
  }, [scrollDirection, scrollY, isIdle, isScrolling, sectionsInView])

  return isVisible
}

const useMobileHeaderVisibility = (sectionsInView: Record<string, boolean>) => {
  const [isVisible, setIsVisible] = useState(true)
  const { scrollY } = useScrollInfo({ throttleDelay: SCROLL_DETECTION_DELAY })
  useEffect(() => {
    const isInHero = Boolean(sectionsInView.hero) || scrollY < 60
    setIsVisible(isInHero)
  }, [sectionsInView.hero, scrollY])
  return isVisible
}

const useStatusBarColor = (sectionsInView: Record<string, boolean>) => {
  const [currentColor, setCurrentColor] = useState<string>(SECTION_COLORS.hero)
  useEffect(() => {
    for (const section of SECTIONS) {
      if (sectionsInView[section.id]) {
        setCurrentColor(SECTION_COLORS[section.id as keyof typeof SECTION_COLORS])
        break
      }
    }
  }, [sectionsInView])
  return currentColor
}

const useSectionsInView = () => {
  const [sectionsInView, setSectionsInView] = useState<Record<string, boolean>>({})
  const updateSectionInView = useCallback((sectionId: string, inView: boolean) => {
    setSectionsInView(prev => ({ ...prev, [sectionId]: inView }))
  }, [])
  return { sectionsInView, updateSectionInView }
}

const OptimizedSection: React.FC<{
  section: (typeof SECTIONS)[number]
  language: 'it' | 'de'
  onInViewChange: (sectionId: string, inView: boolean) => void
  priority?: boolean
}> = React.memo(({ section, language, onInViewChange, priority = false }) => {
  const shouldReduceMotion = useReducedMotion()
  const { ref, inView } = useIntersectionObserver({
    threshold: 0.15,
    triggerOnce: false,
    rootMargin: priority ? '200px' : '100px',
  })
  useEffect(() => {
    onInViewChange(section.id, inView)
  }, [inView, section.id, onInViewChange])

  const sectionVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: shouldReduceMotion ? 0.05 : 0.25, ease: [0.25, 0.46, 0.45, 0.94] },
      },
    }),
    [shouldReduceMotion]
  )

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={sectionVariants}
      style={{ willChange: inView ? 'transform, opacity' : 'auto' }}
    >
      <Suspense fallback={<OptimizedSectionLoader name={section.id} />}>
        <section.Component language={language} inView={inView} />
      </Suspense>
    </motion.div>
  )
})
OptimizedSection.displayName = 'OptimizedSection'

const HOMEPAGE_FAQ = [
  {
    q: 'Quali sono gli orari del banchetto Bottamedi a Mezzolombardo?',
    a: 'Il banchetto Bottamedi in Via Cavalleggeri Udine a Mezzolombardo è aperto dal lunedì al sabato dalle 7:00 alle 19:30. Domenica chiuso.',
  },
  {
    q: 'Bottamedi fornisce frutta e verdura a ristoranti e hotel?',
    a: 'Sì, la divisione ingrosso HORECA in Via de Gasperi 47 a Mezzolombardo fornisce ristoranti, hotel, pizzerie, mense e attività del Trentino Alto Adige con consegne programmate 6 giorni su 7. Contatti: 0461 602534.',
  },
  {
    q: 'Da quanto tempo esiste Bottamedi?',
    a: "Bottamedi è un'azienda familiare fondata nel 1974 da Lorenzo Bottamedi. Oggi, dopo oltre 50 anni, continua la tradizione con tre generazioni al servizio della qualità ortofrutticola.",
  },
  {
    q: 'Dove posso parcheggiare per raggiungere il banchetto Bottamedi?',
    a: 'Il banchetto in Via Cavalleggeri Udine dispone di parcheggi comodi nelle vicinanze, nel centro di Mezzolombardo.',
  },
  {
    q: 'Bottamedi vende mele Melinda DOP e prodotti del Trentino?',
    a: "Sì, al banchetto Bottamedi trovi mele Melinda DOP della Val di Non, asparagi di Zambana, piccoli frutti trentini e oltre 150 varietà di prodotti stagionali km zero dal Trentino Alto Adige.",
  },
  {
    q: 'Quali zone servite con l\'ingrosso HORECA?',
    a: 'Consegniamo ortofrutta fresca a ristoranti, hotel, pizzerie e mense in tutto il Trentino Alto Adige: Trento, Bolzano, Rovereto, Val di Non, Val di Sole, Val di Cembra, Rotaliana e vallate limitrofe.',
  },
  {
    q: 'I prodotti Bottamedi sono biologici e locali?',
    a: "Selezioniamo ogni giorno il meglio dell'ortofrutta: prodotti locali a km zero quando disponibili, mele Melinda DOP, linea biologica e referenze stagionali dal Trentino e dalle migliori aree produttive italiane.",
  },
  {
    q: 'Come richiedere un preventivo per forniture ristorante?',
    a: 'Per forniture HORECA chiama il numero 0461 602534, scrivi a bottamedipierluigi@virgilio.it oppure usa il form dedicato nella sezione "Ingrosso". Ti ricontattiamo entro 24h con un preventivo su misura.',
  },
]

const HomePage: React.FC = () => {
  const [language, setLanguage] = useLocalStorage<'it' | 'de'>('bottamedi-language', 'it')
  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const [isAppReady, setIsAppReady] = useState(false)

  const { sectionsInView, updateSectionInView } = useSectionsInView()
  const mobileDockVisible = useMobileDockVisibility(sectionsInView)
  const mobileHeaderVisible = useMobileHeaderVisibility(sectionsInView)
  const statusBarColor = useStatusBarColor(sectionsInView)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const initializeApp = async () => {
      setIsMobileDevice(isMobile())
      if (!getLanguageFromStorage()) {
        const browserLang = getBrowserLanguage()
        setLanguage(browserLang)
      }
      setTimeout(() => setIsAppReady(true), 50)
    }
    initializeApp()
  }, [setLanguage])

  const handleLanguageChange = useCallback(
    (newLanguage: 'it' | 'de') => {
      setLanguage(newLanguage)
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'language_change', {
          event_category: 'user_preference',
          event_label: newLanguage,
          value: 1,
        })
      }
    },
    [setLanguage]
  )

  const seoTitle = useMemo(
    () =>
      language === 'it'
        ? 'Bottamedi Frutta e Verdura Mezzolombardo | Ingrosso HORECA e Dettaglio dal 1974'
        : 'Bottamedi Obst und Gemüse Mezzolombardo | HORECA Großhandel und Einzelhandel seit 1974',
    [language]
  )

  const seoDescription = useMemo(
    () =>
      language === 'it'
        ? "Bottamedi dal 1974 a Mezzolombardo: frutta e verdura fresca selezionata, oltre 150 referenze stagionali. Banchetto al dettaglio in Via Cavalleggeri Udine e ingrosso HORECA per ristoranti e hotel del Trentino Alto Adige. Qualità, km zero, passione familiare."
        : 'Bottamedi seit 1974 in Mezzolombardo: frisches Obst und Gemüse, über 150 saisonale Produkte. Einzelhandel Marktstand in Via Cavalleggeri Udine und HORECA Großhandel für Restaurants und Hotels in Südtirol. Qualität, km null, familiäre Leidenschaft.',
    [language]
  )

  const appVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          duration: shouldReduceMotion ? 0.05 : 0.2,
          ease: 'easeOut',
          staggerChildren: shouldReduceMotion ? 0 : 0.05,
        },
      },
    }),
    [shouldReduceMotion]
  )

  const canonical = buildCanonical(language === 'de' ? '/de' : '/')
  const alternates = {
    it: `${SITE.url}/`,
    de: `${SITE.url}/de`,
  }

  const jsonLd = graph(
    organizationSchema(),
    banchettoSchema(),
    ingrossoSchema(),
    websiteSchema(language),
    breadcrumbSchema([{ name: 'Home', url: '/' }]),
    faqSchema(HOMEPAGE_FAQ)
  )

  if (!isAppReady) {
    return (
      <>
        <SEO
          title={seoTitle}
          description={seoDescription}
          canonical={canonical}
          locale={language}
          alternates={alternates}
          ogType="business.business"
          keywords={[
            'Bottamedi',
            'frutta e verdura Mezzolombardo',
            'ingrosso ortofrutta Trentino',
            'HORECA ristoranti Trentino',
            'fruttivendolo Mezzolombardo',
            'frutta verdura dettaglio',
            'mele Melinda DOP',
            'km zero Trentino',
          ]}
          jsonLd={jsonLd}
        />
        <div className="fixed inset-0 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center z-50">
          <div className="text-center">
            <motion.img
              src="/logo-bottamedi.webp"
              alt="Bottamedi Loading"
              className="w-20 h-20 mx-auto mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="w-8 h-8 border-2 border-green-300 border-t-green-600 rounded-full animate-spin mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            />
          </div>
        </div>
      </>
    )
  }

  return (
    <motion.div
      className="min-h-screen bg-white overflow-x-hidden"
      initial="hidden"
      animate="visible"
      variants={appVariants}
    >
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonical={canonical}
        locale={language}
        alternates={alternates}
        ogType="business.business"
        keywords={[
          'Bottamedi',
          'frutta e verdura Mezzolombardo',
          'ingrosso ortofrutta Trentino',
          'HORECA ristoranti Trentino',
          'fruttivendolo Mezzolombardo',
          'frutta verdura dettaglio',
          'mele Melinda DOP',
          'km zero Trentino',
        ]}
        jsonLd={jsonLd}
      >
        <meta name="theme-color" content={statusBarColor} />
      </SEO>

      {!isMobileDevice ? (
        <Header
          language={language}
          onLanguageChange={handleLanguageChange}
          isMenuOpen={false}
          onToggleMenu={() => {}}
        />
      ) : (
        <AnimatePresence>
          {mobileHeaderVisible && (
            <motion.div
              initial={{ y: -80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -80, opacity: 0 }}
              transition={{
                type: 'tween',
                duration: shouldReduceMotion ? 0.05 : HEADER_FADE_SPEED / 1000,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="relative z-40"
              style={{ background: 'transparent', backdropFilter: 'none' }}
            >
              <Header
                language={language}
                onLanguageChange={handleLanguageChange}
                isMenuOpen={false}
                onToggleMenu={() => {}}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <main id="main" className="relative">
        {SECTIONS.map((section, index) => (
          <OptimizedSection
            key={section.id}
            section={section}
            language={language}
            onInViewChange={updateSectionInView}
            priority={index < 2}
          />
        ))}
      </main>

      <Footer language={language} />
      <LegalDocuments language={language} />

      {isMobileDevice && (
        <AnimatePresence>
          {mobileDockVisible && (
            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.9 }}
              transition={{
                type: 'spring',
                damping: 30,
                stiffness: 400,
                duration: shouldReduceMotion ? 0.05 : 0.15,
              }}
              className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none"
              style={{ willChange: 'transform, opacity', touchAction: 'none' }}
            >
              <MobileDock language={language} hideInFooter={false} />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <CookieBanner language={language} />
    </motion.div>
  )
}

export default React.memo(HomePage)
