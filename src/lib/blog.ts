import { PostFrontmatterSchema, type PostFrontmatter } from './blogSchema'
import type { Locale } from './siteConfig'
import generated from '../content/blog/_generated-index.json'

export interface BlogPost {
  frontmatter: PostFrontmatter
  readingTimeMinutes: number
  readingTimeText: string
  wordCount: number
  fileName: string
}

function parseEntries(): BlogPost[] {
  const arr = Array.isArray(generated) ? generated : []
  const out: BlogPost[] = []
  for (const raw of arr) {
    const parsed = PostFrontmatterSchema.safeParse((raw as { frontmatter: unknown }).frontmatter)
    if (!parsed.success) {
      if (import.meta.env?.DEV) console.warn('[blog] invalid frontmatter in', raw)
      continue
    }
    out.push({
      frontmatter: parsed.data,
      readingTimeMinutes: (raw as { readingTimeMinutes: number }).readingTimeMinutes,
      readingTimeText: (raw as { readingTimeText: string }).readingTimeText,
      wordCount: (raw as { wordCount: number }).wordCount,
      fileName: (raw as { fileName: string }).fileName,
    })
  }
  return out
}

const ALL_POSTS: BlogPost[] = parseEntries()

export function getAllPosts(includesDrafts = false): BlogPost[] {
  return includesDrafts ? ALL_POSTS : ALL_POSTS.filter(p => !p.frontmatter.draft)
}

export function getPostBySlug(slug: string, locale: Locale = 'it'): BlogPost | undefined {
  return getAllPosts().find(p => p.frontmatter.slug === slug && p.frontmatter.locale === locale)
}

export function getPostsByCategory(category: string, locale: Locale = 'it'): BlogPost[] {
  return getAllPosts().filter(p => p.frontmatter.category === category && p.frontmatter.locale === locale)
}

export function getPostsByTag(tag: string, locale: Locale = 'it'): BlogPost[] {
  const needle = tag.toLowerCase()
  return getAllPosts().filter(
    p => p.frontmatter.locale === locale && p.frontmatter.tags.some(t => t.toLowerCase() === needle)
  )
}

export function getPostsByLocale(locale: Locale): BlogPost[] {
  return getAllPosts().filter(p => p.frontmatter.locale === locale)
}

export function getAllTags(locale: Locale = 'it'): Array<{ tag: string; count: number }> {
  const map = new Map<string, number>()
  for (const p of getPostsByLocale(locale)) {
    for (const t of p.frontmatter.tags) {
      const k = t.toLowerCase()
      map.set(k, (map.get(k) ?? 0) + 1)
    }
  }
  return Array.from(map.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  const { slug, category, tags, locale } = post.frontmatter
  if (post.frontmatter.relatedSlugs?.length) {
    const related = post.frontmatter.relatedSlugs
      .map(s => getPostBySlug(s, locale))
      .filter((p): p is BlogPost => Boolean(p) && p!.frontmatter.slug !== slug)
    if (related.length >= limit) return related.slice(0, limit)
  }
  const pool = getPostsByLocale(locale).filter(p => p.frontmatter.slug !== slug)
  const scored = pool.map(p => {
    let score = 0
    if (p.frontmatter.category === category) score += 3
    for (const t of p.frontmatter.tags) if (tags.includes(t)) score += 1
    return { post: p, score }
  })
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score || (a.post.frontmatter.publishedAt < b.post.frontmatter.publishedAt ? 1 : -1))
    .slice(0, limit)
    .map(s => s.post)
}

export function formatPostDate(iso: string, locale: Locale = 'it'): string {
  const d = new Date(iso + 'T00:00:00Z')
  return d.toLocaleDateString(locale === 'it' ? 'it-IT' : 'de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
