"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Package, 
  ShoppingCart, 
  Users, 
  MessageSquare, 
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ActivityItem {
  id: string
  type: "product" | "order" | "customer" | "review" | "system"
  title: string
  description: string
  timestamp: Date
  status: "success" | "warning" | "error" | "info"
  metadata?: Record<string, any>
}

interface ActivityTimelineProps {
  activities: ActivityItem[]
  className?: string
  maxItems?: number
}

const activityIcons = {
  product: Package,
  order: ShoppingCart,
  customer: Users,
  review: Star,
  system: AlertCircle
}

const statusColors = {
  success: "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20",
  warning: "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20",
  error: "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20",
  info: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20"
}

export function ActivityTimeline({ 
  activities, 
  className,
  maxItems = 10 
}: ActivityTimelineProps) {
  const [expanded, setExpanded] = React.useState<string[]>([])

  const toggleExpanded = (id: string) => {
    setExpanded(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    return 'Just now'
  }

  const displayedActivities = activities.slice(0, maxItems)

  return (
    <div className={cn("space-y-4", className)}>
      <AnimatePresence>
        {displayedActivities.map((activity, index) => {
          const Icon = activityIcons[activity.type]
          const isExpanded = expanded.includes(activity.id)
          
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="relative"
            >
              {/* Timeline line */}
              {index < displayedActivities.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-16 bg-border" />
              )}
              
              <div className="flex gap-4">
                {/* Activity indicator */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.05 + 0.1 }}
                  className={cn(
                    "relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-background shadow-sm",
                    statusColors[activity.status]
                  )}
                >
                  <Icon className="h-5 w-5" />
                </motion.div>

                {/* Activity content */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 + 0.2 }}
                  className="flex-1 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTime(activity.timestamp)}
                      </span>
                      {activity.metadata && (
                        <button
                          onClick={() => toggleExpanded(activity.id)}
                          className="text-xs text-primary hover:underline"
                        >
                          {isExpanded ? 'Show less' : 'Show more'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expandable metadata */}
                  <AnimatePresence>
                    {isExpanded && activity.metadata && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="rounded-md bg-muted/50 p-3 text-xs">
                          {Object.entries(activity.metadata).map(([key, value]) => (
                            <div key={key} className="flex justify-between py-1">
                              <span className="font-medium capitalize">{key}:</span>
                              <span>{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>

      {activities.length > maxItems && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full text-center text-sm text-primary hover:underline"
          onClick={() => {/* Load more activities */}}
        >
          Load {activities.length - maxItems} more activities
        </motion.button>
      )}
    </div>
  )
}
