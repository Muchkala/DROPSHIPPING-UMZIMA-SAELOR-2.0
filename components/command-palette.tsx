"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, Package, ShoppingCart, Users, Settings, BarChart3, MessageSquare, Target, Headphones, Plus, Edit, Copy, Save, Share, Keyboard } from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Command } from "@/components/ui/command"
import { defaultShortcuts } from "@/hooks/use-keyboard-shortcuts"

const commands = [
  {
    id: "dashboard",
    title: "Go to Dashboard",
    icon: BarChart3,
    shortcut: "⌘+G",
    action: "/creator"
  },
  {
    id: "products",
    title: "Manage Products",
    icon: Package,
    shortcut: "⌘+P",
    action: "/creator/products"
  },
  {
    id: "orders",
    title: "View Orders",
    icon: ShoppingCart,
    shortcut: "⌘+O",
    action: "/creator/orders"
  },
  {
    id: "marketing",
    title: "Marketing Tools",
    icon: Target,
    shortcut: "⌘+M",
    action: "/creator/marketing"
  },
  {
    id: "support",
    title: "Customer Support",
    icon: Headphones,
    shortcut: "⌘+T",
    action: "/creator/support"
  },
  {
    id: "profile",
    title: "Profile Settings",
    icon: Settings,
    shortcut: "⌘+,",
    action: "/creator/profile"
  },
  {
    id: "create-product",
    title: "Create New Product",
    icon: Plus,
    shortcut: "⌘+N",
    action: "/creator/products?create=true"
  },
  {
    id: "duplicate-current",
    title: "Duplicate Current Item",
    icon: Copy,
    shortcut: "⌘+D",
    action: "duplicate-current"
  },
  {
    id: "edit-current",
    title: "Edit Current Item",
    icon: Edit,
    shortcut: "⌘+E",
    action: "edit-current"
  },
  {
    id: "save-current",
    title: "Save Current Form",
    icon: Save,
    shortcut: "⌘+S",
    action: "save-current"
  },
  {
    id: "print-share",
    title: "Print or Share",
    icon: Share,
    shortcut: "⌘+P",
    action: "print-share"
  },
  {
    id: "keyboard-help",
    title: "Show Keyboard Shortcuts",
    icon: Keyboard,
    shortcut: "?",
    action: "keyboard-help"
  }
]

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        e.preventDefault()
        setOpen(open => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  // Listen for custom events from keyboard shortcuts
  React.useEffect(() => {
    const handleToggle = () => setOpen(true)
    document.addEventListener('toggle-command-palette', handleToggle)
    return () => document.removeEventListener('toggle-command-palette', handleToggle)
  }, [])

  const runCommand = React.useCallback((command: typeof commands[0]) => {
    if (command.action === "keyboard-help") {
      const event = new CustomEvent('show-keyboard-help')
      document.dispatchEvent(event)
    } else if (command.action.startsWith("duplicate-") || command.action.startsWith("edit-") || command.action.startsWith("save-") || command.action.startsWith("print-")) {
      // Dispatch custom events for these actions
      const event = new CustomEvent(command.action)
      document.dispatchEvent(event)
    } else {
      router.push(command.action)
    }
    setOpen(false)
  }, [router])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 overflow-hidden">
        <DialogHeader className="border-b px-4 pb-3 pt-4">
          <DialogTitle className="text-lg font-semibold">Command Palette</DialogTitle>
        </DialogHeader>
        <Command className="rounded-lg border shadow-md">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              placeholder="Type a command or search..."
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="p-2">
            {commands.map((command) => {
              const Icon = command.icon
              return (
                <div
                  key={command.id}
                  className="flex items-center gap-2 rounded-sm px-2 py-2 hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => runCommand(command)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <span className="flex-1">{command.title}</span>
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    {command.shortcut}
                  </kbd>
                </div>
              )
            })}
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
