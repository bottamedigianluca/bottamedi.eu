import { SITE, type Locale } from './siteConfig'
import type { BlogPost } from './blog'
import { absoluteUrl } from './seo'

const ORG_ID = `${SITE.url}/#organization`
const BANCHETTO_ID = `${SITE.url}/#banchetto`
const INGROSSO_ID = `${SITE.url}/#ingrosso`

export function organizationSchema() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.name,
    alternateName: ['Bottamedi Pierluigi', 'Famiglia Bottamedi'],
    url: SITE.url,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE.url}/logo-bottamedi.webp`,
      width: 512,
      height: 512,
    },
    foundingDate: '1974',
    founders: [{ '@type': 'Person', name: 'Lorenzo Bottamedi' }],
    description:
      "Azienda familiare di Mezzolombardo specializzata nella vendita di frutta e verdura fresca dal 1974. Tre generazioni di esperienza nel settore ortofrutticolo, con servizio al dettaglio al banchetto e ingrosso HORECA per ristoranti e hotel del Trentino Alto Adige.",
    slogan: 'Qualità Inarrivabile, Passione Familiare',
    knowsAbout: [
      'frutta fresca',
      'verdura fresca',
      'ortofrutta',
      'mele Melinda DOP',
      'prodotti tipici trentini',
      'forniture HORECA',
      'ingrosso ortofrutticolo',
    ],
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Trentino Alto Adige' },
      { '@type': 'City', name: 'Mezzolombardo' },
      { '@type': 'City', name: 'Trento' },
      { '@type': 'City', name: 'Bolzano' },
      { '@type': 'City', name: 'Rovereto' },
    ],
    sameAs: [SITE.social.facebook, SITE.social.instagram, SITE.social.maps],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: SITE.phones.banchetto,
        contactType: 'customer service',
        areaServed: 'IT',
        availableLanguage: ['Italian', 'German'],
      },
      {
        '@type': 'ContactPoint',
        telephone: SITE.phones.ingrosso,
        contactType: 'wholesale',
        areaServed: 'IT-TN',
        availableLanguage: ['Italian', 'German', 'English'],
      },
    ],
  }
}

export function banchettoSchema() {
  const a = SITE.addresses.banchetto
  return {
    '@type': ['LocalBusiness', 'GroceryStore', 'FoodEstablishment'],
    '@id': BANCHETTO_ID,
    parentOrganization: { '@id': ORG_ID },
    name: 'Banchetto Bottamedi',
    description:
      'Vendita al dettaglio di frutta e verdura fresca selezionata a Mezzolombardo. Oltre 150 varietà di prodotti stagionali, Mele Melinda DOP, asparagi di Zambana, prodotti km zero del Trentino.',
    image: [
      `${SITE.url}/images/banchetto.webp`,
      `${SITE.url}/images/banco_varieta_autunno.webp`,
      `${SITE.url}/images/melinda_golden.webp`,
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: a.street,
      addressLocality: a.city,
      addressRegion: a.region,
      postalCode: a.postalCode,
      addressCountry: a.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: a.lat, longitude: a.lng },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '07:00',
        closes: '19:30',
      },
    ],
    telephone: SITE.phones.banchetto,
    email: SITE.email,
    priceRange: '€€',
    currenciesAccepted: 'EUR',
    paymentAccepted: 'Cash, Credit Card, Debit Card',
    servesCuisine: 'Prodotti ortofrutticoli freschi',
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '73' },
    hasMap: SITE.social.maps,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Frutta e Verdura di Stagione',
      itemListElement: [
        { '@type': 'OfferCatalog', name: 'Frutta fresca' },
        { '@type': 'OfferCatalog', name: 'Verdura fresca' },
        { '@type': 'OfferCatalog', name: 'Prodotti biologici' },
        { '@type': 'OfferCatalog', name: 'Prodotti locali km zero' },
      ],
    },
  }
}

export function ingrossoSchema() {
  const a = SITE.addresses.ingrosso
  return {
    '@type': ['LocalBusiness', 'Wholesale'],
    '@id': INGROSSO_ID,
    parentOrganization: { '@id': ORG_ID },
    name: 'Bottamedi Ingrosso HORECA',
    description:
      'Servizio ingrosso ortofrutta per ristoranti, hotel, pizzerie, mense e attività HORECA del Trentino Alto Adige. Consegne programmate 6 giorni su 7, selezione quotidiana al mercato, fatturazione business.',
    image: `${SITE.url}/images/albicocche_ingrosso_magazzino.webp`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: a.street,
      addressLocality: a.city,
      addressRegion: a.region,
      postalCode: a.postalCode,
      addressCountry: a.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: a.lat, longitude: a.lng },
    telephone: SITE.phones.ingrosso,
    email: SITE.email,
    priceRange: '€€',
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '54' },
    hasMap: SITE.social.maps,
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Trentino Alto Adige' },
      { '@type': 'City', name: 'Trento' },
      { '@type': 'City', name: 'Bolzano' },
      { '@type': 'City', name: 'Rovereto' },
      { '@type': 'City', name: 'Mezzolombardo' },
      { '@type': 'City', name: 'Mezzocorona' },
      { '@type': 'City', name: 'Cles' },
    ],
    makesOffer: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Fornitura ortofrutta per ristoranti',
          serviceType: 'HORECA Supply',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Fornitura ortofrutta per hotel',
          serviceType: 'HORECA Supply',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Consulenza e selezione prodotti stagionali',
          serviceType: 'Consulting',
        },
      },
    ],
  }
}

export function websiteSchema(locale: Locale = 'it') {
  return {
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    inLanguage: locale === 'de' ? 'de-IT' : 'it-IT',
    publisher: { '@id': ORG_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE.url}/blog?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.url),
    })),
  }
}

export function faqSchema(qas: Array<{ q: string; a: string }>) {
  return {
    '@type': 'FAQPage',
    mainEntity: qas.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
}

export function articleSchema(post: BlogPost) {
  const { frontmatter } = post
  const url = absoluteUrl(
    frontmatter.locale === 'de' ? `/de/blog/${frontmatter.slug}` : `/blog/${frontmatter.slug}`
  )
  return {
    '@type': ['Article', 'BlogPosting'],
    '@id': `${url}#article`,
    headline: frontmatter.title,
    description: frontmatter.excerpt,
    image: frontmatter.cover.src.startsWith('http') ? frontmatter.cover.src : absoluteUrl(frontmatter.cover.src),
    datePublished: frontmatter.publishedAt,
    dateModified: frontmatter.updatedAt ?? frontmatter.publishedAt,
    author: { '@type': 'Person', name: frontmatter.author.name },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: url,
    inLanguage: frontmatter.locale === 'de' ? 'de-IT' : 'it-IT',
    keywords: frontmatter.tags.join(', '),
    articleSection: frontmatter.category,
    wordCount: post.wordCount,
    timeRequired: `PT${post.readingTimeMinutes}M`,
  }
}

/**
 * Schema.org per una ricetta completa. Usare per articoli con ricetta
 * strutturata (ingredienti + istruzioni). Rich result "Recipe" su Google.
 */
export interface RecipeSchemaInput {
  name: string
  description: string
  image: string
  author?: string
  datePublished?: string
  prepTimeMin?: number
  cookTimeMin?: number
  servings?: number
  cuisine?: string
  category?: string
  ingredients: string[]
  instructions: Array<{ name?: string; text: string }>
  nutrition?: {
    calories?: string
    protein?: string
    carbs?: string
    fat?: string
  }
  keywords?: string[]
}

export function recipeSchema(r: RecipeSchemaInput) {
  const minutes = (n?: number) => (n ? `PT${n}M` : undefined)
  return {
    '@type': 'Recipe',
    name: r.name,
    description: r.description,
    image: r.image.startsWith('http') ? r.image : absoluteUrl(r.image),
    author: { '@type': 'Person', name: r.author || 'Famiglia Bottamedi' },
    datePublished: r.datePublished,
    prepTime: minutes(r.prepTimeMin),
    cookTime: minutes(r.cookTimeMin),
    totalTime: minutes((r.prepTimeMin || 0) + (r.cookTimeMin || 0)) || undefined,
    recipeYield: r.servings ? `${r.servings} porzioni` : undefined,
    recipeCuisine: r.cuisine || 'Italiana',
    recipeCategory: r.category,
    recipeIngredient: r.ingredients,
    recipeInstructions: r.instructions.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name || `Passo ${i + 1}`,
      text: s.text,
    })),
    nutrition: r.nutrition
      ? {
          '@type': 'NutritionInformation',
          calories: r.nutrition.calories,
          proteinContent: r.nutrition.protein,
          carbohydrateContent: r.nutrition.carbs,
          fatContent: r.nutrition.fat,
        }
      : undefined,
    keywords: r.keywords?.join(', '),
  }
}

/**
 * Schema per singolo prodotto ortofrutticolo ("What is X" queries).
 * Google lo usa per pannelli informativi e rich snippet tipo "Food".
 */
export interface ProduceItemInput {
  name: string
  alternateName?: string[]
  description: string
  image: string
  category?: 'Verdura' | 'Frutta' | 'Erba aromatica' | 'Fungo' | 'Tubero' | 'Legume'
  origin?: string
  seasonMonths?: number[]
  scientificName?: string
}

export function produceItemSchema(p: ProduceItemInput, pageUrl: string) {
  return {
    '@type': ['Product', 'Thing'],
    '@id': `${pageUrl}#produce`,
    name: p.name,
    alternateName: p.alternateName,
    description: p.description,
    image: p.image.startsWith('http') ? p.image : absoluteUrl(p.image),
    category: p.category || 'Verdura',
    additionalProperty: [
      p.scientificName && {
        '@type': 'PropertyValue',
        name: 'Nome scientifico',
        value: p.scientificName,
      },
      p.origin && {
        '@type': 'PropertyValue',
        name: 'Origine',
        value: p.origin,
      },
      p.seasonMonths && p.seasonMonths.length > 0 && {
        '@type': 'PropertyValue',
        name: 'Mesi di stagione',
        value: p.seasonMonths
          .map((m) => ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'][m - 1])
          .join(', '),
      },
    ].filter(Boolean),
    brand: { '@id': ORG_ID },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'EUR',
      seller: { '@id': BANCHETTO_ID },
      areaServed: 'IT-TN',
    },
  }
}

/**
 * HowTo schema: per guide step-by-step non ricette (es. "come conservare X").
 */
export function howToSchema(input: {
  name: string
  description: string
  image?: string
  totalTimeMin?: number
  steps: Array<{ name: string; text: string; image?: string }>
}) {
  return {
    '@type': 'HowTo',
    name: input.name,
    description: input.description,
    image: input.image ? (input.image.startsWith('http') ? input.image : absoluteUrl(input.image)) : undefined,
    totalTime: input.totalTimeMin ? `PT${input.totalTimeMin}M` : undefined,
    step: input.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
      image: s.image ? (s.image.startsWith('http') ? s.image : absoluteUrl(s.image)) : undefined,
    })),
  }
}

export function graph(...nodes: unknown[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.filter(Boolean),
  }
}
