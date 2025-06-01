import React, { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

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

const HeroSection: React.FC<HeroSectionProps> = ({ language, inView }) => {
  const ref = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { scrollY } = useScroll()
  
  const t = translations[language]
  
  // Parallax leggero per performance
  const y = useTransform(scrollY, [0, 800], [0, 100])
  const opacity = useTransform(scrollY, [0, 600], [1, 0.3])

  // Hook per animazione counter
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (inView) {
      let startTime: number
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / 2000, 1)
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        const currentValue = easeOutQuart * t.yearsCount
        
        setCount(Math.floor(currentValue))

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setCount(t.yearsCount)
        }
      }

      requestAnimationFrame(animate)
    }
  }, [inView, t.yearsCount])

  useEffect(() => {
    if (inView && videoRef.current) {
      videoRef.current.play().catch(() => {
        console.log('Autoplay failed')
      })
    }
  }, [inView])

  // Funzioni CTA con sezioni corrette
  const handleCTAClick = (type: 'dettaglio' | 'services' | 'about') => {
    const sectionMap = {
      dettaglio: 'dettaglio',
      services: 'services',
      about: 'about'
    }
    
    const element = document.getElementById(sectionMap[type])
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Video ottimizzato */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/poster.webp"
        >
          <source src="/videos/hero-video-verdure-rotanti.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay semplificato */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      </div>

      {/* Content ottimizzato e centrato */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
      >
        {/* Header - Logo Grande a Sinistra */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          {/* Titolo principale senza logo centrale */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-4 text-center"
            style={{
              fontFamily: "'Playfair Display', serif",
              background: 'linear-gradient(135deg, #ffffff 0%, #dcfce7 50%, #22c55e 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))'
            }}
          >
            {t.title}
          </motion.h1>
          
          {/* Sottotitolo */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-xl md:text-2xl lg:text-3xl text-white/95 font-light tracking-wide mb-2 text-center"
            style={{ 
              fontFamily: "'Playfair Display', serif",
              textShadow: '0 2px 8px rgba(0,0,0,0.5)'
            }}
          >
            {t.subtitle}
          </motion.h2>
        </motion.div>

        {/* Slogan più Umile e Catchy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
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
          
          {/* Badge Da oltre 50 anni con counter animato */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.4 }}
            className="flex justify-center mt-4"
          >
            <motion.div 
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-md border border-white/30 rounded-full px-6 py-3 text-white font-semibold shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <motion.span 
                className="text-xl"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
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
                  initial={{ scale: 1.2, opacity: 0.8 }}
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

        {/* CTA Buttons - Tutti e 3 Visibili, Simmetrici e Ben Proporzionati */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="flex flex-col items-center space-y-6"
        >
          {/* Mobile Layout - Stack Verticale */}
          <div className="flex flex-col md:hidden space-y-3 w-full max-w-xs mx-auto">
            <motion.button
              onClick={() => handleCTAClick('dettaglio')}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              className="group relative bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-bold text-base shadow-xl hover:shadow-green-500/25 transition-all duration-300 flex items-center justify-center space-x-2 w-full"
            >
              <span className="text-lg">🛒</span>
              <span>{t.cta1}</span>
            </motion.button>

            <motion.button
              onClick={() => handleCTAClick('services')}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="group relative bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold text-base shadow-xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center space-x-2 w-full"
            >
              <span className="text-lg">🚛</span>
              <span>{t.cta2}</span>
            </motion.button>

            <motion.button
              onClick={() => handleCTAClick('about')}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.5 }}
              className="group relative border-2 border-white/50 text-white px-6 py-3 rounded-xl font-bold text-base backdrop-blur-md hover:bg-white/10 hover:border-white/70 transition-all duration-300 flex items-center justify-center space-x-2 w-full"
            >
              <span className="text-lg">🌱</span>
              <span>{t.cta3}</span>
            </motion.button>
          </div>

          {/* Desktop Layout - 3 Bottoni Simmetrici Affiancati */}
          <div className="hidden md:flex items-center justify-center space-x-4 lg:space-x-6">
            <motion.button
              onClick={() => handleCTAClick('dettaglio')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="group relative bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 lg:px-8 lg:py-4 rounded-xl font-bold text-sm lg:text-base shadow-xl hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300 flex items-center space-x-2 min-w-[140px] lg:min-w-[160px] justify-center"
            >
              <span className="text-lg lg:text-xl">🛒</span>
              <span>{t.cta1}</span>
            </motion.button>

            <motion.button
              onClick={() => handleCTAClick('services')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="group relative bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 lg:px-8 lg:py-4 rounded-xl font-bold text-sm lg:text-base shadow-xl hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center space-x-2 min-w-[140px] lg:min-w-[160px] justify-center"
            >
              <span className="text-lg lg:text-xl">🚛</span>
              <span>{t.cta2}</span>
            </motion.button>

            <motion.button
              onClick={() => handleCTAClick('about')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="group relative border-2 border-white/40 text-white px-6 py-3 lg:px-8 lg:py-4 rounded-xl font-bold text-sm lg:text-base backdrop-blur-md hover:bg-white/10 hover:border-white/60 transition-all duration-300 flex items-center space-x-2 min-w-[140px] lg:min-w-[160px] justify-center"
            >
              <span className="text-lg lg:text-xl">🌱</span>
              <span>{t.cta3}</span>
            </motion.button>
          </div>

          {/* Scroll Indicator - Moderno */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.6 }}
            className="text-center mt-6 md:mt-8"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-white/80 flex flex-col items-center space-y-3"
            >
              {/* Icona moderna a tre puntini */}
              <div className="flex flex-col space-y-1">
                <motion.div 
                  className="w-1 h-1 bg-white/60 rounded-full mx-auto"
                  animate={{ 
                    opacity: [0.4, 1, 0.4],
                    scale: [1, 1.2, 1] 
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    delay: 0 
                  }}
                />
                <motion.div 
                  className="w-1 h-1 bg-white/80 rounded-full mx-auto"
                  animate={{ 
                    opacity: [0.4, 1, 0.4],
                    scale: [1, 1.2, 1] 
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    delay: 0.2 
                  }}
                />
                <motion.div 
                  className="w-1 h-1 bg-white rounded-full mx-auto"
                  animate={{ 
                    opacity: [0.4, 1, 0.4],
                    scale: [1, 1.2, 1] 
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    delay: 0.4 
                  }}
                />
              </div>
              <div className="text-xs hidden md:block font-medium opacity-80">
                Scorri per scoprire di più
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Elementi decorativi ridotti */}
      <div className="absolute top-1/4 left-0 w-48 h-48 bg-green-500/5 rounded-full blur-2xl opacity-50"></div>
      <div className="absolute bottom-1/4 right-0 w-48 h-48 bg-amber-400/5 rounded-full blur-2xl opacity-50"></div>
    </section>
  )
}

export default HeroSection