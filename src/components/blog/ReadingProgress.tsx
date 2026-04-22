import React, { useEffect, useState } from 'react'

const ReadingProgress: React.FC = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const scrollTop = el.scrollTop
      const height = el.scrollHeight - el.clientHeight
      const pct = height > 0 ? Math.min(100, Math.max(0, (scrollTop / height) * 100)) : 0
      setProgress(pct)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-transparent z-50 pointer-events-none" aria-hidden="true">
      <div
        className="h-full bg-gradient-to-r from-green-500 to-green-700 transition-[width] duration-75"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export default ReadingProgress
