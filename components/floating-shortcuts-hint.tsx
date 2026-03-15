"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Keyboard, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function FloatingShortcutsHint() {
  const [isVisible, setIsVisible] = React.useState(true)
  const [dismissed, setDismissed] = React.useState(false)

  React.useEffect(() => {
    // Check if user has dismissed this hint before
    const wasDismissed = localStorage.getItem('shortcuts-hint-dismissed')
    if (wasDismissed) {
      setDismissed(true)
      setIsVisible(false)
    }

    // Hide after 10 seconds
    const timer = setTimeout(() => {
      if (!dismissed) {
        setIsVisible(false)
      }
    }, 10000)

    return () => clearTimeout(timer)
  }, [dismissed])

  const handleDismiss = () => {
    setIsVisible(false)
    setDismissed(true)
    localStorage.setItem('shortcuts-hint-dismissed', 'true')
  }

  const handleShowHelp = () => {
    const event = new CustomEvent('show-keyboard-help')
    document.dispatchEvent(event)
    setIsVisible(false)
  }

  if (dismissed) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm"
        >
          <div className="bg-background border border-border rounded-lg shadow-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Keyboard className="h-4 w-4 text-primary" />
                <h4 className="text-sm font-semibold">Keyboard Shortcuts</h4>
                <Badge variant="secondary" className="text-xs">New</Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 -mt-1 -mr-1"
                onClick={handleDismiss}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>Navigate FREEXIT like a pro with keyboard shortcuts:</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded border">⌘K</kbd>
                  <span>Command palette</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded border">⌘N</kbd>
                  <span>New product</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded border">⌘S</kbd>
                  <span>Save</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" onClick={handleShowHelp} className="flex-1">
                View All Shortcuts
              </Button>
              <Button size="sm" variant="outline" onClick={handleDismiss}>
                Dismiss
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
