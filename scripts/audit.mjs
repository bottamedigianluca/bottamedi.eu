/**
 * Audit Lighthouse in locale sul build di produzione.
 * Stesse condizioni di PageSpeed: Moto G Power emulato, 4G lento.
 */
import { createServer } from 'node:http'
import { existsSync, writeFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { extname, join, resolve } from 'node:path'
import puppeteer from 'puppeteer'
import lighthouse from 'lighthouse'

const DIST = resolve('dist')
const PORT = 4199
const MIME = {
  '.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css',
  '.json':'application/json','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg',
  '.svg':'image/svg+xml','.woff2':'font/woff2','.mp4':'video/mp4','.xml':'application/xml',
  '.txt':'text/plain','.ico':'image/x-icon','.md':'text/markdown',
}

const server = createServer(async (req, reply) => {
  try {
    const url = decodeURIComponent((req.url || '/').split('?')[0])
    let file = join(DIST, url === '/' ? 'index.html' : url)
    if (!existsSync(file)) file = join(DIST, 'index.html')
    const body = await readFile(file)
    const type = MIME[extname(file)] || 'application/octet-stream'
    // Netlify serve i video con supporto Range: senza, il video in loop
    // riscarica l'intero file a ogni ciclo e la misura risulta falsata.
    const range = req.headers.range
    if (range && /^bytes=/.test(range)) {
      const [s0, s1] = range.replace('bytes=', '').split('-')
      const start = Number(s0) || 0
      const end = s1 ? Number(s1) : body.length - 1
      reply.writeHead(206, {
        'Content-Type': type,
        'Content-Range': `bytes ${start}-${end}/${body.length}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': end - start + 1,
      })
      return reply.end(body.subarray(start, end + 1))
    }
    reply.writeHead(200, { 'Content-Type': type, 'Accept-Ranges': 'bytes' })
    reply.end(body)
  } catch { reply.writeHead(404).end() }
})
await new Promise(r => server.listen(PORT, r))

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] })
const result = await lighthouse(`http://localhost:${PORT}/`, {
  port: Number(new URL(browser.wsEndpoint()).port),
  output: 'json',
  logLevel: 'error',
  onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
  formFactor: 'mobile',
  screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75 },
  throttling: { rttMs: 150, throughputKbps: 1638, cpuSlowdownMultiplier: 4 },
})

const lhr = result.lhr
console.log('\n=== PUNTEGGI ===')
for (const [k, v] of Object.entries(lhr.categories)) {
  console.log(`  ${v.title.padEnd(16)} ${Math.round(v.score * 100)}`)
}
console.log('\n=== METRICHE ===')
for (const id of ['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','speed-index']) {
  const a = lhr.audits[id]
  if (a) console.log(`  ${a.title.padEnd(28)} ${a.displayValue}`)
}
console.log('\n=== OPPORTUNITA (>50ms o >20KB) ===')
for (const a of Object.values(lhr.audits)) {
  if (a.score !== null && a.score < 0.9 && a.details?.overallSavingsMs > 50) {
    console.log(`  ${Math.round(a.details.overallSavingsMs)}ms  ${a.title}`)
  } else if (a.details?.overallSavingsBytes > 20480) {
    console.log(`  ${Math.round(a.details.overallSavingsBytes/1024)}KB  ${a.title}`)
  }
}
console.log('\n=== ELEMENTO LCP ===')
const lcpEl = lhr.audits['largest-contentful-paint-element']
if (lcpEl?.details?.items?.[0]?.items?.[0]) {
  console.log(' ', (lcpEl.details.items[0].items[0].node?.snippet || '').slice(0,140))
}
writeFileSync('lighthouse-report.json', JSON.stringify(lhr))
await browser.close()
server.close()
