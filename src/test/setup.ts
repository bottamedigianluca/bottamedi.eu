import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})

// jsdom stubs
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
;(global as unknown as { IntersectionObserver: typeof IntersectionObserverMock }).IntersectionObserver =
  IntersectionObserverMock
