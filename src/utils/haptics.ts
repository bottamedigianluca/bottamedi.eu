// utils/haptics.ts - Sistema Haptic Feedback COMPLETO per iOS + Android

interface HapticPattern {
  pattern: number[];
  description: string;
  fallback?: 'visual' | 'audio' | 'both';
}

class UniversalHapticManager {
  private isSupported: boolean = false;
  private isEnabled: boolean = true;
  private lastTrigger: number = 0;
  private minInterval: number = 50;
  private userInteracted: boolean = false;
  private isIOS: boolean = false;
  private isAndroid: boolean = false;
  private audioContext: AudioContext | null = null;
  
  private patterns: Record<string, HapticPattern> = {
    // Pattern ottimizzati per tutti i dispositivi
    tap: {
      pattern: [10],
      description: 'Tap leggero',
      fallback: 'visual'
    },
    selection: {
      pattern: [15],
      description: 'Selezione elemento',
      fallback: 'visual'
    },
    button: {
      pattern: [25],
      description: 'Pressione bottone',
      fallback: 'both'
    },
    toggle: {
      pattern: [30],
      description: 'Toggle menu',
      fallback: 'visual'
    },
    success: {
      pattern: [20, 15, 25],
      description: 'Azione completata',
      fallback: 'both'
    },
    error: {
      pattern: [50, 50],
      description: 'Errore',
      fallback: 'both'
    },
    notification: {
      pattern: [15, 20, 25],
      description: 'Notifica',
      fallback: 'audio'
    }
  };

  constructor() {
    this.detectDevice();
    this.checkSupport();
    this.setupUserInteractionDetection();
    this.initializeAlternatives();
  }

  private detectDevice(): void {
    const userAgent = navigator.userAgent.toLowerCase();
    this.isIOS = /iphone|ipad|ipod/.test(userAgent);
    this.isAndroid = /android/.test(userAgent);
    
    console.log(`📱 Device: ${this.isIOS ? 'iOS' : this.isAndroid ? 'Android' : 'Desktop'}`);
  }

  private checkSupport(): void {
    this.isSupported = 'vibrate' in navigator && typeof navigator.vibrate === 'function';
    
    if (this.isIOS) {
      // iOS non supporta vibration API
      this.isSupported = false;
      console.log('🍎 iOS: Vibration API non supportata - usando alternative');
    }
    
    console.log(`🎯 Haptic Support: ${this.isSupported ? 'YES' : 'NO'}`);
  }

  private initializeAlternatives(): void {
    // Initialize audio context per iOS feedback audio
    if (this.isIOS) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.log('🍎 Audio context non disponibile');
      }
    }

    // Add CSS for visual feedback
    this.addFeedbackCSS();
  }

  private addFeedbackCSS(): void {
    const css = `
      @keyframes haptic-ripple {
        0% {
          transform: scale(0);
          opacity: 0.6;
        }
        100% {
          transform: scale(1.5);
          opacity: 0;
        }
      }
      
      @keyframes haptic-pulse {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
      }
      
      .haptic-ripple {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        animation: haptic-ripple 0.3s ease-out;
      }
      
      .haptic-pulse {
        animation: haptic-pulse 0.2s ease-out;
      }
    `;

    if (!document.getElementById('haptic-styles')) {
      const style = document.createElement('style');
      style.id = 'haptic-styles';
      style.textContent = css;
      document.head.appendChild(style);
    }
  }

  private setupUserInteractionDetection(): void {
    const markUserInteraction = () => {
      if (!this.userInteracted) {
        this.userInteracted = true;
        console.log('🎯 User interaction detected');
        
        // Test immediato per verificare funzionamento
        if (this.isSupported) {
          setTimeout(() => this.triggerHaptic([25]), 100);
        } else if (this.isIOS) {
          console.log('🍎 iOS: Using visual/audio feedback instead of vibration');
        }
      }
    };

    const events = ['click', 'touchstart', 'touchend', 'mousedown', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, markUserInteraction, { 
        once: false,
        passive: true 
      });
    });
  }

  // Haptic nativo (Android/device che supportano)
  private triggerHaptic(pattern: number[]): boolean {
    if (!this.isSupported || !this.userInteracted) {
      return false;
    }

    try {
      const success = navigator.vibrate(pattern);
      if (success) {
        console.log(`🎯 Haptic success: ${pattern}`);
      }
      return success;
    } catch (error) {
      console.warn('🎯 Haptic error:', error);
      return false;
    }
  }

  // Audio feedback per iOS
  private playAudioFeedback(frequency: number = 800, duration: number = 50): void {
    if (!this.audioContext || !this.userInteracted) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration / 1000);
    } catch (e) {
      console.log('🍎 Audio feedback fallito');
    }
  }

  // Visual feedback per tutti i dispositivi
  private createVisualFeedback(element?: HTMLElement, type: string = 'tap'): void {
    if (!element) return;

    const colors = {
      tap: '#22c55e',
      button: '#3b82f6',
      success: '#10b981',
      error: '#ef4444',
      notification: '#f59e0b'
    };

    // Ripple effect
    const ripple = document.createElement('div');
    ripple.className = 'haptic-ripple';
    ripple.style.cssText = `
      background: ${colors[type as keyof typeof colors] || colors.tap};
      width: 20px;
      height: 20px;
    `;

    const rect = element.getBoundingClientRect();
    ripple.style.left = (rect.left + rect.width / 2 - 10) + 'px';
    ripple.style.top = (rect.top + rect.height / 2 - 10) + 'px';

    document.body.appendChild(ripple);

    // Cleanup
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 300);

    // Pulse effect sull'elemento
    element.classList.add('haptic-pulse');
    setTimeout(() => {
      element.classList.remove('haptic-pulse');
    }, 200);
  }

  // API pubblica principale
  public trigger(type: keyof typeof this.patterns, element?: HTMLElement): boolean {
    if (!this.isEnabled) return false;

    const now = Date.now();
    if (now - this.lastTrigger < this.minInterval) {
      return false;
    }

    const pattern = this.patterns[type];
    if (!pattern) {
      console.warn(`🎯 Pattern "${type}" non trovato`);
      return false;
    }

    let success = false;

    // Prova haptic nativo
    if (this.isSupported && this.userInteracted) {
      success = this.triggerHaptic(pattern.pattern);
    }

    // Fallback per iOS e dispositivi non supportati
    if (!success || this.isIOS) {
      const fallback = pattern.fallback || 'visual';
      
      if (fallback === 'visual' || fallback === 'both') {
        this.createVisualFeedback(element, type);
        success = true;
      }
      
      if (fallback === 'audio' || fallback === 'both') {
        if (this.isIOS) {
          const frequencies = {
            tap: 800,
            button: 1000,
            success: 1200,
            error: 400,
            notification: 900
          };
          this.playAudioFeedback(frequencies[type as keyof typeof frequencies] || 800, 30);
          success = true;
        }
      }
    }

    if (success) {
      this.lastTrigger = now;
    }

    return success;
  }

  public triggerCustom(pattern: number[], element?: HTMLElement): boolean {
    if (!this.isSupported || !this.userInteracted) {
      if (element) {
        this.createVisualFeedback(element, 'tap');
        return true;
      }
      return false;
    }

    return this.triggerHaptic(pattern);
  }

  public stop(): void {
    if (this.isSupported) {
      try {
        navigator.vibrate(0);
      } catch (error) {
        console.warn('🎯 Stop error:', error);
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

  // Getters
  public getSupport(): boolean {
    return this.isSupported;
  }

  public getEnabled(): boolean {
    return this.isEnabled;
  }

  public getUserInteracted(): boolean {
    return this.userInteracted;
  }

  public isIOSDevice(): boolean {
    return this.isIOS;
  }

  public isAndroidDevice(): boolean {
    return this.isAndroid;
  }

  public getPatterns(): Record<string, HapticPattern> {
    return { ...this.patterns };
  }
}

// Istanza globale
export const haptic = new UniversalHapticManager();

// React hook con supporto completo
export const useHaptic = () => {
  const trigger = (type: keyof typeof haptic.patterns, element?: HTMLElement) => {
    return haptic.trigger(type, element);
  };

  const triggerCustom = (pattern: number[], element?: HTMLElement) => {
    return haptic.triggerCustom(pattern, element);
  };

  return {
    trigger,
    triggerCustom,
    stop: () => haptic.stop(),
    enable: () => haptic.enable(),
    disable: () => haptic.disable(),
    isSupported: haptic.getSupport(),
    isEnabled: haptic.getEnabled(),
    isIOS: haptic.isIOSDevice(),
    isAndroid: haptic.isAndroidDevice(),
    userInteracted: haptic.getUserInteracted(),
    patterns: haptic.getPatterns()
  };
};

// Utility per elementi DOM
export const addHapticToElement = (
  element: HTMLElement, 
  hapticType: keyof typeof haptic.patterns = 'button',
  eventType: string = 'click'
): (() => void) => {
  const handler = (e: Event) => {
    if (!element.hasAttribute('disabled')) {
      haptic.trigger(hapticType, element);
    }
  };
  
  element.addEventListener(eventType, handler);
  
  return () => {
    element.removeEventListener(eventType, handler);
  };
};

export default haptic;
export type { HapticPattern };
export type HapticType = keyof typeof haptic.patterns;
