#!/usr/bin/env node
/**
 * Post-build SEO injector.
 *
 * vite-react-ssg + react-helmet-async non sempre iniettano i meta tag dinamici
 * durante il pre-render. Questo script garantisce che ogni HTML pre-renderizzato
 * abbia title, description, canonical, OG, Twitter e JSON-LD corretti,
 * leggendo i dati dal frontmatter e dallo stato noto del sito.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DIST = path.join(ROOT, 'dist')
const BLOG_DIR = path.join(ROOT, 'src', 'content', 'blog')
const SITE_URL = 'https://www.bottamedi.eu'

const CATEGORIES = {
  stagionalita: { it: 'Stagionalità', de: 'Saisonalität' },
  ricette: { it: 'Ricette', de: 'Rezepte' },
  territorio: { it: 'Territorio', de: 'Gebiet' },
  horeca: { it: 'HORECA', de: 'HORECA' },
  storie: { it: 'Storie di famiglia', de: 'Familiengeschichten' },
  sostenibilita: { it: 'Sostenibilità', de: 'Nachhaltigkeit' },
  guide: { it: 'Guide', de: 'Anleitungen' },
  news: { it: 'News', de: 'News' },
}

const ORG_ID = `${SITE_URL}/#organization`

function organizationSchema() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'Bottamedi Frutta e Verdura',
    url: SITE_URL,
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo-bottamedi.webp`, width: 512, height: 512 },
    foundingDate: '1974',
  }
}

function articleSchema(fm, readingTimeMin, wordCount, canonical) {
  return {
    '@type': ['Article', 'BlogPosting'],
    '@id': `${canonical}#article`,
    headline: fm.title,
    description: fm.excerpt,
    image: fm.cover?.src?.startsWith('http') ? fm.cover.src : `${SITE_URL}${fm.cover?.src || ''}`,
    datePublished: fm.publishedAt,
    dateModified: fm.updatedAt || fm.publishedAt,
    author: { '@type': 'Person', name: fm.author?.name || 'Famiglia Bottamedi' },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: canonical,
    inLanguage: fm.locale === 'de' ? 'de-IT' : 'it-IT',
    keywords: (fm.tags || []).join(', '),
    articleSection: fm.category,
    wordCount,
    timeRequired: `PT${readingTimeMin}M`,
  }
}

function breadcrumbSchema(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url.startsWith('http') ? it.url : `${SITE_URL}${it.url}`,
    })),
  }
}

function escHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escJsonForScript(json) {
  // Prevent </script> breaking out
  return JSON.stringify(json).replace(/</g, '\\u003c')
}

function buildHeadBlock({ title, description, canonical, ogImage, ogType, locale, publishedTime, modifiedTime, author, articleSection, articleTags, keywords, jsonLdNodes, alternates }) {
  const og = ogImage || `${SITE_URL}/images/banchetto.webp`
  const ogLocale = locale === 'de' ? 'de_IT' : 'it_IT'
  const altLocale = locale === 'de' ? 'it_IT' : 'de_IT'
  const tags = []
  tags.push(`<title>${escHtml(title)}</title>`)
  tags.push(`<meta name="description" content="${escHtml(description)}">`)
  if (keywords?.length) tags.push(`<meta name="keywords" content="${escHtml(keywords.join(', '))}">`)
  tags.push(`<link rel="canonical" href="${escHtml(canonical)}">`)
  if (alternates) {
    for (const [lng, href] of Object.entries(alternates)) {
      tags.push(`<link rel="alternate" hreflang="${escHtml(lng)}" href="${escHtml(href)}">`)
    }
    if (alternates.it) tags.push(`<link rel="alternate" hreflang="x-default" href="${escHtml(alternates.it)}">`)
  }
  tags.push(`<meta property="og:title" content="${escHtml(title)}">`)
  tags.push(`<meta property="og:description" content="${escHtml(description)}">`)
  tags.push(`<meta property="og:type" content="${escHtml(ogType || 'website')}">`)
  tags.push(`<meta property="og:url" content="${escHtml(canonical)}">`)
  tags.push(`<meta property="og:image" content="${escHtml(og)}">`)
  tags.push(`<meta property="og:image:width" content="1200">`)
  tags.push(`<meta property="og:image:height" content="630">`)
  tags.push(`<meta property="og:locale" content="${ogLocale}">`)
  tags.push(`<meta property="og:locale:alternate" content="${altLocale}">`)
  if (publishedTime) tags.push(`<meta property="article:published_time" content="${escHtml(publishedTime)}">`)
  if (modifiedTime) tags.push(`<meta property="article:modified_time" content="${escHtml(modifiedTime)}">`)
  if (author) tags.push(`<meta property="article:author" content="${escHtml(author)}">`)
  if (articleSection) tags.push(`<meta property="article:section" content="${escHtml(articleSection)}">`)
  if (articleTags?.length) for (const t of articleTags) tags.push(`<meta property="article:tag" content="${escHtml(t)}">`)
  tags.push(`<meta name="twitter:card" content="summary_large_image">`)
  tags.push(`<meta name="twitter:title" content="${escHtml(title)}">`)
  tags.push(`<meta name="twitter:description" content="${escHtml(description)}">`)
  tags.push(`<meta name="twitter:image" content="${escHtml(og)}">`)
  for (const node of jsonLdNodes || []) {
    tags.push(`<script type="application/ld+json">${escJsonForScript(node)}</script>`)
  }
  return tags.join('\n  ')
}

function replaceHead(html, newHead) {
  let out = html
  // Drop existing <title>
  out = out.replace(/<title>[\s\S]*?<\/title>/gi, '')
  // Drop existing static meta/link tags that we will re-inject
  const patterns = [
    /<meta\s+name="description"[^>]*>\s*/gi,
    /<meta\s+name="keywords"[^>]*>\s*/gi,
    /<link\s+rel="canonical"[^>]*>\s*/gi,
    /<link\s+rel="alternate"\s+hreflang="[^"]*"[^>]*>\s*/gi,
    /<meta\s+property="og:[^"]*"[^>]*>\s*/gi,
    /<meta\s+property="article:[^"]*"[^>]*>\s*/gi,
    /<meta\s+name="twitter:[^"]*"[^>]*>\s*/gi,
    /<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>\s*/gi,
  ]
  for (const p of patterns) out = out.replace(p, '')
  // Inject block before </head>
  return out.replace(/<\/head>/i, `  ${newHead}\n</head>`)
}

function loadPosts() {
  const posts = []
  if (!fs.existsSync(BLOG_DIR)) return posts
  for (const name of fs.readdirSync(BLOG_DIR)) {
    if (!name.endsWith('.mdx')) continue
    try {
      const file = path.join(BLOG_DIR, name)
      const raw = fs.readFileSync(file, 'utf8')
      const { data, content } = matter(raw)
      if (data.draft) continue
      const rt = readingTime(content)
      posts.push({
        fm: data,
        readingTimeMin: Math.max(1, Math.round(rt.minutes)),
        wordCount: rt.words,
      })
    } catch (err) {
      console.warn(`[seo-inject] skip ${name}: ${err.message}`)
    }
  }
  return posts
}

function processPost({ fm, readingTimeMin, wordCount }) {
  const locale = fm.locale === 'de' ? 'de' : 'it'
  const basePath = locale === 'de' ? '/de/blog' : '/blog'
  const canonical = `${SITE_URL}${basePath}/${fm.slug}`
  const htmlPath = path.join(DIST, basePath.replace(/^\//, ''), `${fm.slug}.html`)
  if (!fs.existsSync(htmlPath)) {
    console.warn(`[seo-inject] missing HTML for ${fm.slug} at ${htmlPath}`)
    return false
  }
  const catLabel = CATEGORIES[fm.category]?.[locale] || fm.category
  const title = `${fm.title} | Bottamedi Frutta e Verdura`
  const description = fm.excerpt
  const ogImage = fm.cover?.src?.startsWith('http') ? fm.cover.src : `${SITE_URL}${fm.cover?.src || '/images/banchetto.webp'}`
  const alternates = {}
  if (fm.translations?.it) alternates.it = `${SITE_URL}/blog/${fm.translations.it}`
  if (fm.translations?.de) alternates.de = `${SITE_URL}/de/blog/${fm.translations.de}`
  alternates[locale] = alternates[locale] || canonical

  const jsonLdNodes = [
    {
      '@context': 'https://schema.org',
      '@graph': [
        organizationSchema(),
        breadcrumbSchema([
          { name: 'Home', url: locale === 'de' ? '/de' : '/' },
          { name: 'Blog', url: basePath },
          { name: catLabel, url: `${basePath}?categoria=${fm.category}` },
          { name: fm.title, url: `${basePath}/${fm.slug}` },
        ]),
        articleSchema(fm, readingTimeMin, wordCount, canonical),
      ],
    },
  ]

  const head = buildHeadBlock({
    title,
    description,
    canonical,
    ogImage,
    ogType: 'article',
    locale,
    publishedTime: fm.publishedAt,
    modifiedTime: fm.updatedAt || fm.publishedAt,
    author: fm.author?.name,
    articleSection: catLabel,
    articleTags: fm.tags,
    keywords: fm.seo?.keywords || fm.tags,
    jsonLdNodes,
    alternates,
  })

  const html = fs.readFileSync(htmlPath, 'utf8')
  const nextHtml = replaceHead(html, head)
  if (nextHtml !== html) {
    fs.writeFileSync(htmlPath, nextHtml, 'utf8')
    console.log(`[seo-inject] ✓ ${path.relative(DIST, htmlPath)}`)
    return true
  }
  return false
}

function processBlogIndex(locale) {
  const basePath = locale === 'de' ? '/de/blog' : '/blog'
  const htmlPath = path.join(DIST, locale === 'de' ? 'de/blog.html' : 'blog.html')
  if (!fs.existsSync(htmlPath)) return false
  const canonical = `${SITE_URL}${basePath}`
  const title = locale === 'de' ? 'Blog | Bottamedi Obst und Gemüse' : 'Blog | Bottamedi Frutta e Verdura'
  const description =
    locale === 'de'
      ? 'Blog Bottamedi: Saisonalität, Rezepte, Geschichten aus dem Gebiet Trentino, Guides HORECA für Restaurants und Hotels.'
      : 'Blog di Bottamedi: stagionalità, ricette, storie dal territorio, guide HORECA per ristoranti e hotel. Il punto di riferimento italiano sull\'ortofrutta.'
  const head = buildHeadBlock({
    title,
    description,
    canonical,
    ogType: 'website',
    locale,
    keywords: ['blog frutta verdura', 'ortofrutta italiana', 'ricette stagionali', 'HORECA guide'],
    jsonLdNodes: [
      {
        '@context': 'https://schema.org',
        '@graph': [
          organizationSchema(),
          breadcrumbSchema([
            { name: 'Home', url: locale === 'de' ? '/de' : '/' },
            { name: 'Blog', url: basePath },
          ]),
          { '@type': 'Blog', '@id': `${canonical}#blog`, name: 'Blog Bottamedi', description, inLanguage: locale === 'de' ? 'de-IT' : 'it-IT', publisher: { '@id': ORG_ID } },
        ],
      },
    ],
    alternates: { it: `${SITE_URL}/blog`, de: `${SITE_URL}/de/blog` },
  })
  const html = fs.readFileSync(htmlPath, 'utf8')
  fs.writeFileSync(htmlPath, replaceHead(html, head), 'utf8')
  console.log(`[seo-inject] ✓ ${path.relative(DIST, htmlPath)}`)
  return true
}

function processNotFound() {
  const htmlPath = path.join(DIST, '404.html')
  if (!fs.existsSync(htmlPath)) return false
  const head = buildHeadBlock({
    title: 'Pagina non trovata (404) | Bottamedi Frutta e Verdura',
    description: 'La pagina che cercavi non esiste o è stata spostata. Torna alla home o esplora il blog.',
    canonical: `${SITE_URL}/404`,
    ogType: 'website',
    locale: 'it',
    jsonLdNodes: [],
  })
  const headWithNoindex = head + '\n  <meta name="robots" content="noindex, nofollow">'
  const html = fs.readFileSync(htmlPath, 'utf8')
  // Flip any existing index/follow robots directive to noindex (replaceHead doesn't touch robots)
  const cleaned = html.replace(/<meta\s+name="robots"[^>]*>\s*/gi, '')
  fs.writeFileSync(htmlPath, replaceHead(cleaned, headWithNoindex), 'utf8')
  console.log(`[seo-inject] ✓ 404.html`)
  return true
}

function processHome(locale) {
  const htmlPath = path.join(DIST, locale === 'de' ? 'de.html' : 'index.html')
  if (!fs.existsSync(htmlPath)) return false
  const canonical = locale === 'de' ? `${SITE_URL}/de` : `${SITE_URL}/`
  const title =
    locale === 'de'
      ? 'Bottamedi Obst und Gemüse Mezzolombardo | HORECA Großhandel und Einzelhandel seit 1974'
      : 'Bottamedi Frutta e Verdura Mezzolombardo | Ingrosso HORECA e Dettaglio dal 1974'
  const description =
    locale === 'de'
      ? 'Bottamedi seit 1974 in Mezzolombardo: frisches Obst und Gemüse, über 150 saisonale Produkte. Einzelhandel Marktstand und HORECA Großhandel für Restaurants und Hotels in Südtirol.'
      : 'Bottamedi dal 1974 a Mezzolombardo: frutta e verdura fresca selezionata, oltre 150 referenze stagionali. Banchetto al dettaglio e ingrosso HORECA per ristoranti e hotel del Trentino Alto Adige.'
  const head = buildHeadBlock({
    title,
    description,
    canonical,
    ogType: 'business.business',
    locale,
    keywords: [
      'Bottamedi',
      'frutta e verdura Mezzolombardo',
      'ingrosso ortofrutta Trentino',
      'HORECA ristoranti Trentino Alto Adige',
      'fruttivendolo Mezzolombardo',
      'mele Melinda DOP',
      'km zero Trentino',
    ],
    jsonLdNodes: [
      {
        '@context': 'https://schema.org',
        '@graph': [
          organizationSchema(),
          breadcrumbSchema([{ name: 'Home', url: '/' }]),
        ],
      },
    ],
    alternates: { it: `${SITE_URL}/`, de: `${SITE_URL}/de` },
  })
  const html = fs.readFileSync(htmlPath, 'utf8')
  fs.writeFileSync(htmlPath, replaceHead(html, head), 'utf8')
  console.log(`[seo-inject] ✓ ${path.relative(DIST, htmlPath)}`)
  return true
}

function main() {
  if (!fs.existsSync(DIST)) {
    console.error('[seo-inject] dist/ not found — run build first')
    process.exit(1)
  }
  const posts = loadPosts()
  let updated = 0
  for (const p of posts) {
    if (processPost(p)) updated++
  }
  if (processHome('it')) updated++
  if (processHome('de')) updated++
  if (processBlogIndex('it')) updated++
  if (processBlogIndex('de')) updated++
  if (processNotFound()) updated++
  console.log(`[seo-inject] updated ${updated} file(s)`)
}

main()
