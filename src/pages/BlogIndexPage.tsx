import React, { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SEO from '@/components/seo/SEO'
import { SITE, BLOG_CATEGORIES, type Locale } from '@/lib/siteConfig'
import { buildCanonical, buildPageTitle } from '@/lib/seo'
import { graph, organizationSchema, websiteSchema, breadcrumbSchema } from '@/lib/jsonLd'
import { getPostsByLocale } from '@/lib/blog'
import PostCard from '@/components/blog/PostCard'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useLocalStorage } from '@/hooks/useLocalStorage'

interface Props {
  locale?: Locale
}

const BlogIndexPage: React.FC<Props> = ({ locale = 'it' }) => {
  const [language, setLanguage] = useLocalStorage<'it' | 'de'>('bottamedi-language', locale)
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('categoria') ?? ''
  const searchQuery = searchParams.get('q') ?? ''
  const [q, setQ] = useState(searchQuery)

  const allPosts = useMemo(() => getPostsByLocale(locale), [locale])
  const filtered = useMemo(() => {
    let posts = allPosts
    if (activeCategory) posts = posts.filter(p => p.frontmatter.category === activeCategory)
    if (searchQuery.trim()) {
      const needle = searchQuery.trim().toLowerCase()
      posts = posts.filter(p => {
        const hay = [p.frontmatter.title, p.frontmatter.excerpt, ...p.frontmatter.tags].join(' ').toLowerCase()
        return hay.includes(needle)
      })
    }
    return posts
  }, [allPosts, activeCategory, searchQuery])

  const featured = filtered.find(p => p.frontmatter.featured) ?? filtered[0]
  const rest = featured ? filtered.filter(p => p !== featured) : []

  const basePath = locale === 'de' ? '/de/blog' : '/blog'
  const canonical = buildCanonical(basePath + (activeCategory ? `?categoria=${activeCategory}` : ''))
  const alternates = {
    it: `${SITE.url}/blog`,
    de: `${SITE.url}/de/blog`,
  }

  const titleParts = [
    locale === 'de' ? 'Blog' : 'Blog',
    activeCategory ? BLOG_CATEGORIES[activeCategory as keyof typeof BLOG_CATEGORIES]?.[locale] : undefined,
  ]

  const description =
    locale === 'de'
      ? 'Blog Bottamedi: Saisonalität, Rezepte, Geschichten aus dem Gebiet Trentino, Guides HORECA für Restaurants und Hotels. Geschrieben von einer Familie, die seit 1974 Obst und Gemüse auswählt.'
      : 'Blog di Bottamedi: stagionalità, ricette, storie dal territorio trentino, guide HORECA per ristoranti e hotel. Scritto da una famiglia che seleziona frutta e verdura dal 1974.'

  const jsonLd = graph(
    organizationSchema(),
    websiteSchema(locale),
    breadcrumbSchema([
      { name: 'Home', url: locale === 'de' ? '/de' : '/' },
      { name: 'Blog', url: basePath },
      ...(activeCategory
        ? [
            {
              name: BLOG_CATEGORIES[activeCategory as keyof typeof BLOG_CATEGORIES]?.[locale] ?? activeCategory,
              url: `${basePath}?categoria=${activeCategory}`,
            },
          ]
        : []),
    ]),
    {
      '@type': 'Blog',
      '@id': `${SITE.url}${basePath}#blog`,
      name: 'Blog Bottamedi',
      description,
      inLanguage: locale === 'de' ? 'de-IT' : 'it-IT',
      publisher: { '@id': `${SITE.url}/#organization` },
      blogPost: allPosts.slice(0, 10).map(p => ({
        '@type': 'BlogPosting',
        headline: p.frontmatter.title,
        datePublished: p.frontmatter.publishedAt,
        url: `${SITE.url}${locale === 'de' ? '/de' : ''}/blog/${p.frontmatter.slug}`,
      })),
    }
  )

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEO
        title={buildPageTitle(titleParts, locale)}
        description={description}
        canonical={canonical}
        locale={locale}
        alternates={alternates}
        ogType="website"
        keywords={[
          'blog frutta verdura',
          'ricette stagionali',
          'HORECA guide',
          'stagionalità Trentino',
          'Bottamedi blog',
        ]}
        jsonLd={jsonLd}
      />

      <Header language={language} onLanguageChange={setLanguage} isMenuOpen={false} onToggleMenu={() => {}} />

      <main id="main" className="flex-1 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <header className="mb-10 md:mb-14">
            <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-4">
              <Link to={locale === 'de' ? '/de' : '/'} className="hover:text-green-700">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-700 font-medium">Blog</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              {locale === 'de' ? 'Il nostro blog' : 'Il nostro blog'}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">{description}</p>
          </header>

          {/* Filtri */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
            <div className="flex flex-wrap gap-2">
              <Link
                to={basePath}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  !activeCategory
                    ? 'bg-green-600 text-white'
                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                }`}
              >
                {locale === 'de' ? 'Alle' : 'Tutti'}
              </Link>
              {Object.entries(BLOG_CATEGORIES).map(([key, cat]) => (
                <Link
                  key={key}
                  to={`${basePath}?categoria=${key}`}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                    activeCategory === key
                      ? 'text-white'
                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                  style={activeCategory === key ? { backgroundColor: cat.color } : undefined}
                >
                  {cat[locale]}
                </Link>
              ))}
            </div>
            <form
              role="search"
              onSubmit={e => {
                e.preventDefault()
                const next = new URLSearchParams(searchParams)
                if (q) next.set('q', q)
                else next.delete('q')
                setSearchParams(next, { replace: true })
              }}
              className="flex gap-2"
            >
              <label htmlFor="blog-search" className="sr-only">
                Cerca nel blog
              </label>
              <input
                id="blog-search"
                type="search"
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder={locale === 'de' ? 'Suche…' : 'Cerca…'}
                className="rounded-lg border border-green-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="rounded-lg bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 text-sm font-medium"
              >
                {locale === 'de' ? 'Suchen' : 'Cerca'}
              </button>
            </form>
          </div>

          {/* Posts */}
          {filtered.length === 0 ? (
            <p className="text-gray-600 py-16 text-center">
              {locale === 'de'
                ? 'Noch keine Beiträge. Schau bald wieder vorbei!'
                : 'Ancora nessun articolo in questa sezione. Torna presto!'}
            </p>
          ) : (
            <>
              {featured && (
                <div className="mb-12">
                  <PostCard post={featured} locale={locale} priority />
                </div>
              )}
              {rest.length > 0 && (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map(p => (
                    <PostCard key={p.frontmatter.slug} post={p} locale={locale} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer language={language} />
    </div>
  )
}

export default BlogIndexPage
