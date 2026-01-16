"use client"

import * as React from "react"
import { Home, Info, FileText, Archive, Mail } from "lucide-react"
import { usePathname } from "next/navigation"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "./team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  
  const data = {
    user: {
      name: "User",
      email: "user@example.com",
      avatar: "/avatars/user.jpg",
    },
    navMain: [
      {
        title: "Home",
        url: "/",
        icon: Home,
        isActive: pathname === "/",
      },
      {
        title: "About",
        url: "/about",
        icon: Info,
      },
      {
        title: "Products",
        url: "/blogs",
        icon: FileText,
      },
      {
        title: "Archive",
        url: "/archive",
        icon: Archive,
      },
      {
        title: "Contact",
        url: "/contact",
        icon: Mail,
      },
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="p-2">
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
