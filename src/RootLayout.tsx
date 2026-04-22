import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { MotionConfig } from 'framer-motion'
import { EnterpriseErrorBoundary, AppLevelErrorFallback } from './components/common/ErrorBoundary'

const RootLayout: React.FC = () => {
  const location = useLocation()

  useEffect(() => {
    // Scroll to top on route change (except for hash anchors)
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }
  }, [location.pathname])

  return (
    <HelmetProvider>
      <MotionConfig transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }} reducedMotion="user">
        <EnterpriseErrorBoundary level="app" fallback={AppLevelErrorFallback}>
          <Outlet />
        </EnterpriseErrorBoundary>
      </MotionConfig>
    </HelmetProvider>
  )
}

export default RootLayout
