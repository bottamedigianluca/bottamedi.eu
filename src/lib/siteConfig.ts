export const SITE = {
  url: 'https://www.bottamedi.eu',
  name: 'Bottamedi Frutta e Verdura',
  shortName: 'Bottamedi',
  tagline: {
    it: 'Frutta e Verdura fresca dal 1974 — Mezzolombardo',
    de: 'Frisches Obst und Gemüse seit 1974 — Mezzolombardo',
  },
  defaultOgImage: 'https://www.bottamedi.eu/images/banchetto.webp',
  twitterHandle: '',
  defaultLocale: 'it',
  locales: ['it', 'de'] as const,
  email: 'bottamedipierluigi@virgilio.it',
  phones: {
    banchetto: '+39-351-577-6198',
    ingrosso: '+39-0461-602534',
  },
  addresses: {
    banchetto: {
      street: 'Via Cavalleggeri Udine',
      city: 'Mezzolombardo',
      region: 'TN',
      postalCode: '38017',
      country: 'IT',
      lat: 46.210472,
      lng: 11.097015,
    },
    ingrosso: {
      street: 'Via Alcide de Gasperi, 47',
      city: 'Mezzolombardo',
      region: 'TN',
      postalCode: '38017',
      country: 'IT',
      lat: 46.21321,
      lng: 11.09893,
    },
  },
  foundedYear: 1974,
  social: {
    facebook: 'https://www.facebook.com/profile.php?id=100063456281899',
    instagram: 'https://instagram.com/banchetto.bottamedi',
    maps: 'https://maps.app.goo.gl/TFV4cgnEvcFjBHfD6',
  },
} as const

export type Locale = (typeof SITE.locales)[number]

export const BLOG_CATEGORIES = {
  stagionalita: { it: 'Stagionalità', de: 'Saisonalität', color: '#22c55e' },
  ricette: { it: 'Ricette', de: 'Rezepte', color: '#f59e0b' },
  territorio: { it: 'Territorio', de: 'Gebiet', color: '#84cc16' },
  horeca: { it: 'HORECA', de: 'HORECA', color: '#0ea5e9' },
  storie: { it: 'Storie di famiglia', de: 'Familiengeschichten', color: '#a855f7' },
  sostenibilita: { it: 'Sostenibilità', de: 'Nachhaltigkeit', color: '#10b981' },
  guide: { it: 'Guide', de: 'Anleitungen', color: '#6366f1' },
  news: { it: 'News', de: 'News', color: '#ef4444' },
} as const

export type BlogCategoryKey = keyof typeof BLOG_CATEGORIES
