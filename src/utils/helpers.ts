import { VALIDATION_RULES, STORAGE_KEYS } from './constants'

// String utilities
export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const capitalizeWords = (str: string): string => {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
}

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

export const truncateText = (text: string, maxLength: number, suffix = '...'): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - suffix.length) + suffix
}

export const stripHtml = (html: string): string => {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

// Number utilities
export const formatPrice = (price: number, currency = '€'): string => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: currency === '€' ? 'EUR' : currency,
  }).format(price)
}

export const formatNumber = (num: number, locale = 'it-IT'): string => {
  return new Intl.NumberFormat(locale).format(num)
}

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

export const roundToDecimals = (num: number, decimals: number): number => {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

export const generateRandomId = (length = 8): string => {
  return Math.random().toString(36).substring(2, 2 + length)
}

// Date utilities
export const formatDate = (date: Date | string, locale = 'it-IT'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj)
}

export const formatTime = (date: Date | string, locale = 'it-IT'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj)
}

export const formatDateTime = (date: Date | string, locale = 'it-IT'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj)
}

export const isToday = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const today = new Date()
  return dateObj.toDateString() === today.toDateString()
}

export const daysSince = (date: Date | string): number => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - dateObj.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Validation utilities
export const validateEmail = (email: string): boolean => {
  return VALIDATION_RULES.email.pattern.test(email)
}

export const validatePhone = (phone: string): boolean => {
  return VALIDATION_RULES.phone.pattern.test(phone)
}

export const validateName = (name: string): boolean => {
  return name.length >= VALIDATION_RULES.name.minLength && 
         name.length <= VALIDATION_RULES.name.maxLength &&
         VALIDATION_RULES.name.pattern.test(name)
}

export const validateMessage = (message: string): boolean => {
  return message.length >= VALIDATION_RULES.message.minLength && 
         message.length <= VALIDATION_RULES.message.maxLength
}

// URL utilities
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const getUrlParams = (url = window.location.href): URLSearchParams => {
  return new URL(url).searchParams
}

export const buildUrl = (base: string, params: Record<string, string>): string => {
  const url = new URL(base)
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })
  return url.toString()
}

export const getBaseDomain = (url: string): string => {
  try {
    return new URL(url).hostname
  } catch {
    return ''
  }
}

// Local Storage utilities
export const setLocalStorage = (key: string, value: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn('Failed to save to localStorage:', error)
  }
}

export const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.warn('Failed to read from localStorage:', error)
    return defaultValue
  }
}

export const removeLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.warn('Failed to remove from localStorage:', error)
  }
}

export const clearLocalStorage = (): void => {
  try {
    localStorage.clear()
  } catch (error) {
    console.warn('Failed to clear localStorage:', error)
  }
}

// Session Storage utilities
export const setSessionStorage = (key: string, value: any): void => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn('Failed to save to sessionStorage:', error)
  }
}

export const getSessionStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = sessionStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.warn('Failed to read from sessionStorage:', error)
    return defaultValue
  }
}

// Cookie utilities
export const setCookie = (name: string, value: string, days: number): void => {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`
}

export const getCookie = (name: string): string | null => {
  const nameEQ = name + '='
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

export const deleteCookie = (name: string): void => {
  setCookie(name, '', -1)
}

// Array utilities
export const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)]
}

export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const group = String(item[key])
    groups[group] = groups[group] || []
    groups[group].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

export const sortBy = <T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
}

// Object utilities
export const pick = <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  const result = {} as Pick<T, K>
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key]
    }
  })
  return result
}

export const omit = <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const result = { ...obj }
  keys.forEach(key => {
    delete result[key]
  })
  return result
}

export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T
  if (typeof obj === 'object') {
    const clonedObj = {} as T
    Object.keys(obj).forEach(key => {
      (clonedObj as any)[key] = deepClone((obj as any)[key])
    })
    return clonedObj
  }
  return obj
}

export const isEmpty = (value: any): boolean => {
  if (value == null) return true
  if (typeof value === 'string') return value.trim().length === 0
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

// DOM utilities
export const scrollToElement = (elementId: string, offset = 0): void => {
  const element = document.getElementById(elementId)
  if (element) {
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
    window.scrollTo({
      top: elementPosition - offset,
      behavior: 'smooth'
    })
  }
}

export const scrollToTop = (): void => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

export const getElementPosition = (element: HTMLElement): { x: number; y: number } => {
  const rect = element.getBoundingClientRect()
  return {
    x: rect.left + window.scrollX,
    y: rect.top + window.scrollY
  }
}

export const isElementInViewport = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

export const getScrollPercentage = (): number => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
  return (scrollTop / scrollHeight) * 100
}

// Performance utilities
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Device detection
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

export const isAndroid = (): boolean => {
  return /Android/.test(navigator.userAgent)
}

export const isSafari = (): boolean => {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
}

export const getTouchSupport = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

// Browser utilities
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    } catch (fallbackError) {
      document.body.removeChild(textArea)
      return false
    }
  }
}

// Error handling
export const handleError = (error: unknown, context?: string): void => {
  const message = error instanceof Error ? error.message : 'Unknown error'
  console.error(`${context ? `[${context}] ` : ''}${message}`, error)
  
  // In production, you might want to send errors to a logging service
  if (process.env.NODE_ENV === 'production') {
    // logErrorToService(error, context)
  }
}

export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

// Language utilities
export const getLanguageFromStorage = (): 'it' | 'de' => {
  return getLocalStorage(STORAGE_KEYS.language, 'it')
}

export const setLanguageToStorage = (language: 'it' | 'de'): void => {
  setLocalStorage(STORAGE_KEYS.language, language)
}

export const getBrowserLanguage = (): 'it' | 'de' => {
  const lang = navigator.language.toLowerCase()
  if (lang.startsWith('de')) return 'de'
  return 'it' // Default to Italian
}

export default {
  capitalizeFirst,
  capitalizeWords,
  slugify,
  truncateText,
  stripHtml,
  formatPrice,
  formatNumber,
  clamp,
  roundToDecimals,
  generateRandomId,
  formatDate,
  formatTime,
  formatDateTime,
  isToday,
  daysSince,
  validateEmail,
  validatePhone,
  validateName,
  validateMessage,
  isValidUrl,
  getUrlParams,
  buildUrl,
  getBaseDomain,
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  clearLocalStorage,
  setSessionStorage,
  getSessionStorage,
  setCookie,
  getCookie,
  deleteCookie,
  shuffle,
  chunk,
  unique,
  groupBy,
  sortBy,
  pick,
  omit,
  deepClone,
  isEmpty,
  scrollToElement,
  scrollToTop,
  getElementPosition,
  isElementInViewport,
  getScrollPercentage,
  debounce,
  throttle,
  isMobile,
  isIOS,
  isAndroid,
  isSafari,
  getTouchSupport,
  copyToClipboard,
  handleError,
  safeJsonParse,
  getLanguageFromStorage,
  setLanguageToStorage,
  getBrowserLanguage
}
