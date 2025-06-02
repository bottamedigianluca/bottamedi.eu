// utils/haptics.ts - Sistema Haptic Feedback per Bottamedi

interface HapticPattern {
  pattern: number[];
  description: string;
}

class HapticManager {
  private isSupported: boolean = false;
  private isEnabled: boolean = true;
  private lastTrigger: number = 0;
  private minInterval: number = 50;
  
  private patterns: Record<string, HapticPattern> = {
    // Feedback leggeri
    tap: {
      pattern: [15],
      description: 'Tap leggero'
    },
    selection: {
      pattern: [20],
      description: 'Selezione elemento'
    },
    
    // Feedback medi - SOLIDI
    button: {
      pattern: [30, 10, 25],
      description: 'Pressione bottone - FEEDBACK SOLIDO'
    },
    toggle: {
      pattern: [25, 15, 35],
      description: 'Toggle menu'
    },
    scroll: {
      pattern: [12],
      description: 'Bordi scroll'
    },
    
    // Feedback forti
    success: {
      pattern: [40, 20, 15, 20, 45],
      description: 'Azione completata'
    },
    error: {
      pattern: [60, 60, 60],
      description: 'Errore'
    },
    warning: {
      pattern: [35, 80, 35],
      description: 'Attenzione'
    },
    
    // Feedback speciali
    notification: {
      pattern: [20, 40, 15, 40, 25],
      description: 'Notifica benvenuto'
    },
    navigation: {
      pattern: [25, 10, 25],
      description: 'Navigazione sezioni'
    },
    
    // Feedback specifici
    phone_call: {
      pattern: [30, 20, 30, 20, 30],
      description: 'Chiamata telefonica'
    },
    email_open: {
      pattern: [25, 20, 35],
      description: 'Apertura email'
    },
    form_submit: {
      pattern: [35, 25, 15, 25, 40],
      description: 'Invio form'
    }
  };

  constructor() {
    this.checkSupport();
    this.testSystem();
  }

  private checkSupport(): void {
    this.isSupported = 'vibrate' in navigator && typeof navigator.vibrate === 'function';
    
    if (!this.isSupported) {
      console.info('🎯 Haptic: Vibration API non supportata');
      return;
    }

    try {
      navigator.vibrate(0);
    } catch (error) {
      this.isSupported = false;
      console.warn('🎯 Haptic: API non funzionante:', error);
    }
  }

  private testSystem(): void {
    if (!this.isSupported) return;

    setTimeout(() => {
      this.trigger('notification');
      console.log('🎯 Haptic System ATTIVO! Patterns:', Object.keys(this.patterns).length);
    }, 1500);
  }

  public trigger(type: keyof typeof this.patterns): boolean {
    if (!this.isSupported || !this.isEnabled) {
      return false;
    }

    const now = Date.now();
    if (now - this.lastTrigger < this.minInterval) {
      return false;
    }

    const pattern = this.patterns[type];
    if (!pattern) {
      console.warn(`🎯 Haptic: Pattern "${type}" non trovato`);
      return false;
    }

    try {
      const success = navigator.vibrate(pattern.pattern);
      if (success) {
        this.lastTrigger = now;
      }
      return success;
    } catch (error) {
      console.warn('🎯 Haptic: Errore trigger:', error);
      return false;
    }
  }

  public triggerCustom(pattern: number[]): boolean {
    if (!this.isSupported || !this.isEnabled || !Array.isArray(pattern)) {
      return false;
    }

    try {
      const success = navigator.vibrate(pattern);
      if (success) {
        this.lastTrigger = Date.now();
      }
      return success;
    } catch (error) {
      console.warn('🎯 Haptic: Errore custom:', error);
      return false;
    }
  }

  public stop(): void {
    if (this.isSupported) {
      try {
        navigator.vibrate(0);
      } catch (error) {
        console.warn('🎯 Haptic: Errore stop:', error);
      }
    }
  }

  public enable(): void {
    this.isEnabled = true;
  }

  public disable(): void {
    this.isEnabled = false;
    this.stop();
  }

  public getSupport(): boolean {
    return this.isSupported;
  }

  public getEnabled(): boolean {
    return this.isEnabled;
  }

  public getPatterns(): Record<string, HapticPattern> {
    return { ...this.patterns };
  }
}

// Istanza globale
export const haptic = new HapticManager();

// Hook per scroll haptic
export const triggerHapticOnScroll = (): (() => void) => {
  let lastScrollY = 0;
  let lastTrigger = 0;
  const delay = 500;

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const now = Date.now();

    // Top boundary
    if (currentScrollY <= 5 && lastScrollY > 5) {
      if (now - lastTrigger > delay) {
        haptic.trigger('scroll');
        lastTrigger = now;
      }
    }
    
    // Bottom boundary
    if (currentScrollY + windowHeight >= documentHeight - 10 && 
        lastScrollY + windowHeight < documentHeight - 10) {
      if (now - lastTrigger > delay) {
        haptic.trigger('scroll');
        lastTrigger = now;
      }
    }

    lastScrollY = currentScrollY;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
};

// Hook per section changes
export const triggerHapticOnSectionChange = (sectionIds: string[]): (() => void) => {
  const observers: IntersectionObserver[] = [];
  let currentSection: string | null = null;
  let lastChange = 0;
  const delay = 800;

  sectionIds.forEach(sectionId => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.target.id !== currentSection) {
            const now = Date.now();
            if (now - lastChange > delay) {
              currentSection = entry.target.id;
              haptic.trigger('navigation');
              lastChange = now;
            }
          }
        });
      },
      {
        threshold: 0.6,
        rootMargin: '-5% 0px -5% 0px'
      }
    );

    observer.observe(element);
    observers.push(observer);
  });

  return () => {
    observers.forEach(observer => observer.disconnect());
  };
};

// Utility functions
export const withHaptic = <T extends any[]>(
  callback: (...args: T) => void, 
  hapticType: keyof typeof haptic.patterns = 'button'
) => {
  return (...args: T) => {
    haptic.trigger(hapticType);
    callback(...args);
  };
};

export const addHapticToElement = (
  element: HTMLElement, 
  hapticType: keyof typeof haptic.patterns = 'button',
  eventType: string = 'click'
): (() => void) => {
  const handler = () => {
    if (!element.hasAttribute('disabled')) {
      haptic.trigger(hapticType);
    }
  };
  
  element.addEventListener(eventType, handler);
  
  return () => {
    element.removeEventListener(eventType, handler);
  };
};

// React hook
export const useHaptic = () => {
  const trigger = (type: keyof typeof haptic.patterns) => {
    return haptic.trigger(type);
  };

  const triggerCustom = (pattern: number[]) => {
    return haptic.triggerCustom(pattern);
  };

  const stop = () => {
    haptic.stop();
  };

  const enable = () => {
    haptic.enable();
  };

  const disable = () => {
    haptic.disable();
  };

  return {
    trigger,
    triggerCustom,
    stop,
    enable,
    disable,
    isSupported: haptic.getSupport(),
    isEnabled: haptic.getEnabled(),
    patterns: haptic.getPatterns()
  };
};

// Export default
export default haptic;

// Types
export type { HapticPattern };
export type HapticType = keyof typeof haptic.patterns;
