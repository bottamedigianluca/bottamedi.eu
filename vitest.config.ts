/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/components': resolve(__dirname, './src/components'),
      '@/sections': resolve(__dirname, './src/components/sections'),
      '@/layout': resolve(__dirname, './src/components/layout'),
      '@/legal': resolve(__dirname, './src/components/legal'),
      '@/ui': resolve(__dirname, './src/components/ui'),
      '@/blog': resolve(__dirname, './src/components/blog'),
      '@/seo': resolve(__dirname, './src/components/seo'),
      '@/pages': resolve(__dirname, './src/pages'),
      '@/lib': resolve(__dirname, './src/lib'),
      '@/utils': resolve(__dirname, './src/utils'),
      '@/hooks': resolve(__dirname, './src/hooks'),
      '@/content': resolve(__dirname, './src/content'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist'],
    css: false,
  },
})
