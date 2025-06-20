import React, { Component, ErrorInfo, ReactNode } from 'react'
import { motion } from 'framer-motion'

interface Props {
  children: ReactNode
  fallback?: React.ComponentType<ErrorBoundaryFallbackProps>
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  sectionName?: string
  level?: 'app' | 'section' | 'component'
  resetKeys?: Array<string | number>
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string
}

export interface ErrorBoundaryFallbackProps {
  error: Error
  errorInfo: ErrorInfo | null
  resetError: () => void
  sectionName?: string
  level?: 'app' | 'section' | 'component'
}

// 🚨 ENTERPRISE ERROR FALLBACK COMPONENTS
export const AppLevelErrorFallback: React.FC<ErrorBoundaryFallbackProps> = ({ 
  error, 
  resetError 
}) => (
  <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-red-200"
    >
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-3xl">⚠️</span>
      </div>
      
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Errore Critico dell'Applicazione
      </h1>
      
      <p className="text-gray-600 mb-6 leading-relaxed">
        Si è verificato un problema tecnico critico. L'applicazione verrà riavviata automaticamente per risolvere il problema.
      </p>
      
      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={resetError}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          🔄 Riavvia Applicazione
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.location.reload()}
          className="w-full bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all duration-300"
        >
          🌐 Ricarica Pagina
        </motion.button>
      </div>
      
      {/* Contact Support */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500 mb-2">
          Problema persistente?
        </p>
        <a
          href="mailto:bottamedipierluigi@virgilio.it?subject=Errore%20Sito%20Web&body=Si%20è%20verificato%20un%20errore%20critico"
          className="text-sm text-green-600 hover:text-green-700 underline"
        >
          📧 Contatta il Support Tecnico
        </a>
      </div>
      
      {/* Debug info per sviluppo */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4 text-left">
          <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
            🔧 Dettagli Errore (Development)
          </summary>
          <pre className="text-xs text-red-600 mt-2 bg-red-50 p-3 rounded-lg overflow-auto max-h-32 border border-red-200">
            {error.message}
            {error.stack && '\n\nStack:\n' + error.stack}
          </pre>
        </details>
      )}
    </motion.div>
  </div>
)

export const SectionLevelErrorFallback: React.FC<ErrorBoundaryFallbackProps> = ({ 
  error, 
  resetError, 
  sectionName = 'Sezione' 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl mx-4 my-8"
  >
    <div className="text-center p-8 max-w-lg">
      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">⚠️</span>
      </div>
      
      <h3 className="text-xl font-bold text-yellow-900 mb-3">
        Errore nella {sectionName}
      </h3>
      
      <p className="text-yellow-700 mb-4 leading-relaxed">
        Si è verificato un problema in questa sezione. Il resto del sito funziona normalmente.
      </p>
      
      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={resetError}
          className="bg-yellow-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors duration-200"
        >
          🔄 Riprova Sezione
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            const nextSection = document.querySelector('[id*="section"]:not([id*="' + sectionName + '"])')
            if (nextSection) {
              nextSection.scrollIntoView({ behavior: 'smooth' })
            }
          }}
          className="ml-3 bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-500 transition-colors duration-200"
        >
          ⏭️ Salta Sezione
        </motion.button>
      </div>
      
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4 text-left">
          <summary className="text-xs text-yellow-600 cursor-pointer">
            🔧 Debug Info
          </summary>
          <pre className="text-xs text-yellow-700 mt-2 bg-yellow-50 p-2 rounded overflow-auto max-h-24 border border-yellow-300">
            Sezione: {sectionName}
            {'\n'}Errore: {error.message}
          </pre>
        </details>
      )}
    </div>
  </motion.div>
)

export const ComponentLevelErrorFallback: React.FC<ErrorBoundaryFallbackProps> = ({ 
  error, 
  resetError, 
  sectionName = 'Componente' 
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 m-4"
  >
    <div className="text-center">
      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <span className="text-lg">🔧</span>
      </div>
      
      <h4 className="text-lg font-semibold text-blue-900 mb-2">
        {sectionName} Temporaneamente Non Disponibile
      </h4>
      
      <p className="text-blue-700 text-sm mb-4">
        Questo componente ha riscontrato un problema tecnico.
      </p>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={resetError}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors duration-200"
      >
        🔄 Ricarica Componente
      </motion.button>
    </div>
  </motion.div>
)

// 🎯 ENTERPRISE ERROR BOUNDARY CLASS
export class EnterpriseErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: number | null = null

  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: this.generateErrorId()
    }
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // 🎯 ENTERPRISE ERROR LOGGING
    this.logError(error, errorInfo)

    // Callback custom
    this.props.onError?.(error, errorInfo)

    // 🚀 AUTO-RECOVERY MECHANISM
    if (this.props.level === 'component') {
      this.scheduleAutoRecovery()
    }
  }

  private logError(error: Error, errorInfo: ErrorInfo) {
    const errorData = {
      errorId: this.state.errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      sectionName: this.props.sectionName,
      level: this.props.level,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }

    // Console logging
    console.group(`🚨 Enterprise Error Boundary - ${this.props.level?.toUpperCase()}`)
    console.error('Error ID:', errorData.errorId)
    console.error('Section:', this.props.sectionName)
    console.error('Error:', error)
    console.error('Component Stack:', errorInfo.componentStack)
    console.groupEnd()

    // Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'error_boundary_triggered', {
        event_category: 'Error Boundaries',
        event_label: `${this.props.level}_${this.props.sectionName || 'unknown'}`,
        custom_parameter_1: error.message,
        custom_parameter_2: this.props.level || 'unknown',
        custom_parameter_3: this.state.errorId,
        value: this.props.level === 'app' ? 100 : this.props.level === 'section' ? 50 : 25
      })
    }

    // Store error for potential reporting
    try {
      const errors = JSON.parse(localStorage.getItem('bottamedi_errors') || '[]')
      errors.push(errorData)
      
      // Keep only last 10 errors
      if (errors.length > 10) {
        errors.splice(0, errors.length - 10)
      }
      
      localStorage.setItem('bottamedi_errors', JSON.stringify(errors))
    } catch (storageError) {
      console.warn('Could not store error data:', storageError)
    }
  }

  private scheduleAutoRecovery() {
    // Auto-recovery dopo 5 secondi per componenti
    this.resetTimeoutId = window.setTimeout(() => {
      console.log(`🔄 Auto-recovery per ${this.props.sectionName}`)
      this.resetError()
    }, 5000)
  }

  componentDidUpdate(prevProps: Props) {
    const { resetKeys } = this.props
    
    if (this.state.hasError && prevProps.resetKeys !== resetKeys) {
      if (resetKeys?.some((resetKey, idx) => resetKey !== prevProps.resetKeys?.[idx])) {
        this.resetError()
      }
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId)
    }
  }

  resetError = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId)
      this.resetTimeoutId = null
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: this.generateErrorId()
    })

    // Track recovery
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'error_boundary_reset', {
        event_category: 'Error Recovery',
        event_label: `${this.props.level}_${this.props.sectionName || 'unknown'}`,
        custom_parameter_1: 'manual_reset',
        custom_parameter_2: this.props.level || 'unknown',
        value: 1
      })
    }
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || this.getDefaultFallback()
      
      return (
        <FallbackComponent
          error={this.state.error!}
          errorInfo={this.state.errorInfo}
          resetError={this.resetError}
          sectionName={this.props.sectionName}
          level={this.props.level}
        />
      )
    }

    return this.props.children
  }

  private getDefaultFallback() {
    switch (this.props.level) {
      case 'app':
        return AppLevelErrorFallback
      case 'section':
        return SectionLevelErrorFallback
      case 'component':
        return ComponentLevelErrorFallback
      default:
        return SectionLevelErrorFallback
    }
  }
}

// 🎯 CONVENIENCE WRAPPERS
export const AppErrorBoundary: React.FC<{
  children: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}> = ({ children, onError }) => (
  <EnterpriseErrorBoundary level="app" onError={onError}>
    {children}
  </EnterpriseErrorBoundary>
)

export const SectionErrorBoundary: React.FC<{
  children: ReactNode
  sectionName: string
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}> = ({ children, sectionName, onError }) => (
  <EnterpriseErrorBoundary level="section" sectionName={sectionName} onError={onError}>
    {children}
  </EnterpriseErrorBoundary>
)

export const ComponentErrorBoundary: React.FC<{
  children: ReactNode
  componentName: string
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}> = ({ children, componentName, onError }) => (
  <EnterpriseErrorBoundary level="component" sectionName={componentName} onError={onError}>
    {children}
  </EnterpriseErrorBoundary>
)

// 🔧 UTILITY HOOKS
export const useErrorHandler = () => {
  const handleError = React.useCallback((error: Error, errorInfo?: { componentStack?: string }) => {
    console.error('🚨 Handled Error:', error)
    
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'handled_error', {
        event_category: 'Handled Errors',
        event_label: error.message,
        custom_parameter_1: error.name,
        custom_parameter_2: 'handled_gracefully',
        value: 1
      })
    }
  }, [])

  return { handleError }
}

// 🎯 ERROR REPORTING UTILITIES
export const getStoredErrors = (): any[] => {
  try {
    return JSON.parse(localStorage.getItem('bottamedi_errors') || '[]')
  } catch {
    return []
  }
}

export const clearStoredErrors = (): void => {
  try {
    localStorage.removeItem('bottamedi_errors')
  } catch (error) {
    console.warn('Could not clear stored errors:', error)
  }
}

export const reportErrorsToSupport = async (): Promise<boolean> => {
  try {
    const errors = getStoredErrors()
    if (errors.length === 0) return true

    // In un ambiente reale, questo invierebbe gli errori a un servizio di logging
    console.log('📤 Reporting errors to support:', errors)
    
    // Simula invio
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    clearStoredErrors()
    return true
  } catch {
    return false
  }
}

export default EnterpriseErrorBoundary
