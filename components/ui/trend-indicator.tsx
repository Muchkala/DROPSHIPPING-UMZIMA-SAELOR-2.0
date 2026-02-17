"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface TrendIndicatorProps {
  value: number
  previousValue: number
  showPercentage?: boolean
  className?: string
}

export function TrendIndicator({ 
  value, 
  previousValue, 
  showPercentage = true,
  className = "" 
}: TrendIndicatorProps) {
  const change = value - previousValue
  const changePercent = previousValue > 0 ? (change / previousValue) * 100 : 0
  const isPositive = change > 0
  const isNeutral = change === 0

  const TrendIcon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown
  const trendColor = isNeutral ? "text-muted-foreground" : isPositive ? "text-green-600" : "text-red-600"

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("flex items-center gap-1 text-sm", trendColor, className)}
    >
      <TrendIcon className="h-3 w-3" />
      <span className="font-medium">
        {showPercentage && (
          <>
            {isPositive && "+"}{changePercent.toFixed(1)}%
          </>
        )}
      </span>
    </motion.div>
  )
}
