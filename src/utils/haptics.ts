import React from 'react'

// utils/haptics.ts - Sistema Haptic Feedback Avanzato per Bottamedi

interface HapticPattern {
  pattern: number[]
  description: string
}

class HapticManager {
  private isSupported: boolean = false
  private isEnabled: boolean = true
  private lastTrigger: number = 0
  private minInterval: number = 50 // Minimo 50ms tra feedback
  
  private patterns: Record<string, HapticPattern> = {
    // 🎯 FEEDBACK LEGGERI (1-20ms)
    tap: {
      pattern: [15],
      description: 'Tap leggero per link e elementi cliccabili'
    },
    
    // 🎯 FEEDBACK MEDI (20-50ms)
    button: {
      pattern: [30, 10, 25],
      description: 'Pressione bottone principale - FEEDBACK SOLIDO'
    },
    toggle: {
      pattern: [25, 15, 35],
      description: 'Toggle switch, menu, cambio stato'
    },
    scroll: {
      pattern: [12],
      description: 'Bordi scroll e boundaries'
    },
    
    // 🎯 FEEDBACK FORTI (50-100ms)
    success: {
      pattern: [40, 20, 15, 20, 45],
      description: 'Azione completata con successo'
    },
    error: {
      pattern: [60, 60, 60],
      description: 'Errore, azione fallita'
    },
    warning: {
      pattern: [35, 80, 35],
      description: 'Attenzione, conferma richiesta'
    },
    
    // 🎯 FEEDBACK SPECIALI
    notification: {
      pattern: [20, 40, 15, 40, 25],
      description: 'Notifica importante o benvenuto'
    },
    heartbeat: {
      pattern: [25, 30, 45, 30, 25],
      description: 'Feedback ritmico per loading'
    },
    impact: {
      pattern: [50, 30, 20],
      description: 'Impatto forte per azioni critiche'
    },
    
    // 🎯 FEEDBACK DOCK MOBILE
    dock_open: {
      pattern: [20, 15, 30],
      description: 'Apertura dock mobile'
    },
    dock_close: {
      pattern: [30, 15, 20],
      description: 'Chiusura dock mobile'
    },
    navigation: {
      pattern: [25, 10, 25],
      description: 'Navigazione tra sezioni'
    },
    
    // 🎯 FEEDBACK FORM E INTERAZIONI
    form_submit: {
      pattern: [35, 25, 15, 25, 40],
      description: 'Invio form o email'
    },
    phone_call: {
      pattern: [30, 20, 30, 20, 30],
      description: 'Apertura chiamata telefonica'
    },
    email_open: {
      pattern: [25, 20, 35],
      description: 'Apertura client email'
    }
  }
    selection: {
      pattern: [20],
      description: 'Selezione elemento o focus input'
    },
    tick: {
      pattern: [8],
      description: 'Feedback micro per hover e stati'
    },// utils/haptics.ts - Sistema Haptic Feedback Avanzato per Bottamedi

interface HapticPattern {
  pattern: number[]
  description: string
}

class HapticManager {
  private isSupported: boolean = false
  private isEnabled: boolean = true
  private lastTrigger: number = 0
  private minInterval: number = 50 // Minimo 50ms tra feedback
  
  private patterns: Record<string, HapticPattern> = {
    // 🎯 FEEDBACK LEGGERI (1-20ms)
    tap: {
      pattern: [15],
      description: 'Tap leggero per link e elementi cliccabili'
    },
    selection: {
      pattern: [20],
      description: 'Selezione elemento o focus input'
    },
    tick: {
      pattern: [8],
      description: 'Feedback micro per hover e stati'
    },
    
    // 🎯 FEEDBACK MEDI (20-50ms)
    button: {
      pattern: [30, 10, 25],
      description: 'Pressione bottone principale - FEEDBACK SOLIDO'
    },
    toggle: {
      pattern: [25, 15, 35],
      description: 'Toggle switch, menu, cambio stato'
    },
    scroll: {
      pattern: [12],
      description: 'Bordi scroll e boundaries'
    },
    
    // 🎯 FEEDBACK FORTI (50-100ms)
    success: {
      pattern: [40, 20, 15, 20, 45],
      description: 'Azione completata con successo'
    },
    error: {
      pattern: [60, 60, 60],
      description: 'Errore, azione fallita'
    },
    warning: {
      pattern: [35, 80, 35],
      description: 'Attenzione, conferma richiesta'
    },
    
    // 🎯 FEEDBACK SPECIALI
    notification: {
      pattern: [20, 40, 15, 40, 25],
      description: 'Notifica importante o benvenuto'
    },
    heartbeat: {
      pattern: [25, 30, 45, 30, 25],
      description: 'Feedback ritmico per loading'
    },
    impact: {
      pattern: [50, 30, 20],
      description: 'Impatto forte per azioni critiche'
    },
    
    // 🎯 FEEDBACK DOCK MOBILE
    dock_open: {
      pattern: [20, 15, 30],
      description: 'Apertura dock mobile'
    },
    dock_close: {
      pattern: [30, 15, 20],
      description: 'Chiusura dock mobile'
    },
    navigation: {
      pattern: [25, 10, 25],
      description: 'Navigazione tra sezioni'
    },
    
    // 🎯 FEEDBACK FORM E INTERAZIONI
    form_submit: {
      pattern: [35, 25, 15, 25, 40],
      description: 'Invio form o email'
    },
    phone_call: {
      pattern: [30, 20, 30, 20, 30],
      description: 'Apertura chiamata telefonica'
    },
    email_open: {
      pattern: [25, 20, 35],
      description: 'Apertura client email'
    }
  }

  constructor() {
    this.initialize()
  }

  private initialize(): void {
    this.checkSupport()
    this.testCapabilities()
  }

  private checkSupport(): void {
    // Verifica supporto base
    this.isSupported = 'vibrate' in navigator && typeof navigator.vibrate === 'function'
    
    if (!this.isSupported) {
      console.info('🎯 Haptic: Vibration API non supportata su questo dispositivo')
      return
    }

    // Test più approfondito
    try {
      // Test silenzioso per verificare se l'API è davvero funzionante
      const testResult = navigator.vibrate(0)
      if (testResult === false) {
        this.isSupported = false
        console.warn('🎯 Haptic: Vibration API bloccata o non funzionante')
      }
    } catch (error) {
      this.isSupported = false
      console.warn('🎯 Haptic: Errore durante il test dell\'API:', error)
    }
  }

  private testCapabilities(): void {
    if (!this.isSupported) return

    // Test ritardato per evitare blocco all'avvio
    setTimeout(() => {
      this.trigger('notification')
      console.log('🎯 Haptic Feedback System ATTIVO! Patterns disponibili:', Object.keys(this.patterns).length)
    }, 1500)
  }

  public trigger(type: keyof typeof this.patterns): boolean {
    // Controlli preliminari
    if (!this.isSupported || !this.isEnabled) {
      return false
    }

    // Rate limiting per evitare spam
    const now = Date.now()
    if (now - this.lastTrigger < this.minInterval) {
      return false
    }

    const pattern = this.patterns[type]
    if (!pattern) {
      console.warn(`🎯 Haptic: Pattern "${type}" non trovato`)
      return false
    }

    try {
      const success = navigator.vibrate(pattern.pattern)
      if (success) {
        this.lastTrigger = now
        // Debug solo in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`🎯 Haptic: ${type} - ${pattern.description}`)
        }
      }
      return success
    } catch (error) {
      console.warn('🎯 Haptic: Errore durante trigger:', error)
      return false
    }
  }

  public triggerCustom(pattern: number[]): boolean {
    if (!this.isSupported || !this.isEnabled || !Array.isArray(pattern)) {
      return false
    }

    // Validazione pattern
    if (pattern.length === 0 || pattern.some(p => typeof p !== 'number' || p < 0 || p > 1000)) {
      console.warn('🎯 Haptic: Pattern custom non valido')
      return false
    }

    try {
      const success = navigator.vibrate(pattern)
      if (success) {
        this.lastTrigger = Date.now()
      }
      return success
    } catch (error) {
      console.warn('🎯 Haptic: Errore durante custom trigger:', error)
      return false
    }
  }

  public stop(): void {
    if (this.isSupported) {
      try {
        navigator.vibrate(0)
      } catch (error) {
        console.warn('🎯 Haptic: Errore durante stop:', error)
      }
    }
  }

  public enable(): void {
    this.isEnabled = true
    console.log('🎯 Haptic: Sistema abilitato')
  }

  public disable(): void {
    this.isEnabled = false
    this.stop()
    console.log('🎯 Haptic: Sistema disabilitato')
  }

  public getSupport(): boolean {
    return this.isSupported
  }

  public getEnabled(): boolean {
    return this.isEnabled
  }

  public getPatterns(): Record<string, HapticPattern> {
    return { ...this.patterns }
  }

  public addPattern(name: string, pattern: number[], description: string): boolean {
    if (!Array.isArray(pattern) || pattern.some(p => typeof p !== 'number' || p < 0)) {
      return false
    }

    this.patterns[name] = { pattern, description }
    return true
  }

  public getStats(): {
    supported: boolean
    enabled: boolean
    patternCount: number
    lastTrigger: number
  } {
    return {
      supported: this.isSupported,
      enabled: this.isEnabled,
      patternCount: Object.keys(this.patterns).length,
      lastTrigger: this.lastTrigger
    }
  }
}

// 🎯 ISTANZA GLOBALE SINGLETON
export const haptic = new HapticManager()

// 🎯 HOOK PER SCROLL HAPTIC CON DEBOUNCE
export const triggerHapticOnScroll = (): (() => void) => {
  let lastScrollY = 0
  let ticking = false
  let lastBoundaryTrigger = 0
  const boundaryDelay = 500 // 500ms tra trigger boundaries

  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY
        const windowHeight = window.innerHeight
        const documentHeight = document.documentElement.scrollHeight
        const now = Date.now()

        // Haptic ai bordi con debounce
        if (currentScrollY <= 5 && lastScrollY > 5) {
          // Top boundary
          if (now - lastBoundaryTrigger > boundaryDelay) {
            haptic.trigger('scroll')
            lastBoundaryTrigger = now
          }
        } else if (currentScrollY + windowHeight >= documentHeight - 10 && 
                   lastScrollY + windowHeight < documentHeight - 10) {
          // Bottom boundary
          if (now - lastBoundaryTrigger > boundaryDelay) {
            haptic.trigger('scroll')
            lastBoundaryTrigger = now
          }
        }

        lastScrollY = currentScrollY
        ticking = false
      })
      ticking = true
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true })

  return () => {
    window.removeEventListener('scroll', handleScroll)
  }
}

// 🎯 HOOK PER SECTION CHANGES CON DEBOUNCE
export const triggerHapticOnSectionChange = (sectionIds: string[]): (() => void) => {
  const observers: IntersectionObserver[] = []
  let currentSection: string | null = null
  let lastSectionChange = 0
  const sectionDelay = 800 // 800ms tra cambi sezione

  sectionIds.forEach(sectionId => {
    const element = document.getElementById(sectionId)
    if (!element) {
      console.warn(`🎯 Haptic: Sezione "${sectionId}" non trovata per intersection observer`)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.target.id !== currentSection) {
            const now = Date.now()
            if (now - lastSectionChange > sectionDelay) {
              currentSection = entry.target.id
              haptic.trigger('navigation')
              lastSectionChange = now
              
              if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
                console.log(`🎯 Haptic: Navigazione verso sezione "${currentSection}"`)
              }
            }
          }
        })
      },
      {
        threshold: 0.6, // 60% visibile
        rootMargin: '-5% 0px -5% 0px'
      }
    )

    observer.observe(element)
    observers.push(observer)
  })

  return () => {
    observers.forEach(observer => observer.disconnect())
  }
}

// 🎯 UTILITY FUNCTIONS
export const withHaptic = <T extends any[]>(
  callback: (...args: T) => void, 
  hapticType: keyof typeof haptic.patterns = 'button'
) => {
  return (...args: T) => {
    haptic.trigger(hapticType)
    callback(...args)
  }
}

export const addHapticToElement = (
  element: HTMLElement, 
  hapticType: keyof typeof haptic.patterns = 'button',
  eventType: string = 'click'
): (() => void) => {
  const handler = (e: Event) => {
    // Evita haptic se l'elemento è disabilitato
    if (element.hasAttribute('disabled') || element.classList.contains('disabled')) {
      return
    }
    haptic.trigger(hapticType)
  }
  
  element.addEventListener(eventType, handler)
  
  return () => {
    element.removeEventListener(eventType, handler)
  }
}

// 🎯 REACT HOOK AVANZATO
export const useHaptic = () => {
  const trigger = (type: keyof typeof haptic.patterns) => {
    return haptic.trigger(type)
  }

  const triggerCustom = (pattern: number[]) => {
    return haptic.triggerCustom(pattern)
  }

  const stop = () => {
    haptic.stop()
  }

  const enable = () => {
    haptic.enable()
  }

  const disable = () => {
    haptic.disable()
  }

  const isSupported = haptic.getSupport()
  const isEnabled = haptic.getEnabled()

  return {
    trigger,
    triggerCustom,
    stop,
    enable,
    disable,
    isSupported,
    isEnabled,
    patterns: haptic.getPatterns(),
    stats: haptic.getStats()
  }
}

// 🎯 COMPONENTE REACT PER TESTING E DEBUG
export const HapticTestButton: React.FC<{
  type: keyof typeof haptic.patterns
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}> = ({ type, children, className = '', style = {} }) => {
  const handleClick = () => {
    const success = haptic.trigger(type)
    console.log(`🎯 Test Haptic "${type}": ${success ? 'SUCCESS' : 'FAILED'}`)
  }

  return (
    <button
      onClick={handleClick}
      className={`haptic-test-button ${className}`}
      style={{
        padding: '8px 16px',
        margin: '4px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        background: '#f5f5f5',
        cursor: 'pointer',
        ...style
      }}
      data-haptic-type={type}
      title={`Test haptic: ${haptic.getPatterns()[type]?.description || type}`}
    >
      {children}
    </button>
  )
}

// 🎯 PANNELLO DEBUG COMPLETO
export const HapticDebugPanel: React.FC<{
  visible?: boolean
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}> = ({ visible = false, position = 'bottom-right' }) => {
  const [isOpen, setIsOpen] = React.useState(visible)
  const stats = haptic.getStats()
  const patterns = haptic.getPatterns()

  if (!visible && !isOpen) return null

  const positionStyles = {
    'top-left': { top: '20px', left: '20px' },
    'top-right': { top: '20px', right: '20px' },
    'bottom-left': { bottom: '20px', left: '20px' },
    'bottom-right': { bottom: '20px', right: '20px' }
  }

  return (
    <div style={{
      position: 'fixed',
      ...positionStyles[position],
      zIndex: 10000,
      background: 'rgba(0,0,0,0.9)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '12px',
      fontFamily: 'monospace',
      maxWidth: '300px',
      maxHeight: '400px',
      overflow: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <strong>🎯 Haptic Debug</strong>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
        >
          {isOpen ? '−' : '+'}
        </button>
      </div>
      
      {isOpen && (
        <>
          <div style={{ marginBottom: '10px' }}>
            <div>Supportato: {stats.supported ? '✅' : '❌'}</div>
            <div>Abilitato: {stats.enabled ? '✅' : '❌'}</div>
            <div>Pattern: {stats.patternCount}</div>
            <div>Ultimo trigger: {stats.lastTrigger ? new Date(stats.lastTrigger).toLocaleTimeString() : 'Mai'}</div>
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <button 
              onClick={() => haptic.enable()}
              style={{ marginRight: '5px', padding: '4px 8px', fontSize: '10px' }}
            >
              Enable
            </button>
            <button 
              onClick={() => haptic.disable()}
              style={{ marginRight: '5px', padding: '4px 8px', fontSize: '10px' }}
            >
              Disable
            </button>
            <button 
              onClick={() => haptic.stop()}
              style={{ padding: '4px 8px', fontSize: '10px' }}
            >
              Stop
            </button>
          </div>
          
          <div style={{ maxHeight: '200px', overflow: 'auto' }}>
            <strong>Test Patterns:</strong>
            <div style={{ marginTop: '5px' }}>
              {Object.entries(patterns).map(([key, pattern]) => (
                <HapticTestButton
                  key={key}
                  type={key as keyof typeof patterns}
                  style={{ 
                    display: 'block', 
                    width: '100%', 
                    marginBottom: '2px',
                    padding: '4px 8px',
                    fontSize: '10px'
                  }}
                >
                  {key}
                </HapticTestButton>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// 🎯 ESPORTAZIONE DEFAULT
export default haptic

// 🎯 TYPES EXPORT
export type { HapticPattern }
export type HapticType = keyof typeof haptic.patterns
