import { useState, useEffect, useCallback, useRef } from 'react'
import { throttle } from '../utils/helpers'

export type ScrollDirection = 'up' | 'down' | null

interface UseScrollDirectionOptions {
  threshold?: number
  throttleDelay?: number
}

interface ScrollInfo {
  scrollY: number
  direction: ScrollDirection
  isScrolling: boolean
  scrollPercentage: number
  velocity: number
  isNearTop?: boolean
}

// Basic scroll direction detection
export const useScrollDirection = (options: UseScrollDirectionOptions = {}): ScrollDirection => {
  const { threshold = 10, throttleDelay = 100 } = options
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(null)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  const updateScrollDirection = useCallback(() => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop
    
    if (Math.abs(scrollY - lastScrollY.current) < threshold) {
      ticking.current = false
      return
    }

    setScrollDirection(scrollY > lastScrollY.current ? 'down' : 'up')
    lastScrollY.current = scrollY > 0 ? scrollY : 0
    ticking.current = false
  }, [threshold])

  const onScroll = useCallback(
    throttle(() => {
      if (!ticking.current) {
        requestAnimationFrame(updateScrollDirection)
        ticking.current = true
      }
    }, throttleDelay),
    [updateScrollDirection, throttleDelay]
  )

  useEffect(() => {
    lastScrollY.current = window.pageYOffset || document.documentElement.scrollTop

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])

  return scrollDirection
}

// Advanced scroll information hook
export const useScrollInfo = (options: UseScrollDirectionOptions = {}): ScrollInfo => {
  const { threshold = 10, throttleDelay = 100 } = options
  const [scrollInfo, setScrollInfo] = useState<ScrollInfo>({
    scrollY: 0,
    direction: null,
    isScrolling: false,
    scrollPercentage: 0,
    velocity: 0,
    isNearTop: true
  })

  const lastScrollY = useRef(0)
  const lastTimestamp = useRef(Date.now())
  const scrollTimeout = useRef<NodeJS.Timeout>()
  const ticking = useRef(false)

  const updateScrollInfo = useCallback(() => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop
    const now = Date.now()
    const deltaY = scrollY - lastScrollY.current
    const deltaTime = now - lastTimestamp.current
    
    // Calculate scroll percentage
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollPercentage = scrollHeight > 0 ? (scrollY / scrollHeight) * 100 : 0
    
    // Calculate velocity (pixels per millisecond)
    const velocity = deltaTime > 0 ? Math.abs(deltaY) / deltaTime : 0

    // Determine direction
    let direction: ScrollDirection = null
    if (Math.abs(deltaY) >= threshold) {
      direction = deltaY > 0 ? 'down' : 'up'
    }

    // Calculate isNearTop
    const isNearTop = scrollY <= 100

    setScrollInfo({
      scrollY,
      direction,
      isScrolling: true,
      scrollPercentage: Math.min(100, Math.max(0, scrollPercentage)),
      velocity,
      isNearTop
    })

    // Clear existing timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current)
    }

    // Set isScrolling to false after scrolling stops
    scrollTimeout.current = setTimeout(() => {
      setScrollInfo(prev => ({ ...prev, isScrolling: false }))
    }, 150)

    lastScrollY.current = scrollY > 0 ? scrollY : 0
    lastTimestamp.current = now
    ticking.current = false
  }, [threshold])

  const onScroll = useCallback(
    throttle(() => {
      if (!ticking.current) {
        requestAnimationFrame(updateScrollInfo)
        ticking.current = true
      }
    }, throttleDelay),
    [updateScrollInfo, throttleDelay]
  )

  useEffect(() => {
    lastScrollY.current = window.pageYOffset || document.documentElement.scrollTop
    lastTimestamp.current = Date.now()

    window.addEventListener('scroll', onScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }
    }
  }, [onScroll])

  return scrollInfo
}

// Hook for detecting scroll boundaries
export const useScrollBoundaries = (options: { offset?: number } = {}) => {
  const { offset = 100 } = options
  const [boundaries, setBoundaries] = useState({
    isAtTop: true,
    isAtBottom: false,
    isNearTop: true,
    isNearBottom: false
  })

  const updateBoundaries = useCallback(() => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight

    const isAtTop = scrollY <= 0
    const isAtBottom = scrollY + windowHeight >= documentHeight - 1
    const isNearTop = scrollY <= offset
    const isNearBottom = scrollY + windowHeight >= documentHeight - offset

    setBoundaries({
      isAtTop,
      isAtBottom,
      isNearTop,
      isNearBottom
    })
  }, [offset])

  const onScroll = useCallback(
    throttle(updateBoundaries, 100),
    [updateBoundaries]
  )

  useEffect(() => {
    updateBoundaries() // Initial check
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', updateBoundaries, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateBoundaries)
    }
  }, [onScroll, updateBoundaries])

  return boundaries
}

// Hook for scroll-based header visibility
export const useScrollHeader = (options: {
  hideOnScrollDown?: boolean
  showOnScrollUp?: boolean
  threshold?: number
  offset?: number
} = {}) => {
  const {
    hideOnScrollDown = true,
    showOnScrollUp = true,
    threshold = 10,
    offset = 100
  } = options

  const [isVisible, setIsVisible] = useState(true)
  const [isTransparent, setIsTransparent] = useState(true)
  const direction = useScrollDirection({ threshold })
  const { isNearTop, scrollY } = useScrollInfo()

  useEffect(() => {
    setIsTransparent(isNearTop || false)
    
    if (scrollY < offset) {
      setIsVisible(true)
      return
    }

    if (hideOnScrollDown && direction === 'down') {
      setIsVisible(false)
    } else if (showOnScrollUp && direction === 'up') {
      setIsVisible(true)
    }
  }, [direction, isNearTop, scrollY, offset, hideOnScrollDown, showOnScrollUp])

  return {
    isVisible,
    isTransparent,
    direction,
    scrollY
  }
}

// Hook for element reveal on scroll
export const useScrollReveal = (elements: string[], options: {
  threshold?: number
  rootMargin?: string
} = {}) => {
  const { threshold = 0.1, rootMargin = '0px' } = options
  const [revealedElements, setRevealedElements] = useState<Set<string>>(new Set())

  useEffect(() => {
    const observers = new Map<string, IntersectionObserver>()

    elements.forEach(elementId => {
      const element = document.getElementById(elementId)
      if (!element) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setRevealedElements(prev => new Set([...prev, elementId]))
            observer.disconnect() // One-time reveal
          }
        },
        { threshold, rootMargin }
      )

      observer.observe(element)
      observers.set(elementId, observer)
    })

    return () => {
      observers.forEach(observer => observer.disconnect())
    }
  }, [elements, threshold, rootMargin])

  return {
    revealedElements,
    isRevealed: (elementId: string) => revealedElements.has(elementId)
  }
}

// Hook for scroll-triggered animations
export const useScrollTrigger = (
  trigger: 'scrollDown' | 'scrollUp' | 'reachBottom' | 'reachTop' | 'custom',
  callback: () => void,
  options: {
    threshold?: number
    offset?: number
    once?: boolean
    customCondition?: (scrollInfo: ScrollInfo) => boolean
  } = {}
) => {
  const { threshold = 10, offset = 100, once = false, customCondition } = options
  const scrollInfo = useScrollInfo({ threshold })
  const hasTriggered = useRef(false)

  useEffect(() => {
    if (once && hasTriggered.current) return

    let shouldTrigger = false

    switch (trigger) {
      case 'scrollDown':
        shouldTrigger = scrollInfo.direction === 'down' && scrollInfo.scrollY > offset
        break
      case 'scrollUp':
        shouldTrigger = scrollInfo.direction === 'up' && scrollInfo.scrollY > offset
        break
      case 'reachBottom':
        shouldTrigger = scrollInfo.scrollPercentage >= 95
        break
      case 'reachTop':
        shouldTrigger = scrollInfo.scrollY <= offset
        break
      case 'custom':
        shouldTrigger = customCondition ? customCondition(scrollInfo) : false
        break
    }

    if (shouldTrigger) {
      callback()
      if (once) {
        hasTriggered.current = true
      }
    }
  }, [scrollInfo, trigger, callback, offset, once, customCondition])

  return scrollInfo
}

// Hook for smooth scrolling to elements
export const useSmoothScroll = () => {
  const scrollToElement = useCallback((
    elementId: string,
    options: {
      offset?: number
      behavior?: ScrollBehavior
      block?: ScrollLogicalPosition
    } = {}
  ) => {
    const { offset = 0, behavior = 'smooth', block = 'start' } = options
    const element = document.getElementById(elementId)
    
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior
      })
    }
  }, [])

  const scrollToTop = useCallback((behavior: ScrollBehavior = 'smooth') => {
    window.scrollTo({
      top: 0,
      behavior
    })
  }, [])

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior
    })
  }, [])

  const scrollBy = useCallback((
    amount: number,
    behavior: ScrollBehavior = 'smooth'
  ) => {
    window.scrollBy({
      top: amount,
      behavior
    })
  }, [])

  return {
    scrollToElement,
    scrollToTop,
    scrollToBottom,
    scrollBy
  }
}

// Hook for reading progress indicator
export const useReadingProgress = (contentSelector?: string) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const calculateProgress = () => {
      let scrollHeight: number
      let scrollTop: number
      let clientHeight: number

      if (contentSelector) {
        const element = document.querySelector(contentSelector)
        if (element) {
          const rect = element.getBoundingClientRect()
          const elementTop = window.pageYOffset + rect.top
          const elementHeight = element.scrollHeight
          scrollTop = window.pageYOffset - elementTop
          scrollHeight = elementHeight - window.innerHeight
          clientHeight = window.innerHeight
        } else {
          return
        }
      } else {
        scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
        clientHeight = document.documentElement.clientHeight
      }

      if (scrollHeight <= 0) {
        setProgress(0)
        return
      }

      const progress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100))
      setProgress(progress)
    }

    const onScroll = throttle(calculateProgress, 50)
    
    calculateProgress() // Initial calculation
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', calculateProgress, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', calculateProgress)
    }
  }, [contentSelector])

  return progress
}

// Hook for scroll-based parallax effects
export const useScrollParallax = (speed: number = 0.5, elementRef?: React.RefObject<HTMLElement>) => {
  const [offset, setOffset] = useState(0)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = elementRef?.current
    
    const handleScroll = () => {
      if (element) {
        const rect = element.getBoundingClientRect()
        const isVisible = rect.bottom >= 0 && rect.top <= window.innerHeight
        setIsInView(isVisible)
        
        if (isVisible) {
          const scrolled = window.pageYOffset
          const rate = scrolled * -speed
          setOffset(rate)
        }
      } else {
        const scrolled = window.pageYOffset
        const rate = scrolled * -speed
        setOffset(rate)
        setIsInView(true)
      }
    }

    const onScroll = throttle(handleScroll, 16) // ~60fps
    
    handleScroll() // Initial calculation
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [speed, elementRef])

  return {
    offset,
    isInView,
    style: {
      transform: `translateY(${offset}px)`,
      willChange: 'transform'
    }
  }
}

export default useScrollDirection
