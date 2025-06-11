import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Path aliases
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/components': resolve(__dirname, './src/components'),
      '@/sections': resolve(__dirname, './src/components/sections'),
      '@/layout': resolve(__dirname, './src/components/layout'),
      '@/legal': resolve(__dirname, './src/components/legal'),
      '@/ui': resolve(__dirname, './src/components/ui'),
      '@/types': resolve(__dirname, './src/components/types'),
      '@/utils': resolve(__dirname, './src/utils'),
      '@/hooks': resolve(__dirname, './src/hooks')
    }
  },

  // CSS Processing
  css: {
    postcss: './postcss.config.js'
  },

  // Build optimizations per Netlify
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    minify: 'terser',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      plugins: [],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animations: ['framer-motion'],
          utils: ['react-intersection-observer']
        },
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log']
      },
      mangle: true
    },
    // Ottimizzazioni specifiche per Netlify
    emptyOutDir: true,
    assetsDir: 'assets'
  },

  // Dev server
  server: {
    port: 3000,
    host: true,
    cors: true,
    open: true
  },

  // Preview server
  preview: {
    port: 4173,
    host: true
  },

  // Optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'framer-motion',
      'react-intersection-observer',
      'core-js'
    ]
  },

  // Define global constants
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development')
  }
})
