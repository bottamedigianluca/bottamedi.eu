/**
 * Wrapper sottile su gtag (GA4). Tutte le chiamate in tutto il sito
 * dovrebbero passare da qui: tipizzate, fail-safe quando gtag non c'è
 * (SSR, adblock, prima che lo script carichi), ed event_category
 * standardizzate per facilitare i report in GA.
 *
 * GA4 ricorda: gli "eventi" sono misurati in base al nome; parametri come
 * event_category/event_label vivono come dimensioni. Limitiamo i nomi a
 * uno snake_case corto, rimane tutto sotto i 40 char.
 */

type GtagFn = (...args: unknown[]) => void

function gtag(...args: unknown[]) {
  if (typeof window === 'undefined') return
  const fn = (window as unknown as { gtag?: GtagFn }).gtag
  if (typeof fn === 'function') fn(...args)
}

export type LocationSite = 'banchetto' | 'ingrosso'
export type ContactChannel = 'phone' | 'whatsapp' | 'email' | 'maps' | 'form'
export type FormName = 'horeca' | 'contact' | 'newsletter'

/* -----------------------------------------------------------------------
 * Contact actions (telefonate, WhatsApp, email, mappe)
 * --------------------------------------------------------------------- */
export function trackContact(channel: ContactChannel, site: LocationSite, source = 'unknown') {
  gtag('event', 'contact_action', {
    event_category: 'contact',
    event_label: `${channel}_${site}`,
    channel,
    site,
    source,
    value: channel === 'phone' || channel === 'whatsapp' ? 10 : 5,
  })
}

/* -----------------------------------------------------------------------
 * Form HORECA — funnel completo
 * --------------------------------------------------------------------- */
export function trackFormStart(form: FormName) {
  gtag('event', 'form_start', {
    event_category: 'form',
    event_label: form,
    form_name: form,
  })
}

export function trackFormSubmit(
  form: FormName,
  details?: {
    businessType?: string
    location?: string
    hasMessage?: boolean
  }
) {
  gtag('event', 'form_submit', {
    event_category: 'form',
    event_label: form,
    form_name: form,
    business_type: details?.businessType || '(none)',
    location: details?.location || '(none)',
    has_message: details?.hasMessage ? 1 : 0,
    // HORECA lead = conversione di valore alto
    value: form === 'horeca' ? 50 : 10,
  })
  // Conversion event standard GA4 (da marcare come "conversion" in GA UI)
  if (form === 'horeca') {
    gtag('event', 'generate_lead', {
      event_category: 'conversion',
      event_label: 'horeca_quote_request',
      currency: 'EUR',
      value: 50,
    })
  }
}

export function trackFormError(form: FormName, reason: string) {
  gtag('event', 'form_error', {
    event_category: 'form',
    event_label: form,
    form_name: form,
    error_reason: reason,
  })
}

/* -----------------------------------------------------------------------
 * Navigation
 * --------------------------------------------------------------------- */
export function trackNavClick(target: string, source: 'header' | 'footer' | 'mobile_dock' | 'inline') {
  gtag('event', 'nav_click', {
    event_category: 'navigation',
    event_label: `${source}:${target}`,
    target,
    source,
  })
}

export function trackBlogClick(source: 'header' | 'footer' | 'mobile_dock' | 'inline', locale: 'it' | 'de') {
  gtag('event', 'blog_click', {
    event_category: 'blog',
    event_label: `${source}_${locale}`,
    source,
    locale,
  })
}

/* -----------------------------------------------------------------------
 * Generic helper (quando nessuno degli alias sopra calza)
 * --------------------------------------------------------------------- */
export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  gtag('event', name, params)
}
