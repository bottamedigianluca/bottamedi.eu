import React, { useState } from 'react'

interface Props {
  url: string
  title: string
}

const ShareButtons: React.FC<Props> = ({ url, title }) => {
  const [copied, setCopied] = useState(false)
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* noop */
    }
  }

  const base =
    'inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition border'

  return (
    <div className="flex flex-wrap gap-2" aria-label="Condividi">
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} border-green-200 text-green-700 hover:bg-green-50`}
      >
        WhatsApp
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} border-green-200 text-green-700 hover:bg-green-50`}
      >
        Facebook
      </a>
      <a
        href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}
        className={`${base} border-green-200 text-green-700 hover:bg-green-50`}
      >
        Email
      </a>
      <button
        type="button"
        onClick={copy}
        className={`${base} border-green-200 text-green-700 hover:bg-green-50`}
        aria-live="polite"
      >
        {copied ? 'Copiato!' : 'Copia link'}
      </button>
    </div>
  )
}

export default ShareButtons
