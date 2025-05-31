// 🍎 HAPTIC SYSTEM CLASS
class HapticSystem {
  private isSupported: boolean
  private isEnabled: boolean

  constructor() {
    this.isSupported = 'vibrate' in navigator
    this.isEnabled = true
  }

  // 🍎 FEEDBACK PATTERNS STILE APPLE
  private patterns = {
    // Micro-interactions
    tap: [10],                    // Tap leggero
    button: [15],                 // Pressione bottone
    toggle: [12, 5, 8],          // Switch/toggle
    
    // Navigation
    navigation: [20],             // Navigazione
    swipe: [8, 5, 8],            // Swipe gesture
    scroll: [5],                  // Scroll snap
    
    // Actions
    success: [10, 10, 15],       // Successo
    error: [25, 15, 25],         // Errore
    warning: [20, 10, 20],       // Warning
    
    // Premium interactions
    slide: [8, 3, 8, 3, 12],     // Slider interaction
    impact: [30],                 // Heavy impact
    selection: [6],               // Selezione lista
    
    // Contextual
    call: [25, 15, 25, 15, 30],  // Chiamata telefono
    message: [15, 8, 15],        // Messaggio/notifica
    photo: [12],                  // Foto scattata
    
    // Advanced
    heartbeat: [20, 100, 20],    // Heartbeat effect
    pulse: [10, 50, 10, 50, 10], // Pulse effect
    bounce: [5, 10, 15, 10, 5]   // Bounce effect
  }

  // 🎯 TRIGGER HAPTIC FEEDBACK
  trigger(type: keyof typeof this.patterns, force: boolean = false) {
    if (!this.isSupported || (!this.isEnabled && !force)) return

    const pattern = this.patterns[type]
    if (pattern) {
      navigator.vibrate(pattern)
    }
  }

  // 🔧 UTILITY METHODS
  enable() {
    this.isEnabled = true
  }

  disable() {
    this.isEnabled = false
  }

  toggle() {
    this.isEnabled = !this.isEnabled
  }

  isHapticSupported() {
    return this.isSupported
  }

  isHapticEnabled() {
    return this.isEnabled
  }

  // 🍎 PRESET COMBINATIONS
  appleStyleTap() {
    this.trigger('tap')
  }

  appleStyleButton() {
    this.trigger('button')
  }

  appleStyleNavigation() {
    this.trigger('navigation')
  }

  appleStyleSuccess() {
    this.trigger('success')
  }

  appleStyleError() {
    this.trigger('error')
  }

  // 📱 CONTEXTUAL METHODS
  onButtonPress() {
    this.trigger('button')
  }

  onLinkClick() {
    this.trigger('tap')
  }

  onFormSubmit() {
    this.trigger('success')
  }

  onFormError() {
    this.trigger('error')
  }

  onToggleSwitch() {
    this.trigger('toggle')
  }

  onSliderMove() {
    this.trigger('slide')
  }

  onPhoneCall() {
    this.trigger('call')
  }

  onNavigation() {
    this.trigger('navigation')
  }

  onScrollSnap() {
    this.trigger('scroll')
  }

  onSelection() {
    this.trigger('selection')
  }

  onImageLoad() {
    this.trigger('photo')
  }

  onNotification() {
    this.trigger('message')
  }

  // 🎨 CUSTOM PATTERNS
  custom(pattern: number[]) {
    if (this.isSupported && this.isEnabled) {
      navigator.vibrate(pattern)
    }
  }

  // 🔄 SEQUENCE METHODS
  playSequence(types: (keyof typeof this.patterns)[], delay: number = 100) {
    types.forEach((type, index) => {
      setTimeout(() => this.trigger(type), index * delay)
    })
  }

  // 🍎 APPLE-SPECIFIC COMBINATIONS
  appleTapTapHold() {
    this.trigger('tap')
    setTimeout(() => this.trigger('tap'), 100)
    setTimeout(() => this.trigger('impact'), 200)
  }

  appleDoubleClick() {
    this.trigger('button')
    setTimeout(() => this.trigger('button'), 150)
  }

  appleLongPress() {
    this.trigger('tap')
    setTimeout(() => this.trigger('impact'), 500)
  }

  // 🚀 ADVANCED EFFECTS
  rippleEffect() {
    this.custom([5, 20, 10, 40, 15, 60, 20, 80])
  }

  drumRoll() {
    const pattern = Array.from({ length: 10 }, (_, i) => [5, 10]).flat()
    this.custom(pattern)
  }

  crescendo() {
    this.custom([5, 50, 10, 40, 15, 30, 20, 20, 25, 10, 30])
  }
}

// 🌍 GLOBAL INSTANCE
export const haptic = new HapticSystem()

// 🍎 REACT HOOK
export const useHaptic = () => {
  return {
    haptic,
    triggerTap: () => haptic.appleStyleTap(),
    triggerButton: () => haptic.appleStyleButton(),
    triggerNav: () => haptic.appleStyleNavigation(),
    triggerSuccess: () => haptic.appleStyleSuccess(),
    triggerError: () => haptic.appleStyleError(),
    triggerCall: () => haptic.onPhoneCall(),
    triggerCustom: (pattern: number[]) => haptic.custom(pattern)
  }
}

// 📱 UTILITY FUNCTIONS (NO JSX)
export const addHapticToElement = (element: HTMLElement, hapticType: keyof typeof haptic.patterns = 'button') => {
  element.addEventListener('click', () => {
    haptic.trigger(hapticType)
  })
}

export const addHapticToSelector = (selector: string, hapticType: keyof typeof haptic.patterns = 'button') => {
  document.querySelectorAll(selector).forEach(element => {
    addHapticToElement(element as HTMLElement, hapticType)
  })
}

// 🔄 UTILITY METHODS
export const triggerHapticOnCall = (phoneNumber: string) => {
  haptic.onPhoneCall()
  window.open(`tel:${phoneNumber}`, '_self')
}

export const triggerHapticOnMaps = (url: string) => {
  haptic.trigger('navigation')
  window.open(url, '_blank')
}

export const triggerHapticOnSubmit = (form: HTMLFormElement) => {
  form.addEventListener('submit', () => {
    haptic.trigger('success')
  })
}

export const triggerHapticOnScroll = () => {
  let lastScrollY = window.scrollY
  let isScrolling = false
  let scrollTimeout: NodeJS.Timeout

  const handleScroll = () => {
    const currentScrollY = window.scrollY
    const diff = Math.abs(currentScrollY - lastScrollY)

    if (diff > 200 && !isScrolling && window.innerWidth < 768) {
      haptic.trigger('scroll')
      isScrolling = true
      
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        isScrolling = false
      }, 300)
    }

    lastScrollY = currentScrollY
  }

  if (window.innerWidth < 768) {
    window.addEventListener('scroll', handleScroll, { passive: true })
  }

  return () => {
    window.removeEventListener('scroll', handleScroll)
    clearTimeout(scrollTimeout)
  }
}

export const triggerHapticOnSectionChange = (sectionIds: string[]) => {
  const observers = sectionIds.map(id => {
    const element = document.getElementById(id)
    if (!element) return null

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && window.innerWidth < 768) {
          haptic.trigger('navigation')
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(element)
    return observer
  }).filter(Boolean)

  return () => {
    observers.forEach(observer => observer?.disconnect())
  }
}

export default haptic