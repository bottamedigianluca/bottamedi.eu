import React, { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import NotFoundPage from './NotFoundPage'
import { MDXProvider } from '@mdx-js/react'
import SEO from '@/components/seo/SEO'
import { SITE, BLOG_CATEGORIES, type Locale } from '@/lib/siteConfig'
import { buildCanonical, buildPageTitle, absoluteUrl } from '@/lib/seo'
import {
  graph,
  organizationSchema,
  breadcrumbSchema,
  articleSchema,
  recipeSchema,
  produceItemSchema,
  faqSchema,
} from '@/lib/jsonLd'
import { getPostBySlug, getRelatedPosts, formatPostDate } from '@/lib/blog'
import MDXComponents from '@/components/blog/MDXComponents'
import ReadingProgress from '@/components/blog/ReadingProgress'
import ShareButtons from '@/components/blog/ShareButtons'
import AuthorBox from '@/components/blog/AuthorBox'
import RelatedPosts from '@/components/blog/RelatedPosts'
import { HeroCover, Reveal, type AnimationPreset } from '@/components/blog/MotionPrimitives'
import { motion, useReducedMotion } from 'framer-motion'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useLocalStorage } from '@/hooks/useLocalStorage'

// Eager import so MDX content is available synchronously during SSR pre-render.
const mdxModules = import.meta.glob('/src/content/blog/**/*.mdx', {
  eager: true,
  import: 'default',
}) as Record<string, React.ComponentType>

function findMdxComponent(slug: string, _locale: Locale): React.ComponentType | null {
  for (const [p, Component] of Object.entries(mdxModules)) {
    if (!p.endsWith('.mdx')) continue
    // File naming: YYYY-MM-DD-<slug>.mdx or just <slug>.mdx
    if (p.endsWith(`/${slug}.mdx`) || p.endsWith(`-${slug}.mdx`)) return Component
  }
  return null
}

interface Props {
  locale?: Locale
}

const MOOD_GRADIENTS: Record<string, string> = {
  spring: 'from-emerald-50 via-white to-green-50',
  summer: 'from-yellow-50 via-white to-amber-50',
  autumn: 'from-amber-50 via-white to-orange-50',
  winter: 'from-sky-50 via-white to-slate-50',
  warm: 'from-amber-50 via-white to-rose-50',
  cool: 'from-sky-50 via-white to-emerald-50',
  heritage: 'from-stone-50 via-white to-amber-50',
  minimal: 'from-white via-white to-gray-50',
}

const BlogPostPage: React.FC<Props> = ({ locale = 'it' }) => {
  const { slug } = useParams<{ slug: string }>()
  const [language, setLanguage] = useLocalStorage<'it' | 'de'>('bottamedi-language', locale)
  const reduce = useReducedMotion()

  const post = slug ? getPostBySlug(slug, locale) : undefined

  const MDXContent = useMemo(() => {
    if (!slug) return null
    return findMdxComponent(slug, locale)
  }, [slug, locale])

  if (!slug || !post || !MDXContent) {
    return <NotFoundPage />
  }

  const { frontmatter, readingTimeMinutes } = post
  const category = BLOG_CATEGORIES[frontmatter.category]
  const basePath = locale === 'de' ? '/de/blog' : '/blog'
  const canonicalPath = `${basePath}/${frontmatter.slug}`
  const canonical = buildCanonical(canonicalPath)
  const animationPreset: AnimationPreset = frontmatter.animation ?? 'editorial'
  const mood = frontmatter.mood ?? 'spring'
  const moodGradient = MOOD_GRADIENTS[mood] ?? MOOD_GRADIENTS.spring

  const alternates: Partial<Record<Locale, string>> = {}
  if (frontmatter.translations?.it) alternates.it = `${SITE.url}/blog/${frontmatter.translations.it}`
  if (frontmatter.translations?.de) alternates.de = `${SITE.url}/de/blog/${frontmatter.translations.de}`
  if (!alternates[locale]) alternates[locale] = canonical

  const related = getRelatedPosts(post, 3)

  const produceNode = frontmatter.produce
    ? produceItemSchema(
        {
          name: frontmatter.produce.name,
          alternateName: frontmatter.produce.alternateName,
          description: frontmatter.excerpt,
          image: frontmatter.cover.src,
          category: frontmatter.produce.category,
          origin: frontmatter.produce.origin,
          seasonMonths: frontmatter.produce.seasonMonths,
          scientificName: frontmatter.produce.scientificName,
        },
        canonical
      )
    : null

  const recipeNodes =
    frontmatter.recipes?.map((r) =>
      recipeSchema({
        name: r.name,
        description: r.description,
        image: r.image || frontmatter.cover.src,
        author: frontmatter.author.name,
        datePublished: frontmatter.publishedAt,
        prepTimeMin: r.prepTimeMin,
        cookTimeMin: r.cookTimeMin,
        servings: r.servings,
        cuisine: r.cuisine,
        category: r.category,
        ingredients: r.ingredients,
        instructions: r.instructions,
        nutrition: r.nutrition,
        keywords: r.keywords,
      })
    ) ?? []

  const faqNode =
    frontmatter.faq && frontmatter.faq.length > 0 ? faqSchema(frontmatter.faq) : null

  const jsonLd = graph(
    organizationSchema(),
    breadcrumbSchema([
      { name: 'Home', url: locale === 'de' ? '/de' : '/' },
      { name: 'Blog', url: basePath },
      { name: category[locale], url: `${basePath}?categoria=${frontmatter.category}` },
      { name: frontmatter.title, url: canonicalPath },
    ]),
    articleSchema(post),
    produceNode,
    ...recipeNodes,
    faqNode
  )

  const seoTitle = frontmatter.seo?.metaTitle ?? buildPageTitle([frontmatter.title], locale)
  const seoDescription = frontmatter.seo?.metaDescription ?? frontmatter.excerpt

  return (
    <div className={`min-h-screen bg-gradient-to-b ${moodGradient} flex flex-col`}>
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonical={canonical}
        locale={locale}
        alternates={alternates}
        ogType="article"
        ogImage={frontmatter.cover.src.startsWith('http') ? frontmatter.cover.src : absoluteUrl(frontmatter.cover.src)}
        keywords={frontmatter.seo?.keywords ?? frontmatter.tags}
        publishedTime={frontmatter.publishedAt}
        modifiedTime={frontmatter.updatedAt ?? frontmatter.publishedAt}
        author={frontmatter.author.name}
        articleSection={category[locale]}
        articleTags={frontmatter.tags}
        jsonLd={jsonLd}
        noindex={frontmatter.seo?.noindex ?? false}
      />

      <ReadingProgress />
      <Header language={language} onLanguageChange={setLanguage} isMenuOpen={false} onToggleMenu={() => {}} />

      <main id="main" className="flex-1 pt-24 pb-16">
        <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-4">
            <Link to={locale === 'de' ? '/de' : '/'} className="hover:text-green-700">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link to={basePath} className="hover:text-green-700">
              Blog
            </Link>
            <span className="mx-2">/</span>
            <Link to={`${basePath}?categoria=${frontmatter.category}`} className="hover:text-green-700">
              {category[locale]}
            </Link>
          </nav>

          {/* Header post — animated entrance */}
          <motion.header
            initial={{ opacity: 0, y: reduce ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0.05 : 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-4 text-sm flex-wrap">
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium text-white"
                style={{ backgroundColor: category.color }}
              >
                {category[locale]}
              </span>
              <time dateTime={frontmatter.publishedAt} className="text-gray-500">
                {formatPostDate(frontmatter.publishedAt, locale)}
              </time>
              <span className="text-gray-400">·</span>
              <span className="text-gray-500">{readingTimeMinutes} min di lettura</span>
              {frontmatter.featured && (
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                  In evidenza
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 leading-[1.05] mb-4 tracking-tight">
              {frontmatter.title}
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">{frontmatter.excerpt}</p>
          </motion.header>

          {/* Cover — cinematic entrance */}
          <HeroCover
            src={frontmatter.cover.src}
            alt={frontmatter.cover.alt}
            caption={frontmatter.cover.caption}
            preset={animationPreset}
            priority
          />

          <Reveal preset={animationPreset} id="post-content" as="article" className="prose-custom max-w-3xl mx-auto">
            <MDXProvider components={MDXComponents}>
              <MDXContent />
            </MDXProvider>

            {/* Tags */}
            {frontmatter.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-green-100">
                <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-3">Tag</p>
                <div className="flex flex-wrap gap-2">
                  {frontmatter.tags.map(t => (
                    <span
                      key={t}
                      className="bg-green-50 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="mt-8">
              <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-3">Condividi</p>
              <ShareButtons url={canonical} title={frontmatter.title} />
            </div>

            {/* Author */}
            <div className="mt-8">
              <AuthorBox post={post} />
            </div>

            {/* Chi siamo (home hub) — sempre presente, link multipli */}
            <Reveal preset="editorial" className="mt-12">
              <aside className="not-prose bg-white border border-green-100 rounded-2xl p-8 shadow-sm">
                <div className="flex items-start gap-4 mb-6">
                  <img
                    src="/logo-bottamedi.webp"
                    alt="Logo Bottamedi Frutta e Verdura"
                    className="w-14 h-14 rounded-xl shrink-0"
                    loading="lazy"
                    width={56}
                    height={56}
                  />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">
                      {locale === 'de' ? 'Wer ist Bottamedi?' : 'Chi è Bottamedi?'}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      {locale === 'de'
                        ? 'Familienunternehmen aus Mezzolombardo (Trentino), seit 1974 im Obst- und Gemüsehandel: Marktstand für Privatkunden und HORECA-Großhandel für Restaurants und Hotels in Südtirol.'
                        : 'Azienda familiare di Mezzolombardo, in Trentino, dal 1974 nel settore ortofrutta: banchetto al dettaglio per le famiglie e ingrosso HORECA per ristoranti, hotel e mense di tutto il Trentino Alto Adige.'}
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <Link
                    to={locale === 'de' ? '/de#about' : '/#about'}
                    className="flex items-center justify-between rounded-xl border border-gray-200 hover:border-green-500 px-4 py-3 text-sm font-semibold text-gray-800 hover:text-green-700 transition"
                  >
                    <span>{locale === 'de' ? 'Unsere Geschichte →' : 'La nostra storia →'}</span>
                  </Link>
                  <Link
                    to={locale === 'de' ? '/de#dettaglio' : '/#dettaglio'}
                    className="flex items-center justify-between rounded-xl border border-gray-200 hover:border-green-500 px-4 py-3 text-sm font-semibold text-gray-800 hover:text-green-700 transition"
                  >
                    <span>{locale === 'de' ? 'Marktstand in Mezzolombardo →' : 'Il banchetto a Mezzolombardo →'}</span>
                  </Link>
                  <Link
                    to={locale === 'de' ? '/de#wholesale' : '/#wholesale'}
                    className="flex items-center justify-between rounded-xl border border-gray-200 hover:border-green-500 px-4 py-3 text-sm font-semibold text-gray-800 hover:text-green-700 transition"
                  >
                    <span>{locale === 'de' ? 'HORECA-Großhandel →' : 'Ingrosso HORECA →'}</span>
                  </Link>
                  <Link
                    to={locale === 'de' ? '/de#contact' : '/#contact'}
                    className="flex items-center justify-between rounded-xl border border-gray-200 hover:border-green-500 px-4 py-3 text-sm font-semibold text-gray-800 hover:text-green-700 transition"
                  >
                    <span>{locale === 'de' ? 'Kontakt →' : 'Contatti →'}</span>
                  </Link>
                </div>
              </aside>
            </Reveal>

            {/* CTA HORECA */}
            <Reveal preset="springy" className="mt-10">
              <aside className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-2xl p-8 shadow-xl">
                <h2 className="text-2xl font-bold mb-2">
                  {locale === 'de'
                    ? 'Suchen Sie einen zuverlässigen HORECA-Lieferanten?'
                    : 'Cerchi un fornitore HORECA affidabile?'}
                </h2>
                <p className="mb-4 opacity-95">
                  {locale === 'de'
                    ? 'Seit 1974 beliefern wir Restaurants und Hotels im Trentino-Südtirol mit frischem Obst und Gemüse.'
                    : 'Dal 1974 forniamo ristoranti e hotel del Trentino Alto Adige con frutta e verdura selezionata ogni giorno.'}
                </p>
                <Link
                  to={locale === 'de' ? '/de#wholesale' : '/#wholesale'}
                  className="inline-block bg-white text-green-700 hover:bg-green-50 font-semibold px-5 py-2.5 rounded-xl transition"
                >
                  {locale === 'de' ? 'Zum HORECA-Service' : 'Scopri il servizio HORECA'}
                </Link>
              </aside>
            </Reveal>
          </Reveal>

          <RelatedPosts posts={related} locale={locale} />
        </article>
      </main>

      <Footer language={language} />
    </div>
  )
}

export default BlogPostPage
