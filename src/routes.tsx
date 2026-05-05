import type { RouteRecord } from 'vite-react-ssg'
import React from 'react'
import RootLayout from './RootLayout'
import HomePage from './pages/HomePage'
import BlogIndexPage from './pages/BlogIndexPage'
import BlogPostPage from './pages/BlogPostPage'
import NotFoundPage from './pages/NotFoundPage'

const BlogIndexIt = () => React.createElement(BlogIndexPage, { locale: 'it' })
const BlogIndexDe = () => React.createElement(BlogIndexPage, { locale: 'de' })
const BlogPostIt = () => React.createElement(BlogPostPage, { locale: 'it' })
const BlogPostDe = () => React.createElement(BlogPostPage, { locale: 'de' })

export const routes: RouteRecord[] = [
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: 'blog', Component: BlogIndexIt },
      { path: 'blog/:slug', Component: BlogPostIt },
      { path: 'de', Component: HomePage },
      { path: 'de/blog', Component: BlogIndexDe },
      { path: 'de/blog/:slug', Component: BlogPostDe },
      { path: '404', Component: NotFoundPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
]
