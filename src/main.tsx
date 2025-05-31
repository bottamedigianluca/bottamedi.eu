import React, { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { MotionConfig } from 'framer-motion'
import './index.css'

// Lazy load the main App component
const App = React.lazy(() => import('./App'))

// Performance optimized loading component
const LoadingFallback = () => (
  <div className="fixed inset-0 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
      </div>
    </div>
  </div>
)

// Get the root element
const container = document.getElementById('root')
if (!container) throw new Error('Failed to find the root element')

// Create root with concurrent features
const root = createRoot(container)

// Render with performance optimizations
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <MotionConfig
        transition={{
          type: "tween",
          duration: 0.3,
          ease: "easeOut"
        }}
        reducedMotion="user"
      >
        <Suspense fallback={<LoadingFallback />}>
          <App />
        </Suspense>
      </MotionConfig>
    </HelmetProvider>
  </React.StrictMode>
)