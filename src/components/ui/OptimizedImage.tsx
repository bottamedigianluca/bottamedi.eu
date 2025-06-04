import React, { useState, useCallback, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
  priority?: boolean
  placeholder?: 'blur' | 'empty' | 'skeleton'
  sizes?: string
  quality?: number
  onLoad?: () => void
  onError?: () => void
  lazy?: boolean
  aspectRatio?: string
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  style = {},
  priority = false,
  placeholder = 'skeleton',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 85,
  onLoad,
  onError,
  lazy = true,
  aspectRatio,
  objectFit = 'cover'
}) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading')
  const [inView, setInView] = useState(!lazy || priority)
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Intersection Observer per lazy loading
  useEffect(() => {
    if (!lazy || priority) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [lazy, priority])

  // Preload per immagini prioritarie
  useEffect(() => {
    if (priority && src) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
      
      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link)
        }
      }
    }
  }, [priority, src])

  const handleImageLoad = useCallback(() => {
    setImageState('loaded')
    onLoad?.()
    
    // Track successful image load
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'image_load_success', {
        event_category: 'performance',
        event_label: src,
        value: 1
      })
    }
  }, [onLoad, src])

  const handleImageError = useCallback(() => {
    setImageState('error')
    onError?.()
    
    // Track image load errors
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'image_load_error', {
        event_category: 'performance',
        event_label: src,
        value: 1
      })
    }
    
    console.warn(`Failed to load image: ${src}`)
  }, [onError, src])

  // Generate responsive srcSet
  const generateSrcSet = (baseSrc: string) => {
    if (!baseSrc.includes('.webp') && !baseSrc.includes('.jpg') && !baseSrc.includes('.png')) {
      return baseSrc
    }
    
    const extension = baseSrc.split('.').pop()
    const baseName = baseSrc.replace(`.${extension}`, '')
    
    return [
      `${baseName}_400w.${extension} 400w`,
      `${baseName}_800w.${extension} 800w`,
      `${baseName}_1200w.${extension} 1200w`,
      `${baseName}_1600w.${extension} 1600w`,
      `${baseSrc} 2000w`
    ].join(', ')
  }

  // Placeholder components
  const SkeletonPlaceholder = () => (
    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse">
      <div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"
        style={{
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite'
        }}
      />
    </div>
  )

  const BlurPlaceholder = () => (
    <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200 filter blur-sm" />
  )

  const ErrorPlaceholder = () => (
    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
      <div className="text-center text-gray-400">
        <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-xs">Immagine non disponibile</p>
      </div>
    </div>
  )

  const containerStyles: React.CSSProperties = {
    ...style,
    position: 'relative',
    overflow: 'hidden',
    aspectRatio: aspectRatio,
    display: 'block'
  }

  const imageStyles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: objectFit,
    transition: 'opacity 0.3s ease-in-out',
    opacity: imageState === 'loaded' ? 1 : 0
  }

  return (
    <>
      {/* CSS per shimmer effect */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
      
      <div 
        ref={containerRef}
        className={`relative ${className}`}
        style={containerStyles}
      >
        {/* Placeholder */}
        {imageState === 'loading' && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            {placeholder === 'skeleton' && <SkeletonPlaceholder />}
            {placeholder === 'blur' && <BlurPlaceholder />}
          </motion.div>
        )}

        {/* Error state */}
        {imageState === 'error' && <ErrorPlaceholder />}

        {/* Main image */}
        {inView && imageState !== 'error' && (
          <motion.img
            ref={imgRef}
            src={src}
            alt={alt}
            className="absolute inset-0 w-full h-full"
            style={imageStyles}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'low'}
            srcSet={generateSrcSet(src)}
            sizes={sizes}
            onLoad={handleImageLoad}
            onError={handleImageError}
            // Modern performance attributes
            {...(priority && { 'data-priority': 'true' })}
          />
        )}

        {/* Loading indicator for priority images */}
        {priority && imageState === 'loading' && (
          <div className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
        )}
      </div>
    </>
  )
}

export default React.memo(OptimizedImage)

// Hook per lazy loading avanzato
export const useImagePreloader = (imageSrcs: string[]) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  
  useEffect(() => {
    const preloadImage = (src: string) => {
      return new Promise<string>((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(src)
        img.onerror = reject
        img.src = src
      })
    }

    const preloadAll = async () => {
      for (const src of imageSrcs) {
        try {
          await preloadImage(src)
          setLoadedImages(prev => new Set(prev).add(src))
        } catch (error) {
          console.warn(`Failed to preload image: ${src}`)
        }
      }
    }

    preloadAll()
  }, [imageSrcs])

  return loadedImages
}

// Utility per ottimizzazione batch delle immagini
export const optimizeImageBatch = (images: string[], callback: (progress: number) => void) => {
  let loaded = 0
  const total = images.length

  images.forEach(src => {
    const img = new Image()
    img.onload = img.onerror = () => {
      loaded++
      callback((loaded / total) * 100)
    }
    img.src = src
  })
}