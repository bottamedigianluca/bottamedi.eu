import { defineConfig } from ‘vite’
import react from ‘@vitejs/plugin-react-swc’
import { resolve } from ‘path’

// https://vitejs.dev/config/
export default defineConfig({
plugins: [react()],

// Path aliases
resolve: {
alias: {
‘@’: resolve(__dirname, ‘./src’),
‘@/components’: resolve(__dirname, ‘./src/components’),
‘@/sections’: resolve(__dirname, ‘./src/components/sections’),
‘@/layout’: resolve(__dirname, ‘./src/components/layout’),
‘@/legal’: resolve(__dirname, ‘./src/components/legal’),
‘@/ui’: resolve(__dirname, ‘./src/components/ui’),
‘@/types’: resolve(__dirname, ‘./src/components/types’)
}
},

// Build optimizations
build: {
target: ‘es2020’,
cssCodeSplit: true,
sourcemap: false,
minify: ‘terser’,
rollupOptions: {
output: {
manualChunks: {
vendor: [‘react’, ‘react-dom’],
animations: [‘framer-motion’],
utils: [‘react-intersection-observer’]
}
}
}
},

// Dev server
server: {
port: 3000,
host: true,
cors: true
},

// Optimizations
optimizeDeps: {
include: [
‘react’,
‘react-dom’,
‘framer-motion’,
‘react-intersection-observer’
]
}

// ❌ RIMOSSO: CSS config con dynamic require
// css: {
//   postcss: {
//     plugins: [
//       require(‘tailwindcss’),    // ← QUESTO CAUSAVA IL PROBLEMA
//       require(‘autoprefixer’)
//     ]
//   }
// }
})