/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

declare module '*.mdx' {
  import type { ComponentType } from 'react'
  const Component: ComponentType
  export default Component
  export const frontmatter: Record<string, unknown>
}

declare module '*.md' {
  import type { ComponentType } from 'react'
  const Component: ComponentType
  export default Component
}

export {}
