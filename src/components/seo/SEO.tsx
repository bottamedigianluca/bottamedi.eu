import React from 'react'
import { Helmet } from 'react-helmet-async'
import { SITE, type Locale } from '@/lib/siteConfig'
import type { SeoMeta } from '@/lib/seo'

interface SEOProps extends SeoMeta {
  jsonLd?: unknown | unknown[]
  children?: React.ReactNode
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  ogImage,
  ogType = 'website',
  locale = 'it',
  alternates,
  keywords,
  noindex,
  publishedTime,
  modifiedTime,
  author,
  articleSection,
  articleTags,
  jsonLd,
  children,
}) => {
  const image = ogImage ?? SITE.defaultOgImage
  const ogLocale = locale === 'de' ? 'de_IT' : 'it_IT'
  const alternateLocale = locale === 'de' ? 'it_IT' : 'de_IT'
  const jsonLdArray = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : []

  return (
    <Helmet prioritizeSeoTags>
      <html lang={locale} />
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <link rel="canonical" href={canonical} />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* hreflang */}
      {alternates && Object.entries(alternates).map(([lng, href]) =>
        href ? <link key={lng} rel="alternate" hrefLang={lng} href={href} /> : null
      )}
      {alternates?.it && <link rel="alternate" hrefLang="x-default" href={alternates.it} />}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:locale:alternate" content={alternateLocale} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}
      {articleSection && <meta property="article:section" content={articleSection} />}
      {articleTags?.map(tag => <meta key={tag} property="article:tag" content={tag} />)}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* RSS */}
      <link rel="alternate" type="application/rss+xml" title="Bottamedi — Blog" href={`${SITE.url}/rss.xml`} />

      {/* JSON-LD */}
      {jsonLdArray.map((node, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(node)}</script>
      ))}

      {children}
    </Helmet>
  )
}

export default SEO
