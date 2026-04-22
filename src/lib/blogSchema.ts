import { z } from 'zod'
import { BLOG_CATEGORIES } from './siteConfig'

const categoryKeys = Object.keys(BLOG_CATEGORIES) as [keyof typeof BLOG_CATEGORIES, ...Array<keyof typeof BLOG_CATEGORIES>]

export const PostFrontmatterSchema = z.object({
  title: z.string().min(10).max(90),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be kebab-case'),
  excerpt: z.string().min(60).max(200),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'ISO date YYYY-MM-DD'),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  category: z.enum(categoryKeys),
  tags: z.array(z.string().min(2).max(30)).min(1).max(8),
  locale: z.enum(['it', 'de']).default('it'),
  translations: z
    .object({
      it: z.string().optional(),
      de: z.string().optional(),
    })
    .optional(),
  author: z
    .object({
      name: z.string(),
      role: z.string().optional(),
    })
    .default({ name: 'Famiglia Bottamedi', role: 'Fruttivendoli dal 1974' }),
  cover: z.object({
    src: z.string().url().or(z.string().startsWith('/')),
    alt: z.string().min(5),
    caption: z.string().optional(),
  }),
  animation: z.enum(['springy', 'cinema', 'editorial', 'snappy', 'organic']).default('editorial'),
  mood: z.enum(['spring', 'summer', 'autumn', 'winter', 'warm', 'cool', 'heritage', 'minimal']).optional(),
  gallery: z
    .array(
      z.object({
        src: z.string(),
        alt: z.string().min(5),
        caption: z.string().optional(),
      })
    )
    .optional(),
  seo: z
    .object({
      metaTitle: z.string().max(70).optional(),
      metaDescription: z.string().min(80).max(170).optional(),
      keywords: z.array(z.string()).optional(),
      noindex: z.boolean().optional(),
    })
    .optional(),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  targetKeyword: z.string().optional(),
  relatedSlugs: z.array(z.string()).optional(),
})

export type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>
