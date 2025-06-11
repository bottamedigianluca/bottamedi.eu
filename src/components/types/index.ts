// Base component props
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

// Intersection Observer types
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

// Language types
export type Language = 'it' | 'de'

// Common component types
export interface SectionProps {
  language: Language
  inView: boolean
}

// Form types
export interface ContactFormData {
  name: string
  email: string
  phone?: string
  message: string
  type: 'general' | 'horeca' | 'retail'
}

// Navigation types
export interface NavigationItem {
  id: string
  label: { it: string; de: string }
  href?: string
}

// Product types
export interface Product {
  name: string
  season: string
  origin: string
  description?: string
  image?: string
}

export interface ProductCategory {
  id: string
  title: { it: string; de: string }
  shortDesc: { it: string; de: string }
  description: { it: string; de: string }
  longDescription: { it: string; de: string }
  icon: string
  color: string
  image: string
  products: Product[]
  features: ProductFeature[]
}

export interface ProductFeature {
  icon: string
  title: string
  desc: string
}

// Service types
export interface Service {
  id: string
  title: { it: string; de: string }
  description: { it: string; de: string }
  icon: string
  features: string[]
}

// Contact types
export interface ContactInfo {
  name: { it: string; de: string }
  address: string
  phone: string
  phoneFormatted: string
  email: string
  hours?: { it: string; de: string }
  coordinates: {
    lat: number
    lng: number
  }
  googleMapsUrl: string
}

// Animation types
export interface AnimationVariant {
  hidden: any
  visible: any
}

// Scroll types
export interface ScrollInfo {
  scrollY: number
  direction: 'up' | 'down' | null
  isScrolling: boolean
  scrollPercentage: number
  velocity: number
  isNearTop?: boolean
}

// Export all types
export default {
  BaseComponentProps,
  UseIntersectionObserverOptions,
  UseIntersectionObserverReturn,
  Language,
  SectionProps,
  ContactFormData,
  NavigationItem,
  Product,
  ProductCategory,
  ProductFeature,
  Service,
  ContactInfo,
  AnimationVariant,
  ScrollInfo
}
