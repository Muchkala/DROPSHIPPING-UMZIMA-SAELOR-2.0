"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ProgressRingProps {
  value: number
  size?: number
  strokeWidth?: number
  className?: string
  color?: string
  backgroundColor?: string
  showPercentage?: boolean
  animated?: boolean
}

export function ProgressRing({
  value,
  size = 120,
  strokeWidth = 8,
  className,
  color = "hsl(var(--primary))",
  backgroundColor = "hsl(var(--muted))",
  showPercentage = true,
  animated = true
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  return (
    <div 
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: animated ? 1 : 0, ease: "easeInOut" }}
          strokeLinecap="round"
        />
      </svg>
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm font-medium"
          >
            {Math.round(value)}%
          </motion.span>
        </div>
      )}
    </div>
  )
}
