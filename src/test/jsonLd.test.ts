import { describe, it, expect } from 'vitest'
import {
  graph,
  organizationSchema,
  banchettoSchema,
  ingrossoSchema,
  websiteSchema,
  faqSchema,
  breadcrumbSchema,
} from '@/lib/jsonLd'

describe('JSON-LD schema builders', () => {
  it('graph wraps nodes with @context and @graph', () => {
    const g = graph(organizationSchema())
    expect(g['@context']).toBe('https://schema.org')
    expect(Array.isArray(g['@graph'])).toBe(true)
    expect(g['@graph']).toHaveLength(1)
  })

  it('organizationSchema has founding date 1974', () => {
    const o = organizationSchema() as { foundingDate: string }
    expect(o.foundingDate).toBe('1974')
  })

  it('banchettoSchema includes opening hours and aggregate rating', () => {
    const b = banchettoSchema() as {
      openingHoursSpecification: Array<{ opens: string; closes: string }>
      aggregateRating: { ratingValue: string }
    }
    expect(b.openingHoursSpecification[0]?.opens).toBe('07:00')
    expect(b.openingHoursSpecification[0]?.closes).toBe('19:30')
    expect(Number(b.aggregateRating.ratingValue)).toBeGreaterThan(4)
  })

  it('ingrossoSchema targets Trentino Alto Adige', () => {
    const i = ingrossoSchema() as { areaServed: Array<{ name: string }> }
    const names = i.areaServed.map(a => a.name)
    expect(names).toContain('Trentino Alto Adige')
    expect(names).toContain('Bolzano')
  })

  it('faqSchema maps q/a to Question/Answer', () => {
    const f = faqSchema([{ q: 'Q?', a: 'A.' }]) as {
      mainEntity: Array<{ name: string; acceptedAnswer: { text: string } }>
    }
    expect(f.mainEntity[0]?.name).toBe('Q?')
    expect(f.mainEntity[0]?.acceptedAnswer.text).toBe('A.')
  })

  it('breadcrumbSchema builds positional list', () => {
    const b = breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Blog', url: '/blog' },
    ]) as { itemListElement: Array<{ position: number }> }
    expect(b.itemListElement[0]?.position).toBe(1)
    expect(b.itemListElement[1]?.position).toBe(2)
  })

  it('websiteSchema contains SearchAction', () => {
    const w = websiteSchema('it') as { potentialAction: { '@type': string } }
    expect(w.potentialAction['@type']).toBe('SearchAction')
  })
})
