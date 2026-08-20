/**
 * Prerendering della SPA.
 *
 * Perche' serve: interrogando il sito con lo user-agent di Googlebot, l'HTML
 * servito conteneva 63 caratteri di testo e nessun H1. Tutto il contenuto
 * nasceva da JavaScript. Google esegue JS ma in una passata differita e con
 * budget limitato; Bing, i crawler social e i sistemi che alimentano gli
 * assistenti AI spesso non lo eseguono affatto.
 *
 * Cosa fa: apre il build in un browser headless, aspetta che React abbia
 * renderizzato, e riscrive dist/index.html con il DOM risultante. L'utente
 * riceve la stessa app (React fa hydration sul markup gia' presente), il
 * crawler riceve la pagina completa.
 *
 * Usa puppeteer-core con il Chrome gia' installato: nessun download di
 * Chromium in fase di build.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, resolve } from 'node:path'
import { readFile } from 'node:fs/promises'
import puppeteer from 'puppeteer-core'

const DIST = resolve('dist')
const PORT = 4183

const CHROME_CANDIDATES = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  process.env.CHROME_PATH,
  // Netlify e la maggior parte delle immagini CI Linux
  '/usr/bin/google-chrome-stable',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
  // Windows
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  // macOS
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean)

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.ico': 'image/x-icon',
}

function findChrome() {
  for (const p of CHROME_CANDIDATES) {
    if (p && existsSync(p)) return p
  }
  return null
}

/** Server statico minimale sul build: il prerender deve vedere il sito come in produzione. */
function serveDist() {
  return new Promise((res) => {
    const server = createServer(async (req, reply) => {
      try {
        const url = decodeURIComponent((req.url || '/').split('?')[0])
        let file = join(DIST, url === '/' ? 'index.html' : url)
        if (!existsSync(file) || url === '/') file = join(DIST, 'index.html')
        const body = await readFile(file)
        reply.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' })
        reply.end(body)
      } catch {
        reply.writeHead(404).end('not found')
      }
    })
    server.listen(PORT, () => res(server))
  })
}

async function main() {
  const chrome = findChrome()
  if (!chrome) {
    // Il build non deve fallire per questo: meglio un deploy senza prerender
    // che nessun deploy. Il messaggio resta visibile nel log.
    console.warn('[prerender] Chrome non trovato: salto il prerendering.')
    console.warn('[prerender] Percorsi provati:', CHROME_CANDIDATES.join(', '))
    process.exit(0)
  }

  const indexPath = join(DIST, 'index.html')
  if (!existsSync(indexPath)) {
    console.error('[prerender] dist/index.html assente: eseguire prima il build.')
    process.exit(1)
  }

  const server = await serveDist()
  const browser = await puppeteer.launch({
    executablePath: chrome,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 900 })

    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0', timeout: 90000 })

    // Le sezioni sono lazy e montano all'ingresso in viewport: senza scorrere
    // tutta la pagina il prerender catturerebbe solo la hero.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.75
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 220))
      }
      window.scrollTo(0, 0)
      await new Promise((r) => setTimeout(r, 400))
    })

    await new Promise((r) => setTimeout(r, 1200))

    const html = await page.content()

    // Sanity check: se il DOM catturato e' vuoto, meglio lasciare il file
    // originale che pubblicare una pagina rotta.
    const textLen = await page.evaluate(() => (document.body.innerText || '').trim().length)
    if (textLen < 500) {
      console.warn(`[prerender] contenuto troppo breve (${textLen} caratteri): mantengo l'index originale.`)
      process.exit(0)
    }

    writeFileSync(indexPath, html, 'utf8')
    const h1 = (html.match(/<h1/g) || []).length
    console.log(`[prerender] OK - ${textLen} caratteri di testo, ${h1} h1, ${(html.length / 1024).toFixed(0)}KB`)
  } finally {
    await browser.close()
    server.close()
  }
}

main().catch((e) => {
  console.error('[prerender] errore:', e.message)
  // non blocca il deploy
  process.exit(0)
})
