"use client"

import Link from "next/link"
import { Bell, MessageSquare, Plus, Search, Star, Heart, MessageCircle, ShoppingCart, MoreHorizontal } from "lucide-react"

import { NavbarUser } from "@/components/navbar-user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const notifications = [
  {
    id: 1,
    name: "Kristin Watson",
    secondary: "alexander",
    action: "Rate",
    actionIcon: Star,
    actionColor: "text-yellow-500",
    target: "5 for 3D soothing wallpaper...",
    date: "Jun 23",
    avatar: "https://i.pravatar.cc/150?u=1",
    unread: true,
  },
  {
    id: 2,
    name: "Leslie Alexander",
    secondary: "flores",
    action: "Likes",
    actionIcon: Heart,
    actionColor: "text-red-500",
    target: "3D computer improved version",
    date: "Aug 15",
    avatar: "https://i.pravatar.cc/150?u=2",
    unread: false,
  },
  {
    id: 3,
    name: "Annette Black",
    secondary: "edwards",
    action: "Comment on",
    actionIcon: MessageCircle,
    actionColor: "text-blue-500",
    target: "Gray vintage 3D computer",
    date: "Apr 11",
    avatar: "https://i.pravatar.cc/150?u=3",
    unread: false,
  },
  {
    id: 4,
    name: "Brooklyn Simmons",
    secondary: "cooper",
    action: "Purchased",
    actionIcon: ShoppingCart,
    actionColor: "text-green-500",
    target: "3D dark mode wallpaper",
    date: "Nov 10",
    avatar: "https://i.pravatar.cc/150?u=4",
    unread: true,
  },
  {
    id: 5,
    name: "Kristin Watson",
    secondary: "alexander",
    action: "Rate",
    actionIcon: Star,
    actionColor: "text-yellow-500",
    target: "5 for 3D soothing wallpaper...",
    date: "Jun 23",
    avatar: "https://i.pravatar.cc/150?u=1",
    unread: true,
  },
]

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
          asChild
        >
          <Link href="/creator/products">
            <Plus className="mr-1.5 size-4" />
            Add product
          </Link>
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 rounded-md text-white/80 hover:bg-white/10 hover:text-white"
              aria-label="Notifications"
            >
              <Bell className="size-4" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 bg-white p-0" align="end" forceMount sideOffset={8}>
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <h3 className="text-base font-semibold text-gray-900">Notification</h3>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700">
                <MoreHorizontal className="size-4" />
              </Button>
            </div>
            <div className="scrollbar-thin max-h-[400px] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db transparent' }}>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-3 border-b border-gray-100 px-4 py-3 hover:bg-gray-50"
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={notification.avatar}
                      alt={notification.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className={`absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white ${notification.actionColor}`}>
                      <notification.actionIcon className="size-3" fill="currentColor" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <p className="text-sm text-gray-900">
                        <span className="font-semibold">{notification.name}</span>{" "}
                        <span className="text-gray-500">{notification.secondary}</span>
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{notification.date}</span>
                        {notification.unread ? (
                          <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-gray-300"></span>
                        )}
                      </div>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-600">
                      {notification.action}{" "}
                      <span className="inline-flex items-center">
                        <notification.actionIcon className={`mr-0.5 size-3 ${notification.actionColor}`} fill="currentColor" />
                      </span>
                      <span className="text-gray-900">{notification.target}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 p-3">
              <Button className="w-full rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white hover:bg-gray-800">
                See all notifications
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <NavbarUser user={user} />
      </div>
    </div>
  )
}
