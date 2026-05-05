import { SITE, type Locale } from './siteConfig'

export interface SeoMeta {
  title: string
  description: string
  canonical: string
  ogImage?: string
  ogType?: 'website' | 'article' | 'business.business'
  locale?: Locale
  alternates?: Partial<Record<Locale, string>>
  keywords?: string[]
  noindex?: boolean
  publishedTime?: string
  modifiedTime?: string
  author?: string
  articleSection?: string
  articleTags?: string[]
}

export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path
  return `${SITE.url}${path.startsWith('/') ? '' : '/'}${path}`
}

export function buildCanonical(path: string): string {
  const clean = path.split('#')[0]?.split('?')[0] ?? '/'
  return absoluteUrl(clean.endsWith('/') && clean !== '/' ? clean.slice(0, -1) : clean)
}

export function buildPageTitle(parts: Array<string | undefined>, locale: Locale = 'it'): string {
  const tagline = locale === 'de' ? 'Bottamedi Obst und Gemüse' : 'Bottamedi Frutta e Verdura'
  const core = parts.filter(Boolean).join(' | ')
  return core ? `${core} | ${tagline}` : tagline
}
