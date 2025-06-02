import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

interface HeroSectionProps {
  language: 'it' | 'de'
  inView: boolean
}

const translations = {
  it: {
    title: 'BOTTAMEDI',
    subtitle: 'Frutta e Verdura',
    tagline: 'Qualità Inarrivabile',
    tagline2: 'Passione Familiare',
    since: 'Da oltre',
    yearsCount: 50,
    yearsLabel: 'anni',
    cta1: 'Al Banchetto',
    cta2: 'Ingrosso',
    cta3: 'La Nostra Storia'
  },
  de: {
    title: 'BOTTAMEDI',
    subtitle: 'Obst und Gemüse',
    tagline: 'Unübertreffliche Qualität',
    tagline2: 'Familiäre Leidenschaft',
    since: 'Seit über',
    yearsCount: 50,
    yearsLabel: 'Jahren',
    cta1: 'Marktstand',
    cta2: 'Großhandel', 
    cta3: 'Unsere Geschichte'
  }
}

// 🚀 PERFORMANCE: Memoized Counter Hook con requestAnimationFrame
const useOptimizedCounter = (endValue: number, inView: boolean, duration: number = 2000) => {
  const [count, setCount] = useState(0)
  const animationRef = useRef<number>()
  const startTimeRef = useRef<number>()

  useEffect(() => {
    if (!inView) return

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) startTimeRef.current = currentTime
      const progress = Math.min((currentTime - startTimeRef.current) / duration, 1)
      
      // Easing function ottimizzata
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = easeOutQuart * endValue
      
      setCount(Math.floor(currentValue))

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setCount(endValue)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [inView, endValue, duration])

  return count
}

// 🎬 PERFORMANCE: Memoized Video Component
const OptimizedVideoBackground: React.FC<{ inView: boolean }> = React.memo(({ inView }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !inView) return

    const playVideo = async () => {
      try {
        await video.play()
        console.log('📹 Video playing')
      } catch (error) {
        console.warn('📹 Video autoplay failed:', error)
        setVideoError(true)
      }
    }

    if (video.readyState >= 2) {
      playVideo()
    } else {
      video.addEventListener('loadeddata', playVideo, { once: true })
    }

    return () => {
      video.removeEventListener('loadeddata', playVideo)
    }
  }, [inView])

  const handleLoadedData = useCallback(() => {
    setVideoLoaded(true)
  }, [])

  const handleError = useCallback(() => {
    setVideoError(true)
    console.warn('📹 Video failed to load')
  }, [])

  // Fallback per dispositivi che non supportano il video
  if (videoError) {
    return (
      <div 
        className="w-full h-full bg-gradient-to-br from-green-600 via-green-500 to-green-700"
        style={{
          backgroundImage: 'url(/images/poster.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
    )
  }

  return (
    <>
      {/* Loading placeholder */}
      {!videoLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-500 to-green-700 animate-pulse" />
      )}
      
      <video
        ref={videoRef}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          videoLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/poster.webp"
        onLoadedData={handleLoadedData}
        onError={handleError}
        style={{ willChange: 'opacity' }}
      >
        <source src="/videos/hero-video-verdure-rotanti.mp4" type="video/mp4" />
      </video>
    </>
  )
})

OptimizedVideoBackground.displayName = 'OptimizedVideoBackground'

const HeroSection: React.FC<HeroSectionProps> = ({ language, inView }) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const shouldReduceMotion = useReducedMotion()
  
  const t = useMemo(() => translations[language], [language])
  
  // 🚀 PERFORMANCE: Parallax ottimizzato con range limitato
  const y = useTransform(scrollY, [0, 800], [0, shouldReduceMotion ? 0 : 60])
  const opacity = useTransform(scrollY, [0, 600], [1, 0.4])

  // 📊 Counter animato ottimizzato
  const count = useOptimizedCounter(t.yearsCount, inView, 2000)

  // 🎯 PERFORMANCE: Memoized click handlers
  const handleCTAClick = useCallback((type: 'dettaglio' | 'services' | 'about') => {
    const sectionMap = {
      dettaglio: 'dettaglio',
      services: 'services',
      about: 'about'
    }
    
    const element = document.getElementById(sectionMap[type])
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }

    // 🎯 Haptic feedback ottimizzato
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(25)
      } catch (e) {
        console.log('Haptic non disponibile')
      }
    }
  }, [])

  // 🎨 PERFORMANCE: Memoized animation variants
  const animationVariants = useMemo(() => ({
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: shouldReduceMotion ? 0.1 : 0.8, ease: "easeOut" }
  }), [shouldReduceMotion])

  const titleVariants = useMemo(() => ({
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: shouldReduceMotion ? 0 : 0.4, duration: shouldReduceMotion ? 0.1 : 0.6 }
  }), [shouldReduceMotion])

  const subtitleVariants = useMemo(() => ({
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: shouldReduceMotion ? 0 : 0.6, duration: shouldReduceMotion ? 0.1 : 0.5 }
  }), [shouldReduceMotion])

  // 🎨 CTAs memoizzati per performance
  const ctaButtons = useMemo(() => [
    { type: 'dettaglio' as const, label: t.cta1, icon: '🛒', gradient: 'from-green-500 to-green-600' },
    { type: 'services' as const, label: t.cta2, icon: '🚛', gradient: 'from-blue-500 to-blue-600' },
    { type: 'about' as const, label: t.cta3, icon: '🌱', gradient: 'from-gray-500 to-gray-600' }
  ], [t])

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ willChange: 'transform' }}
    >
      {/* 🎬 Background Video Ottimizzato */}
      <div className="absolute inset-0 w-full h-full">
        <OptimizedVideoBackground inView={inView} />
        
        {/* Overlay ottimizzato con gradients ridotti */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      </div>

      {/* 📱 Content ottimizzato e centrato */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
      >
        {/* 🏆 Header ottimizzato */}
        <motion.div
          initial={animationVariants.initial}
          animate={animationVariants.animate}
          transition={animationVariants.transition}
          className="mb-8"
        >
          {/* Titolo principale ottimizzato */}
          <motion.h1
            initial={titleVariants.initial}
            animate={titleVariants.animate}
            transition={titleVariants.transition}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-4 text-center"
            style={{
              fontFamily: "'Playfair Display', serif",
              background: 'linear-gradient(135deg, #ffffff 0%, #dcfce7 50%, #22c55e 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))',
              willChange: 'transform'
            }}
          >
            {t.title}
          </motion.h1>
          
          {/* Sottotitolo ottimizzato */}
          <motion.h2
            initial={subtitleVariants.initial}
            animate={subtitleVariants.animate}
            transition={subtitleVariants.transition}
            className="text-xl md:text-2xl lg:text-3xl text-white/95 font-light tracking-wide mb-2 text-center"
            style={{ 
              fontFamily: "'Playfair Display', serif",
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
              willChange: 'transform'
            }}
          >
            {t.subtitle}
          </motion.h2>
        </motion.div>

        {/* 🏷️ Slogan ottimizzato */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: shouldReduceMotion ? 0 : 0.8, duration: shouldReduceMotion ? 0.1 : 0.5 }}
          className="mb-8 text-center"
        >
          <motion.p 
            className="text-lg md:text-xl text-white/95 font-medium mb-1"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
          >
            {t.tagline}
          </motion.p>
          <motion.p 
            className="text-lg md:text-xl text-white/95 font-medium"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
          >
            {t.tagline2}
          </motion.p>
          
          {/* 🎯 Badge con counter animato ottimizzato */}
          <motion.div
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: shouldReduceMotion ? 0 : 1, duration: shouldReduceMotion ? 0.1 : 0.4 }}
            className="flex justify-center mt-4"
          >
            <motion.div 
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-md border border-white/30 rounded-full px-6 py-3 text-white font-semibold shadow-lg"
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              style={{ willChange: 'transform' }}
            >
              <motion.span 
                className="text-xl"
                animate={shouldReduceMotion ? {} : { 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={shouldReduceMotion ? {} : { 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                ⭐
              </motion.span>
              <span className="flex items-center space-x-1">
                <span>{t.since}</span>
                <motion.span 
                  key={count}
                  initial={{ scale: shouldReduceMotion ? 1 : 1.2, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="font-bold text-lg"
                >
                  {count}
                </motion.span>
                <span>{t.yearsLabel}</span>
              </span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* 🎯 CTA Buttons Ottimizzati */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: shouldReduceMotion ? 0 : 1.2, duration: shouldReduceMotion ? 0.1 : 0.6 }}
          className="flex flex-col items-center space-y-6"
        >
          {/* 📱 Mobile Layout ottimizzato */}
          <div className="flex flex-col md:hidden space-y-3 w-full max-w-xs mx-auto">
            {ctaButtons.map((button, index) => (
              <motion.button
                key={button.type}
                onClick={() => handleCTAClick(button.type)}
                whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: shouldReduceMotion ? 0 : 1.4 + index * 0.1, duration: shouldReduceMotion ? 0.1 : 0.5 }}
                className={`group relative bg-gradient-to-r ${
                  button.type === 'about' 
                    ? 'border-2 border-white/50 text-white backdrop-blur-md hover:bg-white/10 hover:border-white/70' 
                    : `${button.gradient} text-white shadow-xl`
                } px-6 py-3 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center space-x-2 w-full`}
                style={{ willChange: 'transform' }}
              >
                <span className="text-lg">{button.icon}</span>
                <span>{button.label}</span>
              </motion.button>
            ))}
          </div>

          {/* 🖥️ Desktop Layout ottimizzato */}
          <div className="hidden md:flex items-center justify-center space-x-4 lg:space-x-6">
            {ctaButtons.map((button, index) => (
              <motion.button
                key={button.type}
                onClick={() => handleCTAClick(button.type)}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: shouldReduceMotion ? 0 : 1.3 + index * 0.1, duration: shouldReduceMotion ? 0.1 : 0.5 }}
                whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className={`group relative ${
                  button.type === 'about'
                    ? 'border-2 border-white/40 text-white backdrop-blur-md hover:bg-white/10 hover:border-white/60'
                    : `bg-gradient-to-r ${button.gradient} text-white shadow-xl hover:shadow-xl`
                } px-6 py-3 lg:px-8 lg:py-4 rounded-xl font-bold text-sm lg:text-base transition-all duration-300 flex items-center space-x-2 min-w-[140px] lg:min-w-[160px] justify-center`}
                style={{ willChange: 'transform' }}
              >
                <span className="text-lg lg:text-xl">{button.icon}</span>
                <span>{button.label}</span>
              </motion.button>
            ))}
          </div>

          {/* 📍 Scroll Indicator ottimizzato */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: shouldReduceMotion ? 0 : 2, duration: shouldReduceMotion ? 0.1 : 0.6 }}
            className="text-center mt-6 md:mt-8"
          >
            <motion.div
              animate={shouldReduceMotion ? {} : { y: [0, 8, 0] }}
              transition={shouldReduceMotion ? {} : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-white/80 flex flex-col items-center space-y-3"
            >
              {/* Icona scroll ottimizzata */}
              <div className="flex flex-col space-y-1">
                {[0, 0.2, 0.4].map((delay, index) => (
                  <motion.div 
                    key={index}
                    className="w-1 h-1 bg-white/60 rounded-full mx-auto"
                    animate={shouldReduceMotion ? {} : { 
                      opacity: [0.4, 1, 0.4],
                      scale: [1, 1.2, 1] 
                    }}
                    transition={shouldReduceMotion ? {} : { 
                      duration: 1.5, 
                      repeat: Infinity, 
                      delay 
                    }}
                  />
                ))}
              </div>
              <div className="text-xs hidden md:block font-medium opacity-80">
                Scorri per scoprire di più
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* 🎨 Elementi decorativi ridotti per performance */}
      <div className="absolute top-1/4 left-0 w-48 h-48 bg-green-500/5 rounded-full blur-2xl opacity-50"></div>
      <div className="absolute bottom-1/4 right-0 w-48 h-48 bg-amber-400/5 rounded-full blur-2xl opacity-50"></div>
    </section>
  )
}

export default React.memo(HeroSection)
