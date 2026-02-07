"use client"

import * as React from "react"
import { BarChart3, Package, MessageSquare } from "lucide-react"
import { usePathname } from "next/navigation"

import { NavMain } from "@/components/nav-main"
import { TeamSwitcher } from "./team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  const productContext = React.useMemo(() => {
    const segments = pathname.split("/").filter(Boolean)
    if (segments[0] !== "creator") return null
    if (segments[1] !== "products") return null
    const productId = segments[2]
    if (!productId) return null
    return { productId }
  }, [pathname])
  
  const data = {
    navMain: productContext
      ? [
          {
            title: "Product",
            url: `/creator/products/${productContext.productId}`,
            icon: Package,
          },
          {
            title: "Comments",
            url: `/creator/products/${productContext.productId}/comments`,
            icon: MessageSquare,
          },
        ]
      : [
          {
            title: "Dashboard",
            url: "/creator",
            icon: BarChart3,
            isActive: pathname === "/creator",
          },
          {
            title: "Products",
            url: "/creator/products",
            icon: Package,
            isActive: pathname.startsWith("/creator/products"),
          },
        ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="p-2">
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} label={productContext ? "" : "Creator"} />
      </SidebarContent>
    </Sidebar>
  )
}
