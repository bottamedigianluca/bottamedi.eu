import './index.css'
import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './routes'

export const createRoot = ViteReactSSG(
  { routes },
  ({ router, isClient }) => {
    if (isClient) {
      router?.subscribe?.(() => {
        // Page view tracking on client-side route changes
        const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
        if (typeof gtag === 'function') {
          gtag('event', 'page_view', {
            page_path: window.location.pathname,
            page_location: window.location.href,
            page_title: document.title,
          })
        }
      })
    }
  }
)
