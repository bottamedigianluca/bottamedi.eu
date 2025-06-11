// Footer.tsx - VERSIONE CORRETTA
import React from 'react'
import { motion } from 'framer-motion'

interface FooterProps {
  language: 'it' | 'de'
}

const translations = {
  it: {
    company: {
      name: 'BOTTAMEDI',
      description: 'Tre generazioni di eccellenza nell\'ortofrutta. Qualità inarrivabile e passione familiare dal 1974.',
      tagline: 'Da oltre 50 anni, la passione per la qualità'
    },
    links: {
      about: 'La Nostra Storia',
      banchetto: 'Al Banchetto',
      services: 'Servizi Ingrosso',
      contact: 'Contatti'
    },
    contact: {
      title: 'Contatti',
      retail: {
        title: 'Banchetto (Dettaglio)',
        address: 'Via Cavalleggeri Udine, 38017 Mezzolombardo (TN)',
        phone: '351 577 6198',
        hours: 'Lun-Sab: 07:00-19:30'
      },
      horeca: {
        title: 'Ingrosso HORECA',
        address: 'Via Alcide de Gasperi, 47, 38017 Mezzolombardo (TN)',
        phone: '0461 602534',
        email: 'bottamedipierluigi@virgilio.it'
      }
    },
    social: {
      title: 'Seguici',
      facebook: 'Facebook',
      instagram: 'Instagram',
      whatsapp: 'WhatsApp'
    },
    legal: {
      copyright: 'Tutti i diritti riservati.',
      company: 'Bottamedi Frutta e Verdura di Bottamedi Pierluigi',
      vat: 'P.IVA 02273530226',
      madeby: 'Realizzato da Bottamedi Gianluca'
    },
    quickLinks: 'Link Rapidi'
  },
  de: {
    company: {
      name: 'BOTTAMEDI',
      description: 'Drei Generationen Exzellenz in Obst und Gemüse. Unübertreffliche Qualität und familiäre Leidenschaft seit 1974.',
      tagline: 'Seit über 50 Jahren, Leidenschaft für Qualität'
    },
    links: {
      about: 'Unsere Geschichte',
      banchetto: 'Marktstand',
      services: 'Großhandel Service',
      contact: 'Kontakt'
    },
    contact: {
      title: 'Kontakt',
      retail: {
        title: 'Marktstand (Detail)',
        address: 'Via Cavalleggeri Udine, 38017 Mezzolombardo (TN)',
        phone: '351 577 6198',
        hours: 'Mo-Sa: 07:00-19:30'
      },
      horeca: {
        title: 'Großhandel HORECA',
        address: 'Via Alcide de Gasperi, 47, 38017 Mezzolombardo (TN)',
        phone: '0461 602534',
        email: 'bottamedipierluigi@virgilio.it'
      }
    },
    social: {
      title: 'Folgen Sie uns',
      facebook: 'Facebook',
      instagram: 'Instagram',
      whatsapp: 'WhatsApp'
    },
    legal: {
      copyright: 'Alle Rechte vorbehalten.',
      company: 'Bottamedi Obst und Gemüse von Bottamedi Pierluigi',
      vat: 'MwSt-Nr. 02273530226',
      madeby: 'Erstellt von Bottamedi Gianluca'
    },
    quickLinks: 'Schnelle Links'
  }
} as const

const SocialIcon: React.FC<{
  href: string
  icon: React.ReactNode
  label: string
}> = ({ href, icon, label }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    whileHover={{ scale: 1.1, y: -2 }}
    whileTap={{ scale: 0.9 }}
    className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 group"
  >
    <motion.div
      className="w-6 h-6"
      whileHover={{ rotate: 10 }}
      transition={{ duration: 0.2 }}
    >
      {icon}
    </motion.div>
  </motion.a>
)

const Footer: React.FC<FooterProps> = ({ language }) => {
  const t = translations[language]
  const currentYear = new Date().getFullYear()

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="relative bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Company Info */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center overflow-hidden">
                  <img
                    src="/favicon.svg"
                    alt="Bottamedi Favicon"
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      target.parentElement!.innerHTML = '<span class="text-white font-bold text-2xl">B</span>'
                    }}
                  />
                </div>
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">
                    {t.company.name}
                  </h2>
                  <p className="text-white/80 text-sm">
                    {t.company.tagline}
                  </p>
                </div>
              </div>
              
              <p className="text-white/80 leading-relaxed mb-6 max-w-md">
                {t.company.description}
              </p>

              {/* Social Media */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t.social.title}</h3>
                <div className="flex space-x-4">
                  <SocialIcon
                    href="https://www.facebook.com/profile.php?id=100063456281899"
                    label={t.social.facebook}
                    icon={
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    }
                  />
                  
                  <SocialIcon
                    href="https://instagram.com/banchetto.bottamedi"
                    label={t.social.instagram}
                    icon={
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    }
                  />

                  <SocialIcon
                    href="https://wa.me/393515776198"
                    label={t.social.whatsapp}
                    icon={
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.097"/>
                      </svg>
                    }
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6">{t.quickLinks}</h3>
            <ul className="space-y-3">
              {[
                { label: t.links.about, id: 'about' },
                { label: t.links.banchetto, id: 'dettaglio' },
                { label: t.links.services, id: 'services' },
                { label: t.links.contact, id: 'contact' }
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-white/80 hover:text-white transition-colors duration-300 text-left hover:translate-x-1 transform transition-transform"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Contact Info Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 pt-12 border-t border-white/20"
        >
          {/* Retail Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-green-400">
              {t.contact.retail.title}
            </h4>
            <div className="space-y-2 text-white/80">
              <p className="flex items-start space-x-2">
                <svg className="w-5 h-5 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{t.contact.retail.address}</span>
              </p>
              <p className="flex items-center space-x-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:+39${t.contact.retail.phone.replace(/\s/g, '')}`} className="hover:text-white transition-colors">
                  +39 {t.contact.retail.phone}
                </a>
              </p>
              <p className="flex items-center space-x-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{t.contact.retail.hours}</span>
              </p>
            </div>
          </div>

          {/* HORECA Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-blue-400">
              {t.contact.horeca.title}
            </h4>
            <div className="space-y-2 text-white/80">
              <p className="flex items-start space-x-2">
                <svg className="w-5 h-5 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{t.contact.horeca.address}</span>
              </p>
              <p className="flex items-center space-x-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:+39${t.contact.horeca.phone.replace(/\s/g, '')}`} className="hover:text-white transition-colors">
                  +39 {t.contact.horeca.phone}
                </a>
              </p>
              <p className="flex items-center space-x-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${t.contact.horeca.email}`} className="hover:text-white transition-colors">
                  {t.contact.horeca.email}
                </a>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Copyright senza link legali */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-white/20"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-white/80 text-sm">
                © {currentYear} {t.legal.company}. {t.legal.copyright}
              </p>
              <p className="text-white/60 text-sm">
                {t.legal.vat}
              </p>
            </div>
            
            {/* Made by */}
            <p className="text-white/40 text-xs">
              {t.legal.madeby}
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer

// =======================================================
// COMPONENTE BAR FISSO - DA AGGIUNGERE NELL'APP.TSX
// =======================================================

interface LegalBarProps {
  language: 'it' | 'de'
}

const LegalBar: React.FC<LegalBarProps> = ({ language }) => {
  const [showCookieSettings, setShowCookieSettings] = React.useState(false)
  
  const legalTranslations = {
    it: {
      policy: 'Informativa Privacy',
      terms: 'Termini di Servizio',
      cookies: 'Gestisci Cookie',
      cookieSettings: 'Impostazioni Cookie'
    },
    de: {
      policy: 'Datenschutz',
      terms: 'AGB',
      cookies: 'Cookie-Einstellungen',
      cookieSettings: 'Cookie-Einstellungen'
    }
  }

  const t = legalTranslations[language]

  // 🔓 FUNZIONE CORRETTA PER SBLOCCARE I DOCUMENTI
  const handleLegalClick = (docType: 'privacy' | 'terms' | 'cookies') => {
    if (docType === 'cookies') {
      // Gestione cookie separata
      setShowCookieSettings(true)
      return
    }

    // 🔧 EVENTO CORRETTO PER PRIVACY E TERMS
    const event = new CustomEvent('openLegalDocument', { 
      detail: { docType, language } 
    })
    window.dispatchEvent(event)
    
    // Analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'legal_document_open', {
        event_category: 'legal_bar',
        event_label: docType,
        value: 1
      })
    }
  }

  return (
    <>
      {/* 📌 BAR FISSO IN FONDO - SEMPRE VISIBILE */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900/95 backdrop-blur-md border-t border-white/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs text-white/70">
            
            <button 
              onClick={() => handleLegalClick('privacy')}
              className="hover:text-white transition-colors hover:underline"
            >
              {t.policy}
            </button>
            
            <span className="hidden sm:inline text-white/40">•</span>
            
            <button 
              onClick={() => handleLegalClick('terms')}
              className="hover:text-white transition-colors hover:underline"
            >
              {t.terms}
            </button>
            
            <span className="hidden sm:inline text-white/40">•</span>
            
            <button 
              onClick={() => handleLegalClick('cookies')}
              className="hover:text-white transition-colors hover:underline"
            >
              {t.cookies}
            </button>
          </div>
        </div>
      </div>

      {/* 🍪 MODAL COOKIE SETTINGS */}
      {showCookieSettings && (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{t.cookieSettings}</h3>
            <p className="text-gray-600 text-sm mb-4">
              Utilizziamo solo cookie tecnici necessari per il funzionamento del sito.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCookieSettings(false)}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export { LegalBar }
