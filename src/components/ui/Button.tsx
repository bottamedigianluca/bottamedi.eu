import React from 'react'
import { motion } from 'framer-motion'
import { BaseComponentProps } from '../types'

interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  disabled?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  href?: string
  target?: string
  rel?: string
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  onClick,
  type = 'button',
  href,
  target,
  rel,
  className = '',
  ...props
}) => {
  // Base styles
  const baseStyles = `
    relative inline-flex items-center justify-center font-semibold
    rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4
    transform-gpu will-change-transform disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `

  // Variant styles
  const variants = {
    primary: `
      bg-gradient-to-r from-brand-500 to-brand-600 text-white
      hover:from-brand-600 hover:to-brand-700 hover:shadow-lg hover:shadow-brand-500/25
      focus:ring-brand-500/30 disabled:from-neutral-400 disabled:to-neutral-400
    `,
    secondary: `
      bg-gradient-to-r from-accent-500 to-accent-600 text-white
      hover:from-accent-600 hover:to-accent-700 hover:shadow-lg hover:shadow-accent-500/25
      focus:ring-accent-500/30 disabled:from-neutral-400 disabled:to-neutral-400
    `,
    outline: `
      border-2 border-brand-500 text-brand-600 bg-transparent
      hover:bg-brand-500 hover:text-white hover:shadow-lg
      focus:ring-brand-500/30 disabled:border-neutral-300 disabled:text-neutral-300
    `,
    ghost: `
      text-neutral-700 bg-transparent hover:bg-neutral-100
      focus:ring-neutral-500/30 disabled:text-neutral-300
    `
  }

  // Size styles
  const sizes = {
    sm: 'px-4 py-2 text-sm min-h-[36px]',
    md: 'px-6 py-3 text-base min-h-[44px]',
    lg: 'px-8 py-4 text-lg min-h-[52px]',
    xl: 'px-10 py-5 text-xl min-h-[60px]'
  }

  const buttonClass = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `.trim()

  // Loading spinner
  const LoadingSpinner = () => (
    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
  )

  // Button content
  const ButtonContent = () => (
    <>
      {loading && <LoadingSpinner />}
      {!loading && icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      {!loading && <span>{children}</span>}
      {!loading && icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </>
  )

  // Motion variants
  const motionVariants = {
    hover: { 
      scale: disabled || loading ? 1 : 1.02,
      y: disabled || loading ? 0 : -2
    },
    tap: { 
      scale: disabled || loading ? 1 : 0.98,
      y: disabled || loading ? 0 : 0
    }
  }

  // If href is provided, render as link
  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={rel}
        className={buttonClass}
        whileHover="hover"
        whileTap="tap"
        variants={motionVariants}
      {...props}
    >
      <ButtonContent />
      
      {/* Ripple effect overlay */}
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 pointer-events-none"
        whileHover={{ opacity: variant === 'ghost' ? 0 : 0.1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  )
}

export default Buttonants}
        {...props}
      >
        <ButtonContent />
      </motion.a>
    )
  }

  // Render as button
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClass}
      whileHover="hover"
      whileTap="tap"
      variants={motionVari