// Base component props
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

// Language types
export type Language = 'it' | 'de'

// Section props common interface
export interface SectionProps {
  language: Language
  inView: boolean
}

// Intersection Observer hook types
export interface UseIntersectionObserverOptions {
  threshold?: number | number[]
  rootMargin?: string
  root?: Element | Document | null
  triggerOnce?: boolean
}

export interface UseIntersectionObserverReturn {
  ref: (node?: Element | null) => void
  inView: boolean
  entry?: IntersectionObserverEntry
}

// Contact form data
export interface ContactFormData {
  name: string
  email: string
  phone?: string
  message: string
  businessType?: string
  location?: string
}

// Navigation item
export interface NavigationItem {
  id: string
  label: string
  href: string
  external?: boolean
}

// Product types
export interface Product {
  id: string
  name: string
  category: string
  origin?: string
  season?: string
  price?: number
  image?: string
  description?: string
}

export interface ProductCategory {
  id: string
  title: string
  description: string
  products: Product[]
  icon: string
  color: string
}

export interface ProductFeature {
  icon: string
  title: string
  description: string
}

// Service types
export interface Service {
  id: string
  title: string
  description: string
  features: ProductFeature[]
  icon: string
  image?: string
  color: string
}

// Contact info
export interface ContactInfo {
  name: string
  title: string
  phone: string
  email: string
  address: string
  hours?: string
}

// Animation variants
export interface AnimationVariant {
  hidden: {
    opacity: number
    y?: number
    x?: number
    scale?: number
  }
  visible: {
    opacity: number
    y?: number
    x?: number
    scale?: number
    transition?: {
      duration?: number
      delay?: number
      ease?: string | number[]
    }
  }
}

// Scroll info
export interface ScrollInfo {
  scrollY: number
  scrollDirection: 'up' | 'down' | 'none'
  isScrolling: boolean
}

// Header props
export interface HeaderProps {
  language: Language
  onLanguageChange: (language: Language) => void
  isMenuOpen: boolean
  onToggleMenu: () => void
}

// Mobile dock props
export interface MobileDockProps {
  language: Language
  hideInFooter: boolean
}

// Legal documents props
export interface LegalDocumentsProps {
  language: Language
}

// Footer props
export interface FooterProps {
  language: Language
}

// Cookie banner props
export interface CookieBannerProps {
  language: Language
}

// Loading component props
export interface LoadingProps {
  message?: string
  variant?: 'spinner' | 'pulse' | 'dots'
}

// Image optimization props
export interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
  loading?: 'lazy' | 'eager'
}

// SEO meta data
export interface SEOMetaData {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: string
}

// Performance metrics
export interface PerformanceMetrics {
  lcp?: number // Largest Contentful Paint
  fid?: number // First Input Delay
  cls?: number // Cumulative Layout Shift
  loadTime?: number
}

// Form validation
export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string) => boolean | string
}

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select'
  placeholder?: string
  validation?: ValidationRule
  options?: { value: string; label: string }[]
}

// Error handling
export interface ErrorInfo {
  message: string
  code?: string | number
  type: 'warning' | 'error' | 'info'
  timestamp?: Date
}
