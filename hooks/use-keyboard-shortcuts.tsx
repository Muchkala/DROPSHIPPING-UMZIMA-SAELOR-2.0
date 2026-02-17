"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

interface ShortcutConfig {
  [key: string]: {
    description: string
    action: () => void
    global?: boolean
  }
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig) {
  const router = useRouter()

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Build the shortcut key string
      const parts: string[] = []
      
      if (e.metaKey || e.ctrlKey) parts.push('⌘')
      if (e.shiftKey) parts.push('⇧')
      if (e.altKey) parts.push('⌥')
      
      // Handle special keys
      let key = e.key.toLowerCase()
      if (key === 'escape') key = 'esc'
      if (key === ' ') key = 'space'
      if (key === 'arrowup') key = '↑'
      if (key === 'arrowdown') key = '↓'
      if (key === 'arrowleft') key = '←'
      if (key === 'arrowright') key = '→'
      
      parts.push(key)
      const shortcut = parts.join('+')

      // Find matching shortcut
      const matchedShortcut = Object.entries(shortcuts).find(([k]) => 
        k.toLowerCase() === shortcut.toLowerCase()
      )

      if (matchedShortcut) {
        const [_, config] = matchedShortcut
        e.preventDefault()
        e.stopPropagation()
        config.action()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts, router])
}

// Default shortcuts for the entire app
export const defaultShortcuts = {
  '⌘+k': {
    description: 'Command Palette',
    action: () => {
      // This will be handled by the command palette component
      const event = new CustomEvent('toggle-command-palette')
      document.dispatchEvent(event)
    },
    global: true
  },
  '⌘+/': {
    description: 'Quick Search',
    action: () => {
      const searchInput = document.querySelector('input[type="search"], input[placeholder*="search"]') as HTMLInputElement
      searchInput?.focus()
    },
    global: true
  },
  '⌘+n': {
    description: 'New Product',
    action: () => {
      window.location.href = '/creator/products?create=true'
    },
    global: true
  },
  '⌘+d': {
    description: 'Duplicate Current',
    action: () => {
      const event = new CustomEvent('duplicate-current-item')
      document.dispatchEvent(event)
    },
    global: true
  },
  '⌘+e': {
    description: 'Edit Current',
    action: () => {
      const event = new CustomEvent('edit-current-item')
      document.dispatchEvent(event)
    },
    global: true
  },
  '⌘+s': {
    description: 'Save',
    action: () => {
      const event = new CustomEvent('save-current-form')
      document.dispatchEvent(event)
    },
    global: true
  },
  '⌘+p': {
    description: 'Print/Share',
    action: () => {
      const event = new CustomEvent('print-share')
      document.dispatchEvent(event)
    },
    global: true
  },
  'esc': {
    description: 'Close Modal/Drawer',
    action: () => {
      const event = new CustomEvent('close-modals')
      document.dispatchEvent(event)
    },
    global: true
  },
  '⌘+g': {
    description: 'Go to Dashboard',
    action: () => {
      window.location.href = '/creator'
    },
    global: true
  },
  '⌘+o': {
    description: 'Go to Orders',
    action: () => {
      window.location.href = '/creator/orders'
    },
    global: true
  },
  '⌘+m': {
    description: 'Go to Marketing',
    action: () => {
      window.location.href = '/creator/marketing'
    },
    global: true
  },
  '⌘+t': {
    description: 'Go to Support',
    action: () => {
      window.location.href = '/creator/support'
    },
    global: true
  }
}
