import React from 'react'
import { Link } from 'react-router-dom'
import SEO from '@/components/seo/SEO'
import { SITE } from '@/lib/siteConfig'
import { buildCanonical, buildPageTitle } from '@/lib/seo'

const NotFoundPage: React.FC = () => {
  return (
    <>
      <SEO
        title={buildPageTitle(['Pagina non trovata (404)'], 'it')}
        description="La pagina che stai cercando non esiste o è stata spostata. Torna alla home di Bottamedi o esplora il blog."
        canonical={buildCanonical('/404')}
        locale="it"
        noindex
      />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-8 text-center">
        <img src="/logo-bottamedi.webp" alt="Bottamedi" className="w-24 h-24 mb-6" width={96} height={96} />
        <p className="text-sm font-medium text-green-600 uppercase tracking-wider mb-2">Errore 404</p>
        <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-4">Pagina non trovata</h1>
        <p className="text-green-800 max-w-lg mb-8">
          La pagina che cercavi non esiste o è stata spostata. Dai un'occhiata alla home, al blog o contattaci
          direttamente.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            to="/"
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-xl transition shadow-md"
          >
            Torna alla Home
          </Link>
          <Link
            to="/blog"
            className="border border-green-600 text-green-700 hover:bg-green-50 font-medium px-6 py-3 rounded-xl transition"
          >
            Vai al Blog
          </Link>
          <a
            href={`tel:${SITE.phones.banchetto}`}
            className="border border-green-600 text-green-700 hover:bg-green-50 font-medium px-6 py-3 rounded-xl transition"
          >
            Chiamaci
          </a>
        </div>
      </div>
    </>
  )
}

export default NotFoundPage
