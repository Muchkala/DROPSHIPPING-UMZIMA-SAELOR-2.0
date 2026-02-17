"use client"

import * as React from "react"
import { motion } from "framer-motion"

interface AnimatedCounterProps {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
}

export function AnimatedCounter({ 
  value, 
  duration = 1.5, 
  prefix = "", 
  suffix = "",
  className = "" 
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = React.useState(0)
  const [hasAnimated, setHasAnimated] = React.useState(false)

  React.useEffect(() => {
    if (!hasAnimated) {
      const startTime = Date.now()
      const endTime = startTime + duration * 1000

      const animate = () => {
        const now = Date.now()
        const progress = Math.min((now - startTime) / (duration * 1000), 1)
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        const currentValue = Math.floor(value * easeOutQuart)
        
        setDisplayValue(currentValue)

        if (now < endTime) {
          requestAnimationFrame(animate)
        } else {
          setDisplayValue(value)
          setHasAnimated(true)
        }
      }

      requestAnimationFrame(animate)
    } else {
      setDisplayValue(value)
    }
  }, [value, duration, hasAnimated])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {prefix}{displayValue.toLocaleString()}{suffix}
    </motion.div>
  )
}
