import { Variants } from 'framer-motion'

// Common animation variants
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -60,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export const fadeInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export const fadeInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export const slideInUp: Variants = {
  hidden: {
    y: '100%',
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

// Stagger animations
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
}

export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

// Text animations
export const textReveal: Variants = {
  hidden: {
    y: '100%',
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export const letterReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    rotateX: -90,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

// Hover animations
export const magneticHover = {
  scale: 1.05,
  y: -5,
  transition:{
    duration: 0.3,
    ease: [0.25, 0.46, 0.45, 0.94],
  },
}

export const buttonHover = {
  scale: 1.02,
  y: -2,
  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
  transition: {
    duration: 0.2,
    ease: 'easeOut',
  },
}

export const cardHover = {
  y: -10,
  scale: 1.02,
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  transition: {
    duration: 0.3,
    ease: [0.25, 0.46, 0.45, 0.94],
  },
}

// Page transitions
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  out: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

// Loading animations
export const spinner = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}

export const pulse = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// Parallax helper
export const createParallaxVariants = (strength: number = 50) => ({
  hidden: { y: 0 },
  visible: { y: -strength },
})

// Morphing animations
export const morphButton: Variants = {
  idle: {
    borderRadius: '24px',
    scale: 1,
  },
  hover: {
    borderRadius: '32px',
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
    },
  },
}

// Timeline animations
export const timelineVariants: Variants = {
  hidden: {
    scaleY: 0,
    originY: 0,
  },
  visible: {
    scaleY: 1,
    transition: {
      duration: 1.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export const timelineItemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -50,
  },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.3,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
}

// Gallery animations
export const galleryItemVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 20,
  },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
}

// Navigation animations
export const menuSlide: Variants = {
  closed: {
    x: '-100%',
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  open: {
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export const menuItemSlide: Variants = {
  closed: {
    x: -20,
    opacity: 0,
  },
  open: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
    },
  }),
}

// Custom easing curves
export const easings = {
  easeInOutCubic: [0.25, 0.46, 0.45, 0.94],
  easeOutQuart: [0.25, 1, 0.5, 1],
  easeInOutQuart: [0.76, 0, 0.24, 1],
  easeOutExpo: [0.19, 1, 0.22, 1],
  easeInOutBack: [0.68, -0.6, 0.32, 1.6],
}

// Animation configuration
export const animationConfig = {
  fast: { duration: 0.2 },
  normal: { duration: 0.3 },
  slow: { duration: 0.5 },
  slower: { duration: 0.8 },
}

// Utility functions
export const createStaggerAnimation = (
  delay: number = 0.1,
  delayChildren: number = 0
) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: delay,
      delayChildren,
    },
  },
})

export const createSlideAnimation = (
  direction: 'up' | 'down' | 'left' | 'right' = 'up',
  distance: number = 60
) => {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  }

  return {
    hidden: {
      opacity: 0,
      ...directions[direction],
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easings.easeInOutCubic,
      },
    },
  }
}

export const createScaleAnimation = (
  initialScale: number = 0.8,
  finalScale: number = 1
) => ({
  hidden: {
    opacity: 0,
    scale: initialScale,
  },
  visible: {
    opacity: 1,
    scale: finalScale,
    transition: {
      duration: 0.5,
      ease: easings.easeOutQuart,
    },
  },
})

// Page-specific animations
export const heroAnimations = {
  title: {
    hidden: { opacity: 0, y: 100, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: easings.easeInOutCubic,
        staggerChildren: 0.1,
      },
    },
  },
  subtitle: {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5,
        duration: 0.8,
        ease: easings.easeInOutCubic,
      },
    },
  },
}

export const sectionAnimations = {
  container: staggerContainer,
  item: staggerItem,
  title: fadeInUp,
  subtitle: fadeInUp,
}

// Export all animations
export const animations = {
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  slideInUp,
  staggerContainer,
  staggerItem,
  textReveal,
  letterReveal,
  magneticHover,
  buttonHover,
  cardHover,
  pageTransition,
  spinner,
  pulse,
  morphButton,
  timelineVariants,
  timelineItemVariants,
  galleryItemVariants,
  menuSlide,
  menuItemSlide,
  heroAnimations,
  sectionAnimations,
}

export default animations