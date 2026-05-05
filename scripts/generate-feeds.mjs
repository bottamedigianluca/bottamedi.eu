#!/usr/bin/env node
/**
 * Generates sitemap.xml and rss.xml into dist/ using blog frontmatter.
 * Runs after vite-react-ssg build.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import RSS from 'rss'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const SITE = 'https://www.bottamedi.eu'
const DIST = path.join(ROOT, 'dist')
const BLOG_DIR = path.join(ROOT, 'src', 'content', 'blog')

function readAllPosts() {
  if (!fs.existsSync(BLOG_DIR)) return []
  const entries = []
  function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
      const p = path.join(dir, name)
      const stat = fs.statSync(p)
      if (stat.isDirectory()) walk(p)
      else if (name.endsWith('.mdx')) entries.push(p)
    }
  }
  walk(BLOG_DIR)
  const posts = []
  for (const file of entries) {
    try {
      const raw = fs.readFileSync(file, 'utf8')
      const { data, content } = matter(raw)
      if (data.draft === true) continue
      posts.push({ fm: data, content, file })
    } catch (err) {
      console.warn(`[feeds] skip ${file}:`, err.message)
    }
  }
  posts.sort((a, b) => (a.fm.publishedAt < b.fm.publishedAt ? 1 : -1))
  return posts
}

function postUrl(fm) {
  const prefix = fm.locale === 'de' ? '/de/blog' : '/blog'
  return `${SITE}${prefix}/${fm.slug}`
}

function escapeXml(s) {
  return String(s).replace(/[<>&'"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]))
}

function generateSitemap(posts) {
  const now = new Date().toISOString()
  const staticUrls = [
    { loc: `${SITE}/`, changefreq: 'weekly', priority: '1.0', lastmod: now },
    { loc: `${SITE}/de`, changefreq: 'weekly', priority: '0.9', lastmod: now, hreflang: { it: `${SITE}/`, de: `${SITE}/de` } },
    { loc: `${SITE}/blog`, changefreq: 'daily', priority: '0.9', lastmod: now },
    { loc: `${SITE}/de/blog`, changefreq: 'daily', priority: '0.8', lastmod: now },
  ]
  const postUrls = posts.map(({ fm }) => ({
    loc: postUrl(fm),
    changefreq: 'monthly',
    priority: fm.featured ? '0.8' : '0.7',
    lastmod: fm.updatedAt ?? fm.publishedAt,
    image: fm.cover?.src?.startsWith('http') ? fm.cover.src : `${SITE}${fm.cover?.src ?? ''}`,
    imageCaption: fm.cover?.alt ?? fm.title,
  }))
  const all = [...staticUrls, ...postUrls]
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${all
  .map(u => {
    const alternates = u.hreflang
      ? Object.entries(u.hreflang)
          .map(([lng, href]) => `    <xhtml:link rel="alternate" hreflang="${lng}" href="${escapeXml(href)}"/>`)
          .join('\n')
      : ''
    const imageBlock = u.image
      ? `
    <image:image>
      <image:loc>${escapeXml(u.image)}</image:loc>
      <image:caption>${escapeXml(u.imageCaption || '')}</image:caption>
    </image:image>`
      : ''
    return `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${alternates ? '\n' + alternates : ''}${imageBlock}
  </url>`
  })
  .join('\n')}
</urlset>
`
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), xml, 'utf8')
  console.log(`[feeds] sitemap.xml written with ${all.length} urls`)
}

function generateRss(posts) {
  const feed = new RSS({
    title: 'Bottamedi — Blog',
    description:
      "Blog di Bottamedi: stagionalità, ricette, storie dal territorio trentino, guide HORECA per ristoranti e hotel. Scritto da una famiglia che seleziona frutta e verdura dal 1974.",
    feed_url: `${SITE}/rss.xml`,
    site_url: SITE,
    image_url: `${SITE}/logo-bottamedi.webp`,
    language: 'it',
    pubDate: new Date(),
    ttl: 60,
  })
  for (const { fm, content } of posts.filter(p => p.fm.locale !== 'de')) {
    feed.item({
      title: fm.title,
      description: fm.excerpt,
      url: postUrl(fm),
      guid: postUrl(fm),
      categories: [fm.category, ...(fm.tags ?? [])],
      author: fm.author?.name ?? 'Famiglia Bottamedi',
      date: fm.updatedAt ?? fm.publishedAt,
      enclosure: fm.cover?.src
        ? {
            url: fm.cover.src.startsWith('http') ? fm.cover.src : `${SITE}${fm.cover.src}`,
            type: 'image/webp',
          }
        : undefined,
      custom_elements: [{ 'content:encoded': { _cdata: content.slice(0, 1000) } }],
    })
  }
  fs.writeFileSync(path.join(DIST, 'rss.xml'), feed.xml({ indent: true }), 'utf8')
  console.log(`[feeds] rss.xml written`)
}

function generateRobots() {
  const content = `# robots.txt — bottamedi.eu
User-agent: *
Allow: /
Disallow: /src/
Disallow: /node_modules/

# Blocca crawler aggressivi (non SEO)
User-agent: AhrefsBot
Disallow: /
User-agent: SemrushBot
Disallow: /
User-agent: DotBot
Disallow: /
User-agent: MJ12bot
Disallow: /

# Sitemap
Sitemap: ${SITE}/sitemap.xml
`
  fs.writeFileSync(path.join(DIST, 'robots.txt'), content, 'utf8')
  console.log('[feeds] robots.txt written')
}

function main() {
  if (!fs.existsSync(DIST)) {
    console.error(`[feeds] dist/ not found at ${DIST}. Run build first.`)
    process.exit(1)
  }
  const posts = readAllPosts()
  generateSitemap(posts)
  generateRss(posts)
  generateRobots()
  console.log(`[feeds] done (${posts.length} posts)`)
}

main()
