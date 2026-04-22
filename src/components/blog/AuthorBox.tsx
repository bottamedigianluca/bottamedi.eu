import React from 'react'
import type { BlogPost } from '@/lib/blog'

const AuthorBox: React.FC<{ post: BlogPost }> = ({ post }) => {
  const { author } = post.frontmatter
  return (
    <aside className="bg-green-50 border border-green-100 rounded-2xl p-6 flex gap-4 items-center">
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
        {author.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
      </div>
      <div>
        <p className="font-semibold text-gray-900">{author.name}</p>
        {author.role && <p className="text-sm text-gray-600">{author.role}</p>}
      </div>
    </aside>
  )
}

export default AuthorBox
