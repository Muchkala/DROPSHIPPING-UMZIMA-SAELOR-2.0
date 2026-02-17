"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Keyboard, X, Command } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { defaultShortcuts } from "@/hooks/use-keyboard-shortcuts"

interface KeyboardShortcutsHelpProps {
  isOpen: boolean
  onClose: () => void
}

export function KeyboardShortcutsHelp({ isOpen, onClose }: KeyboardShortcutsHelpProps) {
  const shortcuts = React.useMemo(() => {
    return Object.entries(defaultShortcuts)
      .filter(([_, config]) => config.global)
      .sort(([a], [b]) => a.localeCompare(b))
  }, [])

  const formatShortcut = (shortcut: string) => {
    return shortcut.split('+').map(part => {
      switch(part) {
        case '⌘': return <kbd key="cmd" className="px-2 py-1 text-xs bg-muted rounded border">⌘</kbd>
        case '⇧': return <kbd key="shift" className="px-2 py-1 text-xs bg-muted rounded border">⇧</kbd>
        case '⌥': return <kbd key="alt" className="px-2 py-1 text-xs bg-muted rounded border">⌥</kbd>
        case 'esc': return <kbd key="esc" className="px-2 py-1 text-xs bg-muted rounded border">ESC</kbd>
        case 'space': return <kbd key="space" className="px-2 py-1 text-xs bg-muted rounded border">SPACE</kbd>
        case '↑': return <kbd key="up" className="px-2 py-1 text-xs bg-muted rounded border">↑</kbd>
        case '↓': return <kbd key="down" className="px-2 py-1 text-xs bg-muted rounded border">↓</kbd>
        case '←': return <kbd key="left" className="px-2 py-1 text-xs bg-muted rounded border">←</kbd>
        case '→': return <kbd key="right" className="px-2 py-1 text-xs bg-muted rounded border">→</kbd>
        default: return <kbd key={part} className="px-2 py-1 text-xs bg-muted rounded border">{part.toUpperCase()}</kbd>
      }
    }).reduce((acc, curr, index) => {
      if (index === 0) return [curr]
      return [...acc, <span key={`plus-${index}`} className="mx-1">+</span>, curr]
    }, [] as React.ReactNode[])
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Keyboard className="h-5 w-5" />
                Keyboard Shortcuts
              </DialogTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </DialogHeader>

            <div className="space-y-6">
              <div className="text-sm text-muted-foreground">
                Navigate FREEXIT like a pro with these keyboard shortcuts. Press <kbd className="px-2 py-1 text-xs bg-muted rounded border">⌘</kbd> on Mac or <kbd className="px-2 py-1 text-xs bg-muted rounded border">Ctrl</kbd> on Windows.
              </div>

              <div className="grid gap-4">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground">Navigation</h3>
                  <div className="space-y-2">
                    {shortcuts
                      .filter(([_, config]) => config.description.includes('Go to'))
                      .map(([shortcut, config]) => (
                        <motion.div
                          key={shortcut}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * shortcuts.indexOf([shortcut, config] as [string, any]) }}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <span className="text-sm">{config.description}</span>
                          <div className="flex items-center gap-1">
                            {formatShortcut(shortcut)}
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground">Actions</h3>
                  <div className="space-y-2">
                    {shortcuts
                      .filter(([_, config]) => !config.description.includes('Go to'))
                      .map(([shortcut, config]) => (
                        <motion.div
                          key={shortcut}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * shortcuts.indexOf([shortcut, config] as [string, any]) }}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <span className="text-sm">{config.description}</span>
                          <div className="flex items-center gap-1">
                            {formatShortcut(shortcut)}
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    <Badge variant="secondary" className="mb-2">Pro Tip</Badge>
                    <p className="text-xs">Press <kbd className="px-1 py-0.5 text-xs bg-muted rounded border">⌘K</kbd> anytime to open the command palette for quick access to all features.</p>
                  </div>
                  <Button variant="outline" onClick={onClose}>
                    Got it!
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
