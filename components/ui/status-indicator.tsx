"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { CheckCircle, AlertCircle, XCircle, Loader2, Wifi, WifiOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatusIndicatorProps {
  status: "online" | "offline" | "loading" | "success" | "warning" | "error"
  text?: string
  size?: "sm" | "md" | "lg"
  showIcon?: boolean
  animated?: boolean
  className?: string
}

const statusConfig = {
  online: {
    icon: Wifi,
    color: "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20",
    pulseColor: "bg-green-500"
  },
  offline: {
    icon: WifiOff,
    color: "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20",
    pulseColor: "bg-gray-500"
  },
  loading: {
    icon: Loader2,
    color: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20",
    pulseColor: "bg-blue-500"
  },
  success: {
    icon: CheckCircle,
    color: "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20",
    pulseColor: "bg-green-500"
  },
  warning: {
    icon: AlertCircle,
    color: "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20",
    pulseColor: "bg-yellow-500"
  },
  error: {
    icon: XCircle,
    color: "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20",
    pulseColor: "bg-red-500"
  }
}

const sizeConfig = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6"
}

export function StatusIndicator({
  status,
  text,
  size = "md",
  showIcon = true,
  animated = false,
  className
}: StatusIndicatorProps) {
  const config = statusConfig[status]
  const Icon = config.icon
  const sizeClass = sizeConfig[size]

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showIcon && (
        <div className="relative">
          <motion.div
            className={cn(
              "flex items-center justify-center rounded-full p-1",
              config.color,
              sizeClass
            )}
            animate={animated ? {
              scale: [1, 1.1, 1],
              opacity: [1, 0.7, 1]
            } : {}}
            transition={{
              duration: 2,
              repeat: animated ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            <Icon className="h-full w-full" />
          </motion.div>
          
          {/* Pulsing dot for live status */}
          {(status === "online" || status === "loading") && (
            <motion.div
              className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background"
              style={{ backgroundColor: config.pulseColor }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </div>
      )}
      
      {text && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="text-sm font-medium"
        >
          {text}
        </motion.span>
      )}
    </div>
  )
}

// Connection status bar
interface ConnectionStatusBarProps {
  status: "online" | "offline" | "connecting"
  latency?: number
  className?: string
}

export function ConnectionStatusBar({ 
  status, 
  latency, 
  className 
}: ConnectionStatusBarProps) {
  const getStatusText = () => {
    switch (status) {
      case "online": return latency ? `${latency}ms` : "Connected"
      case "offline": return "Offline"
      case "connecting": return "Connecting..."
      default: return "Unknown"
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "online": return latency && latency > 200 ? "text-yellow-600" : "text-green-600"
      case "offline": return "text-red-600"
      case "connecting": return "text-blue-600"
      default: return "text-gray-600"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm shadow-sm",
        className
      )}
    >
      <StatusIndicator 
        status={status === "connecting" ? "loading" : status}
        size="sm"
        animated={status === "connecting"}
      />
      <span className={getStatusColor()}>
        {getStatusText()}
      </span>
      {status === "online" && latency && (
        <div className="flex items-center gap-1">
          <div className={cn(
            "h-1 w-8 rounded-full",
            latency < 50 ? "bg-green-500" :
            latency < 150 ? "bg-yellow-500" : "bg-red-500"
          )} />
          <span className="text-xs text-muted-foreground">
            {latency < 50 ? "Excellent" :
             latency < 150 ? "Good" : "Poor"}
          </span>
        </div>
      )}
    </motion.div>
  )
}
