import React from 'react'
import { motion } from 'framer-motion'
import { BaseComponentProps } from '../types'

interface CardProps extends BaseComponentProps {
  variant?: 'default' | 'elevated' | 'bordered' | 'glass'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  hover?: boolean
  clickable?: boolean
  onClick?: () => void
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  clickable = false,
  onClick,
  className = '',
  ...props
}) => {
  // Base styles
  const baseStyles = `
    relative bg-white rounded-3xl transition-all duration-300
    transform-gpu will-change-transform
    ${clickable ? 'cursor-pointer' : ''}
  `

  // Variant styles
  const variants = {
    default: 'shadow-sm border border-neutral-100',
    elevated: 'shadow-lg hover:shadow-xl',
    bordered: 'border-2 border-neutral-200',
    glass: 'bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg'
  }

  // Padding styles
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12'
  }

  const cardClass = `
    ${baseStyles}
    ${variants[variant]}
    ${paddings[padding]}
    ${className}
  `.trim()

  // Motion variants
  const motionVariants = {
    hover: hover ? {
      y: -8,
      scale: 1.02,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    } : {},
    tap: clickable ? { scale: 0.98 } : {}
  }

  return (
    <motion.div
      className={cardClass}
      onClick={onClick}
      whileHover="hover"
      whileTap="tap"
      variants={motionVariants}
      {...props}
    >
      {children}
      
      {/* Magnetic effect overlay */}
      {(hover || clickable) && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5 rounded-3xl opacity-0 pointer-events-none"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  )
}

// Card components
export const CardHeader: React.FC<BaseComponentProps> = ({
  children,
  className = '',
  ...props
}) => (
  <div 
    className={`pb-6 border-b border-neutral-100 ${className}`}
    {...props}
  >
    {children}
  </div>
)

export const CardBody: React.FC<BaseComponentProps> = ({
  children,
  className = '',
  ...props
}) => (
  <div 
    className={`py-6 ${className}`}
    {...props}
  >
    {children}
  </div>
)

export const CardFooter: React.FC<BaseComponentProps> = ({
  children,
  className = '',
  ...props
}) => (
  <div 
    className={`pt-6 border-t border-neutral-100 ${className}`}
    {...props}
  >
    {children}
  </div>
)

export default Card