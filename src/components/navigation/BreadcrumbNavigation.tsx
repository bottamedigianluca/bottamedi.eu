import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

interface BreadcrumbItem {
  label: string
  href: string
  active?: boolean
  icon?: string
}

interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[]
  language: 'it' | 'de'
  currentSection: string
  className?: string
}

const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({
  items: customItems,
  language,
  currentSection,
  className = ''
}) => {
  const translations = {
    it: {
      home: 'Home',
      about: 'Chi Siamo',
      dettaglio: 'Il Banchetto',
      services: 'Servizi',
      products: 'Prodotti',
      wholesale: 'Ingrosso HORECA',
      contact: 'Contatti',
      breadcrumbAriaLabel: 'Percorso di navigazione'
    },
    de: {
      home: 'Startseite',
      about: 'Über Uns',
      dettaglio: 'Marktstand',
      services: 'Dienstleistungen',
      products: 'Produkte',
      wholesale: 'Großhandel HORECA',
      contact: 'Kontakt',
      breadcrumbAriaLabel: 'Navigationspfad'
    }
  }

  const t = translations[language]

  // Generate breadcrumb items based on current section
  const breadcrumbItems = useMemo(() => {
    if (customItems && customItems.length > 0) {
      return customItems
    }

    const baseItems: BreadcrumbItem[] = [
      {
        label: t.home,
        href: '#hero',
        icon: '🏠'
      }
    ]

    const sectionMap: Record<string, BreadcrumbItem> = {
      hero: {
        label: t.home,
        href: '#hero',
        icon: '🏠',
        active: true
      },
      about: {
        label: t.about,
        href: '#about',
        icon: '👨‍👩‍👧‍👦'
      },
      dettaglio: {
        label: t.dettaglio,
        href: '#dettaglio',
        icon: '🛒'
      },
      services: {
        label: t.services,
        href: '#services',
        icon: '⚙️'
      },
      products: {
        label: t.products,
        href: '#products',
        icon: '🍎'
      },
      wholesale: {
        label: t.wholesale,
        href: '#wholesale',
        icon: '🏢'
      },
      contact: {
        label: t.contact,
        href: '#contact',
        icon: '📞'
      }
    }

    if (currentSection === 'hero') {
      return [{ ...sectionMap.hero }]
    }

    const currentItem = sectionMap[currentSection]
    if (currentItem) {
      return [
        baseItems[0],
        { ...currentItem, active: true }
      ]
    }

    return baseItems
  }, [customItems, currentSection, t])

  const handleNavigation = (href: string, label: string) => {
    // Track breadcrumb navigation
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'breadcrumb_navigation', {
        event_category: 'navigation',
        event_label: label,
        custom_parameter_section: href.replace('#', ''),
        value: 1
      })
    }

    // Smooth scroll to section
    const element = document.querySelector(href)
    if (element) {
      const offset = 80 // Header height
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - offset
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
    }

    // Haptic feedback
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([15])
      } catch (e) {
        console.log('Haptic non disponibile')
      }
    }
  }

  if (breadcrumbItems.length <= 1) {
    return null // Don't show breadcrumb for home only
  }

  return (
    <nav 
      aria-label={t.breadcrumbAriaLabel}
      className={`bg-white/80 backdrop-blur-md border-b border-gray-200/50 ${className}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center space-x-2 py-3 text-sm">
          {breadcrumbItems.map((item, index) => (
            <motion.li
              key={`${item.href}-${index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="flex items-center"
            >
              {/* Separator */}
              {index > 0 && (
                <svg 
                  className="w-4 h-4 text-gray-400 mx-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              )}

              {/* Breadcrumb item */}
              {item.active ? (
                <span 
                  className="flex items-center space-x-1 text-green-600 font-medium"
                  aria-current="page"
                >
                  {item.icon && <span className="text-base">{item.icon}</span>}
                  <span>{item.label}</span>
                </span>
              ) : (
                <motion.button
                  onClick={() => handleNavigation(item.href, item.label)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 rounded px-1 py-0.5"
                >
                  {item.icon && <span className="text-base">{item.icon}</span>}
                  <span className="hover:underline">{item.label}</span>
                </motion.button>
              )}
            </motion.li>
          ))}
        </ol>
      </div>

      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbItems.map((item, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": item.label,
              "item": `https://www.bottamedi.eu${item.href}`
            }))
          })
        }}
      />
    </nav>
  )
}

export default React.memo(BreadcrumbNavigation)

// Hook per gestire il breadcrumb automaticamente
export const useBreadcrumb = (currentSection: string) => {
  const [breadcrumbVisible, setBreadcrumbVisible] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY > 100 && currentSection !== 'hero'
      setBreadcrumbVisible(shouldShow)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [currentSection])

  return breadcrumbVisible
}