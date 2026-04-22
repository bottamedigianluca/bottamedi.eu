import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'
import fs from 'node:fs'
import matter from 'gray-matter'

// Collect all blog post paths for SSG pre-rendering
function collectBlogPaths(): { it: string[]; de: string[] } {
  const blogDir = resolve(__dirname, 'src/content/blog')
  const result: { it: string[]; de: string[] } = { it: [], de: [] }
  if (!fs.existsSync(blogDir)) return result
  const walk = (dir: string): string[] => {
    const out: string[] = []
    for (const name of fs.readdirSync(dir)) {
      const p = resolve(dir, name)
      const stat = fs.statSync(p)
      if (stat.isDirectory()) out.push(...walk(p))
      else if (name.endsWith('.mdx')) out.push(p)
    }
    return out
  }
  for (const file of walk(blogDir)) {
    try {
      const { data } = matter(fs.readFileSync(file, 'utf8'))
      if (data.draft === true) continue
      if (!data.slug) continue
      const locale = data.locale === 'de' ? 'de' : 'it'
      result[locale].push(data.slug)
    } catch {
      /* skip */
    }
  }
  return result
}

export default defineConfig({
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
        providerImportSource: '@mdx-js/react',
      }),
    },
    react({ tsDecorators: false }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.webp',
        'apple-touch-icon.webp',
        'robots.txt',
        'logo-bottamedi.webp',
      ],
      manifest: {
        name: 'Bottamedi Frutta e Verdura',
        short_name: 'Bottamedi',
        description: 'Frutta e verdura fresca a Mezzolombardo dal 1974. Banchetto dettaglio e ingrosso HORECA.',
        theme_color: '#22c55e',
        background_color: '#f0fdf4',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        lang: 'it-IT',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,webp,woff2}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//, /\.xml$/, /sitemap/, /rss/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|webp|avif|svg|gif)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            urlPattern: /\.(?:mp4|webm)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'video-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 30 },
              rangeRequests: true,
            },
          },
        ],
      },
    }),
  ],

  resolve: {
    // Single-prefix alias @ → src. More specific aliases conflict in Rollup build.
    // Code must import as "@/components/...", "@/lib/...", etc.
    alias: [
      { find: /^@\/(.*)$/, replacement: resolve(__dirname, './src') + '/$1' },
      { find: /^@$/, replacement: resolve(__dirname, './src') },
    ],
  },

  css: { postcss: './postcss.config.js' },

  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    minify: 'terser',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // manualChunks cannot include externals in SSR build — let Rollup auto-chunk
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log'],
      },
      mangle: true,
    },
    emptyOutDir: true,
    assetsDir: 'assets',
  },

  server: { port: 3000, host: true, cors: true, open: false },
  preview: { port: 4173, host: true },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'react-intersection-observer',
      'react-helmet-async',
      '@mdx-js/react',
    ],
  },

  ssr: {
    noExternal: ['framer-motion', 'react-helmet-async', '@mdx-js/react'],
  },

  // vite-react-ssg options
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    crittersOptions: false,
    includedRoutes(_paths: string[], _routes: unknown): string[] {
      const { it, de } = collectBlogPaths()
      const routes = [
        '/',
        '/de',
        '/blog',
        '/de/blog',
        '/404',
        ...it.map(slug => `/blog/${slug}`),
        ...de.map(slug => `/de/blog/${slug}`),
      ]
      return routes
    },
  },

  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  },
})
