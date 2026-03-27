"use client"

import Link from "next/link"
import { Bell, MessageSquare, Plus, Search } from "lucide-react"

import { NavbarUser } from "@/components/navbar-user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Navbar() {
  const user = {
    name: "User",
    email: "user@example.com",
    avatar: "/avatars/user.jpg",
  };

  return (
    <div className="flex w-full items-center gap-3 px-4">
      <Link href="/creator" className="flex items-center gap-3 text-white">
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600">
          <span className="text-lg font-bold text-white">F</span>
        </div>
        <div className="hidden flex-col text-left leading-tight sm:flex">
          <span className="text-sm font-semibold">FREEXIT</span>
          <span className="text-xs text-white/60">Dropshipping Platform</span>
        </div>
      </Link>

      <div className="flex flex-1 justify-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/50" />
          <Input
            placeholder="Search or type a command"
            className="h-9 w-full rounded-lg border-white/10 bg-white/5 pl-9 text-sm text-white placeholder:text-white/50 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 rounded-md border-white/20 bg-transparent px-3 text-sm text-white hover:bg-white/10 hover:text-white"
        >
          <Plus className="mr-1.5 size-4" />
          Add product
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 rounded-md text-white/80 hover:bg-white/10 hover:text-white"
          aria-label="Messages"
        >
          <MessageSquare className="size-4" />
          <span className="absolute right-1 top-1 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
          </span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 rounded-md text-white/80 hover:bg-white/10 hover:text-white"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
        </Button>

        <NavbarUser user={user} />
      </div>
    </div>
  )
}
