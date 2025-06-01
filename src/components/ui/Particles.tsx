import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { BaseComponentProps } from '../types'

interface ParticleSystemProps extends BaseComponentProps {
  count?: number
  color?: string
  size?: number
  speed?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'random'
  shape?: 'circle' | 'square' | 'triangle'
  opacity?: number
  blur?: boolean
}

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
  life: number
  maxLife: number
}

const Particles: React.FC<ParticleSystemProps> = ({
  count = 50,
  color = '#22c55e',
  size = 4,
  speed = 1,
  direction = 'up',
  shape = 'circle',
  opacity = 0.6,
  blur = false,
  className = '',
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()

  // Initialize particles
  const initParticles = () => {
    const particles: Particle[] = []
    const container = containerRef.current
    if (!container) return particles

    const { width, height } = container.getBoundingClientRect()

    for (let i = 0; i < count; i++) {
      particles.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed,
        vy: getDirectionVelocity() * speed,
        size: size + Math.random() * (size / 2),
        opacity: opacity * (0.5 + Math.random() * 0.5),
        color,
        life: Math.random() * 1000,
        maxLife: 1000 + Math.random() * 2000
      })
    }

    return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ filter: blur ? 'blur(0.5px)' : 'none' }}
      />
    </div>
  )
}

// Floating elements component (alternative to canvas-based particles)
interface FloatingElementsProps extends BaseComponentProps {
  count?: number
  children: React.ReactNode
  duration?: number
  delay?: number
}

export const FloatingElements: React.FC<FloatingElementsProps> = ({
  count = 20,
  children,
  duration = 6,
  delay = 0,
  className = '',
  ...props
}) => {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} {...props}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            rotate: [0, Math.random() * 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: duration + Math.random() * 2,
            repeat: Infinity,
            delay: delay + Math.random() * 2,
            ease: 'easeInOut',
          }}
        >
          {children}
        </motion.div>
      ))}
    </div>
  )
}

// Particle trail effect
interface ParticleTrailProps {
  color?: string
  size?: number
  count?: number
  life?: number
}

export const ParticleTrail: React.FC<ParticleTrailProps> = ({
  color = '#22c55e',
  size = 3,
  count = 10,
  life = 1000
}) => {
  const [particles, setParticles] = React.useState<Array<{
    id: number
    x: number
    y: number
    timestamp: number
  }>>([])

  const handleMouseMove = (e: MouseEvent) => {
    const newParticle = {
      id: Date.now() + Math.random(),
      x: e.clientX,
      y: e.clientY,
      timestamp: Date.now()
    }

    setParticles(prev => [...prev.slice(-count + 1), newParticle])
  }

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    
    const cleanup = setInterval(() => {
      const now = Date.now()
      setParticles(prev => prev.filter(p => now - p.timestamp < life))
    }, 100)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      clearInterval(cleanup)
    }
  }, [life, count])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => {
        const age = Date.now() - particle.timestamp
        const opacity = Math.max(0, 1 - age / life)
        
        return (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: particle.x - size / 2,
              top: particle.y - size / 2,
              width: size,
              height: size,
              backgroundColor: color,
              opacity,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )
      })}
    </div>
  )
}

// Background particles for hero sections
export const HeroParticles: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating fruit icons */}
      <FloatingElements count={15} duration={8}>
        <div className="text-2xl opacity-20">🍎</div>
      </FloatingElements>
      
      <FloatingElements count={12} duration={10} delay={2}>
        <div className="text-xl opacity-15">🥕</div>
      </FloatingElements>
      
      <FloatingElements count={10} duration={12} delay={4}>
        <div className="text-lg opacity-10">🍅</div>
      </FloatingElements>

      {/* Abstract particles */}
      <Particles
        count={30}
        color="rgba(34, 197, 94, 0.1)"
        size={2}
        speed={0.5}
        direction="up"
        shape="circle"
      />
    </div>
  )
}

// Section background particles
export const SectionParticles: React.FC<{
  variant?: 'brand' | 'accent' | 'neutral'
  density?: 'low' | 'medium' | 'high'
}> = ({ variant = 'brand', density = 'low' }) => {
  const colors = {
    brand: 'rgba(34, 197, 94, 0.08)',
    accent: 'rgba(245, 158, 11, 0.08)',
    neutral: 'rgba(115, 115, 115, 0.05)'
  }

  const counts = {
    low: 15,
    medium: 25,
    high: 40
  }

  return (
    <Particles
      count={counts[density]}
      color={colors[variant]}
      size={1.5}
      speed={0.3}
      direction="random"
      shape="circle"
      opacity={0.6}
    />
  )
}

export default Particles particles
  }

  // Get velocity based on direction
  const getDirectionVelocity = () => {
    switch (direction) {
      case 'up':
        return -Math.random() * 2 - 0.5
      case 'down':
        return Math.random() * 2 + 0.5
      case 'left':
        return -Math.random() * 2 - 0.5
      case 'right':
        return Math.random() * 2 + 0.5
      case 'random':
      default:
        return (Math.random() - 0.5) * 2
    }
  }

  // Update particles
  const updateParticles = () => {
    const container = containerRef.current
    if (!container) return

    const { width, height } = container.getBoundingClientRect()

    particlesRef.current = particlesRef.current.map(particle => {
      // Update position
      particle.x += particle.vx
      particle.y += particle.vy
      particle.life += 16 // ~60fps

      // Wrap around edges
      if (particle.x < 0) particle.x = width
      if (particle.x > width) particle.x = 0
      if (particle.y < 0) particle.y = height
      if (particle.y > height) particle.y = 0

      // Reset particle if life exceeded
      if (particle.life > particle.maxLife) {
        particle.x = Math.random() * width
        particle.y = direction === 'up' ? height : direction === 'down' ? 0 : Math.random() * height
        particle.life = 0
      }

      return particle
    })
  }

  // Draw particles
  const drawParticles = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set blur effect
    if (blur) {
      ctx.filter = 'blur(1px)'
    }

    // Draw each particle
    particlesRef.current.forEach(particle => {
      ctx.save()
      
      // Set opacity based on life
      const lifeRatio = 1 - (particle.life / particle.maxLife)
      ctx.globalAlpha = particle.opacity * lifeRatio

      // Set color
      ctx.fillStyle = particle.color

      // Draw shape
      switch (shape) {
        case 'circle':
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()
          break
        case 'square':
          ctx.fillRect(
            particle.x - particle.size / 2,
            particle.y - particle.size / 2,
            particle.size,
            particle.size
          )
          break
        case 'triangle':
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y - particle.size)
          ctx.lineTo(particle.x - particle.size, particle.y + particle.size)
          ctx.lineTo(particle.x + particle.size, particle.y + particle.size)
          ctx.closePath()
          ctx.fill()
          break
      }

      ctx.restore()
    })
  }

  // Animation loop
  const animate = () => {
    updateParticles()
    drawParticles()
    animationRef.current = requestAnimationFrame(animate)
  }

  // Resize canvas
  const resizeCanvas = () => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const { width, height } = container.getBoundingClientRect()
    canvas.width = width
    canvas.height = height
  }

  // Initialize
  useEffect(() => {
    particlesRef.current = initParticles()
    resizeCanvas()
    animate()

    const handleResize = () => {
      resizeCanvas()
      particlesRef.current = initParticles()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [count, color, size, speed, direction, shape, opacity])

  return