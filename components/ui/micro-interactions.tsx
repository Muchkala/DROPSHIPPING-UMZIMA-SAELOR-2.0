"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

// Hover card with lift effect
interface HoverCardProps {
  children: React.ReactNode
  className?: string
  liftAmount?: number
  scale?: number
}

export function HoverCard({ children, className, liftAmount = 4, scale = 1.02 }: HoverCardProps) {
  return (
    <motion.div
      whileHover={{ 
        y: -liftAmount, 
        scale,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn("cursor-pointer", className)}
    >
      {children}
    </motion.div>
  )
}

// Button with ripple effect
interface RippleButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
}

export function RippleButton({ children, onClick, className, variant = "default", size = "md" }: RippleButtonProps) {
  const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number }>>([])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newRipple = { id: Date.now(), x, y }
    setRipples(prev => [...prev, newRipple])

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id))
    }, 600)

    onClick?.()
  }

  const baseClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground"
  }

  const sizeClasses = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base"
  }

  return (
    <motion.button
      onClick={handleClick}
      className={cn(
        "relative overflow-hidden rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        baseClasses[variant],
        sizeClasses[size],
        className
      )}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
    >
      {children}
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute bg-white/30 rounded-full pointer-events-none"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20
          }}
        />
      ))}
    </motion.button>
  )
}

// Stagger animation for lists
interface StaggeredListProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}

export function StaggeredList({ children, className, staggerDelay = 0.1 }: StaggeredListProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={React.isValidElement(child) ? child.key : index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: index * staggerDelay,
            ease: "easeOut"
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

// Magnetic button effect
interface MagneticButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  strength?: number
}

export function MagneticButton({ children, onClick, className, strength = 0.3 }: MagneticButtonProps) {
  const ref = React.useRef<HTMLButtonElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = (e.clientX - centerX) * strength
    const deltaY = (e.clientY - centerY) * strength

    ref.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`
  }

  const handleMouseLeave = () => {
    if (!ref.current) return
    ref.current.style.transform = "translate(0, 0)"
  }

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative transition-transform duration-200 ease-out",
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  )
}

// Pulse animation for notifications
interface PulseProps {
  children: React.ReactNode
  className?: string
  pulse?: boolean
}

export function Pulse({ children, className, pulse = true }: PulseProps) {
  return (
    <motion.div
      className={className}
      animate={pulse ? {
        scale: [1, 1.05, 1],
        opacity: [1, 0.8, 1]
      } : {}}
      transition={{
        duration: 2,
        repeat: pulse ? Infinity : 0,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  )
}

// Floating label input
interface FloatingLabelInputProps {
  label: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  type?: string
  className?: string
}

export function FloatingLabelInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  className
}: FloatingLabelInputProps) {
  const [focused, setFocused] = React.useState(false)
  const [hasValue, setHasValue] = React.useState(!!value)

  const handleFocus = () => setFocused(true)
  const handleBlur = () => setFocused(false)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0)
    onChange?.(e.target.value)
  }

  return (
    <div className={cn("relative", className)}>
      <input
        type={type}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={cn(
          "peer w-full rounded-md border border-input bg-background px-3 pt-6 pb-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          focused && "border-primary"
        )}
      />
      <motion.label
        animate={{
          y: (focused || hasValue) ? -8 : 0,
          scale: (focused || hasValue) ? 0.85 : 1
        }}
        transition={{ duration: 0.2 }}
        className="absolute left-3 top-3 text-sm text-muted-foreground pointer-events-none bg-background px-1"
      >
        {label}
      </motion.label>
    </div>
  )
}
