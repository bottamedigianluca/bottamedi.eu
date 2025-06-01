import React from 'react'
import { motion } from 'framer-motion'
import { BaseComponentProps } from '../types'

interface LoadingProps extends BaseComponentProps {
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'brand' | 'accent' | 'neutral'
  text?: string
  fullScreen?: boolean
}

const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  size = 'md',
  color = 'brand',
  text,
  fullScreen = false,
  className = '',
  ...props
}) => {
  // Size mappings
  const sizes = {
    sm: { spinner: 'w-4 h-4', text: 'text-sm' },
    md: { spinner: 'w-8 h-8', text: 'text-base' },
    lg: { spinner: 'w-12 h-12', text: 'text-lg' },
    xl: { spinner: 'w-16 h-16', text: 'text-xl' }
  }

  // Color mappings
  const colors = {
    brand: 'text-brand-500',
    accent: 'text-accent-500',
    neutral: 'text-neutral-500'
  }

  // Spinner component
  const Spinner = () => (
    <motion.div
      className={`
        ${sizes[size].spinner} border-2 border-current border-t-transparent 
        rounded-full ${colors[color]}
      `}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  )

  // Dots component
  const Dots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`
            ${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-5 h-5'}
            bg-current rounded-full ${colors[color]}
          `}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  )

  // Pulse component
  const Pulse = () => (
    <motion.div
      className={`
        ${sizes[size].spinner} bg-current rounded-full ${colors[color]}
      `}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [1, 0.7, 1]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity
      }}
    />
  )

  // Skeleton component
  const Skeleton = () => (
    <div className="space-y-3">
      {[1, 0.8, 0.6].map((width, i) => (
        <motion.div
          key={i}
          className={`
            h-4 bg-neutral-200 rounded-lg
            ${size === 'sm' ? 'h-2' : size === 'md' ? 'h-3' : size === 'lg' ? 'h-4' : 'h-5'}
          `}
          style={{ width: `${width * 100}%` }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  )

  // Component mapping
  const components = {
    spinner: <Spinner />,
    dots: <Dots />,
    pulse: <Pulse />,
    skeleton: <Skeleton />
  }

  // Container styles
  const containerClass = `
    flex flex-col items-center justify-center space-y-4
    ${fullScreen ? 'fixed inset-0 bg-white/80 backdrop-blur-sm z-50' : ''}
    ${className}
  `.trim()

  return (
    <div className={containerClass} {...props}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {components[variant]}
      </motion.div>
      
      {text && (
        <motion.p
          className={`${sizes[size].text} ${colors[color]} font-medium`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}

// Skeleton components for specific layouts
export const SkeletonCard: React.FC<{ lines?: number; showAvatar?: boolean }> = ({ 
  lines = 3, 
  showAvatar = false 
}) => (
  <div className="animate-pulse space-y-4 p-6">
    {showAvatar && (
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-neutral-200 rounded-full"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
          <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
        </div>
      </div>
    )}
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className={`h-4 bg-neutral-200 rounded ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}></div>
        </div>
      ))}
    </div>
  </div>
)

export const SkeletonImage: React.FC<{ aspect?: 'square' | 'video' | 'wide' }> = ({ 
  aspect = 'video' 
}) => {
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[3/1]'
  }

  return (
    <div className={`animate-pulse bg-neutral-200 rounded-2xl ${aspectClasses[aspect]}`}>
      <div className="flex items-center justify-center h-full">
        <svg className="w-12 h-12 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  )
}

export default Loading