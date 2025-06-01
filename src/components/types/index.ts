// Animation Types
export interface AnimationConfig {
  duration?: number
  delay?: number
  ease?: string | number[]
  stagger?: number
}

export interface TransitionConfig {
  type?: 'spring' | 'tween' | 'inertia'
  stiffness?: number
  damping?: number
  mass?: number
  velocity?: number
}

// Component Props
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
  id?: string
}

export interface SectionProps extends BaseComponentProps {
  language: 'it' | 'de'
  inView: boolean
}

// Language Types
export type Language = 'it' | 'de'

export interface Translation {
  [key: string]: string | Translation
}

export interface Translations {
  [key: string]: Translation
}

// Product Types
export interface Product {
  id: string
  name: string
  description: string
  image: string
  season: string
  origin: string
  category: 'seasonal' | 'vegetables' | 'specialty'
  price?: number
  available?: boolean
}

export interface ProductCategory {
  id: string
  name: string
  icon: string
  description: string
  color: string
  products: Product[]
}

// Service Types
export interface Service {
  id: string
  title: string
  shortDesc: string
  description: string
  features: string[]
  icon: string
  color: string
  image: string
  stats: ServiceStat[]
}

export interface ServiceStat {
  label: string
  value: string
}

// Contact Types
export interface ContactInfo {
  name: string
  email: string
  phone: string
  message: string
  service?: 'retail' | 'horeca' | 'consulting'
  company?: string
}

export interface ContactFormErrors {
  name?: string
  email?: string
  phone?: string
  message?: string
}

// Timeline Types
export interface TimelineEvent {
  year: string
  title: string
  description: string
  image: string
}

// Navigation Types
export interface NavItem {
  id: string
  label: string
  href: string
}

// Animation Variants
export interface AnimationVariants {
  initial: any
  animate: any
  exit?: any
  hover?: any
  tap?: any
}

// 3D Scene Types
export interface Vector3D {
  x: number
  y: number
  z: number
}

export interface Particle {
  id: string
  position: Vector3D
  velocity: Vector3D
  color: string
  size: number
  life: number
  maxLife: number
}

// Hook Types
export interface UseIntersectionObserverOptions {
  threshold?: number | number[]
  root?: Element | null
  rootMargin?: string
  triggerOnce?: boolean
}

export interface UseIntersectionObserverReturn {
  ref: React.RefObject<Element>
  inView: boolean
  entry?: IntersectionObserverEntry
}

// Utility Types
export interface ScrollPosition {
  x: number
  y: number
}

export interface WindowSize {
  width: number
  height: number
}

export interface MousePosition {
  x: number
  y: number
}

// API Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ContactSubmissionResponse {
  success: boolean
  message: string
  id?: string
}

// Theme Types
export interface ThemeColors {
  brand: {
    50: string
    100: string
    200: string
    300: string
    400: string
    500: string
    600: string
    700: string
    800: string
    900: string
    950: string
  }
  accent: {
    50: string
    100: string
    200: string
    300: string
    400: string
    500: string
    600: string
    700: string
    800: string
    900: string
    950: string
  }
  neutral: {
    50: string
    100: string
    200: string
    300: string
    400: string
    500: string
    600: string
    700: string
    800: string
    900: string
    950: string
  }
}

// Form Types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select'
  required?: boolean
  placeholder?: string
  options?: { value: string; label: string }[]
  validation?: (value: string) => string | undefined
}

// Performance Types
export interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  interactionTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
}

// Error Types
export interface AppError {
  code: string
  message: string
  details?: any
  timestamp: Date
}

// State Management Types
export interface AppState {
  language: Language
  theme: 'light' | 'dark'
  isMenuOpen: boolean
  isLoading: boolean
  currentSection: string
  scrollPosition: ScrollPosition
  windowSize: WindowSize
  mousePosition: MousePosition
}

export interface AppActions {
  setLanguage: (language: Language) => void
  setTheme: (theme: 'light' | 'dark') => void
  toggleMenu: () => void
  setLoading: (loading: boolean) => void
  setCurrentSection: (section: string) => void
  updateScrollPosition: (position: ScrollPosition) => void
  updateWindowSize: (size: WindowSize) => void
  updateMousePosition: (position: MousePosition) => void
}

// Event Types
export interface CustomEvent<T = any> {
  type: string
  data?: T
  timestamp: Date
}

export interface ScrollEvent extends CustomEvent {
  direction: 'up' | 'down'
  progress: number
  velocity: number
}

export interface ResizeEvent extends CustomEvent {
  size: WindowSize
  breakpoint: 'mobile' | 'tablet' | 'desktop'
}

export interface InteractionEvent extends CustomEvent {
  element: string
  action: 'click' | 'hover' | 'focus' | 'scroll'
  coordinates?: MousePosition
}