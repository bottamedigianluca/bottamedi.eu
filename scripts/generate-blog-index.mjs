#!/usr/bin/env node
/**
 * Generates src/content/blog/_generated-index.json with all post frontmatter.
 * This avoids relying on import.meta.glob + ?raw at runtime (unreliable in SSR).
 * Run before `vite build`.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const BLOG_DIR = path.join(ROOT, 'src', 'content', 'blog')
const OUT = path.join(BLOG_DIR, '_generated-index.json')

function walk(dir) {
  const out = []
  if (!fs.existsSync(dir)) return out
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    const s = fs.statSync(p)
    if (s.isDirectory()) out.push(...walk(p))
    else if (name.endsWith('.mdx')) out.push(p)
  }
  return out
}

function main() {
  const entries = []
  for (const file of walk(BLOG_DIR)) {
    try {
      const raw = fs.readFileSync(file, 'utf8')
      const { data, content } = matter(raw)
      if (!data.slug || !data.title) continue
      if (data.draft === true) continue
      const rt = readingTime(content)
      entries.push({
        frontmatter: data,
        readingTimeMinutes: Math.max(1, Math.round(rt.minutes)),
        readingTimeText: rt.text,
        wordCount: rt.words,
        fileName: path.basename(file),
      })
    } catch (err) {
      console.warn(`[blog-index] skip ${file}: ${err.message}`)
    }
  }
  entries.sort((a, b) => (a.frontmatter.publishedAt < b.frontmatter.publishedAt ? 1 : -1))
  fs.writeFileSync(OUT, JSON.stringify(entries, null, 2) + '\n', 'utf8')
  console.log(`[blog-index] wrote ${entries.length} posts → ${path.relative(ROOT, OUT)}`)
}

main()
