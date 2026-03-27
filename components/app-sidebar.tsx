"use client"

import { Tag, Users, Store, Wallet, Percent, Home, Sun, Moon } from "lucide-react"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar"

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="m-3 flex rounded-full bg-gray-200 p-1 dark:bg-gray-800">
      <button
        onClick={() => setTheme("light")}
        className={`flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-all ${
          theme === "light"
            ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
            : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
        }`}
      >
        <Sun className="size-4" />
        <span>Light</span>
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-all ${
          theme === "dark"
            ? "bg-gray-700 text-white shadow-sm"
            : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
        }`}
      >
        <Moon className="size-4" />
        <span>Dark</span>
      </button>
    </div>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: "/creator",
        icon: Home,
        isActive: pathname === "/creator",
      },
      {
        title: "Product",
        url: "/creator/products",
        icon: Tag,
        isActive: pathname.startsWith("/creator/products"),
        items: [
          { title: "Analytics", url: "/creator/products/analytics" },
          { title: "Drafts", url: "/creator/products/drafts" },
          { title: "Released", url: "/creator/products/released" },
          { title: "Comments", url: "/creator/products/comments" },
          { title: "Scheduled", url: "/creator/products/scheduled", badge: "6" },
        ],
      },
      {
        title: "Customers",
        url: "/creator/customers",
        icon: Users,
        isActive: pathname === "/creator/customers",
      },
      {
        title: "Store",
        url: "/creator/store",
        icon: Store,
        isActive: pathname === "/creator/store",
      },
      {
        title: "Revenue",
        url: "/creator/revenue",
        icon: Wallet,
        isActive: pathname === "/creator/revenue",
      },
      {
        title: "Discount",
        url: "/creator/discount",
        icon: Percent,
        isActive: pathname === "/creator/discount",
      },
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent className="gap-0">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="border-t border-gray-200 p-0">
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  )
}
