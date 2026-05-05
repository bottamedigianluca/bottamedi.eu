import React from 'react'
import { Link } from 'react-router-dom'
import { Reveal, Parallax, Stat, StatGrid, PullQuote, Gallery, Timeline, TimelineItem, Compare } from './MotionPrimitives'
import { RecipeTabs, Recipe } from './RecipeTabs'

const heading = (Tag: 'h2' | 'h3' | 'h4') =>
  function H({ id, children }: { id?: string; children?: React.ReactNode }) {
    const sizes: Record<string, string> = {
      h2: 'text-2xl md:text-3xl font-bold mt-10 mb-4 text-gray-900 scroll-mt-24',
      h3: 'text-xl md:text-2xl font-semibold mt-8 mb-3 text-gray-900 scroll-mt-24',
      h4: 'text-lg font-semibold mt-6 mb-2 text-gray-900 scroll-mt-24',
    }
    return (
      <Tag id={id} className={sizes[Tag]}>
        {id && (
          <a href={`#${id}`} className="text-gray-300 hover:text-green-600 mr-2 no-underline" aria-hidden="true">
            #
          </a>
        )}
        {children}
      </Tag>
    )
  }

export const MDXComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 {...props} className="text-3xl md:text-4xl font-bold mb-4 text-gray-900" />
  ),
  h2: heading('h2'),
  h3: heading('h3'),
  h4: heading('h4'),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p {...props} className="text-gray-700 leading-relaxed mb-5 text-lg" />
  ),
  a: ({ href = '', ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = /^https?:\/\//.test(href) && !href.includes('bottamedi.eu')
    const isInternal = href.startsWith('/')
    if (isInternal) {
      return <Link to={href} className="text-green-700 hover:text-green-800 underline underline-offset-2" {...(props as object)} />
    }
    return (
      <a
        href={href}
        className="text-green-700 hover:text-green-800 underline underline-offset-2"
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        {...props}
      />
    )
  },
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul {...props} className="list-disc list-outside ml-6 mb-5 space-y-2 text-gray-700 text-lg" />
  ),
  ol: (props: React.OlHTMLAttributes<HTMLOListElement>) => (
    <ol {...props} className="list-decimal list-outside ml-6 mb-5 space-y-2 text-gray-700 text-lg" />
  ),
  li: (props: React.LiHTMLAttributes<HTMLLIElement>) => <li {...props} className="leading-relaxed" />,
  blockquote: (props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      {...props}
      className="border-l-4 border-green-500 bg-green-50 pl-5 py-3 my-6 italic text-gray-800 rounded-r-lg"
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code {...props} className="bg-gray-100 text-green-900 rounded px-1.5 py-0.5 text-sm font-mono" />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre {...props} className="bg-gray-900 text-gray-100 rounded-xl p-4 overflow-x-auto my-6 text-sm" />
  ),
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} loading="lazy" decoding="async" className="rounded-xl my-6 w-full h-auto" />
  ),
  table: (props: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-6">
      <table {...props} className="w-full text-sm border-collapse" />
    </div>
  ),
  th: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th {...props} className="border-b border-green-200 bg-green-50 px-3 py-2 text-left font-semibold text-gray-900" />
  ),
  td: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td {...props} className="border-b border-gray-100 px-3 py-2 text-gray-700" />
  ),
  hr: () => <hr className="my-10 border-green-100" />,
  Callout: ({ type = 'info', children }: { type?: 'info' | 'tip' | 'warning'; children: React.ReactNode }) => {
    const colors: Record<string, string> = {
      info: 'bg-blue-50 border-blue-200 text-blue-900',
      tip: 'bg-green-50 border-green-200 text-green-900',
      warning: 'bg-amber-50 border-amber-200 text-amber-900',
    }
    return (
      <div className={`border-l-4 rounded-r-lg p-4 my-6 ${colors[type]}`}>{children}</div>
    )
  },
  CTA: ({ href = '/#contact', children }: { href?: string; children: React.ReactNode }) => {
    const isInternal = href.startsWith('/')
    const classes =
      'inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl my-6 transition shadow-md'
    return isInternal ? (
      <Link to={href} className={classes}>
        {children}
      </Link>
    ) : (
      <a href={href} className={classes}>
        {children}
      </a>
    )
  },
  // Animated editorial primitives
  Reveal,
  Parallax,
  Stat,
  StatGrid,
  PullQuote,
  Gallery,
  Timeline,
  TimelineItem,
  Compare,
  RecipeTabs,
  Recipe,
} as const

export default MDXComponents
