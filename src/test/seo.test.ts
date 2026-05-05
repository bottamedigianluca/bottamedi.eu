import { describe, it, expect } from 'vitest'
import { buildCanonical, buildPageTitle, absoluteUrl } from '@/lib/seo'
import { SITE } from '@/lib/siteConfig'

describe('SEO helpers', () => {
  it('absoluteUrl returns full URL for relative path', () => {
    expect(absoluteUrl('/blog')).toBe(`${SITE.url}/blog`)
  })

  it('absoluteUrl passes through absolute URL', () => {
    expect(absoluteUrl('https://example.com/x')).toBe('https://example.com/x')
  })

  it('buildCanonical strips query and hash', () => {
    expect(buildCanonical('/blog?page=2#top')).toBe(`${SITE.url}/blog`)
  })

  it('buildCanonical keeps root slash', () => {
    expect(buildCanonical('/')).toBe(`${SITE.url}/`)
  })

  it('buildPageTitle appends brand', () => {
    const title = buildPageTitle(['Articolo'], 'it')
    expect(title).toContain('Articolo')
    expect(title).toContain('Bottamedi')
  })

  it('buildPageTitle in German uses German brand', () => {
    expect(buildPageTitle(['Saisonalität'], 'de')).toContain('Obst und Gemüse')
  })
})
