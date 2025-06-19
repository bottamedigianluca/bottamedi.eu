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
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw', // Ottimizzato per mobile
  quality = 85,
  onLoad,
  onError,
  lazy = true,
  aspectRatio,
  objectFit = 'cover'
}) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading')
  const [inView, setInView] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Intersection Observer ottimizzato per mobile
  useEffect(() => {
    if (!lazy || priority) {
      setInView(true)
      return
    }

    // Cleanup dell'observer precedente
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true)
            observerRef.current?.disconnect()
          }
        })
      },
      {
        rootMargin: '100px', // Aumentato per mobile per precaricamento anticipato
        threshold: 0.01 // Soglia molto bassa per mobile
      }
    )

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current)
    }

    return () => {
      observerRef.current?.disconnect()
    }
  }, [lazy, priority])

  // Preload ottimizzato per immagini prioritarie
  useEffect(() => {
    if (priority && src) {
      // Verifica se supporta webp per ottimizzazione mobile
      const supportsWebP = () => {
        const canvas = document.createElement('canvas')
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
      }

      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      
      // Aggiungi attributi per mobile
      if (supportsWebP()) {
        link.setAttribute('type', 'image/webp')
      }
      
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
    
    // Track successful image load con performance
    if (typeof window !== 'undefined' && window.gtag) {
      const loadTime = performance.now()
      window.gtag('event', 'image_load_success', {
        event_category: 'performance',
        event_label: src,
        custom_parameter_1: 'mobile_optimized',
        value: Math.round(loadTime)
      })
    }
  }, [onLoad, src])

  const handleImageError = useCallback(() => {
    setImageState('error')
    onError?.()
    
    // Track image load errors con fallback
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'image_load_error', {
        event_category: 'performance',
        event_label: src,
        custom_parameter_1: 'error_mobile',
        value: 1
      })
    }
    
    console.warn(`Errore caricamento immagine: ${src}`)
  }, [onError, src])

  // Placeholder components ottimizzati
  const SkeletonPlaceholder = () => (
    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200">
      <div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"
        style={{
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.2s infinite' // Accelerato per mobile
        }}
      />
    </div>
  )

  const BlurPlaceholder = () => (
    <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200 filter blur-sm" />
  )

  const ErrorPlaceholder = () => (
    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
      <div className="text-center text-gray-400 p-4">
        <div className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 bg-gray-200 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-xs sm:text-sm font-medium">
          {alt ? 'Immagine non disponibile' : 'Caricamento fallito'}
        </p>
      </div>
    </div>
  )

  const containerStyles: React.CSSProperties = {
    ...style,
    position: 'relative',
    overflow: 'hidden',
    aspectRatio: aspectRatio,
    display: 'block',
    // Ottimizzazioni mobile
    backfaceVisibility: 'hidden',
    transform: 'translateZ(0)', // Force hardware acceleration
    WebkitBackfaceVisibility: 'hidden'
  }

  const imageStyles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: objectFit,
    transition: 'opacity 0.3s ease-in-out',
    opacity: imageState === 'loaded' ? 1 : 0,
    // Ottimizzazioni mobile
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    transform: 'translateZ(0)'
  }

  return (
    <>
      {/* CSS ottimizzato per mobile */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.2s infinite;
        }
        
        /* Ottimizzazioni performance mobile */
        .mobile-optimized-image {
          -webkit-transform: translateZ(0);
          transform: translateZ(0);
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
      `}</style>
      
      <div 
        ref={containerRef}
        className={`relative mobile-optimized-image ${className}`}
        style={containerStyles}
      >
        {/* Placeholder ottimizzato */}
        {imageState === 'loading' && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            {placeholder === 'skeleton' && <SkeletonPlaceholder />}
            {placeholder === 'blur' && <BlurPlaceholder />}
            {placeholder === 'empty' && <div className="absolute inset-0 bg-gray-100" />}
          </motion.div>
        )}

        {/* Error state ottimizzato */}
        {imageState === 'error' && <ErrorPlaceholder />}

        {/* Main image con ottimizzazioni mobile */}
        {inView && (
          <motion.img
            ref={imgRef}
            src={src}
            alt={alt}
            className="absolute inset-0 w-full h-full mobile-optimized-image"
            style={imageStyles}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'low'}
            sizes={sizes}
            onLoad={handleImageLoad}
            onError={handleImageError}
            // Attributi ottimizzati per mobile
            {...(priority && { 'data-priority': 'true' })}
            crossOrigin="anonymous" // Per CORS se necessario
            referrerPolicy="no-referrer-when-downgrade"
          />
        )}

        {/* Loading indicator ottimizzato per mobile */}
        {priority && imageState === 'loading' && (
          <div className="absolute top-2 right-2 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse shadow-sm" />
        )}

        {/* Indicatore di priorità per debug */}
        {process.env.NODE_ENV === 'development' && priority && (
          <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-1 rounded-br">
            P
          </div>
        )}
      </div>
    </>
  )
}

export default React.memo(OptimizedImage)

// Hook ottimizzato per preloading su mobile
export const useImagePreloader = (imageSrcs: string[]) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [loadingProgress, setLoadingProgress] = useState(0)
  
  useEffect(() => {
    if (!imageSrcs.length) return

    const preloadImage = (src: string) => {
      return new Promise<string>((resolve, reject) => {
        const img = new Image()
        
        // Timeout per evitare hang su mobile
        const timeout = setTimeout(() => {
          reject(new Error(`Timeout loading image: ${src}`))
        }, 10000) // 10 secondi timeout

        img.onload = () => {
          clearTimeout(timeout)
          resolve(src)
        }
        
        img.onerror = () => {
          clearTimeout(timeout)
          reject(new Error(`Failed to load image: ${src}`))
        }
        
        img.src = src
      })
    }

    const preloadAll = async () => {
      let loaded = 0
      const total = imageSrcs.length

      for (const src of imageSrcs) {
        try {
          await preloadImage(src)
          setLoadedImages(prev => new Set(prev).add(src))
          loaded++
          setLoadingProgress((loaded / total) * 100)
        } catch (error) {
          console.warn(`Failed to preload image: ${src}`, error)
          loaded++
          setLoadingProgress((loaded / total) * 100)
        }
      }
    }

    preloadAll()
  }, [imageSrcs])

  return { loadedImages, loadingProgress }
}

// Utility per batch ottimizzato su mobile
export const optimizeImageBatch = (
  images: string[], 
  callback: (progress: number) => void,
  options: { timeout?: number; concurrent?: number } = {}
) => {
  const { timeout = 8000, concurrent = 3 } = options // Ridotto concurrent per mobile
  let loaded = 0
  const total = images.length

  const loadImage = (src: string) => {
    return new Promise<void>((resolve) => {
      const img = new Image()
      const timeoutId = setTimeout(() => {
        console.warn(`Timeout loading: ${src}`)
        resolve()
      }, timeout)

      img.onload = img.onerror = () => {
        clearTimeout(timeoutId)
        loaded++
        callback((loaded / total) * 100)
        resolve()
      }
      
      img.src = src
    })
  }

  // Batch processing per evitare sovraccarico su mobile
  const processBatch = async (batch: string[]) => {
    await Promise.all(batch.map(loadImage))
  }

  // Dividi in batch per performance mobile
  const batches = []
  for (let i = 0; i < images.length; i += concurrent) {
    batches.push(images.slice(i, i + concurrent))
  }

  // Processa batch sequenzialmente
  batches.reduce(
    (promise, batch) => promise.then(() => processBatch(batch)),
    Promise.resolve()
  )
}
