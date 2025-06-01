// Company Information
export const COMPANY_INFO = {
  name: 'BOTTAMEDI',
  fullName: 'Frutta e Verdura di Pierluigi Bottamedi',
  tagline: {
    it: 'Dal 1974, la passione per la qualità',
    de: 'Seit 1974, Leidenschaft für Qualität'
  },
  description: {
    it: 'Cinquant\'anni di eccellenza nell\'ortofrutta. Freschezza quotidiana e qualità superiore dal cuore del Trentino Alto Adige.',
    de: 'Fünfzig Jahre Exzellenz in Obst und Gemüse. Tägliche Frische und höchste Qualität aus dem Herzen Südtirols.'
  },
  foundedYear: 1974,
  vatNumber: '02273530226'
} as const

// Contact Information
export const CONTACT_INFO = {
  retail: {
    name: {
      it: 'Banchetto (Dettaglio)',
      de: 'Marktstand (Detail)'
    },
    address: 'Via Cavalleggeri Udine, 38017 Mezzolombardo (TN)',
    phone: '351 577 6198',
    phoneFormatted: '+39 351 577 6198',
    email: 'bottamedipierluigi@virgilio.it',
    hours: {
      it: 'Lun-Sab: 07:00-19:30',
      de: 'Mo-Sa: 07:00-19:30'
    },
    coordinates: {
      lat: 46.210472,
      lng: 11.097015
    },
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Banchetto+Frutta+e+Verdura+Bottamedi+Via+Cavalleggeri+Udine+Mezzolombardo+TN'
  },
  horeca: {
    name: {
      it: 'Ingrosso HORECA',
      de: 'Großhandel HORECA'
    },
    address: 'Via Alcide de Gasperi, 47, 38017 Mezzolombardo (TN)',
    phone: '0461 602534',
    phoneFormatted: '+39 0461 602534',
    email: 'bottamedipierluigi@virgilio.it',
    coordinates: {
      lat: 46.213210,
      lng: 11.098930
    },
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Bottamedi+Ingrosso+Ortofrutta+Via+Alcide+de+Gasperi+47+Mezzolombardo'
  },
  general: {
    email: 'bottamedipierluigi@virgilio.it',
    website: 'https://www.bottamedi.eu'
  }
} as const

// Social Media
export const SOCIAL_MEDIA = {
  facebook: {
    url: 'https://www.facebook.com/profile.php?id=100063456281899',
    handle: '@bottamedi'
  },
  instagram: {
    url: 'https://instagram.com/banchetto.bottamedi',
    handle: '@banchetto.bottamedi'
  },
  whatsapp: {
    url: 'https://wa.me/393515776198',
    number: '+39 351 577 6198'
  }
} as const

// Navigation - SEZIONI CORRETTE
export const NAVIGATION = {
  items: [
    { id: 'hero', label: { it: 'Home', de: 'Home' } },
    { id: 'about', label: { it: 'La Nostra Storia', de: 'Unsere Geschichte' } },
    { id: 'dettaglio', label: { it: 'Al Banchetto', de: 'Marktstand' } }, // CORRETTO
    { id: 'services', label: { it: 'Servizi', de: 'Dienstleistungen' } },
    { id: 'products', label: { it: 'Prodotti', de: 'Produkte' } },
    { id: 'contact', label: { it: 'Contatti', de: 'Kontakt' } }
  ]
} as const

// Validation Rules - AGGIUNTO
export const VALIDATION_RULES = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: {
      it: 'Email non valida',
      de: 'Ungültige E-Mail'
    }
  },
  phone: {
    pattern: /^[\+]?[0-9\s\-\(\)]{8,15}$/,
    message: {
      it: 'Numero di telefono non valido',
      de: 'Ungültige Telefonnummer'
    }
  },
  name: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-ZÀ-ÿ\s\-']+$/,
    message: {
      it: 'Nome non valido',
      de: 'Ungültiger Name'
    }
  },
  message: {
    minLength: 10,
    maxLength: 1000,
    message: {
      it: 'Messaggio troppo breve o lungo',
      de: 'Nachricht zu kurz oder zu lang'
    }
  }
} as const

// Products Categories
export const PRODUCT_CATEGORIES = {
  seasonal: {
    id: 'seasonal',
    name: { it: 'Frutta di Stagione', de: 'Saisonales Obst' },
    icon: '🍎',
    color: 'from-red-500 to-pink-500'
  },
  vegetables: {
    id: 'vegetables',
    name: { it: 'Verdure Fresche', de: 'Frisches Gemüse' },
    icon: '🥕',
    color: 'from-green-500 to-emerald-500'
  },
  specialty: {
    id: 'specialty',
    name: { it: 'Specialità', de: 'Spezialitäten' },
    icon: '✨',
    color: 'from-amber-500 to-orange-500'
  }
} as const

// Services
export const SERVICES = {
  retail: {
    id: 'retail',
    title: { it: 'Vendita al Dettaglio', de: 'Einzelhandel' },
    icon: '🛒',
    color: 'from-brand-500 to-brand-600'
  },
  horeca: {
    id: 'horeca',
    title: { it: 'Servizi HORECA', de: 'HORECA-Service' },
    icon: '🏨',
    color: 'from-accent-500 to-accent-600'
  },
  consulting: {
    id: 'consulting',
    title: { it: 'Consulenza Specializzata', de: 'Fachberatung' },
    icon: '💡',
    color: 'from-emerald-500 to-emerald-600'
  }
} as const

// SEO Meta Data
export const SEO_META = {
  title: {
    it: 'Bottamedi Frutta e Verdura Mezzolombardo | Ingrosso e Dettaglio Trentino Alto Adige',
    de: 'Bottamedi Obst und Gemüse Mezzolombardo | Großhandel und Einzelhandel Südtirol'
  },
  description: {
    it: 'Bottamedi: da 50 anni qualità e freschezza in frutta e verdura a Mezzolombardo. Servizio ingrosso HORECA in Trentino Alto Adige e vendita al dettaglio al Banchetto.',
    de: 'Bottamedi: seit 50 Jahren Qualität und Frische bei Obst und Gemüse in Mezzolombardo. HORECA-Großhandelsservice in Südtirol und Einzelhandel am Marktstand.'
  },
  keywords: {
    it: 'frutta e verdura, mezzolombardo, trentino alto adige, ingrosso ortofrutta, dettaglio frutta verdura, Bottamedi, prodotti freschi, qualità, famiglia, HORECA, ristoranti, hotel, catering, Melinda, prodotti tipici trentini, consegna frutta verdura, ingrosso alimentari trentino',
    de: 'obst und gemüse, mezzolombardo, südtirol, trentino, großhandel obst gemüse, einzelhandel obst gemüse, Bottamedi, frische produkte, qualität, familie, HORECA, restaurants, hotels, catering, Melinda, typische südtiroler produkte, obst gemüse lieferung, lebensmittel großhandel südtirol'
  },
  ogImage: '/images/banco_varieta_autunno.webp'
} as const

// Timeline Data
export const TIMELINE_DATA = {
  items: [
    {
      year: '1974',
      title: { 
        it: 'Le Radici del Sapore', 
        de: 'Die Wurzeln des Geschmacks' 
      },
      description: {
        it: 'Tutto ha inizio con nonno Luigi. Con dedizione e rispetto per la terra del Trentino Alto Adige, piantò il seme di un\'attività basata sulla qualità e fiducia.',
        de: 'Alles beginnt mit Großvater Luigi. Mit Hingabe und Respekt für das Südtiroler Land pflanzte er den Samen eines Geschäfts, das auf Qualität und Vertrauen basiert.'
      },
      image: '/images/melinda_golden.webp'
    },
    {
      year: '1990',
      title: { 
        it: 'L\'Orizzonte si Allarga', 
        de: 'Der Horizont erweitert sich' 
      },
      description: {
        it: 'L\'eredità cresce con papà Giovanni. Albe ai mercati, ricerca delle primizie migliori, consolidamento dei rapporti: il servizio si struttura.',
        de: 'Das Erbe wächst mit Vater Giovanni. Frühe Morgenstunden auf den Märkten, Suche nach den besten Früchten, Festigung der Beziehungen: der Service strukturiert sich.'
      },
      image: '/images/pomodori_cuore_bue.webp'
    },
    {
      year: 'Oggi',
      title: { 
        it: 'Il Futuro nelle Nostre Mani', 
        de: 'Die Zukunft in unseren Händen' 
      },
      description: {
        it: 'Oggi, Pierluigi e la famiglia Bottamedi continuano la tradizione, unendo esperienza e innovazione per il futuro dell\'ortofrutta del Trentino Alto Adige.',
        de: 'Heute führen Pierluigi und die Familie Bottamedi die Tradition fort und verbinden Erfahrung mit Innovation für die Zukunft des Südtiroler Obst- und Gemüsesektors.'
      },
      image: '/images/kiwi-cuore.webp'
    }
  ]
} as const

// Values Data
export const VALUES_DATA = {
  items: [
    {
      icon: '🌱',
      title: { it: 'Freschezza', de: 'Frische' },
      description: {
        it: 'Selezioniamo quotidianamente solo i prodotti migliori',
        de: 'Wir wählen täglich nur die besten Produkte aus'
      }
    },
    {
      icon: '⭐',
      title: { it: 'Qualità', de: 'Qualität' },
      description: {
        it: 'Standard elevati garantiti da tre generazioni di esperienza',
        de: 'Hohe Standards garantiert durch drei Generationen Erfahrung'
      }
    },
    {
      icon: '❤️',
      title: { it: 'Passione', de: 'Leidenschaft' },
      description: {
        it: 'L\'amore per il nostro lavoro si riflette in ogni prodotto',
        de: 'Die Liebe zu unserer Arbeit spiegelt sich in jedem Produkt wider'
      }
    },
    {
      icon: '🏔️',
      title: { it: 'Territorio', de: 'Territorium' },
      description: {
        it: 'Valorizziamo i sapori autentici del Trentino Alto Adige',
        de: 'Wir schätzen die authentischen Aromen Südtirols'
      }
    }
  ]
} as const

// Brand Colors
export const BRAND_COLORS = {
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16'
  },
  accent: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03'
  }
} as const

// Animation Durations - OTTIMIZZATI
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 250,
  slow: 400,
  slower: 600
} as const

// Breakpoints
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const

// Z-Index Layers
export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
  toast: 1070
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  language: 'bottamedi-language',
  theme: 'bottamedi-theme',
  newsletter: 'bottamedi-newsletter-subscribed',
  cookieConsent: 'bottamedi-cookie-consent'
} as const

// Performance Thresholds
export const PERFORMANCE_THRESHOLDS = {
  loadTime: {
    good: 1000,
    needsImprovement: 1500,
    poor: 2500
  },
  firstContentfulPaint: {
    good: 1200,
    needsImprovement: 2000,
    poor: 3000
  },
  largestContentfulPaint: {
    good: 1800,
    needsImprovement: 2500,
    poor: 3500
  },
  cumulativeLayoutShift: {
    good: 0.1,
    needsImprovement: 0.25,
    poor: 0.25
  }
} as const

// Feature Flags - OTTIMIZZATI
export const FEATURE_FLAGS = {
  enableAnalytics: false, // Disabilitato in dev
  enableNewsletter: true,
  enableCookieConsent: false, // Disabilitato in dev
  enableParticles: false, // Disabilitato per performance
  enableAnimations: true,
  enableLazyLoading: true,
  enableServiceWorker: false, // Disabilitato in dev
  enableOfflineMode: false,
  enableDarkMode: false
} as const

// Default Export
export default {
  COMPANY_INFO,
  CONTACT_INFO,
  SOCIAL_MEDIA,
  NAVIGATION,
  PRODUCT_CATEGORIES,
  SERVICES,
  BRAND_COLORS,
  ANIMATION_DURATION,
  BREAKPOINTS,
  Z_INDEX,
  STORAGE_KEYS,
  SEO_META,
  TIMELINE_DATA,
  VALUES_DATA,
  PERFORMANCE_THRESHOLDS,
  FEATURE_FLAGS,
  VALIDATION_RULES
} as const