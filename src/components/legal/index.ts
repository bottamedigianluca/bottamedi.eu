// Export all legal components
export { default as CookieBanner } from './CookieBanner'
export { default as LegalDocuments } from './LegalDocuments' 
export { default as PrivacySettings } from './PrivacySettings'

// Export types if needed
export interface CookieConsent {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  timestamp: number
}

export interface LegalComponentProps {
  language: 'it' | 'de'
}

// Utility functions for cookie management
export const getCookieConsent = (): CookieConsent | null => {
  try {
    const consent = localStorage.getItem('bottamedi-cookie-consent')
    return consent ? JSON.parse(consent) : null
  } catch (e) {
    console.warn('Invalid cookie consent data')
    return null
  }
}

export const setCookieConsent = (consent: CookieConsent): void => {
  localStorage.setItem('bottamedi-cookie-consent', JSON.stringify(consent))
}

export const resetCookieConsent = (): void => {
  localStorage.removeItem('bottamedi-cookie-consent')
}

export const hasValidConsent = (): boolean => {
  const consent = getCookieConsent()
  if (!consent) return false
  
  // Check if consent is older than 13 months (GDPR requirement)
  const thirteenMonthsAgo = Date.now() - (13 * 30 * 24 * 60 * 60 * 1000)
  return consent.timestamp > thirteenMonthsAgo
}