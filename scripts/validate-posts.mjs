#!/usr/bin/env node
/**
 * Validates all blog post frontmatter matches the Zod schema.
 * Exits with non-zero code if any post is invalid (used in CI).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

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

function validate(data, file) {
  const errors = []
  if (!data.title || data.title.length < 10 || data.title.length > 90) errors.push('title length 10-90')
  if (!data.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) errors.push('slug must be kebab-case')
  if (!data.excerpt || data.excerpt.length < 60 || data.excerpt.length > 200) errors.push('excerpt length 60-200')
  if (!data.publishedAt || !/^\d{4}-\d{2}-\d{2}$/.test(data.publishedAt)) errors.push('publishedAt must be YYYY-MM-DD')
  if (!data.category || !VALID_CATEGORIES.includes(data.category))
    errors.push(`category must be one of ${VALID_CATEGORIES.join(', ')}`)
  if (!Array.isArray(data.tags) || data.tags.length < 1 || data.tags.length > 8)
    errors.push('tags must be 1-8 entries')
  if (data.locale && !['it', 'de'].includes(data.locale)) errors.push('locale must be it or de')
  if (!data.cover || typeof data.cover !== 'object') errors.push('cover required (src, alt)')
  else {
    if (!data.cover.src) errors.push('cover.src required')
    if (!data.cover.alt || data.cover.alt.length < 5) errors.push('cover.alt >= 5 chars')
  }
  return errors
}

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    const s = fs.statSync(p)
    if (s.isDirectory()) walk(p, acc)
    else if (name.endsWith('.mdx')) acc.push(p)
  }
  return acc
}

function main() {
  const files = walk(BLOG_DIR)
  if (files.length === 0) {
    console.log('[validate-posts] no posts found (ok)')
    return
  }
  let failed = 0
  const slugs = new Map()
  for (const file of files) {
    try {
      const raw = fs.readFileSync(file, 'utf8')
      const { data } = matter(raw)
      const errs = validate(data, file)
      const key = `${data.locale || 'it'}:${data.slug}`
      if (slugs.has(key)) errs.push(`duplicate slug for locale: ${key}`)
      else slugs.set(key, file)
      if (errs.length > 0) {
        failed++
        console.error(`✖ ${path.relative(ROOT, file)}`)
        for (const e of errs) console.error(`  - ${e}`)
      } else {
        console.log(`✓ ${path.relative(ROOT, file)}`)
      }
    } catch (err) {
      failed++
      console.error(`✖ ${path.relative(ROOT, file)}: ${err.message}`)
    }
  }
  if (failed > 0) {
    console.error(`[validate-posts] ${failed} post(s) invalid`)
    process.exit(1)
  }
  console.log(`[validate-posts] all ${files.length} post(s) valid`)
}

main()
