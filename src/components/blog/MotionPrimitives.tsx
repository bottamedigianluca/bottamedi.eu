import React, { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, type MotionProps, type Variants } from 'framer-motion'

/**
 * Animation presets selectable per-post via frontmatter `animation` field.
 * Each preset tunes durations, easings, reveal distance.
 */
export type AnimationPreset = 'springy' | 'cinema' | 'editorial' | 'snappy' | 'organic'

export const ANIMATION_PRESETS: Record<
  AnimationPreset,
  {
    duration: number
    distance: number
    ease: number[] | string
    hero: { scale: [number, number]; blur: [number, number]; y: [number, number] }
  }
> = {
  springy: {
    duration: 0.55,
    distance: 18,
    ease: [0.22, 1, 0.36, 1],
    hero: { scale: [1.06, 1], blur: [4, 0], y: [-30, 0] },
  },
  cinema: {
    duration: 0.85,
    distance: 12,
    ease: [0.25, 0.46, 0.45, 0.94],
    hero: { scale: [1.1, 1], blur: [8, 0], y: [-40, 0] },
  },
  editorial: {
    duration: 0.7,
    distance: 16,
    ease: [0.16, 1, 0.3, 1],
    hero: { scale: [1.04, 1], blur: [3, 0], y: [-20, 0] },
  },
  snappy: {
    duration: 0.35,
    distance: 10,
    ease: [0.4, 0, 0.2, 1],
    hero: { scale: [1.02, 1], blur: [0, 0], y: [-10, 0] },
  },
  organic: {
    duration: 0.95,
    distance: 24,
    ease: [0.34, 1.56, 0.64, 1],
    hero: { scale: [1.08, 1], blur: [6, 0], y: [-28, 0] },
  },
}

interface RevealProps extends MotionProps {
  children: React.ReactNode
  preset?: AnimationPreset
  delay?: number
  className?: string
  id?: string
  as?: 'div' | 'section' | 'aside' | 'article'
}

/** Fades + slides content into view when it enters viewport. */
export const Reveal: React.FC<RevealProps> = ({
  children,
  preset = 'editorial',
  delay = 0,
  className,
  id,
  as = 'div',
  ...rest
}) => {
  const reduce = useReducedMotion()
  const p = ANIMATION_PRESETS[preset]
  const MotionTag = motion[as] as typeof motion.div

  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : p.distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0.05 : p.duration, ease: p.ease as number[], delay: reduce ? 0 : delay },
    },
  }

  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={variants}
      className={className}
      id={id}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

interface ParallaxProps {
  children: React.ReactNode
  speed?: number
  className?: string
}

export const Parallax: React.FC<ParallaxProps> = ({ children, speed = 0.25, className }) => {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 100 * speed])
  return (
    <div ref={ref} className={className} style={{ willChange: 'transform' }}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  )
}

interface HeroCoverProps {
  src: string
  alt: string
  caption?: string
  preset?: AnimationPreset
  priority?: boolean
}

/** Full-bleed animated hero cover image with cinematic entrance. */
export const HeroCover: React.FC<HeroCoverProps> = ({ src, alt, caption, preset = 'cinema', priority = true }) => {
  const reduce = useReducedMotion()
  const p = ANIMATION_PRESETS[preset]
  return (
    <figure className="rounded-2xl overflow-hidden mb-10 bg-green-50 relative">
      <motion.div
        initial={{ scale: reduce ? 1 : p.hero.scale[0], filter: `blur(${reduce ? 0 : p.hero.blur[0]}px)`, opacity: 0 }}
        animate={{ scale: p.hero.scale[1], filter: 'blur(0px)', opacity: 1 }}
        transition={{ duration: reduce ? 0.05 : p.duration * 1.5, ease: p.ease as number[] }}
        className="relative"
      >
        <img
          src={src}
          alt={alt}
          width={1600}
          height={900}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          className="w-full h-auto object-cover aspect-[16/9]"
        />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </motion.div>
      {caption && (
        <figcaption className="text-sm text-gray-500 px-4 py-2 italic">{caption}</figcaption>
      )}
    </figure>
  )
}

/** Animated stat card: counter that animates on viewport enter. */
export const Stat: React.FC<{ value: string; label: string; delay?: number }> = ({ value, label, delay = 0 }) => {
  return (
    <Reveal preset="springy" delay={delay} className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
      <div className="text-3xl md:text-4xl font-bold text-green-700">{value}</div>
      <div className="text-sm text-gray-600 mt-1">{label}</div>
    </Reveal>
  )
}

/** Grid container for stats. */
export const StatGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-8">{children}</div>
)

/** Pull-quote / big quote with entrance animation. */
export const PullQuote: React.FC<{ cite?: string; children: React.ReactNode }> = ({ cite, children }) => (
  <Reveal preset="editorial" className="my-10 py-6 border-l-4 border-green-500 pl-6 bg-green-50/40 rounded-r-xl">
    <p className="text-2xl md:text-3xl font-serif text-gray-900 leading-snug italic">“{children}”</p>
    {cite && <footer className="mt-3 text-sm text-gray-600 not-italic">— {cite}</footer>}
  </Reveal>
)

/** Simple image gallery: masonry-like, lazy, with reveal. */
export const Gallery: React.FC<{ images: Array<{ src: string; alt: string; caption?: string }> }> = ({ images }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
    {images.map((img, i) => (
      <Reveal key={img.src} preset="editorial" delay={i * 0.08}>
        <figure className="rounded-xl overflow-hidden bg-green-50">
          <img src={img.src} alt={img.alt} loading="lazy" decoding="async" className="w-full h-auto object-cover aspect-[4/3]" />
          {img.caption && <figcaption className="text-xs text-gray-500 px-3 py-2 italic">{img.caption}</figcaption>}
        </figure>
      </Reveal>
    ))}
  </div>
)

/** Vertical timeline entries with staggered reveal. */
export const Timeline: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ol className="relative border-l-2 border-green-200 pl-6 my-8 space-y-6">{children}</ol>
)

export const TimelineItem: React.FC<{ year: string; title: string; children: React.ReactNode; delay?: number }> = ({
  year,
  title,
  children,
  delay = 0,
}) => (
  <Reveal preset="editorial" delay={delay} as="section" className="relative">
    <span className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-green-600 border-4 border-white shadow-sm" />
    <div className="text-sm font-semibold text-green-700 uppercase tracking-wider mb-1">{year}</div>
    <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
    <div className="text-gray-700 leading-relaxed">{children}</div>
  </Reveal>
)

/** Side-by-side comparison block. */
export const Compare: React.FC<{
  left: { title: string; body: React.ReactNode }
  right: { title: string; body: React.ReactNode }
}> = ({ left, right }) => (
  <div className="grid md:grid-cols-2 gap-4 my-8">
    <Reveal preset="editorial" className="bg-amber-50 border border-amber-200 rounded-xl p-5">
      <h4 className="font-bold text-amber-900 mb-2">{left.title}</h4>
      <div className="text-gray-700 text-sm leading-relaxed">{left.body}</div>
    </Reveal>
    <Reveal preset="editorial" delay={0.1} className="bg-green-50 border border-green-200 rounded-xl p-5">
      <h4 className="font-bold text-green-900 mb-2">{right.title}</h4>
      <div className="text-gray-700 text-sm leading-relaxed">{right.body}</div>
    </Reveal>
  </div>
)
