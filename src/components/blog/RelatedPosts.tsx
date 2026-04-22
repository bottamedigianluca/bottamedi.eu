import React from 'react'
import type { BlogPost } from '@/lib/blog'
import PostCard from './PostCard'
import type { Locale } from '@/lib/siteConfig'

const RelatedPosts: React.FC<{ posts: BlogPost[]; locale?: Locale }> = ({ posts, locale = 'it' }) => {
  if (posts.length === 0) return null
  return (
    <section className="mt-16 pt-10 border-t border-green-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {locale === 'de' ? 'Das könnte dich auch interessieren' : 'Potrebbe interessarti anche'}
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map(p => (
          <PostCard key={p.frontmatter.slug} post={p} locale={locale} />
        ))}
      </div>
    </section>
  )
}

export default RelatedPosts
