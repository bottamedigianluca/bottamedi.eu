import React, { useEffect, useState } from 'react'

interface Heading {
  id: string
  text: string
  level: number
}

const TableOfContents: React.FC<{ contentSelector?: string }> = ({ contentSelector = '#post-content' }) => {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const root = document.querySelector(contentSelector)
    if (!root) return
    const nodes = Array.from(root.querySelectorAll('h2, h3')) as HTMLElement[]
    const parsed: Heading[] = nodes
      .filter(n => n.id)
      .map(n => ({ id: n.id, text: n.textContent ?? '', level: Number(n.tagName.substring(1)) }))
    setHeadings(parsed)

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: [0, 1] }
    )
    nodes.forEach(n => observer.observe(n))
    return () => observer.disconnect()
  }, [contentSelector])

  if (headings.length < 3) return null

  return (
    <nav aria-label="Indice dei contenuti" className="hidden lg:block sticky top-24 max-h-[calc(100vh-8rem)] overflow-auto">
      <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-3">In questo articolo</p>
      <ul className="space-y-2 text-sm border-l border-green-200 pl-4">
        {headings.map(h => (
          <li key={h.id} className={h.level === 3 ? 'pl-3' : ''}>
            <a
              href={`#${h.id}`}
              className={`block transition-colors ${
                activeId === h.id
                  ? 'text-green-700 font-semibold'
                  : 'text-gray-600 hover:text-green-700'
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default TableOfContents
