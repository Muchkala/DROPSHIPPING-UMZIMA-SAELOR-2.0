"use client"

import { cn } from "@/lib/utils"

// Consistent spacing values
export const spacing = {
  xs: "0.25rem",    // 4px
  sm: "0.5rem",     // 8px
  md: "1rem",       // 16px
  lg: "1.5rem",     // 24px
  xl: "2rem",       // 32px
  "2xl": "3rem",    // 48px
  "3xl": "4rem",    // 64px
}

// Consistent border radius values
export const borderRadius = {
  none: "0",
  sm: "0.125rem",   // 2px
  md: "0.375rem",   // 6px
  lg: "0.5rem",     // 8px
  xl: "0.75rem",    // 12px
  "2xl": "1rem",    // 16px
  full: "9999px",
}

// Consistent shadow levels
export const shadows = {
  none: "none",
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
}

// Consistent transition values
export const transitions = {
  none: "none",
  fast: "150ms ease-in-out",
  normal: "250ms ease-in-out",
  slow: "350ms ease-in-out",
}

// Consistent card styles
export const cardStyles = {
  base: "bg-card text-card-foreground rounded-lg border shadow-sm",
  interactive: "hover:shadow-md transition-shadow duration-200 cursor-pointer",
  elevated: "shadow-lg",
}

// Consistent button sizes
export const buttonSizes = {
  xs: "h-6 px-2 text-xs",
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  xl: "h-14 px-8 text-lg",
}

// Consistent input sizes
export const inputSizes = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-3 text-sm",
  lg: "h-12 px-4 text-base",
}

// Utility function for consistent spacing
export function getSpacing(value: keyof typeof spacing) {
  return spacing[value]
}

// Utility function for consistent border radius
export function getBorderRadius(value: keyof typeof borderRadius) {
  return borderRadius[value]
}

// Utility function for consistent shadows
export function getShadow(value: keyof typeof shadows) {
  return shadows[value]
}

// Utility function for consistent transitions
export function getTransition(value: keyof typeof transitions) {
  return transitions[value]
}

// Consistent layout components
export function ConsistentCard({ 
  children, 
  className, 
  interactive = false,
  elevated = false 
}: { 
  children: React.ReactNode
  className?: string
  interactive?: boolean
  elevated?: boolean
}) {
  return (
    <div className={cn(
      cardStyles.base,
      interactive && cardStyles.interactive,
      elevated && cardStyles.elevated,
      className
    )}>
      {children}
    </div>
  )
}

export function ConsistentSection({ 
  children, 
  className,
  spacing = "lg" 
}: { 
  children: React.ReactNode
  className?: string
  spacing?: keyof typeof spacing
}) {
  return (
    <section 
      className={cn("space-y-4", className)}
      style={{ gap: getSpacing(spacing) }}
    >
      {children}
    </section>
  )
}

export function ConsistentGrid({ 
  children, 
  className,
  cols = 1,
  gap = "md" 
}: { 
  children: React.ReactNode
  className?: string
  cols?: number
  gap?: keyof typeof spacing
}) {
  return (
    <div 
      className={cn("grid", className)}
      style={{ 
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gap: getSpacing(gap)
      }}
    >
      {children}
    </div>
  )
}
