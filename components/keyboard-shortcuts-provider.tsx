"use client"

import * as React from "react"
import { useKeyboardShortcuts, defaultShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { KeyboardShortcutsHelp } from "@/components/keyboard-shortcuts-help"
import { toast } from "sonner"

interface KeyboardShortcutsProviderProps {
  children: React.ReactNode
}

export function KeyboardShortcutsProvider({ children }: KeyboardShortcutsProviderProps) {
  const [showHelp, setShowHelp] = React.useState(false)

  // Enhanced shortcuts with toast notifications
  const enhancedShortcuts = React.useMemo(() => ({
    ...defaultShortcuts,
    '⌘+d': {
      ...defaultShortcuts['⌘+d'],
      action: () => {
        const event = new CustomEvent('duplicate-current-item')
        document.dispatchEvent(event)
        toast.success('Duplicate action triggered')
      }
    },
    '⌘+e': {
      ...defaultShortcuts['⌘+e'],
      action: () => {
        const event = new CustomEvent('edit-current-item')
        document.dispatchEvent(event)
        toast.info('Edit mode activated')
      }
    },
    '⌘+s': {
      ...defaultShortcuts['⌘+s'],
      action: () => {
        const event = new CustomEvent('save-current-form')
        document.dispatchEvent(event)
        toast.success('Saved successfully')
      }
    },
    '⌘+p': {
      ...defaultShortcuts['⌘+p'],
      action: () => {
        const event = new CustomEvent('print-share')
        document.dispatchEvent(event)
        toast.info('Print/Share dialog opened')
      }
    }
  }), [])

  useKeyboardShortcuts(enhancedShortcuts)

  // Listen for keyboard help event
  React.useEffect(() => {
    const handleShowHelp = () => setShowHelp(true)
    document.addEventListener('show-keyboard-help', handleShowHelp)
    return () => document.removeEventListener('show-keyboard-help', handleShowHelp)
  }, [])

  // Listen for close modals event
  React.useEffect(() => {
    const handleCloseModals = () => {
      // Close any open modals, drawers, or dialogs
      const modals = document.querySelectorAll('[role="dialog"]')
      modals.forEach(modal => {
        const closeButton = modal.querySelector('button[aria-label="Close"], button[data-state="open"]') as HTMLButtonElement
        closeButton?.click()
      })
      setShowHelp(false)
    }
    document.addEventListener('close-modals', handleCloseModals)
    return () => document.removeEventListener('close-modals', handleCloseModals)
  }, [])

  return (
    <>
      {children}
      <KeyboardShortcutsHelp isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </>
  )
}
