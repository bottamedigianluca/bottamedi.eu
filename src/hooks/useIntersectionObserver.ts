import { useEffect, useRef, useState } from 'react'
import type { UseIntersectionObserverOptions, UseIntersectionObserverReturn } from '../types'

export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn => {
  const {
    threshold = 0.1,
    root = null,
    rootMargin = '0px',
    triggerOnce = false
  } = options

  const [inView, setInView] = useState(false)
  const [entry, setEntry] = useState<IntersectionObserverEntry>()
  const ref = useRef<Element>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting
        
        setInView(isIntersecting)
        setEntry(entry)

        // If triggerOnce is true and element is in view, disconnect observer
        if (triggerOnce && isIntersecting) {
          observer.disconnect()
        }
      },
      {
        threshold,
        root,
        rootMargin
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, root, rootMargin, triggerOnce])

  return { ref, inView, entry }
}

// Advanced hook with multiple thresholds
export const useIntersectionObserverAdvanced = (
  thresholds: number[] = [0, 0.25, 0.5, 0.75, 1],
  options: Omit<UseIntersectionObserverOptions, 'threshold'> = {}
) => {
  const { root = null, rootMargin = '0px', triggerOnce = false } = options
  
  const [intersectionRatio, setIntersectionRatio] = useState(0)
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [entry, setEntry] = useState<IntersectionObserverEntry>()
  const ref = useRef<Element>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersectionRatio(entry.intersectionRatio)
        setIsIntersecting(entry.isIntersecting)
        setEntry(entry)

        if (triggerOnce && entry.isIntersecting) {
          observer.disconnect()
        }
      },
      {
        threshold: thresholds,
        root,
        rootMargin
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [thresholds, root, rootMargin, triggerOnce])

  return {
    ref,
    intersectionRatio,
    isIntersecting,
    entry,
    isPartiallyVisible: intersectionRatio > 0,
    isFullyVisible: intersectionRatio === 1
  }
}

// Hook for lazy loading images
export const useLazyImage = (src: string, placeholder?: string) => {
  const [imageSrc, setImageSrc] = useState(placeholder || '')
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const { ref, inView } = useIntersectionObserver({ triggerOnce: true })

  useEffect(() => {
    if (inView && src) {
      const img = new Image()
      
      img.onload = () => {
        setImageSrc(src)
        setIsLoaded(true)
      }
      
      img.onerror = () => {
        setIsError(true)
      }
      
      img.src = src
    }
  }, [inView, src])

  return {
    ref,
    src: imageSrc,
    isLoaded,
    isError,
    inView
  }
}

// Hook for animating elements on scroll
export const useScrollAnimation = (
  options: UseIntersectionObserverOptions & {
    animationClass?: string
    delay?: number
  } = {}
) => {
  const { animationClass = 'animate-in', delay = 0, ...observerOptions } = options
  const [hasAnimated, setHasAnimated] = useState(false)
  const { ref, inView } = useIntersectionObserver({
    ...observerOptions,
    triggerOnce: true
  })

  useEffect(() => {
    if (inView && !hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true)
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [inView, hasAnimated, delay])

  return {
    ref,
    shouldAnimate: hasAnimated,
    inView,
    animationClass: hasAnimated ? animationClass : ''
  }
}

// Hook for progressive loading content
export const useProgressiveContent = <T>(
  content: T[],
  options: UseIntersectionObserverOptions & {
    itemsPerLoad?: number
    loadDelay?: number
  } = {}
) => {
  const { itemsPerLoad = 5, loadDelay = 0, ...observerOptions } = options
  const [visibleItems, setVisibleItems] = useState<T[]>(content.slice(0, itemsPerLoad))
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const { ref, inView } = useIntersectionObserver(observerOptions)

  const hasMore = visibleItems.length < content.length

  useEffect(() => {
    if (inView && hasMore && !isLoadingMore) {
      setIsLoadingMore(true)
      
      const timer = setTimeout(() => {
        const nextItems = content.slice(
          visibleItems.length,
          visibleItems.length + itemsPerLoad
        )
        setVisibleItems(prev => [...prev, ...nextItems])
        setIsLoadingMore(false)
      }, loadDelay)

      return () => clearTimeout(timer)
    }
  }, [inView, hasMore, isLoadingMore, content, visibleItems.length, itemsPerLoad, loadDelay])

  return {
    ref,
    visibleItems,
    hasMore,
    isLoadingMore,
    loadedCount: visibleItems.length,
    totalCount: content.length
  }
}

// Hook for section navigation highlighting
export const useSectionObserver = (sectionIds: string[]) => {
  const [activeSection, setActiveSection] = useState<string>('')
  
  useEffect(() => {
    const observers = sectionIds.map(id => {
      const element = document.getElementById(id)
      if (!element) return null

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id)
          }
        },
        {
          threshold: 0.3,
          rootMargin: '-20% 0px -70% 0px'
        }
      )

      observer.observe(element)
      return observer
    }).filter(Boolean)

    return () => {
      observers.forEach(observer => observer?.disconnect())
    }
  }, [sectionIds])

  return activeSection
}

// Hook for parallax effects
export const useParallax = (speed: number = 0.5) => {
  const [offset, setOffset] = useState(0)
  const { ref, inView } = useIntersectionObserver()

  useEffect(() => {
    if (!inView) return

    const handleScroll = () => {
      const element = ref.current
      if (!element) return

      const rect = element.getBoundingClientRect()
      const scrolled = window.pageYOffset
      const rate = scrolled * -speed
      
      setOffset(rate)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [inView, speed])

  return {
    ref,
    offset,
    style: {
      transform: `translateY(${offset}px)`
    }
  }
}

// Hook for counting animations
export const useCountUp = (
  endValue: number,
  options: {
    startValue?: number
    duration?: number
    easing?: 'linear' | 'easeOut' | 'easeInOut'
    formatNumber?: (value: number) => string
    triggerOnce?: boolean
  } = {}
) => {
  const {
    startValue = 0,
    duration = 2000,
    easing = 'easeOut',
    formatNumber = (v) => Math.round(v).toString(),
    triggerOnce = true
  } = options

  const [count, setCount] = useState(startValue)
  const { ref, inView } = useIntersectionObserver({ triggerOnce })

  useEffect(() => {
    if (!inView) return

    const startTime = Date.now()
    const difference = endValue - startValue

    const easingFunctions = {
      linear: (t: number) => t,
      easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
      easeInOut: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    }

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easingFunctions[easing](progress)
      
      const currentValue = startValue + (difference * easedProgress)
      setCount(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    animate()
  }, [inView, endValue, startValue, duration, easing])

  return {
    ref,
    count,
    formattedCount: formatNumber(count),
    isComplete: count === endValue
  }
}

export default useIntersectionObserver