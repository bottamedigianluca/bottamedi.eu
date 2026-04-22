import React from 'react'
import { Link } from 'react-router-dom'
import type { BlogPost } from '@/lib/blog'
import { formatPostDate } from '@/lib/blog'
import { BLOG_CATEGORIES, type Locale } from '@/lib/siteConfig'

interface Props {
  post: BlogPost
  locale?: Locale
  priority?: boolean
}

const PostCard: React.FC<Props> = ({ post, locale = 'it', priority = false }) => {
  const { frontmatter, readingTimeMinutes } = post
  const category = BLOG_CATEGORIES[frontmatter.category]
  const url = locale === 'de' ? `/de/blog/${frontmatter.slug}` : `/blog/${frontmatter.slug}`

  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-green-100 flex flex-col h-full">
      <Link to={url} className="block overflow-hidden aspect-[16/10] bg-green-50">
        <img
          src={frontmatter.cover.src}
          alt={frontmatter.cover.alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          width={800}
          height={500}
        />
      </Link>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-3 text-xs">
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
          <span className="text-gray-500">{readingTimeMinutes} min</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors line-clamp-2">
          <Link to={url}>{frontmatter.title}</Link>
        </h3>
        <p className="text-gray-600 line-clamp-3 mb-4 flex-1">{frontmatter.excerpt}</p>
        <Link
          to={url}
          className="text-green-700 hover:text-green-800 font-medium text-sm inline-flex items-center gap-1 mt-auto"
        >
          {locale === 'de' ? 'Weiterlesen' : 'Leggi l\'articolo'}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  )
}

export default PostCard
