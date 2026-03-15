"use client"

import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { User, Settings, LogOut, Keyboard } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { CommandPalette } from "@/components/command-palette"

export function NavbarUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  return (
    <>
      <CommandPalette />
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-md hover:bg-accent transition-all duration-200"
          onClick={() => {
            const event = new CustomEvent('show-keyboard-help')
            document.dispatchEvent(event)
          }}
          title="Keyboard Shortcuts (?)"
        >
          <Keyboard className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-md hover:bg-accent transition-all duration-200"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-gradient-to-br from-primary to-primary/90 text-primary-foreground text-base font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{user.name}</p>
                <p className="w-[200px] truncate text-sm text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/creator/profile" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Profile Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/creator" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="h-4 w-4 mr-2" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}
