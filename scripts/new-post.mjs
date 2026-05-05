#!/usr/bin/env node
/**
 * Scaffolds a new blog post MDX file.
 *
 * Usage:
 *   npm run blog:new -- --title "Il mio post" --category stagionalita --locale it
 *   npm run blog:new -- --title "..." --slug custom-slug --tags mele,stagione,autunno
 *
 * All flags:
 *   --title       (required) Post title
 *   --slug        (optional) Override auto-generated slug
 *   --category    (required) One of: stagionalita|ricette|territorio|horeca|storie|sostenibilita|guide|news
 *   --locale      (optional, default=it) it|de
 *   --tags        (optional, comma-separated) defaults to category
 *   --excerpt     (optional) 60-200 chars description
 *   --cover       (optional) Cover image path (defaults to /images/banchetto.webp)
 *   --targetKeyword (optional) main SEO keyword
 *   --draft       (optional flag)
 *   --featured    (optional flag)
 *
 * Designed to be invoked by a Claude Code scheduled task.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const BLOG_DIR = path.join(ROOT, 'src', 'content', 'blog')

const VALID_CATEGORIES = [
  'stagionalita',
  'ricette',
  'territorio',
  'horeca',
  'storie',
  'sostenibilita',
  'guide',
  'news',
]

function parseArgs(argv) {
  const args = {}
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith('--')) {
      const key = a.slice(2)
      const next = argv[i + 1]
      if (!next || next.startsWith('--')) {
        args[key] = true
      } else {
        args[key] = next
        i++
      }
    }
  }
  return args
}

function slugify(s) {
  return s
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

function die(msg) {
  console.error(`[blog:new] ${msg}`)
  process.exit(1)
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const title = args.title
  if (!title || title === true) die('--title is required')
  const category = args.category
  if (!category || !VALID_CATEGORIES.includes(category)) {
    die(`--category required. One of: ${VALID_CATEGORIES.join(', ')}`)
  }
  const locale = args.locale === 'de' ? 'de' : 'it'
  const slug = typeof args.slug === 'string' ? slugify(args.slug) : slugify(title)
  const date = today()
  const tags = typeof args.tags === 'string' ? args.tags.split(',').map(t => t.trim()).filter(Boolean) : [category]
  const excerpt =
    typeof args.excerpt === 'string'
      ? args.excerpt
      : `Approfondimento ${title.toLowerCase()}: guida firmata Bottamedi, dal 1974 fruttivendoli a Mezzolombardo.`
  const cover = typeof args.cover === 'string' ? args.cover : '/images/banchetto.webp'
  const targetKeyword = typeof args.targetKeyword === 'string' ? args.targetKeyword : ''
  const draft = args.draft === true
  const featured = args.featured === true

  const fileName = `${date}-${slug}.mdx`
  const filePath = path.join(BLOG_DIR, fileName)
  if (fs.existsSync(filePath)) die(`file already exists: ${filePath}`)
  if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR, { recursive: true })

  const animation = typeof args.animation === 'string' ? args.animation : 'editorial'
  const mood = typeof args.mood === 'string' ? args.mood : 'spring'

  const frontmatter = [
    '---',
    `title: "${title.replace(/"/g, '\\"')}"`,
    `slug: "${slug}"`,
    `excerpt: "${excerpt.replace(/"/g, '\\"')}"`,
    `publishedAt: "${date}"`,
    `category: ${category}`,
    `tags: [${tags.map(t => `"${t}"`).join(', ')}]`,
    `locale: ${locale}`,
    `animation: ${animation}`,
    `mood: ${mood}`,
    'author:',
    '  name: "Famiglia Bottamedi"',
    '  role: "Fruttivendoli dal 1974"',
    'cover:',
    `  src: "${cover}"`,
    `  alt: "${title.replace(/"/g, '\\"')}"`,
    targetKeyword ? `targetKeyword: "${targetKeyword}"` : null,
    draft ? 'draft: true' : null,
    featured ? 'featured: true' : null,
    '---',
    '',
    '',
    '## Introduzione',
    '',
    `Scrivi qui l'introduzione. Menziona ${title.toLowerCase()} e aggancia alla realtà Bottamedi.`,
    '',
    '## Sezione chiave',
    '',
    'Contenuto utile con esempi concreti.',
    '',
    '<Callout type="tip">',
    '  Consiglio pratico da fruttivendoli con 50 anni di esperienza.',
    '</Callout>',
    '',
    '## Conclusione',
    '',
    `Ricapitola e invita all'azione.`,
    '',
    '<CTA href="/#wholesale">Scopri il servizio HORECA</CTA>',
    '',
  ]
    .filter(Boolean)
    .join('\n')

  fs.writeFileSync(filePath, frontmatter, 'utf8')
  console.log(`[blog:new] created ${path.relative(ROOT, filePath)}`)
  console.log(`[blog:new] slug: ${slug}`)
  console.log(`[blog:new] remember to: fill content, validate with 'npm run blog:validate', commit and push.`)
}

main()
